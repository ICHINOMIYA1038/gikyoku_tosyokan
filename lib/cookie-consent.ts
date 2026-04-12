const CONSENT_KEY = 'cookie-consent';

export type ConsentValue = 'accepted' | 'rejected';

export function getConsent(): ConsentValue | null {
  if (typeof window === 'undefined') return null;
  const value = localStorage.getItem(CONSENT_KEY);
  if (value === 'accepted' || value === 'rejected') return value;
  return null;
}

export function setConsent(value: ConsentValue): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CONSENT_KEY, value);
}

export function hasConsent(): boolean {
  return getConsent() !== null;
}

export function isConsentAccepted(): boolean {
  return getConsent() === 'accepted';
}
