package com.codeclassroom.exam.controller;

import com.codeclassroom.exam.dto.ExamDto;
import com.codeclassroom.exam.dto.ExamQuestionDto;
import com.codeclassroom.exam.service.ExamService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ExamController {
    private final ExamService examService;

    public ExamController(ExamService examService) {
        this.examService = examService;
    }

    @GetMapping("/exams")
    public ResponseEntity<List<ExamDto>> getAllExams() {
        return ResponseEntity.ok(examService.getAllExams());
    }

    @GetMapping("/courses/{courseId}/exams")
    public ResponseEntity<List<ExamDto>> getExamsByCourseId(@PathVariable Long courseId) {
        return ResponseEntity.ok(examService.getExamsByCourseId(courseId));
    }

    @GetMapping("/exams/{id}")
    public ResponseEntity<ExamDto> getExamById(@PathVariable Long id) {
        ExamDto dto = examService.getExamById(id);
        return dto != null ? ResponseEntity.ok(dto) : ResponseEntity.notFound().build();
    }

    @PostMapping("/exams")
    public ResponseEntity<ExamDto> createExam(@RequestBody ExamDto dto) {
        return ResponseEntity.ok(examService.createExam(dto));
    }

    @PutMapping("/exams/{id}")
    public ResponseEntity<ExamDto> updateExam(@PathVariable Long id, @RequestBody ExamDto dto) {
        ExamDto updated = examService.updateExam(id, dto);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/exams/{id}")
    public ResponseEntity<Void> deleteExam(@PathVariable Long id) {
        examService.deleteExam(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/exams/{id}/publish")
    public ResponseEntity<ExamDto> publishExam(@PathVariable Long id) {
        return ResponseEntity.ok(examService.publishExam(id));
    }

    @PostMapping("/exams/{id}/start")
    public ResponseEntity<ExamDto> startExam(@PathVariable Long id) {
        return ResponseEntity.ok(examService.startExam(id));
    }

    @PostMapping("/exams/{id}/extend")
    public ResponseEntity<ExamDto> extendExam(@PathVariable Long id, @RequestParam Integer minutes) {
        return ResponseEntity.ok(examService.extendExam(id, minutes));
    }

    @GetMapping("/exams/{examId}/questions")
    public ResponseEntity<List<ExamQuestionDto>> getQuestionsByExamId(@PathVariable Long examId) {
        return ResponseEntity.ok(examService.getQuestionsByExamId(examId));
    }

    @GetMapping("/exam-questions/{id}")
    public ResponseEntity<ExamQuestionDto> getQuestionById(@PathVariable Long id) {
        ExamQuestionDto dto = examService.getQuestionById(id);
        return dto != null ? ResponseEntity.ok(dto) : ResponseEntity.notFound().build();
    }

    @PostMapping("/exams/{examId}/questions")
    public ResponseEntity<ExamQuestionDto> createQuestion(@PathVariable Long examId, @RequestBody ExamQuestionDto dto) {
        return ResponseEntity.ok(examService.createQuestion(examId, dto));
    }

    @PutMapping("/exam-questions/{id}")
    public ResponseEntity<ExamQuestionDto> updateQuestion(@PathVariable Long id, @RequestBody ExamQuestionDto dto) {
        ExamQuestionDto updated = examService.updateQuestion(id, dto);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/exam-questions/{id}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable Long id) {
        examService.deleteQuestion(id);
        return ResponseEntity.noContent().build();
    }
}
