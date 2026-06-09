$token = Get-Content "tmp\admin-token.txt"
$response = Invoke-WebRequest -Uri "http://localhost:3000/api/v1/products/698b711c-53fc-4c30-9294-b9b1a2ef0e53" `
  -UseBasicParsing `
  -TimeoutSec 30 `
  -Headers @{ Authorization = "Bearer $token" }
Write-Output "Status: $($response.StatusCode)"
Write-Output "Body: $($response.Content)"
