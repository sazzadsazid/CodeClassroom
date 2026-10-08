package com.codeclassroom.examattempt.repository;

import com.codeclassroom.examattempt.model.ExamAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ExamAnswerRepository extends JpaRepository<ExamAnswer, Long> {
    List<ExamAnswer> findByAttemptId(Long attemptId);
    Optional<ExamAnswer> findByAttemptIdAndQuestionId(Long attemptId, Long questionId);
}
