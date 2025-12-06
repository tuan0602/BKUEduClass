// src/lib/enrollment.ts
import api from "./axios";
import { Course } from "./courseService";
export interface EnrollmentResponse {
  status: number;
  message: string;
  data: null;
  error: null;
}

export interface EnrollmentRequest {
  enrollmentCode: string;
}

/**
 * Student enrolls in a course using enrollment code
 * POST /api/student/courses/enroll
 * @param enrollmentCode - The course enrollment code
 */
export const enrollInCourse = async (enrollmentCode: string): Promise<EnrollmentResponse> => {
  try {
    const response = await api.post<EnrollmentResponse>(
      "/student/courses/enroll",
      null,
      {
        params: { enrollmentCode }
      }
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

/**
 * Get courses that student has enrolled (ACCEPTED status)
 * GET /api/admin/enrolls?status=ACCEPTED
 */
export const getStudentCourses = async (): Promise<CourseEnrollment[]> => {
  try {
    const response = await api.get<ApiResponse<ResultPaginationDTO>>(
      "/admin/enrolls",
      {
        params: {
          status: "ACCEPTED",
          page: 0,
          size: 100
        }
      }
    );
    return response.data.data.result || [];
  } catch (error: any) {
    throw error.response?.data || error;
  }
};
/**
 * Admin accepts an enrollment request
 * PUT /api/courses/enroll/{id}/accept
 * @param enrollmentId - The enrollment ID to accept
 */
export const acceptEnrollment = async (enrollmentId: number): Promise<EnrollmentResponse> => {
  try {
    const response = await api.put<EnrollmentResponse>(
      `/courses/enroll/${enrollmentId}/accept`
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

/**
 * Admin refuses an enrollment request
 * PUT /api/courses/enroll/{id}/refuse
 * @param enrollmentId - The enrollment ID to refuse
 */
export const refuseEnrollment = async (enrollmentId: number): Promise<EnrollmentResponse> => {
  try {
    const response = await api.put<EnrollmentResponse>(
      `/courses/enroll/${enrollmentId}/refuse`
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

/**
 * Utility function to handle enrollment actions (accept/refuse)
 * @param enrollmentId - The enrollment ID
 * @param action - 'accept' or 'refuse'
 */
export const handleEnrollmentAction = async (
  enrollmentId: number,
  action: 'accept' | 'refuse'
): Promise<EnrollmentResponse> => {
  if (action === 'accept') {
    return acceptEnrollment(enrollmentId);
  } else {
    return refuseEnrollment(enrollmentId);
  }
};

/**
 * Get all pending enrollment requests (Admin only)
 * GET /api/admin/enrolls?status=PENDING
 */
export const getPendingEnrollments = async (): Promise<CourseEnrollment[]> => {
  try {
    const response = await api.get<ApiResponse<ResultPaginationDTO>>(
      "/admin/enrolls",
      {
        params: {
          status: "PENDING",
          page: 0,
          size: 100 // Get all pending enrollments
        }
      }
    );
    return response.data.data.result || [];
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

/**
 * Get enrollments with filters and pagination (Admin only)
 * GET /api/admin/enrolls
 * @param params - Filter parameters
 */
export const getEnrollments = async (params?: {
  page?: number;
  size?: number;
  courseName?: string;
  courseCode?: string;
  studentName?: string;
  status?: EnrollmentStatus;
}): Promise<ResultPaginationDTO> => {
  try {
    const response = await api.get<ApiResponse<ResultPaginationDTO>>(
      "/admin/enrolls",
      { params }
    );
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

/**
 * Get enrollments by course ID (if needed in future)
 * This endpoint might need to be added in backend
 */
export const getCourseEnrollments = async (courseId: number): Promise<CourseEnrollment[]> => {
  try {
    const response = await api.get<ApiResponse<ResultPaginationDTO>>(
      "/admin/enrolls",
      {
        params: {
          courseId,
          page: 0,
          size: 100
        }
      }
    );
    return response.data.data.result || [];
  } catch (error: any) {
    throw error.response?.data || error;
  }
};


// Types for Course Enrollment Entity
export enum EnrollmentStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED"
}

export interface CourseEnrollment {
  id: number;
  course: {
    id: number;
    name: string;
    code: string;
  };
  student: {
    id: number;
    email: string;
    name: string;
  };
  enrolledAt: string;
  status: EnrollmentStatus;
}

export interface ResultPaginationDTO {
  meta: {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalElements: number;
  };
  result: CourseEnrollment[];
}

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
  error: any;
}

/**
 * Get all enrollments for teacher's courses
 * GET /api/admin/enrolls
 */
export const getTeacherEnrollments = async (): Promise<ResultPaginationDTO> => {
  try {
    const response = await api.get<ApiResponse<ResultPaginationDTO>>(
      "/admin/enrolls",
      {
        params: {
          page: 0,
          size: 1000 // Lấy nhiều để đảm bảo có đủ data
        }
      }
    );
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};