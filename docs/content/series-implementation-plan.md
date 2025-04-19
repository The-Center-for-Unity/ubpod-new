# UrantiaBookPod Series Implementation Plan

## Overview

This document outlines the implementation plan for adding new thematic series to the UrantiaBookPod application. The plan includes:

1. **Existing Content Series (1-14)**: Jesus-focused materials already produced and organized into thematic collections
2. **New Series (15-28)**: Content covering Parts I-III of The Urantia Book

These series are based on the content described in the "Urantia Book Podcast - Series Synopses" and "Urantia Book Podcast (UBPod) - Series Organization Plan" documents.

## Objectives

1. Extend the current series type system to support all thematic series (1-28)
2. Create data structures for all series episodes
3. Update the UI components to display and navigate the series
4. Implement series-specific styling and visual elements
5. Ensure proper audio and PDF file handling for the new content

## Technical Requirements

### 1. Type Definitions Update

Update the `src/types/index.ts` file to include all series types:

```typescript
export type SeriesType = 
  // Current platform series
  'urantia-papers' | 
  'discover-jesus' | 
  'history' | 
  'sadler-workbooks' |
  
  // Jesus-focused series (1-14)
  'beyond-traditional-religion' |
  'jesus-revealed' |
  'inner-divine-presence' |
  'life-after-death' |
  'women-in-leadership' |
  'good-evil-reconsidered' |
  'prayer-worship' |
  'angels-celestial-beings' |
  'kingdom-of-heaven' |
  'jesus-transformative-moments' |
  'human-experience' |
  'jesus-death-resurrection' |
  'evolving-faith' |
  'human-jesus' |
  
  // New series for Parts I-III (15-28)
  'cosmic-origins' |
  'divine-personalities' |
  'thought-adjuster' |
  'local-universe' |
  'angels-among-us' |
  'life-after-death-ascension' |
  'urantia-history' |
  'lucifer-rebellion' |
  'adam-and-eve' |
  'melchizedek-missions' |
  'evolution-of-religion' |
  'genuine-spirituality' |
  'supreme-being' |
  'divine-family';
```

### 2. Data Implementation

Create new data files and functions in `src/data/episodes.ts` for all series:

```typescript
// Existing series getter functions (keep as is)
export function getUrantiaPapers(): Episode[] { /* ... */ }
export function getDiscoverJesusEpisodes(): Episode[] { /* ... */ }
export function getHistoryEpisodes(): Episode[] { /* ... */ }
export function getSadlerWorkbooks(): Episode[] { /* ... */ }

// Jesus-focused series (1-14) getter functions
export function getBeyondTraditionalReligionEpisodes(): Episode[] { /* ... */ }
export function getJesusRevealedEpisodes(): Episode[] { /* ... */ }
export function getInnerDivinePresenceEpisodes(): Episode[] { /* ... */ }
// ...etc for all Jesus-focused series

// New series for Parts I-III (15-28) getter functions
export function getCosmicOriginsEpisodes(): Episode[] { /* ... */ }
export function getDivinePersonalitiesEpisodes(): Episode[] { /* ... */ }
export function getThoughtAdjusterEpisodes(): Episode[] { /* ... */ }
// ...etc for all new series
```

Update the `getEpisodeById` function to handle all series types:

```typescript
export function getEpisodeById(id: number, series: string): Episode | undefined {
  switch (series) {
    // Existing cases
    case 'urantia-papers':
      return urantiaEpisodes.find(ep => ep.id === id);
    case 'discover-jesus':
      return discoverJesusEpisodes.find(ep => ep.id === id);
    case 'history':
      return historyEpisodes.find(ep => ep.id === id);
    case 'sadler-workbooks':
      return sadlerWorkbooksEpisodes.find(ep => ep.id === id);
      
    // Jesus-focused series (1-14)
    case 'beyond-traditional-religion':
      return beyondTraditionalReligionEpisodes.find(ep => ep.id === id);
    case 'jesus-revealed':
      return jesusRevealedEpisodes.find(ep => ep.id === id);
    // ...add all other Jesus-focused series
    
    // New series for Parts I-III (15-28)
    case 'cosmic-origins':
      return cosmicOriginsEpisodes.find(ep => ep.id === id);
    case 'divine-personalities':
      return divinePersonalitiesEpisodes.find(ep => ep.id === id);
    // ...add all other new series
    
    default:
      return undefined;
  }
}
```

