# Synchronizing Audio from Cloudflare R2

This guide explains how to handle audio files stored in Cloudflare R2, focusing on correctly retrieving file URLs that contain special characters.

## The Problem

When sharing R2 URLs that contain special characters like apostrophes (`'`), these characters may be converted to underscores (`_`) in the URL. For example:

- Original filename: `Event - Jesus' First Passover - Age 13.mp3`
- Problematic URL: `https://pub-111d6f5663274cc5aefdcc72206eec40.r2.dev/Event%20-%20Jesus_%20First%20Passover%20-%20Age%2013.mp3`
- Correct URL: `https://pub-111d6f5663274cc5aefdcc72206eec40.r2.dev/Event%20-%20Jesus%27%20First%20Passover%20-%20Age%2013.mp3`

This causes audio playback issues when the application tries to access files using the incorrect URL format.

## Solutions

There are several approaches to solving this issue:

1. Create a mapping table of exact URLs
2. Implement URL encoding fixes in the application
3. Add error handling with fallback URLs

## Getting Cloudflare R2 Credentials

To access your R2 bucket programmatically, you'll need to obtain the following credentials:

### 1. Get Your Cloudflare Account ID

1. Log in to your Cloudflare dashboard at https://dash.cloudflare.com/
2. Your Account ID is in the URL after you log in: `https://dash.cloudflare.com/<ACCOUNT_ID>/...`
3. You can also find it in the right sidebar on the dashboard overview page

### 2. Find Your R2 Bucket Name

1. In the Cloudflare dashboard, click on "R2" in the left sidebar
2. You'll see a list of your buckets - note the name of the bucket containing your audio files

### 3. Create API Tokens for R2 Access

#### Option A: Create API Token (Recommended)
1. In the Cloudflare dashboard, click on "My Profile" (top right)
2. Select "API Tokens" from the left menu
3. Click "Create Token"
4. Choose "Create Custom Token"
5. Set a name (e.g., "R2 Access")
6. Under "Permissions":
   - Select "Account" as Resource type
   - Select "Workers R2 Storage" as Resource
   - Select "Read" or "Edit" as Permission level (depending on your needs)
7. Under "Account Resources":
   - Select your account
   - Select the specific bucket or "All buckets"
