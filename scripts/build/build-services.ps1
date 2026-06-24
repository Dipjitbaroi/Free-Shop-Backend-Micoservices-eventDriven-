# =============================================================================
# scripts/build/build-services.ps1
# ----------------------------------------------------------------------
# Local-Docker build for all 10 services with a *persistent* BuildKit
# cache. Replaces `docker-compose build --build-parallelism N`, which
# (a) can't share the in-memory `--mount=type=cache` mount across
#     parallel services, and
# (b) hammers registry.npmjs.org with 3-10 concurrent tarball
#     downloads that routinely time out.
#
# Strategy
# --------
#   1. Ensure a single `docker-container` BuildKit builder exists. This
#      builder stays alive between runs and holds a persistent on-disk
#      cache (`$env:LOCALAPPDATA\buildkit-cache`).
#   2. Loop over the 10 service Dockerfiles with `docker buildx build`,
#      mounting the same cache backend (`type=local`) on every build.
#      Each service's pnpm store is read from / written to the same
#      directory, so the second service's `pnpm install` is effectively
#      free.
#   3. Build services serially. With the persistent cache, the second
#      build only fetches deltas, so serial is *faster* than parallel
#      for this monorepo (no registry contention).
#
# Usage
# -----
#   pwsh scripts/build/build-services.ps1                 # all 10 services
#   pwsh scripts/build/build-services.ps1 -Service auth   # one service
#   pwsh scripts/build/build-services.ps1 -NoCache        # cold build
# =============================================================================

[CmdletBinding()]
param(
    [string] $Service,                          # build one service
    [switch] $NoCache,                          # bypass persistent cache
    [string] $BuilderName = 'freeshop-builder', # docker buildx builder
    [string] $CacheRoot = "$env:LOCALAPPDATA\buildkit-cache",
    [string[]] $Services = @(
        'api-gateway',
        'auth-service',
        'user-service',
        'product-service',
        'order-service',
        'payment-service',
        'inventory-service',
        'vendor-service',
        'notification-service',
        'analytics-service'
    )
)

$ErrorActionPreference = 'Stop'
# Resolve the repo root. $PSScriptRoot is `scripts/build/`, so we go up two
# levels to land at the workspace root.
$repoRoot = Resolve-Path (Join-Path $PSScriptRoot '..\..') | Select-Object -ExpandProperty Path
Set-Location $repoRoot | Out-Null
Write-Host "[i] Repo root: $repoRoot" -ForegroundColor DarkGray

# ----- 1. Ensure a persistent BuildKit builder exists ------------------
function Ensure-Builder {
    param([string] $Name, [string] $CacheRoot)
    # `docker buildx inspect` prints "no builder" to STDOUT (not stderr),
    # so we silence ALL streams and trust the exit code.
    $inspect = Start-Process -FilePath 'docker' -ArgumentList 'buildx','inspect',$Name `
                            -NoNewWindow -Wait -PassThru `
                            -RedirectStandardOutput "$env:TEMP\bx-inspect-out.log" `
                            -RedirectStandardError  "$env:TEMP\bx-inspect-err.log"
    if ($inspect.ExitCode -ne 0) {
        Write-Host "[+] Creating BuildKit builder '$Name' (docker-container driver)" -ForegroundColor Cyan
        $create = Start-Process -FilePath 'docker' `
                                -ArgumentList 'buildx','create','--name',$Name,'--driver','docker-container','--driver-opt','image=moby/buildkit:v0.21.1','--use' `
                                -NoNewWindow -Wait -PassThru `
                                -RedirectStandardOutput "$env:TEMP\bx-create-out.log" `
                                -RedirectStandardError  "$env:TEMP\bx-create-err.log"
        if ($create.ExitCode -ne 0) {
            $err = Get-Content "$env:TEMP\bx-create-err.log" -Raw -ErrorAction SilentlyContinue
            throw "Failed to create BuildKit builder: $err"
        }
    } else {
        Write-Host "[i] Reusing existing BuildKit builder '$Name'" -ForegroundColor DarkGray
        $null = Start-Process -FilePath 'docker' -ArgumentList 'buildx','use',$Name `
                              -NoNewWindow -Wait -PassThru
    }

    # Make sure the local cache dir exists and is writable.
    if (-not (Test-Path $CacheRoot)) {
        New-Item -ItemType Directory -Path $CacheRoot -Force | Out-Null
    }
    Write-Host "[i] Persistent cache root: $CacheRoot" -ForegroundColor DarkGray
}

# ----- 2. Build a single service via docker buildx --------------------
function Build-Service {
    param(
        [string] $ServiceName,
        [string] $Builder,
        [string] $CacheRoot,
        [bool]   $UseCache
    )

    $dockerfile = "services/$ServiceName/Dockerfile"
    if (-not (Test-Path $dockerfile)) {
        Write-Host "[!] $dockerfile not found, skipping" -ForegroundColor Yellow
        return
    }

    Write-Host ""
    Write-Host "==== Building $ServiceName ====" -ForegroundColor Green

    $cacheArgs = @()
    if ($UseCache) {
        $cacheArgs += '--cache-from'
        $cacheArgs += "type=local,src=$CacheRoot"
        $cacheArgs += '--cache-to'
        $cacheArgs += "type=local,dest=$CacheRoot,mode=max"
    } else {
        $cacheArgs += '--no-cache'
    }

    # Build a single command string, quoting anything that contains spaces.
    # We use Start-Process with -Wait -PassThru so the exit code is
    # unambiguous. The trailing `.` is the build context.
    $parts = @('buildx','build')
    $parts += @('--builder', $Builder)
    $parts += @('--file',    $dockerfile)
    $parts += @('--tag',     "freeshop-$ServiceName`:local")
    $parts += @('--load','--progress=plain')
    $parts += $cacheArgs
    $parts += @('.')

    $quoted = $parts | ForEach-Object {
        if ($_ -match '\s') { '"' + $_ + '"' } else { $_ }
    }
    $cmdLine = $quoted -join ' '

    $proc = Start-Process -FilePath 'docker' `
                         -ArgumentList $cmdLine `
                         -NoNewWindow -Wait -PassThru `
                         -ErrorAction Stop
    $code = $proc.ExitCode

    if ($code -ne 0) {
        throw "$ServiceName build failed (exit $code). Run with -Service $ServiceName for live output."
    } else {
        Write-Host "[OK] $ServiceName build succeeded" -ForegroundColor Green
    }
}

# ----- 3. Main ---------------------------------------------------------
try {
    Ensure-Builder -Name $BuilderName -CacheRoot $CacheRoot

    $targets = if ($Service) { @($Service) } else { $Services }

    $sw = [System.Diagnostics.Stopwatch]::StartNew()
    foreach ($svc in $targets) {
        Build-Service -ServiceName $svc -Builder $BuilderName -CacheRoot $CacheRoot -UseCache (-not $NoCache)
    }
    $sw.Stop()

    Write-Host ""
    Write-Host "===========================================" -ForegroundColor Cyan
    Write-Host "Built $($targets.Count) service(s) in $([math]::Round($sw.Elapsed.TotalMinutes, 1)) min" -ForegroundColor Cyan
    Write-Host "===========================================" -ForegroundColor Cyan
}
catch {
    Write-Host ""
    Write-Host "[X] Build failed: $_" -ForegroundColor Red
    exit 1
}