### 3. Series Mapping

Create a utility file for managing series information, including all 28 series:

```typescript
// src/utils/seriesUtils.ts

interface SeriesInfo {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  order: number;
  category: 'platform' | 'jesus-focused' | 'parts-i-iii';
}

export const seriesMap: Record<string, SeriesInfo> = {
  // Platform series
  'urantia-papers': {
    id: 'urantia-papers',
    title: 'The Urantia Papers',
    description: 'Complete narration of all 196 papers of The Urantia Book',
    imageUrl: '/images/series/urantia-papers.jpg',
    order: 1,
    category: 'platform'
  },
  'discover-jesus': {
    id: 'discover-jesus',
    title: 'Discover Jesus',
    description: 'Exploring the life and teachings of Jesus',
    imageUrl: '/images/series/discover-jesus.jpg',
    order: 2,
    category: 'platform'
  },
  'history': {
    id: 'history',
    title: 'History of the Urantia Book',
    description: 'The story behind the Urantia revelation',
    imageUrl: '/images/series/history.jpg',
    order: 3,
    category: 'platform'
  },
  'sadler-workbooks': {
    id: 'sadler-workbooks',
    title: 'Dr. Sadler\'s Workbooks',
    description: 'Study materials from Dr. William S. Sadler',
    imageUrl: '/images/series/sadler-workbooks.jpg',
    order: 4,
    category: 'platform'
  },
  
  // Jesus-focused series (1-14)
  'beyond-traditional-religion': {
    id: 'beyond-traditional-religion',
    title: 'Beyond Traditional Religion: The True Nature of God',
    description: 'Exploring the profound revelation of God\'s true nature as presented in The Urantia Book.',
    imageUrl: '/images/series/beyond-traditional-religion.jpg',
    order: 5,
    category: 'jesus-focused'
  },
  'jesus-revealed': {
    id: 'jesus-revealed',
    title: 'Jesus Revealed: Beyond the Biblical Account',
    description: 'Unveiling the missing years and untold adventures of Jesus that aren\'t recorded in traditional Biblical texts.',
    imageUrl: '/images/series/jesus-revealed.jpg',
    order: 6,
    category: 'jesus-focused'
  },
  'inner-divine-presence': {
    id: 'inner-divine-presence',
    title: 'The Inner Divine Presence: Thought Adjusters & Holy Spirit',
    description: 'Exploring the Urantia Book\'s revolutionary concept of the Thought Adjuster and how it relates to traditional concepts of the Holy Spirit.',
    imageUrl: '/images/series/inner-divine-presence.jpg',
    order: 7,
    category: 'jesus-focused'
  },
  'life-after-death': {
    id: 'life-after-death',
    title: 'Life After Death: The Mansion World Journey',
    description: 'Revealing the Urantia Book\'s detailed account of the afterlife journey.',
    imageUrl: '/images/series/life-after-death.jpg',
    order: 8,
    category: 'jesus-focused'
  },
  'women-in-leadership': {
    id: 'women-in-leadership',
    title: 'Women in Spiritual Leadership: A New Perspective',
    description: 'Exploring Jesus\' radical inclusion of women in his ministry.',
    imageUrl: '/images/series/women-in-leadership.jpg',
    order: 9,
    category: 'jesus-focused'
  },
  'good-evil-reconsidered': {
    id: 'good-evil-reconsidered',
    title: 'Good & Evil Reconsidered: Beyond Traditional Theology',
    description: 'Reframing traditional concepts of good and evil through the Urantia Book\'s evolutionary perspective.',
    imageUrl: '/images/series/good-evil-reconsidered.jpg',
    order: 10,
    category: 'jesus-focused'
  },
  'prayer-worship': {
    id: 'prayer-worship',
    title: 'Prayer & Worship: Enhanced Understanding',
    description: 'Exploring the Urantia Book\'s comprehensive teachings on prayer and worship.',
    imageUrl: '/images/series/prayer-worship.jpg',
    order: 11,
    category: 'jesus-focused'
  },
  'angels-celestial-beings': {
    id: 'angels-celestial-beings',
    title: 'Angels & Celestial Beings: The Cosmic Hierarchy',
    description: 'Exploring the Urantia Book\'s extensive revelations about the vast hierarchy of celestial personalities.',
    imageUrl: '/images/series/angels-celestial-beings.jpg',
    order: 12,
    category: 'jesus-focused'
  },
  'kingdom-of-heaven': {
    id: 'kingdom-of-heaven',
    title: 'The Kingdom of Heaven: Spiritual Reality vs. Religious Concept',
    description: 'Exploring what Jesus really meant when he spoke of the "kingdom of heaven."',
    imageUrl: '/images/series/kingdom-of-heaven.jpg',
    order: 13,
    category: 'jesus-focused'
  },
  'jesus-transformative-moments': {
    id: 'jesus-transformative-moments',
    title: 'Jesus\' Transformative Moments: Behind the Familiar Stories',
    description: 'Examining key moments in Jesus\' ministry and their deeper spiritual meanings.',
    imageUrl: '/images/series/jesus-transformative-moments.jpg',
    order: 14,
    category: 'jesus-focused'
  },
  'human-experience': {
    id: 'human-experience',
    title: 'The Human Experience: Divine Insights on Daily Challenges',
    description: 'Presenting the Urantia Book\'s practical guidance on everyday human concerns.',
    imageUrl: '/images/series/human-experience.jpg',
    order: 15,
    category: 'jesus-focused'
  },
  'jesus-death-resurrection': {
    id: 'jesus-death-resurrection',
    title: 'Jesus\' Death & Resurrection: The Expanded Narrative',
    description: 'Revealing the complete story of Jesus\' final days on Earth beyond the familiar gospel accounts.',
    imageUrl: '/images/series/jesus-death-resurrection.jpg',
    order: 16,
    category: 'jesus-focused'
  },
  'evolving-faith': {
    id: 'evolving-faith',
    title: 'Evolving Faith: From Traditional Religion to Cosmic Truth',
    description: 'Tracing the development of key religious ideas through human history.',
    imageUrl: '/images/series/evolving-faith.jpg',
    order: 17,
    category: 'jesus-focused'
  },
  'human-jesus': {
    id: 'human-jesus',
    title: 'The Human Jesus: Beyond the Divine Image',
    description: 'Exploring the profoundly human aspects of Jesus\' life often overlooked in traditional portrayals.',
    imageUrl: '/images/series/human-jesus.jpg',
    order: 18,
    category: 'jesus-focused'
  },
  
  // New series for Parts I-III (15-28)
  'cosmic-origins': {
    id: 'cosmic-origins',
    title: 'Cosmic Origins: Understanding Universe Creation',
    description: 'A mind-expanding journey through the Urantia Book\'s revelations about cosmic origins and the architecture of creation.',
    imageUrl: '/images/series/cosmic-origins.jpg',
    order: 19,
    category: 'parts-i-iii'
  },
  // Add entries for all other new series
  // ...
};

export function getSeriesInfo(seriesId: string): SeriesInfo {
  return seriesMap[seriesId] || {
    id: 'unknown',
    title: 'Unknown Series',
    description: 'Series information not available',
    imageUrl: '/images/series/default.jpg',
    order: 999,
    category: 'platform'
  };
}

export function getAllSeries(): SeriesInfo[] {
  return Object.values(seriesMap).sort((a, b) => a.order - b.order);
}

export function getSeriesByCategory(category: 'platform' | 'jesus-focused' | 'parts-i-iii'): SeriesInfo[] {
  return Object.values(seriesMap)
    .filter(series => series.category === category)
    .sort((a, b) => a.order - b.order);
}
```

