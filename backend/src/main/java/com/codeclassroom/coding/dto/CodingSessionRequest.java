package com.codeclassroom.coding.dto;

import com.codeclassroom.assignment.model.Language;
import lombok.Data;

@Data
public class CodingSessionRequest {
    private Long studentId;
    private Long assignmentId;
    private String code;
    private Language language;
}
