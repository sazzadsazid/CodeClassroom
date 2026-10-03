package com.codeclassroom.coding.model;

import com.codeclassroom.assignment.model.Language;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "coding_sessions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CodingSession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Long studentId;
    private Long assignmentId;
    
    @Column(columnDefinition = "TEXT")
    private String code;
    
    @Enumerated(EnumType.STRING)
    private Language language;
    
    private LocalDateTime startedAt;
    private LocalDateTime lastSavedAt;
    
    @Enumerated(EnumType.STRING)
    private CodingSessionStatus status;
}