### 4. UI Component Updates

#### 4.1 Series Navigation Component with Categories

Enhance the Series Navigation component to display series by category:

```typescript
// src/components/ui/SeriesNavigation.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllSeries, getSeriesByCategory } from '../../utils/seriesUtils';

export default function SeriesNavigation() {
  const [activeCategory, setActiveCategory] = useState<'all' | 'platform' | 'jesus-focused' | 'parts-i-iii'>('all');
  
  const getSeriesToDisplay = () => {
    if (activeCategory === 'all') {
      return getAllSeries();
    }
    return getSeriesByCategory(activeCategory);
  };
  
  const series = getSeriesToDisplay();
  
  return (
    <div className="bg-navy-dark rounded-lg p-6">
      <h2 className="title-subtitle mb-4">Podcast Series</h2>
      
      {/* Category tabs */}
      <div className="flex space-x-2 mb-4 text-sm">
        <button 
          className={`px-3 py-1 rounded ${activeCategory === 'all' ? 'bg-primary text-white' : 'bg-navy-light/30 text-white/70 hover:bg-navy-light/50'}`}
          onClick={() => setActiveCategory('all')}
        >
          All
        </button>
        <button 
          className={`px-3 py-1 rounded ${activeCategory === 'platform' ? 'bg-primary text-white' : 'bg-navy-light/30 text-white/70 hover:bg-navy-light/50'}`}
          onClick={() => setActiveCategory('platform')}
        >
          Main
        </button>
        <button 
          className={`px-3 py-1 rounded ${activeCategory === 'jesus-focused' ? 'bg-primary text-white' : 'bg-navy-light/30 text-white/70 hover:bg-navy-light/50'}`}
          onClick={() => setActiveCategory('jesus-focused')}
        >
          Jesus
        </button>
        <button 
          className={`px-3 py-1 rounded ${activeCategory === 'parts-i-iii' ? 'bg-primary text-white' : 'bg-navy-light/30 text-white/70 hover:bg-navy-light/50'}`}
          onClick={() => setActiveCategory('parts-i-iii')}
        >
          Parts I-III
        </button>
      </div>
      
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {series.map(series => (
          <Link 
            key={series.id}
            to={`/listen/${series.id}`}
            className="block py-2 px-3 rounded hover:bg-navy-light/30 transition-colors text-white/80 hover:text-white"
          >
            {series.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
```

