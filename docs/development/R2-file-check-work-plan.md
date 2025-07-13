# R2 File Existence Check: Work Plan

## 1. Executive Summary & Primer

### The Problem

Currently, our application generates URLs for media files (like audio, PDFs, and transcripts) and displays download buttons for them. However, we have no reliable way to know if the file at a given URL *actually exists* on our R2 storage bucket. This leads to a poor user experience where users can click a "Download" button only to see a "404 Not Found" error.

Our initial attempt to solve this by checking from the user's browser (`fetch` request) failed due to a fundamental web security feature called **Cross-Origin Resource Sharing (CORS)**. For security reasons, a browser will not allow a script on our website (`ubpod.org`) to inspect a resource on the R2 domain (`*.r2.dev`) unless the R2 server explicitly gives it permission. It does not, so the check fails every time.

### The Solution: A Server-Side Proxy

The correct and most robust solution is to create a small, secure **server-side proxy** using a Vercel Serverless Function. This works because server-to-server communication is not restricted by browser CORS policies.

Here is how it will work:
1.  Our React application will not try to talk to R2 directly. Instead, it will make a request to our *own* API endpoint (e.g., `/api/check-file`).
2.  This endpoint, which is a Vercel Serverless Function, will run on Vercel's servers, not in the user's browser.
3.  This function can safely use our secret R2 API keys to ask the R2 bucket, "Does this file exist?"
4.  The function will then send a simple `true` or `false` response back to our React application.

This approach is secure (keys are never exposed to the browser), efficient, and allows us to add or remove files from R2 without ever needing to redeploy our frontend application.

**A Note on Vercel Functions:** You mentioned having issues with serverless functions in the past. Vercel has a zero-configuration policy for this. Any file placed in an `/api` directory at the root of the project is automatically deployed as a serverless function. We will use this standard, well-documented approach, which is a core feature of the Vercel platform.

---

## 2. Detailed Implementation Plan

### Step 1: Project Setup & Configuration

1.  **Create API Directory:**
    -   At the root of the project, create a new directory named `api`.
    -   Inside `api`, create a new file named `check-r2-file.ts`. This file will contain our serverless function logic.

2.  **Install SDK:**
    -   We need the AWS SDK to communicate with the R2 bucket (which is S3-compatible).
    -   Run the following command in your terminal:
        ```bash
        npm install @aws-sdk/client-s3
        ```

3.  **Configure Environment Variables in Vercel:**
    -   In your Vercel project dashboard, navigate to **Settings > Environment Variables**.
    -   Add the following secret keys. These will be securely injected into the serverless function at runtime.
        -   `R2_ACCOUNT_ID`: Your Cloudflare Account ID.
        -   `R2_ACCESS_KEY_ID`: Your R2 Access Key ID.
        -   `R2_SECRET_ACCESS_KEY`: Your R2 Secret Access Key.
        -   `R2_BUCKET_NAME`: The name of your R2 bucket (e.g., `ubpod-assets`).
        -   `R2_PUBLIC_URL`: The full public URL of your bucket (e.g., `https://pub-69ae36e16d64438e9bb56350459d5c7d.r2.dev`).

### Step 2: Write the Serverless Function

-   Add the following code to `api/check-r2-file.ts`:

```typescript
import { S3Client, HeadObjectCommand } from "@aws-sdk/client-s3";
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Initialize the S3 client for R2
const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { filename } = req.body;

  // Validate that a filename was provided
  if (!filename || typeof filename !== 'string') {
    return res.status(400).json({ error: 'Filename is required and must be a string.' });
  }

  try {
    // HeadObject is a lightweight request to get metadata without the file body
    await s3.send(new HeadObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: filename,
    }));
    
    // If the command succeeds, the file exists
    return res.status(200).json({ exists: true });

  } catch (error: any) {
    // The SDK throws an error with the name 'NotFound' if the object doesn't exist
    if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
      return res.status(200).json({ exists: false });
    }
    
    // For any other errors, log them and return a server error
    console.error('R2 Check Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
```

### Step 3: Frontend Integration

1.  **Create a Client-Side API Helper:**
    -   In `src/utils`, create a new file `r2-check.ts`. This will contain a helper function to call our new API and include a simple in-memory cache to prevent redundant checks during a user's session.

    ```typescript
    // src/utils/r2-check.ts
    
    // Simple in-memory cache to store results for the session
    const fileExistenceCache = new Map<string, boolean>();

    export async function checkFileExists(filename: string): Promise<boolean> {
      // If we already have the result in our cache, return it instantly
      if (fileExistenceCache.has(filename)) {
        return fileExistenceCache.get(filename)!;
      }

      try {
        const response = await fetch('/api/check-r2-file', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ filename }),
        });

        if (!response.ok) {
          // If the API itself fails, assume the file doesn't exist for safety
          console.error(`API Error checking ${filename}: ${response.statusText}`);
          return false;
        }

        const data = await response.json();
        const { exists } = data;

        // Store the result in the cache and return it
        fileExistenceCache.set(filename, exists);
        return exists;

      } catch (error) {
        console.error(`Network Error checking ${filename}:`, error);
        return false; // Assume false on network error
      }
    }
    ```

2.  **Update Data Loading Logic:**
    -   The primary function to modify will be `getEpisode` in `src/utils/episodeUtils.ts`. It needs to become `async`.

    ```typescript
    // src/utils/episodeUtils.ts (simplified example)
    import { checkFileExists } from './r2-check';

    export async function getEpisode(
      seriesId: string, 
      episodeId: number, 
      language: string = 'en'
    ): Promise<Episode | undefined> {
      // ... existing logic to get base episode data ...
      const episode = ...;
      if (!episode) return undefined;

      // Check for transcript existence
      const transcriptFilename = `paper-${episodeId}-transcript.pdf`; // Example filename
      const transcriptExists = await checkFileExists(transcriptFilename);

      if (transcriptExists) {
        episode.transcriptUrl = `${process.env.R2_PUBLIC_URL}/${transcriptFilename}`;
      } else {
        episode.transcriptUrl = undefined;
      }
      
      // Apply translations and return
      // ...
      return translatedEpisode;
    }
    ```
    -   This will require updating the components that call `getEpisode` (like `EpisodePage.tsx`) to handle an `async` function (e.g., using `await` inside an `async useEffect`).

---

## 3. Testing Plan

1.  **Local Testing (`vercel dev`):**
    -   Run `vercel dev` from the project root. This will start the Vite dev server and the serverless function locally.
    -   Use a tool like Postman or `curl` to send a POST request to `http://localhost:3000/api/check-r2-file`.
        -   **Test Case 1 (Exists):** Send `{ "filename": "paper-1.pdf" }`. Expect `{ "exists": true }`.
        -   **Test Case 2 (Doesn't Exist):** Send `{ "filename": "non-existent-file.pdf" }`. Expect `{ "exists": false }`.
        -   **Test Case 3 (Invalid Body):** Send `{}`. Expect a 400 error.
    -   Navigate the application locally and verify in the browser console that the API calls are being made and that the download buttons appear/disappear correctly.

2.  **Staging/Preview Testing:**
    -   Deploy the changes to a Vercel preview branch.
    -   Verify that the environment variables have been correctly applied to the preview deployment.
    -   Open the preview URL and repeat the UI tests.
        -   Check an episode with a transcript. The button should appear.
        -   Check an episode without a transcript (or a Spanish episode). The button should NOT appear.
    -   Check the serverless function logs in the Vercel dashboard for any errors.

This detailed plan ensures a secure, robust, and scalable solution for checking file existence on R2. 