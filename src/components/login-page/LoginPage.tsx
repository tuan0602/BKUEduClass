import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { BookOpen, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';
import { useAuth } from '../../context/authContext';

interface LoginPageProps {
  onNavigateToRegister: () => void;
  onNavigateToForgotPassword: () => void;
}

export function LoginPage({ onNavigateToRegister, onNavigateToForgotPassword }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

 console.log("=== FORM SUBMITTED ==="); // ✅ THÊM
  console.log("Email:", email);
  console.log("Password:", password);

    if (!email || !password) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    try {
      console.log("Calling login()..."); // ✅ THÊM
      const success = await login(email, password);
      console.log("Login result:", success); // ✅ THÊM
      if (!success) {
        setError('Email hoặc mật khẩu không chính xác');
      } else {
      console.log("Login successful!"); // ✅ THÊM
    }

    } catch (er) {
      console.error("Login error:", er); // ✅ THÊM
      setError('Đã có lỗi xảy ra, vui lòng thử lại');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-primary mb-2">BK EduClass</h1>
            <p className="text-muted-foreground">Hệ thống quản lý lớp học</p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

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

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <label htmlFor="remember" className="text-sm cursor-pointer select-none">
                  Ghi nhớ đăng nhập
                </label>
              </div>
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

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Chưa có tài khoản?{' '}
              <button onClick={onNavigateToRegister} className="text-primary hover:underline">
                Đăng ký ngay
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
