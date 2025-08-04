# Test EC2 Deployed Hotel Management API
Write-Host "🧪 Testing EC2 Deployed Hotel Management API..." -ForegroundColor Green

$ec2IP = "52.66.135.123"
$baseUrl = "http://$ec2IP:8080"

Write-Host "🔗 Testing API at: $baseUrl" -ForegroundColor Cyan

# Test Health Endpoint
Write-Host "`n🔍 Testing Health Endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/health" -Method GET -TimeoutSec 10
    Write-Host "✅ Health Check: $($response.StatusCode) - $($response.Content)" -ForegroundColor Green
} catch {
    Write-Host "❌ Health Check Failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "💡 Make sure the application is deployed and running on EC2" -ForegroundColor Yellow
}

# Test Health Test Endpoint
Write-Host "`n🔍 Testing Health Test Endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/health/test" -Method GET -TimeoutSec 10
    Write-Host "✅ Health Test: $($response.StatusCode) - $($response.Content)" -ForegroundColor Green
} catch {
    Write-Host "❌ Health Test Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test Hotels Endpoint
Write-Host "`n🏨 Testing Hotels Endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/hotels" -Method GET -TimeoutSec 10
    Write-Host "✅ Hotels: $($response.StatusCode) - Found $($response.Content.Length) characters of data" -ForegroundColor Green
    $hotels = $response.Content | ConvertFrom-Json
    Write-Host "   📊 Found $($hotels.Count) hotels" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Hotels Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test Rooms Endpoint
Write-Host "`n🛏️ Testing Rooms Endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/rooms" -Method GET -TimeoutSec 10
    Write-Host "✅ Rooms: $($response.StatusCode) - Found $($response.Content.Length) characters of data" -ForegroundColor Green
    $rooms = $response.Content | ConvertFrom-Json
    Write-Host "   📊 Found $($rooms.Count) rooms" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Rooms Failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🎉 EC2 API Testing Completed!" -ForegroundColor Green
Write-Host "🔗 API Base URL: $baseUrl" -ForegroundColor Cyan
Write-Host "🌐 Frontend URL: http://hotel-management-ui.s3-website.ap-south-1.amazonaws.com" -ForegroundColor Cyan 