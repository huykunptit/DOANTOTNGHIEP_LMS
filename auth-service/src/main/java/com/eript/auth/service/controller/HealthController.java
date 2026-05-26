package com.eript.auth.service.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class HealthController {

    @GetMapping("/actuator/health-check")
    public Map<String, String> healthCheck() {
        return Map.of("status", "auth-service-up");
    }
}
