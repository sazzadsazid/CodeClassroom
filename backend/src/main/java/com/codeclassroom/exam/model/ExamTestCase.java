package com.codeclassroom.exam.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Teacher-side grading data for an {@link ExamQuestion}.
 *
 * <p>Test cases are NEVER exposed to students. The public examples shown to
 * students live on {@link ExamQuestion#getSampleInput()} /
 * {@link ExamQuestion#getSampleOutput()}.</p>
 *
 * <p>Future grading pipeline (not implemented yet):
 * compile student code -> run against each test case ordered by
 * {@code testCaseNumber} -> compare stdout with {@code expectedOutput}
 * -> calculate marks.</p>
 */
@Entity
@Table(name = "exam_test_cases", indexes = {
        @Index(name = "idx_exam_test_cases_question_id", columnList = "question_id")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExamTestCase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Owning question (follows the project's id-reference convention, e.g. ExamQuestion.examId). */
    @Column(name = "question_id", nullable = false)
    private Long questionId;

    @Column(name = "test_case_number", nullable = false)
    private Integer testCaseNumber;

    /** Raw stdin fed to the student program. May be empty for programs that read no input. */
    @Column(name = "input_data", columnDefinition = "TEXT", nullable = false)
    private String input;

    /** Exact stdout expected from a correct solution. */
    @Column(name = "expected_output", columnDefinition = "TEXT", nullable = false)
    private String expectedOutput;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
