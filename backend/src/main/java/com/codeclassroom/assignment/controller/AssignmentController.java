package com.codeclassroom.assignment.controller;

import com.codeclassroom.assignment.dto.AssignmentDto;
import com.codeclassroom.assignment.dto.AssignmentRequest;
import com.codeclassroom.assignment.service.AssignmentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class AssignmentController {

    private final AssignmentService assignmentService;

    public AssignmentController(AssignmentService assignmentService) {
        this.assignmentService = assignmentService;
    }

    @GetMapping("/assignments")
    public ResponseEntity<List<AssignmentDto>> getAllAssignments() {
        return ResponseEntity.ok(assignmentService.getAllAssignments());
    }

    @GetMapping("/assignments/{id}")
    public ResponseEntity<AssignmentDto> getAssignmentById(@PathVariable Long id) {
        return assignmentService.getAssignmentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/courses/{courseId}/assignments")
    public ResponseEntity<List<AssignmentDto>> getAssignmentsByCourseId(@PathVariable Long courseId) {
        return ResponseEntity.ok(assignmentService.getAssignmentsByCourseId(courseId));
    }

    @PostMapping("/assignments")
    public ResponseEntity<?> createAssignment(@RequestBody AssignmentRequest request) {
        if (!isValid(request)) {
            return ResponseEntity.badRequest().body("Validation failed: title, courseId, description, and totalMarks are required.");
        }
        AssignmentDto createdAssignment = assignmentService.createAssignment(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdAssignment);
    }

    @PutMapping("/assignments/{id}")
    public ResponseEntity<?> updateAssignment(@PathVariable Long id, @RequestBody AssignmentRequest request) {
        if (!isValid(request)) {
            return ResponseEntity.badRequest().body("Validation failed: title, courseId, description, and totalMarks are required.");
        }
        return assignmentService.updateAssignment(id, request)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/assignments/{id}")
    public ResponseEntity<Void> deleteAssignment(@PathVariable Long id) {
        if (assignmentService.deleteAssignment(id)) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    private boolean isValid(AssignmentRequest request) {
        return request.getCourseId() != null &&
               StringUtils.hasText(request.getTitle()) &&
               StringUtils.hasText(request.getDescription()) &&
               request.getTotalMarks() != null;
    }
}
