# Translation Review Application - Comprehensive Implementation Guide

## Executive Summary

### Problem Statement
The UBPod project requires a streamlined system for translation reviewers to validate and edit DeepL-translated content before deployment. Currently, reviewers need to manually edit JSON files and cross-reference with screenshots, which is error-prone and time-consuming.

### Solution Overview
This document presents four implementation options for a translation review system, ranging from a custom-built solution to leveraging existing platforms. Each option includes detailed implementation steps, technical specifications, and cost-benefit analysis.

### Quick Comparison
| Option | Development Time | Cost | Flexibility | Ease of Use |
|--------|-----------------|------|-------------|-------------|
| A. Custom Next.js | 2-3 weeks | Free (hosting only) | High | High |
| B. TMS Platform | 1 week | $50-500/month | Medium | High |
| C. Google Sheets | 3-5 days | Free | Low | Medium |
| D. Static Site | 1-2 weeks | Free (hosting only) | Medium | Medium |

## Option A: Custom Next.js Application

### Overview
A purpose-built web application using Next.js, providing a split-screen interface with live preview and inline editing capabilities.

### Architecture

```
ubpod-translation-review/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx (language selection)
│   │   ├── review/
│   │   │   └── [lang]/
│   │   │       ├── layout.tsx
│   │   │       ├── page.tsx (content selection)
│   │   │       ├── ui/
│   │   │       │   └── [page]/page.tsx
│   │   │       └── content/
│   │   │           └── [series]/
│   │   │               └── [episode]/page.tsx
│   │   └── api/
│   │       ├── translations/
│   │       │   ├── load/route.ts
│   │       │   ├── save/route.ts
│   │       │   └── export/route.ts
│   │       ├── screenshots/
│   │       │   └── capture/route.ts
│   │       └── auth/
│   │           └── verify/route.ts
│   ├── components/
│   │   ├── TranslationEditor/
│   │   │   ├── index.tsx
│   │   │   ├── StringEditor.tsx
│   │   │   ├── DiffView.tsx
│   │   │   └── SaveIndicator.tsx
│   │   ├── PreviewPane/
│   │   │   ├── index.tsx
│   │   │   ├── ScreenshotViewer.tsx
│   │   │   └── LiveIframe.tsx
│   │   ├── Navigation/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Breadcrumbs.tsx
│   │   │   └── ProgressBar.tsx
│   │   └── Common/
│   │       ├── LoadingSpinner.tsx
│   │       └── ErrorBoundary.tsx
│   ├── lib/
│   │   ├── translations/
│   │   │   ├── manager.ts
│   │   │   ├── parser.ts
│   │   │   └── validator.ts
│   │   ├── screenshots/
│   │   │   ├── capture.ts
│   │   │   └── storage.ts
│   │   └── auth/
│   │       └── middleware.ts
│   └── types/
│       ├── translation.ts
│       └── review.ts
├── public/
│   └── screenshots/
├── prisma/
│   └── schema.prisma (optional for review tracking)
└── scripts/
    ├── capture-screenshots.ts
    └── import-translations.ts
```

### Step-by-Step Implementation

#### Phase 1: Project Setup (Day 1)

1. **Initialize Next.js Project**
```bash
npx create-next-app@latest ubpod-translation-review \
  --typescript --tailwind --app --src-dir
cd ubpod-translation-review
npm install
```

2. **Install Dependencies**
```bash
# Core dependencies
npm install @radix-ui/react-dialog @radix-ui/react-select
npm install @tanstack/react-query axios
npm install diff react-hotkeys-hook
npm install jsonpath-plus lodash

# Development dependencies
npm install -D @types/lodash puppeteer
npm install -D @types/diff eslint-config-prettier
```

3. **Configure Environment**
```env
# .env.local
NEXT_PUBLIC_UBPOD_URL=https://ubpod.vercel.app
REVIEW_PASSWORD=your-secure-password
SCREENSHOT_UPDATE_TOKEN=your-token
```

4. **Setup Basic Authentication**
```typescript
// src/lib/auth/middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function withAuth(handler: Function) {
  return async (req: NextRequest) => {
    const password = req.headers.get('x-review-password');
    
    if (password !== process.env.REVIEW_PASSWORD) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    return handler(req);
  };
}
```

#### Phase 2: Core Components (Days 2-3)

