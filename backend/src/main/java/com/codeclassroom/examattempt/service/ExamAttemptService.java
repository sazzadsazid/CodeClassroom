package com.codeclassroom.examattempt.service;

import com.codeclassroom.examattempt.dto.ExamAnswerDto;
import com.codeclassroom.examattempt.dto.ExamAttemptDto;
import com.codeclassroom.examattempt.model.ExamAnswer;
import com.codeclassroom.examattempt.model.ExamAttempt;
import com.codeclassroom.examattempt.repository.ExamAnswerRepository;
import com.codeclassroom.examattempt.repository.ExamAttemptRepository;
import com.codeclassroom.exam.repository.ExamRepository;
import com.codeclassroom.exam.repository.ExamQuestionRepository;
import com.codeclassroom.exam.model.Exam;
import com.codeclassroom.exam.model.ExamQuestion;
import com.codeclassroom.exam.model.ExamStatus;
import org.springframework.stereotype.Service;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import java.util.List;
import java.util.stream.Collectors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;
import java.io.ByteArrayOutputStream;

@Service
public class ExamAttemptService {
    private final ExamAttemptRepository examAttemptRepository;
    private final ExamAnswerRepository examAnswerRepository;
    private final ExamRepository examRepository;
    private final ExamQuestionRepository examQuestionRepository;

    public ExamAttemptService(ExamAttemptRepository examAttemptRepository, ExamAnswerRepository examAnswerRepository, ExamRepository examRepository, ExamQuestionRepository examQuestionRepository) {
        this.examAttemptRepository = examAttemptRepository;
        this.examAnswerRepository = examAnswerRepository;
        this.examRepository = examRepository;
        this.examQuestionRepository = examQuestionRepository;
    }

    public ExamAttemptDto createAttempt(Long examId, ExamAttemptDto dto) {
        if (dto.getStudentId() == null) {
            com.codeclassroom.auth.filter.CustomUserDetails user = com.codeclassroom.auth.util.SecurityUtils.getCurrentUser();
            if (user != null) {
                dto.setStudentId(user.getId());
            }
        }
        com.codeclassroom.auth.util.SecurityUtils.checkStudentOwnership(dto.getStudentId());

        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new RuntimeException("Exam not found"));

        if (exam.getStatus() != ExamStatus.ONGOING) {
            throw new RuntimeException("Cannot create or enter attempt. Exam is not ONGOING.");
        }
        
        java.util.Optional<ExamAttempt> existing = examAttemptRepository.findByExamIdAndStudentId(examId, dto.getStudentId());
        if (existing.isPresent() && existing.get().getStatus() == com.codeclassroom.examattempt.model.ExamAttemptStatus.IN_PROGRESS) {
            return mapToDto(existing.get());
        }

