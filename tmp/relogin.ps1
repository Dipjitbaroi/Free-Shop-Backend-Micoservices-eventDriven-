$r = Invoke-WebRequest -Uri "http://localhost:3000/api/v1/auth/admin/login" -Method POST -UseBasicParsing -TimeoutSec 15 -ContentType "application/json" -Body '{"email":"dipjit.admin@freeshop.com","password":"Admin@12345"}'
$j = $r.Content | ConvertFrom-Json
$token = $j.data.tokens.accessToken
$token | Out-File -FilePath "tmp\admin-token.txt" -Encoding utf8 -NoNewline
Write-Output "Token len: $($token.Length)"
Write-Output "User: $($j.data.user.email) | Role: $($j.data.user.role)"
