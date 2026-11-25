package com.dscribe.patients.controller;

import com.dscribe.patients.dto.DashboardStats;
import com.dscribe.patients.dto.PatientResponse;
import com.dscribe.patients.service.PatientService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final PatientService service;

    public DashboardController(PatientService service) {
        this.service = service;
    }

    @GetMapping("/stats")
    public DashboardStats stats() {
        return service.stats();
    }

    @GetMapping("/recent-patients")
    public List<PatientResponse> recent() {
        return service.recent();
    }
}
