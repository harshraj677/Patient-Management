-- Sequence behind the human-readable patient ID (DS-YYYY-NNNN).
-- A sequence never hands out the same number twice, so IDs are not reused after a delete.
CREATE SEQUENCE IF NOT EXISTS patient_number_seq START WITH 1 INCREMENT BY 1;
