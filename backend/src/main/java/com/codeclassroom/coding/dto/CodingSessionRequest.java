package com.codeclassroom.coding.dto;

import com.codeclassroom.common.model.Language;
import lombok.Data;

@Data
public class CodingSessionRequest {
    private Long studentId;
    private Long attemptId;
    private String code;
    private Language language;
}
