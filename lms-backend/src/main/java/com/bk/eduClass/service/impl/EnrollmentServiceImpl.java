package com.bk.eduClass.service.impl;

import com.bk.eduClass.dto.EnrollmentDTO;
import com.bk.eduClass.mapper.EnrollmentMapper;
import com.bk.eduClass.model.Enrollment;
import com.bk.eduClass.repository.CourseRepository;
import com.bk.eduClass.repository.EnrollmentRepository;
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
                .map(EnrollmentMapper::toDTO)
                .orElse(null);
    }

    @Override
    public List<EnrollmentDTO> getAll() {
        return enrollmentRepository.findAll()
                .stream()
                .map(EnrollmentMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public EnrollmentDTO create(EnrollmentDTO dto) {
        Enrollment enrollment = EnrollmentMapper.toEntity(dto);

        if (enrollment.getCourse() != null && enrollment.getCourse().getCourseId() != null) {
            courseRepository.findById(enrollment.getCourse().getCourseId())
                    .ifPresent(enrollment::setCourse);
        }

        if (enrollment.getStudent() != null && enrollment.getStudent().getStudentId() != null) {
            studentRepository.findById(enrollment.getStudent().getStudentId())
                    .ifPresent(enrollment::setStudent);
        }

        enrollment = enrollmentRepository.save(enrollment);
        return EnrollmentMapper.toDTO(enrollment);
    }

    @Override
    public EnrollmentDTO update(String enrollmentId, EnrollmentDTO dto) {
        Enrollment existing = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new IllegalArgumentException("Enrollment not found"));

        if (dto.getCourseId() != null) {
            courseRepository.findById(dto.getCourseId())
                    .ifPresent(existing::setCourse);
        }

        if (dto.getStudentId() != null) {
            studentRepository.findById(dto.getStudentId())
                    .ifPresent(existing::setStudent);
        }

        existing = enrollmentRepository.save(existing);
        return EnrollmentMapper.toDTO(existing);
    }

    @Override
    public void delete(String enrollmentId) {
        enrollmentRepository.deleteById(enrollmentId);
    }
}