1. **Translation Editor Component**
```typescript
// src/components/TranslationEditor/StringEditor.tsx
import { useState, useEffect } from 'react';
import { Check, X, Edit2 } from 'lucide-react';

interface StringEditorProps {
  path: string;
  original: string;
  current: string;
  onChange: (path: string, value: string) => void;
}

export function StringEditor({ path, original, current, onChange }: StringEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(current);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setHasChanges(value !== current);
  }, [value, current]);

  const handleSave = () => {
    onChange(path, value);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setValue(current);
    setIsEditing(false);
  };

  return (
    <div className="border rounded-lg p-4 mb-4">
      <div className="text-sm text-gray-600 mb-2">{path}</div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold mb-1">Original (English)</h4>
          <p className="bg-gray-50 p-2 rounded">{original}</p>
        </div>
        
        <div>
          <h4 className="font-semibold mb-1 flex items-center gap-2">
            Translation
            {hasChanges && <span className="text-orange-500 text-xs">Modified</span>}
          </h4>
          
          {isEditing ? (
            <div>
              <textarea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full p-2 border rounded"
                rows={3}
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded"
                >
                  <Check size={16} /> Save
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-1 px-3 py-1 bg-gray-500 text-white rounded"
                >
                  <X size={16} /> Cancel
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => setIsEditing(true)}
              className="bg-blue-50 p-2 rounded cursor-pointer hover:bg-blue-100 flex items-start gap-2"
            >
              <p className="flex-1">{value}</p>
              <Edit2 size={16} className="text-gray-500" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

2. **Preview Pane Component**
```typescript
// src/components/PreviewPane/index.tsx
import { useState } from 'react';
import { ScreenshotViewer } from './ScreenshotViewer';
import { LiveIframe } from './LiveIframe';

interface PreviewPaneProps {
  language: string;
  pageType: string;
  pagePath: string;
}

export function PreviewPane({ language, pageType, pagePath }: PreviewPaneProps) {
  const [viewMode, setViewMode] = useState<'screenshot' | 'live'>('screenshot');

  return (
    <div className="h-full flex flex-col">
      <div className="flex gap-2 p-4 border-b">
        <button
          onClick={() => setViewMode('screenshot')}
          className={`px-3 py-1 rounded ${
            viewMode === 'screenshot' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          Screenshot
        </button>
        <button
          onClick={() => setViewMode('live')}
          className={`px-3 py-1 rounded ${
            viewMode === 'live' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          Live Preview
        </button>
      </div>
      
      <div className="flex-1 overflow-hidden">
        {viewMode === 'screenshot' ? (
          <ScreenshotViewer
            src={`/screenshots/${language}/${pageType}/${pagePath}.png`}
          />
        ) : (
          <LiveIframe
            url={`${process.env.NEXT_PUBLIC_UBPOD_URL}/${language}/${pagePath}`}
          />
        )}
      </div>
    </div>
  );
}
```

#### Phase 3: API Routes (Days 4-5)

1. **Translation Loading API**
```typescript
// src/app/api/translations/load/route.ts
import { NextRequest } from 'next/server';
import { withAuth } from '@/lib/auth/middleware';
import fs from 'fs/promises';
import path from 'path';

async function handler(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const language = searchParams.get('lang');
  const fileType = searchParams.get('type');
  
  if (!language || !fileType) {
    return Response.json({ error: 'Missing parameters' }, { status: 400 });
  }

  try {
    // Load original English
    const enPath = path.join(process.cwd(), 'translations', 'en', `${fileType}.json`);
    const enContent = await fs.readFile(enPath, 'utf-8');
    const enData = JSON.parse(enContent);

    // Load target language
    const langPath = path.join(process.cwd(), 'translations', language, `${fileType}.json`);
    const langContent = await fs.readFile(langPath, 'utf-8');
    const langData = JSON.parse(langContent);

    // Load any pending changes
    const changesPath = path.join(process.cwd(), 'changes', language, `${fileType}.json`);
    let changes = {};
    try {
      const changesContent = await fs.readFile(changesPath, 'utf-8');
      changes = JSON.parse(changesContent);
    } catch (e) {
      // No changes file yet
    }

    return Response.json({
      original: enData,
      current: langData,
      changes,
      metadata: {
        language,
        fileType,
        lastModified: new Date().toISOString()
      }
    });
  } catch (error) {
    return Response.json({ error: 'Failed to load translations' }, { status: 500 });
  }
}

export const GET = withAuth(handler);
```

2. **Translation Save API**
```typescript
// src/app/api/translations/save/route.ts
import { NextRequest } from 'next/server';
import { withAuth } from '@/lib/auth/middleware';
import fs from 'fs/promises';
import path from 'path';

async function handler(req: NextRequest) {
  const body = await req.json();
  const { language, fileType, path: stringPath, value, reviewer } = body;

  try {
    const changesPath = path.join(process.cwd(), 'changes', language, `${fileType}.json`);
    
    // Ensure directory exists
    await fs.mkdir(path.dirname(changesPath), { recursive: true });
    
    // Load existing changes
    let changes = {};
    try {
      const content = await fs.readFile(changesPath, 'utf-8');
      changes = JSON.parse(content);
    } catch (e) {
      // No existing changes
    }

    // Update changes
    changes[stringPath] = {
      value,
      reviewer,
      timestamp: new Date().toISOString()
    };

    // Save changes
    await fs.writeFile(changesPath, JSON.stringify(changes, null, 2));

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: 'Failed to save translation' }, { status: 500 });
  }
}

