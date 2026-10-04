package com.codeclassroom.auth.util;

import com.codeclassroom.auth.filter.CustomUserDetails;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.access.AccessDeniedException;

public class SecurityUtils {

    public static CustomUserDetails getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof CustomUserDetails) {
            return (CustomUserDetails) auth.getPrincipal();
        }
        return null;
    }

    public static void checkStudentOwnership(Long targetStudentId) {
        CustomUserDetails currentUser = getCurrentUser();
        if (currentUser == null) {
            throw new AccessDeniedException("User is not authenticated");
        }
        if ("STUDENT".equals(currentUser.getRole()) && !currentUser.getId().equals(targetStudentId)) {
            throw new AccessDeniedException("Access denied: You can only access your own data.");
        }
    }
}
