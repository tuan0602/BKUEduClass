// lib/validation.utils.ts

/**
 * Validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * ============================================
 * PHONE NUMBER VALIDATION
 * ============================================
 */

/**
 * Validate Vietnamese phone number
 * Accepts formats:
 * - 0901234567 (10 digits starting with 0)
 * - +84901234567 (with country code)
 * - 84901234567 (without + prefix)
 */
export const validatePhoneNumber = (phone: string): ValidationResult => {
  if (!phone || phone.trim() === '') {
    return { isValid: true }; // Optional field
  }

  const trimmedPhone = phone.trim();

  // Remove spaces and dashes
  const cleanPhone = trimmedPhone.replace(/[\s-]/g, '');

  // Pattern 1: 0XXXXXXXXX (10 digits starting with 0)
  const pattern1 = /^0[0-9]{9}$/;
  
  // Pattern 2: +84XXXXXXXXX (country code with +)
  const pattern2 = /^\+84[0-9]{9,10}$/;
  
  // Pattern 3: 84XXXXXXXXX (country code without +)
  const pattern3 = /^84[0-9]{9,10}$/;

  if (pattern1.test(cleanPhone) || pattern2.test(cleanPhone) || pattern3.test(cleanPhone)) {
    return { isValid: true };
  }

  return {
    isValid: false,
    error: 'Số điện thoại không hợp lệ. Định dạng: 0901234567 hoặc +84901234567'
  };
};

/**
 * Format phone number for display
 * Examples:
 * - 0901234567 → 090 123 4567
 * - +84901234567 → +84 90 123 4567
 */
export const formatPhoneNumber = (phone: string): string => {
  if (!phone) return '';
  
  const cleanPhone = phone.replace(/[\s-]/g, '');
  
  if (cleanPhone.startsWith('+84')) {
    return cleanPhone.replace(/(\+84)(\d{2})(\d{3})(\d{4})/, '$1 $2 $3 $4');
  }
  
  if (cleanPhone.startsWith('84')) {
    return cleanPhone.replace(/(84)(\d{2})(\d{3})(\d{4})/, '$1 $2 $3 $4');
  }
  
  if (cleanPhone.startsWith('0')) {
    return cleanPhone.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
  }
  
  return phone;
};

/**
 * Normalize phone number to standard format (remove spaces, keep prefix)
 */
export const normalizePhoneNumber = (phone: string): string => {
  if (!phone) return '';
  return phone.replace(/[\s-]/g, '');
};

/**
 * ============================================
 * EMAIL VALIDATION
 * ============================================
 */

/**
 * Validate email with custom domain requirement
 */
export const validateEmail = (
  email: string, 
  requiredDomain?: string
): ValidationResult => {
  if (!email || email.trim() === '') {
    return {
      isValid: false,
      error: 'Email là bắt buộc'
    };
  }

  const trimmedEmail = email.trim().toLowerCase();

  // Basic email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(trimmedEmail)) {
    return {
      isValid: false,
      error: 'Email không đúng định dạng'
    };
  }

  // Check domain if required
  if (requiredDomain) {
    if (!trimmedEmail.endsWith(`@${requiredDomain}`)) {
      return {
        isValid: false,
        error: `Email phải có định dạng @${requiredDomain}`
      };
    }
  }

  return { isValid: true };
};

/**
 * ============================================
 * PASSWORD VALIDATION
 * ============================================
 */

export interface PasswordStrength {
  score: number; // 0-4
  label: string;
  suggestions: string[];
}

/**
 * Validate password with minimum length
 */
export const validatePassword = (
  password: string,
  minLength: number = 6
): ValidationResult => {
  if (!password) {
    return {
      isValid: false,
      error: 'Mật khẩu là bắt buộc'
    };
  }

  if (password.length < minLength) {
    return {
      isValid: false,
      error: `Mật khẩu phải có ít nhất ${minLength} ký tự`
    };
  }

  return { isValid: true };
};

/**
 * Check password strength
 */
