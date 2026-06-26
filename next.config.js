/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone is enabled only for Docker builds (DOCKER_BUILD=1 in the Dockerfile).
  // Local Windows dev avoids it — the trace-copy step needs symlink perms Windows blocks.
  ...(process.env.DOCKER_BUILD === "1" ? { output: "standalone" } : {}),
  reactStrictMode: true,
  poweredByHeader: false,
  // Prisma / fast-xml-parser are Node-only; keep them out of the bundle traces.
  serverExternalPackages: ["@prisma/client", ".prisma/client", "fast-xml-parser"],
};

module.exports = nextConfig;
