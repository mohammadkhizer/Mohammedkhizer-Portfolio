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

// Mock dbConnect
vi.mock('../mongodb', () => ({
  default: vi.fn(async () => {}),
}));

// Mock Admin model
const mockFindOne = vi.fn();
vi.mock('@/models/Admin', () => ({
  default: {
    findOne: mockFindOne,
  },
}));

// Mock jsonwebtoken
vi.mock('jsonwebtoken', () => ({
  default: {
    verify: vi.fn((token: string) => {
      if (token === 'valid-token') return { uid: 'user-123', email: 'test@example.com', isAdmin: true };
      throw new Error('Invalid token');
    }),
    sign: vi.fn(() => 'mock-token'),
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
      expect(user).toEqual({ uid: 'user-123', email: 'test@example.com', isAdmin: true });
    });
  });

  describe('isAdmin', () => {
    it('should return true if user exists and is admin in DB', async () => {
      const { cookies } = await import('next/headers');
      (cookies as Mock).mockImplementationOnce(async () => ({
        get: vi.fn().mockReturnValue({ value: 'valid-token' }),
      }));

      mockFindOne.mockResolvedValueOnce({ email: 'test@example.com', isAdmin: true });

      const result = await isAdmin();
      expect(result).toBe(true);
    });

    it('should return false if user exists but is not admin in DB', async () => {
      const { cookies } = await import('next/headers');
      (cookies as Mock).mockImplementationOnce(async () => ({
        get: vi.fn().mockReturnValue({ value: 'valid-token' }),
      }));

      mockFindOne.mockResolvedValueOnce({ email: 'test@example.com', isAdmin: false });

      const result = await isAdmin();
      expect(result).toBe(false);
    });

    it('should return false if user is not in DB', async () => {
      const { cookies } = await import('next/headers');
      (cookies as Mock).mockImplementationOnce(async () => ({
        get: vi.fn().mockReturnValue({ value: 'valid-token' }),
      }));

      mockFindOne.mockResolvedValueOnce(null);

      const result = await isAdmin();
      expect(result).toBe(false);
    });
  });
});
