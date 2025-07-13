# Content Translation Script

This directory contains the script for translating all UrantiaBookPod content from English to Spanish using the DeepL API.

## DeepL API Optimizations ✅

Our script implements all DeepL best practices for efficiency and quality:

### **Cost Optimization**
- ✅ **Batching**: Processes 10 translations per batch for maximum efficiency
- ✅ **Text-Only Translation**: Sends only content strings, not JSON structure
- ✅ **Character Tracking**: Real-time cost monitoring and estimation
- ✅ **Length Validation**: Warns about texts exceeding optimal length (5,000 chars)

### **Quality Enhancement**
- ✅ **Context Hints**: Provides specific context for each content type
- ✅ **Spiritual Content**: Optimized settings for theological terminology
- ✅ **Formatting Preservation**: Maintains paragraph structure and HTML tags
- ✅ **Error Resilience**: Continues processing if individual translations fail

### **Rate Limiting & Security**
- ✅ **API Rate Limits**: 1-second delays between batches
- ✅ **Secure Key Management**: Uses environment variables only
- ✅ **Backend Processing**: Never exposes API key in frontend

## New Features ✅

### **Command Line Options**
- ✅ **Test Mode**: `--test` (translate only first 3 papers)
- ✅ **Limited Translation**: `--limit <number>` (translate specific number of papers)
- ✅ **Selective Translation**: `--papers-only` or `--jesus-only`
- ✅ **Custom Output**: `--output <directory>` (specify output directory)

### **Logging & Monitoring**
- ✅ **Timestamped Logs**: Automatic log files in `logs/translation/`
- ✅ **Progress Tracking**: Real-time translation progress with character counts
- ✅ **Error Reporting**: Detailed error logging and summary
- ✅ **Session Statistics**: Complete translation metrics and cost estimation

## Prerequisites

