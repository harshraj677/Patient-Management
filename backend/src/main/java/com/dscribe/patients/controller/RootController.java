package com.dscribe.patients.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.Map;

/** Friendly landing responses so opening the bare service URL doesn't show a 404. */
@RestController
public class RootController {

    private final HealthController healthController;

    public RootController(HealthController healthController) {
        this.healthController = healthController;
    }

    @GetMapping("/")
    public Map<String, Object> root() {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("service", "DScribe Patient Admission API");
        body.put("status", "UP");
        body.put("health", "/api/health");
        body.put("patients", "/api/patients");
        body.put("dashboard", "/api/dashboard/stats");
        return body;
    }

    /** Alias for /api/health. */
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        return healthController.health();
    }
}
