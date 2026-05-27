// src/lib/courseService.ts
import api from "../lib/axios";

// ===========================
// ENUMS
// ===========================

export enum CourseStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  ARCHIVED = "ARCHIVED",
}

export enum Role {
  ADMIN = "ADMIN",
  TEACHER = "TEACHER",
  STUDENT = "STUDENT",
}

// ===========================
// INTERFACES / TYPES
// ===========================

export interface ResUserDTO {
  userId: string;
  email: string;
  name: string;
  role: Role;
  avatar?: string;
  phone?: string;
  locked: boolean;
  createdAt: string;
  department?: string;  // Teacher
  major?: string;       // Student
  year?: number;        // Student
  className?: string;   // Student
}

export interface Course {
  id: number;
  name: string;
  description?: string;
  code: string;
  teacher?: ResUserDTO;
  status: CourseStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CourseDTO {
  name: string;
  description?: string;
  code: string;
  teacherId: string;
  status: CourseStatus;
}

export interface ReponseCourseDTO {
  id: number;
  name: string;
  description?: string;
  code: string;
  teacher?: ResUserDTO;
  status: string;
  studentCount: number;
  assignmentCount: number;
}

export interface CourseDetailData {
  totalAssignments: number;
  submittedAssignments: number;
  documentsCount: number;
  studentsCount: number;
  averageGrade: number;
  discussionsCount: number;
  submissionRate: number;
}

export interface ReponseDetailCourseDTO {
  course: Course;
  teacher?: ResUserDTO;
  students: ResUserDTO[];
  data: CourseDetailData;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
}

export interface ResultPaginationDTO {
  meta: PaginationMeta;
  result: ReponseCourseDTO[];
}

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  error: string | null;
}

export interface GetCoursesParams {
  page?: number;
  size?: number;
  sort?: string;
  courseName?: string;
  teacherName?: string;
  courseCode?: string;
}

// ===========================
// COURSE SERVICE
// ===========================

const courseService = {
  /**
   * GET /api/courses
   * Lấy danh sách courses với pagination và filter
   * Cho cả teacher, student, admin
   */
  getCourses: async (params?: GetCoursesParams): Promise<ResultPaginationDTO> => {
    const response = await api.get<ApiResponse<ResultPaginationDTO>>("/courses", {
      params: {
        page: params?.page || 0,
        size: params?.size || 10,
        sort: params?.sort || "createdAt,asc",
        courseName: params?.courseName,
        teacherName: params?.teacherName,
        courseCode: params?.courseCode,
      },
    });
    return response.data.data;
  },

  /**
   * GET /api/courses/{courseId}
   * Lấy chi tiết course
   * Cho cả teacher, student, admin
   */
  getCourseDetail: async (courseId: number): Promise<ReponseDetailCourseDTO> => {
    const response = await api.get<ApiResponse<ReponseDetailCourseDTO>>(
      `/courses/${courseId}`
    );
    return response.data.data;
  },

  /**
   * POST /api/admin/courses
   * Tạo course mới (ADMIN only)
   * Requires: Bearer Token + ADMIN role
   */
  createCourse: async (courseData: CourseDTO): Promise<Course> => {
    const response = await api.post<ApiResponse<Course>>("/admin/courses", courseData);
    return response.data.data;
  },

  /**
   * PUT /api/admin/courses/{courseId}
   * Cập nhật course (ADMIN only)
   * Requires: Bearer Token + ADMIN role
   */
  updateCourse: async (courseId: number, courseData: CourseDTO): Promise<Course> => {
    const response = await api.put<ApiResponse<Course>>(
      `/admin/courses/${courseId}`,
      courseData
    );
    return response.data.data;
  },

  /**
   * DELETE /api/courses/{courseId}
   * Xóa course (ADMIN only)
   * Requires: Bearer Token + ADMIN role
   */
  deleteCourse: async (courseId: number): Promise<void> => {
    await api.delete<ApiResponse<void>>(`/courses/${courseId}`);
  },
};

export default courseService;