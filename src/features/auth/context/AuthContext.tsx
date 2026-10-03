import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// ─── Types ─────────────────────────────────────────────────────────────────
export type UserRole = 'student' | 'teacher' | 'admin';

export interface AuthUser {
  username: string;
  role: UserRole;
  displayName: string;
  avatar: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (username: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
}

// ─── Mock credentials ──────────────────────────────────────────────────────
const MOCK_USERS: Record<string, { password: string; user: AuthUser }> = {
  student: {
    password: 'student123',
    user: { username: 'student', role: 'student', displayName: 'Alex Johnson', avatar: 'AJ' },
  },
  teacher: {
    password: 'teacher123',
    user: { username: 'teacher', role: 'teacher', displayName: 'Dr. Sarah Chen', avatar: 'SC' },
  },
  admin: {
    password: 'admin123',
    user: { username: 'admin', role: 'admin', displayName: 'Admin User', avatar: 'AU' },
  },
};

const SESSION_KEY = 'cc_auth_user';

// ─── Context ───────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session from sessionStorage on mount
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(SESSION_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      // ignore malformed data
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((username: string, password: string): { success: boolean; error?: string } => {
    const entry = MOCK_USERS[username.toLowerCase()];
    if (!entry) {
      return { success: false, error: 'Username not found.' };
    }
    if (entry.password !== password) {
      return { success: false, error: 'Incorrect password.' };
    }
    setUser(entry.user);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(entry.user));
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem(SESSION_KEY);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};
