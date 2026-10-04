package com.codeclassroom.coding.repository;

import com.codeclassroom.coding.model.CodingSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CodingSessionRepository extends JpaRepository<CodingSession, Long> {
    List<CodingSession> findByStudentId(Long studentId);
    boolean existsByStudentIdAndAssignmentId(Long studentId, Long assignmentId);
}
