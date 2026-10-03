package com.codeclassroom.assignment.dto;

import com.codeclassroom.assignment.model.Language;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssignmentDto {
    private Long id;
    private Long courseId;
    private String title;
    private String description;
    private LocalDateTime deadline;
    private Integer totalMarks;
    private Language allowedLanguage;
}
