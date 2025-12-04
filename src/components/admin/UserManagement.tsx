import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Search, Plus, Lock, Unlock, Trash2, Edit, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../ui/dialog';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser, useLockUser, useUnlockUser } from '../../hooks/useUsers';
import { Role, User, CreateUserRequest, UpdateUserRequest } from '../../lib/user.types';

export function UserManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<Role | 'all'>('all');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  
  const [formData, setFormData] = useState<CreateUserRequest>({
    name: '',
    email: '',
    role: Role.STUDENT,
    password: '',
    phone: '',
    department: '',
    major: '',
    year: undefined,
    className: ''
  });

  // Fetch users with filters
  const { data: usersData, isLoading, isError } = useUsers({
    page: currentPage,
    size: 20,
    search: searchQuery,
    role: roleFilter === 'all' ? undefined : roleFilter
  });

  // Mutations
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();
  const lockUserMutation = useLockUser();
  const unlockUserMutation = useUnlockUser();

  const users = usersData?.result || [];
  const totalPages = usersData?.meta.totalPages || 0;

  const getRoleBadge = (role: Role) => {
    const variants: { [key in Role]: { variant: any; label: string } } = {
      [Role.ADMIN]: { variant: 'destructive', label: 'Quản trị viên' },
      [Role.TEACHER]: { variant: 'default', label: 'Giảng viên' },
      [Role.STUDENT]: { variant: 'secondary', label: 'Sinh viên' }
    };
    return variants[role];
  };

  const handleCreateUser = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    try {
      await createUserMutation.mutateAsync(formData);
      setCreateDialogOpen(false);
      resetForm();
    } catch (error: any) {
      // Error đã được handle trong hook
    }
  };

  const handleEditUser = async () => {
    if (!selectedUser) return;

    const updateData: UpdateUserRequest = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      department: formData.department,
      major: formData.major,
      year: formData.year,
      className: formData.className
    };

    try {
      await updateUserMutation.mutateAsync({ 
        userId: selectedUser.userId, 
        data: updateData 
      });
      setEditDialogOpen(false);
      setSelectedUser(null);
      resetForm();
    } catch (error: any) {
      // Error đã được handle trong hook
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      await deleteUserMutation.mutateAsync(selectedUser.userId);
      setDeleteDialogOpen(false);
      setSelectedUser(null);
    } catch (error: any) {
      // Error đã được handle trong hook
    }
  };

  const openEditDialog = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      password: '',
      phone: user.phone || '',
      department: user.department || '',
      major: user.major || '',
      year: user.year,
      className: user.className || ''
    });
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (user: User) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const toggleUserStatus = async (user: User) => {
    try {
      if (user.locked) {
        await unlockUserMutation.mutateAsync(user.userId);
      } else {
        await lockUserMutation.mutateAsync(user.userId);
      }
    } catch (error: any) {
      // Error đã được handle trong hook
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      role: Role.STUDENT,
      password: '',
      phone: '',
      department: '',
      major: '',
      year: undefined,
      className: ''
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500">
        Lỗi khi tải dữ liệu. Vui lòng thử lại.
      </div>
    );
  }

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
          <DialogContent className="max-h-[90vh] overflow-y-auto">
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
                <Select value={formData.role} onValueChange={(value: Role) => setFormData({ ...formData, role: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={Role.STUDENT}>Sinh viên</SelectItem>
                    <SelectItem value={Role.TEACHER}>Giảng viên</SelectItem>
                    <SelectItem value={Role.ADMIN}>Quản trị viên</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Student fields */}
              {formData.role === Role.STUDENT && (
                <>
                  <div className="space-y-2">
                    <Label>Ngành học</Label>
                    <Input 
                      placeholder="Khoa học máy tính" 
                      value={formData.major}
                      onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Năm học</Label>
                    <Input 
                      type="number"
                      placeholder="2024" 
                      value={formData.year || ''}
                      onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || undefined })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Lớp</Label>
                    <Input 
                      placeholder="CS101" 
                      value={formData.className}
                      onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                    />
                  </div>
                </>
              )}

              {/* Teacher fields */}
              {formData.role === Role.TEACHER && (
                <div className="space-y-2">
                  <Label>Khoa</Label>
                  <Input 
                    placeholder="Khoa Công nghệ Thông tin" 
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  />
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
              <Button variant="outline" onClick={() => { setCreateDialogOpen(false); resetForm(); }}>
                Hủy
              </Button>
              <Button 
                className="bg-primary" 
                onClick={handleCreateUser}
                disabled={createUserMutation.isPending}
              >
                {createUserMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Tạo tài khoản
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm người dùng..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={roleFilter} onValueChange={(value: any) => setRoleFilter(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Lọc theo vai trò" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value={Role.STUDENT}>Sinh viên</SelectItem>
            <SelectItem value={Role.TEACHER}>Giảng viên</SelectItem>
            <SelectItem value={Role.ADMIN}>Quản trị viên</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
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
            <div className="space-y-2">
              <Label>Vai trò *</Label>
              <Select value={formData.role} onValueChange={(value: Role) => setFormData({ ...formData, role: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={Role.STUDENT}>Sinh viên</SelectItem>
                  <SelectItem value={Role.TEACHER}>Giảng viên</SelectItem>
                  <SelectItem value={Role.ADMIN}>Quản trị viên</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            
            {/* Role-specific fields */}
            {selectedUser?.role === Role.STUDENT && (
              <>
                <div className="space-y-2">
                  <Label>Ngành học</Label>
                  <Input 
                    value={formData.major}
                    onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Năm học</Label>
                  <Input 
                    type="number"
                    value={formData.year || ''}
                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || undefined })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Lớp</Label>
                  <Input 
                    value={formData.className}
                    onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                  />
                </div>
              </>
            )}
            
            {selectedUser?.role === Role.TEACHER && (
              <div className="space-y-2">
                <Label>Khoa</Label>
                <Input 
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setEditDialogOpen(false); resetForm(); }}>
              Hủy
            </Button>
            <Button 
              className="bg-primary" 
              onClick={handleEditUser}
              disabled={updateUserMutation.isPending}
            >
              {updateUserMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
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
            <AlertDialogAction 
              onClick={handleDeleteUser} 
              className="bg-destructive hover:bg-destructive/90"
              disabled={deleteUserMutation.isPending}
            >
              {deleteUserMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách người dùng ({usersData?.meta.totalElements || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Vai trò</TableHead>
                <TableHead>Thông tin bổ sung</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map(user => {
                const roleInfo = getRoleBadge(user.role);
                return (
                  <TableRow key={user.userId}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={roleInfo.variant as any}>{roleInfo.label}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {user.role === Role.STUDENT && (user.major || user.className) && (
                        <div>{user.major} {user.className && `- ${user.className}`}</div>
                      )}
                      {user.role === Role.TEACHER && user.department && (
                        <div>{user.department}</div>
                      )}
                      {(!user.major && !user.className && !user.department) && '-'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.locked ? 'destructive' : 'default'}>
                        {user.locked ? 'Đã khóa' : 'Hoạt động'}
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
                          onClick={() => toggleUserStatus(user)}
                          className={user.locked ? 'text-green-600' : 'text-orange-600'}
                          disabled={lockUserMutation.isPending || unlockUserMutation.isPending}
                        >
                          {user.locked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                disabled={currentPage === 0}
              >
                Trước
              </Button>
              <span className="text-sm text-muted-foreground">
                Trang {currentPage + 1} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={currentPage >= totalPages - 1}
              >
                Sau
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}