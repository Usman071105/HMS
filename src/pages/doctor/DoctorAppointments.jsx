import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { InfoCard, StatCard } from '../../components/Cards';
import DataTable, { StatusBadge } from '../../components/DataTable';
import AppointmentCalendar from '../../components/Calendar';
import { Calendar, Clock, CheckCircle, XCircle, Search, Filter, Eye, ClipboardList } from 'lucide-react';
import './DoctorAppointments.css';

// Mock data
const mockAppointments = [
    { id: 1, patientName: 'John Smith', patientAge: 45, phone: '+1 234-567-8900', dateTime: '2026-01-05 09:00', type: 'Check-up', status: 'Confirmed', notes: 'Regular checkup' },
    { id: 2, patientName: 'Sarah Johnson', patientAge: 32, phone: '+1 234-567-8901', dateTime: '2026-01-05 10:30', type: 'Follow-up', status: 'Pending', notes: 'Post-surgery follow up' },
    { id: 3, patientName: 'Michael Brown', patientAge: 58, phone: '+1 234-567-8902', dateTime: '2026-01-05 11:00', type: 'Consultation', status: 'Completed', notes: 'Diabetes consultation' },
    { id: 4, patientName: 'Emily Davis', patientAge: 28, phone: '+1 234-567-8903', dateTime: '2026-01-05 14:00', type: 'Check-up', status: 'Confirmed', notes: '' },
    { id: 5, patientName: 'Robert Wilson', patientAge: 67, phone: '+1 234-567-8904', dateTime: '2026-01-05 15:30', type: 'Emergency', status: 'Cancelled', notes: 'Patient cancelled' },
    { id: 6, patientName: 'Lisa Anderson', patientAge: 41, phone: '+1 234-567-8905', dateTime: '2026-01-06 09:30', type: 'Follow-up', status: 'Confirmed', notes: 'BP monitoring' },
    { id: 7, patientName: 'David Miller', patientAge: 52, phone: '+1 234-567-8906', dateTime: '2026-01-06 10:00', type: 'Check-up', status: 'Pending', notes: '' },
    { id: 8, patientName: 'Anna Taylor', patientAge: 35, phone: '+1 234-567-8907', dateTime: '2026-01-06 11:30', type: 'Consultation', status: 'Confirmed', notes: 'New patient' }
];

const calendarEvents = mockAppointments.map(apt => ({
    id: apt.id.toString(),
    title: apt.patientName,
    start: new Date(apt.dateTime),
    status: apt.status.toUpperCase()
}));

