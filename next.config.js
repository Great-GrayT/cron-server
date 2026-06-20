/** @type {import('next').NextConfig} */
const nextConfig = {
  // Server deploy runs `pnpm build` + `pnpm start` on the VPS (see deploy.yml).
  // (Avoid `output: "standalone"` — its trace-copy step needs symlink perms that
  //  Windows blocks during local dev; plain `next start` is portable.)
  reactStrictMode: true,
  poweredByHeader: false,
  // Prisma / fast-xml-parser are Node-only; keep them out of the bundle traces.
  serverExternalPackages: ["@prisma/client", ".prisma/client", "fast-xml-parser"],
};

module.exports = nextConfig;
