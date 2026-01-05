import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { StatCard, InfoCard, ActionCard, AppointmentCard } from '../../components/Cards';
import { Calendar, FileText, User, Clock, Plus, History } from 'lucide-react';
import './PatientPortal.css';

// Mock data
const mockUpcomingAppointments = [
    { id: 1, doctorName: 'Williams', time: '10:00', date: 'Jan 10, 2026', type: 'Check-up', status: 'Confirmed' },
    { id: 2, doctorName: 'Chen', time: '14:30', date: 'Jan 15, 2026', type: 'Follow-up', status: 'Pending' }
];

const mockPastAppointments = [
    { id: 3, doctorName: 'Patel', time: '09:00', date: 'Dec 28, 2025', type: 'Consultation', status: 'Completed' },
    { id: 4, doctorName: 'Williams', time: '11:00', date: 'Dec 15, 2025', type: 'Check-up', status: 'Completed' }
];

const mockMedicalRecords = [
    { id: 1, title: 'Blood Test Results', date: 'Dec 28, 2025', doctor: 'Dr. Patel' },
    { id: 2, title: 'General Check-up Report', date: 'Dec 15, 2025', doctor: 'Dr. Williams' },
    { id: 3, title: 'X-Ray Report', date: 'Nov 20, 2025', doctor: 'Dr. Chen' }
];

export default function PatientPortal() {
    const { user } = useAuth();

    return (
        <div className="patient-portal">
            {/* Header */}
            <div className="portal-header">
                <div className="welcome-section">
                    <h1>Welcome, {user?.firstName || 'Patient'}</h1>
                    <p>Manage your appointments and health records</p>
                </div>
                <div className="profile-summary">
                    <div className="avatar">
                        {user?.firstName?.[0] || 'P'}
                    </div>
                    <div className="profile-details">
                        <span className="name">{user?.firstName || 'Patient'} {user?.lastName || ''}</span>
                        <span className="id">Patient ID: P-{Math.floor(Math.random() * 10000)}</span>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
                <ActionCard
                    title="Book Appointment"
                    description="Schedule a new appointment with a doctor"
                    icon={Plus}
                    color="primary"
                    onClick={() => window.location.href = '/patient/book'}
                />
                <ActionCard
                    title="View Medical Records"
                    description="Access your health records and reports"
                    icon={FileText}
                    color="secondary"
                    onClick={() => window.location.href = '/patient/records'}
                />
                <ActionCard
                    title="Update Profile"
                    description="Manage your personal information"
                    icon={User}
                    color="primary"
                    onClick={() => window.location.href = '/patient/profile'}
                />
            </div>

            {/* Stats */}
            <div className="stats-row">
                <StatCard
                    title="Upcoming Appointments"
                    value={mockUpcomingAppointments.length}
                    icon={Calendar}
                    color="primary"
                />
                <StatCard
                    title="Medical Records"
                    value={mockMedicalRecords.length}
                    icon={FileText}
                    color="success"
                />
                <StatCard
                    title="Past Visits"
                    value={mockPastAppointments.length}
                    icon={History}
                    color="warning"
                />
            </div>

            {/* Main Content */}
            <div className="portal-grid">
                {/* Upcoming Appointments */}
                <InfoCard
                    title="Upcoming Appointments"
                    actions={
                        <button className="btn btn-primary btn-sm" onClick={() => window.location.href = '/patient/book'}>
                            <Plus size={14} /> Book New
                        </button>
                    }
                >
                    {mockUpcomingAppointments.length > 0 ? (
                        <div className="appointments-list">
                            {mockUpcomingAppointments.map(apt => (
                                <AppointmentCard
                                    key={apt.id}
                                    patientName={user?.firstName || 'You'}
                                    doctorName={apt.doctorName}
                                    time={apt.time}
                                    date={apt.date}
                                    type={apt.type}
                                    status={apt.status}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <Calendar size={48} />
                            <h4>No Upcoming Appointments</h4>
                            <p>Book an appointment with your doctor</p>
                            <button className="btn btn-primary">Book Now</button>
                        </div>
                    )}
                </InfoCard>

                {/* Medical Records */}
                <InfoCard
                    title="Recent Medical Records"
                    actions={<button className="btn btn-outline btn-sm">View All</button>}
                >
                    <div className="records-list">
                        {mockMedicalRecords.map(record => (
                            <div key={record.id} className="record-item">
                                <div className="record-icon">
                                    <FileText size={20} />
                                </div>
                                <div className="record-info">
                                    <h4>{record.title}</h4>
                                    <p>{record.date} • {record.doctor}</p>
                                </div>
                                <button className="btn btn-outline btn-sm">View</button>
                            </div>
                        ))}
                    </div>
                </InfoCard>
            </div>

            {/* Past Appointments */}
            <InfoCard
                title="Past Appointments"
                className="past-appointments"
                actions={<button className="btn btn-outline btn-sm">View All</button>}
            >
                <div className="appointments-list horizontal">
                    {mockPastAppointments.map(apt => (
                        <AppointmentCard
                            key={apt.id}
                            patientName={user?.firstName || 'You'}
                            doctorName={apt.doctorName}
                            time={apt.time}
                            date={apt.date}
                            type={apt.type}
                            status={apt.status}
                        />
                    ))}
                </div>
            </InfoCard>
        </div>
    );
}
