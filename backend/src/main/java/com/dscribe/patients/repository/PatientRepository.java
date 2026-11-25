package com.dscribe.patients.repository;

import com.dscribe.patients.entity.Patient;
import com.dscribe.patients.entity.PatientStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface PatientRepository extends JpaRepository<Patient, UUID>, JpaSpecificationExecutor<Patient> {

    /** Next value from the PostgreSQL sequence created in schema.sql. */
    @Query(value = "SELECT nextval('patient_number_seq')", nativeQuery = true)
    long nextPatientNumber();

    long countByStatus(PatientStatus status);

    long countByAdmissionDate(LocalDate date);

    List<Patient> findTop5ByOrderByCreatedAtDesc();

    boolean existsByNameIgnoreCaseAndAdmissionDateAndDoctor(String name, LocalDate admissionDate, String doctor);

    boolean existsByNameIgnoreCaseAndAdmissionDateAndDoctorAndIdNot(String name, LocalDate admissionDate, String doctor, UUID id);
}
