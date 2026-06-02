package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.example.demo.entity.Assignment;
import com.example.demo.entity.Submission;
import com.example.demo.entity.User;

import java.util.Optional;
import java.util.List;
@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long>, JpaSpecificationExecutor<Submission> {
    boolean existsByAssignmentAndStudent(Assignment assignment, User user);
    Optional<Submission> findByAssignmentAndStudent(Assignment assignment, User user);
    List<Submission> findByAssignmentId(Long assignmentId);

}
