// Message parser utility for handling special patterns in chat messages
import { router } from 'expo-router';
import { I18nManager } from 'react-native';

// Regex patterns to match the special message formats
const APARTMENT_PATTERN = /\[(Apartment|شقة)\s*\|\s*الرقم المرجعي:\s*(\d+)\]/g;
const SHARE_PATTERN = /\[(Share|سهم)\s*\|\s*الرقم المرجعي:\s*(\d+)\]/g;
// Array of patterns to match and remove from messages (can be regex or strings)
const DOCUMENT_REFERENCE_PATTERNS = [
  /【\d+:\d+†[^】]+】/g, // Document references like 【4:0†open.txt】
  // Add more patterns here as needed
  'null',
  '##'
];

/**
 * Parses message text and extracts reference links
 * @param {string} text - The message text to parse
 * @returns {Array} Array of message parts with text and link objects
 */
export const parseMessageText = (text) => {
  if (!text || typeof text !== 'string') return [{ type: 'text', content: text }];

  // Remove all document reference patterns first
  let cleanedText = text;
  DOCUMENT_REFERENCE_PATTERNS.forEach(pattern => {
    if (pattern instanceof RegExp) {
      cleanedText = cleanedText.replace(pattern, '');
    } else if (typeof pattern === 'string') {
      cleanedText = cleanedText.replaceAll(pattern, '');
    }
  });
  cleanedText = cleanedText.trim();

  const parts = [];
  let lastIndex = 0;

  // Find all matches for both patterns
  const allMatches = [];

  // Find apartment matches
  let match;
  while ((match = APARTMENT_PATTERN.exec(cleanedText)) !== null) {
    allMatches.push({
      type: 'apartment',
      match: match[0],
      id: match[2], // ID is now in the second capture group
      index: match.index,
      length: match[0].length
    });
  }

  // Reset regex
  APARTMENT_PATTERN.lastIndex = 0;

  // Find share matches
  while ((match = SHARE_PATTERN.exec(cleanedText)) !== null) {
    allMatches.push({
      type: 'share',
      match: match[0],
      id: match[2], // ID is now in the second capture group
      index: match.index,
      length: match[0].length
    });
  }

  // Reset regex
  SHARE_PATTERN.lastIndex = 0;

  // Sort matches by their position in the text
  allMatches.sort((a, b) => a.index - b.index);

  // If there are matches, find the line that contains the first match and insert instruction
  if (allMatches.length > 0) {
    const firstMatch = allMatches[0];
    
    // Find the beginning of the line that contains the first match
    const beforeFirstMatch = cleanedText.substring(0, firstMatch.index);
    const lastNewlineIndex = beforeFirstMatch.lastIndexOf('\n');
    const lineStartIndex = lastNewlineIndex === -1 ? 0 : lastNewlineIndex + 1;
    
    // Add text before the line containing the first match
    if (lineStartIndex > 0) {
      const textBeforeLine = cleanedText.substring(0, lineStartIndex);
      if (textBeforeLine.trim()) {
        parts.push({ type: 'text', content: textBeforeLine });
      }
    }
    
    // Add instruction text
    const arrow = I18nManager.isRTL ? '⬅️' : '➡️';
    parts.push({ 
      type: 'text', 
      content: `يمكنك الضغط على علامة ${arrow} للذهاب إلى تفاصيل العرض.\n\n` 
    });
    
    // Update lastIndex to start from the line containing the first match
    lastIndex = lineStartIndex;
  }

  // Build parts array
  allMatches.forEach((matchObj, index) => {
    // Add text before the match
    if (matchObj.index > lastIndex) {
      const textBefore = cleanedText.substring(lastIndex, matchObj.index);
      if (textBefore.trim()) {
        parts.push({ type: 'text', content: textBefore });
      }
    }

    // Add the link with arrow emoji
    parts.push({
      type: 'link',
      linkType: matchObj.type,
      id: matchObj.id,
      content: `#${matchObj.id} ${I18nManager.isRTL ? '⬅️' : '➡️'}`
    });

    lastIndex = matchObj.index + matchObj.length;
  });

  // Add remaining text after all matches
  if (lastIndex < cleanedText.length) {
    const remainingText = cleanedText.substring(lastIndex);
    if (remainingText.trim()) {
      parts.push({ type: 'text', content: remainingText });
    }
  }

  // If no matches found, return the cleaned text
  if (parts.length === 0) {
    return [{ type: 'text', content: cleanedText }];
  }

  return parts;
};

/**
 * Handles navigation when a reference link is clicked
 * @param {string} linkType - 'apartment' or 'share'
 * @param {string} id - The reference ID
 */
export const handleReferenceClick = (linkType, id) => {
  try {
    if (linkType === 'apartment') {
      router.push(`/(apartments)/${id}`);
    } else if (linkType === 'share') {
      router.push(`/(shares)/${id}`);
    }
  } catch (error) {
    console.error('Error navigating to reference:', error);
  }
}; 