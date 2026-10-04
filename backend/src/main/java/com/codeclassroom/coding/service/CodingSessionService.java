package com.codeclassroom.coding.service;

import com.codeclassroom.assignment.model.Language;
import com.codeclassroom.coding.dto.CodingSessionDto;
import com.codeclassroom.coding.dto.CodingSessionRequest;
import com.codeclassroom.coding.model.CodingSession;
import com.codeclassroom.coding.model.CodingSessionStatus;
import org.springframework.stereotype.Service;

import com.codeclassroom.coding.repository.CodingSessionRepository;
import com.codeclassroom.assignment.repository.AssignmentRepository;
import com.codeclassroom.user.repository.UserRepository;
import com.codeclassroom.assignment.model.Assignment;
import com.codeclassroom.user.model.User;
import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.DependsOn;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@DependsOn({"userService", "assignmentService"})
public class CodingSessionService {
    private final CodingSessionRepository codingSessionRepository;
    private final AssignmentRepository assignmentRepository;
    private final UserRepository userRepository;

    public CodingSessionService(CodingSessionRepository codingSessionRepository, AssignmentRepository assignmentRepository, UserRepository userRepository) {
        this.codingSessionRepository = codingSessionRepository;
        this.assignmentRepository = assignmentRepository;
        this.userRepository = userRepository;
    }

    @PostConstruct
    public void init() {
        User student = userRepository.findAll().stream().filter(u -> "student".equals(u.getUsername())).findFirst().orElse(null);
        Assignment hwJava = assignmentRepository.findAll().stream().filter(a -> "Hello World in Java".equals(a.getTitle())).findFirst().orElse(null);
        
        if (student != null && hwJava != null && !codingSessionRepository.existsByStudentIdAndAssignmentId(student.getId(), hwJava.getId())) {
            codingSessionRepository.save(CodingSession.builder()
                    .studentId(student.getId())
                    .assignmentId(hwJava.getId())
                    .code("public class Main {\n    // Write your code here\n}")
                    .language(Language.JAVA)
                    .startedAt(LocalDateTime.now().minusMinutes(30))
                    .lastSavedAt(LocalDateTime.now().minusMinutes(5))
                    .status(CodingSessionStatus.ACTIVE)
                    .build());
        }

        Assignment arrayMan = assignmentRepository.findAll().stream().filter(a -> "Array Manipulation".equals(a.getTitle())).findFirst().orElse(null);
        if (student != null && arrayMan != null && !codingSessionRepository.existsByStudentIdAndAssignmentId(student.getId(), arrayMan.getId())) {
            codingSessionRepository.save(CodingSession.builder()
                    .studentId(student.getId())
                    .assignmentId(arrayMan.getId())
                    .code("def main():\n    print('test')")
                    .language(Language.PYTHON)
                    .startedAt(LocalDateTime.now().minusHours(2))
                    .lastSavedAt(LocalDateTime.now().minusHours(1))
                    .status(CodingSessionStatus.COMPLETED)
                    .build());
        }
    }

    public Optional<CodingSessionDto> getSessionById(Long id) {
        return codingSessionRepository.findById(id).map(this::mapToDto);
    }

    public List<CodingSessionDto> getSessionsByStudentId(Long studentId) {
        return codingSessionRepository.findByStudentId(studentId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public CodingSessionDto createSession(CodingSessionRequest request) {
        CodingSession session = CodingSession.builder()
                .studentId(request.getStudentId())
                .assignmentId(request.getAssignmentId())
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
            session.setCode(newCode);
            session.setLastSavedAt(LocalDateTime.now());
            return mapToDto(codingSessionRepository.save(session));
        });
    }

    public Optional<CodingSessionDto> updateStatus(Long id, CodingSessionStatus newStatus) {
        return codingSessionRepository.findById(id).map(session -> {
            session.setStatus(newStatus);
            return mapToDto(codingSessionRepository.save(session));
        });
    }

    private CodingSessionDto mapToDto(CodingSession session) {
        return CodingSessionDto.builder()
                .id(session.getId())
                .studentId(session.getStudentId())
                .assignmentId(session.getAssignmentId())
                .code(session.getCode())
                .language(session.getLanguage())
                .startedAt(session.getStartedAt())
                .lastSavedAt(session.getLastSavedAt())
                .status(session.getStatus())
                .build();
    }
}
