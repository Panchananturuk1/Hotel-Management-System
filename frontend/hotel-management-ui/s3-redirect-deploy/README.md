# S3 Redirect Deployment Tool

This directory contains scripts to automate the configuration of AWS S3 bucket redirection for the Hotel Management UI application.

## Purpose

These scripts help configure your S3 bucket to redirect the root URL (`http://hotel-management-ui.s3-website.ap-south-1.amazonaws.com`) to the hotels page (`http://hotel-management-ui.s3-website.ap-south-1.amazonaws.com/hotels`).

## Prerequisites

- Node.js (v12+)
- npm (v6+)
- AWS CLI installed and configured with appropriate credentials
- AWS credentials with permissions to modify S3 bucket configuration

## Configuration

Before running the deployment scripts, you may need to update the following constants in the `deploy-s3-redirect.js` file:

```javascript
// Update these constants with your S3 bucket information
const BUCKET_NAME = 'hotel-management-ui';
const REGION = 'ap-south-1';
```

Change these values to match your S3 bucket name and region if different.

## Usage

### Windows

1. Open Command Prompt or PowerShell
2. Navigate to this directory
3. Run the deployment script:
   ```
   deploy.bat
   ```

### Unix/Linux/Mac

1. Open Terminal
2. Navigate to this directory
3. Make the script executable:
   ```bash
   chmod +x deploy.sh
   ```
4. Run the deployment script:
   ```bash
   ./deploy.sh
   ```

### Manual Execution

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the deployment script:
   ```bash
   npm run deploy
   ```

## What the Script Does

The deployment script performs the following actions:

1. Uploads the `redirect.html` file as `index.html` to your S3 bucket
2. Sets the appropriate metadata for redirection
3. Configures the S3 bucket website settings with routing rules

## Troubleshooting

If you encounter issues during deployment:

1. Check your AWS credentials are properly configured
2. Verify you have the necessary permissions to modify the S3 bucket
3. Ensure the S3 bucket exists and is configured for static website hosting
4. Check the console output for specific error messages

## Testing

After successful deployment, you can test the redirection by:

1. Opening a web browser
2. Navigating to your S3 website endpoint: `http://hotel-management-ui.s3-website.ap-south-1.amazonaws.com/`
3. Verifying you are automatically redirected to the hotels page

Alternatively, use the `test-redirect.html` file in the parent directory to test the redirection.