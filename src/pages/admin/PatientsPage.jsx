import { useState } from 'react';
import { InfoCard, StatCard } from '../../components/Cards';
import DataTable, { StatusBadge } from '../../components/DataTable';
import { Users, UserPlus, Search, Edit, Trash2, Eye, FileText, Phone, Mail } from 'lucide-react';
import './PatientsPage.css';

// Mock data
const mockPatients = [
    { id: 1, name: 'John Smith', age: 45, gender: 'Male', phone: '+1 234-567-8900', email: 'john.s@email.com', bloodGroup: 'O+', status: 'Active', lastVisit: '2026-01-05' },
    { id: 2, name: 'Sarah Johnson', age: 32, gender: 'Female', phone: '+1 234-567-8901', email: 'sarah.j@email.com', bloodGroup: 'A+', status: 'Active', lastVisit: '2026-01-04' },
    { id: 3, name: 'Michael Brown', age: 58, gender: 'Male', phone: '+1 234-567-8902', email: 'michael.b@email.com', bloodGroup: 'B+', status: 'Active', lastVisit: '2026-01-04' },
    { id: 4, name: 'Emily Davis', age: 28, gender: 'Female', phone: '+1 234-567-8903', email: 'emily.d@email.com', bloodGroup: 'AB+', status: 'Inactive', lastVisit: '2025-12-28' },
    { id: 5, name: 'Robert Wilson', age: 67, gender: 'Male', phone: '+1 234-567-8904', email: 'robert.w@email.com', bloodGroup: 'O-', status: 'Active', lastVisit: '2026-01-03' },
    { id: 6, name: 'Lisa Anderson', age: 41, gender: 'Female', phone: '+1 234-567-8905', email: 'lisa.a@email.com', bloodGroup: 'A-', status: 'Active', lastVisit: '2026-01-02' }
];

export default function PatientsPage() {
    const [patients, setPatients] = useState(mockPatients);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [filterStatus, setFilterStatus] = useState('');

    const filteredPatients = filterStatus
        ? patients.filter(p => p.status === filterStatus)
        : patients;

    const columns = [
        {
            key: 'name',
            label: 'Patient Name',
            render: (value, row) => (
                <div className="patient-name-cell">
                    <div className="patient-avatar">{value.split(' ').map(n => n[0]).join('')}</div>
                    <div>
                        <span className="name">{value}</span>
                        <span className="age">{row.age} yrs, {row.gender}</span>
                    </div>
                </div>
            )
        },
        { key: 'phone', label: 'Phone' },
        { key: 'bloodGroup', label: 'Blood Group' },
        {
            key: 'status',
            label: 'Status',
            render: (value) => (
                <StatusBadge status={value} variant={value === 'Active' ? 'success' : 'default'} />
            )
        },
        { key: 'lastVisit', label: 'Last Visit' }
    ];

    const tableActions = (row) => (
        <div className="action-buttons">
            <button className="icon-btn" onClick={() => setSelectedPatient(row)} title="View Details">
                <Eye size={16} />
            </button>
            <button className="icon-btn" title="View Records">
                <FileText size={16} />
            </button>
            <button className="icon-btn" title="Edit">
                <Edit size={16} />
            </button>
        </div>
    );

    return (
        <div className="patients-page">
            <div className="page-header">
                <div>
                    <h1>Patients</h1>
                    <p>Manage patient records and information</p>
                </div>
                <button className="btn btn-primary">
                    <UserPlus size={18} />
                    Add Patient
                </button>
            </div>

            <div className="stats-grid">
                <StatCard title="Total Patients" value={patients.length} icon={Users} color="primary" />
                <StatCard title="Active" value={patients.filter(p => p.status === 'Active').length} icon={Users} color="success" />
                <StatCard title="This Month" value="24" icon={UserPlus} color="warning" />
                <StatCard title="Inactive" value={patients.filter(p => p.status === 'Inactive').length} icon={Users} color="error" />
            </div>

            <div className="content-grid">
                <div className="table-section">
                    <div className="filters-bar">
                        <div className="filter-group">
                            <label>Status:</label>
                            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                                <option value="">All</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
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

                {selectedPatient && (
                    <div className="patient-details">
                        <InfoCard title="Patient Details">
                            <div className="detail-header">
                                <div className="patient-avatar large">
                                    {selectedPatient.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                    <h3>{selectedPatient.name}</h3>
                                    <p>{selectedPatient.age} years old, {selectedPatient.gender}</p>
                                </div>
                            </div>
                            <div className="detail-list">
                                <div className="detail-item">
                                    <Phone size={16} />
                                    <span>{selectedPatient.phone}</span>
                                </div>
                                <div className="detail-item">
                                    <Mail size={16} />
                                    <span>{selectedPatient.email}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="label">Blood Group:</span>
                                    <span className="blood-group">{selectedPatient.bloodGroup}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="label">Last Visit:</span>
                                    <span>{selectedPatient.lastVisit}</span>
                                </div>
                            </div>
                            <div className="detail-actions">
                                <button className="btn btn-primary btn-sm">View Full Profile</button>
                                <button className="btn btn-outline btn-sm">Medical History</button>
                            </div>
                        </InfoCard>
                    </div>
                )}
            </div>
        </div>
    );
}
