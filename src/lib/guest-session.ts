import { generateSessionId } from '@/lib/utils/id-generator';
import type { GuestSession, ConceptData } from '@/types';
import { GUEST_MAX_GENERATIONS } from '@/lib/constants';

const GUEST_SESSION_KEY = 'yt_thumbnail_guest_session';

/**
 * Get the current guest session from localStorage
 */
export const getGuestSession = (): GuestSession | null => {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(GUEST_SESSION_KEY);
    if (!stored) return null;

    const session: GuestSession = JSON.parse(stored);

    // Check if session is expired (24 hours)
    const createdAt = new Date(session.createdAt);
    const now = new Date();
    const hoursDiff = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

    if (hoursDiff > 24) {
      // Session expired, clear it
      clearGuestSession();
      return null;
    }

    return session;
  } catch {
    return null;
  }
};

/**
 * Create a new guest session
 */
export const createGuestSession = (): GuestSession => {
  const session: GuestSession = {
    sessionId: generateSessionId(),
    generationsUsed: 0,
    generatedConceptId: null,
    createdAt: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(GUEST_SESSION_KEY, JSON.stringify(session));
  }

  return session;
};

/**
 * Get or create a guest session
 */
export const getOrCreateGuestSession = (): GuestSession => {
  const existing = getGuestSession();
  if (existing) return existing;
  return createGuestSession();
};

/**
 * Increment the generations used count
 */
export const incrementGuestGenerations = (): GuestSession | null => {
  const session = getGuestSession();
  if (!session) return null;

  session.generationsUsed += 1;

  if (typeof window !== 'undefined') {
    localStorage.setItem(GUEST_SESSION_KEY, JSON.stringify(session));
  }

  return session;
};

/**
 * Check if guest has remaining generations
 */
export const hasRemainingGenerations = (): boolean => {
  const session = getGuestSession();
  if (!session) return true; // New guests get generations
  return session.generationsUsed < GUEST_MAX_GENERATIONS;
};

/**
 * Get remaining generations count
 */
export const getRemainingGenerations = (): number => {
  const session = getGuestSession();
  if (!session) return GUEST_MAX_GENERATIONS;
  return Math.max(0, GUEST_MAX_GENERATIONS - session.generationsUsed);
};

/**
 * Store the generated concept ID for transfer on signup
 */
export const storeGeneratedConcept = (conceptId: string): void => {
  const session = getGuestSession();
  if (!session) return;

  session.generatedConceptId = conceptId;

  if (typeof window !== 'undefined') {
    localStorage.setItem(GUEST_SESSION_KEY, JSON.stringify(session));
  }
};

/**
 * Get the session ID for server-side operations
 */
export const getGuestSessionId = (): string | null => {
  const session = getGuestSession();
  return session?.sessionId || null;
};

/**
 * Clear the guest session (after successful signup)
 */
export const clearGuestSession = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(GUEST_SESSION_KEY);
  }
};

/**
 * Check if user is in guest mode (has a session but not authenticated)
 */
export const isGuestMode = (): boolean => {
  const session = getGuestSession();
  return session !== null;
};

/**
 * Serialize concept data for storage
 */
export const serializeConceptData = (data: ConceptData): string => {
  return JSON.stringify(data);
};

/**
 * Parse concept data from storage
 */
export const parseConceptData = (data: string): ConceptData | null => {
  try {
    return JSON.parse(data) as ConceptData;
  } catch {
    return null;
  }
};
