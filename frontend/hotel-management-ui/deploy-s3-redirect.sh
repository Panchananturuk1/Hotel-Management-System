#!/bin/bash

echo "==================================================="
echo "S3 Redirect Deployment Script"
echo "==================================================="
echo 

# Check for Node.js installation
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed or not in your PATH."
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check for AWS CLI installation
if ! command -v aws &> /dev/null; then
    echo "Warning: AWS CLI is not installed or not in your PATH."
    echo "You may need to configure AWS credentials manually."
    echo 
    echo "Continuing anyway..."
fi

# Check for required npm packages
if [ ! -d "node_modules/aws-sdk" ]; then
    echo "Installing required npm packages..."
    npm install aws-sdk --no-fund
    if [ $? -ne 0 ]; then
        echo "Error: Failed to install required npm packages."
        exit 1
    fi
fi

echo 
echo "Running S3 redirect deployment script..."
node deploy-s3-redirect.js

if [ $? -ne 0 ]; then
    echo 
    echo "Error: Deployment script failed."
    exit 1
else
    echo 
    echo "Deployment completed successfully!"
    echo 
    echo "You can now access your website at:"
    echo "http://hotel-management-ui.s3-website.ap-south-1.amazonaws.com/"
    echo 
    echo "The root URL should automatically redirect to /hotels"
fi

echo 
echo "Press Enter to continue..."
read