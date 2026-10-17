package com.sms.student_management_system.controller;

import com.sms.student_management_system.service.AiService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.http.ResponseEntity;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final AiService aiService;

    public AiController(AiService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/chat")
    public ResponseEntity<Map<String, String>> chat(@Valid @RequestBody ChatRequest request) {
        try {
            return ResponseEntity.ok(Map.of("reply", aiService.chat(request.message().trim())));
        } catch (ResponseStatusException exception) {
            String message = exception.getReason() == null
                    ? "The AI request could not be completed."
                    : exception.getReason();
            return ResponseEntity.status(exception.getStatusCode())
                    .body(Map.of("message", message));
        }
    }

    public record ChatRequest(
            @NotBlank(message = "Please enter a message.")
            @Size(max = 4000, message = "Please keep your message under 4,000 characters.")
            String message) { }
}
