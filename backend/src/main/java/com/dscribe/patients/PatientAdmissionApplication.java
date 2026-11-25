package com.dscribe.patients;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.TimeZone;

@SpringBootApplication
public class PatientAdmissionApplication {

    public static void main(String[] args) {
        // "Today" and "future date" checks use the hospital's local timezone, not the server's (UTC on Render).
        String zone = System.getenv().getOrDefault("APP_TIMEZONE", "Asia/Kolkata");
        TimeZone.setDefault(TimeZone.getTimeZone(zone));
        SpringApplication.run(PatientAdmissionApplication.class, args);
    }
}
