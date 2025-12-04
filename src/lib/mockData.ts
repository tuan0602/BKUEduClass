// Mock data for the Learning Management System

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'teacher' | 'student';
  avatar?: string;
  phone?: string;
  studentId?: string;
  teacherId?: string;
  isLocked?: boolean;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  description: string;
  teacherId: string;
  teacherName: string;
  semester: string;
  coverImage?: string;
  studentCount: number;
  enrollmentCode: string;
  isLocked?: boolean;
}

export interface Assignment {
  id: string;
  courseId: string;
  courseName: string;
  title: string;
  description: string;
  dueDate: string;
  maxScore: number;
  status: 'pending' | 'submitted' | 'graded' | 'overdue';
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  fileUrl?: string;
  fileName?: string;
  notes?: string;
  score?: number;
  feedback?: string;
  status: 'submitted' | 'graded';
}

export interface Document {
  id: string;
  courseId: string;
  title: string;
  type: 'pdf' | 'video' | 'slide';
  url: string;
  uploadedAt: string;
  category: string;
}

export interface Discussion {
  id: string;
  courseId: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  title: string;
  content: string;
  createdAt: string;
  replies: Reply[];
  isPinned?: boolean;
}

export interface Reply {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  content: string;
  createdAt: string;
}

// Demo accounts
export const DEMO_USERS: User[] = [
  {
    id: 'admin-1',
    email: 'admin@bkedu.vn',
    password: 'admin123',
    name: 'Nguyễn Văn Admin',
    role: 'admin',
    phone: '0901234567'
  },
  {
    id: 'teacher-1',
    email: 'teacher1@bkedu.vn',
    password: 'teacher123',
    name: 'Trần Thị Hương',
    role: 'teacher',
    teacherId: 'GV001',
    phone: '0902345678'
  },
  {
    id: 'teacher-2',
    email: 'teacher2@bkedu.vn',
    password: 'teacher123',
    name: 'Lê Văn Minh',
    role: 'teacher',
    teacherId: 'GV002',
    phone: '0903456789'
  },
  {
    id: 'student-1',
    email: 'student1@bkedu.vn',
    password: 'student123',
    name: 'Phạm Minh Tuấn',
    role: 'student',
    studentId: 'SV2021001',
    phone: '0904567890'
  },
  {
    id: 'student-2',
    email: 'student2@bkedu.vn',
    password: 'student123',
    name: 'Hoàng Thị Lan',
    role: 'student',
    studentId: 'SV2021002'
  },
  {
    id: 'student-3',
    email: 'student3@bkedu.vn',
    password: 'student123',
    name: 'Đỗ Văn Hùng',
    role: 'student',
    studentId: 'SV2021003'
  },
  {
    id: 'student-4',
    email: 'student4@bkedu.vn',
    password: 'student123',
    name: 'Nguyễn Thị Mai',
    role: 'student',
    studentId: 'SV2021004'
  },
  {
    id: 'student-5',
    email: 'student5@bkedu.vn',
    password: 'student123',
    name: 'Vũ Văn Nam',
    role: 'student',
    studentId: 'SV2021005'
  },
  {
    id: 'student-6',
    email: 'student6@bkedu.vn',
    password: 'student123',
    name: 'Bùi Thị Hoa',
    role: 'student',
    studentId: 'SV2021006'
  },
  {
    id: 'student-7',
    email: 'student7@bkedu.vn',
    password: 'student123',
    name: 'Trịnh Văn Đức',
    role: 'student',
    studentId: 'SV2021007'
  },
  {
    id: 'student-8',
    email: 'student8@bkedu.vn',
    password: 'student123',
    name: 'Lý Thị Ngọc',
    role: 'student',
    studentId: 'SV2021008'
  },
  {
    id: 'student-9',
    email: 'student9@bkedu.vn',
    password: 'student123',
    name: 'Phan Văn Sơn',
    role: 'student',
    studentId: 'SV2021009'
  },
  {
    id: 'student-10',
    email: 'student10@bkedu.vn',
    password: 'student123',
    name: 'Đinh Thị Thảo',
    role: 'student',
    studentId: 'SV2021010'
  }
];