#### 4.2 Series Card Grid Component with Category Filtering

Enhance the Home page to show series cards with category filtering:

```typescript
// src/components/ui/SeriesCardGrid.tsx
import React, { useState } from 'react';
import { getSeriesByCategory, getAllSeries } from '../../utils/seriesUtils';
import SeriesCard from './SeriesCard';

export default function SeriesCardGrid() {
  const [activeCategory, setActiveCategory] = useState<'all' | 'platform' | 'jesus-focused' | 'parts-i-iii'>('all');
  
  const getSeriesToDisplay = () => {
    if (activeCategory === 'all') {
      return getAllSeries();
    }
    return getSeriesByCategory(activeCategory);
  };
  
  const series = getSeriesToDisplay();
  
  return (
    <div>
      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button 
          className={`px-4 py-2 rounded-full ${activeCategory === 'all' ? 'bg-primary text-white' : 'bg-navy-light/30 text-white/70 hover:bg-navy-light/50'}`}
          onClick={() => setActiveCategory('all')}
        >
          All Series
        </button>
        <button 
          className={`px-4 py-2 rounded-full ${activeCategory === 'platform' ? 'bg-primary text-white' : 'bg-navy-light/30 text-white/70 hover:bg-navy-light/50'}`}
          onClick={() => setActiveCategory('platform')}
        >
          Main Collections
        </button>
        <button 
          className={`px-4 py-2 rounded-full ${activeCategory === 'jesus-focused' ? 'bg-primary text-white' : 'bg-navy-light/30 text-white/70 hover:bg-navy-light/50'}`}
          onClick={() => setActiveCategory('jesus-focused')}
        >
          Jesus-Focused Series
        </button>
        <button 
          className={`px-4 py-2 rounded-full ${activeCategory === 'parts-i-iii' ? 'bg-primary text-white' : 'bg-navy-light/30 text-white/70 hover:bg-navy-light/50'}`}
          onClick={() => setActiveCategory('parts-i-iii')}
        >
          Parts I-III Series
        </button>
      </div>
      
      {/* Series grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {series.map(series => (
          <SeriesCard key={series.id} series={series} />
        ))}
      </div>
    </div>
  );
}
```

#### 4.3 Update Home Page

Update the Home page to use the SeriesCardGrid component:

```typescript
// src/pages/Home.tsx
// ...existing imports
import SeriesCardGrid from '../components/ui/SeriesCardGrid';

export default function HomePage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {/* Hero section */}
        <section className="mb-16">
          {/* ... */}
        </section>
        
        {/* Series section */}
        <section className="mb-16">
          <h2 className="title-section mb-8">Podcast Series</h2>
          <SeriesCardGrid />
        </section>
        
        {/* Additional sections */}
        {/* ... */}
      </div>
    </Layout>
  );
}
```

### 5. Episode Data Structure Updates

