// src/hooks/useUsers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import userService from '../lib/userService';
import { 
  GetUsersParams, 
  CreateUserRequest, 
  UpdateUserRequest, 
  User,
  Role
} from '../lib/user.types';
import { toast } from 'sonner';

// ==============================
// QUERY KEYS
// ==============================
export const userKeys = {
  all: ["users"] as const,
  list: (params?: object) => [...userKeys.all, "list", params] as const,
  detail: (id: string) => [...userKeys.all, "detail", id] as const,
  teachers: () => [...userKeys.all, "teachers"] as const,
};

// ==============================
// QUERY HOOKS
// ==============================

// Lấy danh sách users (admin)
export function useUsers(params?: GetUsersParams) {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => userService.getUsers(params),
  });
}

// Lấy thông tin 1 user theo ID
export function useUser(userId: string) {
  return useQuery({
    queryKey: userKeys.detail(userId),
    queryFn: () => userService.getUserById(userId),
    enabled: !!userId,
  });
}

// ⭐ Lấy danh sách giáo viên để dùng cho dropdown Course
export function useTeachers() {
  return useQuery<User[]>({
    queryKey: userKeys.teachers(),
    queryFn: async () => {
      const response = await userService.getUsers({
        page: 0,
        size: 9999,
        role: Role.TEACHER,
      });

      return response.result ?? [];
    },
    staleTime: 1000 * 60 * 10, // cache 10 phút (teacher không đổi liên tục)
  });
}

// ==============================
// MUTATIONS
// ==============================

// Tạo user
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserRequest) => userService.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      toast.success('Tạo người dùng thành công');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Tạo người dùng thất bại');
    },
  });
}

// Cập nhật user
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: UpdateUserRequest }) =>
      userService.updateUser(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      toast.success('Cập nhật người dùng thành công');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Cập nhật thất bại');
    },
  });
}

// Xóa user
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => userService.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      toast.success('Xóa người dùng thành công');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Xóa thất bại');
    },
  });
}

// Lock user
export function useLockUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => userService.lockUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      toast.success('Khóa tài khoản thành công');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Khóa tài khoản thất bại');
    },
  });
}

// Unlock user
export function useUnlockUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => userService.unlockUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      toast.success('Mở khóa tài khoản thành công');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Mở khóa thất bại');
    },
  });
}
