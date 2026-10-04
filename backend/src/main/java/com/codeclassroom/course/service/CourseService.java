package com.codeclassroom.course.service;

import com.codeclassroom.course.dto.CourseDto;
import com.codeclassroom.course.dto.CourseRequest;
import com.codeclassroom.course.model.Course;
import com.codeclassroom.course.repository.CourseRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CourseService {
    private final CourseRepository courseRepository;

    public CourseService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    @PostConstruct
    public void init() {
        if (!courseRepository.existsByCourseCode("CS101")) {
            courseRepository.save(Course.builder().courseCode("CS101").name("Introduction to Programming").description("Learn the basics of coding.").teacherId(2L).build());
        }
        if (!courseRepository.existsByCourseCode("CS201")) {
            courseRepository.save(Course.builder().courseCode("CS201").name("Data Structures").description("Learn about arrays, lists, and trees.").teacherId(2L).build());
        }
    }

    public List<CourseDto> getAllCourses() {
        return courseRepository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public Optional<CourseDto> getCourseById(Long id) {
        return courseRepository.findById(id).map(this::mapToDto);
    }

    public CourseDto createCourse(CourseRequest request) {
        Course course = Course.builder()
                .courseCode(request.getCourseCode())
                .name(request.getName())
                .description(request.getDescription())
                .teacherId(request.getTeacherId())
                .build();
        Course savedCourse = courseRepository.save(course);
        return mapToDto(savedCourse);
    }

    public Optional<CourseDto> updateCourse(Long id, CourseRequest request) {
        return courseRepository.findById(id).map(course -> {
            course.setCourseCode(request.getCourseCode());
            course.setName(request.getName());
            course.setDescription(request.getDescription());
            course.setTeacherId(request.getTeacherId());
            return mapToDto(courseRepository.save(course));
        });
    }

    public boolean deleteCourse(Long id) {
        if (courseRepository.existsById(id)) {
            courseRepository.deleteById(id);
            return true;
        }
        return false;
    }

    private CourseDto mapToDto(Course course) {
        return CourseDto.builder()
                .id(course.getId())
                .courseCode(course.getCourseCode())
                .name(course.getName())
                .description(course.getDescription())
                .teacherId(course.getTeacherId())
                .build();
    }
}
