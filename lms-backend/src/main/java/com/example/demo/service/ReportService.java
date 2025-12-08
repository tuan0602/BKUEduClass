package com.example.demo.service;

import com.example.demo.domain.*;
import com.example.demo.domain.enumeration.EnrollmentStatus;
import com.example.demo.domain.enumeration.Role;
import com.example.demo.dto.response.courseDTO.ReponseCourseDTO;
import com.example.demo.dto.response.report.ProgressLearning;
import com.example.demo.repository.CourseRepository;
import com.example.demo.repository.SubmissionRepository;
import com.example.demo.repository.UserRepository;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportService {
    final private SubmissionRepository submissionRepository;
    final private AssignmentService assignmentService;
    final private UserRepository userRepository;
    final private CourseRepository courseRepository;
    public ProgressLearning getResultLearningStudent(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        // get all courses the student is enrolled in
        List<Course> courses= courseRepository.findAll().stream()
                .filter(course -> course.getEnrollments().stream()
                        .anyMatch(enrollment -> enrollment.getStudent().getUserId().equals(user.getUserId())
                                && enrollment.getStatus() == EnrollmentStatus.ACCEPTED))
                .collect(Collectors.toList());
        // for each course, get all assignments and submissions
        List<Assignment> assignments=courses.stream().flatMap(course -> course.getAssignments().stream())
                .collect(Collectors.toList());
        // for each assignment, get the submission of the student
        List<Submission> submissions=assignments.stream()
                .map(assignment -> submissionRepository.findByAssignmentAndStudent(assignment, user).orElse(null))
                .filter(submission -> submission != null)
                .collect(Collectors.toList());
        // calculate progress
        int totalCourses=courses.size();
        int totalAssignments=assignments.size();
        int totalSubmissions=submissions.size();
        int submittedAssignments=submissions.size();
        List<Double> grades=submissions.stream()
                .filter(submission -> submission.getGrade() != null)
                .map(Submission::getGrade)
                .collect(Collectors.toList());

        double submissionRate= totalAssignments==0 ? 0.0 : ((double) submittedAssignments / totalAssignments) * 100;
        ProgressLearning progressLearning=new ProgressLearning();
        progressLearning.setNumberCourse(totalCourses);
        progressLearning.setNumberSubmissions(totalSubmissions);
        progressLearning.setNumberAssignments(totalAssignments);
        progressLearning.setSubmissionRate(submissionRate);
        if (!grades.isEmpty()){
            double sum=grades.stream().mapToDouble(Double::doubleValue).sum();
            double averageGrade=sum/grades.size();
            progressLearning.setAverageGrade(averageGrade);
        }
        return progressLearning;
    }
    public ProgressLearning getResultLearningStudentByCourseId(String email, Long courseId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        // get all courses the student is enrolled in
        Course courses= courseRepository.findById(courseId).orElse(null);
        List<Assignment> assignments=courses.getAssignments().stream()
                .collect(Collectors.toList());
        // for each assignment, get the submission of the student
        List<Submission> submissions=assignments.stream()
                .map(assignment -> submissionRepository.findByAssignmentAndStudent(assignment, user).orElse(null))
                .filter(submission -> submission != null)
                .collect(Collectors.toList());
        // calculate progress
        int totalCourses=1;
        int totalAssignments=assignments.size();
        int totalSubmissions=submissions.size();
        int submittedAssignments=submissions.size();
        List<Double> grades=submissions.stream()
                .filter(submission -> submission.getGrade() != null)
                .map(Submission::getGrade)
                .collect(Collectors.toList());

        double submissionRate= totalAssignments==0 ? 0.0 : ((double) submittedAssignments / totalAssignments) * 100;
        ProgressLearning progressLearning=new ProgressLearning();
        progressLearning.setNumberCourse(totalCourses);
        progressLearning.setNumberSubmissions(totalSubmissions);
        progressLearning.setNumberAssignments(totalAssignments);
        progressLearning.setSubmissionRate(submissionRate);
        if (!grades.isEmpty()){
            double sum=grades.stream().mapToDouble(Double::doubleValue).sum();
            double averageGrade=sum/grades.size();
            progressLearning.setAverageGrade(averageGrade);
        }
        return progressLearning;
    }


}
