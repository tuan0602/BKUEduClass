import { createContext, useContext, useState, ReactNode } from 'react';
import { User, DEMO_USERS } from './mockData';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  register: (email: string, password: string, name: string, role: 'student' | 'teacher') => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password: string): boolean => {
    const foundUser = DEMO_USERS.find(
      (u) => u.email === email && u.password === password
    );
    
    if (foundUser) {
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const register = (email: string, password: string, name: string, role: 'student' | 'teacher'): boolean => {
    // Mock registration - in real app would call API
    const newUser: User = {
      id: `${role}-${Date.now()}`,
      email,
      password,
      name,
      role
    };
    
    // In a real app, we would add this to database
    setUser(newUser);
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
