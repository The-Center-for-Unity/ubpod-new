# UrantiaBookPod Content Pipeline

## Overview

This document describes the content pipeline for the UrantiaBookPod application, including how text content is organized, how audio files are processed, and how the content is served to users. Understanding this pipeline is essential for maintaining and extending the application.

## Content Structure

The UrantiaBookPod content is organized hierarchically:

1. **Series**: Collections of episodes with a common theme (e.g., "Jesus' Childhood", "Cosmic Origins")
2. **Episodes**: Individual audio recordings with associated text (e.g., "Paper 122: Birth and Infancy of Jesus")
3. **Audio Files**: MP3 files corresponding to each episode

## Data Sources

### Series and Episode Metadata

Series and episode metadata is stored in TypeScript files:

- `src/data/episodes.ts`: Contains episode data, including titles, descriptions, and references to audio files
- `src/utils/seriesUtils.ts`: Contains series information and utilities for retrieving series data
- `src/utils/episodeUtils.ts`: Contains utilities for retrieving and filtering episode data

### Audio Files

Audio files are stored in an Amazon S3 bucket accessible via:

- Production: `https://cdn.urantiabookpod.com/audio/[series-id]/[episode-id].mp3`
- Development: Environment-specific URLs defined in `.env` files

## Content Pipeline Workflow

### 1. Content Creation

1. **Text Selection**:
   - Text is selected from the Urantia Book
   - Sections are organized into logical episodes

2. **Audio Generation**:
   - Text is processed through AI voice generation
   - Audio files are edited for quality and consistency
   - Final MP3 files are produced with appropriate metadata

3. **Metadata Creation**:
   - Episode metadata is created (title, description, summary)
   - Series metadata is created (title, description, category)

### 2. Content Integration

1. **Audio Upload**:
   - MP3 files are uploaded to Amazon S3 using the sync scripts
   - Files are organized by series and episode ID
   - CDN configuration ensures proper caching and delivery

2. **Metadata Integration**:
   - Episode data is added to the episodes.ts file
   - Series information is updated in seriesUtils.ts
   - URL mappings are updated if needed

3. **Application Update**:
   - The application is rebuilt and deployed after content updates
   - CDN cache is invalidated if necessary

### 3. Content Delivery

1. **Content Discovery**:
   - Users browse available series on the Series page
   - Series are categorized by theme (Jesus-focused, Cosmic)
   - Users can search for specific content

2. **Content Consumption**:
   - Users navigate to a specific episode
   - Audio file is streamed from the CDN
   - Text content is displayed alongside the audio
   - Analytics track user engagement

## Audio File Management

### Syncing Audio Files

Audio files are synced to Amazon S3 using the sync scripts in the `synch-r2` directory:

```bash
# Example sync command
node synch-r2/sync.js --source ./audio --dest s3://urantiabookpod/audio
```

### Audio File Naming Convention

Audio files follow this naming convention:

- Series directory: `[series-id]/`
- Episode filename: `[episode-id].mp3`

Example: `jesus-childhood/1.mp3`

### Audio File Requirements

- Format: MP3
- Bitrate: 128 kbps
- Sample Rate: 44.1 kHz
- Metadata: ID3 tags for title, artist, album

## Error Handling

The content pipeline includes error handling at multiple levels:

1. **Missing Audio Files**:
   - Application checks if audio files exist before attempting playback
   - Fallback UI displays error messages and download links

2. **Invalid Metadata**:
   - Data validation ensures all required fields are present
   - Fallback to default values when possible

3. **Loading Failures**:
   - Retry mechanisms for audio loading
   - Graceful degradation when content cannot be loaded

## Content Update Process

### Adding a New Series

1. Update `seriesUtils.ts` with new series metadata:

```typescript
// Example of adding a new series
const series: SeriesInfo[] = [
  // Existing series...
  {
    id: 'new-series',
    title: 'New Series Title',
    description: 'Description of the new series',
    category: 'cosmic',
    totalEpisodes: 5,
    // Additional metadata...
  }
];
```

2. Create episode data in `episodes.ts` for each episode in the series:

```typescript
// Example of adding episodes for a new series
const newSeriesEpisodes: Episode[] = [
  {
    id: 1,
    title: 'Episode 1 Title',
    description: 'Description of episode 1',
    series: 'new-series',
    audioUrl: 'https://cdn.urantiabookpod.com/audio/new-series/1.mp3',
    // Additional metadata...
  },
  // More episodes...
];

// Add to the episodes object
const episodes = {
  // Existing episodes...
  'new-series': newSeriesEpisodes,
};
```

3. Upload audio files to S3 using the sync script.

4. Rebuild and deploy the application.

### Updating Existing Content

1. Update the relevant metadata in `episodes.ts` or `seriesUtils.ts`.
2. Replace audio files in S3 if needed.
3. Rebuild and deploy the application.

## Content Quality Assurance

Before adding new content to the application:

1. **Audio Quality Check**:
   - Verify audio file plays correctly
   - Check volume levels and clarity
   - Confirm proper pronunciation of specialized terms

2. **Metadata Verification**:
   - Verify all required fields are present
   - Check for typos in titles and descriptions
   - Ensure proper categorization

3. **Integration Testing**:
   - Test the content in a development environment
   - Verify audio playback works correctly
   - Check that navigation between episodes works
   - Test search functionality with the new content

## Content Analytics

The application tracks user engagement with content:

1. **Playback Analytics**:
   - Play/pause events
   - Completion rates
   - Skip behaviors

2. **Navigation Analytics**:
   - Series popularity
   - Episode views
   - Time spent on content

These analytics help inform future content development and UI improvements.

## Conclusion

The UrantiaBookPod content pipeline provides a systematic approach to managing audio content for the Urantia Book. By following these processes, the application can maintain high-quality content while enabling scalable growth as new series and episodes are added. 