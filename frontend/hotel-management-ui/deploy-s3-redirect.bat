@echo off
echo ===================================================
echo S3 Redirect Deployment Script
echo ===================================================
echo.

echo Checking for Node.js installation...
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Error: Node.js is not installed or not in your PATH.
    echo Please install Node.js from https://nodejs.org/
    exit /b 1
)

echo Checking for AWS CLI installation...
where aws >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Warning: AWS CLI is not installed or not in your PATH.
    echo You may need to configure AWS credentials manually.
    echo.
)

echo Checking for required npm packages...
if not exist node_modules\aws-sdk (
    echo Installing required npm packages...
    call npm install aws-sdk --no-fund
    if %ERRORLEVEL% neq 0 (
        echo Error: Failed to install required npm packages.
        exit /b 1
    )
)

echo.
echo Running S3 redirect deployment script...
node deploy-s3-redirect.js

if %ERRORLEVEL% neq 0 (
    echo.
    echo Error: Deployment script failed.
    exit /b 1
) else (
    echo.
    echo Deployment completed successfully!
    echo.
    echo You can now access your website at:
    echo http://hotel-management-ui.s3-website.ap-south-1.amazonaws.com/
    echo.
    echo The root URL should automatically redirect to /hotels
)

pause