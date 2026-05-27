// src/lib/authService.ts
import api from './axios';
import type { ApiResponse, User, Role } from './user.types';

// ============= REQUEST DTOs =============
interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
}

// ============= RESPONSE DTOs =============
interface UserLogin {
  id: string;
  email: string;
  name: string;
  role: Role;
}

interface LoginResponse {
  token: string;
  userId: string;
  name: string;
  email: string;
  role: Role;
  user: UserLogin;
}

interface RegisterResponse {
  userId: string;
  email: string;
  name: string;
  role: Role;
  createdAt: string;
}

class AuthService {
  /**
   * POST /api/auth/login
   * Login user and get access token
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const { data } = await api.post<ApiResponse<LoginResponse>>(
      '/auth/login',
      credentials
    );
    return data.data;
  }

  /**
   * POST /api/auth/register
   * Register a new user account
   */
  async register(userData: RegisterRequest): Promise<User> {
    const { data } = await api.post<ApiResponse<User>>(
      '/auth/register',
      userData
    );
    return data.data;
  }

  /**
   * GET /api/auth/me
   * Get current authenticated user information
   * Required: Bearer token in Authorization header
   */
  async getCurrentUser(): Promise<User> {
    const { data } = await api.get<ApiResponse<User>>('/auth/me');
    return data.data;
  }

  /**
   * POST /api/auth/logout
   * Logout current user and invalidate refresh token
   * Required: Bearer token in Authorization header
   */
  async logout(): Promise<void> {
    await api.post<ApiResponse<void>>('/auth/logout');
  }

  /**
   * GET /api/auth/refresh
   * Refresh access token using refresh token from cookie
   * Note: Refresh token is sent via httpOnly cookie automatically
   */
  async refreshAccessToken(): Promise<LoginResponse> {
    const { data } = await api.get<ApiResponse<LoginResponse>>('/auth/refresh');
    return data.data;
  }

  /**
   * POST /api/auth/reset-password
   * Reset/Change password for current user
   * Required: Bearer token in Authorization header
   * 
   * @param newPassword - The new password to set
   */
  async resetPassword(newPassword: string): Promise<void> {
    await api.post<ApiResponse<void>>(
      '/auth/reset-password',
      null,
      {
        params: { newPassword }
      }
    );
  }

  /**
   * POST /api/users/avatar (example endpoint if exists)
   * Upload avatar image
   * Note: Adjust endpoint based on your actual backend API
   */
  async uploadAvatar(formData: FormData): Promise<{ avatarUrl: string }> {
    const { data } = await api.post<ApiResponse<{ avatarUrl: string }>>(
      '/users/avatar',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return data.data;
  }
}

export default new AuthService();