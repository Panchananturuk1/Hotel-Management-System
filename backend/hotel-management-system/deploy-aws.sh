#!/bin/bash

echo "🚀 Starting Hotel Management System Deployment..."

# Build the application
echo "📦 Building the application..."
mvn clean package -DskipTests

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed!"
    exit 1
fi

# Copy JAR to EC2 (replace with your EC2 details)
echo "📤 Uploading to EC2..."
scp -i "your-key.pem" target/hotel-management-system-0.0.1-SNAPSHOT.jar ec2-user@52.66.135.123:/home/ec2-user/

if [ $? -eq 0 ]; then
    echo "✅ Upload successful!"
else
    echo "❌ Upload failed! Please check your EC2 connection."
    exit 1
fi

# SSH into EC2 and restart the application
echo "🔄 Restarting application on EC2..."
ssh -i "your-key.pem" ec2-user@52.66.135.123 << 'EOF'
    # Stop existing application
    pkill -f hotel-management-system
    
    # Wait a moment
    sleep 5
    
    # Start the new application
    nohup java -jar hotel-management-system-0.0.1-SNAPSHOT.jar > app.log 2>&1 &
    
    echo "✅ Application restarted!"
    echo "📋 Check logs with: tail -f app.log"
    echo "🌐 API URL: http://52.66.135.123:8080"
    echo "🔍 Health check: http://52.66.135.123:8080/api/health"
EOF

echo "🎉 Deployment completed!"
echo "🔗 Frontend URL: http://hotel-management-ui.s3-website.ap-south-1.amazonaws.com"
echo "🔗 Backend API: http://52.66.135.123:8080"
echo "🔍 Test API: http://52.66.135.123:8080/api/health"
