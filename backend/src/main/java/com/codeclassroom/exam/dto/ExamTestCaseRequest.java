package com.codeclassroom.exam.dto;

import lombok.Data;

/**
 * Create/update payload for a grading test case.
 *
 * <p>Kept as a plain structured model so a future file importer (e.g. a .zip of
 * {@code 1.in}/{@code 1.out} pairs) only needs to parse files into a list of
 * these and pass them to {@code ExamTestCaseService}.</p>
 */
@Data
public class ExamTestCaseRequest {
    /** Optional. If omitted on create, the next number is assigned automatically. */
    private Integer testCaseNumber;
    private String input;
    private String expectedOutput;
}
