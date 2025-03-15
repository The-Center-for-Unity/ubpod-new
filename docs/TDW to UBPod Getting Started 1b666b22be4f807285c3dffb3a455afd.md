# TDW to UBPod: Getting Started

Last edited: March 14, 2025 7:09 PM
Tags: Urantia Book Pod

Now that I've prepared all the necessary artifacts, here's a practical way to proceed with your migration from UBPod (Next.js) to a Vite-based app using The Divine Within's design system:

## Getting Started

1. **Clone TDW and Clean It Up**
The setup script I've provided (`setup-script.sh`) will help you establish the basic project structure. After cloning TDW:
    
    ```bash
    mkdir urantiabookpod-vite
    cd urantiabookpod-vite
    # Save the setup-script.sh file and run it
    chmod +x setup-script.sh
    ./setup-script.sh
    
    ```
    
2. **Understand the Migration Strategy**
I've broken down the migration into logical components with the `migration-plan.md` document. This gives you a clear roadmap with defined phases and milestones.

## Key Technical Decisions

1. **Component Architecture**
I've structured the components to be standalone and reusable. The AudioPlayer component I provided as an example shows the level of care that should go into each component:
    - Clean separation of concerns (playback, tracking, UI)
    - Robust error handling
    - Accessibility considerations
    - Analytics integration
2. **Data Management**
The approach outlined in `data-migration.md` keeps your data handling simple but structured:
    - TypeScript interfaces for type safety
    - Helper functions for data access
    - Custom hooks for component logic
    
    This is intentionally straightforward - no need for Redux or complex state management for this app.
    
3. **Styling Strategy**
I've preserved TDW's excellent styling approach with Tailwind utility classes plus custom design system classes:
    
    ```css
    .title-main {
      font-family: var(--font-trajan);
      @apply text-5xl md:text-6xl font-normal text-white;
      line-height: 1.1;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }
    
    ```
    
    This gives you consistent styling while maintaining readability.
    

## Practical Implementation Tips

1. **Start with Core Components**
Begin by implementing the key shared components - Header, Footer, AudioPlayer, and PDFViewer. These form the foundation of your app's interface.
2. **Test Early and Often**
The audio playback is a critical feature. Implement that component early and test thoroughly across devices.
3. **Migrate Content Incrementally**
Rather than trying to move all content at once, start with one series (like the main Urantia Papers) and get it working fully before adding the other series.
4. **Handle Asset Migration Carefully**
When moving over the audio files, PDFs, and images, set up a consistent organization system in the `/public` directory.

## Anticipating Challenges

1. **Audio Playback Quirks**
Different browsers handle audio elements differently. The AudioPlayer component I provided includes precautions like:
    
    ```tsx
    audio.play().catch(err => {
      console.error('Error playing audio:', err);
      setError('Failed to play audio');
    });
    
    ```
    
    This handles common issues like browsers blocking autoplay.
    
2. **PDF Rendering**
Some browsers have inconsistent PDF handling. Always provide a download fallback option as I've done in the AudioPlayer component.
3. **Mobile Interactions**
Test your audio controls thoroughly on mobile devices. Touch targets should be at least 44x44px for good usability.

By following this approach, you'll be able to leverage TDW's excellent design system while creating a clean, maintainable version of UBPod that's easier to extend in the future.