package com.dscribe.patients.dto;

import jakarta.validation.constraints.*;

import java.time.LocalDate;

/** Request body for creating or updating a patient. */
public record PatientRequest(

        @NotBlank(message = "Patient name is required")
        @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
        @Pattern(regexp = "^[A-Za-z ]+$", message = "Name can contain only letters and spaces")
        String name,

        @NotNull(message = "Age is required")
        @Min(value = 0, message = "Age must be at least 0")
        @Max(value = 120, message = "Age must be at most 120")
        Integer age,

        @NotBlank(message = "Gender is required")
        String gender,

        @NotBlank(message = "Ward is required")
        String ward,

        @NotBlank(message = "Department is required")
        String department,

        @NotBlank(message = "Doctor is required")
        String doctor,

        @NotNull(message = "Admission date is required")
        @PastOrPresent(message = "Admission date cannot be in the future")
        LocalDate admissionDate
) {
    /** Trim whitespace (and collapse repeated spaces in the name) before validation runs. */
    public PatientRequest {
        name = name == null ? null : name.trim().replaceAll("\\s+", " ");
        gender = trim(gender);
        ward = trim(ward);
        department = trim(department);
        doctor = trim(doctor);
    }

    private static String trim(String value) {
        return value == null ? null : value.trim();
    }
}
