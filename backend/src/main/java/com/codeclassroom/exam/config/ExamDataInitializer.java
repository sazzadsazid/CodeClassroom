package com.codeclassroom.exam.config;

import com.codeclassroom.course.model.Course;
import com.codeclassroom.course.repository.CourseRepository;
import com.codeclassroom.exam.model.Exam;
import com.codeclassroom.exam.model.ExamQuestion;
import com.codeclassroom.exam.model.ExamStatus;
import com.codeclassroom.exam.repository.ExamQuestionRepository;
import com.codeclassroom.exam.repository.ExamRepository;
import com.codeclassroom.common.model.Language;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class ExamDataInitializer implements CommandLineRunner {

    private final CourseRepository courseRepository;
    private final ExamRepository examRepository;
    private final ExamQuestionRepository examQuestionRepository;

    public ExamDataInitializer(CourseRepository courseRepository, ExamRepository examRepository, ExamQuestionRepository examQuestionRepository) {
        this.courseRepository = courseRepository;
        this.examRepository = examRepository;
        this.examQuestionRepository = examQuestionRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (examRepository.count() == 0) {
            Course course = courseRepository.findAll().stream().findFirst().orElseGet(() -> {
                Course newCourse = new Course();
                newCourse.setCourseCode("CS101");
                newCourse.setName("Introduction to Programming");
                newCourse.setDescription("Learn the basics of programming");
                newCourse.setTeacherId(2L); // Assuming user with id 2 is a teacher
                return courseRepository.save(newCourse);
            });

            Exam exam = new Exam();
            exam.setCourseId(course.getId());
            exam.setTitle("Midterm Exam");
            exam.setDescription("Test your knowledge of the first half of the course.");
            exam.setDurationMinutes(120);
            exam.setStartTime(LocalDateTime.now().minusDays(1));
            exam.setEndTime(LocalDateTime.now().plusDays(2));
            exam.setTotalMarks(100);
            exam.setStatus(ExamStatus.PUBLISHED);
            exam = examRepository.save(exam);

            ExamQuestion q1 = new ExamQuestion();
            q1.setExamId(exam.getId());
            q1.setQuestionNumber(1);
            q1.setTitle("Hello World");
            q1.setProblemStatement("Write a program that prints 'Hello World!'");
            q1.setInputDescription("None");
            q1.setOutputDescription("Print 'Hello World!' to standard output");
            q1.setConstraints("Time limit: 1s, Memory limit: 256MB");
            q1.setSampleInput("");
            q1.setSampleOutput("Hello World!");
            q1.setMarks(20);
            q1.setAllowedLanguage(Language.JAVA);
            examQuestionRepository.save(q1);

            ExamQuestion q2 = new ExamQuestion();
            q2.setExamId(exam.getId());
            q2.setQuestionNumber(2);
            q2.setTitle("Two Sum");
            q2.setProblemStatement("Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.");
            q2.setInputDescription("First line: n (size of array). Second line: n integers separated by space. Third line: target.");
            q2.setOutputDescription("Indices of the two numbers separated by space.");
            q2.setConstraints("2 <= nums.length <= 10^4. Time limit: 2s");
            q2.setSampleInput("4\n2 7 11 15\n9");
            q2.setSampleOutput("0 1");
            q2.setMarks(80);
            q2.setAllowedLanguage(Language.PYTHON);
            examQuestionRepository.save(q2);
        }
    }
}