export const POST = withAuth(handler);
```

#### Phase 4: Screenshot System (Day 6)

1. **Screenshot Capture Script**
```typescript
// scripts/capture-screenshots.ts
import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';

const LANGUAGES = ['en', 'es', 'fr', 'pt'];
const BASE_URL = process.env.NEXT_PUBLIC_UBPOD_URL || 'https://ubpod.vercel.app';

const PAGES = [
  { path: '', name: 'home' },
  { path: 'series', name: 'series' },
  { path: 'series/jesus-1', name: 'series-jesus-1' },
  { path: 'series/jesus-1/1', name: 'episode-jesus-1-1' },
  { path: 'contact', name: 'contact' },
  { path: 'disclaimer', name: 'disclaimer' }
];

async function captureScreenshots() {
  const browser = await puppeteer.launch({ headless: 'new' });
  
  for (const lang of LANGUAGES) {
    console.log(`Capturing screenshots for ${lang}...`);
    
    for (const page of PAGES) {
      const screenshotDir = path.join('public', 'screenshots', lang);
      await fs.mkdir(screenshotDir, { recursive: true });
      
      const pageUrl = `${BASE_URL}/${lang}/${page.path}`;
      const screenshotPath = path.join(screenshotDir, `${page.name}.png`);
      
      try {
        const tab = await browser.newPage();
        await tab.setViewport({ width: 1280, height: 800 });
        await tab.goto(pageUrl, { waitUntil: 'networkidle0' });
        await tab.screenshot({ path: screenshotPath, fullPage: true });
        await tab.close();
        
        console.log(`  ✓ ${page.name}`);
      } catch (error) {
        console.error(`  ✗ ${page.name}: ${error.message}`);
      }
    }
  }
  
  await browser.close();
}

captureScreenshots().catch(console.error);
```

2. **Screenshot Update Endpoint**
```typescript
// src/app/api/screenshots/capture/route.ts
import { NextRequest } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(req: NextRequest) {
  const token = req.headers.get('x-update-token');
  
  if (token !== process.env.SCREENSHOT_UPDATE_TOKEN) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await execAsync('npm run capture-screenshots');
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: 'Screenshot capture failed' }, { status: 500 });
  }
}
```

#### Phase 5: Review Interface (Days 7-8)

1. **Main Review Page**
```typescript
// src/app/review/[lang]/page.tsx
'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { TranslationEditor } from '@/components/TranslationEditor';
import { PreviewPane } from '@/components/PreviewPane';
import { Navigation } from '@/components/Navigation';

