package com.codeclassroom.exam.service;

import com.codeclassroom.exam.dto.ExamTestCaseDto;
import com.codeclassroom.exam.dto.ExamTestCaseRequest;
import com.codeclassroom.exam.model.Exam;
import com.codeclassroom.exam.model.ExamQuestion;
import com.codeclassroom.exam.model.ExamTestCase;
import com.codeclassroom.exam.repository.ExamQuestionRepository;
import com.codeclassroom.exam.repository.ExamRepository;
import com.codeclassroom.exam.repository.ExamTestCaseRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

/**
 * CRUD for teacher-side grading test cases.
 *
 * <p>Every public method that is reachable over HTTP enforces that the current
 * user is the TEACHER who owns the Course of the Exam that the question belongs to.
 * Students have no code path to these records.</p>
 */
@Service
public class ExamTestCaseService {

    /** Generous per-field cap (~100 KB) to keep rows reasonable while allowing large inputs. */
    static final int MAX_FIELD_LENGTH = 100_000;

    private final ExamTestCaseRepository testCaseRepository;
    private final ExamQuestionRepository questionRepository;
    private final ExamRepository examRepository;
    private final ExamService examService;

    public ExamTestCaseService(ExamTestCaseRepository testCaseRepository,
                               ExamQuestionRepository questionRepository,
                               ExamRepository examRepository,
                               ExamService examService) {
        this.testCaseRepository = testCaseRepository;
        this.questionRepository = questionRepository;
        this.examRepository = examRepository;
        this.examService = examService;
    }

    // ─── Teacher-facing (HTTP) ────────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<ExamTestCaseDto> getTestCases(Long questionId) {
        requireOwnedQuestion(questionId);
        return testCaseRepository.findByQuestionIdOrderByTestCaseNumberAsc(questionId)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional
    public ExamTestCaseDto createTestCase(Long questionId, ExamTestCaseRequest request) {
        requireOwnedQuestion(questionId);
        validate(request);

        int nextNumber = (int) testCaseRepository.countByQuestionId(questionId) + 1;
        ExamTestCase testCase = ExamTestCase.builder()
                .questionId(questionId)
                .testCaseNumber(nextNumber)
                .input(normalize(request.getInput()))
                .expectedOutput(normalize(request.getExpectedOutput()))
                .build();
        return toDto(testCaseRepository.save(testCase));
    }

    @Transactional
    public ExamTestCaseDto updateTestCase(Long testCaseId, ExamTestCaseRequest request) {
        ExamTestCase existing = testCaseRepository.findById(testCaseId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Test case not found"));
        requireOwnedQuestion(existing.getQuestionId());
        validate(request);

        existing.setInput(normalize(request.getInput()));
        existing.setExpectedOutput(normalize(request.getExpectedOutput()));
        return toDto(testCaseRepository.save(existing));
    }

    @Transactional
    public void deleteTestCase(Long testCaseId) {
        ExamTestCase existing = testCaseRepository.findById(testCaseId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Test case not found"));
        Long questionId = existing.getQuestionId();
        requireOwnedQuestion(questionId);

        testCaseRepository.delete(existing);
        testCaseRepository.flush();
        renumber(questionId);
    }

    // ─── Internal (NOT exposed over HTTP) ─────────────────────────────────

    /**
     * Returns the ordered grading test cases for a question WITHOUT an ownership check.
     * Reserved for the future server-side grading pipeline; must never be wired to a
     * student-reachable endpoint.
     */
    @Transactional(readOnly = true)
    public List<ExamTestCase> getTestCasesForGrading(Long questionId) {
        return testCaseRepository.findByQuestionIdOrderByTestCaseNumberAsc(questionId);
    }

    // ─── Helpers ──────────────────────────────────────────────────────────

    private void requireOwnedQuestion(Long questionId) {
        ExamQuestion question = questionRepository.findById(questionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Question not found"));
        Exam exam = examRepository.findById(question.getExamId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Exam not found"));
        examService.checkTeacherOwnership(exam.getCourseId());
    }

    private void validate(ExamTestCaseRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Test case payload is required");
        }
        String input = request.getInput() == null ? "" : request.getInput();
        String expected = request.getExpectedOutput();
        if (expected == null || expected.isBlank()) {
            throw new IllegalArgumentException("Expected output is required");
        }
        if (input.length() > MAX_FIELD_LENGTH) {
            throw new IllegalArgumentException("Input exceeds " + MAX_FIELD_LENGTH + " characters");
        }
        if (expected.length() > MAX_FIELD_LENGTH) {
            throw new IllegalArgumentException("Expected output exceeds " + MAX_FIELD_LENGTH + " characters");
        }
    }

    /** Normalizes Windows line endings so future output comparison is platform-independent. */
    private String normalize(String value) {
        return value == null ? "" : value.replace("\r\n", "\n");
    }

    /** Keeps test case numbers contiguous (1..N) after a deletion. */
    private void renumber(Long questionId) {
        List<ExamTestCase> remaining = testCaseRepository.findByQuestionIdOrderByTestCaseNumberAsc(questionId);
        for (int i = 0; i < remaining.size(); i++) {
            ExamTestCase tc = remaining.get(i);
            if (tc.getTestCaseNumber() == null || tc.getTestCaseNumber() != i + 1) {
                tc.setTestCaseNumber(i + 1);
                testCaseRepository.save(tc);
            }
        }
    }

    private ExamTestCaseDto toDto(ExamTestCase tc) {
        ExamTestCaseDto dto = new ExamTestCaseDto();
        dto.setId(tc.getId());
        dto.setQuestionId(tc.getQuestionId());
        dto.setTestCaseNumber(tc.getTestCaseNumber());
        dto.setInput(tc.getInput());
        dto.setExpectedOutput(tc.getExpectedOutput());
        dto.setCreatedAt(tc.getCreatedAt());
        dto.setUpdatedAt(tc.getUpdatedAt());
        return dto;
    }
}
