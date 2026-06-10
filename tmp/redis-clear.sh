#!/bin/bash
# Clear all dashboard cache keys
docker exec freeshop-redis-dev sh -c 'REDISCLI_AUTH=" Freesh0p_Rd_S3cur3_2026" redis-cli KEYS "dashboard:*" | xargs -r -I {} sh -c "REDISCLI_AUTH=\" Freesh0p_Rd_S3cur3_2026\" redis-cli DEL {}"'
echo "--- after clear ---"
docker exec freeshop-redis-dev sh -c 'REDISCLI_AUTH=" Freesh0p_Rd_S3cur3_2026" redis-cli KEYS "dashboard:*"'
