# The Divine Within - Landing Page

A modern, responsive landing page showcasing The Divine Within's framework for supporting spiritual seekers through technology, human connection, and timeless wisdom.

## Overview

The Divine Within landing page presents our three-domain approach to spiritual discovery and growth:

- **Discovery Domain**: Personal exploration through accessible media and technology, where seekers engage with spiritual concepts in a self-directed way
- **Connection Domain**: A network of authentic relationships between fellow seekers and experienced guides, creating safe spaces for spiritual dialogue and growth
- **Wisdom Domain**: Engagement with profound spiritual teachings and timeless wisdom that naturally emerges as seekers progress in their journey

## Focus Level System

The project uses a nine-level focus system to indicate how much emphasis a project places on each domain (Discovery, Connection, Wisdom). The levels are:

| Level      | Value  | Description                                    |
|------------|--------|------------------------------------------------|
| maximal    | 1.0    | Complete emphasis on this domain               |
| very high  | 0.875  | Near-complete emphasis                         |
| high       | 0.75   | Strong primary emphasis                        |
| strong     | 0.625  | Above average emphasis                         |
| balanced   | 0.5    | Equal emphasis with other domains              |
| moderate   | 0.375  | Below average but significant emphasis         |
| low        | 0.25   | Minor emphasis                                 |
| barely     | 0.125  | Minimal emphasis                              |
| none      | 0.0    | No emphasis on this domain                     |

### Implementation Notes

- While the system maintains both affinity and focus data in the backend, the UI only displays focus levels
- Project cards show focus levels with color-coded progress bars
- The triangle visualization plots projects based on their focus levels
- Focus levels are stored in Airtable and mapped to numerical values for calculations

## Features

### Interactive Framework Visualization
- Elegant triangle plot showing project distribution across domains
- Interactive tooltips with project names on hover
- Dynamic positioning based on domain affinities
- Smooth transitions and animations
- Clear visual hierarchy with gold accents
- Responsive design that adapts to all screen sizes
- Integrated with dark theme for better readability

### Project Management
- Comprehensive initiatives showcase with detailed project cards
- Advanced filtering system by domain, provider, and status
- Real-time data synchronization with Airtable
- Intuitive project positioning algorithm
- Elegant handling of overlapping projects

### User Experience
- Narrative-driven user journey
- Smooth animations and transitions
- Accessibility-focused implementation
- Responsive design optimized for all devices
- Consistent dark theme with gold accents

## Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Type Safety**: TypeScript
- **Content Management**: Airtable
- **Deployment**: Vercel
- **Animation**: Framer Motion
- **State Management**: React Hooks

## Getting Started

