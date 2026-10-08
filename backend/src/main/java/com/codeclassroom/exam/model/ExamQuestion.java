package com.codeclassroom.exam.model;

import com.codeclassroom.common.model.Language;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "exam_questions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExamQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long examId;

    private Integer questionNumber;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String problemStatement;

    @Column(columnDefinition = "TEXT")
    private String inputDescription;

    @Column(columnDefinition = "TEXT")
    private String outputDescription;

    @Column(columnDefinition = "TEXT")
    private String constraints;

    @Column(columnDefinition = "TEXT")
    private String sampleInput;

    @Column(columnDefinition = "TEXT")
    private String sampleOutput;

    private Integer marks;

    @Enumerated(EnumType.STRING)
    private Language allowedLanguage;

    // Hidden grading test cases are stored separately in ExamTestCase (exam_test_cases)
    // and are intentionally NOT part of this entity or ExamQuestionDto, so they can
    // never leak through the student-facing question APIs.
}
