$base='http://localhost:3000/api/v1'
Write-Host "Base API: $base"
try {
  $r = Invoke-RestMethod -Method Post -Uri "$base/auth/guest" -ContentType 'application/json'
  Write-Host "GUEST RESPONSE:"; $r | ConvertTo-Json -Depth 5
  $token = $r.data.token
  $guestId = $r.data.guestId
  Write-Host "TOKEN length:" ($token.Length)
  Write-Host "GUEST ID:" $guestId

  $headers = @{ Authorization = "Bearer $token"; 'X-Guest-Id' = $guestId }
  $body = @{ productId = '550e8400-e29b-41d4-a716-446655440000'; quantity = 1 } | ConvertTo-Json
  $add = Invoke-RestMethod -Method Post -Uri "$base/cart" -Headers $headers -Body $body -ContentType 'application/json'
  Write-Host "ADD RESPONSE:"; $add | ConvertTo-Json -Depth 5

  $cart = Invoke-RestMethod -Method Get -Uri "$base/cart" -Headers $headers
  Write-Host "CART RESPONSE:"; $cart | ConvertTo-Json -Depth 5
} catch {
  Write-Host "ERROR:" $_.Exception.Message
  if ($_.Exception.Response) {
    try { $sr = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream()); Write-Host $sr.ReadToEnd() } catch {}
  }
  exit 1
}
