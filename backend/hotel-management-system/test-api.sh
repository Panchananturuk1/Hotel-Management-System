#!/bin/bash

echo "🧪 Testing Hotel Management API Accessibility..."

# Test health endpoint
echo "🔍 Testing health endpoint..."
curl -X GET "http://52.66.135.123:8080/api/health" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json"

echo -e "\n\n🔍 Testing simple test endpoint..."
curl -X GET "http://52.66.135.123:8080/api/health/test" \
  -H "Accept: text/plain"

echo -e "\n\n🏨 Testing hotels endpoint..."
curl -X GET "http://52.66.135.123:8080/api/hotels" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json"

echo -e "\n\n✅ API testing completed!"
echo "🌐 If you can see JSON responses above, the API is accessible from external devices."
echo "🔗 Frontend should now work from any device: http://hotel-management-ui.s3-website.ap-south-1.amazonaws.com" 