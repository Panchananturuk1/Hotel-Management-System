#!/bin/bash

# Build the Angular app for production
npm run build:prod

# AWS S3 bucket name
S3_BUCKET="hotel-management-ui"

# Upload the build files to S3
aws s3 sync dist/hotel-management-ui s3://$S3_BUCKET/ --delete

# Set the correct content types for files
aws s3 cp s3://$S3_BUCKET/ s3://$S3_BUCKET/ --recursive --exclude "*" --include "*.js" --content-type "application/javascript" --metadata-directive REPLACE
aws s3 cp s3://$S3_BUCKET/ s3://$S3_BUCKET/ --recursive --exclude "*" --include "*.css" --content-type "text/css" --metadata-directive REPLACE
aws s3 cp s3://$S3_BUCKET/ s3://$S3_BUCKET/ --recursive --exclude "*" --include "*.html" --content-type "text/html" --metadata-directive REPLACE

echo "Deployment to S3 completed successfully!"
