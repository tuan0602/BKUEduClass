// src/hooks/useCourse.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import courseService, {
  GetCoursesParams,
  CourseDTO,
  ResultPaginationDTO,
  ReponseDetailCourseDTO,
  Course,
  ResUserDTO,
  Role
} from "../lib/courseService";
import { toast } from "sonner";

// ===========================
// QUERY KEYS
// ===========================
export const courseKeys = {
  all: ["courses"] as const,
  lists: () => [...courseKeys.all, "list"] as const,
  list: (params: GetCoursesParams) => [...courseKeys.lists(), params] as const,
  details: () => [...courseKeys.all, "detail"] as const,
  detail: (id: number) => [...courseKeys.details(), id] as const,
};

// ===========================
// QUERY HOOKS
// ===========================

/**
 * Hook để lấy danh sách courses với pagination & filter
 * @param params - Filter parameters (page, size, courseName, teacherName, courseCode)
 */
export const useCourses = (params?: GetCoursesParams) => {
  const query = useQuery<ResultPaginationDTO, Error>({
    queryKey: courseKeys.list(params || {}),
    queryFn: () => courseService.getCourses(params),
    staleTime: 1000 * 60 * 5,
  });

  console.log("📌 useCourses -> data:", query.data);
  console.log("📌 useCourses -> error:", query.error);

  return query;
};

/**
 * Hook để lấy chi tiết course
 * @param courseId - ID của course
 * @param enabled - Có tự động fetch không (default: true)
 */
export const useCourseDetail = (courseId: number, enabled: boolean = true) => {
  return useQuery<ReponseDetailCourseDTO, Error>({
    queryKey: courseKeys.detail(courseId),
    queryFn: () => courseService.getCourseDetail(courseId),
    enabled: enabled && courseId > 0,
    staleTime: 1000 * 60 * 3, // Cache 3 phút
  });
};

// ===========================
// MUTATION HOOKS
// ===========================

/**
 * Hook để tạo course mới (ADMIN only)
 */
export const useCreateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation<Course, Error, CourseDTO>({
    mutationFn: (courseData: CourseDTO) => courseService.createCourse(courseData),
    onSuccess: () => {
      // Invalidate tất cả course lists để refetch
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
      toast.success("Course created successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create course");
    },
  });
};

/**
 * Hook để update course (ADMIN only)
 */
export const useUpdateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation<Course, Error, { courseId: number; courseData: CourseDTO }>({
    mutationFn: ({ courseId, courseData }) =>
      courseService.updateCourse(courseId, courseData),
    onSuccess: (data, variables) => {
      // Invalidate course lists
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
      // Invalidate course detail
      queryClient.invalidateQueries({
        queryKey: courseKeys.detail(variables.courseId),
      });
      toast.success("Course updated successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update course");
    },
  });
};

/**
 * Hook để xóa course (ADMIN only)
 */
export const useDeleteCourse = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: (courseId: number) => courseService.deleteCourse(courseId),
    onSuccess: () => {
      // Invalidate tất cả course lists
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
      toast.success("Course deleted successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete course");
    },
  });
};

// ===========================
// UTILITY HOOKS
// ===========================

/**
 * Hook để prefetch course detail (tối ưu UX khi hover)
 * @param courseId - ID của course cần prefetch
 */
export const usePrefetchCourseDetail = () => {
  const queryClient = useQueryClient();

  return (courseId: number) => {
    queryClient.prefetchQuery({
      queryKey: courseKeys.detail(courseId),
      queryFn: () => courseService.getCourseDetail(courseId),
      staleTime: 1000 * 60 * 3,
    });
  };
};