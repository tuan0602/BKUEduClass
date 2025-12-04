// src/services/userService.ts
import api from "../lib/axios";
import type {
  ApiResponse,
  CreateUserRequest,
  GetUsersParams,
  ResultPaginationDTO,
  UpdateUserRequest,
  User,
} from "../lib/user.types";

class UserService {
  /**
   * GET /api/users
   * Get all users with pagination, search, and filters
   * Required: ADMIN role
   */
  async getUsers(params?: GetUsersParams): Promise<ResultPaginationDTO<User>> {
    const { data } = await api.get<ApiResponse<ResultPaginationDTO<User>>>(
      "/users",
      {
        params: {
          page: params?.page || 0,
          size: params?.size || 10,
          sort: params?.sort || "createdAt,asc",
          search: params?.search,
          role: params?.role,
          isLocked: params?.isLocked,
        },
      }
    );
    return data.data;
  }

  /**
   * GET /api/users/:id
   * Get user by ID
   * Required: ADMIN role
   */
  async getUserById(userId: string): Promise<User> {
    const { data } = await api.get<ApiResponse<User>>(`/users/${userId}`);
    return data.data;
  }

  /**
   * POST /api/users
   * Create a new user
   * Required: ADMIN role
   */
  async createUser(userData: CreateUserRequest): Promise<User> {
    const { data } = await api.post<ApiResponse<User>>("/users", userData);
    return data.data;
  }

  /**
   * PUT /api/users/:id
   * Update user information
   * Required: ADMIN role
   */
  async updateUser(userId: string, userData: UpdateUserRequest): Promise<User> {
    const { data } = await api.put<ApiResponse<User>>(
      `/users/${userId}`,
      userData
    );
    return data.data;
  }

  /**
   * DELETE /api/users/:id
   * Delete a user
   * Required: ADMIN role
   */
  async deleteUser(userId: string): Promise<void> {
    await api.delete<ApiResponse<string>>(`/users/${userId}`);
  }

  /**
   * PATCH /api/users/:id/lock
   * Lock user account
   * Required: ADMIN role
   */
  async lockUser(userId: string): Promise<User> {
    const { data } = await api.patch<ApiResponse<User>>(
      `/users/${userId}/lock`
    );
    return data.data;
  }

  /**
   * PATCH /api/users/:id/unlock
   * Unlock user account
   * Required: ADMIN role
   */
  async unlockUser(userId: string): Promise<User> {
    const { data } = await api.patch<ApiResponse<User>>(
      `/users/${userId}/unlock`
    );
    return data.data;
  }
}

export default new UserService();