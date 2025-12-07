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
  studentId?: string;   // ✅ THÊM
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

    // ✅ Bỏ Authorization header vì interceptor đã tự động thêm
    api
      .get("/auth/me")
      .then((res) => {
        // Backend wraps payload in an ApiResponse: { statusCode, message, data, ... }
        // Normalise to our `User` shape.
        const payload = res?.data?.data || res?.data;
        // Some responses nest the user under `user` (login), others return flat user DTO.
        const u = payload?.user || payload;
        if (u) {
          // Map fields to our User interface if needed
          const mapped = {
            userId: u.userId || u.id || u.userId || '',
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
    console.log("🔵 Login called:", email); // ✅ DEBUG
    
    const res = await api.post("/auth/login", { email, password });
    console.log("🟢 Login response:", res.data); // ✅ DEBUG
    
    const { token, userId, name, email: userEmail, role } = res.data.data;
    
    localStorage.setItem("token", token);
    setUser({ userId, name, email: userEmail, role });
    
    console.log("🟢 Login successful!"); // ✅ DEBUG
    return true;
  } catch (error) {
    console.error("🔴 Login failed:", error);
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
      const res = await api.post("/auth/register", { name, email, password, role });
      
      // ✅ SỬA: Backend trả về flat object
      const { token, userId, name: userName, email: userEmail, role: userRole } = res.data.data;
      
      localStorage.setItem("token", token);
      setUser({ userId, name: userName, email: userEmail, role: userRole });
      
      return true;
    } catch (error) {
      console.error("Register failed:", error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    // ✅ Clear toàn bộ React Query cache khi logout
    // Điều này đảm bảo data của user cũ không còn trong cache khi login user mới
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
