// src/lib/activityService.ts
import assignmentService, { DashboardAssignment } from "./assignmentService";
import courseService, { ReponseCourseDTO } from "./courseService";
import documentService, { Document } from "./documentService";

export interface ActivityItem {
  type: "assignment" | "course" | "document";
  action: string;
  user: string;
  time: string; // ISO string
  courseId?: number;
  assignmentId?: number;
  documentId?: number;
}

// Lấy recent activities từ các nguồn
export const getRecentActivities = async (): Promise<ActivityItem[]> => {
  const activities: ActivityItem[] = [];

  // 1. Assignment của student hiện tại (submit, tạo bài)
  try {
    const studentAssignments = await assignmentService.getStudentAssignments({ size: 10 });
    studentAssignments.forEach((a: DashboardAssignment) => {
      if (a.submitted) {
        activities.push({
          type: "assignment",
          action: `Nộp bài tập "${a.title}"`,
          user: "Sinh viên", // Nếu có API user thì lấy tên chính xác
          time: a.updatedAt,
          assignmentId: a.id,
          courseId: a.courseName ? undefined : undefined,
        });
      }
    });
  } catch (error) {
    console.error("Error fetching student assignments", error);
  }

  // 2. Courses mới (tạo course)
  try {
    const courses = await courseService.getCourses({ page: 0, size: 5, sort: "createdAt,desc" });
    courses.result.forEach((c: ReponseCourseDTO) => {
      activities.push({
        type: "course",
        action: `Tạo lớp học "${c.name}"`,
        user: c.teacher?.name || "Admin",
        time:  new Date().toISOString(),
        courseId: c.id,
      });
    });
  } catch (error) {
    console.error("Error fetching courses", error);
  }

  // 3. Documents mới (upload tài liệu)
  try {
    // Lấy 5 course đầu tiên làm ví dụ
    const courses = await courseService.getCourses({ page: 0, size: 5 });
    for (const c of courses.result) {
      const docs: Document[] = await documentService.getAllDocuments(c.id);
      docs.slice(-5).forEach((doc) => {
        activities.push({
          type: "document",
          action: `Upload tài liệu "${doc.title}"`,
          user: doc.uploadedBy,
          time: doc.uploadedAt,
          courseId: doc.courseId,
          documentId: doc.id,
        });
      });
    }
  } catch (error) {
    console.error("Error fetching documents", error);
  }

  // Sắp xếp theo thời gian giảm dần
  activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

  // Lấy 10 hoạt động gần nhất
  return activities.slice(0, 10);
};
