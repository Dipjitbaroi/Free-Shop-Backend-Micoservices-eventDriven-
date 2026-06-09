$token = Get-Content "tmp\admin-token.txt"
$orderId = "318e84ca-7df6-4edd-b3c3-3451fd11bba3"
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}
$body = @{
    trackingNumber = "TRK-TEST-002"
    deliveryNotes = "Delivered successfully (test)"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/v1/orders/$orderId/deliver" -Method POST -Headers $headers -Body $body -UseBasicParsing
    Write-Host "Status: $($response.StatusCode)"
    Write-Host "Body: $($response.Content)"
} catch {
    Write-Host "Error: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $reader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
        Write-Host "Response: $($reader.ReadToEnd())"
    }
}
