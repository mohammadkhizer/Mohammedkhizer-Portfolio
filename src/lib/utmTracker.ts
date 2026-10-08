/**
 * UTM Tracker Utility
 * Extracts, persists, and retrieves UTM parameters from the URL query string.
 */

export interface UtmParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  captured_at?: string;
  landing_page?: string;
}

const UTM_STORAGE_KEY = 'mks_utm_params';

/**
 * Capture UTM params from current URL window location and save to sessionStorage
 */
export function captureUtmParams(): UtmParams | null {
  if (typeof window === 'undefined') return null;

  try {
    const urlParams = new URLSearchParams(window.location.search);
    const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const;

    let hasUtm = false;
    const currentUtm: UtmParams = {};

    utmKeys.forEach((key) => {
      const val = urlParams.get(key);
      if (val) {
        currentUtm[key] = val;
        hasUtm = true;
      }
    });

    if (hasUtm) {
      currentUtm.captured_at = new Date().toISOString();
      currentUtm.landing_page = window.location.pathname;
      sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(currentUtm));
      return currentUtm;
    }
  } catch (err) {
    console.error('Failed to capture UTM parameters:', err);
  }

  return getStoredUtmParams();
}

/**
 * Retrieve stored UTM params from sessionStorage
 */
export function getStoredUtmParams(): UtmParams | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = sessionStorage.getItem(UTM_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as UtmParams;
    }
  } catch (err) {
    console.error('Failed to read UTM parameters:', err);
  }

  return null;
}
