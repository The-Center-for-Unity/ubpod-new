# UrantiaBookPod

A modern, responsive web application providing an audio podcast experience for exploring the Urantia Book. This app allows users to listen to AI-generated narrations of Urantia Book papers while reading along with the text.

## Overview

UrantiaBookPod offers an immersive way to engage with the Urantia Book, combining audio narrations with text reading. Key features include:

- **Audio Playback**: Listen to high-quality AI-generated narrations of Urantia Book papers
- **Text Sync**: Read along with the narration
- **Transcript Access**: View PDF transcripts of all papers directly from the episode page
- **Series Organization**: Content organized into thematic series for focused study
- **Responsive Design**: Optimized for both desktop and mobile devices
- **Offline Support**: Download audio for offline listening
- **User-Friendly Interface**: Intuitive controls and navigation

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Animation**: Framer Motion
- **UI Icons**: Lucide React
- **Analytics**: Vercel Analytics
- **Content Storage**: Cloudflare R2 for audio files, images, PDFs, and transcripts

## Content Delivery

All media assets including audio narrations, images, PDF documents, and transcripts are stored on Cloudflare R2 buckets:
- **Audio Files**: High-quality AI-generated narrations in MP3 format
- **Images**: UI assets, series thumbnails, and other visual elements
- **PDFs**: Downloadable content and supplementary reading materials
- **Transcripts**: Complete PDF transcripts for all Urantia papers

This approach ensures:
- Fast global content delivery
- Reliable asset availability
- Cost-effective storage solution
- Scalable infrastructure for growing content library

## Resource Naming Conventions

### Media Resource Patterns
- **Audio files**: `paper-{number}.mp3` or `foreword.mp3`
- **PDF documents**: `paper-{number}.pdf` or `foreword.pdf`
- **Transcripts**: `paper-{number}-transcript.pdf` or `foreword-transcript.pdf`

For example:
- Paper 1 audio: `paper-1.mp3`
- Paper 1 PDF: `paper-1.pdf`
- Paper 1 transcript: `paper-1-transcript.pdf`

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ubpod-new.git
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Project Structure

```
src/
├── components/         # Reusable components
│   ├── audio/          # Audio player components
│   ├── layout/         # Layout components (Header, Footer)
│   ├── ui/             # Basic UI components
│   ├── series/         # Series-related components
│   ├── contact/        # Contact form components
│   ├── analytics/      # Analytics integration components
│   └── utils/          # Utility components
├── pages/              # Page components
│   ├── Home.tsx        # Home page
│   ├── EpisodePage.tsx # Individual episode page
│   ├── ListenPage.tsx  # Series listing page
│   ├── SeriesPage.tsx  # All series page
│   ├── ContactPage.tsx # Contact page
│   └── ...other pages
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── api/                # API connection logic
├── types/              # TypeScript type definitions
├── data/               # Static data
├── styles/             # Global styles
├── constants/          # App constants
└── services/           # Service integrations
```

## Features

### Audio Player
- Play/pause/seek controls
- Speed adjustment
- Volume control
- Progress tracking
- Mobile-friendly interface

### Content Organization
- Papers grouped into meaningful series
- Clear navigation between related content
- Structured content display

### User Experience
- Dark theme optimized for readability
- Smooth animations and transitions
- Responsive design for all devices
- Accessibility features

## Development Guidelines

### Component Structure
```typescript
// Component example
import React from 'react';

interface ComponentProps {
  prop1: string;
  prop2?: number;
}

export default function Component({ prop1, prop2 = 0 }: ComponentProps) {
  // Component logic
  
  return (
    <div className="container">
      {/* JSX content */}
    </div>
  );
}
```

### Styling Approach
- Use Tailwind utility classes for layout and styling
- Use custom design system classes for typography
- Keep styling consistent throughout the application
- Follow responsive design patterns:
  ```html
  <div className="text-base md:text-lg lg:text-xl">
    Responsive text
  </div>
  ```

## Deployment

The application is deployed on Vercel:
- Automatic deployments from main branch
- Preview deployments for pull requests
- Environment variables managed in Vercel dashboard

## License

Copyright © 2024 UrantiaBookPod. All rights reserved.

## Contact

For questions or support, please use the contact form within the application.