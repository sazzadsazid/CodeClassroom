package com.codeclassroom.examattempt.controller;

import com.codeclassroom.examattempt.dto.ExamAnswerDto;
import com.codeclassroom.examattempt.dto.ExamAttemptDto;
import com.codeclassroom.examattempt.service.ExamAttemptService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ExamAttemptController {
    private final ExamAttemptService examAttemptService;

    public ExamAttemptController(ExamAttemptService examAttemptService) {
        this.examAttemptService = examAttemptService;
    }

    @PostMapping("/exams/{examId}/attempts")
    public ResponseEntity<ExamAttemptDto> createAttempt(@PathVariable Long examId, @RequestBody ExamAttemptDto dto) {
        return ResponseEntity.ok(examAttemptService.createAttempt(examId, dto));
    }

    @GetMapping("/exam-attempts/{id}")
    public ResponseEntity<ExamAttemptDto> getAttemptById(@PathVariable Long id) {
        ExamAttemptDto dto = examAttemptService.getAttemptById(id);
        return dto != null ? ResponseEntity.ok(dto) : ResponseEntity.notFound().build();
    }

    @GetMapping("/students/{studentId}/exam-attempts")
    public ResponseEntity<List<ExamAttemptDto>> getAttemptsByStudentId(@PathVariable Long studentId) {
        return ResponseEntity.ok(examAttemptService.getAttemptsByStudentId(studentId));
    }

    @GetMapping("/exams/{examId}/attempts")
    public ResponseEntity<List<ExamAttemptDto>> getAttemptsByExamId(@PathVariable Long examId) {
        return ResponseEntity.ok(examAttemptService.getAttemptsByExamId(examId));
    }

    @GetMapping("/exam-attempts/{attemptId}/answers")
    public ResponseEntity<List<ExamAnswerDto>> getAnswersByAttemptId(@PathVariable Long attemptId) {
        return ResponseEntity.ok(examAttemptService.getAnswersByAttemptId(attemptId));
    }

    @GetMapping("/exam-answers/{id}")
    public ResponseEntity<ExamAnswerDto> getAnswerById(@PathVariable Long id) {
        ExamAnswerDto dto = examAttemptService.getAnswerById(id);
        return dto != null ? ResponseEntity.ok(dto) : ResponseEntity.notFound().build();
    }

    @PostMapping("/exam-attempts/{attemptId}/answers")
    public ResponseEntity<ExamAnswerDto> createAnswer(@PathVariable Long attemptId, @RequestBody ExamAnswerDto dto) {
        return ResponseEntity.ok(examAttemptService.createAnswer(attemptId, dto));
    }

    @PutMapping("/exam-answers/{id}")
    public ResponseEntity<ExamAnswerDto> updateAnswer(@PathVariable Long id, @RequestBody ExamAnswerDto dto) {
        ExamAnswerDto updated = examAttemptService.updateAnswer(id, dto);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @PostMapping("/exam-attempts/{attemptId}/submit")
    public ResponseEntity<ExamAttemptDto> submitAttempt(@PathVariable Long attemptId) {
        ExamAttemptDto submitted = examAttemptService.submitAttempt(attemptId);
        return submitted != null ? ResponseEntity.ok(submitted) : ResponseEntity.notFound().build();
    }

    @GetMapping("/exam-attempts/{attemptId}/answers/{questionId}/download")
    public ResponseEntity<byte[]> downloadAnswerFile(@PathVariable Long attemptId, @PathVariable Long questionId) {
        return examAttemptService.downloadAnswerFile(attemptId, questionId);
    }

    @GetMapping("/exam-attempts/{attemptId}/download-all")
    public ResponseEntity<byte[]> downloadAllAnswers(@PathVariable Long attemptId) {
        return examAttemptService.downloadAllAnswers(attemptId);
    }
}
