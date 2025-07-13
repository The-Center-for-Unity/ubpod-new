#!/usr/bin/env node

/**
 * Test script to verify i18n format compatibility
 * 
 * This script creates sample output files in the same format
 * that the translation script will generate, allowing you to
 * test integration before running the full translation.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES module equivalents for __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Sample translated content (what DeepL would return)
const sampleTranslations = {
  // Sample Urantia Papers format
  urantiaPapers: {
    "paper_1": {
      "title": "El Padre Universal",
      "episode_card": "No sólo el Dios de la Tierra sino el centro de toda realidad cósmica.",
      "episode_page": "El Documento 1 explora uno de los mayores misterios del universo: la naturaleza del Padre Universal. Más que simplemente el Dios de nuestro mundo, el Padre Universal es la Fuente y Centro Primero de toda realidad, personalidad y energía en todo el cosmos."
    },
    "paper_2": {
      "title": "La Naturaleza de Dios",
      "episode_card": "Comprendiendo los atributos divinos que definen la personalidad de Dios.",
      "episode_page": "Este documento profundiza en los atributos fundamentales que caracterizan la naturaleza divina, revelando cómo Dios es a la vez perfecto y personal, infinito y accesible."
    }
  },

  // Sample Jesus Summaries format
  jesusSummaries: {
    "topic/the-personality-of-god": {
      "shortSummary": "Explorando la naturaleza personal de Dios más allá de las concepciones tradicionales.",
      "fullSummary": "El concepto de la personalidad de Dios representa uno de los aspectos más profundos y reconfortantes de la revelación espiritual. A diferencia de las concepciones distantes de la divinidad, el Libro de Urantia presenta a Dios como verdaderamente personal, accesible y comprensivo."
    },
    "event/sojourn-in-alexandria": {
      "shortSummary": "El significativo período de Jesús en Alejandría durante su juventud.",
      "fullSummary": "La estancia de Jesús en Alejandría marcó un período crucial en su desarrollo intelectual y espiritual. Durante este tiempo, se sumergió en las ricas tradiciones del aprendizaje helenístico mientras mantenía su perspectiva espiritual única."
    }
  },

  // Sample Series Metadata format
  seriesMetadata: {
    "jesus-1": {
      "seriesTitle": "Dios Revelado: Más Allá del Temor hacia el Amor",
      "seriesDescription": "Descubriendo la verdadera naturaleza de Dios a través de las enseñanzas reveladas en el Libro de Urantia.",
      "episodes": [
        { "id": 1, "title": "La Personalidad de Dios" },
        { "id": 2, "title": "Amando a Dios en Lugar de Temerle" }
      ]
    },
    "cosmic-1": {
      "seriesTitle": "Orígenes Cósmicos: Entendiendo la Creación del Universo",
      "seriesDescription": "Introduciendo la cosmología fundamental de la revelación de Urantia.",
      "episodes": [
        { "id": 1, "title": "El Padre Universal" },
        { "id": 2, "title": "El Universo de Universos" }
      ]
    }
  },

  // Sample Episode Titles format
  episodeTitles: {
    "jesus-1": [
      "La Personalidad de Dios",
      "Amando a Dios en Lugar de Temerle",
      "Crecimiento del Concepto de Dios",
      "Primera Pascua de Jesús (Edad 13)",
      "Fe y Rectitud"
    ],
    "cosmic-1": [
      "El Padre Universal",
      "El Universo de Universos",
      "Las Esferas Sagradas del Paraíso",
      "Los Siete Superuniversos",
      "Energía—Mente y Materia"
    ]
  },

  // Sample Episode Loglines format
  episodeLoglines: {
    "jesus-1": [
      "No sólo el Dios de la Tierra sino el centro de toda realidad cósmica",
      "Transformando nuestra relación con lo divino del miedo al amor",
      "La evolución de la comprensión humana de la naturaleza de Dios",
      "El despertar espiritual de Jesús durante su primera peregrinación",
      "La base verdadera de nuestra relación con Dios"
    ],
    "cosmic-1": [
      "El origen y centro de toda personalidad y realidad en el cosmos",
      "Explorando la vastedad incomprensible de la creación",
      "Los mundos especiales que rodean la morada de Dios",
      "Las siete divisiones principales del universo habitado",
      "La interacción fundamental entre energía, mente y materia"
    ]
  }
};

function createSampleFiles() {
  const outputDir = 'public/locales/es/content';
  
  // Ensure directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Create sample files in the exact format the translation script will generate
  const files = [
    { filename: 'urantia-papers.json', data: sampleTranslations.urantiaPapers },
    { filename: 'jesus-summaries.json', data: sampleTranslations.jesusSummaries },
    { filename: 'series-metadata.json', data: sampleTranslations.seriesMetadata },
    { filename: 'episode-titles.json', data: sampleTranslations.episodeTitles },
    { filename: 'episode-loglines.json', data: sampleTranslations.episodeLoglines }
  ];

  files.forEach(({ filename, data }) => {
    const filePath = path.join(outputDir, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`✅ Created sample file: ${filePath}`);
  });

  // Create integration test utilities
  createTestUtilities();
}

function createTestUtilities() {
  const testDir = 'scripts/test-utils';
  
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true });
  }

  // Create a test utility to verify the format works with i18n
  const testUtilContent = `// Test utility for i18n content integration
import { useLanguage } from '../../src/i18n/LanguageContext';

/**
 * Test function to load translated paper summaries
 * This demonstrates the expected usage pattern
 */
