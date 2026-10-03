package com.codeclassroom.user.service;

import com.codeclassroom.user.dto.CreateUserRequest;
import com.codeclassroom.user.dto.UserDto;
import com.codeclassroom.user.model.Role;
import com.codeclassroom.user.model.User;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

@Service
public class UserService {
    private final List<User> users = new ArrayList<>();
    private final AtomicLong idGenerator = new AtomicLong(1);

    public UserService() {
        // Initialize with sample users
        users.add(new User(idGenerator.getAndIncrement(), "student", "student@example.com", "password", Role.STUDENT));
        users.add(new User(idGenerator.getAndIncrement(), "teacher", "teacher@example.com", "password", Role.TEACHER));
        users.add(new User(idGenerator.getAndIncrement(), "admin", "admin@example.com", "password", Role.ADMIN));
    }

    public List<UserDto> getAllUsers() {
        return users.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public Optional<UserDto> getUserById(Long id) {
        return users.stream()
                .filter(user -> user.getId().equals(id))
                .findFirst()
                .map(this::mapToDto);
    }

    public UserDto createUser(CreateUserRequest request) {
        User user = User.builder()
                .id(idGenerator.getAndIncrement())
                .username(request.getUsername())
                .email(request.getEmail())
                .password(request.getPassword())
                .role(request.getRole() != null ? request.getRole() : Role.STUDENT)
                .build();
        users.add(user);
        return mapToDto(user);
    }

    private UserDto mapToDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }
}
