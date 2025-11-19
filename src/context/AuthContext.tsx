import { createContext, useContext, useEffect, useState } from "react";
import AuthService from "../services/auth.service";

interface AuthContextType {
  user: any;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // load user khi reload trang
  useEffect(() => {
    const init = async () => {
      try {
        const me = await AuthService.me();
        setUser(me);
      } catch {
        setUser(null);
      }
      setLoading(false);
    };
    init();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await AuthService.login({ email, password });

    localStorage.setItem("access_token", res.accessToken);
    localStorage.setItem("refresh_token", res.refreshToken);

    const me = await AuthService.me();
    setUser(me);
  };

  const register = async (data: any) => {
    const res = await AuthService.register(data);

    localStorage.setItem("access_token", res.accessToken);
    localStorage.setItem("refresh_token", res.refreshToken);

    const me = await AuthService.me();
    setUser(me);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext)!;
