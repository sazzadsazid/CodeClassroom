package com.codeclassroom.exam.service;

import com.codeclassroom.exam.dto.ExamDto;
import com.codeclassroom.exam.dto.ExamQuestionDto;
import com.codeclassroom.exam.model.Exam;
import com.codeclassroom.exam.model.ExamQuestion;
import com.codeclassroom.exam.repository.ExamQuestionRepository;
import com.codeclassroom.exam.repository.ExamRepository;
import com.codeclassroom.exam.repository.ExamTestCaseRepository;
import com.codeclassroom.course.repository.CourseRepository;
import com.codeclassroom.auth.util.SecurityUtils;
import com.codeclassroom.auth.filter.CustomUserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExamService {
    static final int MAX_MARKS_PER_QUESTION = 1000;
    static final int MAX_TITLE_LENGTH = 255;

    private final ExamRepository examRepository;
    private final ExamQuestionRepository examQuestionRepository;
    private final CourseRepository courseRepository;
    private final ExamTestCaseRepository examTestCaseRepository;

    public ExamService(ExamRepository examRepository, ExamQuestionRepository examQuestionRepository, CourseRepository courseRepository, ExamTestCaseRepository examTestCaseRepository) {
        this.examRepository = examRepository;
        this.examQuestionRepository = examQuestionRepository;
        this.courseRepository = courseRepository;
        this.examTestCaseRepository = examTestCaseRepository;
    }

    public List<ExamDto> getAllExams() {
        return examRepository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public ExamDto getExamById(Long id) {
        return examRepository.findById(id).map(this::mapToDto).orElse(null);
    }

    public List<ExamDto> getExamsByCourseId(Long courseId) {
        return examRepository.findByCourseId(courseId).stream().map(this::mapToDto).collect(Collectors.toList());
    }

    /**
     * Ensures the current user is a TEACHER who owns the given course.
     * Shared by exam, question and test-case management.
     */
    public void checkTeacherOwnership(Long courseId) {
        CustomUserDetails user = SecurityUtils.getCurrentUser();
        if (user == null || !"TEACHER".equals(user.getRole())) {
            throw new org.springframework.security.access.AccessDeniedException("Only a teacher can manage exams");
        }
        com.codeclassroom.course.model.Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        if (!course.getTeacherId().equals(user.getId())) {
            throw new org.springframework.security.access.AccessDeniedException("You do not own the course for this exam");
        }
    }

    public ExamDto createExam(ExamDto dto) {
        checkTeacherOwnership(dto.getCourseId());
        Exam exam = mapToEntity(dto);
        exam.setStatus(com.codeclassroom.exam.model.ExamStatus.DRAFT);
        if (exam.getStartTime() != null && exam.getDurationMinutes() != null) {
            exam.setEndTime(exam.getStartTime().plusMinutes(exam.getDurationMinutes()));
        }
        return mapToDto(examRepository.save(exam));
    }

    public ExamDto updateExam(Long id, ExamDto dto) {
        return examRepository.findById(id).map(existing -> {
            checkTeacherOwnership(existing.getCourseId());
            existing.setTitle(dto.getTitle());
            existing.setDescription(dto.getDescription());
            existing.setDurationMinutes(dto.getDurationMinutes());
            existing.setStartTime(dto.getStartTime());
            if (existing.getStartTime() != null && existing.getDurationMinutes() != null) {
                existing.setEndTime(existing.getStartTime().plusMinutes(existing.getDurationMinutes()));
            } else {
                existing.setEndTime(dto.getEndTime());
            }
            existing.setTotalMarks(dto.getTotalMarks());
            return mapToDto(examRepository.save(existing));
        }).orElse(null);
    }

    public void deleteExam(Long id) {
        examRepository.findById(id).ifPresent(exam -> {
            checkTeacherOwnership(exam.getCourseId());
            examRepository.deleteById(id);
        });
    }

    public ExamDto publishExam(Long examId) {
        return examRepository.findById(examId).map(exam -> {
            checkTeacherOwnership(exam.getCourseId());
            if (exam.getStatus() != com.codeclassroom.exam.model.ExamStatus.DRAFT) {
                throw new RuntimeException("Only a DRAFT exam can be published");
            }
            if (exam.getTitle() == null || exam.getTitle().trim().isEmpty()) {
                throw new RuntimeException("Cannot publish an exam without a title");
            }
            List<ExamQuestion> questions = examQuestionRepository.findByExamIdOrderByQuestionNumberAsc(examId);
            if (questions == null || questions.isEmpty()) {
                throw new RuntimeException("Cannot publish an exam with 0 questions");
            }
            if (exam.getTotalMarks() == null || exam.getTotalMarks() == 0) {
                throw new RuntimeException("Cannot publish an exam with 0 total marks");
            }
            
            exam.setStatus(com.codeclassroom.exam.model.ExamStatus.PUBLISHED);
            return mapToDto(examRepository.save(exam));
        }).orElse(null);
    }

    public ExamDto startExam(Long examId) {
        CustomUserDetails user = SecurityUtils.getCurrentUser();
        if (user == null || !"TEACHER".equals(user.getRole())) {
            throw new org.springframework.security.access.AccessDeniedException("Only a teacher can start an exam");
        }

        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new RuntimeException("Exam not found"));

        com.codeclassroom.course.model.Course course = courseRepository.findById(exam.getCourseId())
                .orElseThrow(() -> new RuntimeException("Course not found"));

        if (!course.getTeacherId().equals(user.getId())) {
            throw new org.springframework.security.access.AccessDeniedException("You do not own the course for this exam");
        }

        if (exam.getStatus() != com.codeclassroom.exam.model.ExamStatus.PUBLISHED) {
            throw new RuntimeException("Only a PUBLISHED exam can be started");
        }

        java.time.LocalDateTime now = java.time.LocalDateTime.now();
        exam.setStartTime(now);
        exam.setEndTime(now.plusMinutes(exam.getDurationMinutes() != null ? exam.getDurationMinutes() : 60));
        exam.setStatus(com.codeclassroom.exam.model.ExamStatus.ONGOING);

        return mapToDto(examRepository.save(exam));
    }

    public ExamDto extendExam(Long examId, Integer extraMinutes) {
        checkTeacherOwnership(examRepository.findById(examId)
                .orElseThrow(() -> new RuntimeException("Exam not found")).getCourseId());
        
        return examRepository.findById(examId).map(exam -> {
            if (exam.getEndTime() != null && extraMinutes != null && extraMinutes > 0) {
                exam.setEndTime(exam.getEndTime().plusMinutes(extraMinutes));
                if (exam.getDurationMinutes() != null) {
                    exam.setDurationMinutes(exam.getDurationMinutes() + extraMinutes);
                }
                examRepository.save(exam);
            }
            return mapToDto(exam);
        }).orElse(null);
    }

    public boolean isExamActive(Exam exam) {
        if (exam == null || exam.getStatus() != com.codeclassroom.exam.model.ExamStatus.ONGOING) {
            return false;
        }
        if (exam.getEndTime() == null) {
            return false;
        }
        return java.time.LocalDateTime.now().isBefore(exam.getEndTime());
    }

    // Question methods
    public List<ExamQuestionDto> getQuestionsByExamId(Long examId) {
        return examQuestionRepository.findByExamIdOrderByQuestionNumberAsc(examId).stream().map(this::mapQuestionToDto).collect(Collectors.toList());
    }

    public ExamQuestionDto getQuestionById(Long id) {
        return examQuestionRepository.findById(id).map(this::mapQuestionToDto).orElse(null);
    }

    public ExamQuestionDto createQuestion(Long examId, ExamQuestionDto dto) {
        Exam exam = examRepository.findById(examId).orElseThrow(() -> new RuntimeException("Exam not found"));
        checkTeacherOwnership(exam.getCourseId());
        validateQuestion(dto);
        
        ExamQuestion question = mapQuestionToEntity(dto);
        question.setExamId(examId);
        if (question.getQuestionNumber() == null || question.getQuestionNumber() < 1) {
            question.setQuestionNumber(nextQuestionNumber(examId));
        }
        ExamQuestion saved = examQuestionRepository.save(question);
        
        // update exam marks
        updateExamTotalMarks(examId);
        return mapQuestionToDto(saved);
    }

    public ExamQuestionDto updateQuestion(Long id, ExamQuestionDto dto) {
        return examQuestionRepository.findById(id).map(existing -> {
            Exam exam = examRepository.findById(existing.getExamId()).orElseThrow(() -> new RuntimeException("Exam not found"));
            checkTeacherOwnership(exam.getCourseId());
            validateQuestion(dto);
            
            if (dto.getQuestionNumber() != null && dto.getQuestionNumber() > 0) {
                existing.setQuestionNumber(dto.getQuestionNumber());
            }
            existing.setTitle(dto.getTitle());
            existing.setProblemStatement(dto.getProblemStatement());
            existing.setInputDescription(dto.getInputDescription());
            existing.setOutputDescription(dto.getOutputDescription());
            existing.setConstraints(dto.getConstraints());
            existing.setSampleInput(dto.getSampleInput());
            existing.setSampleOutput(dto.getSampleOutput());
            existing.setMarks(dto.getMarks());
            existing.setAllowedLanguage(dto.getAllowedLanguage());
            
            ExamQuestion saved = examQuestionRepository.save(existing);
            updateExamTotalMarks(existing.getExamId());
            return mapQuestionToDto(saved);
        }).orElse(null);
    }

    @Transactional
    public void deleteQuestion(Long id) {
        examQuestionRepository.findById(id).ifPresent(question -> {
            Exam exam = examRepository.findById(question.getExamId()).orElseThrow(() -> new RuntimeException("Exam not found"));
            checkTeacherOwnership(exam.getCourseId());
            // Remove the question's hidden grading test cases so none are orphaned.
            examTestCaseRepository.deleteByQuestionId(id);
            examQuestionRepository.deleteById(id);
            updateExamTotalMarks(exam.getId());
        });
    }

    private void validateQuestion(ExamQuestionDto dto) {
        if (dto == null) {
            throw new IllegalArgumentException("Question payload is required");
        }
        if (dto.getTitle() == null || dto.getTitle().isBlank()) {
            throw new IllegalArgumentException("Question title is required");
        }
        if (dto.getTitle().length() > MAX_TITLE_LENGTH) {
            throw new IllegalArgumentException("Question title must be at most " + MAX_TITLE_LENGTH + " characters");
        }
        if (dto.getProblemStatement() == null || dto.getProblemStatement().isBlank()) {
            throw new IllegalArgumentException("Problem statement is required");
        }
        if (dto.getMarks() == null || dto.getMarks() < 1 || dto.getMarks() > MAX_MARKS_PER_QUESTION) {
            throw new IllegalArgumentException("Marks must be between 1 and " + MAX_MARKS_PER_QUESTION);
        }
        if (dto.getAllowedLanguage() == null) {
            throw new IllegalArgumentException("Allowed language is required");
        }
        dto.setTitle(dto.getTitle().trim());
    }

    private int nextQuestionNumber(Long examId) {
        return examQuestionRepository.findByExamIdOrderByQuestionNumberAsc(examId).stream()
                .map(ExamQuestion::getQuestionNumber)
                .filter(n -> n != null)
                .mapToInt(Integer::intValue)
                .max().orElse(0) + 1;
    }
    
    private void updateExamTotalMarks(Long examId) {
        int totalMarks = examQuestionRepository.findByExamIdOrderByQuestionNumberAsc(examId)
            .stream().mapToInt(q -> q.getMarks() != null ? q.getMarks() : 0).sum();
        examRepository.findById(examId).ifPresent(exam -> {
            exam.setTotalMarks(totalMarks);
            examRepository.save(exam);
        });
    }

    private ExamDto mapToDto(Exam exam) {
        ExamDto dto = new ExamDto();
        dto.setId(exam.getId());
        dto.setCourseId(exam.getCourseId());
        dto.setTitle(exam.getTitle());
        dto.setDescription(exam.getDescription());
        dto.setDurationMinutes(exam.getDurationMinutes());
        dto.setStartTime(exam.getStartTime());
        dto.setEndTime(exam.getEndTime());
        dto.setTotalMarks(exam.getTotalMarks());
        dto.setStatus(exam.getStatus());
        return dto;
    }

    private Exam mapToEntity(ExamDto dto) {
        return Exam.builder()
                .courseId(dto.getCourseId())
                .title(dto.getTitle())
                .description(dto.getDescription())
                .durationMinutes(dto.getDurationMinutes())
                .startTime(dto.getStartTime())
                .endTime(dto.getEndTime())
                .totalMarks(dto.getTotalMarks())
                .status(dto.getStatus())
                .build();
    }

    private ExamQuestionDto mapQuestionToDto(ExamQuestion question) {
        ExamQuestionDto dto = new ExamQuestionDto();
        dto.setId(question.getId());
        dto.setExamId(question.getExamId());
        dto.setQuestionNumber(question.getQuestionNumber());
        dto.setTitle(question.getTitle());
        dto.setProblemStatement(question.getProblemStatement());
        dto.setInputDescription(question.getInputDescription());
        dto.setOutputDescription(question.getOutputDescription());
        dto.setConstraints(question.getConstraints());
        dto.setSampleInput(question.getSampleInput());
        dto.setSampleOutput(question.getSampleOutput());
        dto.setMarks(question.getMarks());
        dto.setAllowedLanguage(question.getAllowedLanguage());
        return dto;
    }

    private ExamQuestion mapQuestionToEntity(ExamQuestionDto dto) {
        return ExamQuestion.builder()
                .examId(dto.getExamId())
                .questionNumber(dto.getQuestionNumber())
                .title(dto.getTitle())
                .problemStatement(dto.getProblemStatement())
                .inputDescription(dto.getInputDescription())
                .outputDescription(dto.getOutputDescription())
                .constraints(dto.getConstraints())
                .sampleInput(dto.getSampleInput())
                .sampleOutput(dto.getSampleOutput())
                .marks(dto.getMarks())
                .allowedLanguage(dto.getAllowedLanguage())
                .build();
    }

    @org.springframework.scheduling.annotation.Scheduled(fixedRate = 30000)
    public void autoStartAndEndExams() {
        java.time.LocalDateTime now = java.time.LocalDateTime.now();

        // 1. Start PUBLISHED exams that have reached their startTime
        List<Exam> publishedExams = examRepository.findByStatus(com.codeclassroom.exam.model.ExamStatus.PUBLISHED);
        for (Exam exam : publishedExams) {
            if (exam.getStartTime() != null && !now.isBefore(exam.getStartTime())) {
                exam.setStatus(com.codeclassroom.exam.model.ExamStatus.ONGOING);
                if (exam.getEndTime() == null && exam.getDurationMinutes() != null) {
                    exam.setEndTime(exam.getStartTime().plusMinutes(exam.getDurationMinutes()));
                }
                examRepository.save(exam);
                System.out.println("Auto-started exam ID: " + exam.getId());
            }
        }

        // 2. End ONGOING exams that have passed their endTime
        List<Exam> ongoingExams = examRepository.findByStatus(com.codeclassroom.exam.model.ExamStatus.ONGOING);
        for (Exam exam : ongoingExams) {
            if (exam.getEndTime() != null && !now.isBefore(exam.getEndTime())) {
                exam.setStatus(com.codeclassroom.exam.model.ExamStatus.ENDED);
                examRepository.save(exam);
                System.out.println("Auto-ended exam ID: " + exam.getId());
            }
        }
    }
}
