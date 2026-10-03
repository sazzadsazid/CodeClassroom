package com.codeclassroom.course.dto;

import lombok.Data;

@Data
public class CourseRequest {
    private String courseCode;
    private String name;
    private String description;
    private Long teacherId;
}
