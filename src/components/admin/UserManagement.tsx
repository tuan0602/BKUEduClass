import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Search, Plus, Lock, Unlock, Trash2, Edit, Loader2, UserCircle, Mail, Phone, Calendar, Building, GraduationCap, Users } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../ui/dialog';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser, useLockUser, useUnlockUser } from '../../hooks/useUsers';
import { Role, User, CreateUserRequest, UpdateUserRequest } from '../../lib/user.types';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

export function UserManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<Role | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'locked'>('all');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(20); 
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

  // Fetch users with filters (không dùng isLocked filter từ API)
  const { data: usersData, isLoading, isError } = useUsers({
    page: currentPage,
    size: 20, // Lấy nhiều hơn để filter frontend
    search: searchQuery,
    role: roleFilter === 'all' ? undefined : roleFilter
  });

  // Mutations
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();
  const lockUserMutation = useLockUser();
  const unlockUserMutation = useUnlockUser();

  // Filter users on frontend based on status
  const allUsers = usersData?.result || [];
  const users = statusFilter === 'all' 
    ? allUsers 
    : allUsers.filter(user => 
        statusFilter === 'locked' ? user.locked : !user.locked
      );
  
  const totalPages = Math.ceil(users.length / 20);
  const paginatedUsers = users.slice(currentPage * 20, (currentPage + 1) * 20);
  const totalUsers = users.length;

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getRoleBadge = (role: Role) => {
    const variants: { [key in Role]: { variant: any; label: string; color: string } } = {
      [Role.ADMIN]: { variant: 'destructive', label: 'Quản trị viên', color: 'bg-red-100 text-red-800' },
      [Role.TEACHER]: { variant: 'default', label: 'Giảng viên', color: 'bg-blue-100 text-blue-800' },
      [Role.STUDENT]: { variant: 'secondary', label: 'Sinh viên', color: 'bg-green-100 text-green-800' }
    };
    return variants[role];
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN');
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
      role: formData.role,
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
      
      // ✅ Update selected user để view dialog cập nhật ngay
      setSelectedUser({
        ...selectedUser,
        ...updateData
      });
      
      setEditDialogOpen(false);
      resetForm();
      
      // ✅ Đợi 500ms để React Query refetch
      setTimeout(() => {
        setSelectedUser(null);
      }, 500);
      
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

  const openViewDialog = (user: User) => {
    setSelectedUser(user);
    setViewDialogOpen(true);
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Quản lý người dùng</h1>
          <p className="text-muted-foreground">Quản lý tất cả tài khoản trong hệ thống</p>
        </div>

        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Tạo người dùng mới
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto max-w-2xl">
            <DialogHeader>
              <DialogTitle>Tạo người dùng mới</DialogTitle>
              <DialogDescription>
                Nhập thông tin để tạo tài khoản mới
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
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
              <div className="space-y-2">
                <Label>Số điện thoại</Label>
                <Input 
                  placeholder="0901234567" 
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              

              <div className="space-y-2 col-span-2">
                <Label>Mật khẩu *</Label>
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">Mật khẩu phải có ít nhất 6 ký tự</p>
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tổng người dùng</p>
                <p className="text-2xl font-bold">{totalUsers}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Sinh viên</p>
                <p className="text-2xl font-bold">{allUsers.filter(u => u.role === Role.STUDENT).length}</p>
              </div>
              <GraduationCap className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Giảng viên</p>
                <p className="text-2xl font-bold">{allUsers.filter(u => u.role === Role.TEACHER).length}</p>
              </div>
              <Building className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tài khoản bị khóa</p>
                <p className="text-2xl font-bold">{allUsers.filter(u => u.locked).length}</p>
              </div>
              <Lock className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm theo tên hoặc email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={roleFilter} onValueChange={(value: any) => setRoleFilter(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Vai trò" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả vai trò</SelectItem>
            <SelectItem value={Role.STUDENT}>Sinh viên</SelectItem>
            <SelectItem value={Role.TEACHER}>Giảng viên</SelectItem>
            <SelectItem value={Role.ADMIN}>Quản trị viên</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="active">Hoạt động</SelectItem>
            <SelectItem value="locked">Đã khóa</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {paginatedUsers.map(user => {
          const roleInfo = getRoleBadge(user.role);
          return (
            <Card key={user.userId} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => openViewDialog(user)}>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-3">
                  <Avatar className="w-20 h-20">
                    {user.avatar && <AvatarImage src={user.avatar} />}
                    <AvatarFallback className="bg-primary text-white text-xl">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="w-full">
                    <h3 className="font-semibold text-lg truncate">{user.name}</h3>
                    <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                  </div>

                  <div className="flex gap-2">
                    <Badge className={roleInfo.color}>
                      {roleInfo.label}
                    </Badge>
                    <Badge variant={user.locked ? 'destructive' : 'default'}>
                      {user.locked ? 'Đã khóa' : 'Hoạt động'}
                    </Badge>
                  </div>

                  {/* Role-specific info */}
                  <div className="w-full pt-2 border-t text-sm text-muted-foreground">
                    {user.role === Role.STUDENT && (
                      <div className="space-y-1">
                        {user.major && <p className="truncate">📚 {user.major}</p>}
                        {user.className && <p className="truncate">🎓 {user.className}</p>}
                        {user.year && <p>📅 Năm {user.year}</p>}
                        {!user.major && !user.className && !user.year && (
                          <p className="text-xs">Chưa cập nhật thông tin</p>
                        )}
                      </div>
                    )}
                    {user.role === Role.TEACHER && (
                      <div className="space-y-1">
                        {user.department ? (
                          <p className="truncate">🏢 {user.department}</p>
                        ) : (
                          <p className="text-xs">Chưa cập nhật thông tin</p>
                        )}
                      </div>
                    )}
                    {user.role === Role.ADMIN && (
                      <p className="text-xs">Quản trị hệ thống</p>
                    )}
                    {user.phone && (
                      <p className="truncate mt-1">📞 {user.phone}</p>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2 w-full pt-2" onClick={(e) => e.stopPropagation()}>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditDialog(user);
                      }}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Sửa
                    </Button>
                    <Button 
                      size="sm" 
                      variant={user.locked ? 'default' : 'outline'}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleUserStatus(user);
                      }}
                      disabled={lockUserMutation.isPending || unlockUserMutation.isPending}
                    >
                      {user.locked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        openDeleteDialog(user);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {paginatedUsers.length === 0 && (
        <Card className="col-span-full">
          <CardContent className="pt-6 text-center text-muted-foreground">
            Không tìm thấy người dùng nào
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
            disabled={currentPage === 0}
          >
            Trước
          </Button>
          <span className="text-sm text-muted-foreground px-4">
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

      {/* View User Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Thông tin người dùng</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="w-24 h-24">
                  {selectedUser.avatar && <AvatarImage src={selectedUser.avatar} />}
                  <AvatarFallback className="bg-primary text-white text-2xl">
                    {getInitials(selectedUser.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold">{selectedUser.name}</h3>
                  <p className="text-muted-foreground">{selectedUser.email}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge className={getRoleBadge(selectedUser.role).color}>
                      {getRoleBadge(selectedUser.role).label}
                    </Badge>
                    <Badge variant={selectedUser.locked ? 'destructive' : 'default'}>
                      {selectedUser.locked ? 'Đã khóa' : 'Hoạt động'}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Email:</span>
                  </div>
                  <p className="text-sm pl-6">{selectedUser.email}</p>
                </div>

                {selectedUser.phone && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">Số điện thoại:</span>
                    </div>
                    <p className="text-sm pl-6">{selectedUser.phone}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <UserCircle className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Vai trò:</span>
                  </div>
                  <p className="text-sm pl-6">{getRoleBadge(selectedUser.role).label}</p>
                </div>

                {selectedUser.createdAt && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">Ngày tạo:</span>
                    </div>
                    <p className="text-sm pl-6">{formatDate(selectedUser.createdAt)}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    setViewDialogOpen(false);
                    openEditDialog(selectedUser);
                  }}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Chỉnh sửa
                </Button>
                <Button 
                  variant={selectedUser.locked ? 'default' : 'outline'}
                  onClick={() => {
                    toggleUserStatus(selectedUser);
                    setViewDialogOpen(false);
                  }}
                >
                  {selectedUser.locked ? (
                    <>
                      <Unlock className="w-4 h-4 mr-2" />
                      Mở khóa
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Khóa tài khoản
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa thông tin người dùng</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin tài khoản
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label>Họ và tên *</Label>
              <Input 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Email *</Label>
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
    </div>
  );
}