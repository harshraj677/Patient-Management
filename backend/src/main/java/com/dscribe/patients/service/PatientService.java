package com.dscribe.patients.service;

import com.dscribe.patients.dto.DashboardStats;
import com.dscribe.patients.dto.PatientOptions;
import com.dscribe.patients.dto.PatientRequest;
import com.dscribe.patients.dto.PatientResponse;
import com.dscribe.patients.entity.Patient;
import com.dscribe.patients.entity.PatientStatus;
import com.dscribe.patients.exception.ConflictException;
import com.dscribe.patients.exception.InvalidFieldException;
import com.dscribe.patients.exception.ResourceNotFoundException;
import com.dscribe.patients.repository.PatientRepository;
import com.dscribe.patients.repository.PatientSpecifications;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.Year;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class PatientService {

    private final PatientRepository repository;

    public PatientService(PatientRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<PatientResponse> findAll(String search, String ward, String department, String doctor, PatientStatus status) {
        var spec = PatientSpecifications.withFilters(search, ward, department, doctor, status);
        return repository.findAll(spec, Sort.by(Sort.Direction.DESC, "createdAt"))
                .stream().map(PatientResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public PatientResponse findById(UUID id) {
        return PatientResponse.from(getOrThrow(id));
    }

    @Transactional
    public PatientResponse create(PatientRequest request) {
        validateOptions(request);
        if (repository.existsByNameIgnoreCaseAndAdmissionDateAndDoctor(request.name(), request.admissionDate(), request.doctor())) {
            throw new ConflictException("A patient named '" + request.name() + "' is already recorded as admitted on "
                    + request.admissionDate() + " under " + request.doctor() + ".");
        }
        Patient patient = new Patient();
        apply(patient, request);
        patient.setStatus(PatientStatus.Admitted);
        patient.setPatientId(nextPatientId());
        return PatientResponse.from(repository.save(patient));
    }

    @Transactional
    public PatientResponse update(UUID id, PatientRequest request) {
        Patient patient = getOrThrow(id);
        validateOptions(request);
        if (repository.existsByNameIgnoreCaseAndAdmissionDateAndDoctorAndIdNot(
                request.name(), request.admissionDate(), request.doctor(), id)) {
            throw new ConflictException("Another patient named '" + request.name() + "' is already recorded as admitted on "
                    + request.admissionDate() + " under " + request.doctor() + ".");
        }
        apply(patient, request);
        // saveAndFlush so @PreUpdate runs now and the response carries the new updatedAt
        return PatientResponse.from(repository.saveAndFlush(patient));
    }

    @Transactional
    public PatientResponse updateStatus(UUID id, PatientStatus status) {
        Patient patient = getOrThrow(id);
        if (patient.getStatus() == status) {
            throw new ConflictException("Patient " + patient.getPatientId() + " is already " + status.name().toLowerCase() + ".");
        }
        patient.setStatus(status);
        return PatientResponse.from(repository.saveAndFlush(patient));
    }

    @Transactional
    public void delete(UUID id) {
        repository.delete(getOrThrow(id));
    }

    @Transactional(readOnly = true)
    public DashboardStats stats() {
        return new DashboardStats(
                repository.count(),
                repository.countByStatus(PatientStatus.Admitted),
                repository.countByStatus(PatientStatus.Discharged),
                repository.countByAdmissionDate(LocalDate.now()));
    }

    @Transactional(readOnly = true)
    public List<PatientResponse> recent() {
        return repository.findTop5ByOrderByCreatedAtDesc().stream().map(PatientResponse::from).toList();
    }

    private Patient getOrThrow(UUID id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id " + id));
    }

    /** Generates IDs like DS-2026-0001 from a database sequence (safe under concurrency, never reused). */
    private String nextPatientId() {
        return "DS-" + Year.now().getValue() + "-" + String.format("%04d", repository.nextPatientNumber());
    }

    private void validateOptions(PatientRequest r) {
        Map<String, String> errors = new LinkedHashMap<>();
        if (!PatientOptions.GENDERS.contains(r.gender())) errors.put("gender", "Gender must be one of " + PatientOptions.GENDERS);
        if (!PatientOptions.WARDS.contains(r.ward())) errors.put("ward", "Ward must be one of " + PatientOptions.WARDS);
        if (!PatientOptions.DEPARTMENTS.contains(r.department())) errors.put("department", "Department must be one of " + PatientOptions.DEPARTMENTS);
        if (!PatientOptions.DOCTORS.contains(r.doctor())) errors.put("doctor", "Doctor must be one of " + PatientOptions.DOCTORS);
        if (!errors.isEmpty()) throw new InvalidFieldException(errors);
    }

    private void apply(Patient patient, PatientRequest r) {
        patient.setName(r.name());
        patient.setAge(r.age());
        patient.setGender(r.gender());
        patient.setWard(r.ward());
        patient.setDepartment(r.department());
        patient.setDoctor(r.doctor());
        patient.setAdmissionDate(r.admissionDate());
    }
}
