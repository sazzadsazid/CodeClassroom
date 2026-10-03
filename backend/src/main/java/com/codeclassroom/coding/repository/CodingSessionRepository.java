package com.codeclassroom.coding.repository;

import com.codeclassroom.coding.model.CodingSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CodingSessionRepository extends JpaRepository<CodingSession, Long> {
}
