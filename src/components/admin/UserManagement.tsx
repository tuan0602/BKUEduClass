import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Search, Plus, Lock, Unlock, Trash2, Edit } from 'lucide-react';
import { DEMO_USERS, User } from '../../lib/mockData';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../ui/dialog';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';

export function UserManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [users, setUsers] = useState(DEMO_USERS.map(u => ({ ...u, isLocked: false })));
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'student' as 'admin' | 'teacher' | 'student',
    password: '',
    phone: '',
    studentId: '',
    teacherId: ''
  });

  const getNextStudentId = () => {
    const studentIds = users
      .filter(u => u.role === 'student' && u.studentId)
      .map(u => parseInt(u.studentId!.replace('SV', '') || '0'))
      .filter(id => !isNaN(id));
    const maxId = Math.max(...studentIds, 2021000);
    return `SV${maxId + 1}`;
  };

  const getNextTeacherId = () => {
    const teacherIds = users
      .filter(u => u.role === 'teacher' && u.teacherId)
      .map(u => parseInt(u.teacherId!.replace('GV', '') || '0'))
      .filter(id => !isNaN(id));
    const maxId = Math.max(...teacherIds, 0);
    return `GV${String(maxId + 1).padStart(3, '0')}`;
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.studentId?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (user.teacherId?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getRoleBadge = (role: string) => {
    const variants: { [key: string]: { variant: any; label: string } } = {
      admin: { variant: 'destructive', label: 'Quản trị viên' },
      teacher: { variant: 'default', label: 'Giảng viên' },
      student: { variant: 'secondary', label: 'Sinh viên' }
    };
    return variants[role] || variants.student;
  };

  const handleCreateUser = () => {
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    // Check if email already exists
    if (users.some(u => u.email === formData.email)) {
      toast.error('Email đã tồn tại trong hệ thống');
      return;
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      phone: formData.phone || undefined,
      studentId: formData.role === 'student' ? (formData.studentId || getNextStudentId()) : undefined,
      teacherId: formData.role === 'teacher' ? (formData.teacherId || getNextTeacherId()) : undefined,
      isLocked: false as const
    };

    setUsers([...users, newUser]);
    setCreateDialogOpen(false);
    setFormData({ name: '', email: '', role: 'student', password: '', phone: '', studentId: '', teacherId: '' });
    toast.success(`Tạo người dùng thành công! ${newUser.studentId ? `Mã sinh viên: ${newUser.studentId}` : newUser.teacherId ? `Mã giảng viên: ${newUser.teacherId}` : ''}`);
  };

  const handleEditUser = () => {
    if (!selectedUser) return;

    setUsers(users.map(u => 
      u.id === selectedUser.id 
        ? { ...u, name: formData.name, email: formData.email, phone: formData.phone }
        : u
    ));
    setEditDialogOpen(false);
    setSelectedUser(null);
    toast.success('Cập nhật thông tin thành công!');
  };

  const handleDeleteUser = () => {
    if (!selectedUser) return;

    setUsers(users.filter(u => u.id !== selectedUser.id));
    setDeleteDialogOpen(false);
    setSelectedUser(null);
    toast.success('Xóa người dùng thành công!');
  };

  const openEditDialog = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      password: '',
      phone: user.phone || '',
      studentId: user.studentId || '',
      teacherId: user.teacherId || ''
    });
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (user: User) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(users.map(u => 
      u.id === userId ? { ...u, isLocked: !u.isLocked } : u
    ));
    const user = users.find(u => u.id === userId);
    toast.success(user?.isLocked ? 'Đã mở khóa tài khoản' : 'Đã khóa tài khoản');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1>Quản lý người dùng</h1>
          <p className="text-muted-foreground">Quản lý tất cả tài khoản trong hệ thống</p>
        </div>

        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Tạo người dùng mới
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tạo người dùng mới</DialogTitle>
              <DialogDescription>
                Nhập thông tin để tạo tài khoản mới
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Họ và tên *</Label>
                <Input 
                  placeholder="Nguyễn Văn A" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Email *</Label>
                <Input 
                  type="email" 
                  placeholder="example@bkedu.vn" 
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Vai trò *</Label>
                <Select value={formData.role} onValueChange={(value: any) => setFormData({ ...formData, role: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Sinh viên</SelectItem>
                    <SelectItem value="teacher">Giảng viên</SelectItem>
                    <SelectItem value="admin">Quản trị viên</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {formData.role === 'student' && (
                <div className="space-y-2">
                  <Label>Mã sinh viên</Label>
                  <Input 
                    placeholder="Để trống để tự động tạo mã" 
                    value={formData.studentId}
                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Để trống để hệ thống tự động tạo mã
                  </p>
                </div>
              )}
              {formData.role === 'teacher' && (
                <div className="space-y-2">
                  <Label>Mã giảng viên</Label>
                  <Input 
                    placeholder="Để trống để tự động tạo mã" 
                    value={formData.teacherId}
                    onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Để trống để hệ thống tự động tạo mã
                  </p>
                </div>
              )}
              <div className="space-y-2">
                <Label>Số điện thoại</Label>
                <Input 
                  placeholder="0901234567" 
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Mật khẩu *</Label>
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                Hủy
              </Button>
              <Button className="bg-primary" onClick={handleCreateUser}>
                Tạo tài khoản
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm người dùng..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa thông tin người dùng</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin tài khoản
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Họ và tên</Label>
              <Input 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input 
                type="email" 
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Số điện thoại</Label>
              <Input 
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Hủy
            </Button>
            <Button className="bg-primary" onClick={handleEditUser}>
              Cập nhật
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa người dùng</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa người dùng "{selectedUser?.name}"? 
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser} className="bg-destructive hover:bg-destructive/90">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách người dùng ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Vai trò</TableHead>
                <TableHead>Mã SV/GV</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map(user => {
                const roleInfo = getRoleBadge(user.role);
                return (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={roleInfo.variant as any}>{roleInfo.label}</Badge>
                    </TableCell>
                    <TableCell>{user.studentId || user.teacherId || '-'}</TableCell>
                    <TableCell>
                      <Badge variant={user.isLocked ? 'destructive' : 'default'}>
                        {user.isLocked ? 'Đã khóa' : 'Hoạt động'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="ghost" onClick={() => openEditDialog(user)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => toggleUserStatus(user.id)}
                          className={user.isLocked ? 'text-green-600' : 'text-orange-600'}
                        >
                          {user.isLocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-destructive"
                          onClick={() => openDeleteDialog(user)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}