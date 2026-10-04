package com.codeclassroom.submission.service;

import com.codeclassroom.assignment.model.Assignment;
import com.codeclassroom.assignment.model.Language;
import com.codeclassroom.assignment.repository.AssignmentRepository;
import com.codeclassroom.submission.dto.SubmissionDto;
import com.codeclassroom.submission.dto.SubmissionRequest;
import com.codeclassroom.submission.model.Submission;
import com.codeclassroom.submission.model.SubmissionStatus;
import com.codeclassroom.submission.repository.SubmissionRepository;
import com.codeclassroom.user.model.User;
import com.codeclassroom.user.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.DependsOn;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@DependsOn({"userService", "assignmentService"})
public class SubmissionService {
    private final SubmissionRepository submissionRepository;
    private final AssignmentRepository assignmentRepository;
    private final UserRepository userRepository;

    public SubmissionService(SubmissionRepository submissionRepository, AssignmentRepository assignmentRepository, UserRepository userRepository) {
        this.submissionRepository = submissionRepository;
        this.assignmentRepository = assignmentRepository;
        this.userRepository = userRepository;
    }

    @PostConstruct
    public void init() {
        User student = userRepository.findAll().stream().filter(u -> "student".equals(u.getUsername())).findFirst().orElse(null);
        Assignment hwJava = assignmentRepository.findAll().stream().filter(a -> "Hello World in Java".equals(a.getTitle())).findFirst().orElse(null);
        
        if (student != null && hwJava != null && !submissionRepository.existsByAssignmentIdAndStudentId(hwJava.getId(), student.getId())) {
            submissionRepository.save(Submission.builder()
                    .assignmentId(hwJava.getId())
                    .studentId(student.getId())
                    .code("public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Hello World\");\n    }\n}")
                    .language(Language.JAVA)
                    .submittedAt(LocalDateTime.now().minusHours(2))
                    .status(SubmissionStatus.ACCEPTED)
                    .build());
        }

        Assignment arrayMan = assignmentRepository.findAll().stream().filter(a -> "Array Manipulation".equals(a.getTitle())).findFirst().orElse(null);
        if (student != null && arrayMan != null && !submissionRepository.existsByAssignmentIdAndStudentId(arrayMan.getId(), student.getId())) {
            submissionRepository.save(Submission.builder()
                    .assignmentId(arrayMan.getId())
                    .studentId(student.getId())
                    .code("def main():\n    pass")
                    .language(Language.PYTHON)
                    .submittedAt(LocalDateTime.now().minusHours(1))
                    .status(SubmissionStatus.WRONG_ANSWER)
                    .build());
        }
    }

    public List<SubmissionDto> getAllSubmissions() {
        return submissionRepository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public Optional<SubmissionDto> getSubmissionById(Long id) {
        return submissionRepository.findById(id).map(submission -> {
            com.codeclassroom.auth.util.SecurityUtils.checkStudentOwnership(submission.getStudentId());
            return mapToDto(submission);
        });
    }

    public List<SubmissionDto> getSubmissionsByAssignmentId(Long assignmentId) {
        // Teacher/Admin can view all. Students shouldn't access this endpoint if they shouldn't see others, 
        // wait, students should only view their own submissions. Or maybe they shouldn't call this endpoint at all.
        // Actually, if a student calls this, we should filter by their ID.
        com.codeclassroom.auth.filter.CustomUserDetails currentUser = com.codeclassroom.auth.util.SecurityUtils.getCurrentUser();
        if (currentUser != null && "STUDENT".equals(currentUser.getRole())) {
            return submissionRepository.findByAssignmentId(assignmentId).stream()
                    .filter(s -> s.getStudentId().equals(currentUser.getId()))
                    .map(this::mapToDto)
                    .collect(Collectors.toList());
        }
        return submissionRepository.findByAssignmentId(assignmentId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<SubmissionDto> getSubmissionsByStudentId(Long studentId) {
        com.codeclassroom.auth.util.SecurityUtils.checkStudentOwnership(studentId);
        return submissionRepository.findByStudentId(studentId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public SubmissionDto createSubmission(SubmissionRequest request) {
        com.codeclassroom.auth.util.SecurityUtils.checkStudentOwnership(request.getStudentId());
        Submission submission = Submission.builder()
                .assignmentId(request.getAssignmentId())
                .studentId(request.getStudentId())
                .code(request.getCode())
                .language(request.getLanguage())
                .submittedAt(LocalDateTime.now())
                .status(SubmissionStatus.PENDING)
                .build();
        Submission savedSubmission = submissionRepository.save(submission);
        return mapToDto(savedSubmission);
    }

    private SubmissionDto mapToDto(Submission submission) {
        return SubmissionDto.builder()
                .id(submission.getId())
                .assignmentId(submission.getAssignmentId())
                .studentId(submission.getStudentId())
                .code(submission.getCode())
                .language(submission.getLanguage())
                .submittedAt(submission.getSubmittedAt())
                .status(submission.getStatus())
                .build();
    }
}
