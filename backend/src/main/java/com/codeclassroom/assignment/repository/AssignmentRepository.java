package com.codeclassroom.assignment.repository;

import com.codeclassroom.assignment.model.Assignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
    List<Assignment> findByCourseId(Long courseId);
    boolean existsByTitleAndCourseId(String title, Long courseId);
}
