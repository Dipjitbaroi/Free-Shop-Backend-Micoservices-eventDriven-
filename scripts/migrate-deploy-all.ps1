$services = @(
    "auth-service",
    "user-service",
    "product-service",
    "order-service",
    "payment-service",
    "inventory-service",
    "vendor-service",
    "notification-service",
    "analytics-service"
)

Write-Host "Starting Prisma migration deployment inside Docker containers..." -ForegroundColor Magenta

$successCount = 0
$failCount = 0
$skippedCount = 0

# Check if Docker Compose V2 is available
$useV2 = $false
try {
    docker compose version > $null 2>&1
    if ($LASTEXITCODE -eq 0) { $useV2 = $true }
} catch {}

foreach ($service in $services) {
    # Check if container is running
    if ($useV2) {
        $isRunning = docker compose ps -q $service 2>$null
    } else {
        $isRunning = docker-compose ps -q $service 2>$null
    }
    
    if (-not $isRunning) {
        Write-Host "`n--- Skipping $($service): Container is not running ---" -ForegroundColor Yellow
        $skippedCount++
        continue
    }

    Write-Host "`n>>> Migrating in container: $($service)" -ForegroundColor Cyan
    
    # Execute migration inside the container
    if ($useV2) {
        docker compose exec -T $service pnpm exec prisma migrate deploy
    } else {
        docker-compose exec -T $service pnpm exec prisma migrate deploy
    }
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "FAILED: $($service)" -ForegroundColor Red
        $failCount++
    } else {
        Write-Host "SUCCESS: $($service)" -ForegroundColor Green
        $successCount++
    }
}

Write-Host "`n========================================" -ForegroundColor Magenta
Write-Host "Migration process completed." -ForegroundColor Green
Write-Host "Success: $successCount" -ForegroundColor Green
Write-Host "Failed:  $failCount" -ForegroundColor Red
Write-Host "Skipped: $skippedCount" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Magenta
