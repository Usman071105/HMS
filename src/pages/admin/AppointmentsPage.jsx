import { useState } from 'react';
import { InfoCard, StatCard, AppointmentCard } from '../../components/Cards';
import AppointmentCalendar from '../../components/Calendar';
import DataTable, { StatusBadge } from '../../components/DataTable';
import { Calendar, Clock, CheckCircle, XCircle, Plus, Filter } from 'lucide-react';
import './AppointmentsPage.css';

// Mock data
const mockAppointments = [
    { id: 1, patientName: 'John Smith', doctorName: 'Dr. Williams', dateTime: '2026-01-05 09:00', type: 'Check-up', status: 'Confirmed' },
    { id: 2, patientName: 'Sarah Johnson', doctorName: 'Dr. Chen', dateTime: '2026-01-05 10:30', type: 'Follow-up', status: 'Pending' },
    { id: 3, patientName: 'Michael Brown', doctorName: 'Dr. Williams', dateTime: '2026-01-05 11:00', type: 'Consultation', status: 'Completed' },
    { id: 4, patientName: 'Emily Davis', doctorName: 'Dr. Patel', dateTime: '2026-01-05 14:00', type: 'Check-up', status: 'Confirmed' },
    { id: 5, patientName: 'Robert Wilson', doctorName: 'Dr. Adams', dateTime: '2026-01-05 15:30', type: 'Emergency', status: 'Cancelled' },
    { id: 6, patientName: 'Lisa Anderson', doctorName: 'Dr. Chen', dateTime: '2026-01-06 09:30', type: 'Follow-up', status: 'Pending' },
    { id: 7, patientName: 'David Miller', doctorName: 'Dr. Williams', dateTime: '2026-01-06 10:00', type: 'Check-up', status: 'Confirmed' }
];

const calendarEvents = mockAppointments.map(apt => ({
    id: apt.id.toString(),
    title: `${apt.patientName} - ${apt.doctorName}`,
    start: new Date(apt.dateTime),
    status: apt.status.toUpperCase()
}));

export default function AppointmentsPage() {
    const [view, setView] = useState('list');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterDoctor, setFilterDoctor] = useState('');

    const filteredAppointments = mockAppointments.filter(apt => {
        if (filterStatus && apt.status !== filterStatus) return false;
        if (filterDoctor && apt.doctorName !== filterDoctor) return false;
        return true;
    });

    const stats = {
        total: mockAppointments.length,
        confirmed: mockAppointments.filter(a => a.status === 'Confirmed').length,
        pending: mockAppointments.filter(a => a.status === 'Pending').length,
        completed: mockAppointments.filter(a => a.status === 'Completed').length
    };

    const columns = [
        { key: 'patientName', label: 'Patient' },
        { key: 'doctorName', label: 'Doctor' },
        {
            key: 'dateTime',
            label: 'Date & Time',
            render: (value) => {
                const date = new Date(value);
                return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
            }
        },
        {
            key: 'type',
            label: 'Type',
            render: (value) => <span className={`type-badge type-${value.toLowerCase()}`}>{value}</span>
        },
        {
            key: 'status',
            label: 'Status',
            render: (value) => {
                const variants = { Confirmed: 'success', Pending: 'warning', Completed: 'info', Cancelled: 'error' };
                return <StatusBadge status={value} variant={variants[value]} />;
            }
        }
    ];

    return (
        <div className="appointments-page">
            <div className="page-header">
                <div>
                    <h1>Appointments</h1>
                    <p>Manage and schedule appointments</p>
                </div>
                <div className="header-actions">
                    <div className="view-toggle">
                        <button className={`toggle-btn ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')}>
                            List
                        </button>
                        <button className={`toggle-btn ${view === 'calendar' ? 'active' : ''}`} onClick={() => setView('calendar')}>
                            Calendar
                        </button>
                    </div>
                    <button className="btn btn-primary">
                        <Plus size={18} />
                        New Appointment
                    </button>
                </div>
            </div>

            <div className="stats-grid">
                <StatCard title="Total" value={stats.total} icon={Calendar} color="primary" />
                <StatCard title="Confirmed" value={stats.confirmed} icon={CheckCircle} color="success" />
                <StatCard title="Pending" value={stats.pending} icon={Clock} color="warning" />
                <StatCard title="Completed" value={stats.completed} icon={CheckCircle} color="primary" />
            </div>

            {view === 'list' ? (
                <>
                    <div className="filters-bar">
                        <div className="filter-group">
                            <Filter size={16} />
                            <label>Status:</label>
                            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                                <option value="">All</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Pending">Pending</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>
                        <div className="filter-group">
                            <label>Doctor:</label>
                            <select value={filterDoctor} onChange={(e) => setFilterDoctor(e.target.value)}>
                                <option value="">All Doctors</option>
                                <option value="Dr. Williams">Dr. Williams</option>
                                <option value="Dr. Chen">Dr. Chen</option>
                                <option value="Dr. Patel">Dr. Patel</option>
                                <option value="Dr. Adams">Dr. Adams</option>
                            </select>
                        </div>
                    </div>

                    <InfoCard>
                        <DataTable
                            data={filteredAppointments}
                            columns={columns}
                            pageSize={10}
                            searchable={true}
                        />
                    </InfoCard>
                </>
            ) : (
                <AppointmentCalendar
                    events={calendarEvents}
                    initialView="timeGridWeek"
                    onEventClick={(event) => console.log('Event clicked:', event)}
                    onDateClick={(date) => console.log('Date clicked:', date)}
                />
            )}
        </div>
    );
}
