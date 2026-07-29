# syntax=docker/dockerfile:1

# --- Base ---
FROM node:26-alpine AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# --- Dependencies ---
FROM base AS deps
COPY package.json package-lock.json* ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci

# --- Development (hot-reload) ---
FROM deps AS development
# Match the host user so files written into the bind mount stay host-owned.
# Docker seeds anonymous volumes with the image directory's ownership, so
# chowning here is what keeps /app/node_modules and /app/.next writable.
ARG UID=1001
ARG GID=1001
ENV NODE_ENV=development
ENV HOME=/tmp
RUN mkdir -p /app/.next && chown -R ${UID}:${GID} /app
USER ${UID}:${GID}
EXPOSE 3000
CMD ["npm", "run", "dev"]

# --- Tools (provisioning CLIs) ---
# Debian, not Alpine: the Turso CLI ships glibc builds. This stage is never
# deployed — it exists so `turso` and `vercel` are pinned in the project rather
# than installed by hand on somebody's laptop.
FROM node:26-bookworm-slim AS tools
ARG UID=1001
ARG GID=1001
ARG VERCEL_CLI_VERSION=48.11.0
ARG TURSO_CLI_VERSION=1.0.31
ARG TARGETARCH
ENV HOME=/home/dev

RUN apt-get update && \
    apt-get install -y --no-install-recommends ca-certificates curl bash git jq && \
    rm -rf /var/lib/apt/lists/*

RUN npm install -g vercel@${VERCEL_CLI_VERSION}

# Installed from the pinned release tarball rather than `curl … | bash`: the
# get.tur.so installer 404s as of 2026-07, and it would drop binaries in $HOME,
# which compose mounts a volume over. /usr/local/bin cannot be shadowed.
RUN case "${TARGETARCH}" in \
      amd64) TURSO_ARCH=x86_64 ;; \
      arm64) TURSO_ARCH=arm64 ;; \
      *) echo "unsupported arch: ${TARGETARCH}" >&2; exit 1 ;; \
    esac && \
    curl -sSfL -o /tmp/turso.tar.gz \
      "https://github.com/tursodatabase/turso-cli/releases/download/v${TURSO_CLI_VERSION}/turso-cli_Linux_${TURSO_ARCH}.tar.gz" && \
    tar -xzf /tmp/turso.tar.gz -C /usr/local/bin turso && \
    rm /tmp/turso.tar.gz && \
    turso --version

# Run as the host user so anything written into the bind mount — .env.local
# above all — stays host-owned.
RUN groupadd -g ${GID} dev 2>/dev/null || true && \
    useradd -u ${UID} -g ${GID} -d /home/dev -m dev 2>/dev/null || true && \
    mkdir -p /home/dev && chown -R ${UID}:${GID} /home/dev
USER ${UID}:${GID}

WORKDIR /app
CMD ["bash"]

# --- Builder ---
FROM deps AS builder
COPY . .
RUN npm run build

# --- Production ---
FROM base AS production
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD wget --spider -q http://localhost:3000 || exit 1

CMD ["node", "server.js"]