1. Clone the repository:
```bash
git clone git@github.com:The-Center-for-Unity/the-divine-within-landing-page.git
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file with the following:
```
VITE_AIRTABLE_API_KEY=your_api_key
VITE_AIRTABLE_BASE_ID=your_base_id
VITE_AIRTABLE_PROJECTS_TABLE=Projects
VITE_AIRTABLE_PROVIDERS_TABLE=Providers
VITE_AIRTABLE_DOMAINS_TABLE=Domains
```

4. Run the development server:
```bash
npm run dev
```

## Project Structure

```
src/
├── app/                 # Next.js app directory
│   └── page.tsx        # Home page
├── components/         
│   ├── framework/      # Triangle framework components
│   │   ├── DomainCards.tsx
│   │   ├── FrameworkDescription.tsx
│   │   ├── TriangleFramework.tsx
│   │   ├── TrianglePlot.tsx
│   │   └── triangleUtils.ts
│   ├── initiatives/    # Initiatives components
│   │   ├── ProjectCard.tsx
│   │   ├── ProjectList.tsx
│   │   └── ProjectFilters.tsx
│   ├── Hero.tsx       # Landing page sections
│   ├── JourneyNarrative.tsx
│   └── VisionSection.tsx
├── types/             # TypeScript definitions
├── data/              # Static content
└── services/          # API services
```

## Development Guidelines

### Component Architecture
- Each section is a separate component for maintainability
- Shared components for repeated patterns
- Props interfaces for all components
- Consistent naming convention: `kebab-case` for files, `PascalCase` for components

### Style Organization
- Maintain color constants
- Use CSS variables for theme values
- Consistent spacing scale
- Mobile-first responsive design
- No custom CSS unless absolutely necessary

### State Management
- Keep state local to components where possible
- Use React Query for data fetching
- Implement loading states for async operations

### Git Workflow
- Main branch: Production-ready code
- backup/current-implementation: Current development branch
- Feature branches: Created from backup/current-implementation

## Deployment

The site is automatically deployed through Vercel:
1. Push to main branch triggers deployment
2. Preview deployments for pull requests
3. Environment variables managed in Vercel dashboard

## Contributing

1. Create a feature branch from backup/current-implementation
2. Make your changes
3. Submit a pull request
4. Ensure CI checks pass

## License

Copyright © 2024 The Center for Unity. All rights reserved.

## Contact

For questions or support, contact The Center for Unity. 

## Recent Updates

- Implemented nine-level focus system
- Updated project cards to show focus levels only
- Adjusted triangle visualization to plot based on focus levels
- Maintained affinity data in backend while simplifying UI
- Improved focus level progress bar display
- Updated type definitions and utility functions 

# Sacred Companions Landing Page

## Overview
The Sacred Companions landing page is a key component of The Divine Within platform, focused on recruiting Spiritual Companions. The page emphasizes trust, professionalism, and spiritual depth while maintaining accessibility and engagement.

## Project Structure

```
src/
  components/
    sacred-companions/
      SCHero.tsx         # Hero section with main value proposition
      SCVision.tsx       # Vision and core principles
      SCCouncil.tsx      # Guidance Council structure
      SCSafety.tsx       # Safety framework and trust elements
      SCDevelopment.tsx  # Development journey stages
      SCCTA.tsx         # Call to action with trust indicators
  data/
    sc-content.ts       # Centralized content management
  pages/
    SCRecruitingPage.tsx # Main page composition
