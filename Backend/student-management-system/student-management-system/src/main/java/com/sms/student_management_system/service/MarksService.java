package com.sms.student_management_system.service;

import com.sms.student_management_system.entity.Marks;
import com.sms.student_management_system.repository.MarksRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MarksService {

    private final MarksRepository marksRepository;

    public MarksService(MarksRepository marksRepository) {
        this.marksRepository = marksRepository;
    }

    public Marks addMarks(Marks marks) {
        if (marks.getMarksObtained() < 0) {
            throw new RuntimeException(
                    "Marks obtained cannot be negative"
            );
        }

        if (marks.getTotalMarks() <= 0) {
            throw new RuntimeException(
                    "Total marks must be greater than 0"
            );
        }

        if (marks.getMarksObtained() > marks.getTotalMarks()) {
            throw new RuntimeException(
                    "Marks obtained cannot be greater than total marks"
            );
        }

        return marksRepository.save(marks);
    }

    public List<Marks> getAllMarks() {
        return marksRepository.findAll();
    }

    public Optional<Marks> getMarksById(Long id) {
        return marksRepository.findById(id);
    }

    public List<Marks> getMarksByStudent(Long studentId) {
        return marksRepository.findByStudentId(studentId);
    }

    public List<Marks> getMarksByCourse(Long courseId) {
        return marksRepository.findByCourseId(courseId);
    }

    public Marks updateMarks(Long id, Marks marksDetails) {

        Marks marks = marksRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Marks record not found")
                );

        if (marksDetails.getMarksObtained() < 0) {
            throw new RuntimeException(
                    "Marks obtained cannot be negative"
            );
        }

        if (marksDetails.getTotalMarks() <= 0) {
            throw new RuntimeException(
                    "Total marks must be greater than 0"
            );
        }

        if (marksDetails.getMarksObtained()
                > marksDetails.getTotalMarks()) {

            throw new RuntimeException(
                    "Marks obtained cannot be greater than total marks"
            );
        }

        marks.setStudentId(marksDetails.getStudentId());
        marks.setCourseId(marksDetails.getCourseId());
        marks.setExamType(marksDetails.getExamType());
        marks.setMarksObtained(marksDetails.getMarksObtained());
        marks.setTotalMarks(marksDetails.getTotalMarks());

        return marksRepository.save(marks);
    }

    public void deleteMarks(Long id) {

        if (!marksRepository.existsById(id)) {
            throw new RuntimeException(
                    "Marks record not found"
            );
        }

        marksRepository.deleteById(id);
    }
}