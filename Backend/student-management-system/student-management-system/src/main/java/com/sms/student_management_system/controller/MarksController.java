package com.sms.student_management_system.controller;

import com.sms.student_management_system.entity.Marks;
import com.sms.student_management_system.service.MarksService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/marks")
@CrossOrigin
public class MarksController {

    private final MarksService marksService;

    public MarksController(MarksService marksService) {
        this.marksService = marksService;
    }

    @PostMapping
    public ResponseEntity<?> addMarks(
            @RequestBody Marks marks) {

        try {
            return ResponseEntity.ok(
                    marksService.addMarks(marks)
            );
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Marks>> getAllMarks() {

        return ResponseEntity.ok(
                marksService.getAllMarks()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getMarksById(
            @PathVariable Long id) {

        return marksService.getMarksById(id)
                .<ResponseEntity<?>>map(
                        ResponseEntity::ok
                )
                .orElseGet(
                        () -> ResponseEntity.notFound().build()
                );
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Marks>> getMarksByStudent(
            @PathVariable Long studentId) {

        return ResponseEntity.ok(
                marksService.getMarksByStudent(studentId)
        );
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<Marks>> getMarksByCourse(
            @PathVariable Long courseId) {

        return ResponseEntity.ok(
                marksService.getMarksByCourse(courseId)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateMarks(
            @PathVariable Long id,
            @RequestBody Marks marks) {

        try {
            return ResponseEntity.ok(
                    marksService.updateMarks(id, marks)
            );
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMarks(
            @PathVariable Long id) {

        try {
            marksService.deleteMarks(id);

            return ResponseEntity.ok(
                    "Marks deleted successfully"
            );

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }
}