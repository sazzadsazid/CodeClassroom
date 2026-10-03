package com.codeclassroom.coding.controller;

import com.codeclassroom.coding.dto.CodingSessionDto;
import com.codeclassroom.coding.dto.CodingSessionRequest;
import com.codeclassroom.coding.dto.UpdateCodeRequest;
import com.codeclassroom.coding.dto.UpdateStatusRequest;
import com.codeclassroom.coding.service.CodingSessionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class CodingSessionController {

    private final CodingSessionService codingSessionService;

    public CodingSessionController(CodingSessionService codingSessionService) {
        this.codingSessionService = codingSessionService;
    }

    @PostMapping("/coding/sessions")
    public ResponseEntity<?> createSession(@RequestBody CodingSessionRequest request) {
        if (!isValid(request)) {
            return ResponseEntity.badRequest().body("Validation failed: studentId, assignmentId, code, and language are required.");
        }
        CodingSessionDto createdSession = codingSessionService.createSession(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdSession);
    }

    @GetMapping("/coding/sessions/{id}")
    public ResponseEntity<CodingSessionDto> getSessionById(@PathVariable Long id) {
        return codingSessionService.getSessionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/students/{studentId}/coding-sessions")
    public ResponseEntity<List<CodingSessionDto>> getSessionsByStudentId(@PathVariable Long studentId) {
        return ResponseEntity.ok(codingSessionService.getSessionsByStudentId(studentId));
    }

    @PutMapping("/coding/sessions/{id}/code")
    public ResponseEntity<?> updateCode(@PathVariable Long id, @RequestBody UpdateCodeRequest request) {
        if (request.getCode() == null) {
            return ResponseEntity.badRequest().body("Validation failed: code is required.");
        }
        return codingSessionService.updateCode(id, request.getCode())
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/coding/sessions/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody UpdateStatusRequest request) {
        if (request.getStatus() == null) {
            return ResponseEntity.badRequest().body("Validation failed: status is required.");
        }
        return codingSessionService.updateStatus(id, request.getStatus())
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    private boolean isValid(CodingSessionRequest request) {
        return request.getStudentId() != null &&
               request.getAssignmentId() != null &&
               request.getCode() != null &&
               request.getLanguage() != null;
    }
}
