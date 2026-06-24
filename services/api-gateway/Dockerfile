# syntax=docker/dockerfile:1.7
# =============================================================================
# api-gateway — single-package production image
#
# Why `pnpm deploy`?
# ------------------
# pnpm's normal workspace install places every dep under `.pnpm/<name>@<ver>/...`
# and then *symlinks* them into each workspace package's `node_modules/`.
# That layout is fragile across a `COPY --from=builder` boundary: if the COPY
# strips even one parent directory the symlinks break and Node.js can't resolve
# bare specifiers like `import 'dotenv'`.
#
# `pnpm deploy` (stable since pnpm v8) does the opposite — it materializes a
# *self-contained* `node_modules/` for a single workspace package with all
# transitive runtime deps placed as real entries (not symlinks to .pnpm/).
# That makes the production image copy trivially correct.
#
# Output layout (after `pnpm --filter @freeshop/api-gateway deploy /app/deploy`):
#   /app/deploy/
#     package.json
#     node_modules/        <- flat, all runtime deps + transitive
#     services/api-gateway/
#       dist/
#       package.json
#       node_modules/      <- symlinks into parent (or flat) for workspace deps
# =============================================================================

FROM node:24-alpine AS builder

RUN apk add --no-cache openssl
RUN npm install -g pnpm@10

WORKDIR /app

# ---- 1) workspace manifests: changes when package.json / lockfile changes
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .pnpmrc tsconfig.base.json ./

# ---- 2) source of the four shared packages
COPY packages/shared-types/        ./packages/shared-types/
COPY packages/shared-utils/        ./packages/shared-utils/
COPY packages/shared-events/       ./packages/shared-events/
COPY packages/shared-middleware/   ./packages/shared-middleware/

# ---- 3) ONLY this service's source
COPY services/api-gateway/ ./services/api-gateway/

# Install the full workspace graph once. The cache mount lets sibling
# service builds reuse the downloaded tarballs.
RUN --mount=type=cache,id=pnpm-cache,target=/root/.pnpm-store \
    pnpm install --frozen-lockfile

# Build only api-gateway + the shared packages it imports.
RUN pnpm --filter @freeshop/api-gateway... run build

# Materialize a self-contained, deployment-ready node_modules for the
# api-gateway service alone. No more symlinks into .pnpm/ that the
# production stage could break.
#
# `--legacy` is required in pnpm v10: by default `pnpm deploy` only
# works for workspaces that opt in via `inject-workspace-packages=true`.
# The legacy mode preserves the historical behavior (deploy a single
# workspace package, hoisting its workspace dependencies into node_modules).
#
# Layout produced at /app/deploy:
#   dist/             <- compiled output
#   src/              <- source (for completeness)
#   node_modules/     <- flat, all runtime deps (no .pnpm/ symlinks)
#   package.json
RUN pnpm --filter @freeshop/api-gateway --prod --legacy deploy /app/deploy

# ============================================================================
# Production stage — lean runtime image with a flat, copy-safe node_modules
# ============================================================================
FROM node:24-alpine AS production

RUN apk add --no-cache openssl

WORKDIR /app

# Copy the whole deploy dir: it already has dist/ + node_modules/ + package.json
# laid out as a self-contained, runnable application.
COPY --from=builder /app/deploy /app/deploy

WORKDIR /app/deploy

EXPOSE 3000
CMD ["node", "dist/src/index.js"]
