package com.example.hotel_management.controller;

import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
@CrossOrigin(origins = "*", allowCredentials = "false")
public class HealthController {

    @GetMapping
    public Map<String, Object> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("message", "Hotel Management API is running");
        response.put("timestamp", System.currentTimeMillis());
        return response;
    }

    @GetMapping("/test")
    public String test() {
        return "API is accessible from external devices!";
    }
} 