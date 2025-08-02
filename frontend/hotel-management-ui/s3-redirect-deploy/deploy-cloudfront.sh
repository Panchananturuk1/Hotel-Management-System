#!/bin/bash

# Bash script for deploying Angular app to S3 with CloudFront for HTTPS support

# Configuration
BUCKET_NAME="hotel-management-ui"
REGION="ap-south-1"
DIST_FOLDER="../dist/hotel-management-ui"
CLOUDFRONT_CONFIG_FILE="cloudfront-config.json"

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

# Check if CloudFront distribution already exists
echo "Checking for existing CloudFront distributions..."
DISTRIBUTIONS=$(aws cloudfront list-distributions)
EXISTING_DISTRIBUTION_ID=$(echo "$DISTRIBUTIONS" | jq -r ".DistributionList.Items[] | select(.Origins.Items[0].DomainName | contains(\"$BUCKET_NAME\")) | .Id" | head -n 1)

if [ -n "$EXISTING_DISTRIBUTION_ID" ]; then
    echo "Found existing CloudFront distribution: $EXISTING_DISTRIBUTION_ID"
    
    # Update the existing distribution
    echo "Updating CloudFront distribution..."
    aws cloudfront update-distribution --id "$EXISTING_DISTRIBUTION_ID" --distribution-config file://$CLOUDFRONT_CONFIG_FILE
else
    # Create a new CloudFront distribution
    echo "Creating new CloudFront distribution..."
    DISTRIBUTION_RESULT=$(aws cloudfront create-distribution --distribution-config file://$CLOUDFRONT_CONFIG_FILE)
    EXISTING_DISTRIBUTION_ID=$(echo "$DISTRIBUTION_RESULT" | jq -r ".Distribution.Id")
    DISTRIBUTION_DOMAIN=$(echo "$DISTRIBUTION_RESULT" | jq -r ".Distribution.DomainName")
fi

# Wait for CloudFront distribution to deploy
echo "Waiting for CloudFront distribution to deploy (this may take 5-10 minutes)..."
aws cloudfront wait distribution-deployed --id "$EXISTING_DISTRIBUTION_ID" || {
    echo "Warning: Failed to wait for CloudFront distribution deployment. It may still be in progress."
}

# Get the CloudFront domain name
DISTRIBUTION_INFO=$(aws cloudfront get-distribution --id "$EXISTING_DISTRIBUTION_ID")
DISTRIBUTION_DOMAIN=$(echo "$DISTRIBUTION_INFO" | jq -r ".Distribution.DomainName")

# Output the website URLs
echo "Deployment completed successfully!"
echo "S3 Website URL (HTTP): http://$BUCKET_NAME.s3-website.$REGION.amazonaws.com"
echo "CloudFront URL (HTTPS): https://$DISTRIBUTION_DOMAIN"
echo "Note: It may take up to 15 minutes for the CloudFront distribution to fully deploy."