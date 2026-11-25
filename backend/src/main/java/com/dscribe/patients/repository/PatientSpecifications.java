package com.dscribe.patients.repository;

import com.dscribe.patients.entity.Patient;
import com.dscribe.patients.entity.PatientStatus;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

/** Builds the WHERE clause for search + filters. Blank filters are skipped; the rest are combined with AND. */
public final class PatientSpecifications {

    private PatientSpecifications() {}

    public static Specification<Patient> withFilters(String search, String ward, String department,
                                                     String doctor, PatientStatus status) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (hasText(search)) {
                predicates.add(cb.like(cb.lower(root.get("name")), "%" + search.trim().toLowerCase() + "%"));
            }
            if (hasText(ward)) predicates.add(cb.equal(root.get("ward"), ward.trim()));
            if (hasText(department)) predicates.add(cb.equal(root.get("department"), department.trim()));
            if (hasText(doctor)) predicates.add(cb.equal(root.get("doctor"), doctor.trim()));
            if (status != null) predicates.add(cb.equal(root.get("status"), status));
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    private static boolean hasText(String s) {
        return s != null && !s.isBlank();
    }
}