export const DEMO_COURSES: Course[] = [
  {
    id: 'course-1',
    name: 'Lập trình Web nâng cao',
    code: 'IT4409',
    description: 'Học các kỹ thuật lập trình web hiện đại với React, Node.js và các công nghệ mới nhất',
    teacherId: 'teacher-1',
    teacherName: 'Trần Thị Hương',
    semester: 'HK1 2024-2025',
    studentCount: 8,
    enrollmentCode: 'WEB2024'
  },
  {
    id: 'course-2',
    name: 'Cơ sở dữ liệu',
    code: 'IT3080',
    description: 'Tìm hiểu về thiết kế và quản trị cơ sở dữ liệu quan hệ',
    teacherId: 'teacher-2',
    teacherName: 'Lê Văn Minh',
    semester: 'HK1 2024-2025',
    studentCount: 6,
    enrollmentCode: 'DB2024'
  },
  {
    id: 'course-3',
    name: 'Trí tuệ nhân tạo',
    code: 'IT4868',
    description: 'Khám phá các thuật toán machine learning và deep learning',
    teacherId: 'teacher-1',
    teacherName: 'Trần Thị Hương',
    semester: 'HK1 2024-2025',
    studentCount: 7,
    enrollmentCode: 'AI2024'
  }
];

export const DEMO_ASSIGNMENTS: Assignment[] = [
  {
    id: 'assign-1',
    courseId: 'course-1',
    courseName: 'Lập trình Web nâng cao',
    title: 'Bài tập 1: Tạo ứng dụng React cơ bản',
    description: 'Xây dựng ứng dụng Todo List sử dụng React Hooks',
    dueDate: '2025-10-20T23:59:59',
    maxScore: 100,
    status: 'pending'
  },
  {
    id: 'assign-2',
    courseId: 'course-1',
    courseName: 'Lập trình Web nâng cao',
    title: 'Bài tập 2: REST API với Node.js',
    description: 'Tạo RESTful API cho ứng dụng quản lý sản phẩm',
    dueDate: '2025-10-25T23:59:59',
    maxScore: 100,
    status: 'pending'
  },
  {
    id: 'assign-3',
    courseId: 'course-2',
    courseName: 'Cơ sở dữ liệu',
    title: 'Thiết kế CSDL cho hệ thống thư viện',
    description: 'Vẽ sơ đồ ER và chuẩn hóa cơ sở dữ liệu',
    dueDate: '2025-10-18T23:59:59',
    maxScore: 100,
    status: 'submitted'
  },
  {
    id: 'assign-4',
    courseId: 'course-2',
    courseName: 'Cơ sở dữ liệu',
    title: 'Truy vấn SQL nâng cao',
    description: 'Viết các câu truy vấn SQL phức tạp',
    dueDate: '2025-10-10T23:59:59',
    maxScore: 100,
    status: 'overdue'
  },
  {
    id: 'assign-5',
    courseId: 'course-3',
    courseName: 'Trí tuệ nhân tạo',
    title: 'Bài tập: Thuật toán tìm kiếm',
    description: 'Cài đặt thuật toán A* và so sánh với BFS, DFS',
    dueDate: '2025-10-22T23:59:59',
    maxScore: 100,
    status: 'graded'
  }
];

