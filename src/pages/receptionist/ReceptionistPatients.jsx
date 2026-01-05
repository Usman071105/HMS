import { useState } from 'react';
import { InfoCard, StatCard } from '../../components/Cards';
import DataTable, { StatusBadge } from '../../components/DataTable';
import { Users, UserPlus, Search, RefreshCw, Eye, FileText, Calendar, UserCheck, Clock } from 'lucide-react';
import './ReceptionistPatients.css';

// Mock data
const mockPatients = [
    { id: 'P001', name: 'John Smith', age: 45, gender: 'Male', phone: '+1 234-567-8900', email: 'john.s@email.com', type: 'Returning', lastVisit: '2026-01-05', status: 'Active' },
    { id: 'P002', name: 'Sarah Johnson', age: 32, gender: 'Female', phone: '+1 234-567-8901', email: 'sarah.j@email.com', type: 'New', lastVisit: '2026-01-05', status: 'Active' },
    { id: 'P003', name: 'Michael Brown', age: 58, gender: 'Male', phone: '+1 234-567-8902', email: 'michael.b@email.com', type: 'Returning', lastVisit: '2026-01-04', status: 'Active' },
    { id: 'P004', name: 'Emily Davis', age: 28, gender: 'Female', phone: '+1 234-567-8903', email: 'emily.d@email.com', type: 'New', lastVisit: '2026-01-05', status: 'Checked In' },
    { id: 'P005', name: 'Robert Wilson', age: 67, gender: 'Male', phone: '+1 234-567-8904', email: 'robert.w@email.com', type: 'Returning', lastVisit: '2026-01-03', status: 'Active' },
    { id: 'P006', name: 'Lisa Anderson', age: 41, gender: 'Female', phone: '+1 234-567-8905', email: 'lisa.a@email.com', type: 'New', lastVisit: '2026-01-05', status: 'Checked In' }
];

const recentCheckIns = [
    { id: 'P004', name: 'Emily Davis', time: '10:15 AM', doctor: 'Dr. Williams' },
    { id: 'P006', name: 'Lisa Anderson', time: '10:30 AM', doctor: 'Dr. Chen' },
    { id: 'P002', name: 'Sarah Johnson', time: '09:45 AM', doctor: 'Dr. Patel' }
];