Create standardized data structures for episodes in each series:

```typescript
// Example episode data structure for a Jesus-focused series
const beyondTraditionalReligionEpisodes: Episode[] = [
  {
    id: 1,
    title: "The Personality of God",
    audioUrl: "/audio/beyond-traditional-religion/1-personality-of-god.mp3",
    pdfUrl: "/pdf/beyond-traditional-religion/1-personality-of-god.pdf",
    series: "beyond-traditional-religion",
    description: "Exploring the Urantia Book's unique revelation about God's personality and how it differs from traditional religious concepts.",
    imageUrl: "/images/beyond-traditional-religion/personality-of-god.jpg"
  },
  {
    id: 2,
    title: "Loving God Instead of Fearing God",
    audioUrl: "/audio/beyond-traditional-religion/2-loving-god.mp3",
    pdfUrl: "/pdf/beyond-traditional-religion/2-loving-god.pdf",
    series: "beyond-traditional-religion",
    description: "How the Urantia Book transforms our relationship with God from one based on fear to one grounded in love.",
    imageUrl: "/images/beyond-traditional-religion/loving-god.jpg"
  },
  // Add remaining episodes...
];
```

## Navigation Changes & UI Implementation

### 1. Main Menu Navigation

The Header component will be updated to organize series into categories for easier navigation:

```typescript
// src/components/layout/Header.tsx - Series dropdown section
<div className="relative group">
  <button className="flex items-center space-x-1 text-white/70 hover:text-white">
    <span>Series</span>
    <ChevronDown size={16} />
  </button>
  <div className="absolute left-0 mt-2 w-64 bg-navy-light rounded-lg shadow-lg overflow-hidden invisible group-hover:visible">
    {/* Main Collections */}
    <div className="border-b border-white/10">
      <button className="flex justify-between items-center w-full px-4 py-2 text-white/80 hover:bg-navy/50">
        <span>Main Collections</span>
        <ChevronRight size={16} />
      </button>
      <div className="pl-4 pb-2">
        <Link to="/listen/urantia-papers" className="block px-4 py-1 text-sm text-white/70 hover:text-white">The Urantia Papers</Link>
        {/* Other main collections */}
      </div>
    </div>
    
    {/* Jesus Series */}
    <div className="border-b border-white/10">
      <button className="flex justify-between items-center w-full px-4 py-2 text-white/80 hover:bg-navy/50">
        <span>Jesus Series</span>
        <ChevronRight size={16} />
      </button>
      <div className="pl-4 pb-2">
        <Link to="/listen/beyond-traditional-religion" className="block px-4 py-1 text-sm text-white/70 hover:text-white">Beyond Traditional Religion</Link>
        {/* Other Jesus series */}
      </div>
    </div>
    
    {/* Parts I-III Series */}
    <div>
      <button className="flex justify-between items-center w-full px-4 py-2 text-white/80 hover:bg-navy/50">
        <span>Parts I-III Series</span>
        <ChevronRight size={16} />
      </button>
      <div className="pl-4 pb-2">
        <Link to="/listen/cosmic-origins" className="block px-4 py-1 text-sm text-white/70 hover:text-white">Cosmic Origins</Link>
        {/* Other Parts I-III series */}
      </div>
    </div>
  </div>
</div>
```

The mobile menu will follow a similar structure with accordion-style expandable sections, maintaining the current design language and color scheme.

### 2. Home Page Series Showcase

The home page will use a tabbed interface to organize series by category:

```tsx
<section className="py-16 bg-navy-dark">
  <div className="container mx-auto px-4">
    <h2 className="title-main text-center mb-8">Podcast Series</h2>
    
    {/* Category tabs - using current site's button styling */}
    <div className="flex flex-wrap justify-center gap-3 mb-10">
      <button className="px-4 py-2 bg-primary text-white rounded-full">
        All Series
      </button>
      <button className="px-4 py-2 bg-navy-light/30 text-white/70 rounded-full hover:bg-navy-light/50">
        Main Collections
      </button>
      <button className="px-4 py-2 bg-navy-light/30 text-white/70 rounded-full hover:bg-navy-light/50">
        Jesus Series
      </button>
      <button className="px-4 py-2 bg-navy-light/30 text-white/70 rounded-full hover:bg-navy-light/50">
        Parts I-III Series
      </button>
    </div>
    
    {/* Series grid - using current card styling */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {/* Series cards */}
    </div>
  </div>
</section>
```

