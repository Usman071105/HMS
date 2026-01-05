import { useState } from 'react';
import { InfoCard, StatCard } from '../../components/Cards';
import DataTable, { StatusBadge } from '../../components/DataTable';
import { Users, Stethoscope, UserPlus, Edit, Trash2, Eye, Clock, Award } from 'lucide-react';
import './StaffPage.css';

// Mock data
const mockStaff = [
    { id: 1, name: 'Dr. John Williams', role: 'DOCTOR', specialization: 'General Physician', phone: '+1 234-567-8900', status: 'Active', joinDate: '2020-05-15' },
    { id: 2, name: 'Dr. Sarah Chen', role: 'DOCTOR', specialization: 'Cardiologist', phone: '+1 234-567-8901', status: 'Active', joinDate: '2019-08-22' },
    { id: 3, name: 'Dr. Raj Patel', role: 'DOCTOR', specialization: 'Orthopedic', phone: '+1 234-567-8902', status: 'Active', joinDate: '2021-02-10' },
    { id: 4, name: 'Mike Johnson', role: 'RECEPTIONIST', specialization: 'Front Desk', phone: '+1 234-567-8903', status: 'Active', joinDate: '2022-01-05' },
    { id: 5, name: 'Anna Taylor', role: 'RECEPTIONIST', specialization: 'Billing', phone: '+1 234-567-8904', status: 'Active', joinDate: '2023-03-18' },
    { id: 6, name: 'Dr. Lisa Adams', role: 'DOCTOR', specialization: 'Pediatrician', phone: '+1 234-567-8905', status: 'On Leave', joinDate: '2018-11-30' },
    { id: 7, name: 'James Wilson', role: 'NURSE', specialization: 'ICU', phone: '+1 234-567-8906', status: 'Active', joinDate: '2021-07-12' }
];

export default function StaffPage() {
    const [staff, setStaff] = useState(mockStaff);
    const [filterRole, setFilterRole] = useState('');

    const stats = {
        total: staff.length,
        doctors: staff.filter(s => s.role === 'DOCTOR').length,
        nurses: staff.filter(s => s.role === 'NURSE').length,
        active: staff.filter(s => s.status === 'Active').length
    };

    const filteredStaff = filterRole
        ? staff.filter(s => s.role === filterRole)
        : staff;

    const columns = [
        {
            key: 'name',
            label: 'Name',
            render: (value, row) => (
                <div className="staff-name-cell">
                    <div className={`staff-avatar ${row.role.toLowerCase()}`}>
                        {value.split(' ').slice(-1)[0][0]}
                    </div>
                    <div>
                        <span className="name">{value}</span>
                        <span className="spec">{row.specialization}</span>
                    </div>
                </div>
            )
        },
        {
            key: 'role',
            label: 'Role',
            render: (value) => <span className={`role-badge role-${value.toLowerCase()}`}>{value}</span>
        },
        { key: 'phone', label: 'Phone' },
        {
            key: 'status',
            label: 'Status',
            render: (value) => (
                <StatusBadge
                    status={value}
                    variant={value === 'Active' ? 'success' : value === 'On Leave' ? 'warning' : 'default'}
                />
            )
        },
        { key: 'joinDate', label: 'Joined' }
    ];

    const tableActions = (row) => (
        <div className="action-buttons">
            <button className="icon-btn" title="View"><Eye size={16} /></button>
            <button className="icon-btn" title="Edit"><Edit size={16} /></button>
            <button className="icon-btn delete" title="Delete"><Trash2 size={16} /></button>
        </div>
    );

    return (
        <div className="staff-page">
            <div className="page-header">
                <div>
                    <h1>Staff Management</h1>
                    <p>Manage hospital staff and their schedules</p>
                </div>
                <button className="btn btn-primary">
                    <UserPlus size={18} />
                    Add Staff
                </button>
            </div>

            <div className="stats-grid">
                <StatCard title="Total Staff" value={stats.total} icon={Users} color="primary" />
                <StatCard title="Doctors" value={stats.doctors} icon={Stethoscope} color="success" />
                <StatCard title="Nurses" value={stats.nurses} icon={Award} color="warning" />
                <StatCard title="Active Today" value={stats.active} icon={Clock} color="primary" />
            </div>

            <div className="filters-bar">
                <div className="filter-group">
                    <label>Role:</label>
                    <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
                        <option value="">All Roles</option>
                        <option value="DOCTOR">Doctors</option>
                        <option value="NURSE">Nurses</option>
                        <option value="RECEPTIONIST">Receptionists</option>
                    </select>
                </div>
            </div>

            <InfoCard>
                <DataTable
                    data={filteredStaff}
                    columns={columns}
                    pageSize={10}
                    searchable={true}
                    actions={tableActions}
                />
            </InfoCard>
        </div>
    );
}
