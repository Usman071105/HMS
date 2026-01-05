import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { InfoCard, StatCard } from '../../components/Cards';
import DataTable, { StatusBadge } from '../../components/DataTable';
import { Calendar, Clock, CheckCircle, XCircle, RefreshCw, Eye, Phone, MapPin } from 'lucide-react';
import './PatientAppointments.css';

// Mock data
const mockAppointments = [
    { id: 1, doctor: 'Dr. John Williams', specialty: 'General Physician', date: '2026-01-06', time: '10:00 AM', type: 'Check-up', status: 'Confirmed', location: 'Room 102' },
    { id: 2, doctor: 'Dr. Sarah Chen', specialty: 'Cardiologist', date: '2026-01-08', time: '02:30 PM', type: 'Follow-up', status: 'Pending', location: 'Room 205' },
    { id: 3, doctor: 'Dr. Michael Brown', specialty: 'Dermatologist', date: '2025-12-28', time: '11:00 AM', type: 'Consultation', status: 'Completed', location: 'Room 108' },
    { id: 4, doctor: 'Dr. Emily Davis', specialty: 'Orthopedic', date: '2025-12-20', time: '03:00 PM', type: 'Check-up', status: 'Completed', location: 'Room 301' },
    { id: 5, doctor: 'Dr. John Williams', specialty: 'General Physician', date: '2025-12-15', time: '09:30 AM', type: 'Follow-up', status: 'Cancelled', location: 'Room 102' }
];

export default function PatientAppointments() {
    const { user } = useAuth();
    const [filterStatus, setFilterStatus] = useState('');
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    const stats = {
        upcoming: mockAppointments.filter(a => a.status === 'Confirmed' || a.status === 'Pending').length,
        completed: mockAppointments.filter(a => a.status === 'Completed').length,
        cancelled: mockAppointments.filter(a => a.status === 'Cancelled').length,
        total: mockAppointments.length
    };

    const filteredAppointments = filterStatus
        ? mockAppointments.filter(a => a.status === filterStatus)
        : mockAppointments;

    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => setIsRefreshing(false), 1000);
    };

    const columns = [
        {
            key: 'doctor',
            label: 'Doctor',
            render: (value, row) => (
                <div className="doctor-cell">
                    <span className="name">{value}</span>
                    <span className="specialty">{row.specialty}</span>
                </div>
            )
        },
        { key: 'date', label: 'Date' },
        { key: 'time', label: 'Time' },
        { key: 'type', label: 'Type' },
        {
            key: 'status',
            label: 'Status',
            render: (value) => {
                const variants = { Confirmed: 'success', Pending: 'warning', Completed: 'info', Cancelled: 'error' };
                return <StatusBadge status={value} variant={variants[value]} />;
            }
        }
    ];

    const tableActions = (row) => (
        <button className="icon-btn" onClick={() => setSelectedAppointment(row)} title="View Details">
            <Eye size={16} />
        </button>
    );

    return (
        <div className="patient-appointments">
            <div className="page-header">
                <div>
                    <h1>My Appointments</h1>
                    <p>View and manage your appointment history</p>
                </div>
                <div className="header-actions">
                    <button className={`btn btn-outline ${isRefreshing ? 'spinning' : ''}`} onClick={handleRefresh}>
                        <RefreshCw size={18} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="stats-grid">
                <StatCard title="Upcoming" value={stats.upcoming} icon={Calendar} color="primary" />
                <StatCard title="Completed" value={stats.completed} icon={CheckCircle} color="success" />
                <StatCard title="Cancelled" value={stats.cancelled} icon={XCircle} color="error" />
                <StatCard title="Total" value={stats.total} icon={Clock} color="primary" />
            </div>

            {/* Filters */}
            <div className="filters-bar">
                <div className="filter-group">
                    <label>Status:</label>
                    <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                        <option value="">All</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            {/* Content */}
            <div className="content-grid">
                <div className="table-section">
                    <InfoCard title="Appointment History">
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

                {/* Appointment Details */}
                {selectedAppointment && (
                    <div className="appointment-details">
                        <InfoCard
                            title="Appointment Details"
                            actions={<button className="close-btn" onClick={() => setSelectedAppointment(null)}>×</button>}
                        >
                            <div className="details-content">
                                <div className="detail-header">
                                    <div className="doctor-avatar">
                                        {selectedAppointment.doctor.split(' ').slice(1).map(n => n[0]).join('')}
                                    </div>
                                    <div>
                                        <h3>{selectedAppointment.doctor}</h3>
                                        <p>{selectedAppointment.specialty}</p>
                                    </div>
                                </div>

                                <div className="detail-section">
                                    <h4>Appointment Info</h4>
                                    <div className="detail-item">
                                        <Calendar size={16} />
                                        <span>{selectedAppointment.date} at {selectedAppointment.time}</span>
                                    </div>
                                    <div className="detail-item">
                                        <MapPin size={16} />
                                        <span>{selectedAppointment.location}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="label">Type:</span>
                                        <span>{selectedAppointment.type}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="label">Status:</span>
                                        <StatusBadge
                                            status={selectedAppointment.status}
                                            variant={selectedAppointment.status === 'Confirmed' ? 'success' : selectedAppointment.status === 'Pending' ? 'warning' : selectedAppointment.status === 'Cancelled' ? 'error' : 'info'}
                                        />
                                    </div>
                                </div>

                                {(selectedAppointment.status === 'Confirmed' || selectedAppointment.status === 'Pending') && (
                                    <div className="detail-actions">
                                        <button className="btn btn-outline">Reschedule</button>
                                        <button className="btn btn-error">Cancel</button>
                                    </div>
                                )}
                            </div>
                        </InfoCard>
                    </div>
                )}
            </div>
        </div>
    );
}
