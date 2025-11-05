import { ReactNode } from 'react';
import { User } from '../../lib/mockData';
import logo from '../../assets/01_logobachkhoasang.png';
import { 
  BookOpen, 
  FileText, 
  MessageSquare, 
  BarChart3, 
  UserCircle, 
  Users, 
  Settings,
  LogOut,
  Bell,
  Menu
} from 'lucide-react';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Badge } from '../ui/badge';
import { useState } from 'react';

interface DashboardLayoutProps {
  user: User;
  children: ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export function DashboardLayout({ user, children, currentPage, onNavigate, onLogout }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const getMenuItems = () => {
    if (user.role === 'student') {
      return [
        { id: 'dashboard', label: 'Tổng quan', icon: BarChart3 },
        { id: 'courses', label: 'Lớp học của tôi', icon: BookOpen },
        { id: 'assignments', label: 'Bài tập', icon: FileText },
        { id: 'documents', label: 'Tài liệu', icon: FileText },
        { id: 'discussions', label: 'Thảo luận', icon: MessageSquare },
        { id: 'reports', label: 'Báo cáo học tập', icon: BarChart3 },
        { id: 'profile', label: 'Hồ sơ cá nhân', icon: UserCircle }
      ];
    } else if (user.role === 'teacher') {
      return [
        { id: 'dashboard', label: 'Tổng quan', icon: BarChart3 },
        { id: 'courses', label: 'Quản lý lớp học', icon: BookOpen },
        { id: 'assignments', label: 'Quản lý bài tập', icon: FileText },
        { id: 'documents', label: 'Quản lý tài liệu', icon: FileText },
        { id: 'students', label: 'Quản lý sinh viên', icon: Users },
        { id: 'discussions', label: 'Thảo luận', icon: MessageSquare },
        { id: 'reports', label: 'Thống kê lớp học', icon: BarChart3 },
        { id: 'profile', label: 'Hồ sơ cá nhân', icon: UserCircle }
      ];
    } else {
      return [
        { id: 'dashboard', label: 'Tổng quan', icon: BarChart3 },
        { id: 'users', label: 'Quản lý người dùng', icon: Users },
        { id: 'courses', label: 'Quản lý lớp học', icon: BookOpen },
        { id: 'reports', label: 'Thống kê hệ thống', icon: BarChart3 },
        { id: 'settings', label: 'Cài đặt', icon: Settings }
      ];
    }
  };

  const menuItems = getMenuItems();

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

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <div className={`bg-white border-r border-gray-200 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-0'} overflow-hidden`}>
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="h-16 flex items-center justify-center border-b border-gray-200 px-4">
            <div className="flex items-center">
              <div className="h-24 rounded-lg flex items-center justify-center">
                <img src={logo} alt="Logo" className="w-24 " />
              </div>
              <div>
                <div className="text-primary">BK EduClass</div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 overflow-y-auto py-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-primary border-r-4 border-primary'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Info in Sidebar */}
          <div className="border-t border-gray-200 p-4 space-y-3">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback className="bg-primary text-white">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="truncate">{user.name}</div>
                <div className="text-xs text-muted-foreground">{getRoleLabel(user.role)}</div>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={onLogout}
            >
              <LogOut className="w-4 h-4" />
              Đăng xuất
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <h2>
              {menuItems.find(item => item.id === currentPage)?.label || 'Dashboard'}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-primary text-white">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left hidden md:block">
                    <div className="text-sm">{user.name}</div>
                    <div className="text-xs text-muted-foreground">{getRoleLabel(user.role)}</div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onNavigate('profile')}>
                  <UserCircle className="w-4 h-4 mr-2" />
                  Hồ sơ cá nhân
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onNavigate('settings')}>
                  <Settings className="w-4 h-4 mr-2" />
                  Cài đặt
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout} className="text-red-600">
                  <LogOut className="w-4 h-4 mr-2" />
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
