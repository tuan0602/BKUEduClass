// src/hooks/useUsers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import userService from '../lib/userService';
import type { GetUsersParams, CreateUserRequest, UpdateUserRequest } from '../lib/user.types';
import { toast } from 'sonner'; // hoặc toast library bạn đang dùng

// Hook lấy danh sách users
export function useUsers(params?: GetUsersParams) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => userService.getUsers(params),
  });
}

// Hook lấy user theo ID
export function useUser(userId: string) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => userService.getUserById(userId),
    enabled: !!userId, // Chỉ fetch khi có userId
  });
}

// Hook tạo user mới
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserRequest) => userService.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Tạo người dùng thành công');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Tạo người dùng thất bại');
    },
  });
}

// Hook cập nhật user
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: UpdateUserRequest }) =>
      userService.updateUser(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Cập nhật người dùng thành công');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Cập nhật thất bại');
    },
  });
}

// Hook xóa user
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => userService.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Xóa người dùng thành công');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Xóa thất bại');
    },
  });
}

// Hook lock user
export function useLockUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => userService.lockUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Khóa tài khoản thành công');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Khóa tài khoản thất bại');
    },
  });
}

// Hook unlock user
export function useUnlockUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => userService.unlockUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Mở khóa tài khoản thành công');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Mở khóa thất bại');
    },
  });
}