package com.codeclassroom.coding.service;

import com.codeclassroom.assignment.model.Language;
import com.codeclassroom.coding.dto.CodingSessionDto;
import com.codeclassroom.coding.dto.CodingSessionRequest;
import com.codeclassroom.coding.model.CodingSession;
import com.codeclassroom.coding.model.CodingSessionStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

@Service
public class CodingSessionService {
    private final List<CodingSession> sessions = new ArrayList<>();
    private final AtomicLong idGenerator = new AtomicLong(1);

    public CodingSessionService() {
        sessions.add(new CodingSession(
                idGenerator.getAndIncrement(),
                1L, // studentId
                1L, // assignmentId
                "public class Main {\n    // Write your code here\n}",
                Language.JAVA,
                LocalDateTime.now().minusMinutes(30),
                LocalDateTime.now().minusMinutes(5),
                CodingSessionStatus.ACTIVE
        ));
        sessions.add(new CodingSession(
                idGenerator.getAndIncrement(),
                1L, // studentId
                2L, // assignmentId
                "def main():\n    print('test')",
                Language.PYTHON,
                LocalDateTime.now().minusHours(2),
                LocalDateTime.now().minusHours(1),
                CodingSessionStatus.COMPLETED
        ));
    }

    public Optional<CodingSessionDto> getSessionById(Long id) {
        return sessions.stream()
                .filter(s -> s.getId().equals(id))
                .findFirst()
                .map(this::mapToDto);
    }

    public List<CodingSessionDto> getSessionsByStudentId(Long studentId) {
        return sessions.stream()
                .filter(s -> s.getStudentId().equals(studentId))
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public CodingSessionDto createSession(CodingSessionRequest request) {
        CodingSession session = CodingSession.builder()
                .id(idGenerator.getAndIncrement())
                .studentId(request.getStudentId())
                .assignmentId(request.getAssignmentId())
                .code(request.getCode())
                .language(request.getLanguage())
                .startedAt(LocalDateTime.now())
                .lastSavedAt(LocalDateTime.now())
                .status(CodingSessionStatus.ACTIVE)
                .build();
        sessions.add(session);
        return mapToDto(session);
    }

    public Optional<CodingSessionDto> updateCode(Long id, String newCode) {
        for (CodingSession session : sessions) {
            if (session.getId().equals(id)) {
                session.setCode(newCode);
                session.setLastSavedAt(LocalDateTime.now());
                return Optional.of(mapToDto(session));
            }
        }
        return Optional.empty();
    }

    public Optional<CodingSessionDto> updateStatus(Long id, CodingSessionStatus newStatus) {
        for (CodingSession session : sessions) {
            if (session.getId().equals(id)) {
                session.setStatus(newStatus);
                return Optional.of(mapToDto(session));
            }
        }
        return Optional.empty();
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
