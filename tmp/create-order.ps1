$token = Get-Content "tmp\admin-token.txt"
$payload = Get-Content "tmp\order-payload.json" -Raw
$response = Invoke-WebRequest -Uri "http://localhost:3000/api/v1/orders" `
  -Method POST `
  -UseBasicParsing `
  -TimeoutSec 30 `
  -ContentType "application/json" `
  -Headers @{ Authorization = "Bearer $token" } `
  -Body $payload
Write-Output "Status: $($response.StatusCode)"
Write-Output "Body: $($response.Content)"
