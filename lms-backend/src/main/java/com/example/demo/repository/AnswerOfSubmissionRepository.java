package com.example.demo.repository;

import com.example.demo.domain.AnswerOfSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface AnswerOfSubmissionRepository extends JpaRepository<AnswerOfSubmission, Long> , JpaSpecificationExecutor<AnswerOfSubmission> {
}
