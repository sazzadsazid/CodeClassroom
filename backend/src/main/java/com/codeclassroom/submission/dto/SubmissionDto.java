package com.codeclassroom.submission.dto;

import com.codeclassroom.assignment.model.Language;
import com.codeclassroom.submission.model.SubmissionStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubmissionDto {
    private Long id;
    private Long assignmentId;
    private Long studentId;
    private String code;
    private Language language;
    private LocalDateTime submittedAt;
    private SubmissionStatus status;
}
