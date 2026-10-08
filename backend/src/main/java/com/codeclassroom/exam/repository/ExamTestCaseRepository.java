package com.codeclassroom.exam.repository;

import com.codeclassroom.exam.model.ExamTestCase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExamTestCaseRepository extends JpaRepository<ExamTestCase, Long> {
    List<ExamTestCase> findByQuestionIdOrderByTestCaseNumberAsc(Long questionId);

    long countByQuestionId(Long questionId);

    void deleteByQuestionId(Long questionId);
}
