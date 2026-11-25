package com.dscribe.patients.dto;

import java.util.List;

/** Allowed dropdown values. The backend validates against these independently of the frontend. */
public final class PatientOptions {

    private PatientOptions() {}

    public static final List<String> GENDERS = List.of("Male", "Female", "Other");

    public static final List<String> WARDS = List.of(
            "General Ward", "ICU", "Emergency", "Private Ward",
            "Pediatrics Ward", "Surgical Ward", "Maternity Ward");

    public static final List<String> DEPARTMENTS = List.of(
            "General Medicine", "Cardiology", "Neurology", "Orthopedics", "Pediatrics",
            "General Surgery", "Gynecology", "Emergency Medicine", "Dermatology", "Oncology");

    public static final List<String> DOCTORS = List.of(
            "Dr. Ananya Rao", "Dr. Rahul Sharma", "Dr. Priya Nair", "Dr. Vikram Kumar", "Dr. Sneha Patil");
}
