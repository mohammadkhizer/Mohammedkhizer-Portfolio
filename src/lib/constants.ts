/**
 * Application constants and configuration.
 * Centralized config to avoid hardcoded values throughout the codebase.
 */

// Admin configuration
export const ADMIN_CONFIG = {
  COLLECTION_NAME: 'admins',
};



// Error messages
export const ERROR_MESSAGES = {
  // Authentication errors
  AUTH_UNAUTHORIZED: 'You must be logged in to access this page.',
  AUTH_ADMIN_REQUIRED: 'Administrative privileges required.',
  AUTH_PROVISION_FAILED: 'Failed to provision admin record.',
  AUTH_STATE_ERROR: 'Error checking authentication state.',

  // API/Network errors
  NETWORK_ERROR: 'Network error. Please check your connection.',
  API_ERROR: 'An error occurred while processing your request.',
  RATE_LIMITED: 'Rate limit exceeded. Please wait a minute before trying again.',

  // Generic errors
  UNKNOWN_ERROR: 'An unexpected error occurred.',
  INVALID_INPUT: 'Invalid input provided.',
  NOT_FOUND: 'The requested resource was not found.',
} as const;

// UI labels and text
export const UI_LABELS = {
  // Admin panel
  ADMIN_ACCESS_DENIED: 'Access Denied',
  ADMIN_PROVISION_BUTTON: 'Provision Admin Record',
  ADMIN_RETURN_PORTFOLIO: 'Return to Portfolio',
  ADMIN_NO_PRIVILEGES: 'You are signed in but do not have administrative privileges.',

  // AI Assistant
  AI_ASSISTANT_TITLE: 'AI Project Assistant',
  AI_ASSISTANT_HEADING: 'Find the right project for your needs',
  AI_ASSISTANT_DESCRIPTION: 'Tell me what you\'re interested in (e.g. "retail", "healthcare analytics", or "blockchain"), and I\'ll suggest which of my projects most matches your industry.',
  AI_ASSISTANT_PLACEHOLDER: 'Enter an industry or tech stack...',
  AI_ASSISTANT_BUTTON: 'Ask AI',
  AI_ASSISTANT_LOADING: 'Generating recommendations...',
  AI_ASSISTANT_EMPTY: 'Your personalized recommendations will appear here...',
  AI_ASSISTANT_MATCHING_REASON: 'Matching Reason',
} as const;

// Security configuration
export const SECURITY_CONFIG = {
  RATE_LIMIT_THRESHOLD: 5,
  RATE_LIMIT_WINDOW_MS: 60 * 1000,
  CSRF_TOKEN_LENGTH: 32,
  SESSION_COOKIE_MAX_AGE: 3600,
} as const;

// Portfolio Assistant system prompt
export const PORTFOLIO_ASSISTANT_CONFIG = {
  NAME: 'Mohammed Khizer Shaikh',
  TITLE: 'Full-Stack Web Developer & AI/ML Enthusiast',
  EDUCATION: '2nd Year CSE at SVGU (Bachelor\'s), Diploma in AI/ML from LJ University',
  EXPERIENCE: 'Python Developer Intern at Way to Web (Django, Tripboss project)',
  LOCATION: 'Ahmedabad, Gujarat, India',
  EMAIL: 'work.mkhizer@gmail.com',
  LINKEDIN: 'https://www.linkedin.com/in/mohammad-khizer-shaikh-14a362275',
} as const;