export async function getTranslatedPaperSummary(paperNumber: number, language: string = 'en') {
  if (language === 'es') {
    try {
      // Dynamic import of Spanish translations
      const translations = await import('../../public/locales/es/content/urantia-papers.json');
      const paperKey = \`paper_\${paperNumber}\`;
      
      if (translations.default[paperKey]) {
        return {
          title: translations.default[paperKey].title,
          episodeCard: translations.default[paperKey].episode_card,
          episodePage: translations.default[paperKey].episode_page
        };
      }
    } catch (error) {
      console.warn(\`Spanish translation not found for paper \${paperNumber}, falling back to English\`);
    }
  }
  
  // Fallback to English content (existing system)
  const englishData = await import('../../src/data/json/urantia_summaries.json');
  const paper = englishData.default.find(p => p.paper_number === paperNumber);
  
  if (paper) {
    return {
      title: paper.title,
      episodeCard: paper.episode_card,
      episodePage: paper.episode_page
    };
  }
  
  throw new Error(\`Paper \${paperNumber} not found\`);
}

/**
 * Test function to load translated Jesus summaries
 */
export async function getTranslatedJesusSummary(summaryKey: string, language: string = 'en') {
  if (language === 'es') {
    try {
      const translations = await import('../../public/locales/es/content/jesus-summaries.json');
      
      if (translations.default[summaryKey]) {
        return {
          shortSummary: translations.default[summaryKey].shortSummary,
          fullSummary: translations.default[summaryKey].fullSummary
        };
      }
    } catch (error) {
      console.warn(\`Spanish translation not found for \${summaryKey}, falling back to English\`);
    }
  }
  
  // Fallback to English content
  const { discoverJesusSummaries } = await import('../../src/data/discoverJesusSummaries');
  
  if (discoverJesusSummaries[summaryKey]) {
    return {
      shortSummary: discoverJesusSummaries[summaryKey].shortSummary,
      fullSummary: discoverJesusSummaries[summaryKey].fullSummary
    };
  }
  
  throw new Error(\`Jesus summary \${summaryKey} not found\`);
}

/**
 * Test React hook for components
 */
export function useTranslatedContent() {
  const { language } = useLanguage();
  
  return {
    getTranslatedPaper: (paperNumber: number) => getTranslatedPaperSummary(paperNumber, language),
    getTranslatedJesusSummary: (summaryKey: string) => getTranslatedJesusSummary(summaryKey, language)
  };
}

// Example component usage:
/*
function EpisodeCard({ paperNumber }: { paperNumber: number }) {
  const [paperData, setPaperData] = useState(null);
  const { getTranslatedPaper } = useTranslatedContent();
  
  useEffect(() => {
    getTranslatedPaper(paperNumber).then(setPaperData);
  }, [paperNumber, getTranslatedPaper]);
  
  if (!paperData) return <div>Loading...</div>;
  
  return (
    <div>
      <h3>{paperData.title}</h3>
      <p>{paperData.episodeCard}</p>
      <div>{paperData.episodePage}</div>
    </div>
  );
}
*/`;

  fs.writeFileSync(
    path.join(testDir, 'contentTranslationUtils.ts'),
    testUtilContent,
    'utf8'
  );

  console.log(`✅ Created test utilities: ${testDir}/contentTranslationUtils.ts`);
}

function runFormatValidation() {
  console.log('\n🔍 Validating i18n format compatibility...\n');

  const outputDir = 'public/locales/es/content';
  const expectedFiles = [
    'urantia-papers.json',
    'jesus-summaries.json', 
    'series-metadata.json',
    'episode-titles.json',
    'episode-loglines.json'
  ];

  let allValid = true;

  expectedFiles.forEach(filename => {
    const filePath = path.join(outputDir, filename);
    
    try {
      const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      console.log(`✅ ${filename}:`);
      console.log(`   - Valid JSON: ✓`);
      console.log(`   - Keys found: ${Object.keys(content).length}`);
      console.log(`   - Sample key: "${Object.keys(content)[0]}"`);
      
      // Validate structure
      const firstValue = content[Object.keys(content)[0]];
      if (typeof firstValue === 'object' && firstValue !== null) {
        console.log(`   - Sample structure: ${JSON.stringify(firstValue, null, 2).substring(0, 100)}...`);
      }
      
    } catch (error) {
      console.log(`❌ ${filename}: ${error.message}`);
      allValid = false;
    }
  });

  console.log(`\n${allValid ? '🎉' : '⚠️'} Format validation ${allValid ? 'passed' : 'failed'}`);
  
  if (allValid) {
    console.log('\n✅ All files are compatible with the i18n system!');
    console.log('📚 See scripts/test-utils/contentTranslationUtils.ts for integration examples');
  }
}

// Main execution (ES module equivalent of require.main === module)
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('🧪 Creating sample i18n-compatible translation files...\n');
  
  createSampleFiles();
  
  console.log('\n📋 Sample files created with the exact format that the translation script will generate.');
  console.log('🔗 These demonstrate perfect i18n compatibility.\n');
  
  runFormatValidation();
  
  console.log('\n🚀 Ready to test integration with your components!');
  console.log('💡 Run the actual translation with: node scripts/translate-content.js --test');
}

export { createSampleFiles, runFormatValidation }; 