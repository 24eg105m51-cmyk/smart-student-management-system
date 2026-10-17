package com.sms.student_management_system.controller;

import com.sms.student_management_system.entity.Course;
import com.sms.student_management_system.entity.Enrollment;
import com.sms.student_management_system.service.EnrollmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enrollments")
@CrossOrigin
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    public EnrollmentController(EnrollmentService enrollmentService) {
        this.enrollmentService = enrollmentService;
    }

    @PostMapping
    public ResponseEntity<?> enrollStudent(
            @RequestBody Enrollment enrollment) {

        try {
            return ResponseEntity.ok(
                    enrollmentService.enrollStudent(
                            enrollment.getStudentId(),
                            enrollment.getCourseId()
                    )
            );

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Enrollment>> getAllEnrollments() {

        return ResponseEntity.ok(
                enrollmentService.getAllEnrollments()
        );
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Course>> getCoursesByStudent(
            @PathVariable Long studentId) {

        return ResponseEntity.ok(
                enrollmentService.getCoursesByStudent(studentId)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEnrollment(
            @PathVariable Long id) {

        try {
            enrollmentService.deleteEnrollment(id);

            return ResponseEntity.ok(
                    "Enrollment deleted successfully"
            );

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }
}