### 3. Series Landing Pages

Series overview pages will maintain the current design pattern with enhancements for category-based navigation:

```tsx
<div className="container mx-auto px-4 py-8">
  <div className="grid md:grid-cols-4 gap-8">
    {/* Sidebar - reusing current sidebar styling */}
    <div className="md:col-span-1">
      <div className="bg-navy-dark rounded-lg p-6 sticky top-24">
        <h3 className="title-subtitle mb-4">More in this Category</h3>
        {/* List of series in this category */}
      </div>
    </div>
    
    {/* Main content - keeping current page layout */}
    <div className="md:col-span-3">
      <div className="mb-8">
        <span className="inline-block px-3 py-1 bg-primary/20 text-primary rounded-full text-sm mb-4">
          {series.category === 'jesus-focused' ? 'Jesus Series' : 
           series.category === 'parts-i-iii' ? 'Parts I-III Series' : 'Main Collection'}
        </span>
        <h1 className="title-main mb-2">{series.title}</h1>
        <p className="text-white/70 mb-6">{series.description}</p>
        
        {/* Episodes grid - maintaining current card styling */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {episodes.map(episode => (
            <EpisodeCard 
              key={episode.id}
              episode={episode}
              onPlay={() => navigateToEpisode(episode.id)}
            />
          ))}
        </div>
      </div>
    </div>
  </div>
</div>
```

### 4. Episode Pages

Episode detail pages will keep the current audio player and layout with added series context:

```tsx
<div className="container mx-auto px-4 py-8">
  <div className="mb-6 flex items-center gap-2">
    <Link to={`/listen/${episode.series}`} className="flex items-center gap-1 text-white/70 hover:text-white">
      <ArrowLeft size={18} />
      <span>Back to {getSeriesInfo(episode.series).title}</span>
    </Link>
    <span className="text-white/40 mx-2">|</span>
    <span className="inline-block px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">
      {getSeriesInfo(episode.series).category === 'jesus-focused' ? 'Jesus Series' : 
       getSeriesInfo(episode.series).category === 'parts-i-iii' ? 'Parts I-III Series' : 'Main Collection'}
    </span>
  </div>
  
  {/* Main episode content - keeping current layout */}
  <div className="grid lg:grid-cols-3 gap-8">
    {/* Left side - episode info and audio player */}
    <div className="lg:col-span-2">
      <h1 className="title-main mb-4">{episode.title}</h1>
      <p className="text-white/70 mb-6">{episode.description}</p>
      
      {/* Audio player - using current design */}
      <div className="bg-navy-dark rounded-lg p-6 mb-8">
        {/* Current audio player component */}
      </div>
      
      {/* Episode navigation - using current styling */}
      <div className="flex justify-between border-t border-white/10 pt-6">
        {/* Previous/Next navigation */}
      </div>
    </div>
    
    {/* Right side - related content */}
    <div className="lg:col-span-1">
      <div className="bg-navy-dark rounded-lg p-6 mb-6">
        <h3 className="title-subtitle mb-4">In This Series</h3>
        {/* Other episodes in this series */}
      </div>
      
      <div className="bg-navy-dark rounded-lg p-6">
        <h3 className="title-subtitle mb-4">You May Also Like</h3>
        {/* Related episodes from other series */}
      </div>
    </div>
  </div>
</div>
```

### 5. R2 Asset Integration

Create a configuration system to handle assets from R2 storage for Jesus-related content:

```typescript
// src/config/assets.ts
const R2_BASE_URL = "https://your-r2-domain.com";

// Configure asset locations
export const getAssetUrl = (path: string, type: 'audio' | 'image' = 'audio') => {
  // Jesus-related files come from R2
  if (path.includes('jesus-') || 
      path.includes('beyond-traditional-religion') || 
      // ... other Jesus series
      ) {
    return `${R2_BASE_URL}/${type}/${path}`;
  }
  
  // New series files also come from R2
  if (path.includes('cosmic-origins') ||
      path.includes('divine-personalities') ||
      // ... other new series
      ) {
    return `${R2_BASE_URL}/${type}/${path}`;
  }
  
  // Default to local assets for original content
  return `/${type}/${path}`;
};

// Function to get profile image for Jesus-related content
export const getProfileImage = (audioUrl: string) => {
  // Extract the base name from audio URL
  const fileName = audioUrl.split('/').pop()?.replace('.mp3', '') || '';
  
  // Return the corresponding profile image
  return `${R2_BASE_URL}/profiles/${fileName}.jpg`;
};
```

