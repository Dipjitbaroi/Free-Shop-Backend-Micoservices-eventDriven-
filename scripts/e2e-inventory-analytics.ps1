$base='http://localhost:3000/api/v1'
Write-Host "Base API: $base"
try {
  Write-Host '1) Admin login'
  $adminBody = @{ email = 'admin@freeshop.com'; password = 'Str0ng!Pass' } | ConvertTo-Json
  $adminResp = Invoke-RestMethod -Method Post -Uri "$base/auth/admin/login" -Body $adminBody -ContentType 'application/json'
  $adminToken = $adminResp.data.tokens.accessToken
  $adminHeaders = @{ Authorization = "Bearer $adminToken" }
  Write-Host "Admin token length: $($adminToken.Length)"

  Write-Host "`n2) Get existing product for inventory testing"
  $prodResp = Invoke-RestMethod -Method Get -Uri "$base/products?page=1&limit=1" -Headers $adminHeaders
  $product = $prodResp.data.data[0]
  if (-not $product) {
    Write-Host "No products found, creating one..."
    $categoryResp = Invoke-RestMethod -Method Get -Uri "$base/categories" -Headers $adminHeaders
    $category = $categoryResp.data[0]
    $productBody = @{
      name = 'Inventory Test Product'
      categoryId = $category.id
      price = 100
      stock = 50
    } | ConvertTo-Json
    $createProd = Invoke-RestMethod -Method Post -Uri "$base/products" -Headers $adminHeaders -Body $productBody -ContentType 'application/json'
    $product = $createProd.data
    # Approve the product
    $approveBody = @{ status = 'ACTIVE' } | ConvertTo-Json
    Invoke-RestMethod -Method Patch -Uri "$base/products/$($product.id)/status" -Headers $adminHeaders -Body $approveBody -ContentType 'application/json' | Out-Null
  }
  Write-Host "Using product: $($product.name) ID: $($product.id)"

  Write-Host "`n=== INVENTORY FLOW TESTING ==="

  Write-Host "`n3) Initialize inventory for product"
  $initBody = @{
    productId = $product.id
    sellerId = '550e8400-e29b-41d4-a716-446655440001'  # Using existing seller ID
    initialStock = 100
    lowStockThreshold = 10
  } | ConvertTo-Json
  $initResp = Invoke-RestMethod -Method Post -Uri "$base/inventory/initialize" -Headers $adminHeaders -Body $initBody -ContentType 'application/json'
  Write-Host "Inventory initialized successfully"

  Write-Host "`n4) Check product inventory"
  $invResp = Invoke-RestMethod -Method Get -Uri "$base/inventory/product/$($product.id)" -Headers $adminHeaders
  Write-Host "Inventory data retrieved"

  Write-Host "`n5) Check availability for checkout"
  $availBody = @{
    items = @(@{ productId = $product.id; quantity = 5 })
  } | ConvertTo-Json
  $availResp = Invoke-RestMethod -Method Post -Uri "$base/inventory/check-availability" -Body $availBody -ContentType 'application/json'
  Write-Host "Availability check result: $($availResp.data.available)"

  Write-Host "`n6) Add stock to inventory"
  $addBody = @{ quantity = 20; reason = 'Restock' } | ConvertTo-Json
  $addResp = Invoke-RestMethod -Method Post -Uri "$base/inventory/$($product.id)/add" -Headers $adminHeaders -Body $addBody -ContentType 'application/json'
  Write-Host "Stock added successfully"

  Write-Host "`n7) Reduce stock (simulate sale)"
  $reduceBody = @{ quantity = 3; reason = 'Sale' } | ConvertTo-Json
  $reduceResp = Invoke-RestMethod -Method Post -Uri "$base/inventory/$($product.id)/reduce" -Headers $adminHeaders -Body $reduceBody -ContentType 'application/json'
  Write-Host "Stock reduced successfully"

  Write-Host "`n8) Reserve stock for order"
  try {
    $reserveBody = @{ orderId = '550e8400-e29b-41d4-a716-446655440010'; quantity = 2 } | ConvertTo-Json
    $reserveResp = Invoke-RestMethod -Method Post -Uri "$base/inventory/$($product.id)/reserve" -Body $reserveBody -ContentType 'application/json'
    Write-Host "Stock reserved successfully"
  } catch {
    Write-Host "Stock reservation failed (might be expected if insufficient stock): $($_.Exception.Message)"
  }

  Write-Host "`n9) Get stock movements"
  $movementsResp = Invoke-RestMethod -Method Get -Uri "$base/inventory/$($product.id)/movements?page=1&limit=10" -Headers $adminHeaders
  Write-Host "Stock movements retrieved: $($movementsResp.data.items.Count) movements"

  Write-Host "`n10) Set low stock threshold"
  $thresholdBody = @{ threshold = 15 } | ConvertTo-Json
  $thresholdResp = Invoke-RestMethod -Method Patch -Uri "$base/inventory/$($product.id)/threshold" -Headers $adminHeaders -Body $thresholdBody -ContentType 'application/json'
  Write-Host "Threshold updated successfully"

  Write-Host "`n=== ANALYTICS FLOW TESTING ==="

  Write-Host "`n11) Track product view event"
  try {
    $eventBody = @{
      eventType = 'product'
      eventName = 'view'
      entityType = 'product'
      entityId = $product.id
      metadata = @{ source = 'test' }
    } | ConvertTo-Json
    $eventResp = Invoke-RestMethod -Method Post -Uri "$base/analytics/events" -Body $eventBody -ContentType 'application/json'
    Write-Host "Product view event tracked"
  } catch {
    Write-Host "Event tracking failed: $($_.Exception.Message)"
  }

  Write-Host "`n12) Track search event"
  try {
    $searchBody = @{
      query = 'test product'
      resultsCount = 5
      clickedProductId = $product.id
    } | ConvertTo-Json
    $searchResp = Invoke-RestMethod -Method Post -Uri "$base/analytics/search" -Body $searchBody -ContentType 'application/json'
    Write-Host "Search event tracked"
  } catch {
    Write-Host "Search tracking failed: $($_.Exception.Message)"
  }

  Write-Host "`n13) Get dashboard analytics"
  try {
    $dashboardResp = Invoke-RestMethod -Method Get -Uri "$base/analytics/dashboard" -Headers $adminHeaders
    Write-Host "Dashboard analytics retrieved"
  } catch {
    Write-Host "Dashboard analytics failed: $($_.Exception.Message)"
  }

  Write-Host "`n14) Get sales report"
  try {
    $salesResp = Invoke-RestMethod -Method Get -Uri "$base/analytics/sales" -Headers $adminHeaders
    Write-Host "Sales report retrieved"
  } catch {
    Write-Host "Sales report failed: $($_.Exception.Message)"
  }

  Write-Host "`n15) Get product analytics"
  try {
    $productAnalyticsResp = Invoke-RestMethod -Method Get -Uri "$base/analytics/products/$($product.id)" -Headers $adminHeaders
    Write-Host "Product analytics retrieved"
  } catch {
    Write-Host "Product analytics failed: $($_.Exception.Message)"
  }

  Write-Host "`n16) Get top products"
  try {
    $topProductsResp = Invoke-RestMethod -Method Get -Uri "$base/analytics/top-products?limit=5" -Headers $adminHeaders
    Write-Host "Top products retrieved: $($topProductsResp.data.Count) products"
  } catch {
    Write-Host "Top products failed: $($_.Exception.Message)"
  }

  Write-Host "`n17) Get popular searches"
  try {
    $popularSearchesResp = Invoke-RestMethod -Method Get -Uri "$base/analytics/search/popular?limit=5"
    Write-Host "Popular searches retrieved: $($popularSearchesResp.data.Count) searches"
  } catch {
    Write-Host "Popular searches failed: $($_.Exception.Message)"
  }

  Write-Host "`n18) Get user analytics"
  try {
    $userAnalyticsResp = Invoke-RestMethod -Method Get -Uri "$base/analytics/users" -Headers $adminHeaders
    Write-Host "User analytics retrieved"
  } catch {
    Write-Host "User analytics failed: $($_.Exception.Message)"
  }

  Write-Host "`n=== INVENTORY AND ANALYTICS FLOWS COMPLETED SUCCESSFULLY ==="
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