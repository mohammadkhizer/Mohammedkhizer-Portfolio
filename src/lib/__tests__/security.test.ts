import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { isAdmin, getAuthenticatedUser } from '../security';


// Mock next/headers
vi.mock('next/headers', () => ({
  headers: vi.fn(async () => new Map()),
  cookies: vi.fn(async () => ({
    get: vi.fn(),
    set: vi.fn(),
    delete: vi.fn(),
  })),
}));

// Mock firebase-admin imports
const mockDocGet = vi.fn(async () => ({ exists: true, data: () => ({ isAdmin: true }) }));
const mockDoc = vi.fn(() => ({ get: mockDocGet }));
const mockCollection = vi.fn(() => ({ doc: mockDoc }));

vi.mock('../firebase-admin', () => ({
  dbAdmin: {
    collection: mockCollection,
  },
  authAdmin: {
    verifySessionCookie: vi.fn(async (token: string) => {
      if (token === 'valid-token') return { uid: 'user-123', email: 'test@example.com' };
      throw new Error('Invalid token');
    }),
    createSessionCookie: vi.fn(async () => 'mock-session-cookie'),
  },
}));


// Mock constants
vi.mock('../constants', () => ({
  ADMIN_CONFIG: {
    MASTER_UID: 'master-uid',
    COLLECTION_NAME: 'admins',
  },
}));

describe('Security Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAuthenticatedUser', () => {
    it('should return null if no session cookie exists', async () => {
      const { cookies } = await import('next/headers');
      (cookies as Mock).mockImplementationOnce(async () => ({
        get: vi.fn().mockReturnValue(undefined),
      }));

      const user = await getAuthenticatedUser();
      expect(user).toBeNull();
    });

    it('should return user info if valid session cookie exists', async () => {
      const { cookies } = await import('next/headers');
      (cookies as Mock).mockImplementationOnce(async () => ({
        get: vi.fn().mockReturnValue({ value: 'valid-token' }),
      }));

      const user = await getAuthenticatedUser();
      expect(user).toEqual({ uid: 'user-123', email: 'test@example.com' });
    });
  });

  describe('isAdmin', () => {
    it('should return true for master UID', async () => {
      const { cookies } = await import('next/headers');
      (cookies as Mock).mockImplementationOnce(async () => ({
        get: vi.fn().mockReturnValue({ value: 'valid-token' }),
      }));

      // Override verifySessionCookie to return master-uid
      const { authAdmin } = await import('../firebase-admin');
      (authAdmin.verifySessionCookie as Mock).mockResolvedValueOnce({ uid: 'master-uid' });

      const result = await isAdmin();
      expect(result).toBe(true);
    });

    it('should return false if user is not in admin collection', async () => {
      const { cookies } = await import('next/headers');
      (cookies as Mock).mockImplementationOnce(async () => ({
        get: vi.fn().mockReturnValue({ value: 'valid-token' }),
      }));

      // Access the mock from the module scope if possible, or via import
      mockDocGet.mockResolvedValueOnce({ exists: false } as never);

      const result = await isAdmin();
      expect(result).toBe(false);
    });

  });
});