export const DEMO_SUBMISSIONS: Submission[] = [
  {
    id: 'sub-1',
    assignmentId: 'assign-3',
    studentId: 'student-1',
    studentName: 'Phạm Minh Tuấn',
    submittedAt: '2025-10-17T14:30:00',
    fileUrl: 'database-design.pdf',
    fileName: 'Thiet_ke_CSDL_PhamMinhTuan.pdf',
    notes: 'Em đã hoàn thành thiết kế theo yêu cầu. Đã áp dụng chuẩn hóa đến BCNF.',
    score: 85,
    feedback: 'Thiết kế tốt, cần chú ý thêm về chuẩn hóa',
    status: 'graded'
  },
  {
    id: 'sub-2',
    assignmentId: 'assign-3',
    studentId: 'student-2',
    studentName: 'Hoàng Thị Lan',
    submittedAt: '2025-10-18T09:15:00',
    fileUrl: 'er-diagram.pdf',
    fileName: 'SoDo_ER_HoangThiLan.pdf',
    notes: 'Em vẽ sơ đồ ER chi tiết và giải thích các mối quan hệ.',
    status: 'submitted'
  },
  {
    id: 'sub-3',
    assignmentId: 'assign-5',
    studentId: 'student-1',
    studentName: 'Phạm Minh Tuấn',
    submittedAt: '2025-10-21T20:00:00',
    fileUrl: 'ai-search.py',
    fileName: 'ThuatToan_AStar_PhamMinhTuan.py',
    notes: 'Em đã cài đặt thuật toán A* và so sánh hiệu suất với BFS, DFS. Kèm file báo cáo.',
    score: 92,
    feedback: 'Xuất sắc! Code rất sạch và có comment tốt',
    status: 'graded'
  }
];

export const DEMO_DOCUMENTS: Document[] = [
  {
    id: 'doc-1',
    courseId: 'course-1',
    title: 'Slide bài giảng - Giới thiệu React',
    type: 'slide',
    url: 'react-intro.pdf',
    uploadedAt: '2025-09-15T10:00:00',
    category: 'Chương 1'
  },
  {
    id: 'doc-2',
    courseId: 'course-1',
    title: 'Video hướng dẫn - React Hooks',
    type: 'video',
    url: 'react-hooks-tutorial.mp4',
    uploadedAt: '2025-09-20T14:30:00',
    category: 'Chương 2'
  },
  {
    id: 'doc-3',
    courseId: 'course-2',
    title: 'Tài liệu - Thiết kế CSDL',
    type: 'pdf',
    url: 'database-design.pdf',
    uploadedAt: '2025-09-18T09:00:00',
    category: 'Chương 1'
  },
  {
    id: 'doc-4',
    courseId: 'course-3',
    title: 'Slide - Machine Learning cơ bản',
    type: 'slide',
    url: 'ml-basics.pdf',
    uploadedAt: '2025-09-25T11:00:00',
    category: 'Chương 3'
  }
];

export const DEMO_DISCUSSIONS: Discussion[] = [
  {
    id: 'disc-1',
    courseId: 'course-1',
    authorId: 'teacher-1',
    authorName: 'Trần Thị Hương',
    authorRole: 'Giảng viên',
    title: 'Thông báo: Lịch học tuần sau',
    content: 'Lớp học tuần sau sẽ chuyển sang phòng 205 nhé các em!',
    createdAt: '2025-10-13T09:00:00',
    isPinned: true,
    replies: [
      {
        id: 'reply-1',
        authorId: 'student-1',
        authorName: 'Phạm Minh Tuấn',
        authorRole: 'Sinh viên',
        content: 'Dạ em đã nhận được thông báo ạ!',
        createdAt: '2025-10-13T09:30:00'
      }
    ]
  },
  {
    id: 'disc-2',
    courseId: 'course-1',
    authorId: 'student-2',
    authorName: 'Hoàng Thị Lan',
    authorRole: 'Sinh viên',
    title: 'Hỏi về bài tập 1',
    content: 'Em không hiểu phần useState trong React, thầy có thể giải thích thêm được không ạ?',
    createdAt: '2025-10-12T15:30:00',
    replies: [
      {
        id: 'reply-2',
        authorId: 'teacher-1',
        authorName: 'Trần Thị Hương',
        authorRole: 'Giảng viên',
        content: 'useState là hook để quản lý state trong functional component. Em xem lại video bài giảng nhé!',
        createdAt: '2025-10-12T16:00:00'
      }
    ]
  }
];