export default function ReviewPage({ params }: { params: { lang: string } }) {
  const [selectedFile, setSelectedFile] = useState('home');
  const [selectedPath, setSelectedPath] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['translations', params.lang, selectedFile],
    queryFn: () => fetchTranslations(params.lang, selectedFile)
  });

  const saveMutation = useMutation({
    mutationFn: (change: any) => saveTranslation(change),
    onSuccess: () => {
      // Show success toast
    }
  });

  const handleTranslationChange = (path: string, value: string) => {
    saveMutation.mutate({
      language: params.lang,
      fileType: selectedFile,
      path,
      value,
      reviewer: 'current-user@example.com' // Get from auth
    });
  };

  return (
    <div className="h-screen flex">
      <Navigation
        language={params.lang}
        selectedFile={selectedFile}
        onFileSelect={setSelectedFile}
      />
      
      <div className="flex-1 grid grid-cols-2">
        <div className="border-r overflow-y-auto p-4">
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <TranslationEditor
              original={data.original}
              current={data.current}
              changes={data.changes}
              onChange={handleTranslationChange}
            />
          )}
        </div>
        
        <PreviewPane
          language={params.lang}
          pageType={selectedFile}
          pagePath={selectedPath}
        />
      </div>
    </div>
  );
}
```

### Deployment

1. **Vercel Deployment**
```json
// vercel.json
{
  "functions": {
    "src/app/api/screenshots/capture/route.ts": {
      "maxDuration": 60
    }
  },
  "env": {
    "REVIEW_PASSWORD": "@review-password",
    "SCREENSHOT_UPDATE_TOKEN": "@screenshot-token"
  }
}
```

2. **GitHub Actions for Screenshots**
```yaml
# .github/workflows/update-screenshots.yml
name: Update Screenshots
on:
  schedule:
    - cron: '0 0 * * 0' # Weekly
  workflow_dispatch:

jobs:
  capture:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run capture-screenshots
      - uses: actions/upload-artifact@v3
        with:
          name: screenshots
          path: public/screenshots
```

## Option B: Translation Management Platform Integration

### Overview
Integrate with established Translation Management Systems (TMS) like Crowdin, Lokalise, or Phrase for a professional translation review workflow.

### Platform Comparison

| Feature | Crowdin | Lokalise | Phrase |
|---------|---------|----------|---------|
| Price (Monthly) | $50-500 | $120-600 | $140-700 |
| JSON Support | ✓ | ✓ | ✓ |
| Custom Preview | ✓ | ✓ | Limited |
| API Access | ✓ | ✓ | ✓ |
| Collaboration | ✓ | ✓ | ✓ |
| Version Control | ✓ | ✓ | ✓ |

### Crowdin Implementation (Recommended)

#### Step 1: Project Setup

1. **Create Crowdin Project**
   - Sign up at crowdin.com
   - Create new project "UBPod Translations"
   - Set source language to English

2. **Install Crowdin CLI**
```bash
npm install -g @crowdin/cli
```

3. **Configure crowdin.yml**
```yaml
project_id: "123456"
api_token: "YOUR_API_TOKEN"
base_path: "./src/locales"
preserve_hierarchy: true

files:
  - source: "/en/**/*.json"
    translation: "/%two_letters_code%/**/%original_file_name%"
    update_option: "update_as_unapproved"
```

#### Step 2: Upload Source Files

```bash
# Upload all English source files
crowdin upload sources

# Upload existing translations
crowdin upload translations
```

#### Step 3: Configure In-Context Preview

1. **Create Preview Configuration**
```javascript
// crowdin-preview-config.js
module.exports = {
  projectId: 123456,
  previewUrl: 'https://ubpod.vercel.app/{language}/{path}',
  mapping: {
    'home.json': '',
    'series.json': 'series',
    'episode.json': 'series/{series_id}/{episode_id}',
    'contact.json': 'contact',
    'disclaimer.json': 'disclaimer'
  }
};
```

2. **Implement Preview Script**
```typescript
// scripts/crowdin-preview.ts
import { CrowdinApi } from '@crowdin/crowdin-api-client';

const crowdin = new CrowdinApi({
  token: process.env.CROWDIN_API_TOKEN
});

async function setupPreview() {
  const project = await crowdin.projectsGroupsApi.getProject(123456);
  
  // Configure in-context localization
  await crowdin.projectsGroupsApi.editProject(123456, {
    inContextPseudoLanguageId: 'en-UD',
    inContextProcessHiddenStrings: true
  });
}
```

#### Step 4: Reviewer Workflow

1. **Invite Reviewers**
```typescript
// scripts/invite-reviewers.ts
const reviewers = [
  { email: 'spanish@example.com', languages: ['es'] },
  { email: 'french@example.com', languages: ['fr'] },
  { email: 'portuguese@example.com', languages: ['pt'] }
];