Update the EpisodeCard component to use profile images from DiscoverJesus.com:

```tsx
// src/components/ui/EpisodeCard.tsx
import { getAssetUrl, getProfileImage } from '../../config/assets';

export default function EpisodeCard({ episode, onPlay }: EpisodeCardProps) {
  const isJesusRelated = episode.series.includes('jesus-') || 
                         episode.series === 'beyond-traditional-religion' ||
                         // ... other Jesus series
                         
  // Use profile image for Jesus-related content
  const imageUrl = isJesusRelated 
    ? getProfileImage(episode.audioUrl)
    : episode.imageUrl || '/images/default-episode.jpg';
    
  // Use correct audio URL based on source
  const audioSrc = getAssetUrl(episode.audioUrl);
  
  return (
    <div className="bg-navy-light/20 rounded-lg overflow-hidden border border-white/5 hover:border-white/20 transition-all">
      <div className="aspect-video relative">
        <img 
          src={imageUrl} 
          alt={episode.title}
          className="w-full h-full object-cover"
        />
        <button 
          onClick={onPlay}
          className="absolute bottom-4 right-4 bg-primary rounded-full p-3 hover:bg-primary-light transition-colors"
        >
          <Play size={20} className="text-white" />
        </button>
      </div>
      <div className="p-4">
        <h3 className="title-card mb-1">{episode.title}</h3>
        <p className="text-sm text-white/60 line-clamp-2">
          {episode.description || 'No description available'}
        </p>
      </div>
    </div>
  );
}
```

## Implementation Steps

1. **Data Preparation (Week 1-2)**
   - Create episode data files for all 28 series
   - Prepare audio files and PDF documents for new content
   - Update type definitions
   - Create series utility functions

2. **Component Development (Week 2-3)**
   - Implement SeriesUtils with category support
   - Create/update UI components for series navigation and display
   - Update Header navigation to support all series
   - Implement R2 asset integration

3. **Page Updates (Week 3-4)**
   - Update ListenPage to support all series with category filtering
   - Update Home page to showcase series cards with category tabs
   - Implement EpisodePage enhancements for series navigation
   - Add cross-series recommendations

4. **Testing and Refinement (Week 4-5)**
   - Test episode playback for all series
   - Verify navigation between episodes and across series
   - Ensure responsive design works for all screen sizes
   - Test category filtering functionality
   - Verify R2 asset loading for Jesus-related content

5. **Deployment (Week 6)**
   - Deploy new audio and PDF assets to R2
   - Deploy updated code
   - Monitor analytics for user engagement with new series

## Content Organization Strategy

The series will be organized into three main categories:

1. **Main Collections**
   - Urantia Papers
   - Discover Jesus
   - History of the Urantia Book
   - Dr. Sadler's Workbooks

2. **Jesus-Focused Series (1-14)**
   - Contains thematic collections focused on Jesus' life and teachings

3. **Parts I-III Series (15-28)**
   - Contains thematic collections covering Parts I-III of The Urantia Book

## Asset Requirements

For each new series, the following assets are needed:

1. **Audio Files**
   - 5 MP3 files per series (140 total for series 15-28, 70 total for series 1-14)
   - File naming convention: `/audio/[series-id]/[episode-number].mp3`
   - Jesus-related content will be hosted on R2

2. **PDF Documents** (optional)
   - 5 PDF files per series
   - File naming convention: `/pdf/[series-id]/[episode-number].pdf`

3. **Images**
   - Series card images (16:9 aspect ratio)
   - Episode thumbnail images (from DiscoverJesus.com for Jesus-related content)

## Analytics Tracking

Implement tracking for:
- Series views (by individual series and by category)
- Episode plays
- Navigation between series
- User retention within series

## Documentation

Create the following documentation:
- Content preparation guide for all series
- Audio editing specifications
- Metadata requirements for episodes
- Category organization guide

## Future Enhancements

Consider the following enhancements for future iterations:
- Series playlists
- User favorites and bookmarks
- "Continue listening" feature
- Cross-series episode recommendations
- Series category subscription options 