// src/lib/reportService.ts
import api from "./axios";

export interface StudentReportData {
  numberCourse: number;
  numberAssignments: number;
  numberSubmissions: number;
  submissionRate: number;
  averageGrade: number;
}

export interface ApiResponse<T> {
  statusCode: string;
  message: string;
  data: T;
  error: string | null;
  timestamp: string;
}

export interface CourseProgressData {
  AverageGrade: number;
  numberCourse: number;
  numberAssignments: number;
  numberSubmissions: number;
  submissionRate: number;
}

/**
 * Get student's learning report
 * GET /report/student/me
 */
export const getStudentReport = async (): Promise<StudentReportData> => {
  try {
    // Sử dụng endpoint đúng mà không có /api prefix
    const token = localStorage.getItem("token");
    const response = await api.get<ApiResponse<StudentReportData>>('/report/student/me', {
      baseURL: 'http://localhost:8080', // Override baseURL để bỏ /api
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching student report:', error);
    throw error;
  }
};

/**
 * Get student's progress for a specific course
 * GET /report/student/course/{id}/me
 */
export const getStudentCourseProgress = async (courseId: number): Promise<CourseProgressData> => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.get<ApiResponse<CourseProgressData>>(`/report/student/course/${courseId}/me`, {
      baseURL: 'http://localhost:8080',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching course ${courseId} progress:`, error);
    throw error;
  }
};

