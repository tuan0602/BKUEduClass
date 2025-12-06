// src/hooks/useAssignment.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import assignmentService, {
  GetAssignmentsParams,
  CreateAssignmentDTO,
  Assignment,
  AssignmentForStudentDTO,
  ResultPaginationDTO,
} from "../lib/assignmentService";
import { toast } from "sonner";

// ===========================
// QUERY KEYS
// ===========================
export const assignmentKeys = {
  all: ["assignments"] as const,
  lists: () => [...assignmentKeys.all, "list"] as const,
  list: (courseId: number, params: GetAssignmentsParams) =>
    [...assignmentKeys.lists(), courseId, params] as const,
  details: () => [...assignmentKeys.all, "detail"] as const,
  detail: (id: number) => [...assignmentKeys.details(), id] as const,
  studentDetails: () => [...assignmentKeys.all, "student-detail"] as const,
  studentDetail: (id: number) => [...assignmentKeys.studentDetails(), id] as const,
};

// ===========================
// QUERY HOOKS
// ===========================

/**
 * Hook để lấy danh sách assignments theo courseId
 * @param courseId - ID của course
 * @param params - Filter parameters (page, size, title)
 * @param enabled - Có tự động fetch không (default: true)
 */
export const useAssignmentsByCourse = (
  courseId: number,
  params?: GetAssignmentsParams,
  enabled: boolean = true
) => {
  const queryParams = params || {};
  
  const query = useQuery<ResultPaginationDTO, Error>({
    queryKey: assignmentKeys.list(courseId, queryParams),
    queryFn: () => assignmentService.getAssignmentsByCourseId(courseId, queryParams),
    enabled: enabled && courseId > 0,
    staleTime: 1000 * 60 * 3,
  });

  return query;
};

/**
 * Hook để lấy chi tiết assignment cho TEACHER
 * @param assignmentId - ID của assignment
 * @param enabled - Có tự động fetch không (default: true)
 */
export const useAssignmentDetail = (
  assignmentId: number,
  enabled: boolean = true
) => {
  return useQuery<Assignment, Error>({
    queryKey: assignmentKeys.detail(assignmentId),
    queryFn: () => assignmentService.getAssignmentDetail(assignmentId),
    enabled: enabled && assignmentId > 0,
    staleTime: 1000 * 60 * 3,
  });
};

/**
 * Hook để lấy chi tiết assignment cho STUDENT (không có đáp án đúng)
 * @param assignmentId - ID của assignment
 * @param enabled - Có tự động fetch không (default: true)
 */
export const useAssignmentDetailForStudent = (
  assignmentId: number,
  enabled: boolean = true
) => {
  return useQuery<AssignmentForStudentDTO, Error>({
    queryKey: assignmentKeys.studentDetail(assignmentId),
    queryFn: () => assignmentService.getAssignmentDetailForStudent(assignmentId),
    enabled: enabled && assignmentId > 0,
    staleTime: 1000 * 60 * 3,
  });
};

// ===========================
// MUTATION HOOKS
// ===========================

/**
 * Hook để tạo assignment mới (TEACHER only)
 */
export const useCreateAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation<Assignment, Error, CreateAssignmentDTO>({
    mutationFn: (assignmentData: CreateAssignmentDTO) =>
      assignmentService.createAssignment(assignmentData),
    onSuccess: (data, variables) => {
      // Invalidate assignments list của course
      queryClient.invalidateQueries({
        queryKey: assignmentKeys.lists(),
      });
      toast.success("Tạo bài tập thành công!");
    },
    onError: (error) => {
      toast.error(error.message || "Tạo bài tập thất bại");
      console.error("❌ Create assignment error:", error);
    },
  });
};

/**
 * Hook để update assignment (TEACHER only)
 */
export const useUpdateAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation<
    Assignment,
    Error,
    { assignmentId: number; assignmentData: CreateAssignmentDTO }
  >({
    mutationFn: ({ assignmentId, assignmentData }) =>
      assignmentService.updateAssignment(assignmentId, assignmentData),
    onSuccess: (data, variables) => {
      // Invalidate assignments lists
      queryClient.invalidateQueries({ queryKey: assignmentKeys.lists() });
      // Invalidate assignment detail
      queryClient.invalidateQueries({
        queryKey: assignmentKeys.detail(variables.assignmentId),
      });
      toast.success("Cập nhật bài tập thành công!");
    },
    onError: (error) => {
      toast.error(error.message || "Cập nhật bài tập thất bại");
      console.error("❌ Update assignment error:", error);
    },
  });
};

/**
 * Hook để xóa assignment (TEACHER only)
 */
export const useDeleteAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: (assignmentId: number) =>
      assignmentService.deleteAssignment(assignmentId),
    onSuccess: () => {
      // Invalidate tất cả assignment lists
      queryClient.invalidateQueries({ queryKey: assignmentKeys.lists() });
      toast.success("Xóa bài tập thành công!");
    },
    onError: (error) => {
      toast.error(error.message || "Xóa bài tập thất bại");
      console.error("❌ Delete assignment error:", error);
    },
  });
};

// ===========================
// UTILITY HOOKS
// ===========================

/**
 * Hook để prefetch assignment detail (tối ưu UX khi hover)
 * @param assignmentId - ID của assignment cần prefetch
 */
export const usePrefetchAssignmentDetail = () => {
  const queryClient = useQueryClient();

  return (assignmentId: number, isStudent: boolean = false) => {
    if (isStudent) {
      queryClient.prefetchQuery({
        queryKey: assignmentKeys.studentDetail(assignmentId),
        queryFn: () =>
          assignmentService.getAssignmentDetailForStudent(assignmentId),
        staleTime: 1000 * 60 * 3,
      });
    } else {
      queryClient.prefetchQuery({
        queryKey: assignmentKeys.detail(assignmentId),
        queryFn: () => assignmentService.getAssignmentDetail(assignmentId),
        staleTime: 1000 * 60 * 3,
      });
    }
  };
};

// ===========================
// FETCHER FUNCTIONS
// ===========================
export const fetchAssignmentsByCourse = async (
  courseId: number,
  params: GetAssignmentsParams = {}
) => {
  return assignmentService.getAssignmentsByCourseId(courseId, params);
};