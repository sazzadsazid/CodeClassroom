package com.codeclassroom.examattempt.repository;

import com.codeclassroom.examattempt.model.ExamAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ExamAttemptRepository extends JpaRepository<ExamAttempt, Long> {
    List<ExamAttempt> findByExamId(Long examId);
    List<ExamAttempt> findByStudentId(Long studentId);
    Optional<ExamAttempt> findByExamIdAndStudentId(Long examId, Long studentId);
}