export const COURSE_ENROLLMENTS: { [courseId: string]: string[] } = {
  'course-1': ['student-1', 'student-2', 'student-3', 'student-4', 'student-5', 'student-6', 'student-7', 'student-8'],
  'course-2': ['student-1', 'student-2', 'student-3', 'student-9', 'student-10', 'student-4'],
  'course-3': ['student-1', 'student-5', 'student-6', 'student-7', 'student-8', 'student-9', 'student-10']
};

// Thêm vào file mockData.ts của bạn

export interface QuizQuestion {
  id: string;
  question: string;
  answerA: string;
  answerB: string;
  answerC: string;
  answerD: string;
  correctAnswer: 'A' | 'B' | 'C' | 'D';
}

export interface QuizAssignment {
  id: string;
  courseId: string;
  courseName: string;
  title: string;
  description: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  questions: QuizQuestion[];
}

export interface StudentQuizSubmission {
  id: string;
  quizId: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  answers: {
    questionId: string;
    selectedAnswer: 'A' | 'B' | 'C' | 'D';
  }[];
  score?: number;
  totalQuestions: number;
  status: 'submitted' | 'graded';
}

// Mock Quiz Assignments
// Mock Quiz Assignments - FIXED để khớp với DEMO_COURSES
export const DEMO_QUIZ_ASSIGNMENTS: QuizAssignment[] = [
  {
    id: '9001',
    courseId: 'course-1', // Đổi từ '9007199254740991' thành 'course-1'
    courseName: 'Lập trình Web nâng cao',
    title: 'Kiểm tra giữa kỳ - HTML & CSS',
    description: 'Kiểm tra kiến thức về HTML5 và CSS3 cơ bản',
    dueDate: '2025-01-15T23:59:00',
    createdAt: '2024-12-01T10:00:00',
    updatedAt: '2024-12-01T10:00:00',
    questions: [
      {
        id: 'q001',
        question: 'HTML là viết tắt của gì?',
        answerA: 'Hyper Text Markup Language',
        answerB: 'High Tech Modern Language',
        answerC: 'Home Tool Markup Language',
        answerD: 'Hyperlinks and Text Markup Language',
        correctAnswer: 'A'
      },
      {
        id: 'q002',
        question: 'Thẻ nào dùng để tạo heading lớn nhất trong HTML?',
        answerA: '<heading>',
        answerB: '<h6>',
        answerC: '<h1>',
        answerD: '<head>',
        correctAnswer: 'C'
      },
      {
        id: 'q003',
        question: 'CSS là viết tắt của gì?',
        answerA: 'Computer Style Sheets',
        answerB: 'Cascading Style Sheets',
        answerC: 'Creative Style Sheets',
        answerD: 'Colorful Style Sheets',
        correctAnswer: 'B'
      },
      {
        id: 'q004',
        question: 'Thuộc tính nào dùng để thay đổi màu nền trong CSS?',
        answerA: 'bgcolor',
        answerB: 'color',
        answerC: 'background-color',
        answerD: 'bg-color',
        correctAnswer: 'C'
      },
      {
        id: 'q005',
        question: 'Selector nào có độ ưu tiên cao nhất trong CSS?',
        answerA: 'Element selector',
        answerB: 'Class selector',
        answerC: 'ID selector',
        answerD: 'Inline style',
        correctAnswer: 'D'
      }
    ]
  },
  {
    id: '9002',
    courseId: 'course-1', // Đổi từ '9007199254740991' thành 'course-1'
    courseName: 'Lập trình Web nâng cao',
    title: 'Quiz JavaScript cơ bản',
    description: 'Kiểm tra kiến thức về JavaScript ES6+',
    dueDate: '2025-01-20T23:59:00',
    createdAt: '2024-12-05T14:30:00',
    updatedAt: '2024-12-05T14:30:00',
    questions: [
      {
        id: 'q101',
        question: 'Keyword nào dùng để khai báo biến không thể thay đổi giá trị?',
        answerA: 'var',
        answerB: 'let',
        answerC: 'const',
        answerD: 'final',
        correctAnswer: 'C'
      },
      {
        id: 'q102',
        question: 'Hàm nào dùng để in ra console trong JavaScript?',
        answerA: 'print()',
        answerB: 'console.log()',
        answerC: 'log()',
        answerD: 'echo()',
        correctAnswer: 'B'
      },
      {
        id: 'q103',
        question: 'Toán tử nào kiểm tra bằng cả giá trị và kiểu dữ liệu?',
        answerA: '==',
        answerB: '===',
        answerC: '=',
        answerD: '!=',
        correctAnswer: 'B'
      },
      {
        id: 'q104',
        question: 'Array method nào dùng để thêm phần tử vào cuối mảng?',
        answerA: 'unshift()',
        answerB: 'push()',
        answerC: 'pop()',
        answerD: 'shift()',
        correctAnswer: 'B'
      }
    ]
  },
  {
    id: '9003',
    courseId: 'course-2', // Đổi từ '9007199254740992' thành 'course-2'
    courseName: 'Cơ sở dữ liệu',
    title: 'Kiểm tra SQL cơ bản',
    description: 'Câu hỏi về SQL query và database design',
    dueDate: '2025-01-18T23:59:00',
    createdAt: '2024-12-03T09:00:00',
    updatedAt: '2024-12-03T09:00:00',
    questions: [
      {
        id: 'q201',
        question: 'Lệnh nào dùng để lấy dữ liệu từ database?',
        answerA: 'GET',
        answerB: 'FETCH',
        answerC: 'SELECT',
        answerD: 'RETRIEVE',
        correctAnswer: 'C'
      },
      {
        id: 'q202',
        question: 'PRIMARY KEY có đặc điểm gì?',
        answerA: 'Có thể null',
        answerB: 'Có thể trùng lặp',
        answerC: 'Unique và NOT NULL',
        answerD: 'Chỉ có thể là số',
        correctAnswer: 'C'
      },
      {
        id: 'q203',
        question: 'Câu lệnh nào dùng để xóa tất cả dữ liệu trong bảng?',
        answerA: 'DELETE FROM table',
        answerB: 'REMOVE table',
        answerC: 'DROP table',
        answerD: 'CLEAR table',
        correctAnswer: 'A'
      }
    ]
  },
  {
    id: '9004',
    courseId: 'course-3', // Thêm quiz cho khóa Trí tuệ nhân tạo
    courseName: 'Trí tuệ nhân tạo',
    title: 'Kiểm tra Machine Learning cơ bản',
    description: 'Câu hỏi về thuật toán ML và neural networks',
    dueDate: '2025-01-25T23:59:00',
    createdAt: '2024-12-07T10:00:00',
    updatedAt: '2024-12-07T10:00:00',
    questions: [
      {
        id: 'q301',
        question: 'Thuật toán nào thuộc loại Supervised Learning?',
        answerA: 'K-Means',
        answerB: 'Linear Regression',
        answerC: 'PCA',
        answerD: 'DBSCAN',
        correctAnswer: 'B'
      },
      {
        id: 'q302',
        question: 'Activation function phổ biến trong Neural Networks là?',
        answerA: 'ReLU',
        answerB: 'Linear',
        answerC: 'Polynomial',
        answerD: 'Exponential',
        correctAnswer: 'A'
      },
      {
        id: 'q303',
        question: 'Overfitting xảy ra khi nào?',
        answerA: 'Model quá đơn giản',
        answerB: 'Có quá nhiều data',
        answerC: 'Model học quá tốt trên training data',
        answerD: 'Learning rate quá thấp',
        correctAnswer: 'C'
      }
    ]
  }
];

