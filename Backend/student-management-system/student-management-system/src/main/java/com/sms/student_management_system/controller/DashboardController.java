package com.sms.student_management_system.controller;

import com.sms.student_management_system.entity.Course;
import com.sms.student_management_system.entity.Marks;
import com.sms.student_management_system.entity.Student;
import com.sms.student_management_system.entity.User;
import com.sms.student_management_system.repository.AttendanceRepository;
import com.sms.student_management_system.repository.CourseRepository;
import com.sms.student_management_system.repository.MarksRepository;
import com.sms.student_management_system.repository.StudentRepository;
import com.sms.student_management_system.repository.UserRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin
public class DashboardController {

    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final AttendanceRepository attendanceRepository;
    private final MarksRepository marksRepository;

    public DashboardController(
            StudentRepository studentRepository,
            CourseRepository courseRepository,
            UserRepository userRepository,
            AttendanceRepository attendanceRepository,
            MarksRepository marksRepository) {

        this.studentRepository = studentRepository;
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
        this.attendanceRepository = attendanceRepository;
        this.marksRepository = marksRepository;
    }

    // =========================================================
    // ADMIN DASHBOARD
    // =========================================================

    @GetMapping("/admin")
    public Map<String, Object> getAdminDashboard() {

        Map<String, Object> dashboard = new HashMap<>();

        // -----------------------------------------------------
        // BASIC STATISTICS
        // -----------------------------------------------------

        dashboard.put(
                "totalStudents",
                studentRepository.count()
        );

        dashboard.put(
                "totalCourses",
                courseRepository.count()
        );

        dashboard.put(
                "totalUsers",
                userRepository.count()
        );

        // -----------------------------------------------------
        // ATTENDANCE STATISTICS
        // -----------------------------------------------------

        long totalAttendance =
                attendanceRepository.count();

        long presentAttendance =
                attendanceRepository.findAll()
                        .stream()
                        .filter(attendance ->
                                attendance.isPresent())
                        .count();

        double averageAttendance = 0;

        if (totalAttendance > 0) {
            averageAttendance =
                    (presentAttendance * 100.0)
                            / totalAttendance;
        }

        dashboard.put(
                "averageAttendance",
                averageAttendance
        );

        dashboard.put(
                "totalAttendanceRecords",
                totalAttendance
        );

        dashboard.put(
                "presentAttendance",
                presentAttendance
        );

        dashboard.put(
                "absentAttendance",
                totalAttendance - presentAttendance
        );

        // -----------------------------------------------------
        // MARKS STATISTICS
        // -----------------------------------------------------

        List<Marks> allMarks =
                marksRepository.findAll();

        dashboard.put(
                "totalMarksRecords",
                allMarks.size()
        );

        double totalObtainedMarks = 0;
        double totalPossibleMarks = 0;
        double highestPercentage = 0;

        for (Marks marks : allMarks) {

            Double obtained =
                    marks.getMarks();

            Double maximum =
                    marks.getMaxMarks();

            if (obtained != null &&
                    maximum != null &&
                    maximum > 0) {

                totalObtainedMarks += obtained;
                totalPossibleMarks += maximum;

                double percentage =
                        (obtained * 100.0)
                                / maximum;

                if (percentage > highestPercentage) {
                    highestPercentage = percentage;
                }
            }
        }

        double averageMarksPercentage = 0;

        if (totalPossibleMarks > 0) {
            averageMarksPercentage =
                    (totalObtainedMarks * 100.0)
                            / totalPossibleMarks;
        }

        dashboard.put(
                "totalObtainedMarks",
                totalObtainedMarks
        );

        dashboard.put(
                "totalPossibleMarks",
                totalPossibleMarks
        );

        dashboard.put(
                "averageMarksPercentage",
                averageMarksPercentage
        );

        dashboard.put(
                "highestMarksPercentage",
                highestPercentage
        );

        // -----------------------------------------------------
        // RECENT STUDENTS
        // -----------------------------------------------------

        dashboard.put(
                "recentStudents",
                studentRepository
                        .findTop5ByOrderByIdDesc()
        );

        // -----------------------------------------------------
        // RECENT MARKS
        // -----------------------------------------------------

        List<Map<String, Object>> recentMarks =
                new ArrayList<>();

        int markCount = 0;

        for (int i = allMarks.size() - 1;
             i >= 0 && markCount < 5;
             i--) {

            Marks marks = allMarks.get(i);

            Map<String, Object> markData =
                    new HashMap<>();

            markData.put(
                    "id",
                    marks.getId()
            );

            markData.put(
                    "studentId",
                    marks.getStudentId()
            );

            markData.put(
                    "courseId",
                    marks.getCourseId()
            );

            markData.put(
                    "examType",
                    marks.getExamType()
            );

            markData.put(
                    "marksObtained",
                    marks.getMarks()
            );

            markData.put(
                    "totalMarks",
                    marks.getMaxMarks()
            );

            Double obtained =
                    marks.getMarks();

            Double maximum =
                    marks.getMaxMarks();

            double percentage = 0;

            if (obtained != null &&
                    maximum != null &&
                    maximum > 0) {

                percentage =
                        (obtained * 100.0)
                                / maximum;
            }

            markData.put(
                    "percentage",
                    percentage
            );

            recentMarks.add(markData);

            markCount++;
        }

        dashboard.put(
                "recentMarks",
                recentMarks
        );

        return dashboard;
    }

