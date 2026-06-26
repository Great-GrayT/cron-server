FROM node:22-slim AS base
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
# Hoist deps so Prisma generates into node_modules/.prisma (pnpm isolated layout hides it).
RUN echo "node-linker=hoisted" > .npmrc
# postinstall runs `prisma generate`; schema is not copied until the builder stage
RUN pnpm install --frozen-lockfile --ignore-scripts

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/.npmrc ./.npmrc
COPY . .
# Next.js expects public/; this API-only app has no static assets yet.
RUN mkdir -p public
ENV DOCKER_BUILD=1
ENV NEXT_TELEMETRY_DISABLED=1
# Build does not need a real DB; a placeholder satisfies Prisma config parsing.
ENV DATABASE_URL=postgresql://placeholder:placeholder@localhost:5432/placeholder
RUN pnpm build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 --ingroup nodejs nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
# Prisma CLI + schema for `docker compose run --rm app … migrate deploy`.
# pnpm scatters Prisma's engine packages (@prisma/engines, @prisma/get-platform, …)
# across node_modules/.pnpm, so cherry-picking @prisma + prisma misses them and the
# CLI can't resolve its engines. Copy the whole tree the builder already resolved —
# it also carries the client generated during `pnpm build`, so no regenerate is needed.
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
