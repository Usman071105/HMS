import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { StatCard, InfoCard, AppointmentCard } from '../../components/Cards';
import AppointmentCalendar from '../../components/Calendar';
import DataTable from '../../components/DataTable';
import { Calendar, Users, Clock, CheckCircle, Activity } from 'lucide-react';
import './DoctorDashboard.css';

// Mock data
const mockTodayAppointments = [
    { id: 1, patientName: 'John Smith', time: '09:00', date: 'Today', type: 'Check-up', status: 'Confirmed' },
    { id: 2, patientName: 'Sarah Johnson', time: '10:30', date: 'Today', type: 'Follow-up', status: 'Pending' },
    { id: 3, patientName: 'Michael Brown', time: '11:00', date: 'Today', type: 'Consultation', status: 'Confirmed' },
    { id: 4, patientName: 'Emily Davis', time: '14:00', date: 'Today', type: 'Check-up', status: 'Confirmed' },
    { id: 5, patientName: 'Robert Wilson', time: '15:30', date: 'Today', type: 'Emergency', status: 'Checked_In' }
];

const mockCalendarEvents = [
    { id: '1', title: 'John Smith', start: new Date().setHours(9, 0), end: new Date().setHours(9, 30), status: 'CONFIRMED' },
    { id: '2', title: 'Sarah Johnson', start: new Date().setHours(10, 30), end: new Date().setHours(11, 0), status: 'PENDING' },
    { id: '3', title: 'Michael Brown', start: new Date().setHours(11, 0), end: new Date().setHours(11, 30), status: 'CONFIRMED' },
    { id: '4', title: 'Emily Davis', start: new Date().setHours(14, 0), end: new Date().setHours(14, 30), status: 'CONFIRMED' },
    { id: '5', title: 'Robert Wilson', start: new Date().setHours(15, 30), end: new Date().setHours(16, 0), status: 'CHECKED_IN' }
];

const mockPatients = [
    { id: 1, name: 'John Smith', age: 45, lastVisit: '2026-01-05', condition: 'Hypertension', status: 'Active' },
    { id: 2, name: 'Sarah Johnson', age: 32, lastVisit: '2026-01-04', condition: 'Diabetes Type 2', status: 'Active' },
    { id: 3, name: 'Michael Brown', age: 58, lastVisit: '2026-01-04', condition: 'Arthritis', status: 'Active' },
    { id: 4, name: 'Emily Davis', age: 28, lastVisit: '2025-12-28', condition: 'Migraine', status: 'Follow-up' }
];

export default function DoctorDashboard() {
    const { user } = useAuth();
    const [view, setView] = useState('appointments');

    const handleEventClick = (event) => {
        console.log('Event clicked:', event);
        // Open appointment details modal
    };

    const patientColumns = [
        { key: 'name', label: 'Patient Name' },
        { key: 'age', label: 'Age', width: '60px' },
        { key: 'condition', label: 'Condition' },
        { key: 'lastVisit', label: 'Last Visit' },
        {
            key: 'status',
            label: 'Status',
            render: (value) => (
                <span className={`status-badge ${value.toLowerCase().replace('-', '_')}`}>{value}</span>
            )
        }
    ];

    return (
        <div className="doctor-dashboard">
            {/* Header */}
            <div className="dashboard-header">
                <div>
                    <h1>Welcome, Dr. {user?.lastName || 'Doctor'}</h1>
                    <p>You have {mockTodayAppointments.length} appointments today</p>
                </div>
                <div className="view-toggle">
                    <button
                        className={`toggle-btn ${view === 'appointments' ? 'active' : ''}`}
                        onClick={() => setView('appointments')}
                    >
                        List View
                    </button>
                    <button
                        className={`toggle-btn ${view === 'calendar' ? 'active' : ''}`}
                        onClick={() => setView('calendar')}
                    >
                        Calendar
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="stats-grid">
                <StatCard
                    title="Today's Appointments"
                    value={mockTodayAppointments.length}
                    icon={Calendar}
                    color="primary"
                />
                <StatCard
                    title="Patients Seen"
                    value="3"
                    icon={CheckCircle}
                    color="success"
                />
                <StatCard
                    title="Pending"
                    value="2"
                    icon={Clock}
                    color="warning"
                />
                <StatCard
                    title="Total Patients"
                    value="156"
                    icon={Users}
                    color="primary"
                />
            </div>

            {/* Main Content */}
            <div className="dashboard-content">
                {/* Appointments Section */}
                <div className="appointments-section">
                    {view === 'appointments' ? (
                        <InfoCard title="Today's Schedule">
                            <div className="appointments-list">
                                {mockTodayAppointments.map(apt => (
                                    <AppointmentCard
                                        key={apt.id}
                                        patientName={apt.patientName}
                                        doctorName={user?.lastName || 'You'}
                                        time={apt.time}
                                        date={apt.date}
                                        type={apt.type}
                                        status={apt.status}
                                        onClick={() => console.log('View appointment:', apt)}
                                    />
                                ))}
                            </div>
                        </InfoCard>
                    ) : (
                        <AppointmentCalendar
                            events={mockCalendarEvents}
                            onEventClick={handleEventClick}
                            initialView="timeGridDay"
                        />
                    )}
                </div>

                {/* Patients Section */}
                <div className="patients-section">
                    <InfoCard
                        title="My Patients"
                        actions={<button className="btn btn-outline btn-sm">View All</button>}
                    >
                        <DataTable
                            data={mockPatients}
                            columns={patientColumns}
                            pageSize={5}
                            searchable={true}
                            filterable={false}
                        />
                    </InfoCard>
                </div>
            </div>
        </div>
    );
}
