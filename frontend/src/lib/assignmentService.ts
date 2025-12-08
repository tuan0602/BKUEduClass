// src/lib/assignmentService.ts
import api from "./axios";

// ===========================
// ENUMS
// ===========================

export enum StatusAssignment {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
}

export enum Answer {
  A = "A",
  B = "B",
  C = "C",
  D = "D",
}

// ===========================
// INTERFACES / TYPES
// ===========================

export interface QuestionDTO {
  question: string;
  answerA: string;
  answerB: string;
  answerC: string;
  answerD: string;
  correctAnswer: Answer;
}

export interface CreateAssignmentDTO {
  courseId: number;
  title: string;
  description?: string;
  dueDate: string; // ISO format: "2024-12-31T23:59:59"
  status: StatusAssignment;
  question: QuestionDTO[];
}

export interface Assignment {
  id: number;
  title: string;
  description?: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  status: StatusAssignment;

  // ⭐ backend trả về list câu hỏi → phải khai báo
  questions: {
    id: number;
    question: string;
    answerA: string;
    answerB: string;
    answerC: string;
    answerD: string;
    correctAnswer: Answer;
  }[];
}

export interface QuestionForStudentDTO {
  questionId: number;
  question: string;
  answerA: string;
  answerB: string;
  answerC: string;
  answerD: string;
}

export interface AssignmentForStudentDTO {
  id: number;
  title: string;
  description?: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  question: QuestionForStudentDTO[];
}

export interface AssignmentListItem {
  id: number;
  title: string;
  description?: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  status: StatusAssignment;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
}

export interface ResultPaginationDTO {
  meta: PaginationMeta;
  result: AssignmentListItem[];
}

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  error: string | null;
}

export interface GetAssignmentsParams {
  page?: number;
  size?: number;
  sort?: string;
  title?: string;
}

// ===========================
// ASSIGNMENT SERVICE
// ===========================

const assignmentService = {
  /**
   * POST /api/teacher/assignments
   * Tạo assignment mới (TEACHER only)
   * Requires: Bearer Token + TEACHER role
   */
  createAssignment: async (
    assignmentData: CreateAssignmentDTO
  ): Promise<Assignment> => {
    const response = await api.post<ApiResponse<Assignment>>(
      "/teacher/assignments",
      assignmentData
    );
    return response.data.data;
  },

  /**
   * GET /api/assignments/course/{courseId}
   * Lấy danh sách assignments theo courseId với pagination
   * Cho cả TEACHER và STUDENT
   */
  getAssignmentsByCourseId: async (
    courseId: number,
    params?: GetAssignmentsParams
  ): Promise<ResultPaginationDTO> => {
    const response = await api.get<ApiResponse<ResultPaginationDTO>>(
      `/assignments/course/${courseId}`,
      {
        params: {
          page: params?.page || 0,
          size: params?.size || 10,
          sort: params?.sort || "createdAt,asc",
          title: params?.title,
        },
      }
    );
    return response.data.data;
  },

  /**
   * GET /api/teacher/assignments/{assignmentId}
   * Lấy chi tiết assignment (TEACHER only)
   * Requires: Bearer Token + TEACHER role
   */
  getAssignmentDetail: async (assignmentId: number): Promise<Assignment> => {
    const response = await api.get<ApiResponse<Assignment>>(
      `/teacher/assignments/${assignmentId}`
    );
    return response.data.data;
  },

  /**
   * GET /api/student/assignments/{assignmentId}
   * Lấy chi tiết assignment cho STUDENT (không có đáp án đúng)
   * Requires: Bearer Token + STUDENT role
   */
  getAssignmentDetailForStudent: async (
    assignmentId: number
  ): Promise<AssignmentForStudentDTO> => {
    const response = await api.get<ApiResponse<AssignmentForStudentDTO>>(
      `/student/assignments/${assignmentId}`
    );
    return response.data.data;
  },

  /**
   * PUT /api/teacher/assignments/{assignmentId}
   * Cập nhật assignment (TEACHER only)
   * Requires: Bearer Token + TEACHER role
   */
  updateAssignment: async (
    assignmentId: number,
    assignmentData: CreateAssignmentDTO
  ): Promise<Assignment> => {
    const response = await api.put<ApiResponse<Assignment>>(
      `/teacher/assignments/${assignmentId}`,
      assignmentData
    );
    return response.data.data;
  },

  /**
   * DELETE /api/teacher/assignments/{assignmentId}
   * Xóa assignment (TEACHER only)
   * Requires: Bearer Token + TEACHER role
   */
  deleteAssignment: async (assignmentId: number): Promise<void> => {
  console.log('🗑️ Calling DELETE API for assignment:', assignmentId);
  console.log('🔗 URL:', `/teacher/assignments/${assignmentId}`);
  
  try {
    const response = await api.delete<ApiResponse<void>>(
      `/teacher/assignments/${assignmentId}`
    );
    console.log('✅ Delete response:', response);
  } catch (error: any) {
    console.error('❌ Delete API error:', error);
    console.error('❌ Error response:', error.response);
    console.error('❌ Status:', error.response?.status);
    console.error('❌ Data:', error.response?.data);
    throw error;
  }
},

  /**
   * GET /api/student/assignments
   * Lấy danh sách assignments của student hiện tại
   * Requires: Bearer Token + STUDENT role
   */
  getStudentAssignments: async (params?: GetAssignmentsParams): Promise<DashboardAssignment[]> => {
    const response = await api.get<ApiResponse<{ result: DashboardAssignment[] }>>(
      `/student/assignments`,
      {
        params: {
          page: params?.page || 0,
          size: params?.size || 100,
          sort: params?.sort || "dueDate,asc",
        },
      }
    );
    return response.data.data.result || [];
  },
};

export interface DashboardAssignment extends AssignmentListItem {
  courseName?: string;
  submitted?: boolean; // Đã nộp bài hay chưa
  score?: number; // Điểm số nếu đã được chấm
}

export default assignmentService;