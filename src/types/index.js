/**
 * API Response and Request Types
 * Matches the Spring Boot backend DTOs
 */

/**
 * Standard API Response Format
 * @typedef {Object} ApiResponse
 * @property {boolean} success - Whether the operation was successful
 * @property {string} message - Response message
 * @property {*} data - Response data (can be any type)
 * @property {string} timestamp - ISO timestamp of the response
 * @property {Array<FieldError>|null} errors - Validation errors if any
 */

/**
 * Field Error (for validation errors)
 * @typedef {Object} FieldError
 * @property {string} field - The field name that has an error
 * @property {string} message - The error message for that field
 */

/**
 * Login Request
 * @typedef {Object} LoginRequest
 * @property {string} email - User email
 * @property {string} password - User password
 */

/**
 * Login Response Data
 * @typedef {Object} LoginResponseData
 * @property {string} accessToken - JWT access token
 * @property {string} refreshToken - JWT refresh token
 * @property {User} user - User information
 */

/**
 * User
 * @typedef {Object} User
 * @property {number} id - User ID
 * @property {string} email - User email
 * @property {string} firstName - First name
 * @property {string} lastName - Last name
 * @property {('ADMIN'|'DOCTOR'|'RECEPTIONIST'|'PATIENT')} role - User role
 */

/**
 * Doctor
 * @typedef {Object} Doctor
 * @property {number} id - Doctor ID
 * @property {User} user - Associated user
 * @property {string} specialization - Doctor's specialization
 * @property {string} qualification - Medical qualification
 * @property {number} experienceYears - Years of experience
 * @property {string} phone - Contact phone
 * @property {boolean} available - Currently available
 * @property {string} consultationFee - Consultation fee
 * @property {string} workingHoursStart - Start time (HH:mm format)
 * @property {string} workingHoursEnd - End time (HH:mm format)
 */

/**
 * Patient
 * @typedef {Object} Patient
 * @property {number} id - Patient ID
 * @property {User} user - Associated user
 * @property {string} phone - Contact phone
 * @property {string} dateOfBirth - Date of birth (YYYY-MM-DD)
 * @property {('MALE'|'FEMALE'|'OTHER')} gender - Gender
 * @property {string} bloodGroup - Blood group
 * @property {string} address - Address
 * @property {string} emergencyContactName - Emergency contact name
 * @property {string} emergencyContactPhone - Emergency contact phone
 * @property {string} allergies - Known allergies
 * @property {string} currentMedications - Current medications
 */

/**
 * Appointment
 * @typedef {Object} Appointment
 * @property {number} id - Appointment ID
 * @property {Patient} patient - Patient information
 * @property {Doctor} doctor - Doctor information
 * @property {string} appointmentDate - Date (YYYY-MM-DD)
 * @property {string} appointmentTime - Time (HH:mm)
 * @property {('PENDING'|'CONFIRMED'|'CANCELLED'|'COMPLETED'|'NOSHOW')} status - Status
 * @property {string} type - Appointment type (Check-up, Follow-up, etc.)
 * @property {string} notes - Additional notes
 * @property {string} createdAt - Creation timestamp
 */

/**
 * Medical History Record
 * @typedef {Object} MedicalHistoryRecord
 * @property {number} id - Record ID
 * @property {number} patientId - Patient ID
 * @property {Doctor} doctor - Recording doctor
 * @property {string} diagnosis - Diagnosis
 * @property {string} prescription - Prescription details
 * @property {string} notes - Clinical notes
 * @property {string} visitDate - Date of visit
 * @property {string} createdAt - Creation timestamp
 */

/**
 * Invoice
 * @typedef {Object} Invoice
 * @property {number} id - Invoice ID
 * @property {Patient} patient - Patient information
 * @property {Appointment} appointment - Related appointment
 * @property {number} amount - Total amount
 * @property {number} paidAmount - Amount paid
 * @property {('PENDING'|'PAID'|'PARTIAL'|'CANCELLED'|'OVERDUE')} status - Payment status
 * @property {string} dueDate - Payment due date
 * @property {Array<InvoiceItem>} items - Invoice line items
 * @property {string} createdAt - Creation timestamp
 */

/**
 * Payment
 * @typedef {Object} Payment
 * @property {number} id - Payment ID
 * @property {number} invoiceId - Related invoice ID
 * @property {number} amount - Payment amount
 * @property {string} paymentMethod - Method (CASH, CARD, UPI, etc.)
 * @property {string} transactionId - Transaction reference
 * @property {string} paidAt - Payment timestamp
 */

// Export empty object for module compatibility
export default {};