    // =========================================================
    // STUDENT DASHBOARD - LOGGED IN STUDENT
    // =========================================================

    @GetMapping("/student/me")
    public ResponseEntity<?> getMyStudentDashboard(
            Authentication authentication) {

        try {

            // -------------------------------------------------
            // CHECK LOGIN
            // -------------------------------------------------

            if (authentication == null ||
                    authentication.getName() == null) {

                return ResponseEntity
                        .status(401)
                        .body("User is not authenticated");
            }

            String username =
                    authentication.getName();

            // -------------------------------------------------
            // FIND USER
            // -------------------------------------------------

            User user =
                    userRepository
                            .findByUsername(username)
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Logged-in user not found"
                                    )
                            );

            // -------------------------------------------------
            // CHECK STUDENT ROLE
            // -------------------------------------------------

            if (!"STUDENT".equalsIgnoreCase(
                    user.getRole())) {

                return ResponseEntity
                        .status(403)
                        .body(
                                "Only STUDENT users can access this dashboard"
                        );
            }

            // -------------------------------------------------
            // FIND STUDENT USING EMAIL
            // -------------------------------------------------

            Student student =
                    studentRepository
                            .findByEmail(user.getEmail())
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Student profile not found for email: "
                                                    + user.getEmail()
                                    )
                            );

            // -------------------------------------------------
            // BUILD STUDENT DASHBOARD
            // -------------------------------------------------

            return ResponseEntity.ok(
                    buildStudentDashboard(student)
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    // =========================================================
    // STUDENT DASHBOARD - BY STUDENT ID
    // =========================================================

    @GetMapping("/student/{studentId}")
    public ResponseEntity<?> getStudentDashboard(
            @PathVariable Long studentId) {

        try {

            Student student =
                    studentRepository
                            .findById(studentId)
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Student not found"
                                    )
                            );

            return ResponseEntity.ok(
                    buildStudentDashboard(student)
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    // =========================================================
    // COMMON STUDENT DASHBOARD BUILDER
    // =========================================================

    private Map<String, Object> buildStudentDashboard(
            Student student) {

        Map<String, Object> dashboard =
                new HashMap<>();

        Long studentId =
                student.getId();

        // -----------------------------------------------------
        // STUDENT PROFILE
        // -----------------------------------------------------

        dashboard.put(
                "studentId",
                student.getId()
        );

        dashboard.put(
                "name",
                student.getName()
        );

        dashboard.put(
                "email",
                student.getEmail()
        );

        dashboard.put(
                "phone",
                student.getPhone()
        );

        dashboard.put(
                "department",
                student.getDepartment()
        );

        dashboard.put(
                "year",
                student.getYear()
        );

        // -----------------------------------------------------
        // STUDENT ATTENDANCE
        // -----------------------------------------------------

        var attendanceList =
                attendanceRepository
                        .findByStudentId(studentId);

        long totalClasses =
                attendanceList.size();

        long presentClasses =
                attendanceList
                        .stream()
                        .filter(attendance ->
                                attendance.isPresent())
                        .count();

        double attendancePercentage = 0;

        if (totalClasses > 0) {

            attendancePercentage =
                    (presentClasses * 100.0)
                            / totalClasses;
        }

        dashboard.put(
                "totalClasses",
                totalClasses
        );

        dashboard.put(
                "presentClasses",
                presentClasses
        );

        dashboard.put(
                "attendancePercentage",
                attendancePercentage
        );

        // -----------------------------------------------------
        // STUDENT MARKS
        // -----------------------------------------------------

        List<Marks> marksList =
                marksRepository
                        .findByStudentId(studentId);

        double totalMarks = 0;
        double totalMaxMarks = 0;

        for (Marks marks : marksList) {

            Double obtained =
                    marks.getMarks();

            Double maximum =
                    marks.getMaxMarks();

            if (obtained != null) {
                totalMarks += obtained;
            }

            if (maximum != null) {
                totalMaxMarks += maximum;
            }
        }

        double overallPercentage = 0;

        if (totalMaxMarks > 0) {

            overallPercentage =
                    (totalMarks * 100.0)
                            / totalMaxMarks;
        }

        dashboard.put(
                "marks",
                marksList
        );

        dashboard.put(
                "totalMarks",
                totalMarks
        );

        dashboard.put(
                "totalMaxMarks",
                totalMaxMarks
        );

        dashboard.put(
                "overallMarksPercentage",
                overallPercentage
        );

        // -----------------------------------------------------
        // STUDENT COURSES
        // -----------------------------------------------------

        List<Course> studentCourses =
                new ArrayList<>();

        for (Marks marks : marksList) {

            Course course =
                    courseRepository
                            .findById(
                                    marks.getCourseId()
                            )
                            .orElse(null);

            if (course != null &&
                    !studentCourses.contains(course)) {

                studentCourses.add(course);
            }
        }

        dashboard.put(
                "courses",
                studentCourses
        );

        return dashboard;
    }

    // =========================================================
    // FACULTY DASHBOARD
    // =========================================================

    @GetMapping("/faculty/{facultyName}")
    public Map<String, Object> getFacultyDashboard(
            @PathVariable String facultyName) {

        Map<String, Object> dashboard =
                new HashMap<>();

        // -----------------------------------------------------
        // FIND FACULTY COURSES
        // -----------------------------------------------------

        List<Course> facultyCourses =
                courseRepository
                        .findAll()
                        .stream()
                        .filter(course ->
                                course.getFacultyName() != null &&
                                        course.getFacultyName()
                                                .equalsIgnoreCase(
                                                        facultyName
                                                ))
                        .toList();

        // -----------------------------------------------------
        // COURSE DETAILS
        // -----------------------------------------------------

        List<Map<String, Object>> courseDetails =
                new ArrayList<>();

        for (Course course :
                facultyCourses) {

            long studentCount =
                    marksRepository
                            .findByCourseId(
                                    course.getId()
                            )
                            .stream()
                            .map(Marks::getStudentId)
                            .distinct()
                            .count();

            Map<String, Object> courseData =
                    new HashMap<>();

            courseData.put(
                    "courseId",
                    course.getId()
            );

            courseData.put(
                    "courseName",
                    course.getCourseName()
            );

            courseData.put(
                    "courseCode",
                    course.getCourseCode()
            );

            courseData.put(
                    "department",
                    course.getDepartment()
            );

            courseData.put(
                    "year",
                    course.getYear()
            );

            courseData.put(
                    "studentCount",
                    studentCount
            );

            courseDetails.add(courseData);
        }

        dashboard.put(
                "facultyName",
                facultyName
        );

        dashboard.put(
                "courses",
                courseDetails
        );

        dashboard.put(
                "totalCourses",
                facultyCourses.size()
        );

        return dashboard;
    }
}