// Mock Student Quiz Submissions
export const DEMO_QUIZ_SUBMISSIONS: StudentQuizSubmission[] = [
  {
    id: 'sub001',
    quizId: '9001',
    studentId: 's001',
    studentName: 'Nguyễn Văn A',
    submittedAt: '2024-12-10T14:30:00',
    answers: [
      { questionId: 'q001', selectedAnswer: 'A' },
      { questionId: 'q002', selectedAnswer: 'C' },
      { questionId: 'q003', selectedAnswer: 'B' },
      { questionId: 'q004', selectedAnswer: 'C' },
      { questionId: 'q005', selectedAnswer: 'D' }
    ],
    score: 100,
    totalQuestions: 5,
    status: 'graded'
  },
  {
    id: 'sub002',
    quizId: '9001',
    studentId: 's002',
    studentName: 'Trần Thị B',
    submittedAt: '2024-12-10T16:45:00',
    answers: [
      { questionId: 'q001', selectedAnswer: 'A' },
      { questionId: 'q002', selectedAnswer: 'C' },
      { questionId: 'q003', selectedAnswer: 'A' }, // Sai
      { questionId: 'q004', selectedAnswer: 'C' },
      { questionId: 'q005', selectedAnswer: 'C' }  // Sai
    ],
    score: 60,
    totalQuestions: 5,
    status: 'graded'
  },
  {
    id: 'sub003',
    quizId: '9001',
    studentId: 's003',
    studentName: 'Lê Văn C',
    submittedAt: '2024-12-11T10:20:00',
    answers: [
      { questionId: 'q001', selectedAnswer: 'A' },
      { questionId: 'q002', selectedAnswer: 'C' },
      { questionId: 'q003', selectedAnswer: 'B' },
      { questionId: 'q004', selectedAnswer: 'A' }, // Sai
      { questionId: 'q005', selectedAnswer: 'D' }
    ],
    score: 80,
    totalQuestions: 5,
    status: 'graded'
  },
  {
    id: 'sub004',
    quizId: '9002',
    studentId: 's001',
    studentName: 'Nguyễn Văn A',
    submittedAt: '2024-12-12T09:15:00',
    answers: [
      { questionId: 'q101', selectedAnswer: 'C' },
      { questionId: 'q102', selectedAnswer: 'B' },
      { questionId: 'q103', selectedAnswer: 'B' },
      { questionId: 'q104', selectedAnswer: 'B' }
    ],
    totalQuestions: 4,
    status: 'submitted' // Chưa chấm
  },
  {
    id: 'sub005',
    quizId: '9002',
    studentId: 's004',
    studentName: 'Phạm Thị D',
    submittedAt: '2024-12-12T11:30:00',
    answers: [
      { questionId: 'q101', selectedAnswer: 'C' },
      { questionId: 'q102', selectedAnswer: 'B' },
      { questionId: 'q103', selectedAnswer: 'A' }, // Sai
      { questionId: 'q104', selectedAnswer: 'B' }
    ],
    score: 75,
    totalQuestions: 4,
    status: 'graded'
  }
];

