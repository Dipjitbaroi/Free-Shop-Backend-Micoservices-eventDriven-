@echo off
REM Clear all dashboard cache keys in Redis
echo === Listing dashboard:* keys ===
docker exec freeshop-redis-dev sh -c "REDISCLI_AUTH=' Freesh0p_Rd_S3cur3_2026' redis-cli KEYS 'dashboard:*'"
echo.
echo === Deleting each key ===
for /f "delims=" %%k in ('docker exec freeshop-redis-dev sh -c "REDISCLI_AUTH=' Freesh0p_Rd_S3cur3_2026' redis-cli KEYS 'dashboard:*'"') do (
    if not "%%k"=="" (
        echo Deleting: %%k
        docker exec freeshop-redis-dev sh -c "REDISCLI_AUTH=' Freesh0p_Rd_S3cur3_2026' redis-cli DEL '%%k'"
    )
)
echo.
echo === After clear ===
docker exec freeshop-redis-dev sh -c "REDISCLI_AUTH=' Freesh0p_Rd_S3cur3_2026' redis-cli KEYS 'dashboard:*'"
