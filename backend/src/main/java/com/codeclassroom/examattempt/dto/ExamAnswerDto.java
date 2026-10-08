package com.codeclassroom.examattempt.dto;

import com.codeclassroom.examattempt.model.ExamAnswerStatus;
import com.codeclassroom.common.model.Language;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ExamAnswerDto {
    private Long id;
    private Long attemptId;
    private Long questionId;
    private String code;
    private Language language;
    private LocalDateTime lastSavedAt;
    private LocalDateTime submittedAt;
    private ExamAnswerStatus status;
}
