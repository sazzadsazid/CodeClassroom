package com.codeclassroom.exam.scheduler;

import com.codeclassroom.exam.model.Exam;
import com.codeclassroom.exam.model.ExamStatus;
import com.codeclassroom.exam.repository.ExamRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class ExamScheduler {

    private final ExamRepository examRepository;

    @Scheduled(fixedRate = 60000) // Run every minute
    public void updateExamStatuses() {
        LocalDateTime now = LocalDateTime.now();

        // Start PUBLISHED exams whose start time has arrived
        List<Exam> publishedExams = examRepository.findByStatus(ExamStatus.PUBLISHED);
        for (Exam exam : publishedExams) {
            if (exam.getStartTime() != null && !now.isBefore(exam.getStartTime())) {
                exam.setStatus(ExamStatus.ONGOING);
                if (exam.getDurationMinutes() != null) {
                    exam.setEndTime(exam.getStartTime().plusMinutes(exam.getDurationMinutes()));
                }
                examRepository.save(exam);
                log.info("Started exam id {}", exam.getId());
            }
        }

        // End ONGOING exams whose end time has passed
        List<Exam> ongoingExams = examRepository.findByStatus(ExamStatus.ONGOING);
        for (Exam exam : ongoingExams) {
            if (exam.getEndTime() != null && !now.isBefore(exam.getEndTime())) {
                exam.setStatus(ExamStatus.ENDED);
                examRepository.save(exam);
                log.info("Ended exam id {}", exam.getId());
            } else if (exam.getEndTime() == null && exam.getStartTime() != null && exam.getDurationMinutes() != null) {
                if (!now.isBefore(exam.getStartTime().plusMinutes(exam.getDurationMinutes()))) {
                    exam.setStatus(ExamStatus.ENDED);
                    examRepository.save(exam);
                    log.info("Ended exam id {}", exam.getId());
                }
            }
        }
    }
}