async function inviteReviewers() {
  for (const reviewer of reviewers) {
    await crowdin.usersApi.inviteUser({
      email: reviewer.email,
      permissions: {
        es: reviewer.languages.includes('es') ? 'translator' : null,
        fr: reviewer.languages.includes('fr') ? 'translator' : null,
        pt: reviewer.languages.includes('pt') ? 'translator' : null
      }
    });
  }
}
```

2. **Setup Webhooks**
```typescript
// src/app/api/crowdin/webhook/route.ts
export async function POST(req: Request) {
  const event = await req.json();
  
  switch (event.event) {
    case 'translation.approved':
      // Trigger build
      await triggerVercelBuild();
      break;
    case 'file.translated':
      // Download updated translations
      await downloadTranslations();
      break;
  }
  
  return Response.json({ received: true });
}
```

#### Step 5: Automation

1. **GitHub Action for Sync**
```yaml
# .github/workflows/crowdin-sync.yml
name: Crowdin Sync
on:
  push:
    paths:
      - 'src/locales/en/**/*.json'
  schedule:
    - cron: '0 */6 * * *'

jobs:
  synchronize:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: crowdin/github-action@v1
        with:
          upload_sources: true
          upload_translations: true
          download_translations: true
          create_pull_request: true
        env:
          CROWDIN_PROJECT_ID: ${{ secrets.CROWDIN_PROJECT_ID }}
          CROWDIN_PERSONAL_TOKEN: ${{ secrets.CROWDIN_PERSONAL_TOKEN }}
```

### Lokalise Implementation

#### Step 1: Setup

```bash
# Install Lokalise CLI
curl -sfL https://raw.githubusercontent.com/lokalise/lokalise-cli-2-go/master/install.sh | sh

# Configure
lokalise2 --token YOUR_TOKEN --project-id YOUR_PROJECT_ID
```

#### Step 2: Upload Configuration

```yaml
# lokalise.yml
project_id: "YOUR_PROJECT_ID"
file_format: json
upload:
  files:
    - file: "src/locales/en/**/*.json"
      lang_iso: en
  options:
    replace_modified: true
    tag_inserted_keys: true
    tag_updated_keys: true
```

#### Step 3: Custom Preview Integration

```javascript
// lokalise-preview.js
const axios = require('axios');

async function updatePreviewUrls() {
  const keys = await getProjectKeys();
  
  for (const key of keys) {
    const previewUrl = generatePreviewUrl(key);
    await updateKeyPreview(key.id, previewUrl);
  }
}

function generatePreviewUrl(key) {
  const page = key.filenames[0].replace('.json', '');
  return `https://ubpod.vercel.app/preview?key=${key.name}&page=${page}`;
}
```

## Option C: Google Sheets Solution

### Overview
A lightweight solution using Google Sheets as the review interface with Google Apps Script for import/export functionality.

### Architecture

```
Google Workspace Setup:
├── Master Spreadsheet (per language)
│   ├── UI Translations Sheet
│   ├── Content Sheet (by series)
│   └── Review Status Sheet
├── Google Forms (for structured input)
└── Apps Script Project
    ├── Import.gs
    ├── Export.gs
    ├── Sync.gs
    └── UI.gs
```

### Step-by-Step Implementation

#### Step 1: Create Google Sheets Structure

1. **Master Spreadsheet Template**
```
Columns:
A: File Path (e.g., home.hero.title)
B: English Original
C: Current Translation
D: Proposed Translation
E: Status (Pending/Approved/Rejected)
F: Reviewer Notes
G: Last Modified
H: Modified By
```

2. **Apps Script Setup**
```javascript
// Code.gs - Main script file
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('UBPod Translations')
    .addItem('Import JSON Files', 'importTranslations')
    .addItem('Export Reviewed', 'exportTranslations')
    .addItem('Update Screenshots', 'updateScreenshots')
    .addSeparator()
    .addItem('Settings', 'showSettings')
    .addToUi();
}
```

#### Step 2: Import Functionality

```javascript
// Import.gs
function importTranslations() {
  const config = getConfig();
  const sheet = SpreadsheetApp.getActiveSheet();
  
  // Clear existing data
  sheet.clear();
  
  // Set headers
  const headers = [
    'Path', 'English', 'Current Translation', 
    'Proposed Translation', 'Status', 'Notes', 
    'Last Modified', 'Modified By'
  ];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Import each JSON file
  const files = ['home', 'series', 'episode', 'common', 'contact', 'disclaimer'];
  let rowIndex = 2;
  
  files.forEach(file => {
    const enData = fetchJson(`${config.baseUrl}/en/${file}.json`);
    const langData = fetchJson(`${config.baseUrl}/${config.language}/${file}.json`);
    
    const rows = flattenJson(enData, langData, file);
    if (rows.length > 0) {
      sheet.getRange(rowIndex, 1, rows.length, headers.length)
        .setValues(rows);
      rowIndex += rows.length;
    }
  });
  
  // Apply formatting
  formatSheet(sheet);
}

