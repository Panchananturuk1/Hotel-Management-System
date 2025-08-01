/**
 * AWS S3 Redirect Deployment Script
 * 
 * This script helps deploy the redirect configuration to your S3 bucket.
 * Before running this script, make sure you have:
 * 1. AWS CLI installed and configured with appropriate credentials
 * 2. Node.js installed
 * 
 * Usage:
 * 1. Install dependencies: npm install
 * 2. Update the BUCKET_NAME constant below
 * 3. Run the script: npm run deploy
 */

const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

// Update these constants with your S3 bucket information
const BUCKET_NAME = 'hotel-management-ui';
const REGION = 'ap-south-1';

// Initialize S3 client
const s3 = new AWS.S3({ region: REGION });

// Function to upload redirect.html to S3
async function uploadRedirectHtml() {
  try {
    const filePath = path.join(__dirname, '..', 'redirect.html');
    const fileContent = fs.readFileSync(filePath);
    
    const params = {
      Bucket: BUCKET_NAME,
      Key: 'index.html', // Upload as index.html
      Body: fileContent,
      ContentType: 'text/html',
      WebsiteRedirectLocation: '/hotels', // Set redirect metadata
      ACL: 'public-read'
    };
    
    console.log('Uploading redirect.html as index.html to S3...');
    const result = await s3.putObject(params).promise();
    console.log('Upload successful:', result);
    
    return result;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

// Function to configure website settings
async function configureWebsiteSettings() {
  try {
    // Read the S3 website configuration file
    const configPath = path.join(__dirname, '..', 's3-website-configuration.json');
    const configContent = fs.readFileSync(configPath, 'utf8');
    const config = JSON.parse(configContent);
    
    const params = {
      Bucket: BUCKET_NAME,
      WebsiteConfiguration: {
        IndexDocument: {
          Suffix: 'index.html'
        },
        RoutingRules: config.RoutingRules
      }
    };
    
    console.log('Configuring S3 bucket website settings...');
    const result = await s3.putBucketWebsite(params).promise();
    console.log('Website configuration successful');
    
    return result;
  } catch (error) {
    console.error('Error configuring website settings:', error);
    throw error;
  }
}

// Main function to run all deployment steps
async function deployRedirect() {
  try {
    console.log(`Starting S3 redirect deployment for bucket: ${BUCKET_NAME}`);
    
    // Upload redirect.html as index.html
    await uploadRedirectHtml();
    
    // Configure website settings
    await configureWebsiteSettings();
    
    console.log('\nDeployment completed successfully!');
    console.log(`Your website should now redirect from the root URL to /hotels`);
    console.log(`Test it at: http://${BUCKET_NAME}.s3-website.${REGION}.amazonaws.com/`);
  } catch (error) {
    console.error('Deployment failed:', error);
  }
}

// Run the deployment
deployRedirect();