# 🚀 Hotel Management System - External Access Guide

## 📋 Overview
This guide will help you deploy and access your Hotel Management System from any device (mobile, tablet, other computers, etc.).

## 🎯 Current Status
✅ **Local Development**: Working perfectly  
✅ **CORS Configuration**: Fixed and optimized  
✅ **Server Binding**: Configured for external access  
✅ **Database**: Connected to AWS RDS MySQL  
✅ **Build**: Successfully compiled  

## 🚀 Deployment Options

### Option 1: Deploy to EC2 (Recommended)

#### Prerequisites
- AWS EC2 instance running (you already have one at `52.66.135.123`)
- SSH key file for EC2 access
- Java 17+ installed on EC2

#### Step 1: Update Deployment Script
Edit `deploy-to-ec2.ps1` and update the key file path:
```powershell
$keyFile = "C:\path\to\your\ec2-key.pem"  # Update this path
```

#### Step 2: Deploy
```powershell
.\deploy-to-ec2.ps1
```

#### Step 3: Test Deployment
```powershell
.\test-ec2-api.ps1
```

### Option 2: Manual Deployment

#### Step 1: Upload JAR to EC2
```bash
scp -i your-key.pem target/hotel-management-system-0.0.1-SNAPSHOT.jar ec2-user@52.66.135.123:/home/ec2-user/
```

#### Step 2: SSH into EC2 and Start Application
```bash
ssh -i your-key.pem ec2-user@52.66.135.123

# Stop existing application
pkill -f hotel-management-system

# Start new application
nohup java -jar hotel-management-system-0.0.1-SNAPSHOT.jar > app.log 2>&1 &

# Check if it's running
tail -f app.log
```

## 🌐 Access URLs

### After Deployment
- **Backend API**: `http://52.66.135.123:8080`
- **Frontend**: `http://hotel-management-ui.s3-website.ap-south-1.amazonaws.com`
- **Health Check**: `http://52.66.135.123:8080/api/health`
- **Hotels Data**: `http://52.66.135.123:8080/api/hotels`

## 📱 Testing from Different Devices

### 1. Mobile Phone
1. Open browser on your phone
2. Navigate to: `http://52.66.135.123:8080/api/health`
3. Should see: `{"status":"UP","message":"Hotel Management API is running"}`

### 2. Other Computer
1. Open browser on another computer
2. Navigate to: `http://52.66.135.123:8080/api/hotels`
3. Should see JSON data with hotel information

### 3. Frontend Application
1. Open: `http://hotel-management-ui.s3-website.ap-south-1.amazonaws.com`
2. The frontend should automatically connect to the EC2 backend

## 🔧 Troubleshooting

### If EC2 deployment fails:
1. **Check EC2 Security Group**: Ensure port 8080 is open
2. **Check Java installation**: `java -version` on EC2
3. **Check application logs**: `tail -f app.log` on EC2
4. **Check if port is in use**: `netstat -tulpn | grep 8080`

### If external access fails:
1. **Check firewall settings** on your local network
2. **Try different network** (mobile hotspot, different WiFi)
3. **Check EC2 public IP** hasn't changed
4. **Verify security group** allows inbound traffic on port 8080

## 📊 Expected Results

### Successful Deployment
- ✅ Health endpoint returns: `{"status":"UP","message":"Hotel Management API is running"}`
- ✅ Hotels endpoint returns JSON with 7+ hotels
- ✅ Rooms endpoint returns JSON with room data
- ✅ Frontend loads and displays hotel data
- ✅ Accessible from mobile, tablet, and other computers

### API Endpoints Available
- `GET /api/health` - Health check
- `GET /api/health/test` - Simple test message
- `GET /api/hotels` - List all hotels
- `GET /api/rooms` - List all rooms
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration

## 🎉 Success Indicators

When everything is working correctly, you should be able to:
1. **Access from your phone**: Open the frontend URL and see hotel data
2. **Access from other computers**: Same frontend URL works
3. **API calls work**: Direct API calls return JSON data
4. **No CORS errors**: Browser console shows no cross-origin errors
5. **Database connected**: Data is being fetched from AWS RDS

## 🔄 Next Steps

1. **Deploy the updated application** using the provided scripts
2. **Test from your mobile phone** using the frontend URL
3. **Test from another computer** on a different network
4. **Monitor the application logs** on EC2 for any issues
5. **Consider setting up monitoring** and automatic restarts

## 📞 Support

If you encounter issues:
1. Check the application logs on EC2
2. Verify network connectivity
3. Test individual endpoints
4. Ensure all prerequisites are met

---

**🎯 Goal**: Access your hotel management system from any device, anywhere in the world! 