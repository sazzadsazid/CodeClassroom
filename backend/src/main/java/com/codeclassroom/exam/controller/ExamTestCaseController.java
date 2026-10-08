package com.codeclassroom.exam.controller;

import com.codeclassroom.exam.dto.ExamTestCaseDto;
import com.codeclassroom.exam.dto.ExamTestCaseRequest;
import com.codeclassroom.exam.service.ExamTestCaseService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Teacher-only endpoints for hidden grading test cases.
 * URL-level access is restricted to ROLE_TEACHER in SecurityConfig, and
 * course ownership is enforced in {@link ExamTestCaseService}.
 */
@RestController
@RequestMapping("/api")
public class ExamTestCaseController {

    private final ExamTestCaseService testCaseService;

    public ExamTestCaseController(ExamTestCaseService testCaseService) {
        this.testCaseService = testCaseService;
    }

    @GetMapping("/exam-questions/{questionId}/test-cases")
    public ResponseEntity<List<ExamTestCaseDto>> getTestCases(@PathVariable Long questionId) {
        return ResponseEntity.ok(testCaseService.getTestCases(questionId));
    }

    @PostMapping("/exam-questions/{questionId}/test-cases")
    public ResponseEntity<ExamTestCaseDto> createTestCase(@PathVariable Long questionId,
                                                          @RequestBody ExamTestCaseRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(testCaseService.createTestCase(questionId, request));
    }

    @PutMapping("/exam-test-cases/{id}")
    public ResponseEntity<ExamTestCaseDto> updateTestCase(@PathVariable Long id,
                                                          @RequestBody ExamTestCaseRequest request) {
        return ResponseEntity.ok(testCaseService.updateTestCase(id, request));
    }

    @DeleteMapping("/exam-test-cases/{id}")
    public ResponseEntity<Void> deleteTestCase(@PathVariable Long id) {
        testCaseService.deleteTestCase(id);
        return ResponseEntity.noContent().build();
    }
}
