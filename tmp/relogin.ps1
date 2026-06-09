$body = @{
  email = 'dipjit.admin@freeshop.com'
  password = 'Admin@12345'
} | ConvertTo-Json

$resp = Invoke-RestMethod -Method POST -Uri 'http://localhost:3000/api/v1/auth/admin/login' -Body $body -ContentType 'application/json'
$token = $resp.data.tokens.accessToken
$token | Out-File -FilePath 'tmp\admin-token.txt' -Encoding utf8
Write-Output "Token length: $($token.Length)"
Write-Output "User: $($resp.data.user.email)"
Write-Output "Roles: $($resp.data.user.roles -join ', ')"
