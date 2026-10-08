package com.codeclassroom;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class CodeClassroomApplication {

	public static void main(String[] args) {
		SpringApplication.run(CodeClassroomApplication.class, args);
	}

}
