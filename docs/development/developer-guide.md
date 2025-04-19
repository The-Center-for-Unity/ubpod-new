# UrantiaBookPod Developer Guide

## Introduction

Welcome to the UrantiaBookPod developer team! This guide will help you set up your development environment, understand the project structure, and follow best practices for contributing to the codebase.

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.x or later)
- **npm** (v9.x or later)
- **Git** (v2.x or later)

### Initial Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/ubpod-new.git
   cd ubpod-new
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory with the following variables:

   ```
   # Base URLs
   VITE_API_BASE_URL=http://localhost:3000/api
   VITE_AUDIO_CDN_URL=https://dev-cdn.urantiabookpod.com/audio

   # Analytics IDs (optional for development)
   VITE_HOTJAR_ID=0000000
   VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   VITE_OPTINMONSTER_USER_ID=00000
   VITE_OPTINMONSTER_ACCOUNT_ID=00000

   # Contact form (needed for contact page)
   VITE_RESEND_API_KEY=re_yourkey
   VITE_CONTACT_FORM_EMAIL=contact@yourdomain.com
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173` (or the next available port).

## Project Structure

The project follows a standard Vite + React structure with additional organization:

```
ubpod-new/
├── docs/                    # Documentation files
├── public/                  # Static assets
├── scripts/                 # Utility scripts
├── src/                     # Source code
│   ├── components/          # React components
│   │   ├── audio/           # Audio-related components
│   │   ├── layout/          # Layout components
│   │   ├── ui/              # UI components
│   │   └── ...              # Other component categories
│   ├── constants/           # Constant values
│   ├── data/                # Static data
│   ├── hooks/               # Custom React hooks
│   ├── pages/               # Page components
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Utility functions
│   ├── App.tsx              # App entry point
│   ├── index.css            # Global styles
│   └── main.tsx             # React entry point
├── synch-r2/                # Scripts for syncing to R2/S3
├── .env.example             # Example environment variables
├── index.html               # HTML template
├── package.json             # Dependencies and scripts
├── tailwind.config.js       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
└── vite.config.ts           # Vite configuration
```

## Development Workflow

### Feature Development

Follow these steps when developing a new feature:

1. **Create a feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Implement the feature**

   - Follow the component structure and patterns in the existing codebase
   - Use TypeScript for type safety
   - Follow TDW's design system patterns
   - Add appropriate comments and documentation

3. **Test your changes**

   - Test in different browsers (Chrome, Firefox, Safari)
   - Verify responsive design on different screen sizes
   - Check for console errors and performance issues

4. **Commit your changes**

   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push your changes and create a pull request**

   ```bash
   git push origin feature/your-feature-name
   ```

### Code Style Guidelines

- Use functional components with hooks instead of class components
- Use TypeScript interfaces for all props and state
- Follow the file structure conventions for components
- Use Tailwind CSS for styling, consistent with TDW design system
- Use JSDoc comments for important functions and components
- Keep components focused and under 250 lines of code
- Implement proper error handling and loading states

## Common Tasks

### Working with Audio Components

The audio system uses a combination of HTML5 Audio API and custom React hooks:

```jsx
// Example of using the AudioPlayer component
import AudioPlayer from '../components/audio/AudioPlayer';

function MyComponent() {
  return (
    <AudioPlayer 
      audioUrl="https://example.com/audio.mp3"
      title="Episode Title"
      episodeId="123"
      onEnded={() => console.log('Audio playback ended')}
      onError={(error) => console.error('Audio error:', error)}
    />
  );
}
```

### Adding a New Page

1. Create a new page component in `src/pages/`
2. Add the route in `src/App.tsx`
3. Update navigation links if necessary

Example:

```tsx
// src/pages/NewPage.tsx
import React from 'react';
import Layout from '../components/layout/Layout';
import MetaTags from '../components/layout/MetaTags';

export default function NewPage() {
  return (
    <Layout>
      <MetaTags
        title="New Page | UrantiaBookPod"
        description="Description of the new page"
      />
      <div className="container mx-auto px-4 py-8">
        {/* Page content */}
      </div>
    </Layout>
  );
}

// In src/App.tsx
<Routes>
  {/* Other routes */}
  <Route path="/new-page" element={<NewPage />} />
</Routes>
```

### Adding a New Series or Episode

To add a new series or episode, update the data files:

1. Add series information in `src/utils/seriesUtils.ts`
2. Add episode data in `src/data/episodes.ts`
3. Ensure audio files are uploaded to the CDN

See the content pipeline documentation for more details.

## Troubleshooting

### Common Issues

#### Audio Playback Issues

If audio isn't playing correctly:

1. Check browser console for errors
2. Verify that the audio URL is accessible
3. Check CORS settings if using a development environment
4. Try different browsers to isolate browser-specific issues

#### Styling Issues

If styles aren't applying correctly:

1. Check for conflicting class names
2. Verify that Tailwind is generating the classes you need
3. Check responsive breakpoints if layout issues occur at specific screen sizes

#### Vite Build Issues

If you encounter build errors:

1. Check the console output for specific error messages
2. Verify that all imports are correct
3. Check TypeScript errors and fix type issues
4. Clear the `.vite` cache folder and node_modules, then reinstall

### Debugging Tools

The application includes several debugging tools:

1. **DebugPage**:
   - Access via `/debug` route
   - Provides information about environment, routes, and component state

2. **Browser DevTools**:
   - React DevTools for component inspection
   - Network tab for API and resource requests
   - Console for error messages and logs

3. **Analytics Debug Mode**:
   - Add `?debug=true` to the URL to enable analytics debug logging
   - Analytics events will be logged to the console

## Deployment

### Development Builds

For local testing of production builds:

```bash
npm run build
npm run preview
```

### Production Deployment

The application is deployed using Vercel:

1. Merge changes to the main branch
2. Vercel automatically builds and deploys the application
3. The deployment is available at the production URL

## Advanced Topics

### Analytics Integration

The application uses multiple analytics services:

- **Vercel Analytics**: Page views and performance metrics
- **Hotjar**: User behavior and session recording
- **Google Analytics**: Event tracking and user demographics

Analytics events are tracked using the analytics hooks in `src/hooks/useAnalytics.ts`.

### Content Delivery

Audio files are served from a CDN:

- Development: Configured in `.env.local`
- Production: `https://cdn.urantiabookpod.com/audio/`

### Mobile Optimization

The application is optimized for mobile with:

- Responsive design using Tailwind breakpoints
- Touch-friendly controls for audio playback
- Performance optimizations for slower connections

## Additional Resources

- [Vite Documentation](https://vitejs.dev/guide/)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Component Architecture Documentation](./components/architecture.md)
- [Content Pipeline Documentation](./content-pipeline.md)

## Support

If you have questions or need help, please contact:

- **Technical Lead**: tech-lead@example.com
- **Product Owner**: product-owner@example.com 