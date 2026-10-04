package com.codeclassroom.user.service;

import com.codeclassroom.user.dto.CreateUserRequest;
import com.codeclassroom.user.dto.UserDto;
import com.codeclassroom.user.model.Role;
import com.codeclassroom.user.model.User;
import com.codeclassroom.user.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostConstruct
    public void init() {
        if (!userRepository.existsByUsername("student")) {
            userRepository.save(User.builder().username("student").email("student@example.com").password(passwordEncoder.encode("student123")).role(Role.STUDENT).build());
        } else {
            userRepository.findByUsername("student").ifPresent(user -> {
                if (user.getPassword().equals("password")) {
                    user.setPassword(passwordEncoder.encode("student123"));
                    userRepository.save(user);
                }
            });
        }
        
        if (!userRepository.existsByUsername("teacher")) {
            userRepository.save(User.builder().username("teacher").email("teacher@example.com").password(passwordEncoder.encode("teacher123")).role(Role.TEACHER).build());
        } else {
            userRepository.findByUsername("teacher").ifPresent(user -> {
                if (user.getPassword().equals("password")) {
                    user.setPassword(passwordEncoder.encode("teacher123"));
                    userRepository.save(user);
                }
            });
        }
        
        if (!userRepository.existsByUsername("admin")) {
            userRepository.save(User.builder().username("admin").email("admin@example.com").password(passwordEncoder.encode("admin123")).role(Role.ADMIN).build());
        } else {
            userRepository.findByUsername("admin").ifPresent(user -> {
                if (user.getPassword().equals("password")) {
                    user.setPassword(passwordEncoder.encode("admin123"));
                    userRepository.save(user);
                }
            });
        }
    }

    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public Optional<UserDto> getUserById(Long id) {
        return userRepository.findById(id).map(this::mapToDto);
    }

    public UserDto createUser(CreateUserRequest request) {
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole() != null ? request.getRole() : Role.STUDENT)
                .build();
        User savedUser = userRepository.save(user);
        return mapToDto(savedUser);
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
