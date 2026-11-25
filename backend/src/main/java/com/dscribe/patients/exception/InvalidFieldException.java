package com.dscribe.patients.exception;

import java.util.Map;

/** Thrown when field values fail business validation (e.g. a value not in the allowed dropdown list). */
public class InvalidFieldException extends RuntimeException {
    private final Map<String, String> errors;

    public InvalidFieldException(Map<String, String> errors) {
        super("Validation failed");
        this.errors = errors;
    }

    public Map<String, String> getErrors() { return errors; }
}
