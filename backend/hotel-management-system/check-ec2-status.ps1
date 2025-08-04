# Check EC2 Application Status
Write-Host "🔍 Checking EC2 Application Status..." -ForegroundColor Green

$ec2IP = "52.66.135.123"

# Check if application is running on EC2
Write-Host "`n📋 Checking if application is running on EC2..." -ForegroundColor Yellow
try {
    $processCheck = ssh -i "C:\Users\Monu\Desktop\AWS\monu-key.pem" ec2-user@$ec2IP "ps aux | grep java | grep hotel-management"
    if ($processCheck -like "*hotel-management*") {
        Write-Host "✅ Application is running on EC2" -ForegroundColor Green
    } else {
        Write-Host "❌ Application is not running on EC2" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Could not check EC2 status: $($_.Exception.Message)" -ForegroundColor Red
}

# Test external access
Write-Host "`n🌐 Testing external access..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://$ec2IP:8080/api/health" -Method GET -TimeoutSec 10
    Write-Host "✅ External access working: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "   Response: $($response.Content)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ External access failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "💡 This might be due to EC2 security group configuration" -ForegroundColor Yellow
}

Write-Host "`n📱 Next Steps:" -ForegroundColor Green
Write-Host "1. Check EC2 Security Group - ensure port 8080 is open" -ForegroundColor White
Write-Host "2. Test from your mobile phone: http://$ec2IP:8080/api/health" -ForegroundColor White
Write-Host "3. Test frontend: http://hotel-management-ui.s3-website.ap-south-1.amazonaws.com" -ForegroundColor White 