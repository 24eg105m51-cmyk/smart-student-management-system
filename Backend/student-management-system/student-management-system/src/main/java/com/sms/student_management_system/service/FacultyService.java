package com.sms.student_management_system.service;

import com.sms.student_management_system.entity.Faculty;
import com.sms.student_management_system.repository.FacultyRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FacultyService {

    private final FacultyRepository facultyRepository;

    public FacultyService(FacultyRepository facultyRepository) {
        this.facultyRepository = facultyRepository;
    }

    public Faculty addFaculty(Faculty faculty) {

        if (facultyRepository.findByEmail(faculty.getEmail()).isPresent()) {
            throw new RuntimeException("Faculty email already exists");
        }

        return facultyRepository.save(faculty);
    }

    public List<Faculty> getAllFaculty() {
        return facultyRepository.findAll();
    }

    public Optional<Faculty> getFacultyById(Long id) {
        return facultyRepository.findById(id);
    }

    public Faculty updateFaculty(Long id, Faculty faculty) {

        Faculty existingFaculty = facultyRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Faculty not found"));

        existingFaculty.setName(faculty.getName());
        existingFaculty.setEmail(faculty.getEmail());
        existingFaculty.setDepartment(faculty.getDepartment());
        existingFaculty.setPhone(faculty.getPhone());

        return facultyRepository.save(existingFaculty);
    }

    public void deleteFaculty(Long id) {

        if (!facultyRepository.existsById(id)) {
            throw new RuntimeException("Faculty not found");
        }

        facultyRepository.deleteById(id);
    }
}