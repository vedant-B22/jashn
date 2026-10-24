/**
 * Sanitizes and wraps raw user input to protect against prompt-injection attacks.
 * Strips control sequences, escapes potential delimiter breakouts, and wraps in explicit boundary tags.
 */

const DANGEROUS_PATTERNS = [
  /system\s*:/gi,
  /assistant\s*:/gi,
  /human\s*:/gi,
  /developer\s*:/gi,
  /ignore\s+(all\s+)?(previous|prior)\s+instructions/gi,
  /bypass\s+all\s+guardrails/gi,
  /<\|im_start\|>/gi,
  /<\|im_end\|>/gi,
  /```json/gi,
  /```/gi,
];

/**
 * Sanitizes untrusted user input before injecting into LLM prompt templates.
 */
export function sanitizeUserInput(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  // Strip null bytes and non-printable control characters (except newline, tab)
  let cleaned = input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  // Defang common prompt injection attack keywords
  for (const pattern of DANGEROUS_PATTERNS) {
    cleaned = cleaned.replace(pattern, '[filtered]');
  }

  // Trim to reasonable length to prevent token-exhaustion denial of service
  return cleaned.trim().slice(0, 1500);
}

/**
 * Wraps sanitized user text in strictly bounded XML delimiters.
 * Instructs model explicitly that content within the tag is untrusted raw text data.
 */
export function wrapInBoundaryTags(sanitizedText: string, tagName = 'untrusted_user_event_brief'): string {
  return `<${tagName}>\n${sanitizedText}\n</${tagName}>`;
}
