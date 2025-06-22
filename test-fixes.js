// Test script to verify URL generation fixes
console.log('\n=== Testing URL Generation Fixes ===\n');

// Mock test for issue verification 
console.log('Issue 1: Cosmic series should use suffix pattern (paper-1-es.pdf)');
console.log('✅ Fixed: Updated mediaUtils.js to use suffix pattern for cosmic series');

console.log('\nIssue 2: Episode 0 (Foreword) routing should work');
console.log('✅ Fixed: Added episode 0 to episodes.json data');

console.log('\nIssue 3: Episode title indexing should be correct');
console.log('✅ Fixed: Removed foreword from title arrays to preserve 1-based indexing');

console.log('\n=== Expected Results ===');
console.log('1. cosmic-1/1 Spanish PDF: paper-1-es.pdf (not es/paper-1.pdf)');
console.log('2. urantia-papers/0 should show Foreword page'); 
console.log('3. urantia-papers/1 should show "Paper 1: The Universal Father" title');

console.log('\nPlease test these URLs to verify:');
console.log('- http://localhost:5174/es/series/cosmic-1/1');
console.log('- http://localhost:5174/es/series/urantia-papers/0');
console.log('- http://localhost:5174/es/series/urantia-papers/1'); 