package com.example.demo.repository;

import com.example.demo.domain.Assignment;
import com.example.demo.domain.Submission;
import com.example.demo.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long>, JpaSpecificationExecutor<Submission> {
    boolean existsByAssignmentAndStudent(Assignment assignment, User user);
    Optional<Submission> findByAssignmentAndStudent(Assignment assignment, User user);

}