8. Add any IP restrictions if needed
9. Click "Continue to summary" then "Create Token"
10. **Copy and save your token immediately** (it won't be shown again)

#### Option B: Create S3-Compatible API Keys
1. In the Cloudflare dashboard, go to "R2"
2. Click on "Manage R2 API Tokens" in the sidebar
3. Under "S3 Auth Tokens", click "Create Token"
4. Give it a name (e.g., "R2 S3 Access")
5. Select the permissions (read or read+write)
6. Click "Create Token"
7. You'll see an "Access Key ID" and "Secret Access Key"
8. **Save both values immediately** (the Secret Access Key won't be shown again)

## Listing Objects in Your R2 Bucket

### Simple Bash Script Approach

Create a file called `list-r2-objects.sh`:

```bash
#!/bin/bash

# Your Cloudflare details
ACCOUNT_ID="your-account-id"
BUCKET_NAME="your-bucket-name"
ACCESS_KEY="your-access-key"
SECRET_KEY="your-secret-key"

# Create a temporary AWS credentials file
mkdir -p ~/.aws
cat > ~/.aws/credentials << EOF
[r2]
aws_access_key_id = $ACCESS_KEY
aws_secret_access_key = $SECRET_KEY
EOF

# List objects in JSON format
aws s3api list-objects-v2 \
  --endpoint-url https://$ACCOUNT_ID.r2.cloudflarestorage.com \
  --bucket $BUCKET_NAME \
  --profile r2 \
  --output json > r2-objects.json

echo "Objects list saved to r2-objects.json"

# Clean up
rm ~/.aws/credentials
```

Make the script executable and run it:

```bash
chmod +x list-r2-objects.sh
./list-r2-objects.sh
```

### Using AWS CLI Directly

If you already have AWS CLI installed and configured:

```bash
# Configure a profile with your R2 credentials
aws configure --profile r2
# Enter your Access Key ID and Secret Access Key
# Set region to "auto"
# Set output format to "json"

# List objects in JSON format
aws s3api list-objects-v2 \
  --endpoint-url https://<ACCOUNT_ID>.r2.cloudflarestorage.com \
  --bucket <BUCKET_NAME> \
  --profile r2 \
  --output json > r2-objects.json
```

### Using Node.js

For a more programmatic approach, you can use Node.js with the AWS SDK:

```javascript
// list-r2-objects.js
const { S3Client, ListObjectsV2Command } = require('@aws-sdk/client-s3');
const fs = require('fs');

// R2 credentials
const R2_ACCOUNT_ID = 'your-account-id';
const R2_ACCESS_KEY_ID = 'your-access-key-id';
const R2_SECRET_ACCESS_KEY = 'your-secret-access-key';
const R2_BUCKET_NAME = 'your-bucket-name';

// Initialize S3 client with R2 endpoint
const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY
  }
});

// Function to list all objects in the bucket
async function listAllObjects() {
  const allObjects = [];
  let continuationToken = undefined;
  
  do {
    const command = new ListObjectsV2Command({
      Bucket: R2_BUCKET_NAME,
      MaxKeys: 1000,
      ContinuationToken: continuationToken
    });
    
    const response = await s3Client.send(command);
    
    if (response.Contents) {
      allObjects.push(...response.Contents);
    }
    
    continuationToken = response.NextContinuationToken;
  } while (continuationToken);
  
  return allObjects;
}

// Main function
async function createUrlMappingTable() {
  try {
    console.log('Listing all objects in R2 bucket...');
    const objects = await listAllObjects();
    
    // Generate URL mapping
    const urlMapping = {};
    const publicUrlBase = `https://pub-${R2_ACCOUNT_ID}.r2.dev`;
    
    objects.forEach(obj => {
      const key = obj.Key;
      
      // Create a reference ID based on filename pattern
      // This assumes keys like "audio/jesus-1/Event - Jesus' First Passover - Age 13.mp3"
      const parts = key.split('/');
      if (parts.length >= 2) {
        const seriesId = parts[1];
        const filename = parts[parts.length - 1];
        
        // Create a simple ID from the filename (remove extension and special chars)
        const simpleId = filename
          .replace(/\.[^.]+$/, '')                  // Remove extension
          .replace(/[^a-zA-Z0-9]/g, '-')           // Replace special chars with hyphens
          .toLowerCase();
        
        // Store both the sanitized key for code reference and the exact URL
        urlMapping[`${seriesId}/${simpleId}`] = {
          exactUrl: `${publicUrlBase}/${key}`,
          originalKey: key,
          title: filename.replace(/\.[^.]+$/, '')   // Filename without extension
        };
      }
    });
    
    // Write to file
    fs.writeFileSync(
      'r2-url-mapping.json', 
      JSON.stringify(urlMapping, null, 2)
    );
    
    console.log(`Created mapping for ${Object.keys(urlMapping).length} objects`);
    console.log('Mapping saved to r2-url-mapping.json');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

createUrlMappingTable();
```

Run this script with:

```bash
npm install @aws-sdk/client-s3
node list-r2-objects.js
```

## Creating a URL Mapping Table

Once you have the list of objects, you can create a mapping table to use in your application:

```javascript
// process-r2-objects.js
const fs = require('fs');

// Read the R2 objects JSON file
const r2Objects = JSON.parse(fs.readFileSync('r2-objects.json', 'utf8'));

// Create a mapping table
const urlMapping = {};
const PUBLIC_URL_BASE = 'https://pub-111d6f5663274cc5aefdcc72206eec40.r2.dev'; // Replace with your R2 URL

if (r2Objects.Contents) {
  r2Objects.Contents.forEach(obj => {
    const key = obj.Key;
    
    // Skip non-audio files or directories
    if (!key.match(/\.(mp3|m4a|wav)$/i)) return;
    
    // Parse the key to extract series and episode info
    const parts = key.split('/');
    if (parts.length < 2) return;
    
    const seriesId = parts[0] === 'audio' && parts.length > 1 ? parts[1] : parts[0];
    const filename = parts[parts.length - 1];
    
    // Create a normalized episode ID (without special chars)
    const episodeId = filename
      .replace(/\.[^.]+$/, '')              // Remove extension
      .replace(/[^a-zA-Z0-9]/g, '-')        // Replace special chars with hyphens
      .toLowerCase();
    
    // Store in mapping table
    urlMapping[`${seriesId}/${episodeId}`] = {
      exactUrl: `${PUBLIC_URL_BASE}/${key}`,
      originalKey: key,
      title: filename.replace(/\.[^.]+$/, '') // Filename without extension
    };
  });
}

// Write the mapping table to a file
fs.writeFileSync(
  'src/data/r2-url-mapping.json',
  JSON.stringify(urlMapping, null, 2)
);

console.log(`Created mapping for ${Object.keys(urlMapping).length} audio files`);
```

## Integrating with Your Application

### 1. Create a Utility Function

```typescript
// src/utils/r2UrlMapping.ts
import urlMapping from '../data/r2-url-mapping.json';

/**
 * Get the exact R2 URL for an episode
 * @param seriesId The series ID
 * @param episodeId The episode ID or slug
 * @returns The exact URL from R2 or null if not found
 */
export function getExactR2Url(seriesId: string, episodeId: string): string | null {
  // Create a normalized version of the episode ID
  const normalizedEpisodeId = episodeId
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-');
    
  const key = `${seriesId}/${normalizedEpisodeId}`;
  return urlMapping[key]?.exactUrl || null;
}
```

### 2. Update Your Audio Player Component

```tsx
// src/components/audio/AudioPlayer.tsx
import React, { useState } from 'react';
import { getExactR2Url } from '../../utils/r2UrlMapping';

interface AudioPlayerProps {
  seriesId: string;
  episodeId: string;
  fallbackUrl?: string; // Original URL calculation as fallback
}

export function AudioPlayer({ seriesId, episodeId, fallbackUrl }: AudioPlayerProps) {
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [error, setError] = useState(false);
  
  React.useEffect(() => {
    // Try to get the exact URL from our mapping
    const exactUrl = getExactR2Url(seriesId, episodeId);
    setAudioSrc(exactUrl || fallbackUrl || null);
  }, [seriesId, episodeId, fallbackUrl]);
  
  const handleError = () => {
    if (!error && fallbackUrl && audioSrc !== fallbackUrl) {
      // Try the fallback if the exact URL fails
      setError(true);
      setAudioSrc(fallbackUrl);
      console.warn('Using fallback URL after primary URL failed');
    }
  };
  
  if (!audioSrc) {
    return <div className="error-message">Audio source not found</div>;
  }
  
  return (
    <div className="audio-player">
      <audio 
        src={audioSrc} 
        controls 
        onError={handleError}
        className="w-full"
      />
      <a 
        href={audioSrc} 
        download 
        className="text-xs text-blue-400 hover:underline mt-1"
      >
        Download Audio
      </a>
    </div>
  );
}
```

### 3. Fix URL Encoding in Your getAssetUrl Function

If you have an existing function that generates R2 URLs, update it to handle special characters properly:

```typescript
// src/config/assets.ts
import { SeriesType } from '../types/index';
import { getExactR2Url } from '../utils/r2UrlMapping';

// Configure R2 base URL - replace with actual URL in production
const R2_BASE_URL = "https://pub-111d6f5663274cc5aefdcc72206eec40.r2.dev";

/**
 * Get the URL for an asset, determining whether it should come from R2 or local storage
 * @param path The asset path
 * @param type The asset type (audio, image, pdf)
 * @returns The full URL to the asset
 */
export const getAssetUrl = (path: string, type: 'audio' | 'image' | 'pdf' = 'audio'): string => {
  // Extract series and episode ID from path
  const pathParts = path.split('/');
  if (pathParts.length >= 3 && type === 'audio') {
    const seriesId = pathParts[1];
    const filename = pathParts[pathParts.length - 1];
    const episodeId = filename.replace(/\.[^.]+$/, ''); // Remove extension
    
    // Try to get the exact URL from our mapping
    const exactUrl = getExactR2Url(seriesId, episodeId);
    if (exactUrl) return exactUrl;
  }
  
  // Fallback to original logic
  const seriesId = pathParts.length > 1 ? pathParts[1] : '';
  
  // Files come from R2
  if (isSeriesInR2(seriesId as SeriesType)) {
    // Make sure the path doesn't start with a slash when appending to R2 URL
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    
    // Properly encode the URL components while preserving the path structure
    const encodedPath = cleanPath.split('/').map(segment => 
      encodeURIComponent(segment)
    ).join('/');
    
    return `${R2_BASE_URL}/${type}/${encodedPath}`;
  }
  
  // Default to local assets for original content
  return path.startsWith('/') ? path : `/${type}/${path}`;
};
```

## Automating Updates

To keep your mapping table up to date, consider setting up a scheduled task or GitHub Action to periodically regenerate the mapping.

### GitHub Action Example

```yaml
# .github/workflows/update-r2-mapping.yml
name: Update R2 URL Mapping

on:
  schedule:
    - cron: '0 0 * * 0'  # Weekly on Sunday at midnight
  workflow_dispatch:     # Allow manual trigger

jobs:
  update-mapping:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'
          
      - name: Install dependencies
        run: npm install @aws-sdk/client-s3
        
      - name: Run mapping script
        run: node scripts/list-r2-objects.js
        env:
          R2_ACCOUNT_ID: ${{ secrets.R2_ACCOUNT_ID }}
          R2_ACCESS_KEY_ID: ${{ secrets.R2_ACCESS_KEY_ID }}
          R2_SECRET_ACCESS_KEY: ${{ secrets.R2_SECRET_ACCESS_KEY }}
          R2_BUCKET_NAME: ${{ secrets.R2_BUCKET_NAME }}
          
      - name: Commit and push updated mapping
        run: |
          git config --global user.name 'GitHub Action'
          git config --global user.email 'action@github.com'
          git add src/data/r2-url-mapping.json
          git commit -m "Update R2 URL mapping [skip ci]" || echo "No changes to commit"
          git push
```

## Conclusion

By creating a mapping table of exact R2 URLs and integrating it into your application, you can ensure that audio files with special characters in their filenames will play correctly. This approach is robust and maintainable, allowing you to handle future filename changes or additions to your R2 bucket.

For any issues or questions, contact the development team. 