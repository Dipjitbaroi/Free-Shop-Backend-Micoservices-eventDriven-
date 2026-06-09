$token = Get-Content 'D:\GitHub\Free-Shop-Backend-Micoservices(eventDriven)\tmp\admin-token.txt'
$headers = @{ Authorization = "Bearer $token" }
$start = '2026-06-01'
$end = '2026-06-10'
$url = "http://localhost:3000/api/analytics/section/platform/dashboard?startDate=$start&endDate=$end"
Write-Host "=== Dashboard after second DELIVERED PATCH ==="
$result = Invoke-RestMethod -Uri $url -Method Get -Headers $headers
$result | ConvertTo-Json -Depth 5
