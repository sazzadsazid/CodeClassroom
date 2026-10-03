package com.codeclassroom.submission.dto;

import com.codeclassroom.assignment.model.Language;
import lombok.Data;

@Data
public class SubmissionRequest {
    private Long assignmentId;
    private Long studentId;
    private String code;
    private Language language;
}
