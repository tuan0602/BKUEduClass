// src/types/user.types.ts

export enum Role {
  ADMIN = "ADMIN",
  STUDENT = "STUDENT",
  TEACHER = "TEACHER",
}

// ============= API Response Wrapper =============
export interface ApiResponse<T> {
  statusCode: string;
  message: string;
  data: T;
  error: string | null;
  timestamp: string;
}

// ============= Pagination =============
export interface ResultPaginationDTO<T> {
  meta: {
    totalElements: number;
    pageSize: number;
    currentPage: number;
    totalPages: number;
  };
  result: T[];
}

// ============= User Types =============
export interface User {
  userId: string;
  email: string;
  name: string;
  role: Role;
  avatar?: string;
  phone?: string;
  locked: boolean;
  createdAt: string;
  // Role-specific fields
  department?: string; // Teacher
  major?: string; // Student
  year?: number; // Student
  className?: string; // Student
}

export interface CreateUserRequest {
  email: string;
  password: string;
  name: string;
  role: Role;
  phone?: string;
  // Role-specific fields
  department?: string;
  major?: string;
  year?: number;
  className?: string;
}

export interface UpdateUserRequest {
  email?: string;
  name?: string;
  role?: Role;
  phone?: string;

}

// ============= Query Params =============
export interface GetUsersParams {
  page?: number;
  size?: number;
  sort?: string;
  search?: string;
  role?: Role;
  isLocked?: boolean;
}