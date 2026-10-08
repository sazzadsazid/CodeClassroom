package com.codeclassroom.exam.repository;

import com.codeclassroom.exam.model.Exam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExamRepository extends JpaRepository<Exam, Long> {
    List<Exam> findByCourseId(Long courseId);
    List<Exam> findByStatus(com.codeclassroom.exam.model.ExamStatus status);
}
