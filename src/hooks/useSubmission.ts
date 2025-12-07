// src/hooks/useSubmission.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import submissionService, {
  SubmitSubmissionDTO,
  ReponseDetailSubmissionDTO,
} from "../lib/submissionService";
import { toast } from "sonner";

// ===========================
// QUERY KEYS
// ===========================
export const submissionKeys = {
  all: ["submissions"] as const,
  details: () => [...submissionKeys.all, "detail"] as const,
  detail: (id: number) => [...submissionKeys.details(), id] as const,
  byAssignment: (assignmentId: number) => [
    ...submissionKeys.all,
    "assignment",
    assignmentId,
  ] as const,
};

// ===========================
// QUERY HOOKS
// ===========================

/**
 * Lấy chi tiết submission theo submissionId
 */
export const useSubmissionDetail = (
  submissionId: number,
  enabled: boolean = true
) => {
  return useQuery<ReponseDetailSubmissionDTO, Error>({
    queryKey: submissionKeys.detail(submissionId),
    queryFn: () => submissionService.getSubmissionById(submissionId),
    enabled: enabled && submissionId > 0,
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Lấy submission theo assignmentId
 * Nếu chưa nộp → trả về DTO empty() từ backend
 */
export const useSubmissionByAssignment = (
  assignmentId: number,
  enabled: boolean = true
) => {
  return useQuery<ReponseDetailSubmissionDTO, Error>({
    queryKey: submissionKeys.byAssignment(assignmentId),
    queryFn: async () => {
      try {
        return await submissionService.getSubmissionByAssignmentId(assignmentId);
      } catch (error: any) {
        // Backend sẽ trả empty() nên FE không cần tự tạo null nữa
        throw error;
      }
    },
    enabled: enabled && assignmentId > 0,
    staleTime: 1000 * 60 * 3,
    retry: false,
  });
};

/**
 * Check đã nộp hay chưa
 */
export const useCheckSubmissionExists = (
  assignmentId: number,
  enabled: boolean = true
) => {
  return useQuery<boolean, Error>({
    queryKey: [...submissionKeys.byAssignment(assignmentId), "exists"],
    queryFn: () => submissionService.checkSubmissionExists(assignmentId),
    enabled: enabled && assignmentId > 0,
    staleTime: 1000 * 60 * 3,
  });
};

// ===========================
// MUTATION HOOKS
// ===========================

/**
 * Nộp bài
 * Backend trả về void → FE không đọc data
 */
export const useSubmitSubmission = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, SubmitSubmissionDTO>({
    mutationFn: (submissionData: SubmitSubmissionDTO) =>
      submissionService.submitSubmission(submissionData),

    onSuccess: (_data, variables) => {
      // Invalidate submission của assignment
      queryClient.invalidateQueries({
        queryKey: submissionKeys.byAssignment(variables.assignmentId),
      });

      toast.success("Nộp bài thành công!");
    },

    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || error.message || "Nộp bài thất bại";
      toast.error(errorMessage);
      console.error("❌ Submit submission error:", error);
    },
  });
};

// ===========================
// UTILITY HOOKS
// ===========================

/**
 * Prefetch submission detail
 */
export const usePrefetchSubmissionDetail = () => {
  const queryClient = useQueryClient();

  return (submissionId: number) => {
    queryClient.prefetchQuery({
      queryKey: submissionKeys.detail(submissionId),
      queryFn: () => submissionService.getSubmissionById(submissionId),
      staleTime: 1000 * 60 * 5,
    });
  };
};

/**
 * Prefetch submission by assignment
 */
export const usePrefetchSubmissionByAssignment = () => {
  const queryClient = useQueryClient();

  return (assignmentId: number) => {
    queryClient.prefetchQuery({
      queryKey: submissionKeys.byAssignment(assignmentId),
      queryFn: () =>
        submissionService.getSubmissionByAssignmentId(assignmentId),
      staleTime: 1000 * 60 * 3,
    });
  };
};
