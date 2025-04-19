# Resend API Contact Form Implementation Guide

Last edited: March 24, 2025 8:26 AM

# Resend API Contact Form Implementation Guide

## Overview

This package provides a complete solution for implementing a contact form with file attachments using React, Tailwind CSS, and the Resend email API. The implementation includes a frontend form component, backend API endpoint, and supporting utilities.

## Files to Share

1. **API Endpoint:**
    - `api/send.js` - Serverless function for processing form submissions and sending emails
2. **Frontend Components:**
    - `src/pages/Contact.tsx` - Main contact form component with file upload handling
3. **Utilities:**
    - `src/utils/emailService.js` - Email service utility for processing attachments and formatting emails
4. **Configuration:**
    - `vercel.json` - Vercel deployment configuration with API routes and environment variables
    - `.env.example` - Template for required environment variables

## Implementation Details

### 1. API Endpoint (`api/send.js`)

```jsx
import { Resend } from 'resend';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use POST instead.'
    });
  }

  // Log request details
  console.log('Contact form submission received:', {
    timestamp: new Date().toISOString(),
    headers: req.headers['content-type']
  });

  try {
    // Extract and validate required fields
    const { name, email, inquiryType, message, attachments = [] } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    // Initialize Resend with API key
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Prepare email content
    const emailContent = `
      <h1>Contact Form Submission</h1>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Inquiry Type:</strong> ${inquiryType || 'Not specified'}</p>
      <p><strong>Message:</strong></p>
      <div>${message.replace(/\\n/g, '<br>')}</div>
    `;

    // Send email
    const { data, error } = await resend.emails.send({
      from: `${process.env.VITE_SITE_NAME} <${process.env.VITE_EMAIL_FROM}>`,
      to: process.env.VITE_EMAIL_TO,
      subject: `Contact Form: ${inquiryType || 'New Message'} from ${name}`,
      html: emailContent,
      reply_to: email,
      attachments: attachments.map(attachment => ({
        filename: attachment.filename,
        content: attachment.content
      }))
    });

    // Handle response
    if (error) {
      console.error('Resend API error:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Failed to send email'
      });
    }

    return res.status(200).json({
      success: true,
      data
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
}

```

### 2. Vercel Configuration (`vercel.json`)

```json
{
  "rewrites": [
    { "source": "/api/:path*", "destination": "/api/:path*" }
  ],
  "functions": {
    "api/**/*.js": {
      "memory": 1024,
      "maxDuration": 10
    }
  },
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "env": {
    "RESEND_API_KEY": "re_****",
    "VITE_EMAIL_DOMAIN": "yourdomain.com",
    "VITE_EMAIL_FROM": "contact@yourdomain.com",
    "VITE_EMAIL_TO": "recipient@yourdomain.com",
    "VITE_SITE_NAME": "Your Site Name"
  }
}

```

### 3. Environment Variables (`.env.example`)

```
# Resend API configuration
RESEND_API_KEY=re_****
VITE_EMAIL_DOMAIN=yourdomain.com
VITE_EMAIL_FROM=contact@yourdomain.com
VITE_EMAIL_TO=recipient@yourdomain.com
VITE_SITE_NAME=Your Site Name

```

## Implementation Steps

1. **Install Dependencies:**
    
    ```bash
    npm install resend
    
    ```
    
2. **Copy Files:**
    - Place `api/send.js` in your project's API directory
    - Adapt the Contact component to your project structure
    - Copy the emailService utility if needed
3. **Configure Environment Variables:**
    - Create a `.env` file with the required variables
    - Set up the same variables in your Vercel project settings
4. **Update Vercel Configuration:**
    - Add the rewrites and functions settings to your `vercel.json`
5. **Deploy:**
    - Deploy to Vercel with `vercel --prod`

## Key Features

1. **File Upload Handling:**
    - Supports image uploads with base64 encoding
    - Validates file types and sizes
    - Properly formats attachments for email delivery
2. **Form Validation:**
    - Validates required fields before submission
    - Provides user feedback during submission process
3. **Error Handling:**
    - Comprehensive error handling on both client and server
    - Detailed logging for debugging purposes
4. **CORS Support:**
    - API endpoint handles CORS headers and preflight requests
    - Works with cross-origin requests if needed

## Customization

The implementation can be customized by:

1. Modifying the email template in the API endpoint
2. Updating the form fields and validation in the Contact component
3. Adjusting the Resend API configuration for different email requirements
4. Changing the UI design while maintaining the form logic

## Troubleshooting

If you encounter issues:

1. Check the browser console for client-side errors
2. Verify that environment variables are correctly set
3. Examine the Vercel function logs for server-side errors
4. Ensure the Resend API key is valid and has sufficient permissions

This solution has been tested and proven to work in production environments with Vite and Vercel deployments.