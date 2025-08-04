# Deploy Hotel Management System to EC2
Write-Host "🚀 Deploying Hotel Management System to EC2..." -ForegroundColor Green

# Configuration
$ec2IP = "52.66.135.123"
$ec2User = "ec2-user"
$keyFile = "C:\Users\Monu\Desktop\AWS\monu-key.pem"
$jarFile = "target/hotel-management-system-0.0.1-SNAPSHOT.jar"

Write-Host "📦 Uploading JAR file to EC2..." -ForegroundColor Yellow

# Upload the JAR file to EC2
try {
    scp -i $keyFile $jarFile ${ec2User}@${ec2IP}:/home/${ec2User}/
    Write-Host "✅ Upload successful!" -ForegroundColor Green
} catch {
    Write-Host "❌ Upload failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "💡 Make sure to update the keyFile path in this script" -ForegroundColor Yellow
    exit 1
}

Write-Host "🔄 Restarting application on EC2..." -ForegroundColor Yellow

# SSH into EC2 and restart the application
try {
    ssh -i $keyFile ${ec2User}@${ec2IP} @"
        # Stop existing application
        pkill -f hotel-management-system
        
        # Wait a moment
        sleep 5
        
        # Start the new application
        nohup java -jar hotel-management-system-0.0.1-SNAPSHOT.jar > app.log 2>&1 &
        
        echo '✅ Application restarted!'
        echo '📋 Check logs with: tail -f app.log'
        echo '🌐 API URL: http://$ec2IP:8080'
        echo '🔍 Health check: http://52.66.135.123:8080/api/health'
"@
    Write-Host "✅ Deployment completed!" -ForegroundColor Green
} catch {
    Write-Host "❌ Deployment failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "`n🎉 Deployment Summary:" -ForegroundColor Green
Write-Host "🔗 EC2 API URL: http://$ec2IP:8080" -ForegroundColor Cyan
Write-Host "🔗 Frontend URL: http://hotel-management-ui.s3-website.ap-south-1.amazonaws.com" -ForegroundColor Cyan
Write-Host "🔍 Test Health: http://$ec2IP:8080/api/health" -ForegroundColor Cyan
Write-Host "🏨 Test Hotels: http://$ec2IP:8080/api/hotels" -ForegroundColor Cyan

Write-Host "`n📱 Now you can access from any device:" -ForegroundColor Green
Write-Host "   • Mobile phones" -ForegroundColor White
Write-Host "   • Other computers" -ForegroundColor White
Write-Host "   • Tablets" -ForegroundColor White
Write-Host "   • Any device with internet access" -ForegroundColor White 