# Feature Development with Regression Testing

## Overview

This document outlines best practices for feature development with a focus on preventing regressions - ensuring that new features don't break existing functionality. By implementing a lightweight automated testing strategy, developers can confidently add new features while maintaining system stability.

## Core Development Workflow

### 1. Test-First Development

- **Write Tests Before Features**
  - Create a test that verifies what your new feature should do
  - Run it and watch it fail (confirming you need the feature)
  - Implement the feature until the test passes
  - This approach ensures your feature satisfies requirements and is testable

### 2. Snapshot Current Working State

```tsx
// Create a snapshot test for any component you're modifying
test('matches current working snapshot', () => {
  const { container } = render(<YourComponent />);
  expect(container).toMatchSnapshot();
});
```

Snapshots provide a quick way to detect unintended changes to UI components. They're especially useful for:
- Verifying UI hasn't changed unexpectedly
- Creating a baseline before implementing new features
- Quick regression checks across multiple components

### 3. Create Automated Pre-Commit Testing

```bash
npm install --save-dev husky
```

```json
// package.json
"scripts": {
  "test": "jest",
  "precommit": "npm test"
},
"husky": {
  "hooks": {
    "pre-commit": "npm run precommit"
  }
}
```

Running tests automatically before each commit ensures:
- No broken code is committed
- All tests pass before code is shared
- You get immediate feedback when something breaks

## Essential Tests for Preventing Regressions

### 1. Smoke Tests

These verify that components still render without errors:

```tsx
test('renders without crashing', () => {
  render(<Layout><div>Content</div></Layout>);
  // No error = success
});
```

Implement these for all main components to catch basic rendering issues quickly.

### 2. Critical Path Tests

These validate key user flows that must continue working:

```tsx
test('user can play audio', async () => {
  render(<AudioPlayer audioUrl="test.mp3" />);
  const playButton = screen.getByLabelText(/play/i);
  await userEvent.click(playButton);
  expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();
});
```

Focus on testing essential user journeys such as:
- Audio playback functionality
- Navigation between pages
- Search functionality
- Form submissions

### 3. Integration Tests

These verify that components work together correctly:

```tsx
test('EpisodePage loads and displays audio player', async () => {
  render(<MemoryRouter initialEntries={['/series/test/1']}>
    <EpisodePage />
  </MemoryRouter>);
  await screen.findByText('Episode Title');
  expect(screen.getByRole('button', {name: /play/i})).toBeInTheDocument();
});
```

Integration tests check that:
- Data flows correctly between components
- Component interactions work as expected
- User flows spanning multiple components function properly

## Starting Simple and Expanding

### Begin with Core Functionality

1. Identify 5-10 critical features that must continue working
2. Write simple tests that verify these features work
3. Run these tests before every commit

Example of critical features to test first:
- Audio player controls (play, pause, volume)
- Navigation between main pages
- Episode selection and playback
- Search functionality

### Gradually Expand Test Coverage

As you develop new features:
1. Write tests for the new feature before implementing it
2. Add the new tests to your pre-commit suite
3. Periodically review and update existing tests

### Focus on Behavior, Not Implementation

Write tests that:
- Verify what the component does, not how it works internally
- Test from the user's perspective
- Are resilient to internal refactoring
- Focus on inputs and outputs, not internal state

```tsx
// GOOD: Testing behavior
test('clicking play button starts audio', async () => {
  render(<AudioPlayer audioUrl="test.mp3" />);
  const playButton = screen.getByRole('button', {name: /play/i});
  await userEvent.click(playButton);
  expect(/* something a user would observe */).toBeTrue();
});

// BAD: Testing implementation details
test('clicking play button sets isPlaying state to true', async () => {
  const { result } = renderHook(() => useState(false));
  // This will break if implementation changes
});
```

## Best Practices for Maintainable Tests

### 1. Keep Tests Independent

Each test should:
- Start with a clean state
- Not depend on other tests
- Clean up after itself

```tsx
// Reset between tests
beforeEach(() => {
  jest.clearAllMocks();
});
```

### 2. Mock External Dependencies

```tsx
// Mock API calls
jest.mock('../api/episodeApi', () => ({
  getEpisode: jest.fn().mockResolvedValue({
    id: '1',
    title: 'Test Episode',
    audioUrl: 'test.mp3'
  })
}));
```

### 3. Use Test Data Constants

```tsx
// src/__tests__/fixtures/episodeData.ts
export const mockEpisode = {
  id: '1',
  title: 'Test Episode',
  description: 'Test description',
  audioUrl: 'test.mp3'
};
```

This makes tests more readable and consistent.

### 4. Test Error Cases

```tsx
test('shows error message when audio fails to load', async () => {
  // Mock the error condition
  HTMLMediaElement.prototype.play = jest.fn().mockRejectedValue(new Error('Failed to play'));
  
  render(<AudioPlayer audioUrl="test.mp3" />);
  const playButton = screen.getByRole('button', {name: /play/i});
  await userEvent.click(playButton);
  
  expect(await screen.findByText(/unable to play audio/i)).toBeInTheDocument();
});
```

### 5. Create Helper Functions for Common Test Patterns

```tsx
// src/__tests__/utils/renderWithRouter.tsx
export function renderWithRouter(ui: React.ReactElement, {route = '/'} = {}) {
  window.history.pushState({}, 'Test page', route);
  
  return {
    ...render(ui, {wrapper: BrowserRouter}),
    // Add custom helper methods here
  };
}
```

## Implementing Automated Testing in CI/CD

For a complete solution, integrate your tests into your CI/CD pipeline:

```yaml
# .github/workflows/test.yml
name: Run Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Use Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16.x'
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test
```

## Conclusion

By implementing these practices, you can develop new features with confidence, knowing that automated tests will catch regressions. Start small with a few critical tests, then expand as your application grows. Remember that the goal is not 100% test coverage, but rather ensuring that critical functionality continues to work as you add new features.

The most important principle is consistency - run your tests regularly and fix issues as they arise rather than letting them accumulate. 