```

## Key Features

### 1. Hero Section
- Professional branding with Sacred Companions logo
- Clear value proposition for potential companions
- Emphasis on ethical and professional standards
- Engaging call-to-action

### 2. Vision Section
Four core pillars in a 2x2 grid:
- Companioning Approach
- Professional Excellence
- Ethical Practice
- Community Support

Each pillar includes:
- Clear title and description
- Bullet points with key practices
- Consistent styling and spacing

### 3. Guidance Council
Five key areas:
- Executive Council
- Ethics Committee
- Relationship Guidelines
- Training Committee
- Quality Assurance

Features:
- Clear organizational structure
- Defined responsibilities
- Professional oversight
- Continuous improvement processes

### 4. Safety Framework
Comprehensive system including:
- Support for Companions
- Protective Supervision
- Supervision Framework
- Documentation & Reporting
- Crisis Response Protocol
- Quality Assurance

Features:
- Multi-level supervision
- Clear accountability measures
- Support mechanisms
- Risk management

### 5. Development Journey
Structured pathway including:
- Prerequisites
- Personal Development Requirements
- Selection Process
- Foundation Phase
- Practicum Phase
- Ongoing Development

Each stage features:
- Clear requirements
- Specific timeframes
- Defined milestones
- Support mechanisms

### 6. Call to Action
- Clean, focused design
- Clear next steps
- Trust indicators in 2x2 grid:
  - Professional Development
  - Ethical Framework
  - Community Support
  - Quality Assurance

## Recent Updates

- Replaced "guide" terminology with "companion" throughout for consistency
- Reduced repetitive use of "sacred" in section titles
- Updated CTA section to 2x2 grid layout
- Implemented consistent bullet point styling across sections
- Enhanced visual hierarchy and spacing
- Improved content structure and readability

## Style Guidelines

### Colors
- Navy background with subtle gradients
- Gold accents for emphasis
- White text with opacity variations
- Consistent hover states

### Typography
- Title-main for section headers
- Title-subtitle for sub-sections
- Body-lg for main content
- Consistent tracking and line-height

### Spacing
- Consistent vertical rhythm
- Responsive padding and margins
- Grid-based layouts
- Mobile-first design approach

### Components
- Reusable card components
- Consistent bullet point styling
- Standardized section containers
- Responsive grid systems

## Animation

Using Framer Motion for:
- Scroll-triggered animations
- Hover effects
- Section transitions
- Loading states

## Accessibility

- Semantic HTML structure
- ARIA labels where needed
- Keyboard navigation
- Color contrast compliance
- Screen reader support

## Design System

### Colors
- Primary: Navy (`bg-navy`)
- Secondary: Navy Light (`bg-navy-light`)
- Accent: Gold (`text-gold`)
- Text: White with opacity variations

### Typography
- Headings: Cinzel font
- Body: System font stack
- Special elements: Custom tracking

### Components
Each section follows consistent patterns:
- Section containers with proper spacing
- Responsive grid layouts
- Card-based information display
- Visual hierarchy

### Animations
- Subtle entrance animations
- Interactive hover states
- Smooth transitions
- Performance-optimized

## Content Management
All content is centralized in `sc-content.ts` for:
- Easy updates
- Content consistency
- Type safety
- Maintainability

## Responsive Design
- Mobile-first approach
- Breakpoint optimization
- Flexible layouts
- Preserved readability

## Performance Considerations
- Optimized images
- Lazy loading
- Minimal bundle size
- Efficient animations

## Accessibility
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Color contrast compliance

## Future Enhancements
- Interactive application process
- Community testimonials
- Progress tracking
- Resource library

## Development Guidelines
1. Maintain consistent section structure
2. Follow established design patterns
3. Ensure responsive behavior
4. Optimize for performance
5. Test across devices

## Getting Started

### Prerequisites
- Node.js 14+
- npm or yarn

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Development Workflow
1. Update content in `sc-content.ts`
2. Modify components in `components/sacred-companions`
3. Test responsive behavior
4. Verify accessibility
5. Optimize performance

## Contributing
1. Follow established patterns
2. Maintain type safety
3. Test thoroughly
4. Document changes

## License
Private - The Divine Within - All Rights Reserved 

## Sacred Companions Page

The Sacred Companions page exists in two versions:
- **Simple Version** (default): A focused presentation of the core concept
- **Extended Version** (accessed via `?version=extended`): Detailed implementation with comprehensive sections

### Simple Version Structure

```typescript
src/
  components/
    sacred-companions-simple/
      SCHeroSimple.tsx       # Hero section with main value proposition
      SCProblemSimple.tsx    # Problem statement and current challenges
      SCVisionSimple.tsx     # Sacred Companion model and key differences
      SCDevelopmentSimple.tsx # How it works for seekers and companions
      SCCTASimple.tsx        # Call to action with contact information
  data/
    sc-content-simple.ts    # Centralized content for simplified version
```

#### Key Features

1. **Hero Section**
   - Clear value proposition
   - Direct problem statement
   - Immediate contact CTA

2. **Problem Section**
   - What seekers need
   - Current challenges in spiritual guidance
   - Clear articulation of the gap we're filling

3. **Vision Section**
   - The Sacred Companion role
   - Key differences from traditional approaches
   - Focus on safety and authenticity

4. **Development Section**
   - How it works for seekers
   - How it works for companions
   - Structured approach to spiritual companionship

5. **Call to Action**
   - Direct contact with Gabriel Rymberg
   - Email: gabriel.rymberg@thecenterforunity.org
   - No-pressure exploration of possibilities

### Contact Integration

Both versions include integrated email contact functionality:
- Clicking "Learn More" or "Contact Us" opens the default email client
- Pre-filled recipient: gabriel.rymberg@thecenterforunity.org
- Pre-filled subject: "Sacred Companions Inquiry"

### Version Toggle

Access different versions via URL parameter:
- Simple Version (default): `/sacred-companions`
- Extended Version: `/sacred-companions?version=extended` 