1. **DeepL API Subscription**
   - Get your API key from [DeepL API](https://www.deepl.com/api)
   - Set environment variable: `export DEEPL_API_KEY="your-api-key-here"`

2. **Install Dependencies**
   ```bash
   npm install deepl-node
   ```

## Usage

### **Basic Usage**

```bash
# Set your DeepL API key
export DEEPL_API_KEY="your-deepl-api-key"

# Full translation (all content)
node scripts/translate-content.js

# Show help
node scripts/translate-content.js --help
```

### **Test & Development**

```bash
# Test mode: translate only first 3 papers
node scripts/translate-content.js --test

# Translate only first 5 papers (for testing)
node scripts/translate-content.js --papers-only --limit 5

# Translate only Jesus content
node scripts/translate-content.js --jesus-only

# Custom output directory
node scripts/translate-content.js --test --output "./test-translations"
```

### **Production Usage**

```bash
# Translate only Urantia papers (fastest for content updates)
node scripts/translate-content.js --papers-only

# Full translation with all content
node scripts/translate-content.js
```

## Command Line Options

| Option | Description | Example |
|--------|-------------|---------|
| `--test` | Translate only first 3 papers for testing | `--test` |
| `--papers-only` | Translate only Urantia paper summaries | `--papers-only` |
| `--jesus-only` | Translate only Jesus summaries and episode data | `--jesus-only` |
| `--limit <n>` | Limit number of papers to translate | `--limit 10` |
| `--output <dir>` | Custom output directory | `--output ./test` |
| `--help` | Show help message | `--help` |

## What Gets Translated

The script processes these content files systematically:

### 1. Urantia Papers (`urantia_summaries.json`)
- **196 papers** with titles, episode cards, and detailed summaries
- **~125,000 words** (highest priority)
- **Output**: `public/locales/es/content/urantia-papers.json`

### 2. Jesus Summaries (`discoverJesusSummaries.ts`)
- **~150 summaries** with short and full descriptions
- **~75,000 words**
- **Output**: `public/locales/es/content/jesus-summaries.json`

### 3. General Summaries (`summaries.json`)
- **Episode content** with titles and summaries
- **~35,000 words**
- **Output**: `public/locales/es/content/general-summaries.json`

### 4. Series Metadata (`episodes.json`)
- **Series titles and descriptions**
- **Episode titles**
- **~15,000 words**
- **Output**: `public/locales/es/content/series-metadata.json`

### 5. Episode Arrays (`episodeUtils.ts`)
- **Episode titles and loglines arrays**
- **~8,000 words**
- **Output**: 
  - `public/locales/es/content/episode-titles.json`
  - `public/locales/es/content/episode-loglines.json`

## Output Format (i18n Compatible) ✅

The script generates JSON files that are **fully compatible** with the i18n system:

### **Urantia Papers Format**
```json
{
  "paper_1": {
    "title": "El Padre Universal",
    "episode_card": "No sólo el Dios de la Tierra...",
    "episode_page": "El Documento 1 explora uno de los..."
  }
}
```

### **Jesus Summaries Format** 
```json
{
  "topic/establishing-jesus-ancestry": {
    "shortSummary": "La ascendencia de Jesús...",
    "fullSummary": "La ascendencia de Jesús ofrece..."
  }
}
```

### **Series Metadata Format**
```json
{
  "jesus-1": {
    "seriesTitle": "Dios Revelado: Más Allá del Temor hacia el Amor",
    "seriesDescription": "Descubriendo la verdadera naturaleza...",
    "episodes": [
      { "id": 1, "title": "La Personalidad de Dios" }
    ]
  }
}
```

## Logging & Monitoring

### **Automatic Log Files**
- **Location**: `logs/translation/translation-[timestamp].log`
- **Content**: Complete session logs with timestamps
- **Format**: `2024-12-19T15:30:45.123Z | ✓ Translated (1/1247): "The Universal Father..."`

### **Progress Tracking**
```
🔄 Processing batch 1/125
✓ Translated (1/1247): "The Universal Father..." [23 chars]
📄 Processing Paper 2: The Nature of God
```

### **Session Statistics**
```
🎉 Translation completed successfully!
📊 Statistics:
   • Total strings translated: 1,247
   • Total characters: 1,548,000
   • Estimated cost: $30.96 USD
   • Total time: 892 seconds
   • Average: 84 translations/minute
   • Errors: 0

📁 Translated files saved to: public/locales/es/content/
📝 Session log saved to: logs/translation/translation-2024-12-19T15-30-45.log
```

## Expected Output Examples

### **Test Mode** (`--test`)
```bash
🧪 TEST MODE: Processing only first 3 papers
📖 Translating Urantia Papers summaries...
📄 Processing Paper 1: The Universal Father
✓ Translated (1/9): "The Universal Father..." [23 chars]
...
✅ Urantia Papers translation completed: 3 papers
📁 Saved to: public/locales/es/content/urantia-papers.json
```

### **Papers Only** (`--papers-only --limit 5`)
```bash
📊 LIMIT MODE: Processing only first 5 papers
📈 Total strings to translate: 15
📖 Translating Urantia Papers summaries...
...
📊 Statistics:
   • Total strings translated: 15
   • Estimated cost: $0.75 USD
```

## Estimated Costs

| Mode | Content | Estimated Cost |
|------|---------|----------------|
| `--test` (3 papers) | ~9 strings | ~$0.25 USD |
| `--limit 10` | ~30 strings | ~$1.00 USD |
| `--papers-only` | ~588 strings | ~$12.00 USD |
| `--jesus-only` | ~659 strings | ~$19.00 USD |
| **Full translation** | ~1,247 strings | **~$31.00 USD** |

## Integration with i18n System

The output files are designed for seamless integration:

### **1. Component Usage**
```typescript
// Load translated content in components
const { t } = useTranslation();
const paperData = await import('../../public/locales/es/content/urantia-papers.json');
const title = paperData.paper_1.title; // "El Padre Universal"
```

### **2. Utility Function Integration**
```typescript
// Create content loading utilities
export function getTranslatedPaperSummary(paperNumber: number, language: string) {
  if (language === 'es') {
    const translations = require('../../public/locales/es/content/urantia-papers.json');
    return translations[`paper_${paperNumber}`];
  }
  // Fallback to English content
}
```

### **3. Dynamic Content Loading**
```typescript
// Use in episode pages
const { language } = useLanguage();
const translatedContent = getTranslatedPaperSummary(paperNumber, language);
```

## Quality Considerations

- **Context Hints**: Script provides context for each type of content
- **Spiritual Content**: DeepL handles theological/spiritual terminology well
- **Professional Quality**: Much better than automated alternatives
- **Preserves Formatting**: Maintains paragraph breaks and structure

## Troubleshooting

- **API Key Issues**: Ensure `DEEPL_API_KEY` is set correctly
- **Rate Limits**: Script handles DeepL's rate limits automatically
- **Failed Translations**: Check error output and log files for specific issues
- **Network Issues**: Script retries failed requests automatically
- **Log Files**: Check `logs/translation/` for detailed session information

## Next Steps After Translation

1. **Integration**: Update data utilities to load Spanish content
2. **Testing**: Verify translations display correctly in UI
3. **Review**: Have Spanish speakers review theological accuracy
4. **Optimization**: Cache translated content for performance 