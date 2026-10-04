package com.codeclassroom.auth.service;

import com.codeclassroom.auth.dto.LoginRequest;
import com.codeclassroom.auth.dto.LoginResponse;
import com.codeclassroom.user.model.User;
import com.codeclassroom.user.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public Optional<LoginResponse> authenticate(LoginRequest request) {
        Optional<User> optionalUser = userRepository.findByUsername(request.getUsername());

        if (optionalUser.isEmpty()) {
            return Optional.empty();
        }

        User user = optionalUser.get();

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return Optional.empty();
        }

        String jwtToken = jwtService.generateToken(user.getUsername(), user.getId(), user.getRole().name());

        return Optional.of(LoginResponse.builder()
                .token(jwtToken)
                .userId(user.getId())
                .username(user.getUsername())
                .role(user.getRole())
                .build());
    }
}
