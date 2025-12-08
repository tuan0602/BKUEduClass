import { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Camera, Save, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { toast } from 'sonner';
import userService from '../../lib/userService';
import api from '../../lib/axios';

export function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || '');
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });
  
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getRoleLabel = (role: string) => {
    const labels: { [key: string]: string } = {
      ADMIN: 'Quản trị viên',
      TEACHER: 'Giảng viên',
      STUDENT: 'Sinh viên'
    };
    return labels[role] || role;
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file ảnh');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      toast.error('Kích thước ảnh không được vượt quá 5MB');
      return;
    }

    try {
      setIsUploadingAvatar(true);
      
      // OPTION 1: Upload to server (nếu backend có endpoint)
      // Uncomment này nếu bạn có API upload avatar
      /*
      const formData = new FormData();
      formData.append('avatar', file);
      
      const response = await api.post('/users/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const newAvatarUrl = response.data.data.avatarUrl;
      setAvatarUrl(newAvatarUrl);
      updateUser({ avatar: newAvatarUrl });
      */
      
      // OPTION 2: Convert to base64 (temporary - for now)
      const reader = new FileReader();
      reader.onload = (event) => {
        const newAvatarUrl = event.target?.result as string;
        setAvatarUrl(newAvatarUrl);
        updateUser({ avatar: newAvatarUrl });
        toast.success('Ảnh đại diện đã được cập nhật');
      };
      reader.readAsDataURL(file);
      
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Không thể tải ảnh lên');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!formData.name.trim()) {
      toast.error('Vui lòng nhập họ và tên');
      return;
    }
    
    try {
      setIsSavingProfile(true);
      
      // ✅ Gọi API PUT /users/changeInfo
      await userService.updateUserInfo(formData.name, formData.phone);
      
      // ✅ Cập nhật AuthContext
      updateUser({ 
        name: formData.name, 
        phone: formData.phone 
      });
      
      setIsEditing(false);
      toast.success('Thông tin cá nhân đã được lưu thành công!');
      
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Không thể cập nhật thông tin';
      toast.error(message);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    // Validation
    if (!passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }

    try {
      setIsChangingPassword(true);
      
      // ✅ Gọi API POST /auth/reset-password
      await api.post('/auth/reset-password', null, {
        params: { newPassword: passwordData.newPassword }
      });
      
      // Clear form
      setPasswordData({ 
        newPassword: '', 
        confirmPassword: '' 
      });
      
      toast.success('Mật khẩu đã được thay đổi thành công!');
      
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Không thể đổi mật khẩu';
      toast.error(message);
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleCancelEdit = () => {
    setFormData({
      name: user.name,
      phone: user.phone || '',
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Hồ sơ cá nhân</h1>
        <p className="text-muted-foreground">Quản lý thông tin cá nhân và cài đặt tài khoản</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Avatar Section */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <div className="relative">
                <Avatar className="w-32 h-32">
                  {avatarUrl && <AvatarImage src={avatarUrl} alt={user.name} />}
                  <AvatarFallback className="bg-primary text-white text-3xl">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                  disabled={isUploadingAvatar}
                />
                <Button 
                  size="icon" 
                  className="absolute bottom-0 right-0 rounded-full"
                  variant="secondary"
                  onClick={handleAvatarClick}
                  disabled={isUploadingAvatar}
                >
                  {isUploadingAvatar ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Camera className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <h2 className="mt-4 text-xl font-semibold">{user.name}</h2>
              <p className="text-muted-foreground">{getRoleLabel(user.role)}</p>
              <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
              
              {/* ✅ Hiển thị studentId hoặc teacherId nếu có */}
              {user.studentId && (
                <p className="text-sm text-muted-foreground mt-1">Mã SV: {user.studentId}</p>
              )}
              {user.teacherId && (
                <p className="text-sm text-muted-foreground mt-1">Mã GV: {user.teacherId}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Main Info */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Thông tin cá nhân</CardTitle>
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} variant="outline">
                  Chỉnh sửa
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button 
                    onClick={handleCancelEdit} 
                    variant="outline"
                    disabled={isSavingProfile}
                  >
                    Hủy
                  </Button>
                  <Button 
                    onClick={handleSaveProfile} 
                    className="bg-primary"
                    disabled={isSavingProfile}
                  >
                    {isSavingProfile ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Lưu
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="info">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="info">Thông tin</TabsTrigger>
                <TabsTrigger value="security">Bảo mật</TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Họ và tên *</Label>
                    {isEditing ? (
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Nhập họ và tên"
                      />
                    ) : (
                      <p className="text-sm py-2">{user.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Email</Label>
                    <p className="text-sm py-2 text-muted-foreground">{user.email}</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Số điện thoại</Label>
                    {isEditing ? (
                      <Input
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="Nhập số điện thoại"
                      />
                    ) : (
                      <p className="text-sm py-2">{user.phone || 'Chưa cập nhật'}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Vai trò</Label>
                    <p className="text-sm py-2">{getRoleLabel(user.role)}</p>
                  </div>

                  {/* ✅ Hiển thị studentId nếu là STUDENT */}
                  {user.studentId && (
                    <div className="space-y-2">
                      <Label>Mã sinh viên</Label>
                      <p className="text-sm py-2">{user.studentId}</p>
                    </div>
                  )}

                  {/* ✅ Hiển thị teacherId nếu là TEACHER */}
                  {user.teacherId && (
                    <div className="space-y-2">
                      <Label>Mã giảng viên</Label>
                      <p className="text-sm py-2">{user.teacherId}</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="security" className="space-y-4 mt-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Mật khẩu mới *</Label>
                    <Input
                      type="password"
                      placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ 
                        ...passwordData, 
                        newPassword: e.target.value 
                      })}
                      disabled={isChangingPassword}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Xác nhận mật khẩu mới *</Label>
                    <Input
                      type="password"
                      placeholder="Nhập lại mật khẩu mới"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ 
                        ...passwordData, 
                        confirmPassword: e.target.value 
                      })}
                      disabled={isChangingPassword}
                    />
                  </div>

                  <Button 
                    onClick={handleChangePassword} 
                    className="bg-primary" 
                    disabled={isChangingPassword}
                  >
                    {isChangingPassword ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Đang xử lý...
                      </>
                    ) : (
                      'Đổi mật khẩu'
                    )}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}