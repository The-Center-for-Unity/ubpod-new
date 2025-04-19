# Secure Configuration Guide

## Overview

This document explains how to securely configure the UrantiaBookPod application and its utility scripts, which previously contained hardcoded credentials. As part of our security improvements, all sensitive credentials have been moved to environment variables.

## Environment Variables

The application and utility scripts now rely on environment variables for secure configuration. These can be set in your shell or using a `.env` file (not committed to version control).

### Required Environment Variables

#### Cloudflare R2 Scripts

For the R2 utility scripts in `synch-r2/` directory:

1. **list-r2-objects.sh**:
   - `R2_ACCOUNT_ID` - Your Cloudflare account ID
   - `R2_BUCKET_NAME` - Your R2 bucket name
   - `R2_ACCESS_KEY` - Your R2 access key
   - `R2_SECRET_KEY` - Your R2 secret key

2. **create-cosmic-urls.sh**:
   - `R2_BUCKET_ID` - Your R2 bucket ID

#### Application

For the application itself:

- `VITE_RESEND_API_KEY` - Your Resend API key for email functionality

## Setting Up Environment Variables

### Method 1: Using .env File (Recommended for Development)

1. Create a `.env` file in the project root:
   ```bash
   cp .env.sample .env
   ```

2. Edit the `.env` file and replace placeholders with your actual credentials:
   ```
   R2_ACCOUNT_ID=your_actual_account_id
   R2_BUCKET_NAME=your_actual_bucket_name
   R2_ACCESS_KEY=your_actual_access_key
   R2_SECRET_KEY=your_actual_secret_key
   R2_BUCKET_ID=your_actual_bucket_id
   VITE_RESEND_API_KEY=your_actual_resend_api_key
   ```

3. Ensure `.env` is added to `.gitignore` to prevent accidental commits:
   ```
   # .gitignore
   .env
   ```

### Method 2: Setting Environment Variables in Shell

You can also set the variables directly in your shell:

```bash
export R2_ACCOUNT_ID=your_actual_account_id
export R2_BUCKET_NAME=your_actual_bucket_name
export R2_ACCESS_KEY=your_actual_access_key
export R2_SECRET_KEY=your_actual_secret_key
export R2_BUCKET_ID=your_actual_bucket_id
export VITE_RESEND_API_KEY=your_actual_resend_api_key
```

### Method 3: CI/CD Environment Configuration

For deployment environments, configure these variables in your CI/CD system:

- In Vercel, add them under "Environment Variables" in the project settings
- In GitHub Actions, add them as repository secrets
- In other CI/CD systems, follow their specific documentation for secret management

## Running Utility Scripts

After setting up the environment variables, you can run the utility scripts as follows:

```bash
# To list R2 objects
./synch-r2/list-r2-objects.sh

# To create cosmic URLs
./synch-r2/create-cosmic-urls.sh
```

## Security Best Practices

1. **Never commit credentials** to version control
2. **Regularly rotate** your access keys and secrets
3. **Use least privilege** principles when creating API keys
4. **Monitor for unauthorized access** to your Cloudflare and other accounts
5. **Restrict access** to your `.env` file

## Verifying Configuration

To verify your configuration is working correctly:

1. Set up the environment variables as described above
2. Run the utility scripts
3. Check that the scripts execute successfully and produce the expected output

## Troubleshooting

If you encounter issues:

1. Check that all required environment variables are set correctly
2. Verify your R2 credentials are still valid
3. Ensure your Cloudflare account and bucket exist and are accessible
4. Look for error messages in the script output for specific issues

## Additional Resources

- [Cloudflare R2 Documentation](https://developers.cloudflare.com/r2/)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Resend API Documentation](https://resend.com/docs/api-reference/introduction) 