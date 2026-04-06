$base='http://localhost:3000/api/v1'
Write-Host "Base API: $base"
try {
  Write-Host '1) Fetch a product'
  $prodResp = Invoke-RestMethod -Method Get -Uri "$base/products?page=1&limit=1"

  $product = $null
  if ($prodResp.data -and $prodResp.data.data) { $product = $prodResp.data.data[0] }
  elseif ($prodResp.data -and $prodResp.data.items) { $product = $prodResp.data.items[0] }
  elseif ($prodResp.data -and $prodResp.data[0]) { $product = $prodResp.data[0] }
  elseif ($prodResp.data) { $product = $prodResp.data }

  if (-not $product) { Write-Host 'No product found'; exit 2 }
  Write-Host "Product id: $($product.id) name: $($product.name) stock: $($product.stock)"

  Write-Host "\n2) Acquire guest token"
  $guest = Invoke-RestMethod -Method Post -Uri "$base/auth/guest" -ContentType 'application/json'
  $guestToken = $guest.data.token
  $guestId = $guest.data.guestId
  Write-Host "Guest token length: $($guestToken.Length)"

  Write-Host "\n3) Add product to cart as guest"
  $headers = @{ Authorization = "Bearer $guestToken"; 'X-Guest-Id' = $guestId }
  $body = @{ productId = $product.id; quantity = 1 } | ConvertTo-Json
  $add = Invoke-RestMethod -Method Post -Uri "$base/cart" -Headers $headers -Body $body -ContentType 'application/json'
  Write-Host "Add to cart message: $($add.message)"

  Write-Host "\n4) View cart"
  $cart = Invoke-RestMethod -Method Get -Uri "$base/cart" -Headers $headers
  $count = 0
  if ($cart.data.items) { $count = $cart.data.items.Count } elseif ($cart.data.Count) { $count = $cart.data.Count }
  Write-Host "Cart items: $count"

  Write-Host "\n5) Create admin account"
  $adminCreateBody = @{ secretKey = '444488888888'; email = 'e2e-admin@local'; password = 'Password123!'; firstName = 'E2E'; lastName = 'Admin' } | ConvertTo-Json
  $adminCreate = Invoke-RestMethod -Method Post -Uri "$base/auth/admin/create" -Body $adminCreateBody -ContentType 'application/json'
  $adminToken = $adminCreate.data.tokens.accessToken
  Write-Host "Admin token length: $($adminToken.Length)"

  Write-Host "\n6) Set delivery charges (admin)"
  $adminHeaders = @{ Authorization = "Bearer $adminToken" }
  $delivery = @{ in_dhaka = 50 } | ConvertTo-Json
  $setDel = Invoke-RestMethod -Method Put -Uri "$base/settings/delivery" -Headers $adminHeaders -Body $delivery -ContentType 'application/json'
  Write-Host "Set delivery response: $($setDel.message)"

  Write-Host "\n7) Create order as guest (using shipping zone 'in_dhaka')"
  $orderBody = @{ shippingAddress = @{ zone = 'in_dhaka'; address = '123 Test St'; name = 'Test User' }; paymentMethod = 'COD'; items = @(@{ productId = $product.id; quantity = 1 }) } | ConvertTo-Json
  $order = Invoke-RestMethod -Method Post -Uri "$base/orders" -Headers $headers -Body $orderBody -ContentType 'application/json'
  Write-Host "Order created id: $($order.data.id)"

  Write-Host "\n8) Admin: list orders and update order status -> CONFIRMED"
  $ordersList = Invoke-RestMethod -Method Get -Uri "$base/orders?page=1&limit=10" -Headers $adminHeaders
  $firstOrder = $ordersList.data.items[0]
  Write-Host "Admin orders count: $($ordersList.data.items.Count)"
  if ($firstOrder) {
    Write-Host "Found order id: $($firstOrder.id) status: $($firstOrder.status)"
    $updateBody = @{ status = 'CONFIRMED' } | ConvertTo-Json
    $upd = Invoke-RestMethod -Method Patch -Uri "$base/orders/$($firstOrder.id)/status" -Headers $adminHeaders -Body $updateBody -ContentType 'application/json'
    Write-Host "Update status response: $($upd.message)"
  }

  Write-Host "\n9) Seller: fetch seller orders (using admin token)
"
  $sellerResp = Invoke-RestMethod -Method Get -Uri "$base/orders/seller/" -Headers $adminHeaders
  Write-Host "Seller orders count: $($sellerResp.data.items.Count)"

  Write-Host "\nE2E script completed successfully"
  exit 0
} catch {
  Write-Host "ERROR: $($_.Exception.Message)"
  if ($_.Exception.Response) { try { $r = $_.Exception.Response.GetResponseStream(); $sr = New-Object System.IO.StreamReader($r); $body = $sr.ReadToEnd(); Write-Host 'ResponseBody:'; Write-Host $body } catch {} }
  exit 3
}