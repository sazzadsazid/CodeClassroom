package com.codeclassroom.examattempt.dto;

import com.codeclassroom.examattempt.model.ExamAttemptStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ExamAttemptDto {
    private Long id;
    private Long examId;
    private Long studentId;
    private LocalDateTime startedAt;
    private LocalDateTime submittedAt;
    private ExamAttemptStatus status;
}
