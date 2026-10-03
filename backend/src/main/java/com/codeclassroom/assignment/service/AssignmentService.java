package com.codeclassroom.assignment.service;

import com.codeclassroom.assignment.dto.AssignmentDto;
import com.codeclassroom.assignment.dto.AssignmentRequest;
import com.codeclassroom.assignment.model.Assignment;
import com.codeclassroom.assignment.model.Language;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

@Service
public class AssignmentService {
    private final List<Assignment> assignments = new ArrayList<>();
    private final AtomicLong idGenerator = new AtomicLong(1);

    public AssignmentService() {
        assignments.add(new Assignment(
                idGenerator.getAndIncrement(),
                1L, // CS101
                "Hello World in Java",
                "Write a basic Hello World program in Java.",
                LocalDateTime.now().plusDays(7),
                10,
                Language.JAVA
        ));
        assignments.add(new Assignment(
                idGenerator.getAndIncrement(),
                2L, // CS201
                "Array Manipulation",
                "Implement a dynamic array in Python.",
                LocalDateTime.now().plusDays(14),
                20,
                Language.PYTHON
        ));
    }

    public List<AssignmentDto> getAllAssignments() {
        return assignments.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public Optional<AssignmentDto> getAssignmentById(Long id) {
        return assignments.stream()
                .filter(a -> a.getId().equals(id))
                .findFirst()
                .map(this::mapToDto);
    }

    public List<AssignmentDto> getAssignmentsByCourseId(Long courseId) {
        return assignments.stream()
                .filter(a -> a.getCourseId().equals(courseId))
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public AssignmentDto createAssignment(AssignmentRequest request) {
        Assignment assignment = Assignment.builder()
                .id(idGenerator.getAndIncrement())
                .courseId(request.getCourseId())
                .title(request.getTitle())
                .description(request.getDescription())
                .deadline(request.getDeadline())
                .totalMarks(request.getTotalMarks())
                .allowedLanguage(request.getAllowedLanguage())
                .build();
        assignments.add(assignment);
        return mapToDto(assignment);
    }

    public Optional<AssignmentDto> updateAssignment(Long id, AssignmentRequest request) {
        for (Assignment assignment : assignments) {
            if (assignment.getId().equals(id)) {
                assignment.setCourseId(request.getCourseId());
                assignment.setTitle(request.getTitle());
                assignment.setDescription(request.getDescription());
                assignment.setDeadline(request.getDeadline());
                assignment.setTotalMarks(request.getTotalMarks());
                assignment.setAllowedLanguage(request.getAllowedLanguage());
                return Optional.of(mapToDto(assignment));
            }
        }
        return Optional.empty();
    }

    public boolean deleteAssignment(Long id) {
        return assignments.removeIf(a -> a.getId().equals(id));
    }

    private AssignmentDto mapToDto(Assignment assignment) {
        return AssignmentDto.builder()
                .id(assignment.getId())
                .courseId(assignment.getCourseId())
                .title(assignment.getTitle())
                .description(assignment.getDescription())
                .deadline(assignment.getDeadline())
                .totalMarks(assignment.getTotalMarks())
                .allowedLanguage(assignment.getAllowedLanguage())
                .build();
    }
}
