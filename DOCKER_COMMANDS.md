# Docker Build & Run Commands

Quick reference for building, running, and managing the Free Shop microservices
stack locally. All commands are run from the **repo root**
(`D:\GitHub\Free-Shop-Backend-Micoservices(eventDriven)`) in PowerShell.

> **Note on file paths:** the repo folder contains parentheses
> (`Micoservices(eventDriven)`). When passing the compose file path on the
> command line, quote it. When using `cd` first, the unquoted relative
> path `./docker-compose.yml` works fine.

---

## 1. The two compose files

| File | Purpose | When to use |
|------|---------|-------------|
| `docker-compose.yml` | Production-style build & run — uses the per-service `Dockerfile`s in `services/*/` | **The one you want** for the 10 microservices |
| `docker-compose.dev.yml` | Development overrides (volume-mounts, dev mode, etc.) | Use only if you specifically need live code reload |

---

## 2. One-shot: build + start the whole stack

```powershell
docker compose -f docker-compose.yml up -d --build
```

- `-d`  — detached (runs in the background)
- `--build` — rebuilds any service whose image is missing or whose context changed

---

## 3. Build a single service (uses the persistent BuildKit cache)

The repo ships `scripts/build/build-services.ps1`, a thin wrapper around
`docker buildx build` that:

- Reuses a single `docker-container` BuildKit builder (`freeshop-builder`)
  across all 10 service builds
- Mounts a persistent on-disk cache at `$env:LOCALAPPDATA\buildkit-cache`
  so the second `pnpm install` is effectively free
- Tags the result as `freeshop-<service>:local` (separate from the
  `free-shop-backend-...` tag that compose uses)

```powershell
# Build all 10 services (cached, fast)
pwsh scripts/build/build-services.ps1

# Build one service (cached)
pwsh scripts/build/build-services.ps1 -Service auth-service

# Build one service COLD (bypass the persistent cache)
pwsh scripts/build/build-services.ps1 -Service auth-service -NoCache

# Build all 10 COLD
pwsh scripts/build/build-services.ps1 -NoCache
```

After the script finishes, restart the matching container so compose
picks up the new image:

```powershell
docker compose -f docker-compose.yml up -d --force-recreate --no-deps auth-service
```

---

## 4. Run commands

```powershell
# Start everything (uses pre-built images, no rebuild)
docker compose -f docker-compose.yml up -d

# Start a single service and its depends_on
docker compose -f docker-compose.yml up -d api-gateway

# Start a single service WITHOUT its depends_on
docker compose -f docker-compose.yml up -d --no-deps api-gateway

# Force a container to be recreated (e.g. after a new image was built)
docker compose -f docker-compose.yml up -d --force-recreate --no-deps api-gateway

# Watch the build & startup output in the foreground (Ctrl+C to stop)
docker compose -f docker-compose.yml up --build
```

---

## 5. Inspect the stack

```powershell
# Status of all 14 containers
docker compose -f docker-compose.yml ps

# Tail logs for one service
docker compose -f docker-compose.yml logs -f api-gateway

# Tail logs for the whole stack (interleaved)
docker compose -f docker-compose.yml logs -f

# Last 50 lines of logs, no follow
docker compose -f docker-compose.yml logs --tail 50 api-gateway

# Open a shell inside a running container
docker compose -f docker-compose.yml exec api-gateway sh
```

---

## 6. Stop & clean up

```powershell
# Stop all containers (keeps data volumes + images)
docker compose -f docker-compose.yml stop

# Stop and remove containers (keeps data volumes + images)
docker compose -f docker-compose.yml down

# Stop + remove containers + images (keeps data volumes)
docker compose -f docker-compose.yml down --rmi all

# NUCLEAR: stop + remove containers + images + named volumes
docker compose -f docker-compose.yml down --rmi all --volumes
```

---

## 7. Typical rebuild-and-restart loop

For a single service after you edit its source or Dockerfile:

```powershell
# 1. Rebuild the image (cached layers are reused)
pwsh scripts/build/build-services.ps1 -Service api-gateway

# 2. Recreate the container with the new image
docker compose -f docker-compose.yml up -d --force-recreate --no-deps api-gateway

# 3. Watch the logs to confirm it boots cleanly
docker compose -f docker-compose.yml logs -f api-gateway
```

For a clean rebuild of the entire stack (e.g. after editing a shared
package or a base Dockerfile):

```powershell
# 1. Stop the running stack
docker compose -f docker-compose.yml down

# 2. Cold-rebuild all 10 service images
pwsh scripts/build/build-services.ps1 -NoCache

# 3. Start the stack
docker compose -f docker-compose.yml up -d --force-recreate

# 4. Verify
docker compose -f docker-compose.yml ps
docker compose -f docker-compose.yml logs -f
```

---

## 8. Useful one-liners

```powershell
# Show only the service name, status, and ports
docker compose -f docker-compose.yml ps --format "table {{.Name}}\t{{.State}}\t{{.Ports}}"

# Restart a single service
docker compose -f docker-compose.yml restart api-gateway

# Show resource usage (CPU / memory) of all containers
docker stats

# Free up disk space: prune dangling images and stopped containers
docker system prune -f
docker image prune -f

# Wipe the buildx cache (frees 10+ GB; next build will re-download tarballs)
docker buildx prune -af
```

---

## 9. Troubleshooting

| Symptom | Fix |
|---------|-----|
| `Cannot find package 'dotenv'` at container startup | A service was built without its runtime deps. Rebuild with `pwsh scripts/build/build-services.ps1 -Service <name> -NoCache`. The Dockerfiles use `pnpm --prod --legacy deploy` to produce a self-contained, copy-safe `node_modules`. |
| `403 Forbidden` when running `docker run` on a built image | The compose-style tag (e.g. `free-shop-backend-micoserviceseventdriven-api-gateway:latest`) has parentheses, so the trailing `:latest` is parsed as a remote pull. Use the script's `freeshop-<svc>:local` tag instead, or run via `docker compose`. |
| `pnpm install` times out during build | Increase `fetch-retries` / `fetch-timeout` in `.pnpmrc`, or rerun — the persistent buildx cache will keep the second build offline. |
| Container restarts in a loop with `EADDRINUSE` | Another process is binding the same host port. Check with `netstat -ano \| Select-String ":<port>"`. |

---

## 10. Image & container naming

- Compose project name is the **repo parent directory**, e.g.
  `Free-Shop-Backend-Micoservices-eventDriven-`
- Container names are pinned in `docker-compose.yml` via `container_name:`
  (e.g. `freeshop-api-gateway`, `freeshop-postgres`).
- Image names follow `<project>-<service>:latest`, e.g.
  `free-shop-backend-micoserviceseventdriven-api-gateway:latest`.
- The build script tags as `freeshop-<service>:local` instead — the
  same image, different tag.

---