function flattenJson(enObj, langObj, prefix = '', rows = []) {
  for (const key in enObj) {
    const path = prefix ? `${prefix}.${key}` : key;
    
    if (typeof enObj[key] === 'object' && !Array.isArray(enObj[key])) {
      flattenJson(enObj[key], langObj[key] || {}, path, rows);
    } else {
      rows.push([
        path,
        enObj[key],
        langObj[key] || '',
        '', // Proposed translation
        'Pending',
        '', // Notes
        new Date(),
        Session.getActiveUser().getEmail()
      ]);
    }
  }
  return rows;
}
```

#### Step 3: Export Functionality

```javascript
// Export.gs
function exportTranslations() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  // Group by file
  const fileGroups = {};
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const path = row[0];
    const proposedTranslation = row[3];
    const status = row[4];
    
    if (status === 'Approved' && proposedTranslation) {
      const [file, ...pathParts] = path.split('.');
      
      if (!fileGroups[file]) {
        fileGroups[file] = {};
      }
      
      setNestedValue(fileGroups[file], pathParts, proposedTranslation);
    }
  }
  
  // Create export folder in Drive
  const folder = DriveApp.createFolder(`UBPod Export - ${new Date().toISOString()}`);
  
  // Export each file
  Object.entries(fileGroups).forEach(([filename, content]) => {
    const blob = Utilities.newBlob(
      JSON.stringify(content, null, 2),
      'application/json',
      `${filename}.json`
    );
    folder.createFile(blob);
  });
  
  // Show download link
  SpreadsheetApp.getUi().alert(
    `Export complete! Files saved to:\n${folder.getUrl()}`
  );
}

function setNestedValue(obj, path, value) {
  const lastKey = path.pop();
  const target = path.reduce((curr, key) => {
    if (!curr[key]) curr[key] = {};
    return curr[key];
  }, obj);
  target[lastKey] = value;
}
```

#### Step 4: Review Form Integration

```javascript
// Form.gs
function createReviewForm() {
  const form = FormApp.create('UBPod Translation Review');
  
  form.setDescription('Review and approve translations for UBPod')
    .setCollectEmail(true)
    .setRequireLogin(true);
  
  // Language selection
  form.addListItem()
    .setTitle('Language')
    .setChoiceValues(['Spanish', 'French', 'Portuguese'])
    .setRequired(true);
  
  // Translation entry
  form.addParagraphTextItem()
    .setTitle('Path (e.g., home.hero.title)')
    .setRequired(true);
  
  form.addParagraphTextItem()
    .setTitle('Proposed Translation')
    .setRequired(true);
  
  form.addParagraphTextItem()
    .setTitle('Notes (optional)')
    .setRequired(false);
  
  // Set up form submission trigger
  ScriptApp.newTrigger('onFormSubmit')
    .forForm(form)
    .onFormSubmit()
    .create();
  
  return form.getPublishedUrl();
}

function onFormSubmit(e) {
  const response = e.response;
  const itemResponses = response.getItemResponses();
  
  const language = itemResponses[0].getResponse();
  const path = itemResponses[1].getResponse();
  const translation = itemResponses[2].getResponse();
  const notes = itemResponses[3]?.getResponse() || '';
  
  // Update spreadsheet
  updateTranslation(language, path, translation, notes, response.getEmail());
}
```

#### Step 5: Screenshot Integration

```javascript
// Screenshots.gs
function updateScreenshots() {
  const config = getConfig();
  const screenshotFolder = getOrCreateFolder('UBPod Screenshots');
  
  const pages = [
    { name: 'Home', path: '' },
    { name: 'Series', path: 'series' },
    { name: 'Contact', path: 'contact' },
    { name: 'Disclaimer', path: 'disclaimer' }
  ];
  
  pages.forEach(page => {
    const url = `${config.baseUrl}/${config.language}/${page.path}`;
    const screenshot = captureScreenshot(url);
    
    if (screenshot) {
      screenshotFolder.createFile(screenshot)
        .setName(`${page.name}_${config.language}.png`);
    }
  });
}

