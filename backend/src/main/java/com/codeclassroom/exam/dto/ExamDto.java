package com.codeclassroom.exam.dto;

import com.codeclassroom.exam.model.ExamStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ExamDto {
    private Long id;
    private Long courseId;
    private String title;
    private String description;
    private Integer durationMinutes;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Integer totalMarks;
    private ExamStatus status;
}
