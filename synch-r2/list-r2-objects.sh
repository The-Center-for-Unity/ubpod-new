#!/bin/bash

# Cloudflare R2 Configuration
# Replace these values with your actual credentials
ACCOUNT_ID="9ff67f45aeca1e6dece597d4e01c13fa"              # Your Cloudflare account ID
BUCKET_NAME="discover-jesus-audio-discussions"            # Your R2 bucket name
ACCESS_KEY="6e9e430fb45886cbf094b30b1475b628"            # Your R2 access key
SECRET_KEY="66700ca47d923de06b36fd13c77992b51a10fdb68a3efbeef82593db2b9c048f"            # Your R2 secret key

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Validate required variables
if [ -z "$ACCOUNT_ID" ] || [ -z "$BUCKET_NAME" ] || [ -z "$ACCESS_KEY" ] || [ -z "$SECRET_KEY" ]; then
    echo "Error: Please set all required variables in the script"
    echo "Required variables:"
    echo "  ACCOUNT_ID  - Your Cloudflare account ID"
    echo "  BUCKET_NAME - Your R2 bucket name"
    echo "  ACCESS_KEY  - Your R2 access key"
    echo "  SECRET_KEY  - Your R2 secret key"
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