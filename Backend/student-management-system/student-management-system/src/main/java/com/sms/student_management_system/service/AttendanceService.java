package com.sms.student_management_system.service;

import com.sms.student_management_system.entity.Attendance;
import com.sms.student_management_system.repository.AttendanceRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;

    public AttendanceService(AttendanceRepository attendanceRepository) {
        this.attendanceRepository = attendanceRepository;
    }

    public Attendance addAttendance(Attendance attendance) {
        return attendanceRepository.save(attendance);
    }

    public List<Attendance> getAllAttendance() {
        return attendanceRepository.findAll();
    }

    public Optional<Attendance> getAttendanceById(Long id) {
        return attendanceRepository.findById(id);
    }

    public List<Attendance> getAttendanceByStudent(Long studentId) {
        return attendanceRepository.findByStudentId(studentId);
    }

    public List<Attendance> getAttendanceByCourse(Long courseId) {
        return attendanceRepository.findByCourseId(courseId);
    }

    public Attendance updateAttendance(Long id, Attendance attendanceDetails) {

        Attendance attendance = attendanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Attendance not found"));

        attendance.setStudentId(attendanceDetails.getStudentId());
        attendance.setCourseId(attendanceDetails.getCourseId());
        attendance.setDate(attendanceDetails.getDate());
        attendance.setPresent(attendanceDetails.isPresent());

        return attendanceRepository.save(attendance);
    }

    public void deleteAttendance(Long id) {

        if (!attendanceRepository.existsById(id)) {
            throw new RuntimeException("Attendance not found");
        }

        attendanceRepository.deleteById(id);
    }
}
