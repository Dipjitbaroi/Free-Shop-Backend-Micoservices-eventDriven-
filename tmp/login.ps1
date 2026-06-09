$body = '{"email":"dipjit.admin@freeshop.com","password":"Admin@12345"}'
$response = Invoke-WebRequest -Uri "http://localhost:3000/api/v1/auth/admin/login" -Method POST -ContentType "application/json" -Body $body -UseBasicParsing
$json = $response.Content | ConvertFrom-Json
$json.data.tokens.accessToken | Set-Content "tmp\admin-token.txt"
Write-Host "Token refreshed, length:" ($json.data.tokens.accessToken.Length)
