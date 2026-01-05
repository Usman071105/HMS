import { useState } from 'react';
import { InfoCard, StatCard } from '../../components/Cards';
import DataTable, { StatusBadge } from '../../components/DataTable';
import { Users, UserPlus, FileText, Phone, Mail, Calendar, Eye, ClipboardList, Activity } from 'lucide-react';
import './DoctorPatients.css';

// Mock data
const mockPatients = [
    { id: 1, name: 'John Smith', age: 45, gender: 'Male', phone: '+1 234-567-8900', email: 'john.s@email.com', bloodGroup: 'O+', condition: 'Hypertension', lastVisit: '2026-01-05', nextAppointment: '2026-01-12', status: 'Active' },
    { id: 2, name: 'Sarah Johnson', age: 32, gender: 'Female', phone: '+1 234-567-8901', email: 'sarah.j@email.com', bloodGroup: 'A+', condition: 'Diabetes Type 2', lastVisit: '2026-01-04', nextAppointment: '2026-01-11', status: 'Active' },
    { id: 3, name: 'Michael Brown', age: 58, gender: 'Male', phone: '+1 234-567-8902', email: 'michael.b@email.com', bloodGroup: 'B+', condition: 'Arthritis', lastVisit: '2026-01-03', nextAppointment: null, status: 'Active' },
    { id: 4, name: 'Emily Davis', age: 28, gender: 'Female', phone: '+1 234-567-8903', email: 'emily.d@email.com', bloodGroup: 'AB+', condition: 'Migraine', lastVisit: '2025-12-28', nextAppointment: '2026-01-15', status: 'Follow-up' },
    { id: 5, name: 'Robert Wilson', age: 67, gender: 'Male', phone: '+1 234-567-8904', email: 'robert.w@email.com', bloodGroup: 'O-', condition: 'Heart Disease', lastVisit: '2026-01-02', nextAppointment: '2026-01-09', status: 'Critical' },
    { id: 6, name: 'Lisa Anderson', age: 41, gender: 'Female', phone: '+1 234-567-8905', email: 'lisa.a@email.com', bloodGroup: 'A-', condition: 'Thyroid', lastVisit: '2026-01-01', nextAppointment: null, status: 'Active' }
];

export default function DoctorPatients() {
    const [patients] = useState(mockPatients);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [filterStatus, setFilterStatus] = useState('');

    const stats = {
        total: patients.length,
        active: patients.filter(p => p.status === 'Active').length,
        followUp: patients.filter(p => p.status === 'Follow-up').length,
        critical: patients.filter(p => p.status === 'Critical').length
    };

    const filteredPatients = filterStatus
        ? patients.filter(p => p.status === filterStatus)
        : patients;

    const columns = [
        {
            key: 'name',
            label: 'Patient',
            render: (value, row) => (
                <div className="patient-name-cell">
                    <div className="patient-avatar">{value.split(' ').map(n => n[0]).join('')}</div>
                    <div>
                        <span className="name">{value}</span>
                        <span className="details">{row.age} yrs, {row.gender}</span>
                    </div>
                </div>
            )
        },
        { key: 'condition', label: 'Condition' },
        { key: 'bloodGroup', label: 'Blood', width: '70px' },
        { key: 'lastVisit', label: 'Last Visit' },
        {
            key: 'nextAppointment',
            label: 'Next Appt',
            render: (value) => value || <span className="text-muted">Not scheduled</span>
        },
        {
            key: 'status',
            label: 'Status',
            render: (value) => {
                const variants = { Active: 'success', 'Follow-up': 'warning', Critical: 'error' };
                return <StatusBadge status={value} variant={variants[value]} />;
            }
        }
    ];

    const tableActions = (row) => (
        <div className="action-buttons">
            <button className="icon-btn" onClick={() => setSelectedPatient(row)} title="View Profile">
                <Eye size={16} />
            </button>
            <button className="icon-btn" title="Medical Records">
                <FileText size={16} />
            </button>
            <button className="icon-btn" title="Schedule Appointment">
                <Calendar size={16} />
            </button>
        </div>
    );

    return (
        <div className="doctor-patients">
            <div className="page-header">
                <div>
                    <h1>My Patients</h1>
                    <p>View and manage your patient records</p>
                </div>
            </div>

            {/* Stats */}
            <div className="stats-grid">
                <StatCard title="Total Patients" value={stats.total} icon={Users} color="primary" />
                <StatCard title="Active" value={stats.active} icon={Activity} color="success" />
                <StatCard title="Follow-up Needed" value={stats.followUp} icon={Calendar} color="warning" />
                <StatCard title="Critical" value={stats.critical} icon={Activity} color="error" />
            </div>

            {/* Content */}
            <div className="content-grid">
                <div className="table-section">
                    <div className="filters-bar">
                        <div className="filter-group">
                            <label>Status:</label>
                            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                                <option value="">All Patients</option>
                                <option value="Active">Active</option>
                                <option value="Follow-up">Follow-up</option>
                                <option value="Critical">Critical</option>
                            </select>
                        </div>
                    </div>

                    <InfoCard>
                        <DataTable
                            data={filteredPatients}
                            columns={columns}
                            pageSize={8}
                            searchable={true}
                            actions={tableActions}
                            onRowClick={(row) => setSelectedPatient(row)}
                        />
                    </InfoCard>
                </div>

                {/* Patient Details */}
                {selectedPatient && (
                    <div className="patient-details">
                        <InfoCard
                            title="Patient Profile"
                            actions={<button className="close-btn" onClick={() => setSelectedPatient(null)}>×</button>}
                        >
                            <div className="profile-content">
                                <div className="profile-header">
                                    <div className="avatar large">
                                        {selectedPatient.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div>
                                        <h3>{selectedPatient.name}</h3>
                                        <p>{selectedPatient.age} years, {selectedPatient.gender}</p>
                                        <StatusBadge
                                            status={selectedPatient.status}
                                            variant={selectedPatient.status === 'Active' ? 'success' : selectedPatient.status === 'Critical' ? 'error' : 'warning'}
                                        />
                                    </div>
                                </div>

                                <div className="info-section">
                                    <h4>Contact Information</h4>
                                    <div className="info-item">
                                        <Phone size={16} />
                                        <span>{selectedPatient.phone}</span>
                                    </div>
                                    <div className="info-item">
                                        <Mail size={16} />
                                        <span>{selectedPatient.email}</span>
                                    </div>
                                </div>

                                <div className="info-section">
                                    <h4>Medical Information</h4>
                                    <div className="info-grid">
                                        <div className="info-box">
                                            <span className="label">Blood Group</span>
                                            <span className="value blood">{selectedPatient.bloodGroup}</span>
                                        </div>
                                        <div className="info-box">
                                            <span className="label">Condition</span>
                                            <span className="value">{selectedPatient.condition}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="info-section">
                                    <h4>Appointments</h4>
                                    <div className="info-item">
                                        <span className="label">Last Visit:</span>
                                        <span>{selectedPatient.lastVisit}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="label">Next Appointment:</span>
                                        <span>{selectedPatient.nextAppointment || 'Not scheduled'}</span>
                                    </div>
                                </div>

                                <div className="profile-actions">
                                    <button className="btn btn-primary">View Medical Records</button>
                                    <button className="btn btn-outline">Schedule Appointment</button>
                                </div>
                            </div>
                        </InfoCard>
                    </div>
                )}
            </div>
        </div>
    );
}
