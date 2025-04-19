# AudioPlayer Component Documentation

## Overview

The `AudioPlayer` component is a core feature of the UrantiaBookPod application, providing a user-friendly interface for audio playback. It is built with accessibility, reliability, and usability in mind, with features such as playback control, progress tracking, volume adjustment, and playback speed control.

![AudioPlayer Component](../images/audio-player.png)

## Component Location

```
src/components/audio/AudioPlayer.tsx
```

## Features

The AudioPlayer component provides the following features:

- **Play/Pause Control**: Start and stop audio playback
- **Progress Tracking**: Visual indication of playback progress
- **Seeking**: Jump to specific positions in the audio
- **Volume Control**: Adjust audio volume with a slider
- **Mute Toggle**: Quickly mute/unmute audio
- **Playback Speed**: Adjust the playback speed (0.5x to 2.0x)
- **Error Handling**: Graceful error handling with fallback UI
- **Download Option**: Direct download link for the audio file
- **Responsive Design**: Adapts to different screen sizes
- **Accessibility**: Keyboard controls and ARIA attributes
- **Analytics Integration**: Tracks playback events for analytics

## Implementation

The AudioPlayer uses the native HTML5 Audio API wrapped in a custom React component. It manages player state with React hooks and implements custom event handlers for various audio events.

### Core Dependencies

- React hooks (useState, useRef, useEffect)
- Lucide React (for icons)
- Custom hooks (useAudioAnalytics)

### Props Interface

```typescript
interface AudioPlayerProps {
  audioUrl: string;
  title: string;
  episodeId?: string | number;
  onEnded?: () => void;
  onError?: (error: string) => void;
}
```

### State Management

The component uses a consolidated state object for managing player state:

```typescript
interface AudioPlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  loading: boolean;
  error: string | null;
  playbackSpeed: number;
}
```

### Key Methods

- **togglePlayPause**: Toggles between play and pause states
- **handleVolumeChange**: Updates the volume level
- **toggleMute**: Toggles mute state
- **handleSeek**: Seeks to a specific position in the audio
- **skipForward/skipBackward**: Jumps forward/backward by 10 seconds
- **handleSpeedChange**: Changes the playback speed

### Event Handling

The component sets up event listeners for the HTML5 Audio element:

- **timeupdate**: Updates the current playback position
- **loadedmetadata**: Sets the duration and initial states
- **ended**: Handles the end of playback
- **error**: Handles playback errors
- **ratechange**: Tracks changes to the playback rate

## Usage Examples

### Basic Usage

```tsx
import AudioPlayer from '../components/audio/AudioPlayer';

function EpisodePage() {
  return (
    <div>
      <h1>Episode Title</h1>
      <AudioPlayer
        audioUrl="https://example.com/audio/episode-1.mp3"
        title="Episode 1: Introduction"
        episodeId="1"
      />
      <div>Episode content...</div>
    </div>
  );
}
```

### With Error Handling

```tsx
import AudioPlayer from '../components/audio/AudioPlayer';
import { useState } from 'react';

function EpisodePage() {
  const [audioError, setAudioError] = useState<string | null>(null);
  
  const handleAudioError = (error: string) => {
    console.error('Audio playback error:', error);
    setAudioError(error);
  };
  
  return (
    <div>
      <h1>Episode Title</h1>
      {audioError ? (
        <div className="error-message">{audioError}</div>
      ) : (
        <AudioPlayer
          audioUrl="https://example.com/audio/episode-1.mp3"
          title="Episode 1: Introduction"
          episodeId="1"
          onError={handleAudioError}
        />
      )}
      <div>Episode content...</div>
    </div>
  );
}
```

### With Playback Completion Handling

```tsx
import AudioPlayer from '../components/audio/AudioPlayer';
import { useState } from 'react';

function EpisodePage() {
  const [playbackCompleted, setPlaybackCompleted] = useState(false);
  
  const handlePlaybackEnd = () => {
    setPlaybackCompleted(true);
    // Show next episode recommendation or other UI
  };
  
  return (
    <div>
      <h1>Episode Title</h1>
      <AudioPlayer
        audioUrl="https://example.com/audio/episode-1.mp3"
        title="Episode 1: Introduction"
        episodeId="1"
        onEnded={handlePlaybackEnd}
      />
      {playbackCompleted && (
        <div className="next-episode-recommendation">
          Ready for the next episode?
          <button>Go to Next Episode</button>
        </div>
      )}
      <div>Episode content...</div>
    </div>
  );
}
```

## Error Handling

The AudioPlayer component implements robust error handling:

1. **URL Validation**: Checks if the audio URL is valid
2. **Resource Availability**: Verifies that the audio file is accessible
3. **Playback Errors**: Handles errors during playback
4. **Fallback UI**: Displays a user-friendly error message with alternatives

When an error occurs, the component:
- Logs detailed error information to the console
- Updates the UI to show an error message
- Provides a direct download link as an alternative
- Calls the `onError` callback if provided

## Analytics Integration

The AudioPlayer uses the `useAudioAnalytics` hook to track playback events:

- Play/pause actions
- Playback completion
- Error events
- Duration of playback
- Seek actions

These events are sent to the application's analytics providers for user engagement tracking.

## Persistence

The component persists user preferences using localStorage:

- **Volume Level**: Saved as `audioVolume`
- **Playback Speed**: Saved as `audioPlaybackSpeed`

These settings are restored when the user returns to the application.

## Responsive Design

The AudioPlayer adapts to different screen sizes:

- **Desktop**: Full controls with horizontal layout
- **Mobile**: Streamlined controls with touch-friendly targets
- **Volume Controls**: Collapsible on mobile to save space
- **Speed Controls**: Dropdown menu to avoid cluttering the interface

## Accessibility

The component implements accessibility features:

- **Keyboard Navigation**: All controls are keyboard accessible
- **ARIA Attributes**: Proper labeling for screen readers
- **Focus Management**: Clear focus indicators for keyboard users
- **Color Contrast**: Meets WCAG AA standards

## Browser Compatibility

The AudioPlayer is tested and supported on:

- Chrome (latest versions)
- Firefox (latest versions)
- Safari (latest versions)
- Edge (latest versions)

## Known Limitations

- Autoplay may be blocked by browsers without user interaction
- Some mobile browsers have restrictions on background audio playback
- Safari has specific requirements for audio preloading
- iOS Safari may require user interaction before volume changes take effect

## Troubleshooting

### Common Issues and Solutions

1. **Audio doesn't play**
   - Check if the audio URL is accessible
   - Verify that the browser supports the audio format
   - Ensure that autoplay is triggered by user interaction

2. **Volume control doesn't work**
   - Some browsers require user interaction before allowing volume changes
   - Check console for errors related to audio element

3. **Playback progress jumps or is inaccurate**
   - This can happen if the audio metadata is incorrect
   - Verify that the audio file is properly encoded

## Future Improvements

Planned enhancements for the AudioPlayer component:

1. **Offline Support**: Enable offline playback with service workers
2. **Visualizations**: Add audio visualizations for a richer experience
3. **Advanced Controls**: Add bookmarks, loop functionality, and chapters
4. **Accessibility Improvements**: Enhanced keyboard shortcuts and screen reader support
5. **Performance Optimization**: Reduce memory usage and improve loading times

## Related Components

- **AudioProgress**: Standalone progress indicator component
- **AudioControls**: Separated controls component
- **DownloadButton**: Component for downloading audio files
- **PlaybackSpeedSelector**: Dropdown for selecting playback speed 