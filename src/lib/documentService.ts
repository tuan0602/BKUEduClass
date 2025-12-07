// src/lib/documentService.ts
import api from "./axios";

export interface Document {
  id: number;
  courseId: number;
  title: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadedBy: string;
  uploadedAt: string;
}

export interface DocumentUploadData {
  file: File;
  title: string;
  courseId: number;
}

export const documentService = {
  /**
   * Upload document to a course
   * POST /courses/:courseid/documents/upload
   * title is sent as query parameter, file in form data
   */
  uploadDocument: async (data: DocumentUploadData): Promise<void> => {
    const formData = new FormData();
    formData.append("file", data.file);

    const response = await api.post(
      `/courses/${data.courseId}/documents/upload?title=${encodeURIComponent(data.title)}`,
      formData
    );
    return response.data;
  },

  /**
   * Get all documents of a course
   * GET /courses/:courseid/documents
   */
  getAllDocuments: async (courseId: number): Promise<Document[]> => {
    const response = await api.get(`/courses/${courseId}/documents`);
    return response.data.data;
  },

  /**
   * Get document detail
   * GET /courses/:courseid/documents/:documentid
   */
  getDocumentDetail: async (
    courseId: number,
    documentId: number
  ): Promise<Document> => {
    const response = await api.get(
      `/courses/${courseId}/documents/${documentId}`
    );
    return response.data.data;
  },

  /**
   * Download document
   * GET /courses/:courseid/documents/:documentid/download
   */
  downloadDocument: async (
    courseId: number,
    documentId: number
  ): Promise<Blob> => {
    const response = await api.get(
      `/courses/${courseId}/documents/${documentId}/download`,
      {
        params: {
          documentid: documentId,
          courseid: courseId,
        },
        responseType: "blob",
      }
    );
    return response.data;
  },

  /**
   * Delete document
   * DELETE /courses/:courseid/documents/:documentid
   */
  deleteDocument: async (
    courseId: number,
    documentId: number
  ): Promise<void> => {
    const response = await api.delete(
      `/courses/${courseId}/documents/${documentId}`
    );
    return response.data;
  },

  /**
   * Helper function to trigger file download in browser
   */
  triggerDownload: (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },
};

export default documentService;
