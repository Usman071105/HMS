import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { StatCard, InfoCard, ActionCard, AppointmentCard } from '../../components/Cards';
import DataTable from '../../components/DataTable';
import AppointmentCalendar from '../../components/Calendar';
import { UserPlus, Calendar, ClipboardList, Search, Users, Clock, CheckCircle } from 'lucide-react';
import './ReceptionistDashboard.css';

// Mock data
const mockTodayAppointments = [
    { id: 1, patientName: 'John Smith', doctorName: 'Williams', time: '09:00', date: 'Today', type: 'Check-up', status: 'Confirmed' },
    { id: 2, patientName: 'Sarah Johnson', doctorName: 'Chen', time: '10:30', date: 'Today', type: 'Follow-up', status: 'Pending' },
    { id: 3, patientName: 'Michael Brown', doctorName: 'Williams', time: '11:00', date: 'Today', type: 'Consultation', status: 'Checked_In' },
    { id: 4, patientName: 'Emily Davis', doctorName: 'Patel', time: '14:00', date: 'Today', type: 'Check-up', status: 'Confirmed' }
];

const mockWaitingPatients = [
    { id: 1, name: 'John Smith', checkInTime: '08:55', doctor: 'Dr. Williams', waitTime: '15 min' },
    { id: 2, name: 'Michael Brown', checkInTime: '10:45', doctor: 'Dr. Williams', waitTime: '5 min' }
];

export default function ReceptionistDashboard() {
    const { user } = useAuth();
    const [quickSearchQuery, setQuickSearchQuery] = useState('');

    const waitingColumns = [
        { key: 'name', label: 'Patient Name' },
        { key: 'checkInTime', label: 'Check-in Time' },
        { key: 'doctor', label: 'Doctor' },
        { key: 'waitTime', label: 'Wait Time' },
        {
            key: 'id',
            label: 'Action',
            render: (value, row) => (
                <button className="btn btn-primary btn-sm" onClick={() => console.log('Call:', row)}>
                    Call Patient
                </button>
            )
        }
    ];

    return (
        <div className="receptionist-dashboard">
            {/* Header */}
            <div className="dashboard-header">
                <div>
                    <h1>Receptionist Dashboard</h1>
                    <p>Good morning, {user?.firstName || 'Receptionist'}! Here's today's overview.</p>
                </div>
                <div className="quick-search">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Quick patient search..."
                        value={quickSearchQuery}
                        onChange={(e) => setQuickSearchQuery(e.target.value)}
                    />
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
                    title="Checked In"
                    value="2"
                    icon={CheckCircle}
                    color="success"
                />
                <StatCard
                    title="Waiting"
                    value={mockWaitingPatients.length}
                    icon={Clock}
                    color="warning"
                />
                <StatCard
                    title="New Registrations"
                    value="5"
                    icon={UserPlus}
                    color="primary"
                />
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
                <ActionCard
                    title="Register New Patient"
                    description="Add a new patient to the system"
                    icon={UserPlus}
                    color="primary"
                    onClick={() => window.location.href = '/receptionist/register'}
                />
                <ActionCard
                    title="Book Appointment"
                    description="Schedule a new appointment"
                    icon={Calendar}
                    color="secondary"
                    onClick={() => window.location.href = '/receptionist/appointments'}
                />
                <ActionCard
                    title="Patient Check-In"
                    description="Check in arriving patients"
                    icon={ClipboardList}
                    color="primary"
                    onClick={() => window.location.href = '/receptionist/checkin'}
                />
            </div>

            {/* Main Content */}
            <div className="dashboard-grid">
                {/* Waiting Patients */}
                <InfoCard title="Waiting Patients" className="waiting-card">
                    <DataTable
                        data={mockWaitingPatients}
                        columns={waitingColumns}
                        pageSize={5}
                        searchable={false}
                        filterable={false}
                        emptyMessage="No patients currently waiting"
                    />
                </InfoCard>

                {/* Today's Appointments */}
                <InfoCard title="Today's Schedule" className="schedule-card">
                    <div className="appointments-list">
                        {mockTodayAppointments.map(apt => (
                            <AppointmentCard
                                key={apt.id}
                                patientName={apt.patientName}
                                doctorName={apt.doctorName}
                                time={apt.time}
                                date={apt.date}
                                type={apt.type}
                                status={apt.status}
                                onClick={() => console.log('View:', apt)}
                            />
                        ))}
                    </div>
                </InfoCard>
            </div>
        </div>
    );
}
