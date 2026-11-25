// Dropdown options. The backend validates against the same lists.
export const GENDERS = ['Male', 'Female', 'Other'] as const

export const WARDS = [
  'General Ward',
  'ICU',
  'Emergency',
  'Private Ward',
  'Pediatrics Ward',
  'Surgical Ward',
  'Maternity Ward',
] as const

export const DEPARTMENTS = [
  'General Medicine',
  'Cardiology',
  'Neurology',
  'Orthopedics',
  'Pediatrics',
  'General Surgery',
  'Gynecology',
  'Emergency Medicine',
  'Dermatology',
  'Oncology',
] as const

export const DOCTORS = [
  'Dr. Ananya Rao',
  'Dr. Rahul Sharma',
  'Dr. Priya Nair',
  'Dr. Vikram Kumar',
  'Dr. Sneha Patil',
] as const

export const STATUSES = ['Admitted', 'Discharged'] as const
