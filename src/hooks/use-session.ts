import { useState, useEffect, useCallback } from 'react';

export interface UserSession {
  uid: string;
  email: string;
  isAdmin?: boolean;
}

export interface UseSessionResult {
  user: UserSession | null;
  isUserLoading: boolean;
  userError: Error | null;
  refreshSession: () => Promise<void>;
}

export function useSession(): UseSessionResult {
  const [user, setUser] = useState<UserSession | null>(null);
  const [isUserLoading, setIsUserLoading] = useState<boolean>(true);
  const [userError, setUserError] = useState<Error | null>(null);

  const fetchSession = useCallback(async () => {
    setIsUserLoading(true);
    try {
      const response = await fetch('/api/admin/auth/session');
      if (!response.ok) {
        throw new Error('Failed to fetch session');
      }
      const data = await response.json();
      setUser(data.user);
      setUserError(null);
    } catch (err: any) {
      setUserError(err);
      setUser(null);
    } finally {
      setIsUserLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  return {
    user,
    isUserLoading,
    userError,
    refreshSession: fetchSession,
  };
}
