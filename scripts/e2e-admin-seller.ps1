$base='http://localhost:3000/api/v1'
Write-Host "Base API: $base"
try {
  Write-Host '1) Admin login'
  $adminBody = @{ email = 'admin@freeshop.com'; password = 'Str0ng!Pass' } | ConvertTo-Json
  $adminResp = Invoke-RestMethod -Method Post -Uri "$base/auth/admin/login" -Body $adminBody -ContentType 'application/json'
  $adminToken = $adminResp.data.tokens.accessToken
  $adminHeaders = @{ Authorization = "Bearer $adminToken" }
  Write-Host "Admin token length: $($adminToken.Length)"

  Write-Host "`n2) Admin: Create a new product"
  $categoryResp = Invoke-RestMethod -Method Get -Uri "$base/categories" -Headers $adminHeaders
  $category = $categoryResp.data[0]
  Write-Host "Using category: $($category.name)"

  $productBody = @{
    name = 'Seller Test Product'
    categoryId = $category.id
    price = 150
    description = 'Product created by seller/admin'
    stock = 25
  } | ConvertTo-Json
  $createProd = Invoke-RestMethod -Method Post -Uri "$base/products" -Headers $adminHeaders -Body $productBody -ContentType 'application/json'
  $newProduct = $createProd.data
  Write-Host "Created product: $($newProduct.name) with ID: $($newProduct.id)"

  Write-Host "`n3) Admin: Approve the product"
  $approveBody = @{ status = 'ACTIVE' } | ConvertTo-Json
  $approve = Invoke-RestMethod -Method Patch -Uri "$base/products/$($newProduct.id)/status" -Headers $adminHeaders -Body $approveBody -ContentType 'application/json'
  Write-Host "Product approved: $($approve.data.status)"

  Write-Host "`n4) Admin/Seller: View own products"
  $sellerProducts = Invoke-RestMethod -Method Get -Uri "$base/products/seller?page=1&limit=10" -Headers $adminHeaders
  Write-Host "Seller has $($sellerProducts.data.items.Count) products"
  $updateBody = @{ price = 160; stock = 30 } | ConvertTo-Json
  $updProd = Invoke-RestMethod -Method Patch -Uri "$base/products/$($newProduct.id)" -Headers $adminHeaders -Body $updateBody -ContentType 'application/json'
  Write-Host "Product updated: $($updProd.data.name)"

  Write-Host "`n5) Create guest and order the new product"
  $guestResp = Invoke-RestMethod -Method Post -Uri "$base/auth/guest" -ContentType 'application/json'
  $guestToken = $guestResp.data.token
  $guestId = $guestResp.data.guestId
  $guestHeaders = @{ Authorization = "Bearer $guestToken"; 'X-Guest-Id' = $guestId }

  $addCart = @{ productId = $newProduct.id; quantity = 1 } | ConvertTo-Json
  $addResp = Invoke-RestMethod -Method Post -Uri "$base/cart" -Headers $guestHeaders -Body $addCart -ContentType 'application/json'
  Write-Host "Added to cart: $($addResp.message)"

  $orderBody = @{ shippingAddress = @{ zone = 'in_dhaka'; address = '456 Seller St'; name = 'Seller Test Customer' }; paymentMethod = 'COD'; items = @(@{ productId = $newProduct.id; quantity = 1 }) } | ConvertTo-Json
  $order = Invoke-RestMethod -Method Post -Uri "$base/orders" -Headers $guestHeaders -Body $orderBody -ContentType 'application/json'
  $orderId = $order.data.id
  Write-Host "Order created: $orderId"

  Write-Host "`n6) Admin: Confirm order"
  $confirmBody = @{ status = 'CONFIRMED' } | ConvertTo-Json
  $confirm = Invoke-RestMethod -Method Patch -Uri "$base/orders/$orderId/status" -Headers $adminHeaders -Body $confirmBody -ContentType 'application/json'
  Write-Host "Order confirmed"

  Write-Host "`n7) Admin/Seller: View seller orders"
  $sellerOrders = Invoke-RestMethod -Method Get -Uri "$base/orders/seller?page=1&limit=10" -Headers $adminHeaders
  Write-Host "Seller orders count: $($sellerOrders.data.items.Count)"
  if ($sellerOrders.data.items.Count -gt 0) {
    $firstOrder = $sellerOrders.data.items[0]
    Write-Host "Order status: $($firstOrder.status), total: $($firstOrder.total)"
  }

  Write-Host "`n8) Admin: View all orders"
  $allOrders = Invoke-RestMethod -Method Get -Uri "$base/orders?page=1&limit=10" -Headers $adminHeaders
  Write-Host "Total orders: $($allOrders.data.items.Count)"

  Write-Host "`n9) Admin: View order details"
  $orderDetail = Invoke-RestMethod -Method Get -Uri "$base/orders/$orderId" -Headers $adminHeaders
  Write-Host "Order details - Status: $($orderDetail.data.status), Payment: $($orderDetail.data.paymentStatus)"

  Write-Host "`nAdmin/Seller flow tested successfully!"
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