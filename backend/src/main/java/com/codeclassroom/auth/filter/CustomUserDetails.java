package com.codeclassroom.auth.filter;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CustomUserDetails {
    private Long id;
    private String username;
    private String role;
}