function captureScreenshot(url) {
  // Use external screenshot API
  const apiUrl = `https://api.screenshotmachine.com/?key=${getApiKey()}&url=${encodeURIComponent(url)}&dimension=1280x800`;
  
  try {
    const response = UrlFetchApp.fetch(apiUrl);
    return response.getBlob();
  } catch (e) {
    console.error('Screenshot failed:', e);
    return null;
  }
}
```

### Deployment

1. **Share Configuration**
   - Create master spreadsheet
   - Share with reviewers (edit access)
   - Publish Apps Script as web app

2. **Reviewer Instructions**
```markdown
# UBPod Translation Review Guide

1. Open the spreadsheet for your language
2. Review translations in column D
3. Enter proposed changes in column E
4. Update status to "Approved" when satisfied
5. Add any notes in column F
6. Use Tools > UBPod Translations > Export when batch is complete
```

## Option D: Lightweight Static Site Generator

### Overview
Build a static review site using Astro or 11ty that generates review pages from JSON files.

### Astro Implementation

#### Project Structure
```
ubpod-review-astro/
├── src/
│   ├── pages/
│   │   ├── index.astro
│   │   ├── [lang]/
│   │   │   ├── index.astro
│   │   │   └── [file].astro
│   ├── components/
│   │   ├── TranslationRow.astro
│   │   ├── PreviewFrame.astro
│   │   └── SaveButton.astro
│   ├── layouts/
│   │   └── ReviewLayout.astro
│   └── data/
│       ├── translations/
│       └── screenshots/
├── public/
└── astro.config.mjs
```

#### Step 1: Setup

```bash
npm create astro@latest ubpod-review-astro
cd ubpod-review-astro
npm install @astrojs/node @astrojs/tailwind
```

#### Step 2: Review Page Component

```astro
---
// src/pages/[lang]/[file].astro
import ReviewLayout from '../../layouts/ReviewLayout.astro';
import TranslationRow from '../../components/TranslationRow.astro';
import { getTranslations, flattenObject } from '../../utils/translations';

const { lang, file } = Astro.params;

const enTranslations = await getTranslations('en', file);
const langTranslations = await getTranslations(lang, file);

const translations = flattenObject(enTranslations).map(({ path, value }) => ({
  path,
  english: value,
  current: getValueByPath(langTranslations, path),
  proposed: ''
}));

// Handle POST requests for saving
if (Astro.request.method === 'POST') {
  const formData = await Astro.request.formData();
  const updates = JSON.parse(formData.get('updates'));
  await saveTranslations(lang, file, updates);
  return Astro.redirect(`/${lang}/${file}?saved=true`);
}
---

<ReviewLayout title={`Review ${file} - ${lang}`}>
  <div class="grid grid-cols-2 gap-4 h-screen">
    <div class="overflow-y-auto p-4">
      <h1 class="text-2xl font-bold mb-4">
        {file} translations ({lang})
      </h1>
      
      <form method="POST" id="translation-form">
        {translations.map(trans => (
          <TranslationRow 
            path={trans.path}
            english={trans.english}
            current={trans.current}
          />
        ))}
        
        <button 
          type="submit" 
          class="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Save All Changes
        </button>
      </form>
    </div>
    
    <div class="border-l">
      <iframe 
        src={`https://ubpod.vercel.app/${lang}/${file === 'home' ? '' : file}`}
        class="w-full h-full"
      />
    </div>
  </div>
  
  <script>
    // Collect all changes before submitting
    document.getElementById('translation-form').addEventListener('submit', (e) => {
      e.preventDefault();
      
      const updates = {};
      document.querySelectorAll('[data-translation-input]').forEach(input => {
        if (input.value !== input.dataset.original) {
          updates[input.dataset.path] = input.value;
        }
      });
      
      const formData = new FormData();
      formData.append('updates', JSON.stringify(updates));
      
      fetch(window.location.pathname, {
        method: 'POST',
        body: formData
      }).then(() => {
        window.location.reload();
      });
    });
  </script>
</ReviewLayout>
```

#### Step 3: Translation Row Component

```astro
---
// src/components/TranslationRow.astro
const { path, english, current } = Astro.props;
---

