# Contact Form Implementation Plan

## Overview
Implementing a contact form using Resend API in the UBPod project, based on the existing implementation from the reference codebase.

## Implementation Steps

### 1. Initial Setup
- [x] Install required dependencies
  - Installed `resend` package
- [x] Create necessary directories
  - Created `src/components/contact`
  - Created `src/utils`
  - Created `src/api`
- [x] Set up environment variables
  - Added Resend API key and email configuration to `.env`
  - Added environment variables to Vercel configuration
- [x] Configure Vercel settings
  - Updated `vercel.json` with API routes and function configuration
  - Added environment variables to Vercel deployment settings

### 2. Core Components
- [x] Create ContactForm component
  - Created `src/pages/ContactPage.tsx` with form fields and validation
  - Implemented file upload handling
  - Added loading and success/error states
- [x] Set up emailService utility
  - Created `src/utils/emailService.ts` for handling email sending
  - Implemented error handling and response types
- [x] Implement API endpoint
  - Created `src/api/send.ts` for processing form submissions
  - Added file attachment handling
  - Implemented Resend API integration
- [x] Add form validation
  - Added required field validation
  - Implemented file size limits
  - Added error messages

### 3. Integration
- [x] Add routing
  - Added Contact page route to `App.tsx`
  - Set up lazy loading for better performance
- [x] Add to navigation menu
  - Added Contact option to main menu in Header component
  - Included in both desktop and mobile navigation
- [x] Style to match UBPod design system
  - Used UBPod color scheme and design elements
  - Implemented responsive layout
  - Added animations for improved user experience
- [x] Test form submission in development
  - Verified form validation works properly
  - Confirmed development mode form submission flow
  - Tested photo upload functionality
- [x] Verify email delivery in production
  - Created Vercel preview deployment
  - Confirmed form submission works in production environment
  - Verified email delivery via Resend API

### 4. Testing & Deployment
- [x] Add loading states
  - Added loading spinner during form submission
  - Disabled form while submission is in progress
- [x] Implement error handling
  - Added error messages for form validation
  - Implemented error handling for API calls
  - Added fallbacks for file upload errors
- [x] Add success messages
  - Implemented success notification after form submission
  - Added clear visual indicators for successful submission
- [ ] Test across browsers
  - Test on Chrome, Firefox, Safari
  - Verify mobile responsiveness
- [x] Create Vercel preview deployment
  - Used Vercel CLI to create preview deployment
  - Configured environment variables for the preview
  - Tested API endpoints on preview URL
  - Fixed Edge Function format for API compatibility
- [ ] Finalize production deployment
  - Verify environment variables in Vercel
  - Confirm API functionality on production domain
  - Deploy to production

### 5. Creating a Vercel Preview Deployment

#### Option 1: Using Vercel API/CLI (Recommended)

1. Install Vercel CLI if not already installed:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel CLI:
   ```bash
   vercel login
   ```

3. Create a preview deployment from your local project:
   ```bash
   vercel
   ```
   
   This will create a preview deployment without affecting production.

4. Set up environment variables for the preview deployment:
   ```bash
   vercel env add RESEND_API_KEY
   vercel env add VITE_EMAIL_DOMAIN
   vercel env add VITE_EMAIL_FROM
   vercel env add VITE_EMAIL_TO
   vercel env add VITE_SITE_NAME
   ```

5. For API endpoints to work correctly, ensure they're in a top-level `api/` directory (not inside `src/`).

6. Use the correct Edge Function format for API endpoints:
   ```typescript
   export const config = {
     runtime: 'edge',
   };

   export default async function handler(request: Request) {
     // Your API code here
   }
   ```

7. Update `vercel.json` configuration to include TypeScript files:
   ```json
   "functions": {
     "api/**/*.{js,ts}": {
       "memory": 1024,
       "maxDuration": 10
     }
   }
   ```

8. Test the contact form on the preview URL.

9. Once verified, deploy to production with:
   ```bash
   vercel --prod
   ```

#### Option 2: Using GitHub Pull Request

1. Create a new branch for the contact form implementation:
   ```bash
   git checkout -b feature/contact-form
   ```

2. Push the branch to GitHub:
   ```bash
   git push origin feature/contact-form
   ```

3. Create a pull request on GitHub from the `feature/contact-form` branch to the main branch.

4. Vercel will automatically create a preview deployment with a unique URL.

5. Add the required environment variables in the Vercel dashboard for the preview deployment.

6. Test the contact form on the preview URL to verify functionality.

7. Once verified on the preview deployment, merge the PR to deploy to production.

## Progress Log

### March 24, 2024
- Created implementation plan
- Installed Resend package
- Created necessary directories for contact form implementation
- Set up environment variables in `.env` and `vercel.json`
- Created Contact page component with form fields and validation
- Implemented email service utility and API endpoint
- Added routing for the Contact page
- Added Contact option to main navigation menu
- Styled the form to match UBPod's design system
- Enhanced the implementation with features from reference design:
  - Added proper file upload with previews
  - Implemented detailed form validation
  - Added development mode handling
  - Enhanced error messaging and success states
- Tested form submission in development environment
- Fixed styling issues to ensure proper dark background for all form elements
- Committed all changes to version control
- Created Vercel preview deployment to test in production environment
- Fixed API endpoint to use correct Edge Function format
- Successfully tested form submission in preview environment
- Next step: Test across browsers and finalize production deployment

## Notes & Insights
- The implementation is based on the existing contact form from the reference codebase
- Adapted the styling to match UBPod's design system while maintaining functionality
- Used Resend API for email delivery
- Implemented proper error handling and loading states
- Directory structure follows the project's existing patterns
- Environment variables are set up to match the reference implementation
- Vercel configuration includes necessary API routes and function settings
- Form validation includes required fields and file size limits
- API endpoint handles file attachments and email sending
- Added a complete page experience with hero section, FAQ, and call-to-action
- Used framer-motion for smooth animations and transitions
- Development mode allows testing without sending actual emails
- The preview deployment process allows testing in a production-like environment before final deployment
- Vercel CLI/API provides a more direct way to create preview deployments without requiring GitHub PRs
- Vercel Edge Functions require a specific format with `export default function handler` and proper runtime configuration
- API files must be placed in the top-level `api/` directory for Vercel to correctly identify them 