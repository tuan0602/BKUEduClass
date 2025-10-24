import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { User } from '../../lib/mockData';
import { Camera, Save } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface ProfilePageProps {
  user: User;
}

export function ProfilePage({ user }: ProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false);
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

  const handleSaveProfile = () => {
    // Mock save
    setIsEditing(false);
  };

  const handleChangePassword = () => {
    // Mock password change
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
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
                  <AvatarFallback className="bg-primary text-white text-3xl">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <Button 
                  size="icon" 
                  className="absolute bottom-0 right-0 rounded-full"
                  variant="secondary"
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
                    {isEditing ? (
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    ) : (
                      <p>{user.email}</p>
                    )}
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

                  <Button onClick={handleChangePassword} className="bg-primary">
                    Đổi mật khẩu
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      {user.role === 'student' && (
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

      {user.role === 'teacher' && (
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
