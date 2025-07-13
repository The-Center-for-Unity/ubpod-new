// Auto-generated from Python scraper
import { getSpanishJesusShortSummary, getSpanishJesusFullSummary } from '../utils/translationLoaders';

// Interface for DiscoverJesus summary with translation support
export interface DiscoverJesusSummary {
  id: string;
  shortSummary: string;
  fullSummary: string;
  translations?: {
    es?: {
      shortSummary: string;
      fullSummary: string;
    };
  };
}

// All hardcoded content removed - summaries now generated dynamically from translation system
const JESUS_SUMMARY_IDS = [
  "topic/establishing-jesus-ancestry",
  "topic/the-kingdom-of-heaven", 
  "topic/the-paradise-trinity",
  "topic/importance-of-the-early-home-life",
  "topic/influence-and-rule-of-the-roman-empire",
  "topic/jesus-ministry-as-he-passed-by",
  "topic/jesus-post-resurrection-appearances",
  "topic/jesus-public-ministry",
  "topic/jesus-resurrected-morontia-body",
  "topic/jesus-tour-of-the-mediterranean-world",
  "topic/previous-written-records",
  "topic/profound-quotes-to-live-by",
  "topic/sonship-with-god",
  "topic/spirit-of-truth-the-comforter",
  "topic/star-of-bethlehem",
  "topic/the-personality-of-god",
  "topic/the-practical-power-of-personal-faith",
  "topic/the-two-thieves-on-the-cross",
  "topic/the-western-world-in-the-first-century",
  "topic/training-the-kingdoms-messengers",
  "topic/true-values",
  "topic/was-jesus-really-born-of-a-virgin",
  "topic/what-did-jesus-say-about-wealth",
  "topic/what-happens-when-we-die",
  "topic/what-is-the-soul",
  "topic/what-is-the-urantia-book",
  "topic/what-led-judas-iscariot-to-betray-jesus",
  "topic/what-teaching-methods-did-jesus-use",
  "topic/when-was-jesus-born",
  "topic/why-are-some-people-happier-than-others",
  "topic/why-are-we-confronted-with-unfair-life-situations",
  "topic/why-did-jesus-make-a-triumphal-entry-into-jerusalem",
  "topic/why-did-the-sanhedrin-want-jesus-death",
  "topic/why-do-we-suffer-from-affliction",
  "topic/why-were-joseph-and-mary-chosen-as-jesus-parents",
  "topic/worship-and-prayer"
];

/**
 * Enhanced discoverJesusSummaries with translation support
 * Now fully dynamic - no hardcoded content, loads from translation files
 */
export const discoverJesusSummaries: Record<string, DiscoverJesusSummary> = (() => {
  const enhancedSummaries: Record<string, DiscoverJesusSummary> = {};
  
  for (const id of JESUS_SUMMARY_IDS) {
    const spanishShort = getSpanishJesusShortSummary(id);
    const spanishFull = getSpanishJesusFullSummary(id);
    
    enhancedSummaries[id] = {
      id,
      shortSummary: spanishShort || `Summary for ${id}`,
      fullSummary: spanishFull || `Full summary for ${id}`,
      translations: spanishShort && spanishFull ? {
        es: {
          shortSummary: spanishShort,
          fullSummary: spanishFull
        }
      } : undefined
    };
  }
  
  return enhancedSummaries;
})();