package com.codeclassroom.examattempt.model;

import com.codeclassroom.common.model.Language;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "exam_answers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExamAnswer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long attemptId;

    private Long questionId;

    @Column(columnDefinition = "TEXT")
    private String code;

    @Enumerated(EnumType.STRING)
    private Language language;

    private LocalDateTime lastSavedAt;

    private LocalDateTime submittedAt;

    @Enumerated(EnumType.STRING)
    private ExamAnswerStatus status;
}
