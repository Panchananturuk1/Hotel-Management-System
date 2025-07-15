#!/bin/bash

# Get all hotels
echo "\nFetching all hotels:"
curl -X GET http://localhost:8080/api/hotels

# Get specific hotel by ID (example with ID 1)
echo "\nFetching hotel with ID 1:"
curl -X GET http://localhost:8080/api/hotels/1

# Add headers for better formatting (optional)
echo "\nFetching all hotels with headers:"
curl -X GET -H "Accept: application/json" http://localhost:8080/api/hotels

# Pretty print JSON response (using jq if available)
echo "\nFetching all hotels with pretty print:"
curl -X GET http://localhost:8080/api/hotels | jq .
