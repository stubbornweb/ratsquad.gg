# syntax=docker/dockerfile:1

# --- Base ---
FROM node:22-alpine AS base
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
