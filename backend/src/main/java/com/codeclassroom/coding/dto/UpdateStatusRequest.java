package com.codeclassroom.coding.dto;

import com.codeclassroom.coding.model.CodingSessionStatus;
import lombok.Data;

@Data
public class UpdateStatusRequest {
    private CodingSessionStatus status;
}
