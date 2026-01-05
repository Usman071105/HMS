import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AppointmentCalendar from '../../components/Calendar';
import { InfoCard } from '../../components/Cards';
import { ArrowLeft, Calendar, Clock, User, Check, ChevronRight } from 'lucide-react';
import './AppointmentBooking.css';

// Mock data
const mockDoctors = [
    { id: 1, name: 'Dr. Williams', specialization: 'General Physician', available: true },
    { id: 2, name: 'Dr. Chen', specialization: 'Cardiologist', available: true },
    { id: 3, name: 'Dr. Patel', specialization: 'Orthopedic', available: true },
    { id: 4, name: 'Dr. Johnson', specialization: 'Neurologist', available: false },
    { id: 5, name: 'Dr. Adams', specialization: 'Pediatrician', available: true }
];

const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
];

export default function AppointmentBooking() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [step, setStep] = useState(1);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [appointmentType, setAppointmentType] = useState('');
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [bookingSuccess, setBookingSuccess] = useState(false);

    const handleDateClick = (info) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (info.date >= today) {
            setSelectedDate(info.date);
            setSelectedTime(null);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            // TODO: API call to book appointment
            const appointmentData = {
                doctorId: selectedDoctor.id,
                patientId: user?.id,
                dateTime: new Date(selectedDate.setHours(...selectedTime.split(':'))),
                type: appointmentType,
                notes
            };
            console.log('Booking appointment:', appointmentData);
            await new Promise(resolve => setTimeout(resolve, 1500));
            setBookingSuccess(true);
        } catch (error) {
            console.error('Booking failed:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (bookingSuccess) {
        return (
            <div className="booking-page">
                <div className="success-card">
                    <div className="success-icon">
                        <Check size={48} />
                    </div>
                    <h2>Appointment Booked!</h2>
                    <p>Your appointment has been successfully scheduled.</p>
                    <div className="booking-summary">
                        <div className="summary-item">
                            <User size={18} />
                            <span>{selectedDoctor?.name}</span>
                        </div>
                        <div className="summary-item">
                            <Calendar size={18} />
                            <span>{selectedDate?.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                        <div className="summary-item">
                            <Clock size={18} />
                            <span>{selectedTime}</span>
                        </div>
                    </div>
                    <div className="success-actions">
                        <button className="btn btn-primary" onClick={() => navigate('/patient')}>
                            Back to Dashboard
                        </button>
                        <button className="btn btn-outline" onClick={() => {
                            setBookingSuccess(false);
                            setStep(1);
                            setSelectedDoctor(null);
                            setSelectedDate(null);
                            setSelectedTime(null);
                        }}>
                            Book Another
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="booking-page">
            <div className="page-header">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ArrowLeft size={20} />
                    Back
                </button>
                <div>
                    <h1>Book Appointment</h1>
                    <p>Schedule an appointment with a doctor</p>
                </div>
            </div>

            {/* Progress Steps */}
            <div className="booking-steps">
                <div className={`booking-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
                    <div className="step-number">1</div>
                    <span>Select Doctor</span>
                </div>
                <ChevronRight size={20} className="step-arrow" />
                <div className={`booking-step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
                    <div className="step-number">2</div>
                    <span>Date & Time</span>
                </div>
                <ChevronRight size={20} className="step-arrow" />
                <div className={`booking-step ${step >= 3 ? 'active' : ''}`}>
                    <div className="step-number">3</div>
                    <span>Confirm</span>
                </div>
            </div>

            {/* Step 1: Select Doctor */}
            {step === 1 && (
                <InfoCard title="Select a Doctor">
                    <div className="doctors-grid">
                        {mockDoctors.map(doctor => (
                            <div
                                key={doctor.id}
                                className={`doctor-card ${selectedDoctor?.id === doctor.id ? 'selected' : ''} ${!doctor.available ? 'unavailable' : ''}`}
                                onClick={() => doctor.available && setSelectedDoctor(doctor)}
                            >
                                <div className="doctor-avatar">
                                    {doctor.name.split(' ')[1]?.[0] || 'D'}
                                </div>
                                <div className="doctor-info">
                                    <h4>{doctor.name}</h4>
                                    <p>{doctor.specialization}</p>
                                </div>
                                <span className={`availability ${doctor.available ? 'available' : ''}`}>
                                    {doctor.available ? 'Available' : 'Unavailable'}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="step-actions">
                        <button
                            className="btn btn-primary"
                            disabled={!selectedDoctor}
                            onClick={() => setStep(2)}
                        >
                            Continue
                        </button>
                    </div>
                </InfoCard>
            )}

            {/* Step 2: Date & Time */}
            {step === 2 && (
                <div className="datetime-section">
                    <InfoCard title="Select Date">
                        <AppointmentCalendar
                            events={[]}
                            onDateClick={handleDateClick}
                            initialView="dayGridMonth"
                            selectable={true}
                        />
                    </InfoCard>

                    {selectedDate && (
                        <InfoCard title="Select Time">
                            <div className="time-slots">
                                {timeSlots.map(time => (
                                    <button
                                        key={time}
                                        className={`time-slot ${selectedTime === time ? 'selected' : ''}`}
                                        onClick={() => setSelectedTime(time)}
                                    >
                                        {time}
                                    </button>
                                ))}
                            </div>
                        </InfoCard>
                    )}

                    <div className="step-actions">
                        <button className="btn btn-outline" onClick={() => setStep(1)}>
                            Back
                        </button>
                        <button
                            className="btn btn-primary"
                            disabled={!selectedDate || !selectedTime}
                            onClick={() => setStep(3)}
                        >
                            Continue
                        </button>
                    </div>
                </div>
            )}

            {/* Step 3: Confirm */}
            {step === 3 && (
                <InfoCard title="Confirm Appointment">
                    <div className="confirmation-details">
                        <div className="detail-row">
                            <span className="label">Doctor</span>
                            <span className="value">{selectedDoctor?.name}</span>
                        </div>
                        <div className="detail-row">
                            <span className="label">Specialization</span>
                            <span className="value">{selectedDoctor?.specialization}</span>
                        </div>
                        <div className="detail-row">
                            <span className="label">Date</span>
                            <span className="value">{selectedDate?.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                        <div className="detail-row">
                            <span className="label">Time</span>
                            <span className="value">{selectedTime}</span>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Appointment Type</label>
                        <select value={appointmentType} onChange={(e) => setAppointmentType(e.target.value)}>
                            <option value="">Select type</option>
                            <option value="checkup">General Check-up</option>
                            <option value="followup">Follow-up</option>
                            <option value="consultation">Consultation</option>
                            <option value="emergency">Emergency</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Notes (Optional)</label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Any specific concerns or notes for the doctor"
                            rows={3}
                        />
                    </div>

                    <div className="step-actions">
                        <button className="btn btn-outline" onClick={() => setStep(2)}>
                            Back
                        </button>
                        <button
                            className="btn btn-primary"
                            disabled={isSubmitting}
                            onClick={handleSubmit}
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="spinner"></span>
                                    Booking...
                                </>
                            ) : (
                                <>
                                    <Calendar size={18} />
                                    Confirm Booking
                                </>
                            )}
                        </button>
                    </div>
                </InfoCard>
            )}
        </div>
    );
}
