import { useState, useEffect } from 'react';
import { InfoCard, StatCard } from '../../components/Cards';
import DataTable, { StatusBadge } from '../../components/DataTable';
import { Users, UserPlus, Shield, Search, Edit, Trash2, X, Check, Eye } from 'lucide-react';
import './UserManagement.css';

// Mock data
const mockUsers = [
    { id: 1, firstName: 'John', lastName: 'Williams', email: 'dr.williams@hospital.com', role: 'DOCTOR', status: 'Active', createdAt: '2025-10-15' },
    { id: 2, firstName: 'Sarah', lastName: 'Chen', email: 'dr.chen@hospital.com', role: 'DOCTOR', status: 'Active', createdAt: '2025-09-20' },
    { id: 3, firstName: 'Mike', lastName: 'Johnson', email: 'mike.j@hospital.com', role: 'RECEPTIONIST', status: 'Active', createdAt: '2025-11-01' },
    { id: 4, firstName: 'Emily', lastName: 'Davis', email: 'emily.d@hospital.com', role: 'PATIENT', status: 'Active', createdAt: '2025-12-10' },
    { id: 5, firstName: 'Robert', lastName: 'Brown', email: 'robert.b@hospital.com', role: 'PATIENT', status: 'Inactive', createdAt: '2025-08-05' },
    { id: 6, firstName: 'Lisa', lastName: 'Wilson', email: 'lisa.w@hospital.com', role: 'ADMIN', status: 'Active', createdAt: '2025-06-15' },
    { id: 7, firstName: 'David', lastName: 'Miller', email: 'david.m@hospital.com', role: 'DOCTOR', status: 'Active', createdAt: '2025-07-22' },
    { id: 8, firstName: 'Anna', lastName: 'Taylor', email: 'anna.t@hospital.com', role: 'RECEPTIONIST', status: 'Active', createdAt: '2025-11-28' }
];

export default function UserManagement() {
    const [users, setUsers] = useState(mockUsers);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add', 'edit', 'view'
    const [selectedUser, setSelectedUser] = useState(null);
    const [filterRole, setFilterRole] = useState('');
    const [loading, setLoading] = useState(false);

    // Stats
    const stats = {
        total: users.length,
        doctors: users.filter(u => u.role === 'DOCTOR').length,
        receptionists: users.filter(u => u.role === 'RECEPTIONIST').length,
        patients: users.filter(u => u.role === 'PATIENT').length
    };

    // Filter users
    const filteredUsers = filterRole
        ? users.filter(u => u.role === filterRole)
        : users;

    // Handle actions
    const handleAdd = () => {
        setSelectedUser(null);
        setModalMode('add');
        setIsModalOpen(true);
    };

    const handleEdit = (user) => {
        setSelectedUser(user);
        setModalMode('edit');
        setIsModalOpen(true);
    };

    const handleView = (user) => {
        setSelectedUser(user);
        setModalMode('view');
        setIsModalOpen(true);
    };

    const handleDelete = (user) => {
        if (window.confirm(`Are you sure you want to delete ${user.firstName} ${user.lastName}?`)) {
            setUsers(users.filter(u => u.id !== user.id));
        }
    };

    const handleSave = (userData) => {
        if (modalMode === 'add') {
            setUsers([...users, { ...userData, id: Date.now(), createdAt: new Date().toISOString().split('T')[0] }]);
        } else {
            setUsers(users.map(u => u.id === selectedUser.id ? { ...u, ...userData } : u));
        }
        setIsModalOpen(false);
    };

    const columns = [
        {
            key: 'name',
            label: 'Name',
            render: (_, row) => (
                <div className="user-name-cell">
                    <div className="user-avatar">{row.firstName[0]}{row.lastName[0]}</div>
                    <span>{row.firstName} {row.lastName}</span>
                </div>
            )
        },
        { key: 'email', label: 'Email' },
        {
            key: 'role',
            label: 'Role',
            render: (value) => (
                <span className={`role-badge role-${value.toLowerCase()}`}>{value}</span>
            )
        },
        {
            key: 'status',
            label: 'Status',
            render: (value) => (
                <StatusBadge status={value} variant={value === 'Active' ? 'success' : 'default'} />
            )
        },
        { key: 'createdAt', label: 'Created' }
    ];

    const tableActions = (row) => (
        <div className="action-buttons">
            <button className="icon-btn" onClick={() => handleView(row)} title="View">
                <Eye size={16} />
            </button>
            <button className="icon-btn" onClick={() => handleEdit(row)} title="Edit">
                <Edit size={16} />
            </button>
            <button className="icon-btn delete" onClick={() => handleDelete(row)} title="Delete">
                <Trash2 size={16} />
            </button>
        </div>
    );

    return (
        <div className="user-management">
            {/* Header */}
            <div className="page-header">
                <div>
                    <h1>User Management</h1>
                    <p>Manage system users and their roles</p>
                </div>
                <button className="btn btn-primary" onClick={handleAdd}>
                    <UserPlus size={18} />
                    Add User
                </button>
            </div>

            {/* Stats */}
            <div className="stats-grid">
                <StatCard title="Total Users" value={stats.total} icon={Users} color="primary" />
                <StatCard title="Doctors" value={stats.doctors} icon={Shield} color="success" />
                <StatCard title="Receptionists" value={stats.receptionists} icon={Users} color="warning" />
                <StatCard title="Patients" value={stats.patients} icon={Users} color="primary" />
            </div>

            {/* Filters */}
            <div className="filters-bar">
                <div className="filter-group">
                    <label>Filter by Role:</label>
                    <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
                        <option value="">All Roles</option>
                        <option value="ADMIN">Admin</option>
                        <option value="DOCTOR">Doctor</option>
                        <option value="RECEPTIONIST">Receptionist</option>
                        <option value="PATIENT">Patient</option>
                    </select>
                </div>
            </div>

            {/* Users Table */}
            <InfoCard>
                <DataTable
                    data={filteredUsers}
                    columns={columns}
                    pageSize={10}
                    searchable={true}
                    actions={tableActions}
                    loading={loading}
                />
            </InfoCard>

            {/* User Modal */}
            {isModalOpen && (
                <UserModal
                    mode={modalMode}
                    user={selectedUser}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSave}
                />
            )}
        </div>
    );
}

// User Modal Component
function UserModal({ mode, user, onClose, onSave }) {
    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        role: user?.role || 'PATIENT',
        status: user?.status || 'Active'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    const isViewMode = mode === 'view';

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{mode === 'add' ? 'Add New User' : mode === 'edit' ? 'Edit User' : 'User Details'}</h2>
                    <button className="close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>First Name</label>
                            <input
                                type="text"
                                value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                disabled={isViewMode}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Last Name</label>
                            <input
                                type="text"
                                value={formData.lastName}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                disabled={isViewMode}
                                required
                            />
                        </div>
                        <div className="form-group full-width">
                            <label>Email</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                disabled={isViewMode}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Role</label>
                            <select
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                disabled={isViewMode}
                            >
                                <option value="ADMIN">Admin</option>
                                <option value="DOCTOR">Doctor</option>
                                <option value="RECEPTIONIST">Receptionist</option>
                                <option value="PATIENT">Patient</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Status</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                disabled={isViewMode}
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                    </div>

                    {!isViewMode && (
                        <div className="modal-actions">
                            <button type="button" className="btn btn-outline" onClick={onClose}>
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary">
                                <Check size={18} />
                                {mode === 'add' ? 'Add User' : 'Save Changes'}
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
