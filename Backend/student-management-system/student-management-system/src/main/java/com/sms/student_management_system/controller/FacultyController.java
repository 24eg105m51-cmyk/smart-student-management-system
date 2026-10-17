package com.sms.student_management_system.controller;

import com.sms.student_management_system.entity.Faculty;
import com.sms.student_management_system.service.FacultyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/faculty")
@CrossOrigin
public class FacultyController {

    private final FacultyService facultyService;

    public FacultyController(FacultyService facultyService) {
        this.facultyService = facultyService;
    }

    @PostMapping
    public ResponseEntity<?> addFaculty(
            @RequestBody Faculty faculty) {

        try {
            return ResponseEntity.ok(
                    facultyService.addFaculty(faculty)
            );
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Faculty>> getAllFaculty() {

        return ResponseEntity.ok(
                facultyService.getAllFaculty()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getFacultyById(
            @PathVariable Long id) {

        return facultyService.getFacultyById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() ->
                        ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateFaculty(
            @PathVariable Long id,
            @RequestBody Faculty faculty) {

        try {
            return ResponseEntity.ok(
                    facultyService.updateFaculty(id, faculty)
            );
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFaculty(
            @PathVariable Long id) {

        try {
            facultyService.deleteFaculty(id);

            return ResponseEntity.ok(
                    "Faculty deleted successfully"
            );

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }
}