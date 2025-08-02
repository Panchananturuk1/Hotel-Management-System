# PowerShell script for deploying Angular app to S3 with CloudFront for HTTPS support

# Configuration
$BucketName = "hotel-management-ui"
$Region = "ap-south-1"
$DistFolder = "..\dist\hotel-management-ui"
$CloudFrontConfigFile = "cloudfront-config.json"

# Build the Angular application
Write-Host "Building Angular application..."
Push-Location ..
try {
    ng build --configuration production
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Angular build failed with exit code $LASTEXITCODE"
        exit 1
    }
} finally {
    Pop-Location
}

# Check if the bucket exists, create if it doesn't
Write-Host "Checking if bucket exists..."
$bucketExists = aws s3 ls "s3://$BucketName" 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Creating bucket $BucketName in region $Region..."
    aws s3 mb "s3://$BucketName" --region $Region
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to create bucket"
        exit 1
    }
}

# Configure bucket for static website hosting
Write-Host "Configuring bucket for static website hosting..."
aws s3 website "s3://$BucketName" --index-document index.html --error-document index.html
if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to configure bucket for static website hosting"
    exit 1
}

# Apply website configuration with routing rules
Write-Host "Applying website configuration with routing rules..."
aws s3api put-bucket-website --bucket $BucketName --website-configuration file://s3-website-config.json
if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to apply website configuration"
    exit 1
}

# Set bucket policy to allow public read access
Write-Host "Setting bucket policy to allow public read access..."
aws s3api put-bucket-policy --bucket $BucketName --policy file://bucket-policy.json
if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to set bucket policy"
    exit 1
}

# Disable block public access settings
Write-Host "Disabling block public access settings..."
aws s3api put-public-access-block --bucket $BucketName --public-access-block-configuration "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"
if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to disable block public access settings"
    exit 1
}

# Upload the built application to S3
Write-Host "Uploading application to S3..."
aws s3 sync $DistFolder "s3://$BucketName" --delete
if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to upload application to S3"
    exit 1
}

# Check if CloudFront distribution already exists
Write-Host "Checking for existing CloudFront distributions..."
$distributions = aws cloudfront list-distributions | ConvertFrom-Json
$existingDistribution = $distributions.DistributionList.Items | Where-Object { $_.Origins.Items[0].DomainName -like "*$BucketName*" }

if ($existingDistribution) {
    $distributionId = $existingDistribution.Id
    Write-Host "Found existing CloudFront distribution: $distributionId"
    
    # Update the existing distribution
    Write-Host "Updating CloudFront distribution..."
    aws cloudfront update-distribution --id $distributionId --distribution-config file://$CloudFrontConfigFile
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to update CloudFront distribution"
        exit 1
    }
} else {
    # Create a new CloudFront distribution
    Write-Host "Creating new CloudFront distribution..."
    $result = aws cloudfront create-distribution --distribution-config file://$CloudFrontConfigFile
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to create CloudFront distribution"
        exit 1
    }
    
    $distributionInfo = $result | ConvertFrom-Json
    $distributionId = $distributionInfo.Distribution.Id
    $distributionDomain = $distributionInfo.Distribution.DomainName
}

# Wait for CloudFront distribution to deploy
Write-Host "Waiting for CloudFront distribution to deploy (this may take 5-10 minutes)..."
aws cloudfront wait distribution-deployed --id $distributionId
if ($LASTEXITCODE -ne 0) {
    Write-Warning "Failed to wait for CloudFront distribution deployment. It may still be in progress."
}

# Get the CloudFront domain name
$distributionInfo = aws cloudfront get-distribution --id $distributionId | ConvertFrom-Json
$distributionDomain = $distributionInfo.Distribution.DomainName

# Output the website URLs
Write-Host "Deployment completed successfully!"
Write-Host "S3 Website URL (HTTP): http://$BucketName.s3-website.$Region.amazonaws.com"
Write-Host "CloudFront URL (HTTPS): https://$distributionDomain"
Write-Host "Note: It may take up to 15 minutes for the CloudFront distribution to fully deploy."