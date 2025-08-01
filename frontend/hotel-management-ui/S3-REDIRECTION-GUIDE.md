# AWS S3 Bucket URL Redirection Guide

This guide provides detailed instructions for configuring your AWS S3 bucket to redirect the root URL to the hotels page.

## Problem

Currently, accessing the root URL `http://hotel-management-ui.s3-website.ap-south-1.amazonaws.com` does not automatically redirect to the hotels page. We want visitors to be automatically redirected to `http://hotel-management-ui.s3-website.ap-south-1.amazonaws.com/hotels` when they access the root URL.

## Solution

AWS S3 static website hosting provides routing rules that can be configured to redirect requests based on specific conditions. We'll use these routing rules to redirect requests from the root URL to the hotels page.

## Implementation Steps

1. **Log in to AWS Management Console**
   - Go to https://console.aws.amazon.com/
   - Sign in with your AWS account credentials

2. **Navigate to S3**
   - From the AWS Management Console, search for "S3" or find it under the Services menu
   - Click on "S3" to open the S3 dashboard

3. **Select Your Bucket**
   - Find and click on your bucket named "hotel-management-ui"

4. **Configure Static Website Hosting**
   - Click on the "Properties" tab
   - Scroll down to find "Static website hosting"
   - Click "Edit"

5. **Enable Static Website Hosting**
   - Ensure "Static website hosting" is enabled
   - Select "Host a static website"
   - Set "Index document" to `index.html`

6. **Add Redirection Rules**
   - Scroll down to the "Redirection rules" section
   - Add the following JSON configuration in the text box:

   ```json
   {
     "RoutingRules": [
       {
         "Condition": {
           "KeyPrefixEquals": ""
         },
         "Redirect": {
           "ReplaceKeyWith": "hotels"
         }
       }
     ]
   }
   ```

7. **Save Changes**
   - Click "Save changes" at the bottom of the page

8. **Test the Redirection**
   - Open a new browser tab
   - Navigate to your S3 website endpoint: `http://hotel-management-ui.s3-website.ap-south-1.amazonaws.com`
   - You should be automatically redirected to `http://hotel-management-ui.s3-website.ap-south-1.amazonaws.com/hotels`

## Alternative Configuration

If the above configuration doesn't work, you can try an alternative approach:

1. Create an empty object with the key `/` in your S3 bucket
2. Set the website redirect location property for this object to `/hotels`

This can be done through the S3 console:

1. Upload an empty file to your bucket
2. Select the file and click "Properties"
3. Under "Metadata", add a new metadata entry with the key `x-amz-website-redirect-location` and the value `/hotels`

## Troubleshooting

If the redirection is not working as expected:

1. **Check Bucket Permissions**
   - Ensure your bucket has the appropriate permissions for public access
   - Verify that the bucket policy allows GetObject actions

2. **Clear Browser Cache**
   - Try accessing the URL in an incognito/private browsing window
   - Clear your browser cache and try again

3. **Check for Syntax Errors**
   - Ensure the JSON configuration is valid with no syntax errors
   - Use a JSON validator if necessary

4. **Wait for Propagation**
   - Changes to S3 configuration may take a few minutes to propagate
   - Wait a few minutes and try again

## Additional Resources

- [AWS S3 Static Website Hosting Documentation](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html)
- [AWS S3 Redirection Rules Documentation](https://docs.aws.amazon.com/AmazonS3/latest/userguide/how-to-page-redirect.html)