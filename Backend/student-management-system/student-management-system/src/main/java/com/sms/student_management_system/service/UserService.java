
package com.sms.student_management_system.service;

import com.sms.student_management_system.entity.User;
import com.sms.student_management_system.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Public registration always creates a STUDENT account.
    // Never trust a role supplied by the client.
    public User registerUser(User user) {

        if (user == null) {
            throw new IllegalArgumentException(
                    "Registration details are required");
        }

        if (user.getUsername() == null
                || user.getUsername().isBlank()) {
            throw new IllegalArgumentException(
                    "Username is required");
        }

        if (user.getEmail() == null
                || user.getEmail().isBlank()) {
            throw new IllegalArgumentException(
                    "Email is required");
        }

        if (user.getPassword() == null
                || user.getPassword().isBlank()) {
            throw new IllegalArgumentException(
                    "Password is required");
        }

        if (userRepository.findByUsername(
                user.getUsername()).isPresent()) {
            throw new RuntimeException(
                    "Username already exists");
        }

        if (userRepository.findByEmail(
                user.getEmail()).isPresent()) {
            throw new RuntimeException(
                    "Email already exists");
        }

        // Ignore any role submitted by the client.
        user.setRole("STUDENT");

        // Store only the BCrypt-encoded password.
        user.setPassword(
                passwordEncoder.encode(user.getPassword()));

        return userRepository.save(user);
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User loginUser(String username, String password) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Invalid username or password"));

        if (!passwordEncoder.matches(
                password, user.getPassword())) {
            throw new RuntimeException(
                    "Invalid username or password");
        }

        return user;
    }

    public User resetPassword(
            String username, String newPassword) {

        if (newPassword == null || newPassword.isBlank()) {
            throw new IllegalArgumentException(
                    "New password is required");
        }

        User user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        user.setPassword(
                passwordEncoder.encode(newPassword));

        return userRepository.save(user);
    }
}