export default function DoctorAppointments() {
    const { user } = useAuth();
    const [view, setView] = useState('list');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterType, setFilterType] = useState('');
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    const stats = {
        total: mockAppointments.length,
        confirmed: mockAppointments.filter(a => a.status === 'Confirmed').length,
        pending: mockAppointments.filter(a => a.status === 'Pending').length,
        completed: mockAppointments.filter(a => a.status === 'Completed').length
    };

    const filteredAppointments = mockAppointments.filter(apt => {
        if (filterStatus && apt.status !== filterStatus) return false;
        if (filterType && apt.type !== filterType) return false;
        return true;
    });

    const columns = [
        {
            key: 'patientName',
            label: 'Patient',
            render: (value, row) => (
                <div className="patient-cell">
                    <span className="name">{value}</span>
                    <span className="age">{row.patientAge} yrs</span>
                </div>
            )
        },
        {
            key: 'dateTime',
            label: 'Date & Time',
            render: (value) => {
                const date = new Date(value);
                return (
                    <div className="datetime-cell">
                        <span className="date">{date.toLocaleDateString()}</span>
                        <span className="time">{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                );
            }
        },
        {
            key: 'type',
            label: 'Type',
            render: (value) => <span className={`type-badge type-${value.toLowerCase().replace('-', '')}`}>{value}</span>
        },
        {
            key: 'status',
            label: 'Status',
            render: (value) => {
                const variants = { Confirmed: 'success', Pending: 'warning', Completed: 'info', Cancelled: 'error' };
                return <StatusBadge status={value} variant={variants[value]} />;
            }
        },
        { key: 'phone', label: 'Contact' }
    ];

    const tableActions = (row) => (
        <div className="action-buttons">
            <button className="icon-btn" onClick={() => setSelectedAppointment(row)} title="View Details">
                <Eye size={16} />
            </button>
            <button className="icon-btn" title="Start Consultation">
                <ClipboardList size={16} />
            </button>
        </div>
    );

    const handleEventClick = (event) => {
        const apt = mockAppointments.find(a => a.id.toString() === event.id);
        if (apt) setSelectedAppointment(apt);
    };

    return (
        <div className="doctor-appointments">
            <div className="page-header">
                <div>
                    <h1>My Appointments</h1>
                    <p>Manage your patient appointments</p>
                </div>
                <div className="header-actions">
                    <div className="view-toggle">
                        <button className={`toggle-btn ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')}>
                            List View
                        </button>
                        <button className={`toggle-btn ${view === 'calendar' ? 'active' : ''}`} onClick={() => setView('calendar')}>
                            Calendar
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="stats-grid">
                <StatCard title="Total Appointments" value={stats.total} icon={Calendar} color="primary" />
                <StatCard title="Confirmed" value={stats.confirmed} icon={CheckCircle} color="success" />
                <StatCard title="Pending" value={stats.pending} icon={Clock} color="warning" />
                <StatCard title="Completed" value={stats.completed} icon={CheckCircle} color="primary" />
            </div>

            {/* Content */}
            <div className="content-area">
                {view === 'list' ? (
                    <div className="list-section">
                        {/* Filters */}
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
                                <label>Type:</label>
                                <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                                    <option value="">All Types</option>
                                    <option value="Check-up">Check-up</option>
                                    <option value="Follow-up">Follow-up</option>
                                    <option value="Consultation">Consultation</option>
                                    <option value="Emergency">Emergency</option>
                                </select>
                            </div>
                        </div>

                        <InfoCard>
                            <DataTable
                                data={filteredAppointments}
                                columns={columns}
                                pageSize={8}
                                searchable={true}
                                actions={tableActions}
                                onRowClick={(row) => setSelectedAppointment(row)}
                            />
                        </InfoCard>
                    </div>
                ) : (
                    <AppointmentCalendar
                        events={calendarEvents}
                        initialView="timeGridWeek"
                        onEventClick={handleEventClick}
                    />
                )}

                {/* Appointment Details Sidebar */}
                {selectedAppointment && (
                    <div className="details-sidebar">
                        <InfoCard
                            title="Appointment Details"
                            actions={
                                <button className="close-btn" onClick={() => setSelectedAppointment(null)}>×</button>
                            }
                        >
                            <div className="detail-content">
                                <div className="patient-header">
                                    <div className="avatar">
                                        {selectedAppointment.patientName.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div>
                                        <h3>{selectedAppointment.patientName}</h3>
                                        <p>{selectedAppointment.patientAge} years old</p>
                                    </div>
                                </div>

                                <div className="detail-list">
                                    <div className="detail-item">
                                        <span className="label">Date & Time</span>
                                        <span className="value">{new Date(selectedAppointment.dateTime).toLocaleString()}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="label">Type</span>
                                        <span className={`type-badge type-${selectedAppointment.type.toLowerCase().replace('-', '')}`}>
                                            {selectedAppointment.type}
                                        </span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="label">Status</span>
                                        <StatusBadge
                                            status={selectedAppointment.status}
                                            variant={selectedAppointment.status === 'Confirmed' ? 'success' : 'warning'}
                                        />
                                    </div>
                                    <div className="detail-item">
                                        <span className="label">Contact</span>
                                        <span className="value">{selectedAppointment.phone}</span>
                                    </div>
                                    {selectedAppointment.notes && (
                                        <div className="detail-item">
                                            <span className="label">Notes</span>
                                            <span className="value">{selectedAppointment.notes}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="detail-actions">
                                    <button className="btn btn-primary">Start Consultation</button>
                                    <button className="btn btn-outline">Reschedule</button>
                                </div>
                            </div>
                        </InfoCard>
                    </div>
                )}
            </div>
        </div>
    );
}
