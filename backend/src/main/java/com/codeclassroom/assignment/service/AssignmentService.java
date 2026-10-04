package com.codeclassroom.assignment.service;

import com.codeclassroom.assignment.dto.AssignmentDto;
import com.codeclassroom.assignment.dto.AssignmentRequest;
import com.codeclassroom.assignment.model.Assignment;
import com.codeclassroom.assignment.model.Language;
import com.codeclassroom.assignment.repository.AssignmentRepository;
import com.codeclassroom.course.repository.CourseRepository;
import com.codeclassroom.course.model.Course;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;
import org.springframework.context.annotation.DependsOn;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@DependsOn("courseService")
public class AssignmentService {
    private final AssignmentRepository assignmentRepository;
    private final CourseRepository courseRepository;

    public AssignmentService(AssignmentRepository assignmentRepository, CourseRepository courseRepository) {
        this.assignmentRepository = assignmentRepository;
        this.courseRepository = courseRepository;
    }

    @PostConstruct
    public void init() {
        Course cs101 = courseRepository.findByCourseCode("CS101");
        if (cs101 != null && !assignmentRepository.existsByTitleAndCourseId("Hello World in Java", cs101.getId())) {
            assignmentRepository.save(Assignment.builder()
                    .courseId(cs101.getId())
                    .title("Hello World in Java")
                    .description("Write a basic Hello World program in Java.")
                    .deadline(LocalDateTime.now().plusDays(7))
                    .totalMarks(10)
                    .allowedLanguage(Language.JAVA)
                    .build());
        }

        Course cs201 = courseRepository.findByCourseCode("CS201");
        if (cs201 != null && !assignmentRepository.existsByTitleAndCourseId("Array Manipulation", cs201.getId())) {
            assignmentRepository.save(Assignment.builder()
                    .courseId(cs201.getId())
                    .title("Array Manipulation")
                    .description("Implement a dynamic array in Python.")
                    .deadline(LocalDateTime.now().plusDays(14))
                    .totalMarks(20)
                    .allowedLanguage(Language.PYTHON)
                    .build());
        }
    }

    public List<AssignmentDto> getAllAssignments() {
        return assignmentRepository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public Optional<AssignmentDto> getAssignmentById(Long id) {
        return assignmentRepository.findById(id).map(this::mapToDto);
    }

    public List<AssignmentDto> getAssignmentsByCourseId(Long courseId) {
        return assignmentRepository.findByCourseId(courseId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public AssignmentDto createAssignment(AssignmentRequest request) {
        Assignment assignment = Assignment.builder()
                .courseId(request.getCourseId())
                .title(request.getTitle())
                .description(request.getDescription())
                .deadline(request.getDeadline())
                .totalMarks(request.getTotalMarks())
                .allowedLanguage(request.getAllowedLanguage())
                .build();
        Assignment savedAssignment = assignmentRepository.save(assignment);
        return mapToDto(savedAssignment);
    }

    public Optional<AssignmentDto> updateAssignment(Long id, AssignmentRequest request) {
        return assignmentRepository.findById(id).map(assignment -> {
            assignment.setCourseId(request.getCourseId());
            assignment.setTitle(request.getTitle());
            assignment.setDescription(request.getDescription());
            assignment.setDeadline(request.getDeadline());
            assignment.setTotalMarks(request.getTotalMarks());
            assignment.setAllowedLanguage(request.getAllowedLanguage());
            return mapToDto(assignmentRepository.save(assignment));
        });
    }

    public boolean deleteAssignment(Long id) {
        if (assignmentRepository.existsById(id)) {
            assignmentRepository.deleteById(id);
            return true;
        }
        return false;
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
