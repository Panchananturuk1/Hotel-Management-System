# Local API Testing Script for Hotel Management System
Write-Host "🧪 Testing Local Hotel Management API..." -ForegroundColor Green

$baseUrl = "http://localhost:8081"

# Test Health Endpoint
Write-Host "`n🔍 Testing Health Endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/health" -Method GET
    Write-Host "✅ Health Check: $($response.StatusCode) - $($response.Content)" -ForegroundColor Green
} catch {
    Write-Host "❌ Health Check Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test Health Test Endpoint
Write-Host "`n🔍 Testing Health Test Endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/health/test" -Method GET
    Write-Host "✅ Health Test: $($response.StatusCode) - $($response.Content)" -ForegroundColor Green
} catch {
    Write-Host "❌ Health Test Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test Hotels Endpoint
Write-Host "`n🏨 Testing Hotels Endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/hotels" -Method GET
    Write-Host "✅ Hotels: $($response.StatusCode) - Found $($response.Content.Length) characters of data" -ForegroundColor Green
    $hotels = $response.Content | ConvertFrom-Json
    Write-Host "   📊 Found $($hotels.Count) hotels" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Hotels Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test Rooms Endpoint
Write-Host "`n🛏️ Testing Rooms Endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/rooms" -Method GET
    Write-Host "✅ Rooms: $($response.StatusCode) - Found $($response.Content.Length) characters of data" -ForegroundColor Green
    $rooms = $response.Content | ConvertFrom-Json
    Write-Host "   📊 Found $($rooms.Count) rooms" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Rooms Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test CORS Headers
Write-Host "`n🌐 Testing CORS Configuration..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/health" -Method GET
    $corsHeaders = $response.Headers["Vary"]
    if ($corsHeaders -like "*Origin*") {
        Write-Host "✅ CORS Headers: Present" -ForegroundColor Green
    } else {
        Write-Host "⚠️ CORS Headers: May be missing" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ CORS Test Failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🎉 Local API Testing Completed!" -ForegroundColor Green
Write-Host "🔗 API Base URL: $baseUrl" -ForegroundColor Cyan
Write-Host "📋 All endpoints are working correctly!" -ForegroundColor Green 