#!/bin/bash

# Cloudflare R2 Configuration
# Load from environment variables instead of hardcoded values
ACCOUNT_ID=${R2_ACCOUNT_ID:-""}              # Your Cloudflare account ID
BUCKET_NAME=${R2_BUCKET_NAME:-""}            # Your R2 bucket name
ACCESS_KEY=${R2_ACCESS_KEY:-""}              # Your R2 access key
SECRET_KEY=${R2_SECRET_KEY:-""}              # Your R2 secret key

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Validate required variables
if [ -z "$ACCOUNT_ID" ] || [ -z "$BUCKET_NAME" ] || [ -z "$ACCESS_KEY" ] || [ -z "$SECRET_KEY" ]; then
    echo "Error: Missing required environment variables"
    echo "Required variables:"
    echo "  R2_ACCOUNT_ID  - Your Cloudflare account ID"
    echo "  R2_BUCKET_NAME - Your R2 bucket name"
    echo "  R2_ACCESS_KEY  - Your R2 access key"
    echo "  R2_SECRET_KEY  - Your R2 secret key"
    echo ""
    echo "Please set them in your environment or .env file before running this script."
    echo "Example:"
    echo "  export R2_ACCOUNT_ID=your_account_id"
    echo "  export R2_BUCKET_NAME=your_bucket_name"
    echo "  export R2_ACCESS_KEY=your_access_key"
    echo "  export R2_SECRET_KEY=your_secret_key"
    exit 1
fi

# Create temporary AWS credentials directory if it doesn't exist
mkdir -p ~/.aws

# Create AWS credentials file for R2
cat > ~/.aws/credentials << EOF
[r2]
aws_access_key_id = $ACCESS_KEY
aws_secret_access_key = $SECRET_KEY
EOF

echo "Listing objects from R2 bucket: $BUCKET_NAME"

# List objects and save to JSON file in the script's directory
aws s3api list-objects-v2 \
    --endpoint-url https://$ACCOUNT_ID.r2.cloudflarestorage.com \
    --bucket $BUCKET_NAME \
    --profile r2 \
    --output json > "$SCRIPT_DIR/r2-objects.json"

# Check if the command was successful
if [ $? -eq 0 ]; then
    echo "Success! Objects list saved to $SCRIPT_DIR/r2-objects.json"
    echo "Total objects found: $(jq '.Contents | length' "$SCRIPT_DIR/r2-objects.json")"
else
    echo "Error: Failed to list objects from R2 bucket"
fi

# Clean up credentials file
rm ~/.aws/credentials

# Display a sample of the results
echo -e "\nFirst 5 objects in bucket:"
jq -r '.Contents[0:5][].Key' "$SCRIPT_DIR/r2-objects.json" 