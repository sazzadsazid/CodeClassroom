package com.codeclassroom.course.repository;

import com.codeclassroom.course.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    boolean existsByCourseCode(String courseCode);
    Course findByCourseCode(String courseCode);
}
