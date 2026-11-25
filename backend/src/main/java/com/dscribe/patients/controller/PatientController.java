package com.dscribe.patients.controller;

import com.dscribe.patients.dto.PatientRequest;
import com.dscribe.patients.dto.PatientResponse;
import com.dscribe.patients.dto.StatusUpdateRequest;
import com.dscribe.patients.entity.PatientStatus;
import com.dscribe.patients.service.PatientService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    private final PatientService service;

    public PatientController(PatientService service) {
        this.service = service;
    }

    @GetMapping
    public List<PatientResponse> list(@RequestParam(required = false) String search,
                                      @RequestParam(required = false) String ward,
                                      @RequestParam(required = false) String department,
                                      @RequestParam(required = false) String doctor,
                                      @RequestParam(required = false) PatientStatus status) {
        return service.findAll(search, ward, department, doctor, status);
    }

    @GetMapping("/{id}")
    public PatientResponse get(@PathVariable UUID id) {
        return service.findById(id);
    }

    @PostMapping
    public ResponseEntity<PatientResponse> create(@Valid @RequestBody PatientRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(request));
    }

    @PutMapping("/{id}")
    public PatientResponse update(@PathVariable UUID id, @Valid @RequestBody PatientRequest request) {
        return service.update(id, request);
    }

    @PatchMapping("/{id}/status")
    public PatientResponse updateStatus(@PathVariable UUID id, @Valid @RequestBody StatusUpdateRequest request) {
        return service.updateStatus(id, request.status());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