        ExamAttempt attempt = mapToEntity(dto);
        attempt.setExamId(examId);
        attempt.setStatus(com.codeclassroom.examattempt.model.ExamAttemptStatus.IN_PROGRESS);
        attempt.setStartedAt(java.time.LocalDateTime.now());
        return mapToDto(examAttemptRepository.save(attempt));
    }

    public ExamAttemptDto getAttemptById(Long id) {
        return examAttemptRepository.findById(id).map(attempt -> {
            com.codeclassroom.auth.util.SecurityUtils.checkStudentOwnership(attempt.getStudentId());
            return mapToDto(attempt);
        }).orElse(null);
    }

    public List<ExamAttemptDto> getAttemptsByStudentId(Long studentId) {
        com.codeclassroom.auth.util.SecurityUtils.checkStudentOwnership(studentId);
        return examAttemptRepository.findByStudentId(studentId).stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public List<ExamAttemptDto> getAttemptsByExamId(Long examId) {
        return examAttemptRepository.findByExamId(examId).stream().map(this::mapToDto).collect(Collectors.toList());
    }
    
    public ExamAttemptDto submitAttempt(Long attemptId) {
        return examAttemptRepository.findById(attemptId).map(attempt -> {
            com.codeclassroom.auth.util.SecurityUtils.checkStudentOwnership(attempt.getStudentId());

            if (attempt.getStatus() != com.codeclassroom.examattempt.model.ExamAttemptStatus.IN_PROGRESS) {
                throw new IllegalArgumentException("Attempt is not IN_PROGRESS");
            }

            Exam exam = examRepository.findById(attempt.getExamId())
                    .orElseThrow(() -> new IllegalArgumentException("Exam not found"));

            if (!isExamActive(exam)) {
                attempt.setStatus(com.codeclassroom.examattempt.model.ExamAttemptStatus.TIME_EXPIRED);
                examAttemptRepository.save(attempt);
                throw new IllegalArgumentException("Exam has already expired");
            }

            attempt.setStatus(com.codeclassroom.examattempt.model.ExamAttemptStatus.SUBMITTED);
            attempt.setSubmittedAt(java.time.LocalDateTime.now());
            return mapToDto(examAttemptRepository.save(attempt));
        }).orElse(null);
    }

    // Answers
    public List<ExamAnswerDto> getAnswersByAttemptId(Long attemptId) {
        examAttemptRepository.findById(attemptId).ifPresent(attempt ->
            com.codeclassroom.auth.util.SecurityUtils.checkStudentOwnership(attempt.getStudentId())
        );
        return examAnswerRepository.findByAttemptId(attemptId).stream()
                .sorted(java.util.Comparator.comparing(ExamAnswer::getQuestionId))
                .map(this::mapAnswerToDto)
                .collect(Collectors.toList());
    }

    public ExamAnswerDto getAnswerById(Long id) {
        return examAnswerRepository.findById(id).map(answer -> {
            examAttemptRepository.findById(answer.getAttemptId()).ifPresent(attempt ->
                com.codeclassroom.auth.util.SecurityUtils.checkStudentOwnership(attempt.getStudentId())
            );
            return mapAnswerToDto(answer);
        }).orElse(null);
    }

    public ExamAnswerDto createAnswer(Long attemptId, ExamAnswerDto dto) {
        ExamAttempt attempt = examAttemptRepository.findById(attemptId)
                .orElseThrow(() -> new RuntimeException("Attempt not found"));
                
        com.codeclassroom.auth.util.SecurityUtils.checkStudentOwnership(attempt.getStudentId());
        
        if (attempt.getStatus() != com.codeclassroom.examattempt.model.ExamAttemptStatus.IN_PROGRESS) {
            throw new RuntimeException("Attempt is not IN_PROGRESS");
        }
        
        Exam exam = examRepository.findById(attempt.getExamId())
                .orElseThrow(() -> new RuntimeException("Exam not found"));
        if (!isExamActive(exam)) {
            throw new RuntimeException("Exam is no longer active");
        }
        
        java.util.Optional<ExamAnswer> existing = examAnswerRepository.findByAttemptIdAndQuestionId(attemptId, dto.getQuestionId());
        if (existing.isPresent()) {
            return mapAnswerToDto(existing.get());
        }

        ExamAnswer answer = mapAnswerToEntity(dto);
        answer.setAttemptId(attemptId);
        if (answer.getCode() == null) answer.setCode("");
        answer.setLastSavedAt(java.time.LocalDateTime.now());
        answer.setStatus(com.codeclassroom.examattempt.model.ExamAnswerStatus.SAVED);
        return mapAnswerToDto(examAnswerRepository.save(answer));
    }

    public ExamAnswerDto updateAnswer(Long id, ExamAnswerDto dto) {
        return examAnswerRepository.findById(id).map(existing -> {
            ExamAttempt attempt = examAttemptRepository.findById(existing.getAttemptId())
                    .orElseThrow(() -> new RuntimeException("Attempt not found"));
            com.codeclassroom.auth.util.SecurityUtils.checkStudentOwnership(attempt.getStudentId());
            
            Exam exam = examRepository.findById(attempt.getExamId())
                    .orElseThrow(() -> new RuntimeException("Exam not found"));
            if (attempt.getStatus() != com.codeclassroom.examattempt.model.ExamAttemptStatus.IN_PROGRESS) {
                throw new IllegalArgumentException("Attempt is not IN_PROGRESS");
            }
            if (!isExamActive(exam)) {
                throw new IllegalArgumentException("Exam is no longer active");
            }

            existing.setCode(dto.getCode());
            existing.setLanguage(dto.getLanguage());
            existing.setLastSavedAt(java.time.LocalDateTime.now());
            return mapAnswerToDto(examAnswerRepository.save(existing));
        }).orElse(null);
    }

    private boolean isExamActive(Exam exam) {
        if (exam == null || exam.getStatus() != com.codeclassroom.exam.model.ExamStatus.ONGOING) {
            return false;
        }
        if (exam.getEndTime() == null) {
            return false;
        }
        return java.time.LocalDateTime.now().isBefore(exam.getEndTime());
    }

    public ResponseEntity<byte[]> downloadAnswerFile(Long attemptId, Long questionId) {
        ExamAttempt attempt = examAttemptRepository.findById(attemptId)
                .orElseThrow(() -> new RuntimeException("Attempt not found"));
        com.codeclassroom.auth.util.SecurityUtils.checkStudentOwnership(attempt.getStudentId());

        ExamAnswer answer = examAnswerRepository.findByAttemptIdAndQuestionId(attemptId, questionId)
                .orElseThrow(() -> new RuntimeException("Answer not found"));

        ExamQuestion question = examQuestionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));
        
        if (!question.getExamId().equals(attempt.getExamId())) {
            throw new RuntimeException("Question does not belong to this exam attempt");
        }

        String fileName = generateFileName(question, answer);
        byte[] content = (answer.getCode() != null ? answer.getCode() : "").getBytes(java.nio.charset.StandardCharsets.UTF_8);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(content);
    }

    public ResponseEntity<byte[]> downloadAllAnswers(Long attemptId) {
        ExamAttempt attempt = examAttemptRepository.findById(attemptId)
                .orElseThrow(() -> new RuntimeException("Attempt not found"));
        com.codeclassroom.auth.util.SecurityUtils.checkStudentOwnership(attempt.getStudentId());

        Exam exam = examRepository.findById(attempt.getExamId())
                .orElseThrow(() -> new RuntimeException("Exam not found"));

        List<ExamAnswer> answers = examAnswerRepository.findByAttemptId(attemptId);
        List<ExamQuestion> questions = examQuestionRepository.findByExamIdOrderByQuestionNumberAsc(exam.getId());

        try (ByteArrayOutputStream baos = new ByteArrayOutputStream();
             ZipOutputStream zos = new ZipOutputStream(baos)) {

            for (ExamQuestion question : questions) {
                ExamAnswer answer = answers.stream()
                        .filter(a -> a.getQuestionId().equals(question.getId()))
                        .findFirst()
                        .orElse(null);

                if (answer != null) {
                    String fileName = generateFileName(question, answer);
                    ZipEntry entry = new ZipEntry(fileName);
                    zos.putNextEntry(entry);
                    byte[] content = (answer.getCode() != null ? answer.getCode() : "").getBytes(java.nio.charset.StandardCharsets.UTF_8);
                    zos.write(content);
                    zos.closeEntry();
                }
            }
            zos.finish();

            String sanitizedExamTitle = (exam.getTitle() != null ? exam.getTitle().replaceAll("[^a-zA-Z0-9.\\-]", "_") : "Exam");
            String zipFileName = sanitizedExamTitle + "_Files.zip";

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + zipFileName + "\"")
                    .contentType(MediaType.parseMediaType("application/zip"))
                    .body(baos.toByteArray());

        } catch (Exception e) {
            throw new RuntimeException("Error generating ZIP file", e);
        }
    }

    private String generateFileName(ExamQuestion question, ExamAnswer answer) {
        String baseName = "Q" + question.getQuestionNumber() + "_" + (question.getTitle() != null ? question.getTitle().replaceAll("[^a-zA-Z0-9.\\-]", "_") : "Question");
        String extension = ".txt";
        String language = answer.getLanguage() != null ? answer.getLanguage().name() : (question.getAllowedLanguage() != null ? question.getAllowedLanguage().name() : "");
        
        switch (language.toUpperCase()) {
            case "JAVA":
                extension = ".java";
                break;
            case "PYTHON":
                extension = ".py";
                break;
            case "C":
                extension = ".c";
                break;
            case "CPP":
                extension = ".cpp";
                break;
            case "JAVASCRIPT":
                extension = ".js";
                break;
            default:
                extension = ".txt";
                break;
        }
        return baseName + extension;
    }

    private ExamAttemptDto mapToDto(ExamAttempt attempt) {
        ExamAttemptDto dto = new ExamAttemptDto();
        dto.setId(attempt.getId());
        dto.setExamId(attempt.getExamId());
        dto.setStudentId(attempt.getStudentId());
        dto.setStartedAt(attempt.getStartedAt());
        dto.setSubmittedAt(attempt.getSubmittedAt());
        dto.setStatus(attempt.getStatus());
        return dto;
    }

    private ExamAttempt mapToEntity(ExamAttemptDto dto) {
        return ExamAttempt.builder()
                .examId(dto.getExamId())
                .studentId(dto.getStudentId())
                .startedAt(dto.getStartedAt())
                .submittedAt(dto.getSubmittedAt())
                .status(dto.getStatus())
                .build();
    }

    private ExamAnswerDto mapAnswerToDto(ExamAnswer answer) {
        ExamAnswerDto dto = new ExamAnswerDto();
        dto.setId(answer.getId());
        dto.setAttemptId(answer.getAttemptId());
        dto.setQuestionId(answer.getQuestionId());
        dto.setCode(answer.getCode());
        dto.setLanguage(answer.getLanguage());
        dto.setLastSavedAt(answer.getLastSavedAt());
        dto.setSubmittedAt(answer.getSubmittedAt());
        dto.setStatus(answer.getStatus());
        return dto;
    }

    private ExamAnswer mapAnswerToEntity(ExamAnswerDto dto) {
        return ExamAnswer.builder()
                .attemptId(dto.getAttemptId())
                .questionId(dto.getQuestionId())
                .code(dto.getCode())
                .language(dto.getLanguage())
                .lastSavedAt(dto.getLastSavedAt())
                .submittedAt(dto.getSubmittedAt())
                .status(dto.getStatus())
                .build();
    }
}
