$base='http://localhost:3000/api/v1'
try {
  Write-Host "Requesting guest token..."
  $g = Invoke-RestMethod -Method Post -Uri "$base/auth/guest" -ContentType 'application/json'
  $token = $g.data.token
  $guestId = $g.data.guestId
  Write-Host "Token len: $($token.Length) GuestId: $guestId"

  $headers = @{ Authorization = "Bearer $token"; 'X-Guest-Id' = $guestId }
  $orderBody = @{ 
    shippingAddress = @{ 
      zoneId = '<zone-uuid-placeholder>'; 
      addressLine = '123 Test St'; 
      fullName = 'Debug Guest'; 
      phone = '+8801712345678';
    }; 
    paymentMethod = 'COD'; 
    items = @(@{ productId = '550e8400-e29b-41d4-a716-446655440000'; quantity = 1 }) 
  } | ConvertTo-Json
  Write-Host "Posting order..."
  try {
    $r = Invoke-RestMethod -Method Post -Uri "$base/orders" -Headers $headers -Body $orderBody -ContentType 'application/json' -ErrorAction Stop
    Write-Host "SUCCESS RESPONSE:"; $r | ConvertTo-Json -Depth 10
  } catch {
    Write-Host "Order request failed:" $_.Exception.Message
    if ($_.Exception.Response) {
      try {
        $resp = $_.Exception.Response
        $status = $resp.StatusCode.value__
        Write-Host "HTTP_STATUS: $status"
        $sr = New-Object System.IO.StreamReader($resp.GetResponseStream())
        $body = $sr.ReadToEnd()
        Write-Host "RESPONSE_BODY:"; Write-Host $body
      } catch {
        Write-Host "Failed to read error response body"
      }
    }
    exit 1
  }
} catch {
  Write-Host "General error:" $_.Exception.Message
  exit 2
}
