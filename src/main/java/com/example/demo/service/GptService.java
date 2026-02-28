package com.example.demo.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service // 서비스 선언
public class GptService {

    @Value("${gpt.api.key}") // API 키 가져옴
    private String apiKey;

    private final String URL = "https://api.openai.com/v1/chat/completions";

    // 전달받은 프롬프트를 그대로 GPT에게 전달함
    public String askGpt(String prompt) {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "gpt-4o");
        requestBody.put("messages", List.of(
            // 시스템 역할도 여기서 고정하지 않고 단순하게 처리함
            Map.of("role", "user", "content", prompt)
        ));

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
        
        try {
            Map<String, Object> response = restTemplate.postForObject(URL, entity, Map.class);
            List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
            Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
            
            return (String) message.get("content"); // 답변 텍스트만 리턴함
        } catch (Exception e) {
            return "오류 발생: " + e.getMessage();
        }
    }
}