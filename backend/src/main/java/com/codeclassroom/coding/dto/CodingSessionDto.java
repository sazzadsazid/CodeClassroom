package com.codeclassroom.coding.dto;

import com.codeclassroom.common.model.Language;
import com.codeclassroom.coding.model.CodingSessionStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CodingSessionDto {
    private Long id;
    private Long studentId;
    private Long attemptId;
    private String code;
    private Language language;
    private LocalDateTime startedAt;
    private LocalDateTime lastSavedAt;
    private CodingSessionStatus status;
}
