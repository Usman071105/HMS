import { useState } from 'react';
import { InfoCard, StatCard } from '../../components/Cards';
import DataTable, { StatusBadge } from '../../components/DataTable';
import AppointmentCalendar from '../../components/Calendar';
import { Calendar, Clock, CheckCircle, XCircle, Plus, Filter, RefreshCw, Edit, Trash2 } from 'lucide-react';
import './ReceptionistAppointments.css';

// Mock data
const mockAppointments = [
    { id: 1, patientName: 'John Smith', doctorName: 'Dr. Williams', dateTime: '2026-01-05 09:00', type: 'Check-up', status: 'Upcoming', phone: '+1 234-567-8900' },
    { id: 2, patientName: 'Sarah Johnson', doctorName: 'Dr. Chen', dateTime: '2026-01-05 10:30', type: 'Follow-up', status: 'Confirmed', phone: '+1 234-567-8901' },
    { id: 3, patientName: 'Michael Brown', doctorName: 'Dr. Williams', dateTime: '2026-01-05 11:00', type: 'Consultation', status: 'Completed', phone: '+1 234-567-8902' },
    { id: 4, patientName: 'Emily Davis', doctorName: 'Dr. Patel', dateTime: '2026-01-05 14:00', type: 'Check-up', status: 'Upcoming', phone: '+1 234-567-8903' },
    { id: 5, patientName: 'Robert Wilson', doctorName: 'Dr. Adams', dateTime: '2026-01-04 15:30', type: 'Emergency', status: 'Missed', phone: '+1 234-567-8904' },
    { id: 6, patientName: 'Lisa Anderson', doctorName: 'Dr. Chen', dateTime: '2026-01-05 09:30', type: 'Follow-up', status: 'Completed', phone: '+1 234-567-8905' },
    { id: 7, patientName: 'David Miller', doctorName: 'Dr. Williams', dateTime: '2026-01-06 10:00', type: 'Check-up', status: 'Upcoming', phone: '+1 234-567-8906' }
];

const calendarEvents = mockAppointments.map(apt => ({
    id: apt.id.toString(),
    title: `${apt.patientName} - ${apt.doctorName}`,
    start: new Date(apt.dateTime),
    status: apt.status.toUpperCase()
}));

export default function ReceptionistAppointments() {
    const [view, setView] = useState('list');
    const [filterStatus, setFilterStatus] = useState('');
    const [isRefreshing, setIsRefreshing] = useState(false);

    const stats = {
        today: mockAppointments.filter(a => a.dateTime.includes('2026-01-05')).length,
        upcoming: mockAppointments.filter(a => a.status === 'Upcoming' || a.status === 'Confirmed').length,
        completed: mockAppointments.filter(a => a.status === 'Completed').length,
        missed: mockAppointments.filter(a => a.status === 'Missed').length
    };

    const filteredAppointments = filterStatus
        ? mockAppointments.filter(a => a.status === filterStatus)
        : mockAppointments;

    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => setIsRefreshing(false), 1000);
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
        { key: 'type', label: 'Type' },
        {
            key: 'status',
            label: 'Status',
            render: (value) => {
                const variants = { Upcoming: 'warning', Confirmed: 'success', Completed: 'info', Missed: 'error' };
                return <StatusBadge status={value} variant={variants[value]} />;
            }
        },
        { key: 'phone', label: 'Contact' }
    ];

    const tableActions = (row) => (
        <div className="action-buttons">
            <button className="icon-btn" title="Reschedule"><Edit size={16} /></button>
            <button className="icon-btn delete" title="Cancel"><Trash2 size={16} /></button>
        </div>
    );

    return (
        <div className="receptionist-appointments">
            <div className="page-header">
                <div>
                    <h1>Appointments</h1>
                    <p>Manage patient appointments and schedules</p>
                </div>
                <div className="header-actions">
                    <button className={`btn btn-outline ${isRefreshing ? 'spinning' : ''}`} onClick={handleRefresh}>
                        <RefreshCw size={18} />
                    </button>
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

            {/* Stats */}
            <div className="stats-grid">
                <StatCard title="Today's Total" value={stats.today} icon={Calendar} color="primary" />
                <StatCard title="Upcoming" value={stats.upcoming} icon={Clock} color="warning" />
                <StatCard title="Completed" value={stats.completed} icon={CheckCircle} color="success" />
                <StatCard title="Missed" value={stats.missed} icon={XCircle} color="error" />
            </div>

            {/* Quick Actions */}
            <div className="quick-actions-bar">
                <div className="filter-group">
                    <Filter size={16} />
                    <label>Status:</label>
                    <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                        <option value="">All</option>
                        <option value="Upcoming">Upcoming</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Completed">Completed</option>
                        <option value="Missed">Missed</option>
                    </select>
                </div>
                <div className="quick-buttons">
                    <button className="btn btn-outline btn-sm">Today's Schedule</button>
                    <button className="btn btn-outline btn-sm">This Week</button>
                </div>
            </div>

            {/* Content */}
            {view === 'list' ? (
                <div className="appointments-sections">
                    {/* Upcoming Section */}
                    <InfoCard title="Upcoming Appointments" className="section-card">
                        <DataTable
                            data={filteredAppointments.filter(a => a.status === 'Upcoming' || a.status === 'Confirmed')}
                            columns={columns}
                            pageSize={5}
                            searchable={true}
                            actions={tableActions}
                            emptyMessage="No upcoming appointments"
                        />
                    </InfoCard>

                    {/* Completed Section */}
                    <InfoCard title="Completed Today" className="section-card">
                        <DataTable
                            data={filteredAppointments.filter(a => a.status === 'Completed')}
                            columns={columns}
                            pageSize={5}
                            searchable={false}
                            emptyMessage="No completed appointments today"
                        />
                    </InfoCard>

                    {/* Missed Section */}
                    {stats.missed > 0 && (
                        <InfoCard title="Missed Appointments" className="section-card missed">
                            <DataTable
                                data={filteredAppointments.filter(a => a.status === 'Missed')}
                                columns={columns}
                                pageSize={5}
                                searchable={false}
                                actions={tableActions}
                                emptyMessage="No missed appointments"
                            />
                        </InfoCard>
                    )}
                </div>
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
