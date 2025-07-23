#!/usr/bin/env node
/*
 * generate-paper-title-maps.cjs
 * ---------------------------------
 * Parse the authoritative CSV (docs/Controller - UBF.csv) and emit:
 *   - src/data/paper-titles-es.json
 *   - src/data/paper-titles-fr.json
 *   - src/data/paper-titles-pt.json
 * Each file maps the paper number (as a string) → full localized paper title.
 *
 * Usage:  node scripts/generate-paper-title-maps.cjs
 */

const fs = require('fs');
const path = require('path');

const CSV_PATH = path.join(__dirname, '..', 'docs', 'Controller - UBF.csv');
const OUTPUT_DIR = path.join(__dirname, '..', 'src', 'data');

// Basic CSV line parser that handles quoted commas
function parseCSVLine(line) {
  const cells = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      // Handle escaped quotes ""
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++; // skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      cells.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  cells.push(current);
  return cells;
}

function main() {
  if (!fs.existsSync(CSV_PATH)) {
    console.error(`CSV file not found at ${CSV_PATH}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(CSV_PATH, 'utf8').trimEnd();
  const lines = raw.split(/\r?\n/);

  // Skip header line(s)
  const dataLines = lines.slice(1); // first line is header

  const esMap = {};
  const frMap = {};
  const ptMap = {};

  dataLines.forEach((line) => {
    if (!line.trim()) return; // skip empty lines
    const cells = parseCSVLine(line);

    // Defensive check on expected column count (≥9)
    if (cells.length < 9) return;

    const paperNumber = cells[0].trim();
    const isPaper = cells[1].trim();
    if (isPaper !== 'P') return; // only include actual Papers / Foreword

    const esTitleRaw = cells[4].trim().replace(/^"|"$/g, '');
    const frTitleRaw = cells[6].trim().replace(/^"|"$/g, '');
    const ptTitleRaw = cells[8].trim().replace(/^"|"$/g, '');

    const esTitle = esTitleRaw.replace(/^Documento\s+\d+\s+-\s+/i, '').trim();
    const frTitle = frTitleRaw.replace(/^Fascicule\s+\d+,?\s*/i, '').trim();
    const ptTitle = ptTitleRaw.replace(/^Documento\s+\d+\s+-\s+/i, '').trim();

    esMap[paperNumber] = esTitle;
    frMap[paperNumber] = frTitle;
    ptMap[paperNumber] = ptTitle;
  });

  // Ensure output directory exists
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  fs.writeFileSync(path.join(OUTPUT_DIR, 'paper-titles-es.json'), JSON.stringify(esMap, null, 2), 'utf8');
  fs.writeFileSync(path.join(OUTPUT_DIR, 'paper-titles-fr.json'), JSON.stringify(frMap, null, 2), 'utf8');
  fs.writeFileSync(path.join(OUTPUT_DIR, 'paper-titles-pt.json'), JSON.stringify(ptMap, null, 2), 'utf8');

  console.log('✔️  Generated paper title maps for ES, FR, PT.');
}

if (require.main === module) {
  main();
} 