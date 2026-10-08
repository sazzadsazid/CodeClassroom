package com.codeclassroom.coding.service;

import com.codeclassroom.common.model.Language;
import com.codeclassroom.coding.dto.CodingSessionDto;
import com.codeclassroom.coding.dto.CodingSessionRequest;
import com.codeclassroom.coding.model.CodingSession;
import com.codeclassroom.coding.model.CodingSessionStatus;
import org.springframework.stereotype.Service;

import com.codeclassroom.coding.repository.CodingSessionRepository;
import com.codeclassroom.user.repository.UserRepository;
import com.codeclassroom.user.model.User;
import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.DependsOn;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CodingSessionService {
    private final CodingSessionRepository codingSessionRepository;
    private final UserRepository userRepository;
    private final com.codeclassroom.examattempt.repository.ExamAttemptRepository examAttemptRepository;

    public CodingSessionService(CodingSessionRepository codingSessionRepository, 
                                UserRepository userRepository,
                                com.codeclassroom.examattempt.repository.ExamAttemptRepository examAttemptRepository) {
        this.codingSessionRepository = codingSessionRepository;
        this.userRepository = userRepository;
        this.examAttemptRepository = examAttemptRepository;
    }


    public Optional<CodingSessionDto> getSessionById(Long id) {
        return codingSessionRepository.findById(id).map(session -> {
            com.codeclassroom.auth.util.SecurityUtils.checkStudentOwnership(session.getStudentId());
            return mapToDto(session);
        });
    }

    public List<CodingSessionDto> getSessionsByStudentId(Long studentId) {
        com.codeclassroom.auth.util.SecurityUtils.checkStudentOwnership(studentId);
        return codingSessionRepository.findByStudentId(studentId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<CodingSessionDto> getSessionsByAttemptId(Long attemptId) {
        examAttemptRepository.findById(attemptId).ifPresent(attempt -> 
            com.codeclassroom.auth.util.SecurityUtils.checkStudentOwnership(attempt.getStudentId())
        );
        return codingSessionRepository.findByAttemptId(attemptId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public CodingSessionDto createSession(CodingSessionRequest request) {
        com.codeclassroom.auth.util.SecurityUtils.checkStudentOwnership(request.getStudentId());
        CodingSession session = CodingSession.builder()
                .studentId(request.getStudentId())
                .attemptId(request.getAttemptId())
                .code(request.getCode())
                .language(request.getLanguage())
                .startedAt(LocalDateTime.now())
                .lastSavedAt(LocalDateTime.now())
                .status(CodingSessionStatus.ACTIVE)
                .build();
        CodingSession savedSession = codingSessionRepository.save(session);
        return mapToDto(savedSession);
    }

    public Optional<CodingSessionDto> updateCode(Long id, String newCode) {
        return codingSessionRepository.findById(id).map(session -> {
            com.codeclassroom.auth.util.SecurityUtils.checkStudentOwnership(session.getStudentId());
            session.setCode(newCode);
            session.setLastSavedAt(LocalDateTime.now());
            return mapToDto(codingSessionRepository.save(session));
        });
    }

    public Optional<CodingSessionDto> updateStatus(Long id, CodingSessionStatus newStatus) {
        return codingSessionRepository.findById(id).map(session -> {
            com.codeclassroom.auth.util.SecurityUtils.checkStudentOwnership(session.getStudentId());
            session.setStatus(newStatus);
            return mapToDto(codingSessionRepository.save(session));
        });
    }

    private CodingSessionDto mapToDto(CodingSession session) {
        return CodingSessionDto.builder()
                .id(session.getId())
                .studentId(session.getStudentId())
                .attemptId(session.getAttemptId())
                .code(session.getCode())
                .language(session.getLanguage())
                .startedAt(session.getStartedAt())
                .lastSavedAt(session.getLastSavedAt())
                .status(session.getStatus())
                .build();
    }
}
