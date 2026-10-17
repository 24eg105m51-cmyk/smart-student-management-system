package com.sms.student_management_system.service;

import com.sms.student_management_system.entity.Course;
import com.sms.student_management_system.entity.Enrollment;
import com.sms.student_management_system.repository.CourseRepository;
import com.sms.student_management_system.repository.EnrollmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final CourseRepository courseRepository;

    public EnrollmentService(
            EnrollmentRepository enrollmentRepository,
            CourseRepository courseRepository) {

        this.enrollmentRepository = enrollmentRepository;
        this.courseRepository = courseRepository;
    }

    public Enrollment enrollStudent(Long studentId, Long courseId) {

        if (enrollmentRepository
                .existsByStudentIdAndCourseId(studentId, courseId)) {

            throw new RuntimeException(
                    "Student is already enrolled in this course"
            );
        }

        if (!courseRepository.existsById(courseId)) {
            throw new RuntimeException("Course not found");
        }

        Enrollment enrollment =
                new Enrollment(studentId, courseId);

        return enrollmentRepository.save(enrollment);
    }

    public List<Enrollment> getAllEnrollments() {
        return enrollmentRepository.findAll();
    }

    public List<Course> getCoursesByStudent(Long studentId) {

        List<Enrollment> enrollments =
                enrollmentRepository.findByStudentId(studentId);

        return enrollments.stream()
                .map(enrollment ->
                        courseRepository.findById(
                                enrollment.getCourseId()
                        )
                )
                .filter(java.util.Optional::isPresent)
                .map(java.util.Optional::get)
                .collect(Collectors.toList());
    }

    public void deleteEnrollment(Long id) {

        if (!enrollmentRepository.existsById(id)) {
            throw new RuntimeException("Enrollment not found");
        }

        enrollmentRepository.deleteById(id);
    }
}