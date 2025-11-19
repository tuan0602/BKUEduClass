import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { AlertCircle } from 'lucide-react';
import logo from '../../assets/01_logobachkhoasang.png';

interface LoginPageProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onNavigateToRegister: () => void;
  onNavigateToForgotPassword: () => void;
}

export function LoginPage({
  onLogin,
  onNavigateToRegister,
  onNavigateToForgotPassword,
}: LoginPageProps): JSX.Element {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    try {
      await onLogin(email, password);
    } catch (err) {
      setError('Email hoặc mật khẩu không chính xác');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <img
              src={logo}
              alt="Logo"
              className="h-32 mx-auto mb-4 rounded-full object-cover"
            />
            <h1 className="text-primary mb-2">BK EduClass</h1>
            <p className="text-muted-foreground">Hệ thống quản lý lớp học</p>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email / Tên đăng nhập</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@bkedu.vn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-input-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-input-background"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={onNavigateToForgotPassword}
                className="text-sm text-primary hover:underline"
              >
                Quên mật khẩu?
              </button>
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
              Đăng nhập
            </Button>
          </form>

          {/* Link Register */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Chưa có tài khoản?{' '}
              <button
                onClick={onNavigateToRegister}
                className="text-primary hover:underline"
              >
                Đăng ký ngay
              </button>
            </p>
          </div>

          {/* Demo Accounts */}
          <div className="mt-6 pt-6 border-t">
            <p className="text-xs text-muted-foreground mb-2">Tài khoản demo:</p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>Admin: admin@bkedu.vn / admin123</p>
              <p>Giảng viên: teacher1@bkedu.vn / teacher123</p>
              <p>Sinh viên: student1@bkedu.vn / student123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
