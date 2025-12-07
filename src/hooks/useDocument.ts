// src/hooks/useDocument.ts
import { useState } from "react";
import { toast } from "sonner";
import documentService, {
  Document,
  DocumentUploadData,
} from "../lib/documentService";

export const useDocument = () => {
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);

  /**
   * Upload a document to a course
   */
  const uploadDocument = async (data: DocumentUploadData) => {
    setLoading(true);
    try {
      await documentService.uploadDocument(data);
      toast.success("Tài liệu đã được tải lên thành công!");
      return true;
    } catch (error: any) {
      console.error("Upload document error:", error);
      toast.error(
        error.response?.data?.message || "Không thể tải lên tài liệu"
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch all documents of a course
   */
  const fetchDocuments = async (courseId: number) => {
    setLoading(true);
    try {
      const docs = await documentService.getAllDocuments(courseId);
      setDocuments(docs);
      return docs;
    } catch (error: any) {
      console.error("Fetch documents error:", error);
      toast.error(
        error.response?.data?.message || "Không thể tải danh sách tài liệu"
      );
      return [];
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get document detail
   */
  const getDocumentDetail = async (courseId: number, documentId: number) => {
    setLoading(true);
    try {
      const doc = await documentService.getDocumentDetail(courseId, documentId);
      return doc;
    } catch (error: any) {
      console.error("Get document detail error:", error);
      toast.error(
        error.response?.data?.message || "Không thể tải chi tiết tài liệu"
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Download a document
   */
  const downloadDocument = async (
    courseId: number,
    documentId: number,
    fileName: string
  ) => {
    setLoading(true);
    try {
      const blob = await documentService.downloadDocument(courseId, documentId);
      documentService.triggerDownload(blob, fileName);
      toast.success("Tải xuống thành công!");
      return true;
    } catch (error: any) {
      console.error("Download document error:", error);
      toast.error(
        error.response?.data?.message || "Không thể tải xuống tài liệu"
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete a document
   */
  const deleteDocument = async (courseId: number, documentId: number) => {
    setLoading(true);
    try {
      await documentService.deleteDocument(courseId, documentId);
      setDocuments(documents.filter((doc) => doc.id !== documentId));
      toast.success("Tài liệu đã được xóa!");
      return true;
    } catch (error: any) {
      console.error("Delete document error:", error);
      toast.error(error.response?.data?.message || "Không thể xóa tài liệu");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    documents,
    uploadDocument,
    fetchDocuments,
    getDocumentDetail,
    downloadDocument,
    deleteDocument,
  };
};
