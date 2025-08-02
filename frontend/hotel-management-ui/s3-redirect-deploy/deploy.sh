#!/bin/bash

# Bash script for deploying Angular app to S3 with proper routing configuration

# Configuration
BUCKET_NAME="hotel-management-ui"
REGION="ap-south-1"
DIST_FOLDER="../dist/hotel-management-ui"

# Exit on error
set -e

# Build the Angular application
echo "Building Angular application..."
cd ..
ng build --configuration production
cd s3-redirect-deploy

# Check if the bucket exists, create if it doesn't
echo "Checking if bucket exists..."
if ! aws s3 ls "s3://$BUCKET_NAME" 2>&1 > /dev/null; then
    echo "Creating bucket $BUCKET_NAME in region $REGION..."
    aws s3 mb "s3://$BUCKET_NAME" --region $REGION
fi

# Configure bucket for static website hosting
echo "Configuring bucket for static website hosting..."
aws s3 website "s3://$BUCKET_NAME" --index-document index.html --error-document index.html

# Apply website configuration with routing rules
echo "Applying website configuration with routing rules..."
aws s3api put-bucket-website --bucket $BUCKET_NAME --website-configuration file://s3-website-config.json

# Set bucket policy to allow public read access
echo "Setting bucket policy to allow public read access..."
aws s3api put-bucket-policy --bucket $BUCKET_NAME --policy file://bucket-policy.json

# Disable block public access settings
echo "Disabling block public access settings..."
aws s3api put-public-access-block --bucket $BUCKET_NAME --public-access-block-configuration "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"

# Upload the built application to S3
echo "Uploading application to S3..."
aws s3 sync $DIST_FOLDER "s3://$BUCKET_NAME" --delete

# Output the website URL
echo "Deployment completed successfully!"
echo "Website URL: http://$BUCKET_NAME.s3-website.$REGION.amazonaws.com"