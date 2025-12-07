import { useState, useRef } from 'react';
import { User, useAuth } from '../../context/authContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {  } from '../../lib/mockData';
import { Camera, Save } from 'lucide-react';
import { changePassword } from '../../lib/auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { toast } from 'sonner';
import userService from '../../lib/userService';

interface ProfilePageProps {
  user: User;
}

export function ProfilePage({ user }: ProfilePageProps) {
  const { updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(user.avatar || '');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isChanging, setIsChanging] = useState(false);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getRoleLabel = (role: string) => {
    const labels: { [key: string]: string } = {
      admin: 'Quản trị viên',
      teacher: 'Giảng viên',
      student: 'Sinh viên'
    };
    return labels[role] || role;
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, upload to server
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatarUrl(event.target?.result as string);
        toast.success('Ảnh đại diện đã được cập nhật');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    if (!formData.name) {
      toast.error('Vui lòng nhập họ và tên');
      return;
    }
    
    try {
      await userService.updateUserInfo(formData.name, formData.phone);
      // Cập nhật user trong AuthContext
      updateUser({ name: formData.name, phone: formData.phone });
      setIsEditing(false);
      toast.success('Thông tin cá nhân đã được lưu thành công!');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Không thể cập nhật thông tin');
    }
  };

  const handleChangePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
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
      setIsChanging(true);
      const resp = await changePassword(passwordData.newPassword);
      if (resp.success) {
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        toast.success(resp.message || 'Mật khẩu đã được thay đổi thành công!');
      } else {
        toast.error(resp.message || 'Không thể đổi mật khẩu');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Lỗi khi đổi mật khẩu');
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1>Hồ sơ cá nhân</h1>
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
                />
                <Button 
                  size="icon" 
                  className="absolute bottom-0 right-0 rounded-full"
                  variant="secondary"
                  onClick={handleAvatarClick}
                >
                  <Camera className="w-4 h-4" />
                </Button>
              </div>
              <h2 className="mt-4">{user.name}</h2>
              <p className="text-muted-foreground">{getRoleLabel(user.role)}</p>
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
                  <Button onClick={() => setIsEditing(false)} variant="outline">
                    Hủy
                  </Button>
                  <Button onClick={handleSaveProfile} className="bg-primary">
                    <Save className="w-4 h-4 mr-2" />
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

              <TabsContent value="info" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Họ và tên</Label>
                    {isEditing ? (
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    ) : (
                      <p>{user.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Email</Label>
                    <p>{user.email}</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Số điện thoại</Label>
                    {isEditing ? (
                      <Input
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    ) : (
                      <p>{user.phone || 'Chưa cập nhật'}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Vai trò</Label>
                    <p>{getRoleLabel(user.role)}</p>
                  </div>

                  {user.studentId && (
                    <div className="space-y-2">
                      <Label>Mã sinh viên</Label>
                      <p>{user.studentId}</p>
                    </div>
                  )}

                  {user.teacherId && (
                    <div className="space-y-2">
                      <Label>Mã giảng viên</Label>
                      <p>{user.teacherId}</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="security" className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Mật khẩu hiện tại</Label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Mật khẩu mới</Label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Xác nhận mật khẩu mới</Label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    />
                  </div>

                  <Button onClick={handleChangePassword} className="bg-primary" disabled={isChanging}>
                    Đổi mật khẩu
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      {user.role === 'STUDENT' && (
        <Card>
          <CardHeader>
            <CardTitle>Thống kê học tập</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-primary mb-1">3</div>
                <div className="text-sm text-muted-foreground">Lớp học</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-primary mb-1">12</div>
                <div className="text-sm text-muted-foreground">Bài tập đã nộp</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-primary mb-1">85%</div>
                <div className="text-sm text-muted-foreground">Tỷ lệ hoàn thành</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-primary mb-1">3.45</div>
                <div className="text-sm text-muted-foreground">GPA</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {user.role === 'TEACHER' && (
        <Card>
          <CardHeader>
            <CardTitle>Thống kê giảng dạy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-primary mb-1">3</div>
                <div className="text-sm text-muted-foreground">Lớp học</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-primary mb-1">21</div>
                <div className="text-sm text-muted-foreground">Sinh viên</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-primary mb-1">5</div>
                <div className="text-sm text-muted-foreground">Bài tập đã giao</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-primary mb-1">4</div>
                <div className="text-sm text-muted-foreground">Tài liệu đã upload</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
