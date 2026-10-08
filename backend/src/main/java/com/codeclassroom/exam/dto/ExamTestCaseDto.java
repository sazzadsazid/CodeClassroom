package com.codeclassroom.exam.dto;

import lombok.Data;

import java.time.LocalDateTime;

/**
 * Teacher-only response model for a grading test case.
 * Must never be embedded in student-facing payloads such as {@link ExamQuestionDto}.
 */
@Data
public class ExamTestCaseDto {
    private Long id;
    private Long questionId;
    private Integer testCaseNumber;
    private String input;
    private String expectedOutput;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