export default function ReceptionistPatients() {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [isRefreshing, setIsRefreshing] = useState(false);

    const stats = {
        total: mockPatients.length,
        newToday: mockPatients.filter(p => p.type === 'New' && p.lastVisit === '2026-01-05').length,
        returning: mockPatients.filter(p => p.type === 'Returning').length,
        checkedIn: mockPatients.filter(p => p.status === 'Checked In').length
    };

    const filteredPatients = mockPatients.filter(p => {
        if (filterType && p.type !== filterType) return false;
        if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase()) && !p.id.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
    });

    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => setIsRefreshing(false), 1000);
    };

    const columns = [
        { key: 'id', label: 'Patient ID', width: '100px' },
        {
            key: 'name',
            label: 'Name',
            render: (value, row) => (
                <div className="patient-cell">
                    <div className="avatar">{value.split(' ').map(n => n[0]).join('')}</div>
                    <div>
                        <span className="name">{value}</span>
                        <span className="details">{row.age} yrs, {row.gender}</span>
                    </div>
                </div>
            )
        },
        { key: 'phone', label: 'Phone' },
        {
            key: 'type',
            label: 'Type',
            render: (value) => (
                <span className={`type-badge ${value.toLowerCase()}`}>{value}</span>
            )
        },
        { key: 'lastVisit', label: 'Last Visit' },
        {
            key: 'status',
            label: 'Status',
            render: (value) => {
                const variants = { Active: 'success', 'Checked In': 'warning' };
                return <StatusBadge status={value} variant={variants[value]} />;
            }
        }
    ];

    const tableActions = (row) => (
        <div className="action-buttons">
            <button className="icon-btn" title="View Profile"><Eye size={16} /></button>
            <button className="icon-btn" title="Medical Records"><FileText size={16} /></button>
            <button className="icon-btn" title="Schedule Appointment"><Calendar size={16} /></button>
        </div>
    );

    return (
        <div className="receptionist-patients">
            <div className="page-header">
                <div>
                    <h1>Patients</h1>
                    <p>Search and manage patient records</p>
                </div>
                <div className="header-actions">
                    <button className={`btn btn-outline ${isRefreshing ? 'spinning' : ''}`} onClick={handleRefresh}>
                        <RefreshCw size={18} />
                    </button>
                    <button className="btn btn-primary">
                        <UserPlus size={18} />
                        Register New
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="stats-grid">
                <StatCard title="Total Patients" value={stats.total} icon={Users} color="primary" />
                <StatCard title="New Today" value={stats.newToday} icon={UserPlus} color="success" />
                <StatCard title="Returning" value={stats.returning} icon={Users} color="primary" />
                <StatCard title="Checked In Now" value={stats.checkedIn} icon={UserCheck} color="warning" />
            </div>

            {/* Search & Filters */}
            <div className="search-bar">
                <div className="search-input">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search by name or patient ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="filters">
                    <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                        <option value="">All Types</option>
                        <option value="New">New</option>
                        <option value="Returning">Returning</option>
                    </select>
                    <input
                        type="date"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        placeholder="Filter by date"
                    />
                </div>
            </div>

            {/* Content Grid */}
            <div className="content-grid">
                {/* Main Patient Table */}
                <div className="main-content">
                    <InfoCard title="Patient Records">
                        <DataTable
                            data={filteredPatients}
                            columns={columns}
                            pageSize={8}
                            searchable={false}
                            actions={tableActions}
                        />
                    </InfoCard>
                </div>

                {/* Sidebar */}
                <div className="sidebar">
                    {/* Recent Check-ins */}
                    <InfoCard title="Recent Check-ins">
                        <div className="checkin-list">
                            {recentCheckIns.map(checkin => (
                                <div key={checkin.id} className="checkin-item">
                                    <div className="avatar">{checkin.name.split(' ').map(n => n[0]).join('')}</div>
                                    <div className="checkin-info">
                                        <span className="name">{checkin.name}</span>
                                        <span className="details">
                                            <Clock size={12} /> {checkin.time} • {checkin.doctor}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </InfoCard>

                    {/* Demographics */}
                    <InfoCard title="Demographics">
                        <div className="demographics">
                            <div className="demo-item">
                                <span className="label">Male</span>
                                <div className="bar-container">
                                    <div className="bar" style={{ width: '55%' }}></div>
                                </div>
                                <span className="value">55%</span>
                            </div>
                            <div className="demo-item">
                                <span className="label">Female</span>
                                <div className="bar-container">
                                    <div className="bar female" style={{ width: '45%' }}></div>
                                </div>
                                <span className="value">45%</span>
                            </div>
                        </div>
                        <div className="age-distribution">
                            <h4>Age Distribution</h4>
                            <div className="age-bars">
                                <div className="age-item">
                                    <span className="range">0-18</span>
                                    <div className="bar" style={{ height: '30%' }}></div>
                                    <span className="count">15</span>
                                </div>
                                <div className="age-item">
                                    <span className="range">19-35</span>
                                    <div className="bar" style={{ height: '50%' }}></div>
                                    <span className="count">28</span>
                                </div>
                                <div className="age-item">
                                    <span className="range">36-50</span>
                                    <div className="bar" style={{ height: '70%' }}></div>
                                    <span className="count">42</span>
                                </div>
                                <div className="age-item">
                                    <span className="range">51-65</span>
                                    <div className="bar" style={{ height: '45%' }}></div>
                                    <span className="count">25</span>
                                </div>
                                <div className="age-item">
                                    <span className="range">65+</span>
                                    <div className="bar" style={{ height: '35%' }}></div>
                                    <span className="count">18</span>
                                </div>
                            </div>
                        </div>
                    </InfoCard>
                </div>
            </div>
        </div>
    );
}
