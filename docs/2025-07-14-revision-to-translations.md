# 🗂️ 2025-07-14  Post-Translation Revision Plan

> Scope: Spanish (ES), French (FR), Portuguese (PT) content.json files generated on 2025-07-14.

---

## 1  Background
After the successful DeepL batch-translations, QA teams for French and Portuguese have already spotted systematic issues:

1. **Incorrect term for “Paper” header**  
   • ES should use **“Documento”**  
   • FR should use **“Fascicule”**  
   • PT should use **“Documento”**  
   DeepL occasionally left the English word *Paper* or produced other variants.

2. **Inaccurate paper titles**  
   We will receive an authoritative JSON mapping with the correct paper titles per language.  
   These must overwrite the existing `paperTitles` currently embedded in `content.json`.

We will **NOT** re-run the full translations. Instead we will apply targeted, scriptable post-processing.

---

## 2  High-Level Strategy
1. **Automated Search-and-Replace** for the generic *Paper* term.  
   Use regex patterns that are safe for JSON and avoid touching other words (e.g. “newspaper”).
2. **Authoritative Title Injection** once the language-specific JSON mapping arrives.  
   Merge the mapping into each language’s `content.json`, replacing the `title` field for every matching paper.
3. **Repeatable Scripts & Backups** – add standalone Node scripts under `scripts/` that:
   • Create timestamped backups in `legacy-bkp/` before modifying files  
   • Log all replacements & counts for auditing  
   • Are idempotent (safe to run multiple times)

---

## 3  Detailed Step-by-Step Plan

### 3.1  Standardise “Paper” → Language-Specific Term
| Lang | Correct Term | Regex Pattern (find) | Replacement |
|------|--------------|----------------------|-------------|
| ES   | Documento    | /\b[Pp]aper\b/       | Documento   |
| FR   | Fascicule    | /\b[Pp]aper\b/       | Fascicule   |
| PT   | Documento    | /\b[Pp]aper\b/       | Documento   |

**Steps**
1. **Prototype** quick replacement on one file to verify zero collateral changes.
2. Write `scripts/fix-paper-term.cjs`:
   ```bash
   node scripts/fix-paper-term.cjs es fr pt
   ```
   • Iterates over provided language codes  
   • Reads `src/locales/<lang>/content/content.json`  
   • Performs regex replacement on `episodeCard.title` and any other `title` string  
   • Writes output back, preserving formatting  
   • Produces `logs/fix-paper-term-<lang>-<timestamp>.log`
3. **Backup** to `legacy-bkp/content-json-backup-<timestamp>/<lang>/` before write.
4. **Validate** by grepping for “\bPaper\b” afterwards (expect 0 hits).

### 3.2  Inject Correct Paper Titles
1. **Receive / build** `paper-titles-<lang>.json` with structure:
   ```json
   {
     "Paper 1": "Document 1: El Padre Universal", // ES example
     "Paper 2": "Document 2: La naturaleza de Dios"
   }
   ```
2. Write `scripts/update-paper-titles.cjs` that:
   • Accepts `lang` CLI arg  
   • Loads mapping JSON  
   • Iterates through `content.json.episodeCard` (or relevant nodes)  
   • Replaces the `title` when `paperNumber` (or ID) matches  
   • Logs changes, skipped IDs
3. **Unit-test** the script with Jest mocks (leverage existing test setup).
4. **Run** for each language once mapping is ready.
5. **QA** – diff before/after counts & spot-check random titles.

---

### 🔄 Progress Update (2025-07-14 @ 07:38)

| Task | Status | Notes |
|------|--------|-------|
| Generate authoritative `paper-titles-<lang>.json` maps | ✅ Done | Prefixes stripped (`Documento…` / `Fascicule…`) |
| Implement `update-paper-titles.cjs` | ✅ Done | Handles *all* series inc. `urantia-papers`; creates backups |
| Run script for ES | ✅ 136 titles updated |
| Run script for FR | ✅ 150 titles updated |
| Run script for PT | ✅ 151 titles updated |
| Backups verified | ✅ `legacy-bkp/content-json-backup-<timestamps>/` |
| Fix “Paper” → language-specific term | ⬜ Pending (next) |

---

## 4  Validation & QA Checklist
- [x] All paper titles match authoritative JSON (100% hit rate)
- [ ] Zero occurrences of literal “Paper” in ES/FR/PT `content.json`
- [ ] Term counts match expected counts (e.g., 196 papers → 196 replacements)
- [ ] Content.json parses with `JSON.parse` after modifications
- [ ] Manual UI spot-check of at least 5 random papers per language

---

## 5  Timeline & Responsibilities
| Date | Task | Owner |
|------|------|-------|
| Jul 15 | Implement & test *fix-paper-term.cjs* | Dev (You) |
| Jul 15 | Build authoritative title mappings | Content Team |
| Jul 16 | Implement *update-paper-titles.cjs* | Dev |
| Jul 16 | Run scripts + internal QA | Dev + QA |
| Jul 17 | Hand-off for external QA regression | QA Teams |

---

## 6  Future Individual Corrections
Once screenshot-based feedback starts arriving:
1. Log each issue in an *Issues* table in this doc.
2. Batch similar issues where possible.
3. For unique glitches, manually edit `content.json` and commit with message `fix(<lang>): QA corrections – paper X section Y`.

---

### ✅ Ready to Execute
This plan isolates the two systemic fixes before we dive into granular QA edits, ensuring a clean baseline for reviewers. 