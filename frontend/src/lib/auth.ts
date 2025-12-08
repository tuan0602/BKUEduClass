import api from './axios';

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

export async function resetPassword(token: string, newPassword: string): Promise<ResetPasswordResponse> {
  try {
    const res = await api.post('/auth/reset-password', { token, newPassword });
    if (res?.data) return res.data as ResetPasswordResponse;
    return { success: true, message: 'Mật khẩu đã được đặt lại' };
  } catch (err: any) {
    const message = err?.response?.data?.message || err?.message || 'Lỗi khi đặt lại mật khẩu';
    return { success: false, message };
  }
}

// For authenticated users: change password using current session (Bearer token)
export async function changePassword(newPassword: string): Promise<ResetPasswordResponse> {
  try {
    // send as request param because backend expects @RequestParam String newPassword
    const res = await api.post('/auth/reset-password', null, { params: { newPassword } });
    if (res?.data) return res.data as ResetPasswordResponse;
    return { success: true, message: 'Mật khẩu đã được thay đổi' };
  } catch (err: any) {
    const message = err?.response?.data?.message || err?.message || 'Lỗi khi đổi mật khẩu';
    return { success: false, message };
  }
}