// Helper function: Tự động chấm điểm quiz
export function autoGradeQuiz(
  quizAssignment: QuizAssignment,
  submission: StudentQuizSubmission
): number {
  let correctCount = 0;
  
  submission.answers.forEach(answer => {
    const question = quizAssignment.questions.find(q => q.id === answer.questionId);
    if (question && question.correctAnswer === answer.selectedAnswer) {
      correctCount++;
    }
  });
  
  const totalQuestions = quizAssignment.questions.length;
  const score = Math.round((correctCount / totalQuestions) * 100);
  
  return score;
}

// Helper function: Lấy thống kê quiz
export function getQuizStats(quizId: string) {
  const submissions = DEMO_QUIZ_SUBMISSIONS.filter(s => s.quizId === quizId);
  const gradedSubmissions = submissions.filter(s => s.status === 'graded');
  
  const totalSubmissions = submissions.length;
  const gradedCount = gradedSubmissions.length;
  const pendingCount = totalSubmissions - gradedCount;
  
  const averageScore = gradedSubmissions.length > 0
    ? gradedSubmissions.reduce((sum, s) => sum + (s.score || 0), 0) / gradedSubmissions.length
    : 0;
  
  return {
    totalSubmissions,
    gradedCount,
    pendingCount,
    averageScore: Math.round(averageScore)
  };
}