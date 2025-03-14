# TDW to UBPod: Script to set up the UrantiaBookPod Vite migration

Last edited: March 14, 2025 7:07 PM
Tags: Urantia Book Pod

```jsx
#!/bin/bash
# Script to set up the UrantiaBookPod Vite migration

# Colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting UrantiaBookPod Vite migration setup...${NC}"

# Create directory structure
echo -e "\n${GREEN}Creating directory structure...${NC}"

# Create public directory and subdirectories
mkdir -p public/{audio,pdf,transcripts,analysis,images}/{urantia,discover-jesus,history,workbooks}

# Create src directory and subdirectories
mkdir -p src/{components,constants,data,hooks,pages,styles,types,utils}/{audio,layout,ui}

# Copy files from TDW that we want to keep as reference
echo -e "\n${GREEN}Copying reference files from TDW...${NC}"
mkdir -p reference/{components,styles,constants}

# Let the user know we're creating the basic files
echo -e "\n${GREEN}Creating configuration files...${NC}"

# Create package.json
cat > package.json << 'EOF'
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
EOF

# Create vite.config.ts
cat > vite.config.ts << 'EOF'
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
EOF

# Create tsconfig.json
cat > tsconfig.json << 'EOF'
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
EOF

# Create tsconfig.node.json
cat > tsconfig.node.json << 'EOF'
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
EOF

# Create tailwind.config.js
cat > tailwind.config.js << 'EOF'
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
EOF

# Create postcss.config.js
cat > postcss.config.js << 'EOF'
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF

# Create .eslintrc.cjs
cat > .eslintrc.cjs << 'EOF'
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
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { 
      argsIgnorePattern: '^_', 
      varsIgnorePattern: '^_' 
    }],
    'react-hooks/exhaustive-deps': 'warn'
  },
}
EOF

# Create index.html
cat > index.html << 'EOF'
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
EOF

# Create core TypeScript files
echo -e "\n${GREEN}Creating core TypeScript files...${NC}"

# Create src/types/index.ts
cat > src/types/index.ts << 'EOF'
export type EpisodeSeries = 'urantia-papers' | 'sadler-workbooks' | 'discover-jesus' | 'history';

export interface Episode {
  id: number;
  title: string;
  description?: string;
  audioUrl: string;
  pdfUrl?: string;
  series: EpisodeSeries;
  sourceUrl?: string;
  imageUrl?: string;
}

export interface AnimationVariants {
  hidden: any;
  visible: any;
  [key: string]: any;
}
EOF

# Create src/main.tsx
cat > src/main.tsx << 'EOF'
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
EOF

# Create src/App.tsx
cat > src/App.tsx << 'EOF'
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import './index.css';

// Import pages here when they're ready
// import HomePage from './pages/HomePage';
// import EpisodePage from './pages/EpisodePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div>Home Page - Coming Soon</div>} />
        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
      <Analytics />
    </BrowserRouter>
  );
}

export default App;
EOF

# Create src/index.css
cat > src/index.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Import fonts */
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600&display=swap');
@import url('https://use.typekit.net/ruy4wnb.css'); /* For Trajan Pro 3 */

/* Base Typography */
:root {
  --font-trajan: "trajan-pro-3", serif;
  --font-cinzel: 'Cinzel', serif;
  --font-montserrat: 'Montserrat', sans-serif;
  
  /* Colors */
  --color-navy: #0c1631;
  --color-navy-light: #132048;
  --color-gold: #d4af37;
  --color-gold-light: #e6c458;
}

body {
  font-family: var(--font-montserrat);
  @apply bg-navy text-white;
}

/* Typography utility classes */
@layer components {
  .title-main {
    font-family: var(--font-trajan);
    @apply text-5xl md:text-6xl font-normal text-white;
    line-height: 1.1;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .title-subtitle {
    font-family: var(--font-cinzel);
    @apply text-xl md:text-2xl text-white tracking-wide;
    line-height: 1.4;
    letter-spacing: 0.02em;
  }

  .section-subtitle {
    font-family: var(--font-cinzel);
    @apply text-xl md:text-2xl text-white/90 tracking-wide;
    line-height: 1.4;
    letter-spacing: 0.02em;
  }

  .body-lg {
    font-family: var(--font-montserrat);
    @apply text-lg leading-relaxed text-white/70 font-light;
    line-height: 1.7;
    letter-spacing: 0.015em;
  }

  .btn-text {
    font-family: var(--font-montserrat);
    @apply text-base font-medium tracking-wide;
    letter-spacing: 0.02em;
  }
}

/* Custom color classes */
@layer utilities {
  .bg-navy {
    background-color: var(--color-navy);
  }
  .bg-navy-light {
    background-color: var(--color-navy-light);
  }
  .bg-gold {
    background-color: var(--color-gold);
  }
  .bg-gold-light {
    background-color: var(--color-gold-light);
  }
  .text-gold {
    color: var(--color-gold);
  }
}
EOF

# Create .gitignore
cat > .gitignore << 'EOF'
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
EOF

# Install dependencies
echo -e "\n${GREEN}Installing dependencies...${NC}"
npm install

# Let the user know we're done
echo -e "\n${GREEN}Setup complete!${NC}"
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Run 'npm run dev' to start the development server"
echo "2. Begin implementing components following the migration guide"
```