# UrantiaBookPod Testing Guide

This document provides a comprehensive testing framework for ensuring the UrantiaBookPod application functions correctly after code changes or maintenance.

## Navigation Testing

- [ ] **Home Page**
  - [ ] Loads correctly with all elements visible
  - [ ] Navigation links work
  - [ ] Featured content appears properly

- [ ] **Series Page**
  - [ ] All series cards display correctly
  - [ ] Images load properly
  - [ ] Series descriptions are visible
  - [ ] Clicking on series cards navigates to correct series

- [ ] **Urantia Papers Page**
  - [ ] All 197 papers display correctly
  - [ ] Filtering/organization works as expected
  - [ ] Paper navigation is intuitive

- [ ] **Header/Footer**
  - [ ] All navigation links work
  - [ ] Logo links back to home page
  - [ ] Footer links work properly

## Audio Player Testing

- [ ] **Playback Controls**
  - [ ] Play button starts audio
  - [ ] Pause button pauses audio
  - [ ] Skip forward/backward buttons work (10-second increments)

- [ ] **Volume Controls**
  - [ ] Volume slider adjusts volume correctly
  - [ ] Mute button works
  - [ ] Volume settings persist between episodes

- [ ] **Progress Bar**
  - [ ] Shows current position correctly
  - [ ] Updates in real-time during playback
  - [ ] Can click to seek to different positions
  - [ ] Time display shows correct current/total time

- [ ] **Playback Speed**
  - [ ] Speed control menu opens correctly
  - [ ] All speed options (0.5x to 2x) work
  - [ ] Selected speed persists between episodes
  - [ ] Speed indicator shows current setting

- [ ] **Error Handling**
  - [ ] Displays appropriate error message if audio fails to load
  - [ ] Provides fallback options (download link) when errors occur

## Episode Functionality

- [ ] **Episode Cards**
  - [ ] Display correct title, number, and summary
  - [ ] Show appropriate images when available
  - [ ] Listen, Read, and Download buttons work
  - [ ] Consistent styling across different series

- [ ] **Episode Pages**
  - [ ] Episode title and details display correctly
  - [ ] Audio player loads the correct episode
  - [ ] Summary/description text is properly formatted
  - [ ] Expandable sections work (if applicable)

- [ ] **Episode Navigation**
  - [ ] Next/Previous episode buttons work
  - [ ] "Back to Series" button returns to correct series page
  - [ ] Direct URL access loads correct episode

## Series-Specific Testing

- [ ] **Urantia Papers Series**
  - [ ] All 197 papers load correctly
  - [ ] PDFs are accessible
  - [ ] Transcripts are available and accessible
  - [ ] Paper parts (1-4) are correctly color-coded

- [ ] **Jesus Series**
  - [ ] All episodes in each sub-series load
  - [ ] "Read" links point to correct specific pages on DiscoverJesus.com
  - [ ] Audio matches content described in title/summary
  - [ ] Episode order is logical and navigable

- [ ] **Cosmic Series**
  - [ ] Series structure mirrors Urantia Papers appropriately
  - [ ] Correct mappings between cosmic episodes and papers
  - [ ] Appropriate handling if audio isn't yet available

- [ ] **History Series**
  - [ ] Episodes load correctly
  - [ ] Content displays properly
  - [ ] Audio plays as expected

## URL and Routing Testing

- [ ] **Direct Access**
  - [ ] Can access episodes directly by URL
  - [ ] Series pages accessible by direct URL
  - [ ] URL parameters properly handled

- [ ] **Legacy URL Support**
  - [ ] Old format URLs (`/listen/:series/:id`) redirect correctly
  - [ ] Simple paper IDs (`/episode/:id`) resolve to correct papers
  - [ ] URL changes reflect navigation state

- [ ] **Error Handling**
  - [ ] Invalid URLs show appropriate 404 page
  - [ ] Malformed parameters handled gracefully

## Responsive Design Testing

- [ ] **Mobile View (320-480px)**
  - [ ] Navigation is accessible (menu works)
  - [ ] Audio player controls are usable
  - [ ] Text is readable without zooming
  - [ ] Episode cards stack properly

- [ ] **Tablet View (768-1024px)**
  - [ ] Layout adjusts appropriately
  - [ ] Grid layouts show appropriate number of items per row
  - [ ] Audio player has sufficient touch targets

- [ ] **Desktop View (1200px+)**
  - [ ] Space utilization is efficient
  - [ ] Multi-column layouts work correctly
  - [ ] Hover states work properly

## Technical Testing

- [ ] **Console Errors**
  - [ ] No JavaScript errors in browser console
  - [ ] No 404 or network request failures
  - [ ] No React warnings about keys or lifecycle issues

- [ ] **Build Process**
  - [ ] `npm run build` completes successfully
  - [ ] Bundle sizes are reasonable
  - [ ] No unused code included in bundles

- [ ] **Performance**
  - [ ] Initial page load is fast (<3s on average connection)
  - [ ] Audio begins playing quickly after pressing play
  - [ ] Navigation between pages is responsive
  - [ ] No jank or stuttering during animations

- [ ] **Analytics and Tracking**
  - [ ] Page view events fire correctly
  - [ ] Audio play/pause/complete events tracked
  - [ ] Download events captured
  - [ ] No tracking errors in console

## Browser Compatibility

- [ ] **Chrome**
  - [ ] All functionality works as expected
  - [ ] Audio controls behave correctly

- [ ] **Firefox**
  - [ ] All functionality works as expected
  - [ ] Audio controls behave correctly

- [ ] **Safari**
  - [ ] All functionality works as expected
  - [ ] Audio controls behave correctly
  - [ ] Audio autoplay restrictions handled appropriately

- [ ] **Edge**
  - [ ] All functionality works as expected
  - [ ] Audio controls behave correctly

## Regression Testing After Fixes

Whenever a bug is identified and fixed, add specific test cases below to ensure it doesn't reoccur:

- [ ] **Jesus Series Links**
  - [ ] "Read" links on Jesus series episode pages point to the specific content page on DiscoverJesus.com, not just the homepage
  - [ ] URLs match the sourceUrl property in the episode data
  - [ ] External links open in new tabs with proper security attributes