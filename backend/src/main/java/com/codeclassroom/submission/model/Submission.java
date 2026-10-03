package com.codeclassroom.submission.model;

import com.codeclassroom.assignment.model.Language;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "submissions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Submission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Long assignmentId;
    private Long studentId;
    
    @Column(columnDefinition = "TEXT")
    private String code;
    
    @Enumerated(EnumType.STRING)
    private Language language;
    
    private LocalDateTime submittedAt;
    
    @Enumerated(EnumType.STRING)
    private SubmissionStatus status;
}
