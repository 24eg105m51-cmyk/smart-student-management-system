
package com.sms.student_management_system.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@Service
public class AiService {

    private final RestClient restClient;
    private final ObjectMapper objectMapper;
    private final String apiKey;
    private final String model;

    public AiService(
            ObjectMapper objectMapper,
            @Value("${gemini.api-key:}") String apiKey,
            @Value("${gemini.model:gemini-2.5-flash}") String model) {

        this.objectMapper = objectMapper;
        this.apiKey = apiKey == null ? "" : apiKey.trim();
        this.model = model == null ? "gemini-2.5-flash" : model.trim();

        this.restClient = RestClient.builder()
                .baseUrl("https://generativelanguage.googleapis.com")
                .build();
    }

    public String chat(String message) {

        if (apiKey.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "Gemini API key is missing. Set GEMINI_API_KEY and restart the backend.");
        }

        if (message == null || message.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Message cannot be empty.");
        }

        if (message.length() > 4000) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Message must be 4000 characters or fewer.");
        }

        Map<String, Object> payload = Map.of(
                "systemInstruction", Map.of(
                        "parts", List.of(
                                Map.of(
                                        "text",
                                        "You are a helpful AI assistant inside a Student Management System. "
                                                + "Help with attendance, marks, courses, study planning, "
                                                + "student management, and educational questions. "
                                                + "Give clear, accurate, and concise answers. "
                                                + "Do not claim to access private student records or modify "
                                                + "the database because no database tools are connected. "
                                                + "Never request passwords, API keys, or sensitive information."
                                )
                        )
                ),
                "contents", List.of(
                        Map.of(
                                "role", "user",
                                "parts", List.of(
                                        Map.of("text", message)
                                )
                        )
                ),
                "generationConfig", Map.of(
                        "temperature", 0.7,
                        "maxOutputTokens", 700
                )
        );

        try {
            System.out.println("Gemini request started. Model: " + model);

            String rawResponse = restClient.post()
                    .uri("/v1beta/models/{model}:generateContent", model)
                    .header("x-goog-api-key", apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(payload)
                    .retrieve()
                    .body(String.class);

            if (rawResponse == null || rawResponse.isBlank()) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_GATEWAY,
                        "Gemini returned an empty response.");
            }

            JsonNode response = objectMapper.readTree(rawResponse);
            String reply = extractText(response);

            if (reply.isBlank()) {
                String blockReason = response.path("promptFeedback")
                        .path("blockReason")
                        .asText("");

                if (!blockReason.isBlank()) {
                    throw new ResponseStatusException(
                            HttpStatus.BAD_GATEWAY,
                            "Gemini blocked the prompt: " + blockReason);
                }

                throw new ResponseStatusException(
                        HttpStatus.BAD_GATEWAY,
                        "Gemini returned no text. Please try another message.");
            }

            System.out.println("Gemini response received successfully.");

            return reply;

        } catch (RestClientResponseException exception) {

            int providerStatus = exception.getStatusCode().value();

            System.err.println("========== GEMINI API ERROR ==========");
            System.err.println("Gemini HTTP status: " + providerStatus);

            // Avoid printing raw provider responses or API keys.
            System.err.println("Gemini model: " + model);
            System.err.println("======================================");

            if (providerStatus == 429) {
                throw new ResponseStatusException(
                        HttpStatus.TOO_MANY_REQUESTS,
                        "Gemini quota or rate limit reached. Check Google AI Studio.");
            }

            if (providerStatus == 400) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_GATEWAY,
                        "Gemini rejected the request (HTTP 400). Check the model and request format.");
            }

            if (providerStatus == 401 || providerStatus == 403) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_GATEWAY,
                        "Gemini authentication or project access failed (HTTP "
                                + providerStatus + ").");
            }

            if (providerStatus == 404) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_GATEWAY,
                        "Gemini model not found (HTTP 404). Check the model name.");
            }

            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "Gemini API failed with HTTP status " + providerStatus + ".");

        } catch (ResponseStatusException exception) {
            throw exception;

        } catch (Exception exception) {

            System.err.println("========== GEMINI CONNECTION ERROR ==========");
            System.err.println("Exception type: "
                    + exception.getClass().getSimpleName());
            System.err.println("=============================================");

            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "Gemini connection or response processing failed.");
        }
    }

    private String extractText(JsonNode response) {

        JsonNode candidates = response.path("candidates");

        if (!candidates.isArray()) {
            return "";
        }

        StringBuilder result = new StringBuilder();

        for (JsonNode candidate : candidates) {

            JsonNode parts = candidate.path("content").path("parts");

            if (!parts.isArray()) {
                continue;
            }

            for (JsonNode part : parts) {

                String value = part.path("text").asText("");

                if (!value.isBlank()) {

                    if (!result.isEmpty()) {
                        result.append("\n");
                    }

                    result.append(value);
                }
            }
        }

        return result.toString().trim();
    }
}
