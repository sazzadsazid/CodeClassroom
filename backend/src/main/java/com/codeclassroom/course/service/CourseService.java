package com.codeclassroom.course.service;

import com.codeclassroom.course.dto.CourseDto;
import com.codeclassroom.course.dto.CourseRequest;
import com.codeclassroom.course.model.Course;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

@Service
public class CourseService {
    private final List<Course> courses = new ArrayList<>();
    private final AtomicLong idGenerator = new AtomicLong(1);

    public CourseService() {
        // Teacher ID 2 was created in the UserService sample data
        courses.add(new Course(idGenerator.getAndIncrement(), "CS101", "Introduction to Programming", "Learn the basics of coding.", 2L));
        courses.add(new Course(idGenerator.getAndIncrement(), "CS201", "Data Structures", "Learn about arrays, lists, and trees.", 2L));
    }

    public List<CourseDto> getAllCourses() {
        return courses.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public Optional<CourseDto> getCourseById(Long id) {
        return courses.stream()
                .filter(course -> course.getId().equals(id))
                .findFirst()
                .map(this::mapToDto);
    }

    public CourseDto createCourse(CourseRequest request) {
        Course course = Course.builder()
                .id(idGenerator.getAndIncrement())
                .courseCode(request.getCourseCode())
                .name(request.getName())
                .description(request.getDescription())
                .teacherId(request.getTeacherId())
                .build();
        courses.add(course);
        return mapToDto(course);
    }

    public Optional<CourseDto> updateCourse(Long id, CourseRequest request) {
        for (Course course : courses) {
            if (course.getId().equals(id)) {
                course.setCourseCode(request.getCourseCode());
                course.setName(request.getName());
                course.setDescription(request.getDescription());
                course.setTeacherId(request.getTeacherId());
                return Optional.of(mapToDto(course));
            }
        }
        return Optional.empty();
    }

    public boolean deleteCourse(Long id) {
        return courses.removeIf(course -> course.getId().equals(id));
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
