package com.dscribe.patients.dto;

import com.dscribe.patients.entity.PatientStatus;
import jakarta.validation.constraints.NotNull;

public record StatusUpdateRequest(
        @NotNull(message = "Status is required (Admitted or Discharged)")
        PatientStatus status
) {}
