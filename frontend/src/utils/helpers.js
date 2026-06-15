// Utility helper functions
// Add shared utility functions here

/**
 * Format a date to a readable string
 * @param {Date|string} date
 * @returns {string}
 */
export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Get difficulty badge class name
 * @param {'Easy'|'Medium'|'Hard'} difficulty
 * @returns {string}
 */
export function getDifficultyClass(difficulty) {
  const map = {
    Easy: 'badge-easy',
    Medium: 'badge-medium',
    Hard: 'badge-hard',
  };
  return map[difficulty] || 'badge';
}

/**
 * Truncate text to a max length
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
export function truncate(text, maxLength = 50) {
  if (!text) return '';
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
}
