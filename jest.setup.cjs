require('@testing-library/jest-dom');
const { TextEncoder, TextDecoder } = require('util');

// Set up TextEncoder/TextDecoder globals for tests
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock HTML Media Element for audio tests
// This prevents actual audio playback during tests without modifying app code
window.HTMLMediaElement.prototype.load = jest.fn();
window.HTMLMediaElement.prototype.play = jest.fn().mockResolvedValue(undefined);
window.HTMLMediaElement.prototype.pause = jest.fn();
Object.defineProperty(window.HTMLMediaElement.prototype, 'currentTime', {
  writable: true,
  value: 0
});
Object.defineProperty(window.HTMLMediaElement.prototype, 'duration', {
  writable: true,
  value: 100
}); 