import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { BookOpen, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';
import logo from '../../assets/01_logobachkhoasang.png';
interface ForgotPasswordPageProps {
  onNavigateToLogin: () => void;
}

export function ForgotPasswordPage({ onNavigateToLogin }: ForgotPasswordPageProps) {
  const [step, setStep] = useState<'email' | 'code' | 'reset'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email) {
      setError('Vui lòng nhập email');
      return;
    }

    // Mock sending code
    setMessage('Mã xác nhận đã được gửi đến email của bạn');
    setStep('code');
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!code) {
      setError('Vui lòng nhập mã xác nhận');
      return;
    }

    // Mock code verification
    if (code === '123456') {
      setMessage('Mã xác nhận đúng. Vui lòng đặt mật khẩu mới');
      setStep('reset');
    } else {
      setError('Mã xác nhận không đúng');
    }
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!newPassword || !confirmPassword) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    if (newPassword.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    // Mock password reset
    setMessage('Đặt lại mật khẩu thành công!');
    setTimeout(() => {
      onNavigateToLogin();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center h-32 rounded-full mb-4">
              <img src={logo} alt="Logo" className="h-32 mx-auto mb-4 rounded-full object-cover" />
            </div>
            <h1 className="text-primary mb-2">Quên mật khẩu</h1>
            <p className="text-muted-foreground">
              {step === 'email' && 'Nhập email để nhận mã xác nhận'}
              {step === 'code' && 'Nhập mã xác nhận'}
              {step === 'reset' && 'Đặt lại mật khẩu mới'}
            </p>
          </div>

          {/* Messages */}
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {message && (
            <Alert className="mb-4 bg-green-50 text-green-900 border-green-200">
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          {/* Email Step */}
          {step === 'email' && (
            <form onSubmit={handleSendCode} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@bkedu.vn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-input-background"
                />
              </div>

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                Gửi mã xác nhận
              </Button>
            </form>
          )}

          {/* Code Verification Step */}
          {step === 'code' && (
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Mã xác nhận</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="123456"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="bg-input-background"
                />
                <p className="text-xs text-muted-foreground">
                  Demo: Nhập mã "123456" để tiếp tục
                </p>
              </div>

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                Xác nhận
              </Button>
            </form>
          )}

          {/* Reset Password Step */}
          {step === 'reset' && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">Mật khẩu mới</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-input-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-input-background"
                />
              </div>

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                Đặt lại mật khẩu
              </Button>
            </form>
          )}

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <button
              onClick={onNavigateToLogin}
              className="text-sm text-primary hover:underline inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại đăng nhập
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
