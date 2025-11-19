import api from "../api/axios";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
}

const AuthService = {
  login: async (data: LoginRequest) => {
    const res = await api.post("/auth/login", data);
    return res.data;
  },

  register: async (data: RegisterRequest) => {
    const res = await api.post("/auth/register", data);
    return res.data;
  },

  me: async () => {
    const res = await api.get("/auth/me");
    return res.data;
  },
};

export default AuthService;
