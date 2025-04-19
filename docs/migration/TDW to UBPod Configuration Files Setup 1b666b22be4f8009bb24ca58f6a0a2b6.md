# TDW to UBPod: Configuration Files Setup

Last edited: March 14, 2025 7:04 PM
Tags: Urantia Book Pod

# TDW to UBPod: Configuration Files Setup

This guide details the configuration files needed for the UrantiaBookPod Vite migration. These files establish the project structure, dependencies, and build settings.

## package.json

The package.json file defines your project dependencies and scripts. Start with TDW's file and modify it:

```json
{
  "name": "urantiabookpod",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "@vercel/analytics": "^1.1.1",
    "framer-motion": "^10.17.9",
    "lucide-react": "^0.288.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.18.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "@vitejs/plugin-react": "^4.0.3",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.45.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.3",
    "postcss": "^8.4.31",
    "tailwindcss": "^3.3.5",
    "typescript": "^5.0.2",
    "vite": "^4.4.5"
  }
}

```

## vite.config.ts

Configure Vite to handle React and any other plugins needed:

```tsx
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  // Configure public directory where static assets will be served from
  publicDir: 'public',
  // Adjust server settings if needed
  server: {
    port: 3000,
    open: true
  },
  // Build options
  build: {
    outDir: 'dist',
    sourcemap: true,
    // Improve chunk size
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'framer-motion': ['framer-motion']
        }
      }
    }
  }
})

```

## tsconfig.json

The TypeScript configuration establishes type-checking rules:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,

    /* Path aliases */
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}

```

## tsconfig.node.json

Add a Node-specific TypeScript configuration:

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}

```

## tailwind.config.js

Configure Tailwind CSS to match TDW's design system:

```jsx
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0c1631',
          light: '#132048',
        },
        gold: {
          DEFAULT: '#d4af37',
          light: '#e6c458',
        },
        primary: {
          DEFAULT: '#00aeef',
          dark: '#0096cc',
          light: '#33c1f3'
        }
      },
      fontFamily: {
        trajan: ['"trajan-pro-3"', 'serif'],
        cinzel: ['Cinzel', 'serif'],
        sans: ['Montserrat', 'sans-serif'],
        'pt-serif': ['"PT Serif"', 'serif'],
        'fira-sans': ['"Fira Sans"', 'sans-serif'],
      },
      animation: {
        'slow-spin': 'spin 3s linear infinite',
      }
    },
  },
  plugins: [],
}

```

## postcss.config.js

Configure PostCSS for Tailwind CSS processing:

```jsx
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}

```

## .eslintrc.cjs

Set up ESLint for code quality:

```jsx
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    // Additional custom rules if needed
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_'
    }],
    'react-hooks/exhaustive-deps': 'warn'
  },
}

```

## index.html

The entry HTML file for your Vite app:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/png" href="/logo.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <!-- Primary Meta Tags -->
    <title>Urantia Book Podcast</title>
    <meta name="title" content="Urantia Book Podcast">
    <meta name="description" content="Listen to AI-generated summaries of the Urantia Book papers while reading along">

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://urantiabookpod.com/">
    <meta property="og:title" content="Urantia Book Podcast">
    <meta property="og:description" content="AI-generated summaries of the Urantia Book papers, created by The Center for Unity">
    <meta property="og:image" content="https://urantiabookpod.com/og-image.png">

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="https://urantiabookpod.com/">
    <meta property="twitter:title" content="Urantia Book Podcast">
    <meta property="twitter:description" content="AI-generated summaries of the Urantia Book papers, created by The Center for Unity">
    <meta property="twitter:image" content="https://urantiabookpod.com/og-image.png">

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Montserrat:wght@300;400;500;600&family=PT+Serif:wght@400;700&family=Fira+Sans:wght@400;700;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://use.typekit.net/ruy4wnb.css">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>

```

## Project Structure

Here's a recommended folder structure for the migrated app:

```
urantiabookpod-vite/
├── public/               # Static assets
│   ├── audio/            # Audio files
│   ├── pdf/              # PDF files
│   ├── transcripts/      # Transcript files
│   ├── analysis/         # Analysis files
│   ├── images/           # Image assets
│   └── logo.png          # App logo
├── src/
│   ├── components/       # React components
│   │   ├── audio/        # Audio-related components
│   │   ├── layout/       # Layout components
│   │   └── ui/           # Reusable UI components
│   ├── constants/        # Constant values and configurations
│   ├── data/             # Data models and sample data
│   ├── hooks/            # Custom React hooks
│   ├── pages/            # Page components
│   ├── styles/           # Global styles and CSS
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions
│   ├── App.tsx           # Main App component
│   ├── main.tsx          # Entry point
│   └── index.css         # Global CSS
├── .eslintrc.cjs         # ESLint configuration
├── .gitignore            # Git ignore file
├── index.html            # HTML entry point
├── package.json          # Project dependencies
├── postcss.config.js     # PostCSS configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
├── tsconfig.node.json    # Node-specific TypeScript configuration
└── vite.config.ts        # Vite configuration

```