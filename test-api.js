import { Translator } from 'deepl-node';

const apiKey = process.env.DEEPL_API_KEY;
console.log('Testing API key:', apiKey.substring(0, 8) + '...');

const translator = new Translator(apiKey);

try {
  const usage = await translator.getUsage();
  console.log('✅ API key valid!');
  console.log('Usage:', usage.character.count, '/', usage.character.limit);
  
  // Test a simple translation
  const result = await translator.translateText('Hello world', 'en', 'es');
  console.log('✅ Translation test successful:', result.text);
  
} catch (error) {
  console.log('❌ API key test failed:', error.message);
  process.exit(1);
} 