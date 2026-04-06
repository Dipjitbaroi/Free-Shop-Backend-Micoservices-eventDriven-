$base='http://localhost:3000/api/v1'
Write-Host "Base API: $base"
try {
  Write-Host '1) Admin login'
  $adminBody = @{ email = 'admin@freeshop.com'; password = 'Str0ng!Pass' } | ConvertTo-Json
  $adminResp = Invoke-RestMethod -Method Post -Uri "$base/auth/admin/login" -Body $adminBody -ContentType 'application/json'
  Write-Host 'ADMIN LOGIN RESPONSE:'; $adminResp | ConvertTo-Json -Depth 5
  $adminToken = $adminResp.data.tokens.accessToken
  if (-not $adminToken) { Write-Host 'No admin token returned'; exit 2 }
  Write-Host "Admin token length: $($adminToken.Length)"

  Write-Host '\n2) Set delivery charges (admin)'
  $adminHdr = @{ Authorization = "Bearer $adminToken" }
  $deliveryBody = @{ in_dhaka = 50 } | ConvertTo-Json
  $setDel = Invoke-RestMethod -Method Put -Uri "$base/settings/delivery" -Headers $adminHdr -Body $deliveryBody -ContentType 'application/json'
  Write-Host 'SET DELIVERY RESPONSE:'; $setDel | ConvertTo-Json -Depth 5

  Write-Host '\n3) Fetch a product'
  $prodResp = Invoke-RestMethod -Method Get -Uri "$base/products?page=1&limit=1"
  $product = $null
  if ($prodResp.data -and $prodResp.data.data) { $product = $prodResp.data.data[0] } 
  elseif ($prodResp.data -and $prodResp.data.items) { $product = $prodResp.data.items[0] } 
  elseif ($prodResp.data -and $prodResp.data[0]) { $product = $prodResp.data[0] } 
  elseif ($prodResp.data) { $product = $prodResp.data }
  if (-not $product) { Write-Host 'No product found'; exit 3 }
  Write-Host "Product: $($product.id) - $($product.name)"

  Write-Host '\n4) Create guest token and add product to cart'
  $guestResp = Invoke-RestMethod -Method Post -Uri "$base/auth/guest" -ContentType 'application/json'
  $guestResp | ConvertTo-Json -Depth 5
  $guestToken = $guestResp.data.token
  $guestId = $guestResp.data.guestId
  Write-Host "Guest token length: $($guestToken.Length) GuestId: $guestId"

  $guestHdr = @{ Authorization = "Bearer $guestToken"; 'X-Guest-Id' = $guestId }
  $addBody = @{ productId = $product.id; quantity = 1 } | ConvertTo-Json
  $addResp = Invoke-RestMethod -Method Post -Uri "$base/cart" -Headers $guestHdr -Body $addBody -ContentType 'application/json'
  Write-Host 'ADD TO CART RESPONSE:'; $addResp | ConvertTo-Json -Depth 5

  Write-Host '\n5) Create order as guest (inline shippingAddress)'
  $orderBody = @{ shippingAddress = @{ zone = 'in_dhaka'; address = '123 Test St'; name = 'E2E Guest' }; paymentMethod = 'COD'; items = @(@{ productId = $product.id; quantity = 1 }) } | ConvertTo-Json
  $orderResp = Invoke-RestMethod -Method Post -Uri "$base/orders" -Headers $guestHdr -Body $orderBody -ContentType 'application/json'
  Write-Host 'ORDER RESPONSE:'; $orderResp | ConvertTo-Json -Depth 5
  $orderId = $orderResp.data.id

  Write-Host '\n6) Admin: list orders and update the created order to CONFIRMED'
  $ordersList = Invoke-RestMethod -Method Get -Uri "$base/orders?page=1&limit=10" -Headers $adminHdr
  Write-Host 'ADMIN ORDERS LIST:'; $ordersList | ConvertTo-Json -Depth 5
  if (-not $orderId) { $orderId = $ordersList.data.items[0].id }
  if ($orderId) {
    Write-Host "Updating order $orderId to CONFIRMED"
    $updBody = @{ status = 'CONFIRMED' } | ConvertTo-Json
    $updResp = Invoke-RestMethod -Method Patch -Uri "$base/orders/$orderId/status" -Headers $adminHdr -Body $updBody -ContentType 'application/json'
    Write-Host 'UPDATE RESPONSE:'; $updResp | ConvertTo-Json -Depth 5
  } else { Write-Host 'No order id to update' }

  Write-Host '\n7) Seller: get seller orders (using admin token as test)'
  $sellerResp = Invoke-RestMethod -Method Get -Uri "$base/orders/seller/" -Headers $adminHdr
  Write-Host 'SELLER ORDERS:'; $sellerResp | ConvertTo-Json -Depth 5

  Write-Host '\nE2E (admin+guest) completed successfully'
  exit 0
} catch {
  Write-Host 'ERROR:' $_.Exception.Message
  if ($_.Exception.Response) { try { $sr = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream()); Write-Host $sr.ReadToEnd() } catch {} }
  exit 4
}