<div class="border rounded p-4 mb-4">
  <div class="text-sm text-gray-600 mb-2">{path}</div>
  
  <div class="grid grid-cols-2 gap-4">
    <div>
      <label class="block text-sm font-medium mb-1">English</label>
      <div class="bg-gray-50 p-2 rounded">{english}</div>
    </div>
    
    <div>
      <label class="block text-sm font-medium mb-1">Translation</label>
      <textarea
        data-translation-input
        data-path={path}
        data-original={current}
        class="w-full p-2 border rounded"
        rows="3"
      >{current}</textarea>
    </div>
  </div>
</div>
```

#### Step 4: Netlify CMS Integration

```yaml
# public/admin/config.yml
backend:
  name: git-gateway
  branch: main

media_folder: public/images
public_folder: /images

collections:
  - name: "translations"
    label: "Translations"
    folder: "src/data/translations"
    format: "json"
    create: false
    fields:
      - { label: "Language", name: "language", widget: "string" }
      - { label: "File", name: "file", widget: "string" }
      - { label: "Translations", name: "translations", widget: "object" }
```

### Deployment

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

## Technical Specifications

### Data Models

```typescript
// Translation Change Model
interface TranslationChange {
  id: string;
  language: string;
  file: string;
  path: string;
  originalValue: string;
  previousValue: string;
  newValue: string;
  reviewer: string;
  reviewedAt: Date;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
}

// Review Session Model
interface ReviewSession {
  id: string;
  language: string;
  reviewer: string;
  startedAt: Date;
  lastActivityAt: Date;
  changes: TranslationChange[];
  completed: boolean;
}

// Translation File Model
interface TranslationFile {
  language: string;
  filename: string;
  content: Record<string, any>;
  lastModified: Date;
  reviewStatus: {
    totalStrings: number;
    reviewedStrings: number;
    approvedStrings: number;
  };
}
```

### API Endpoints

```typescript
// Core API Routes
interface ApiRoutes {
  // Authentication
  'POST /api/auth/login': { body: { password: string } };
  'POST /api/auth/logout': {};
  
  // Translations
  'GET /api/translations/:lang/:file': TranslationFile;
  'POST /api/translations/:lang/:file': { body: TranslationChange };
  'GET /api/translations/changes/:lang': TranslationChange[];
  'POST /api/translations/export/:lang': { format: 'json' | 'zip' };
  
  // Screenshots
  'GET /api/screenshots/:lang/:page': Blob;
  'POST /api/screenshots/refresh': { pages?: string[] };
  
  // Review Sessions
  'GET /api/sessions/current': ReviewSession;
  'POST /api/sessions/complete': { sessionId: string };
}
```

### Security Considerations

1. **Authentication**
   - Password-based access for reviewers
   - Session management with secure cookies
   - Optional OAuth integration

2. **Authorization**
   - Language-specific permissions
   - Read-only access for viewers
   - Admin access for exports

3. **Data Protection**
   - Backup original files before modifications
   - Change history tracking
   - Rollback capabilities

## Implementation Timeline

### MVP Phase (2-3 days)
- Basic authentication
- Single file review interface
- Manual screenshot upload
- JSON export functionality

### Core Features Phase (1 week)
- All file types support
- Split-screen interface
- Auto-save functionality
- Basic navigation

### Advanced Features Phase (2 weeks)
- Automated screenshots
- Diff view
- Batch operations
- Progress tracking
- Collaboration features

## Decision Matrix

| Criteria | Custom Next.js | TMS Platform | Google Sheets | Static Site |
|----------|---------------|--------------|---------------|-------------|
| **Development Time** | 2-3 weeks | 1 week | 3-5 days | 1-2 weeks |
| **Monthly Cost** | $0-20 | $50-500 | $0 | $0-20 |
| **Customization** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ |
| **User Experience** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Maintenance** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Scalability** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ |
| **Collaboration** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Learning Curve** | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

## Recommendations

### For Immediate Needs (< 1 week)
**Google Sheets Solution** - Quick to implement, familiar interface, minimal development.

### For Long-term Scalability
**Custom Next.js Application** - Full control, best UX, grows with your needs.

### For Professional Workflow
**Crowdin Integration** - Industry-standard tools, minimal maintenance, collaboration features.

### For Technical Teams
**Static Site with GitHub PR Workflow** - Developer-friendly, version controlled, transparent.

## Next Steps

1. **Evaluate** your team's technical capabilities
2. **Consider** long-term translation needs (more languages, more content)
3. **Test** with a pilot group of reviewers
4. **Budget** for development time and ongoing costs
5. **Plan** for maintenance and updates

Choose the option that best balances your immediate needs with future scalability requirements.