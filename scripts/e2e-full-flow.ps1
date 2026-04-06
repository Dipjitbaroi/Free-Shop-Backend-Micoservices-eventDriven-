$base='http://localhost:3000/api/v1'
Write-Host "Base API: $base"
try {
  Write-Host '1) Admin login'
  $adminBody = @{ email = 'admin@freeshop.com'; password = 'Str0ng!Pass' } | ConvertTo-Json
  $adminResp = Invoke-RestMethod -Method Post -Uri "$base/auth/admin/login" -Body $adminBody -ContentType 'application/json'
  $adminToken = $adminResp.data.tokens.accessToken
  Write-Host "Admin token length: $($adminToken.Length)"

  Write-Host "`n2) Set delivery charges (admin)"
  $adminHdr = @{ Authorization = "Bearer $adminToken" }
  $deliveryBody = @{ in_dhaka = 50 } | ConvertTo-Json
  $setDel = Invoke-RestMethod -Method Put -Uri "$base/settings/delivery" -Headers $adminHdr -Body $deliveryBody -ContentType 'application/json'
  Write-Host "Set delivery response: $($setDel.message)"

  Write-Host "`n3) Fetch existing products"
  $prodResp = Invoke-RestMethod -Method Get -Uri "$base/products?page=1&limit=5"
  $products = $prodResp.data.data
  if (-not $products -or $products.Count -eq 0) {
    Write-Host "No products found, creating one..."
    # Create a product as admin (assuming admin can create products)
    $productBody = @{
      name = 'Test Product'
      categoryId = '550e8400-e29b-41d4-a716-446655440002'  # Assuming category exists
      price = 200
      description = 'Test product for e2e'
      stock = 50
    } | ConvertTo-Json
    $createProd = Invoke-RestMethod -Method Post -Uri "$base/products" -Headers $adminHdr -Body $productBody -ContentType 'application/json'
    $product = $createProd.data
    Write-Host "Created product: $($product.name)"
  } else {
    $product = $products[0]
    Write-Host "Using existing product: $($product.name)"
  }

  Write-Host "`n4) Create guest token and add product to cart"
  $guestResp = Invoke-RestMethod -Method Post -Uri "$base/auth/guest" -ContentType 'application/json'
  $guestToken = $guestResp.data.token
  $guestId = $guestResp.data.guestId
  Write-Host "Guest token length: $($guestToken.Length)"

  $guestHdr = @{ Authorization = "Bearer $guestToken"; 'X-Guest-Id' = $guestId }
  $addBody = @{ productId = $product.id; quantity = 2 } | ConvertTo-Json
  $addResp = Invoke-RestMethod -Method Post -Uri "$base/cart" -Headers $guestHdr -Body $addBody -ContentType 'application/json'
  Write-Host "Add to cart: $($addResp.message)"

  Write-Host "`n5) View cart"
  $cart = Invoke-RestMethod -Method Get -Uri "$base/cart" -Headers $guestHdr
  Write-Host "Cart has $($cart.data.items.Count) items"

  Write-Host "`n6) Create order as guest"
  $orderBody = @{ shippingAddress = @{ zone = 'in_dhaka'; address = '123 Test St'; name = 'E2E Customer' }; paymentMethod = 'COD'; items = @(@{ productId = $product.id; quantity = 2 }) } | ConvertTo-Json
  $order = Invoke-RestMethod -Method Post -Uri "$base/orders" -Headers $guestHdr -Body $orderBody -ContentType 'application/json'
  $orderId = $order.data.id
  Write-Host "Order created: $orderId"

  Write-Host "`n7) Admin: confirm order"
  $updateBody = @{ status = 'CONFIRMED' } | ConvertTo-Json
  $upd = Invoke-RestMethod -Method Patch -Uri "$base/orders/$orderId/status" -Headers $adminHdr -Body $updateBody -ContentType 'application/json'
  Write-Host "Order confirmed: $($upd.message)"

  Write-Host "`n8) Admin: update order to PROCESSING"
  $updateBody = @{ status = 'PROCESSING' } | ConvertTo-Json
  $upd = Invoke-RestMethod -Method Patch -Uri "$base/orders/$orderId/status" -Headers $adminHdr -Body $updateBody -ContentType 'application/json'
  Write-Host "Order processing: $($upd.message)"

  Write-Host "`n9) Admin: update order to SHIPPED"
  $updateBody = @{ status = 'SHIPPED'; trackingNumber = 'TRACK123'; carrier = 'Test Carrier' } | ConvertTo-Json
  $upd = Invoke-RestMethod -Method Patch -Uri "$base/orders/$orderId/status" -Headers $adminHdr -Body $updateBody -ContentType 'application/json'
  Write-Host "Order shipped: $($upd.message)"

  Write-Host "`n10) Admin: update order to OUT_FOR_DELIVERY"
  $updateBody = @{ status = 'OUT_FOR_DELIVERY' } | ConvertTo-Json
  $upd = Invoke-RestMethod -Method Patch -Uri "$base/orders/$orderId/status" -Headers $adminHdr -Body $updateBody -ContentType 'application/json'
  Write-Host "Order out for delivery: $($upd.message)"

  Write-Host "`n11) For COD, mark payment as completed when delivered"
  # For COD, payment is completed on delivery
  $paymentBody = @{ paymentStatus = 'PAID'; transactionId = 'COD_COMPLETED' } | ConvertTo-Json
  $payUpd = Invoke-RestMethod -Method Patch -Uri "$base/orders/$orderId/payment" -Headers $adminHdr -Body $paymentBody -ContentType 'application/json'
  Write-Host "Payment completed: $($payUpd.message)"

  Write-Host "`n12) Admin: mark order as DELIVERED"
  $updateBody = @{ status = 'DELIVERED' } | ConvertTo-Json
  $upd = Invoke-RestMethod -Method Patch -Uri "$base/orders/$orderId/status" -Headers $adminHdr -Body $updateBody -ContentType 'application/json'
  Write-Host "Order delivered: $($upd.message)"

  Write-Host "`n13) Fetch final order status"
  $finalOrder = Invoke-RestMethod -Method Get -Uri "$base/orders/$orderId" -Headers $adminHdr
  Write-Host "Final order status: $($finalOrder.data.status), payment: $($finalOrder.data.paymentStatus)"

  Write-Host "`nFull customer flow completed successfully!"
} catch {
  Write-Host "ERROR: $($_.Exception.Message)"
  if ($_.Exception.Response) {
    try {
      $sr = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
      $body = $sr.ReadToEnd()
      Write-Host 'ResponseBody:'
      Write-Host $body
    } catch {}
  }
  exit 1
}