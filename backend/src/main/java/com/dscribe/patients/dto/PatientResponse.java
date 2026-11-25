package com.dscribe.patients.dto;

import com.dscribe.patients.entity.Patient;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public record PatientResponse(
        UUID id,
        String patientId,
        String name,
        Integer age,
        String gender,
        String ward,
        String department,
        String doctor,
        LocalDate admissionDate,
        String status,
        Instant createdAt,
        Instant updatedAt
) {
    public static PatientResponse from(Patient p) {
        return new PatientResponse(p.getId(), p.getPatientId(), p.getName(), p.getAge(), p.getGender(),
                p.getWard(), p.getDepartment(), p.getDoctor(), p.getAdmissionDate(),
                p.getStatus().name(), p.getCreatedAt(), p.getUpdatedAt());
    }
}
