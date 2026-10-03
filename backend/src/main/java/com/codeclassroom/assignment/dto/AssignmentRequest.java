package com.codeclassroom.assignment.dto;

import com.codeclassroom.assignment.model.Language;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AssignmentRequest {
    private Long courseId;
    private String title;
    private String description;
    private LocalDateTime deadline;
    private Integer totalMarks;
    private Language allowedLanguage;
}
