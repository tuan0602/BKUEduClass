package com.bk.eduClass.service.impl;

import com.bk.eduClass.dto.EnrollmentDTO;
import com.bk.eduClass.model.Enrollment;
import com.bk.eduClass.repository.EnrollmentRepository;
import com.bk.eduClass.repository.CourseRepository;
import com.bk.eduClass.repository.StudentRepository;
import com.bk.eduClass.service.EnrollmentService;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EnrollmentServiceImpl implements EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final CourseRepository courseRepository;
    private final StudentRepository studentRepository;

    public EnrollmentServiceImpl(EnrollmentRepository enrollmentRepository,
                                 CourseRepository courseRepository,
                                 StudentRepository studentRepository) {
        this.enrollmentRepository = enrollmentRepository;
        this.courseRepository = courseRepository;
        this.studentRepository = studentRepository;
    }

    @Override
    public EnrollmentDTO getById(String enrollmentId) {
        return enrollmentRepository.findById(enrollmentId)
                .map(this::toDTO)
                .orElse(null);
    }

    @Override
    public List<EnrollmentDTO> getAll() {
        return enrollmentRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public EnrollmentDTO create(EnrollmentDTO enrollmentDTO) {
        Enrollment enrollment = toEntity(enrollmentDTO);
        enrollment = enrollmentRepository.save(enrollment);
        return toDTO(enrollment);
    }

    @Override
    public EnrollmentDTO update(String enrollmentId, EnrollmentDTO enrollmentDTO) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId).orElseThrow();
        courseRepository.findById(enrollmentDTO.getCourseId()).ifPresent(enrollment::setCourse);
        studentRepository.findById(enrollmentDTO.getStudentId()).ifPresent(enrollment::setStudent);
        enrollment = enrollmentRepository.save(enrollment);
        return toDTO(enrollment);
    }

    @Override
    public void delete(String enrollmentId) {
        enrollmentRepository.deleteById(enrollmentId);
    }

    private EnrollmentDTO toDTO(Enrollment enrollment) {
        return EnrollmentDTO.builder()
                .enrollmentId(enrollment.getEnrollmentId())
                .courseId(enrollment.getCourse().getCourseId())
                .studentId(enrollment.getStudent().getStudentId())
                .enrolledAt(enrollment.getEnrolledAt())
                .build();
    }

    private Enrollment toEntity(EnrollmentDTO dto) {
        Enrollment enrollment = new Enrollment();
        enrollment.setEnrollmentId(dto.getEnrollmentId());
        enrollment.setEnrolledAt(dto.getEnrolledAt());

        courseRepository.findById(dto.getCourseId())
                .ifPresent(enrollment::setCourse);

        studentRepository.findById(dto.getStudentId())
                .ifPresent(enrollment::setStudent);

        return enrollment;
    }
}
