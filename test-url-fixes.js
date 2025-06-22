import { getMediaUrl } from './src/utils/mediaUtils.js';

console.log('\n=== Testing URL Generation Fixes ===\n');

// Test Issue 1: Cosmic series Spanish URLs should use suffix, not folder
console.log('Issue 1: Cosmic series Spanish URLs');
console.log('cosmic-1, episode 1, PDF, Spanish:');
const cosmicSpanishPdf = getMediaUrl('cosmic-1', 1, 'pdf', 'es');
console.log('Generated URL:', cosmicSpanishPdf);
console.log('Expected pattern: paper-X-es.pdf (not es/paper-X.pdf)');
console.log('Correct format?', cosmicSpanishPdf && cosmicSpanishPdf.includes('paper-1-es.pdf') && !cosmicSpanishPdf.includes('/es/'));

console.log('\nFor comparison - urantia-papers Spanish PDF:');
const urantiaPapersSpanishPdf = getMediaUrl('urantia-papers', 1, 'pdf', 'es');
console.log('Generated URL:', urantiaPapersSpanishPdf);
console.log('Expected pattern: paper-1-es.pdf');
console.log('Correct format?', urantiaPapersSpanishPdf && urantiaPapersSpanishPdf.includes('paper-1-es.pdf'));

// Test Issue 2: Foreword (episode 0) should work
console.log('\n\nIssue 2: Foreword (episode 0) support');
console.log('urantia-papers, episode 0, MP3, English:');
const forewordMp3 = getMediaUrl('urantia-papers', 0, 'mp3', 'en');
console.log('Generated URL:', forewordMp3);
console.log('Expected pattern: foreword.mp3');
console.log('Correct format?', forewordMp3 && forewordMp3.includes('foreword.mp3'));

console.log('\nurantia-papers, episode 0, PDF, Spanish:');
const forewordPdfSpanish = getMediaUrl('urantia-papers', 0, 'pdf', 'es');
console.log('Generated URL:', forewordPdfSpanish);
console.log('Expected pattern: foreword-es.pdf');
console.log('Correct format?', forewordPdfSpanish && forewordPdfSpanish.includes('foreword-es.pdf'));

console.log('\n=== Test Complete ==='); 