// src/services/assignmentService.ts
import api from '../lib/axios';

export enum Answer {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D'
}

export enum StatusAssignment {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CLOSED = 'CLOSED'
}

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
  description: string;
  dueDate: string; // ISO 8601 format: "2024-12-31T23:59:00"
  status?: StatusAssignment;
  question: QuestionDTO[];
}

export interface Assignment {
  id: number;
  courseId: number;
  title: string;
  description: string;
  dueDate: string;
  status: StatusAssignment;
  createdAt: string;
  updatedAt: string;
  question?: QuestionDTO[];
}

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  error: any;
}

export interface PaginationMeta {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
}

export interface ResultPaginationDTO {
  meta: PaginationMeta;
  result: Assignment[];
}

// ============== ASSIGNMENT SERVICE ==============

/**
 * Tạo assignment mới (Quiz hoặc bài tập thông thường)
 */
export const createAssignment = async (data: CreateAssignmentDTO): Promise<Assignment> => {
  const response = await api.post<ApiResponse<Assignment>>('/teacher/assignments', data);
  return response.data.data;
};

/**
 * Lấy danh sách assignment theo courseId (có phân trang)
 */
export const getAssignmentsByCourse = async (
  courseId: number,
  page: number = 0,
  size: number = 10,
  title?: string
): Promise<ResultPaginationDTO> => {
  const params: any = { page, size };
  if (title) params.title = title;
  
  const response = await api.get<ApiResponse<ResultPaginationDTO>>(
    `/assignments/course/${courseId}`,
    { params }
  );
  return response.data.data;
};

/**
 * Lấy chi tiết assignment (cho giáo viên)
 */
export const getAssignmentDetail = async (assignmentId: number): Promise<Assignment> => {
  const response = await api.get<ApiResponse<Assignment>>(
    `/teacher/assignments/${assignmentId}`
  );
  return response.data.data;
};

/**
 * Cập nhật assignment
 */
export const updateAssignment = async (
  assignmentId: number,
  data: CreateAssignmentDTO
): Promise<Assignment> => {
  const response = await api.put<ApiResponse<Assignment>>(
    `/teacher/assignments/${assignmentId}`,
    data
  );
  return response.data.data;
};

/**
 * Xóa assignment
 */
export const deleteAssignment = async (assignmentId: number): Promise<void> => {
  await api.delete(`/teacher/assignments/${assignmentId}`);
};

/**
 * Lấy chi tiết assignment (cho sinh viên)
 */
export const getAssignmentDetailForStudent = async (assignmentId: number): Promise<any> => {
  const response = await api.get<ApiResponse<any>>(
    `/student/assignments/${assignmentId}`
  );
  return response.data.data;
};