package com.codeclassroom.auth.dto;

import com.codeclassroom.user.model.Role;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LoginResponse {
    private String token;
    private Long userId;
    private String username;
    private Role role;
}
