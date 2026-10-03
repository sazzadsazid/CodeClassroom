package com.codeclassroom.assignment.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "assignments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Assignment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Long courseId;
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    private LocalDateTime deadline;
    private Integer totalMarks;
    
    @Enumerated(EnumType.STRING)
    private Language allowedLanguage;
}
