import api from "./axios";

// =======================
// TYPES MATCH BACKEND
// =======================
export interface ResultAnswer {
  questionContent: string;
  answerA: string;
  answerB: string;
  answerC: string;
  answerD: string;
  answerOfUser: string;
  isCorrect: boolean;
}

export interface ReponseDetailSubmissionDTO {
  submissionId: number | null;
  submittedAt: string | null;
  grade: number | undefined; // 🔥 avoid null
  submitted: boolean;
  answers: ResultAnswer[];
}

export interface SubmitAnswerDTO {
  questionId: number;
  answer: string; // A/B/C/D
}

export interface SubmitSubmissionDTO {
  assignmentId: number;
  answers: SubmitAnswerDTO[];
}

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  error: string | null;
}

// =======================
// SERVICE
// =======================
const submissionService = {
  submitSubmission: async (
    submissionData: SubmitSubmissionDTO
  ): Promise<void> => {
    await api.post<ApiResponse<void>>(
      "/student/assignments/submit",
      submissionData
    );
  },

  getSubmissionById: async (
    submissionId: number
  ): Promise<ReponseDetailSubmissionDTO> => {
    const response = await api.get<ApiResponse<ReponseDetailSubmissionDTO>>(
      `/submissions/${submissionId}`
    );

    const data = response.data.data;

    return {
      ...data,
      grade: data.grade ?? undefined,
      submitted: Boolean(data.submitted),
      answers: data.answers ?? [],
    };
  },

  getSubmissionByAssignmentId: async (
    assignmentId: number
  ): Promise<ReponseDetailSubmissionDTO> => {
    const response = await api.get<ApiResponse<ReponseDetailSubmissionDTO>>(
      `/student/assignment/${assignmentId}/submission`
    );

    const data = response.data.data;

    return {
      ...data,
      grade: data.grade ?? undefined,
      submitted: Boolean(data.submitted),
      answers: data.answers ?? [],
    };
  },

  checkSubmissionExists: async (assignmentId: number): Promise<boolean> => {
    try {
      const result = await submissionService.getSubmissionByAssignmentId(
        assignmentId
      );
      return result.submitted === true;
    } catch {
      return false;
    }
  },
};

export default submissionService;
