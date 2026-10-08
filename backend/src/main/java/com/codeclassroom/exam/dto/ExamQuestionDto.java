package com.codeclassroom.exam.dto;

import com.codeclassroom.common.model.Language;
import lombok.Data;

@Data
public class ExamQuestionDto {
    private Long id;
    private Long examId;
    private Integer questionNumber;
    private String title;
    private String problemStatement;
    private String inputDescription;
    private String outputDescription;
    private String constraints;
    private String sampleInput;
    private String sampleOutput;
    private Integer marks;
    private Language allowedLanguage;
}
