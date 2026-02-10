
import { ProposalData } from './types';

/**
 * Encodes data into a base64 string safe for URLs
 */
export const encodeData = (data: ProposalData): string => {
  const json = JSON.stringify(data);
  // Using btoa(unescape(encodeURIComponent(...))) for better Unicode support in base64
  return btoa(unescape(encodeURIComponent(json)));
};

/**
 * Decodes a base64 string back into the original data object
 */
export const decodeData = (encoded: string): ProposalData | null => {
  try {
    const json = decodeURIComponent(escape(atob(encoded)));
    return JSON.parse(json);
  } catch (e) {
    console.error('Failed to decode proposal data', e);
    return null;
  }
};

/**
 * Gets the current URL without the hash for link generation
 */
export const getBaseUrl = (): string => {
  // Use location.origin + location.pathname to get a clean base URL without query params or hashes
  return window.location.origin + window.location.pathname;
};
