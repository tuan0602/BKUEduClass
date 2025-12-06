// src/hooks/useEnrollment.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  enrollInCourse,
  acceptEnrollment,
  refuseEnrollment,
  handleEnrollmentAction,
  getPendingEnrollments,
  getCourseEnrollments,
  EnrollmentResponse,
  getStudentCourses 
} from '../lib/enrollment';

/**
 * Hook to fetch pending enrollment requests (Admin only)
 */
export const usePendingEnrollments = () => {
  return useQuery({
    queryKey: ['pending-enrollments'],
    queryFn: getPendingEnrollments,
    refetchInterval: 30000, // Auto refetch every 30 seconds
    staleTime: 10000, // Consider data stale after 10 seconds
  });
};


export const useStudentCourses = () => {
  return useQuery({
    queryKey: ['student-courses'],
    queryFn: getStudentCourses,
  });
};

/**
 * Hook to fetch enrollments by course ID
 */
export const useCourseEnrollments = (courseId: number) => {
  return useQuery({
    queryKey: ['course-enrollments', courseId],
    queryFn: () => getCourseEnrollments(courseId),
    enabled: !!courseId,
  });
};

/**
 * Hook for student to enroll in a course
 */
export const useEnrollInCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (enrollmentCode: string) => enrollInCourse(enrollmentCode),
    onSuccess: (data) => {
      toast.success('Enrollment Request Sent', {
        description: data.message || 'Your enrollment request has been submitted successfully',
      });
      // Invalidate courses list to show pending status
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['my-courses'] });
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
      queryClient.invalidateQueries({ queryKey: ['pending-enrollments'] });
    },
    onError: (error: any) => {
      const errorMessage = error.message || 'Failed to enroll in course';
      toast.error('Enrollment Failed', {
        description: errorMessage,
      });
    },
  });
};

/**
 * Hook for admin to accept enrollment request
 */
export const useAcceptEnrollment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (enrollmentId: number) => acceptEnrollment(enrollmentId),
    onSuccess: (data, enrollmentId) => {
      toast.success('Enrollment Accepted', {
        description: data.message || 'Student has been enrolled successfully',
      });
      // Invalidate enrollment lists
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
      queryClient.invalidateQueries({ queryKey: ['pending-enrollments'] });
      queryClient.invalidateQueries({ queryKey: ['course-students'] });
      queryClient.invalidateQueries({ queryKey: ['course-detail'] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
    onError: (error: any) => {
      const errorMessage = error.message || 'Failed to accept enrollment';
      toast.error('Action Failed', {
        description: errorMessage,
      });
    },
  });
};

/**
 * Hook for admin to refuse enrollment request
 */
export const useRefuseEnrollment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (enrollmentId: number) => refuseEnrollment(enrollmentId),
    onSuccess: (data, enrollmentId) => {
      toast.success('Enrollment Refused', {
        description: data.message || 'Enrollment request has been rejected',
      });
      // Invalidate enrollment lists
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
      queryClient.invalidateQueries({ queryKey: ['pending-enrollments'] });
    },
    onError: (error: any) => {
      const errorMessage = error.message || 'Failed to refuse enrollment';
      toast.error('Action Failed', {
        description: errorMessage,
      });
    },
  });
};

/**
 * Hook for admin to handle enrollment action (accept or refuse)
 */
export const useHandleEnrollmentAction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      enrollmentId, 
      action 
    }: { 
      enrollmentId: number; 
      action: 'accept' | 'refuse' 
    }) => handleEnrollmentAction(enrollmentId, action),
    onSuccess: (data, variables) => {
      const isAccept = variables.action === 'accept';
      toast.success(
        isAccept ? 'Enrollment Accepted' : 'Enrollment Refused',
        {
          description: data.message,
        }
      );
      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
      queryClient.invalidateQueries({ queryKey: ['pending-enrollments'] });
      queryClient.invalidateQueries({ queryKey: ['course-students'] });
      queryClient.invalidateQueries({ queryKey: ['course-detail'] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
    onError: (error: any) => {
      const errorMessage = error.message || 'Failed to process enrollment';
      toast.error('Action Failed', {
        description: errorMessage,
      });
    },
  });
};

/**
 * Hook with optimistic updates for better UX
 */
export const useEnrollInCourseOptimistic = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (enrollmentCode: string) => enrollInCourse(enrollmentCode),
    onMutate: async (enrollmentCode) => {
      // Show loading toast
      toast.loading('Sending enrollment request...');
    },
    onSuccess: (data) => {
      toast.dismiss();
      toast.success('Enrollment Request Sent', {
        description: data.message || 'Your enrollment request has been submitted successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['my-courses'] });
      queryClient.invalidateQueries({ queryKey: ['pending-enrollments'] });
    },
    onError: (error: any) => {
      toast.dismiss();
      const errorMessage = error.message || 'Failed to enroll in course';
      
      // Handle specific error cases
      if (errorMessage.includes('already enrolled')) {
        toast.warning('Already Enrolled', {
          description: 'You have already enrolled in this course',
        });
      } else if (errorMessage.includes('not found')) {
        toast.error('Invalid Code', {
          description: 'The enrollment code is invalid or expired',
        });
      } else {
        toast.error('Enrollment Failed', {
          description: errorMessage,
        });
      }
    },
  });
};

/**
 * Batch action hook for admin to process multiple enrollments
 */
export const useBatchEnrollmentAction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      enrollmentIds, 
      action 
    }: { 
      enrollmentIds: number[]; 
      action: 'accept' | 'refuse' 
    }) => {
      const promises = enrollmentIds.map(id => 
        handleEnrollmentAction(id, action)
      );
      return Promise.all(promises);
    },
    onSuccess: (data, variables) => {
      const count = variables.enrollmentIds.length;
      const isAccept = variables.action === 'accept';
      
      toast.success(
        `${count} ${isAccept ? 'Accepted' : 'Refused'}`,
        {
          description: `Successfully processed ${count} enrollment request(s)`,
        }
      );
      
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
      queryClient.invalidateQueries({ queryKey: ['pending-enrollments'] });
      queryClient.invalidateQueries({ queryKey: ['course-students'] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
    onError: (error: any) => {
      toast.error('Batch Action Failed', {
        description: error.message || 'Failed to process some enrollment requests',
      });
    },
  });
};