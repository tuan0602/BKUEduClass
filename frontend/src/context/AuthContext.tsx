import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import api from "../lib/axios";
import { queryClient } from "../main";

export interface User {
  userId: string;
  name: string;
  email: string;
  role: "ADMIN" | "TEACHER" | "STUDENT"; 
  avatar?: string;
  phone?: string;
  studentId?: string;
  teacherId?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    name: string,
    email: string,
    password: string,
    role: "STUDENT" | "TEACHER"
  ) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get("/auth/me")
      .then((res) => {
        const payload = res?.data?.data || res?.data;
        const u = payload?.user || payload;
        if (u) {
          const mapped = {
            userId: u.userId || u.id || '',
            name: u.name || u.fullName || '',
            email: u.email || '',
            role: u.role || 'STUDENT',
            avatar: u.avatar,
            phone: u.phone,
            studentId: u.studentId,
            teacherId: u.teacherId,
          };
          setUser(mapped as any);
        } else {
          setUser(null);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch user:", error);
        localStorage.removeItem("token");
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      const { token, userId, name, email: userEmail, role } = res.data.data;
      localStorage.setItem("token", token);
      setUser({ userId, name, email: userEmail, role });
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: "STUDENT" | "TEACHER"
  ) => {
    try {
      // Bước 1: Đăng ký tài khoản
      await api.post("/auth/register", { name, email, password, role });

      // Bước 2: Tự động login sau khi đăng ký thành công
      const success = await login(email, password);
      return success;
    } catch (error) {
      console.error("Register failed:", error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    // Clear toàn bộ React Query cache khi logout
    // Đảm bảo data của user cũ không còn trong cache khi login user mới
    queryClient.clear();
  };

  const updateUser = (updates: Partial<User>) => {
    setUser((prev) => prev ? { ...prev, ...updates } : null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}