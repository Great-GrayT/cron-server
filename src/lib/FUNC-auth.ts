import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

/**
 * Auth primitives — password hashing (scrypt) + stateless JWT (HS256).
 * Uses only Node's crypto, no external deps.
 */

// ---- Password hashing (scrypt) ----

export function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, 64);
  return `scrypt$${salt.toString("hex")}$${hash.toString("hex")}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [scheme, saltHex, hashHex] = stored.split("$");
  if (scheme !== "scrypt" || !saltHex || !hashHex) return false;
  const expected = Buffer.from(hashHex, "hex");
  const actual = scryptSync(password, Buffer.from(saltHex, "hex"), expected.length);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

// ---- JWT (HS256) ----

export interface JwtPayload {
  sub: string; // user id
  email: string;
  role: string;
  ver: number; // token_version at signing time — for stateless revocation
  iat: number;
  exp: number;
}

const b64url = (b: Buffer) => b.toString("base64url");

function secret(): string {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error("JWT_SECRET is not set.");
  return s;
}

// Shorter-lived access token (env-overridable). Shorter TTL bounds the window a
// stolen token is usable; combine with tokenVersion for explicit revocation.
const TOKEN_TTL_SEC = Number(process.env.JWT_TTL_HOURS ?? 72) * 60 * 60;

export function signJwt(claims: { sub: string; email: string; role: string; tokenVersion: number }): string {
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })));
  const payload = b64url(
    Buffer.from(
      JSON.stringify({
        sub: claims.sub,
        email: claims.email,
        role: claims.role,
        ver: claims.tokenVersion,
        iat: now,
        exp: now + TOKEN_TTL_SEC,
      } satisfies JwtPayload),
    ),
  );
  const sig = b64url(createHmac("sha256", secret()).update(`${header}.${payload}`).digest());
  return `${header}.${payload}.${sig}`;
}

export function verifyJwt(token: string): JwtPayload | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [header, payload, sig] = parts;
  const expected = b64url(createHmac("sha256", secret()).update(`${header}.${payload}`).digest());
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as JwtPayload;
    if (decoded.exp < Math.floor(Date.now() / 1000)) return null;
    return decoded;
  } catch {
    return null;
  }
}
