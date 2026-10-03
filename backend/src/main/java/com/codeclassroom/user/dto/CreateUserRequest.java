package com.codeclassroom.user.dto;

import com.codeclassroom.user.model.Role;
import lombok.Data;

@Data
public class CreateUserRequest {
    private String username;
    private String email;
    private String password;
    private Role role;
}
