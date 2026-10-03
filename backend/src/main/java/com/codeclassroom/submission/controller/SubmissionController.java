package com.codeclassroom.submission.controller;

import com.codeclassroom.submission.dto.SubmissionDto;
import com.codeclassroom.submission.dto.SubmissionRequest;
import com.codeclassroom.submission.service.SubmissionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class SubmissionController {

    private final SubmissionService submissionService;

    public SubmissionController(SubmissionService submissionService) {
        this.submissionService = submissionService;
    }

    @GetMapping("/submissions")
    public ResponseEntity<List<SubmissionDto>> getAllSubmissions() {
        return ResponseEntity.ok(submissionService.getAllSubmissions());
    }

    @GetMapping("/submissions/{id}")
    public ResponseEntity<SubmissionDto> getSubmissionById(@PathVariable Long id) {
        return submissionService.getSubmissionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/assignments/{assignmentId}/submissions")
    public ResponseEntity<List<SubmissionDto>> getSubmissionsByAssignmentId(@PathVariable Long assignmentId) {
        return ResponseEntity.ok(submissionService.getSubmissionsByAssignmentId(assignmentId));
    }

    @GetMapping("/students/{studentId}/submissions")
    public ResponseEntity<List<SubmissionDto>> getSubmissionsByStudentId(@PathVariable Long studentId) {
        return ResponseEntity.ok(submissionService.getSubmissionsByStudentId(studentId));
    }

    @PostMapping("/submissions")
    public ResponseEntity<?> createSubmission(@RequestBody SubmissionRequest request) {
        if (!isValid(request)) {
            return ResponseEntity.badRequest().body("Validation failed: assignmentId, studentId, code, and language are required.");
        }
        SubmissionDto createdSubmission = submissionService.createSubmission(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdSubmission);
    }

    private boolean isValid(SubmissionRequest request) {
        return request.getAssignmentId() != null &&
               request.getStudentId() != null &&
               StringUtils.hasText(request.getCode()) &&
               request.getLanguage() != null;
    }
}
