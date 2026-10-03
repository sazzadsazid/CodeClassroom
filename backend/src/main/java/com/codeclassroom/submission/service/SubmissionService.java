package com.codeclassroom.submission.service;

import com.codeclassroom.assignment.model.Language;
import com.codeclassroom.submission.dto.SubmissionDto;
import com.codeclassroom.submission.dto.SubmissionRequest;
import com.codeclassroom.submission.model.Submission;
import com.codeclassroom.submission.model.SubmissionStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

@Service
public class SubmissionService {
    private final List<Submission> submissions = new ArrayList<>();
    private final AtomicLong idGenerator = new AtomicLong(1);

    public SubmissionService() {
        submissions.add(new Submission(
                idGenerator.getAndIncrement(),
                1L, // assignmentId (Hello World in Java)
                1L, // studentId (from UserService sample data)
                "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Hello World\");\n    }\n}",
                Language.JAVA,
                LocalDateTime.now().minusHours(2),
                SubmissionStatus.ACCEPTED
        ));
        submissions.add(new Submission(
                idGenerator.getAndIncrement(),
                2L, // assignmentId (Array Manipulation)
                1L, // studentId
                "def main():\n    pass",
                Language.PYTHON,
                LocalDateTime.now().minusHours(1),
                SubmissionStatus.WRONG_ANSWER
        ));
    }

    public List<SubmissionDto> getAllSubmissions() {
        return submissions.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public Optional<SubmissionDto> getSubmissionById(Long id) {
        return submissions.stream()
                .filter(s -> s.getId().equals(id))
                .findFirst()
                .map(this::mapToDto);
    }

    public List<SubmissionDto> getSubmissionsByAssignmentId(Long assignmentId) {
        return submissions.stream()
                .filter(s -> s.getAssignmentId().equals(assignmentId))
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<SubmissionDto> getSubmissionsByStudentId(Long studentId) {
        return submissions.stream()
                .filter(s -> s.getStudentId().equals(studentId))
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public SubmissionDto createSubmission(SubmissionRequest request) {
        Submission submission = Submission.builder()
                .id(idGenerator.getAndIncrement())
                .assignmentId(request.getAssignmentId())
                .studentId(request.getStudentId())
                .code(request.getCode())
                .language(request.getLanguage())
                .submittedAt(LocalDateTime.now())
                .status(SubmissionStatus.PENDING)
                .build();
        submissions.add(submission);
        return mapToDto(submission);
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
