import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

/**
 * SSRF guard.
 *
 * Before any outbound fetch we resolve the host to its real IP(s) and reject
 * anything pointing at loopback, link-local, private subnets, or the cloud
 * metadata endpoint. This stops a malicious feed URL from making the server
 * scan or exfiltrate its own internal network.
 */

export class SsrfBlockedError extends Error {
  constructor(reason: string) {
    super(`SSRF guard blocked request: ${reason}`);
    this.name = "SsrfBlockedError";
  }
}

const ALLOWED_PROTOCOLS = new Set(["http:", "https:"]);

/** Parse an IPv4 dotted-quad into a 32-bit integer, or null if not IPv4. */
function ipv4ToInt(ip: string): number | null {
  const parts = ip.split(".");
  if (parts.length !== 4) return null;
  let value = 0;
  for (const part of parts) {
    const octet = Number(part);
    if (!Number.isInteger(octet) || octet < 0 || octet > 255) return null;
    value = (value << 8) + octet;
  }
  return value >>> 0;
}

function inV4Range(ip: number, cidr: string): boolean {
  const [base, bitsRaw] = cidr.split("/");
  const baseInt = ipv4ToInt(base ?? "");
  const bits = Number(bitsRaw);
  if (baseInt === null || !Number.isInteger(bits)) return false;
  const mask = bits === 0 ? 0 : (0xffffffff << (32 - bits)) >>> 0;
  return (ip & mask) === (baseInt & mask);
}

/** Blocked IPv4 ranges (RFC1918 private, loopback, link-local, metadata, CGNAT). */
const BLOCKED_V4 = [
  "0.0.0.0/8",
  "10.0.0.0/8",
  "100.64.0.0/10",
  "127.0.0.0/8",
  "169.254.0.0/16", // includes 169.254.169.254 cloud metadata
  "172.16.0.0/12",
  "192.168.0.0/16",
];

function isBlockedIp(ip: string): boolean {
  const version = isIP(ip);
  if (version === 4) {
    const asInt = ipv4ToInt(ip);
    if (asInt === null) return true; // unparseable -> treat as hostile
    return BLOCKED_V4.some((cidr) => inV4Range(asInt, cidr));
  }
  if (version === 6) {
    const lower = ip.toLowerCase();
    // Loopback, unspecified, unique-local (fc00::/7), link-local (fe80::/10),
    // and IPv4-mapped addresses are all rejected.
    if (lower === "::1" || lower === "::") return true;
    if (lower.startsWith("fc") || lower.startsWith("fd")) return true;
    if (lower.startsWith("fe8") || lower.startsWith("fe9") || lower.startsWith("fea") || lower.startsWith("feb")) {
      return true;
    }
    if (lower.startsWith("::ffff:")) {
      const mapped = lower.slice("::ffff:".length);
      return isBlockedIp(mapped);
    }
    return false;
  }
  return true; // not a valid IP literal
}

/**
 * Validate a URL is safe to fetch. Resolves DNS and checks every returned IP.
 * Returns the validated URL or throws SsrfBlockedError.
 */
export async function assertUrlIsSafe(rawUrl: string): Promise<URL> {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    throw new SsrfBlockedError("malformed URL");
  }

  if (!ALLOWED_PROTOCOLS.has(url.protocol)) {
    throw new SsrfBlockedError(`disallowed protocol ${url.protocol}`);
  }

  const host = url.hostname;

  // If the host is already an IP literal, check it directly (skip DNS).
  if (isIP(host)) {
    if (isBlockedIp(host)) throw new SsrfBlockedError(`blocked IP literal ${host}`);
    return url;
  }

  // Resolve ALL addresses; a hostile host could return a public + private pair.
  const records = await lookup(host, { all: true });
  if (records.length === 0) throw new SsrfBlockedError(`DNS returned no records for ${host}`);
  for (const { address } of records) {
    if (isBlockedIp(address)) {
      throw new SsrfBlockedError(`host ${host} resolves to blocked address ${address}`);
    }
  }

  return url;
}
