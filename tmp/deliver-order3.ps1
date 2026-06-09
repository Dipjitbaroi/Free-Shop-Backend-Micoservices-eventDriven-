$token = Get-Content 'D:\GitHub\Free-Shop-Backend-Micoservices(eventDriven)\tmp\admin-token.txt'
$headers = @{ Authorization = "Bearer $token" }
$orderId = '7f0ce387-a2f6-4c99-9f35-f7a764b7e769'
$body = @{
    status = 'DELIVERED'
    note = 'Test delivery 3'
} | ConvertTo-Json
Write-Host "=== PATCH Status to DELIVERED ==="
$result = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/orders/$orderId/status" -Method Patch -Headers $headers -ContentType 'application/json' -Body $body
$result | ConvertTo-Json -Depth 5
