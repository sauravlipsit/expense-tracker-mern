import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { api } from '../api/client';
import { User } from '../types';
interface AuthContextValue { user: User | null; loading: boolean; refresh: () => Promise<void>; logout: () => Promise<void> }
const AuthContext = createContext<AuthContextValue | undefined>(undefined);
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null); const [loading, setLoading] = useState(true);
  const refresh = async () => { try { const { data } = await api.get('/auth/me'); setUser(data.user); } catch { setUser(null); } finally { setLoading(false); } };
  useEffect(() => { void refresh(); }, []);
  const logout = async () => { try { await api.post('/auth/logout'); } finally { setUser(null); } };
  return <AuthContext.Provider value={{ user, loading, refresh, logout }}>{children}</AuthContext.Provider>;
}
export function useAuth() { const value = useContext(AuthContext); if (!value) throw new Error('useAuth must be used inside AuthProvider'); return value; }
