#!/bin/bash

# Exit on error
set -e

echo "Building the application..."
./mvnw clean package -DskipTests

echo "Creating Elastic Beanstalk application..."
aws elasticbeanstalk create-application-version \
    --application-name hotel-management-system \
    --version-label "$1" \
    --source-bundle S3Bucket="your-s3-bucket-name",S3Key="hotel-management-system-$1.jar" \
    --region ap-south-1

echo "Deploying to Elastic Beanstalk..."
aws elasticbeanstalk update-environment \
    --application-name hotel-management-system \
    --environment-name hotel-management-prod \
    --version-label "$1" \
    --region ap-south-1

echo "Deployment initiated. Please check AWS Elastic Beanstalk console for progress."
