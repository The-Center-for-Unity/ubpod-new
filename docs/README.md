# The Divine Within - Landing Page Documentation

## Project Overview
The Divine Within landing page is a React-based web application that presents our framework for supporting spiritual seekers through technology, human connection, and timeless wisdom. The page features an interactive triangular plot visualization of our three-domain approach, complemented by a comprehensive project ecosystem display with advanced filtering capabilities.

## Framework Rationale

Our three-domain framework emerges from a deep understanding of modern spiritual seekers' journey, exemplified by Sarah's story. The framework addresses three essential elements that support authentic spiritual discovery:

1. **Discovery Domain** (Royal Blue #4169E1)
   - Provides safe entry points for spiritual exploration
   - Accessible media and technology exploration
   - Self-paced learning opportunities

2. **Connection Domain** (Dark Orchid #9932CC)
   - Creates spaces for genuine spiritual relationships
   - Safe, nurturing environments for authentic exploration
   - Community and mentorship opportunities

3. **Wisdom Domain** (Coral Red #FF6B6B)
   - Makes spiritual teachings available as seekers are ready
   - Access to profound spiritual teachings
   - Deep wisdom traditions and practices

## Technical Implementation

### Tech Stack
- React with TypeScript
- Tailwind CSS for styling
- Airtable for content management
- Framer Motion for animations
- Vercel for deployment

### Key Features

#### 1. Interactive Project Visualization
- Triangular plot showing project distribution across domains
- Barycentric coordinate system for accurate positioning
- Hover effects for project details
- Orbital arrangement for overlapping projects

#### 2. Advanced Filtering System
- Filter by Domain (Discovery, Connection, Wisdom)
- Filter by Provider (organizations and individuals)
- Filter by Status (Active, In Development, Planning)
- Alphabetical sorting of projects
- Combined filtering support

#### 3. Project Cards
- Comprehensive project information display
- Domain affinity visualization with percentage bars
- Status indicators with color coding
- Provider information with brand colors
- Seeker friendliness rating (1-5 stars)
- Project tags
- Website links when available

#### 4. Data Management
- Airtable integration for content management
- Real-time data fetching
- Type-safe data handling
- Error handling and loading states

### Component Structure

```
src/
├── components/
│   ├── Hero.tsx                 # Main hero section
│   ├── ChallengeSection.tsx     # Sarah's story section
│   ├── CircleFramework.tsx      # Triangle plot visualization
│   ├── ProjectEcosystem.tsx     # Project listing and filtering
│   ├── ProjectFilters.tsx       # Filter controls
│   └── SupportingDocModal.tsx   # Framework documentation
├── services/
│   └── airtable.ts             # Airtable integration
├── types/
│   └── index.ts                # TypeScript definitions
└── App.tsx                     # Main application
```

### Data Structures

```typescript
interface Project {
  id: string;
  recordId: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  affinities: {
    discovery: number;
    connection: number;
    wisdom: number;
  };
  status: "development" | "active" | "planning";
  size: number;
  tags: string[];
  providerId: string;
  seekerFriendliness: number;
  websiteUrl?: string;
}

interface Provider {
  id: string;
  recordId: string;
  name: string;
  description: string;
  color: string;
}

interface Domain {
  id: string;
  recordId: string;
  name: string;
  color: string;
  description: string;
}
```

### Styling System
- Mobile-first responsive design
- Custom color palette for domains and status indicators
- Consistent spacing and typography
- Interactive hover states and transitions
- Accessible color contrasts

### Project Status Colors
- Active: Green (`bg-green-100 text-green-800`)
- In Development: Blue (`bg-blue-100 text-blue-800`)
- Planning: Purple (`bg-purple-100 text-purple-800`)

## Content Management

### Airtable Integration
- Projects table with comprehensive project data
- Providers table for organization information
- Domains table for framework domains
- Real-time content updates
- Secure API key management

## Future Enhancements
1. Dark mode support
2. Advanced sorting options
3. Project detail pages
4. Search functionality
5. Performance optimizations
6. Analytics integration
7. Enhanced mobile interactions

## Development Guidelines

### Code Style
- TypeScript for type safety
- Functional components with hooks
- Modular component design
- Consistent naming conventions
- Comprehensive error handling

### Performance Considerations
- Optimized image loading
- Efficient data fetching
- Minimal re-renders
- Code splitting
- Caching strategies

### Accessibility
- Semantic HTML structure
- ARIA labels
- Keyboard navigation
- Color contrast compliance
- Screen reader support

## Deployment
- Hosted on Vercel
- Automatic deployments from main branch
- Environment variable management
- Performance monitoring
- Error tracking

## Getting Started
1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Run development server: `npm run dev`
5. Build for production: `npm run build` 