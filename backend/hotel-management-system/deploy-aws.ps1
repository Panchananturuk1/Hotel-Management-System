# Hotel Management System Deployment Script for Windows
Write-Host "🚀 Starting Hotel Management System Deployment..." -ForegroundColor Green

# Build the application
Write-Host "📦 Building the application..." -ForegroundColor Yellow
mvn clean package -DskipTests

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build successful!" -ForegroundColor Green
} else {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

# Copy JAR to EC2 (replace with your EC2 details)
Write-Host "📤 Uploading to EC2..." -ForegroundColor Yellow
scp -i "your-key.pem" target/hotel-management-system-0.0.1-SNAPSHOT.jar ec2-user@52.66.135.123:/home/ec2-user/

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Upload successful!" -ForegroundColor Green
} else {
    Write-Host "❌ Upload failed! Please check your EC2 connection." -ForegroundColor Red
    exit 1
}

# SSH into EC2 and restart the application
Write-Host "🔄 Restarting application on EC2..." -ForegroundColor Yellow
ssh -i "your-key.pem" ec2-user@52.66.135.123 @"
    # Stop existing application
    pkill -f hotel-management-system
    
    # Wait a moment
    sleep 5
    
    # Start the new application
    nohup java -jar hotel-management-system-0.0.1-SNAPSHOT.jar > app.log 2>&1 &
    
    echo '✅ Application restarted!'
    echo '📋 Check logs with: tail -f app.log'
    echo '🌐 API URL: http://52.66.135.123:8081'
    echo '🔍 Health check: http://52.66.135.123:8081/api/health'
"@

Write-Host "🎉 Deployment completed!" -ForegroundColor Green
Write-Host "🔗 Frontend URL: http://hotel-management-ui.s3-website.ap-south-1.amazonaws.com" -ForegroundColor Cyan
Write-Host "🔗 Backend API: http://52.66.135.123:8081" -ForegroundColor Cyan
Write-Host "🔍 Test API: http://52.66.135.123:8081/api/health" -ForegroundColor Cyan