export const checkPasswordStrength = (password: string): PasswordStrength => {
  if (!password) {
    return { score: 0, label: 'Rất yếu', suggestions: ['Vui lòng nhập mật khẩu'] };
  }

  let score = 0;
  const suggestions: string[] = [];

  // Length check
  if (password.length >= 8) score++;
  else suggestions.push('Sử dụng ít nhất 8 ký tự');

  // Uppercase check
  if (/[A-Z]/.test(password)) score++;
  else suggestions.push('Thêm chữ hoa');

  // Lowercase check
  if (/[a-z]/.test(password)) score++;
  else suggestions.push('Thêm chữ thường');

  // Number check
  if (/[0-9]/.test(password)) score++;
  else suggestions.push('Thêm số');

  // Special character check
  if (/[^A-Za-z0-9]/.test(password)) score++;
  else suggestions.push('Thêm ký tự đặc biệt');

  const labels = ['Rất yếu', 'Yếu', 'Trung bình', 'Mạnh', 'Rất mạnh'];
  
  return {
    score: Math.min(score, 4),
    label: labels[Math.min(score, 4)],
    suggestions
  };
};

/**
 * ============================================
 * NAME VALIDATION
 * ============================================
 */

/**
 * Validate name (supports Vietnamese characters)
 */
export const validateName = (
  name: string,
  minLength: number = 2,
  maxLength: number = 100
): ValidationResult => {
  if (!name || name.trim() === '') {
    return {
      isValid: false,
      error: 'Họ tên là bắt buộc'
    };
  }

  const trimmedName = name.trim();

  if (trimmedName.length < minLength) {
    return {
      isValid: false,
      error: `Họ tên phải có ít nhất ${minLength} ký tự`
    };
  }

  if (trimmedName.length > maxLength) {
    return {
      isValid: false,
      error: `Họ tên không được vượt quá ${maxLength} ký tự`
    };
  }

  // Allow Vietnamese characters, spaces, and basic punctuation
  const nameRegex = /^[a-zA-ZàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđĐ\s'-]+$/;
  
  if (!nameRegex.test(trimmedName)) {
    return {
      isValid: false,
      error: 'Họ tên chỉ được chứa chữ cái và khoảng trắng'
    };
  }

  return { isValid: true };
};

/**
 * ============================================
 * YEAR VALIDATION (for students)
 * ============================================
 */

/**
 * Validate academic year (1-6 for university)
 */
export const validateYear = (year?: number): ValidationResult => {
  if (year === undefined || year === null) {
    return { isValid: true }; // Optional
  }

  if (year < 1 || year > 6) {
    return {
      isValid: false,
      error: 'Năm học phải từ 1 đến 6'
    };
  }

  return { isValid: true };
};

/**
 * ============================================
 * FORM VALIDATION
 * ============================================
 */

export interface UserFormData {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
  department?: string;
  major?: string;
  year?: number;
  className?: string;
}

export interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
  year?: string;
  general?: string;
}

/**
 * Validate entire user form
 */
export const validateUserForm = (
  data: UserFormData,
  isCreateMode: boolean = true,
  requiredDomain: string = 'bkedu.vn'
): { isValid: boolean; errors: FormErrors } => {
  const errors: FormErrors = {};

  // Name validation
  const nameValidation = validateName(data.name);
  if (!nameValidation.isValid) {
    errors.name = nameValidation.error;
  }

  // Email validation
  const emailValidation = validateEmail(data.email, requiredDomain);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error;
  }

  // Password validation (only for create mode)
  if (isCreateMode) {
    const passwordValidation = validatePassword(data.password || '');
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.error;
    }
  }

  // Phone validation (optional)
  if (data.phone) {
    const phoneValidation = validatePhoneNumber(data.phone);
    if (!phoneValidation.isValid) {
      errors.phone = phoneValidation.error;
    }
  }

  // Year validation (for students)
  if (data.role === 'STUDENT' && data.year) {
    const yearValidation = validateYear(data.year);
    if (!yearValidation.isValid) {
      errors.year = yearValidation.error;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * ============================================
 * UTILITY FUNCTIONS
 * ============================================
 */

/**
 * Check if string contains only numbers
 */
export const isNumeric = (value: string): boolean => {
  return /^\d+$/.test(value);
};

/**
 * Sanitize input to prevent XSS
 */
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Validate file size (for avatar upload)
 */
export const validateFileSize = (
  file: File,
  maxSizeMB: number = 5
): ValidationResult => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  
  if (file.size > maxSizeBytes) {
    return {
      isValid: false,
      error: `Kích thước file không được vượt quá ${maxSizeMB}MB`
    };
  }
  
  return { isValid: true };
};

/**
 * Validate file type (for avatar upload)
 */
export const validateFileType = (
  file: File,
  allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/jpg']
): ValidationResult => {
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Chỉ chấp nhận file ảnh định dạng JPG, JPEG, PNG'
    };
  }
  
  return { isValid: true };
};