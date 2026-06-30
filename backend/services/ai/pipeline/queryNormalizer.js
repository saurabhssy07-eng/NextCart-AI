import { synonyms, spellingCorrections } from '../utils/synonymDictionary.js';

export const normalizeQuery = (query) => {
  if (!query || typeof query !== 'string') return '';

  let cleaned = query.toLowerCase().trim();

  // Strip punctuation but keep standard letters/numbers/spaces and Indian Rupee symbol
  cleaned = cleaned.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, '');

  // Split into tokens
  let tokens = cleaned.split(/\s+/);

  // Correct spelling on single tokens
  tokens = tokens.map(token => spellingCorrections[token] || token);

  // Rejoin to handle multi-word phrase matching
  let processedQuery = tokens.join(' ');

  // Look for synonyms (both words and phrases)
  Object.entries(synonyms).forEach(([key, val]) => {
    const regex = new RegExp(`\\b${key}\\b`, 'gi');
    processedQuery = processedQuery.replace(regex, val);
  });

  return processedQuery.trim();
};
