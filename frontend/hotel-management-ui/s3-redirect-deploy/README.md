# S3 Deployment Guide for Hotel Management UI

## Overview

This guide provides instructions for deploying the Angular application to AWS S3 static website hosting with proper routing configuration to handle client-side routing. The configuration solves the common issue where direct access to routes like `/hotels` returns a 403 Forbidden error.

## Prerequisites

- AWS CLI installed and configured with appropriate credentials
- Angular application built for production

## Understanding the Problem

When deploying an Angular application to S3 static website hosting, direct access to routes like `http://hotel-management-ui.s3-website.ap-south-1.amazonaws.com/hotels` can result in 403 Forbidden errors. This happens because:

1. S3 looks for a file at the path `/hotels` which doesn't exist
2. By default, S3 returns a 403 error when a file is not found
3. Angular's client-side routing needs all routes to serve the `index.html` file

## Solution

The solution involves configuring the S3 bucket with:

1. Proper website configuration with routing rules
2. Appropriate bucket policy for public access
3. Disabled block public access settings

## Files in this Directory

- `s3-website-config.json`: S3 website configuration with routing rules
- `bucket-policy.json`: S3 bucket policy for public read access
- `deploy.ps1`: PowerShell deployment script for S3
- `deploy.sh`: Bash deployment script for S3
- `deploy-cloudfront.ps1`: PowerShell deployment script for S3 + CloudFront (HTTPS)
- `deploy-cloudfront.sh`: Bash deployment script for S3 + CloudFront (HTTPS)
- `cloudfront-config.json`: CloudFront distribution configuration
- `error.html`: Custom error page for S3 (optional)
- `test.html`: Test file to verify S3 configuration

## Deployment Options

### Option 1: S3 Only (HTTP)

This option deploys your Angular app to S3 static website hosting. It's simpler but only supports HTTP (not HTTPS).

#### For Windows (PowerShell)

```powershell
.\deploy.ps1
```

#### For Linux/macOS (Bash)

```bash
chmod +x ./deploy.sh
./deploy.sh
```

### Option 2: S3 + CloudFront (HTTPS)

This option deploys your Angular app to S3 and creates a CloudFront distribution in front of it. This provides HTTPS support and better performance through CDN caching.

#### For Windows (PowerShell)

```powershell
.\deploy-cloudfront.ps1
```

#### For Linux/macOS (Bash)

```bash
chmod +x ./deploy-cloudfront.sh
./deploy-cloudfront.sh
```

### Option 3: Manual Deployment

#### 1. Build the Angular application

```bash
ng build --configuration production
```

This will create a `dist/hotel-management-ui` folder with the production build.

#### 2. Create or update S3 bucket for static website hosting

```bash
aws s3 mb s3://hotel-management-ui --region ap-south-1
```

#### 3. Configure S3 bucket for static website hosting with routing rules

```bash
aws s3api put-bucket-website --bucket hotel-management-ui --website-configuration file://s3-redirect-deploy/s3-website-config.json
```

#### 4. Set bucket policy to allow public read access

```bash
aws s3api put-bucket-policy --bucket hotel-management-ui --policy file://s3-redirect-deploy/bucket-policy.json
```

#### 5. Disable block public access settings

```bash
aws s3api put-public-access-block --bucket hotel-management-ui --public-access-block-configuration "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"
```

#### 6. Upload the built application to S3

```bash
aws s3 sync dist/hotel-management-ui/ s3://hotel-management-ui --delete
```

## Testing the Configuration

Before deploying the full Angular application, you can test if the S3 bucket is correctly configured by:

1. Uploading the `test.html` file as `index.html` to your S3 bucket:

```bash
aws s3 cp s3-redirect-deploy/test.html s3://hotel-management-ui/index.html
```

2. Visit the S3 website URL: http://hotel-management-ui.s3-website.ap-south-1.amazonaws.com

3. Click on the test links to verify that routing is working correctly

## Troubleshooting

### 403 Forbidden / Access Denied

If you encounter a 403 Forbidden error:

1. Verify that the bucket policy is correctly applied
2. Ensure the S3 bucket has public access enabled (unblock all public access settings)
3. Check that the website configuration is properly set up

### Routing Issues

If direct URLs like `/hotels` return 403 errors:

1. Ensure the routing rules in `s3-website-config.json` are correctly configured
2. Verify that the error document is set to `index.html`
3. Make sure the Angular app's routing module has the appropriate routes defined

### CORS Issues

If you experience CORS issues when the application makes API calls:

1. Configure CORS on your API server to allow requests from the S3 website domain
2. Alternatively, use the CloudFront deployment option with a custom domain

### CloudFront Issues

If you're using CloudFront and experiencing issues:

1. CloudFront distributions take 5-15 minutes to deploy changes
2. Check that the origin domain name is correctly set to your S3 website endpoint (not the S3 bucket endpoint)
3. Verify that the error responses are configured to redirect to `/index.html`

## Important Notes

- The S3 bucket name must match the one in the configuration files
- The bucket policy grants public read access to all objects in the bucket
- The routing rules redirect 403 and 404 errors to the index.html file, allowing Angular's router to handle the routing
- S3 website hosting only supports HTTP, not HTTPS. For HTTPS, use the CloudFront deployment option
- CloudFront provides HTTPS, better performance, and additional security features