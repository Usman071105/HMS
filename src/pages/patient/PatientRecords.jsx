import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { InfoCard, StatCard } from '../../components/Cards';
import DataTable, { StatusBadge } from '../../components/DataTable';
import { FileText, Download, Eye, Calendar, Activity, FileCheck, RefreshCw, Search } from 'lucide-react';
import './PatientRecords.css';

// Mock data
const mockRecords = [
    { id: 1, type: 'Lab Report', name: 'Complete Blood Count', doctor: 'Dr. John Williams', date: '2026-01-05', status: 'Ready', category: 'Laboratory' },
    { id: 2, type: 'Prescription', name: 'General Prescription', doctor: 'Dr. Sarah Chen', date: '2026-01-03', status: 'Active', category: 'Prescription' },
    { id: 3, type: 'Imaging', name: 'Chest X-Ray', doctor: 'Dr. Michael Brown', date: '2025-12-28', status: 'Ready', category: 'Imaging' },
    { id: 4, type: 'Lab Report', name: 'Lipid Panel', doctor: 'Dr. John Williams', date: '2025-12-20', status: 'Ready', category: 'Laboratory' },
    { id: 5, type: 'Consultation Notes', name: 'Follow-up Visit Notes', doctor: 'Dr. Emily Davis', date: '2025-12-15', status: 'Archived', category: 'Notes' },
    { id: 6, type: 'Prescription', name: 'Blood Pressure Medication', doctor: 'Dr. Sarah Chen', date: '2025-12-10', status: 'Expired', category: 'Prescription' }
];

const mockVitals = [
    { date: '2026-01-05', bp: '120/80', pulse: 72, temp: '98.6°F', weight: '165 lbs' },
    { date: '2025-12-20', bp: '118/78', pulse: 70, temp: '98.4°F', weight: '163 lbs' },
    { date: '2025-11-15', bp: '122/82', pulse: 74, temp: '98.6°F', weight: '167 lbs' }
];

export default function PatientRecords() {
    const { user } = useAuth();
    const [filterCategory, setFilterCategory] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);

    const stats = {
        total: mockRecords.length,
        labReports: mockRecords.filter(r => r.category === 'Laboratory').length,
        prescriptions: mockRecords.filter(r => r.category === 'Prescription').length,
        imaging: mockRecords.filter(r => r.category === 'Imaging').length
    };

    const filteredRecords = mockRecords.filter(r => {
        if (filterCategory && r.category !== filterCategory) return false;
        if (searchQuery && !r.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
    });

    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => setIsRefreshing(false), 1000);
    };

    const columns = [
        {
            key: 'type',
            label: 'Type',
            render: (value) => (
                <span className={`record-type ${value.toLowerCase().replace(' ', '-')}`}>{value}</span>
            )
        },
        { key: 'name', label: 'Record Name' },
        { key: 'doctor', label: 'Doctor' },
        { key: 'date', label: 'Date' },
        {
            key: 'status',
            label: 'Status',
            render: (value) => {
                const variants = { Ready: 'success', Active: 'warning', Archived: 'info', Expired: 'error' };
                return <StatusBadge status={value} variant={variants[value]} />;
            }
        }
    ];

    const tableActions = (row) => (
        <div className="action-buttons">
            <button className="icon-btn" onClick={() => setSelectedRecord(row)} title="View">
                <Eye size={16} />
            </button>
            <button className="icon-btn" title="Download">
                <Download size={16} />
            </button>
        </div>
    );

    return (
        <div className="patient-records">
            <div className="page-header">
                <div>
                    <h1>Medical Records</h1>
                    <p>Access your complete medical history and documents</p>
                </div>
                <div className="header-actions">
                    <button className={`btn btn-outline ${isRefreshing ? 'spinning' : ''}`} onClick={handleRefresh}>
                        <RefreshCw size={18} />
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="stats-grid">
                <StatCard title="Total Records" value={stats.total} icon={FileText} color="primary" />
                <StatCard title="Lab Reports" value={stats.labReports} icon={Activity} color="success" />
                <StatCard title="Prescriptions" value={stats.prescriptions} icon={FileCheck} color="warning" />
                <StatCard title="Imaging" value={stats.imaging} icon={FileText} color="primary" />
            </div>

            {/* Content */}
            <div className="content-grid">
                {/* Records Section */}
                <div className="records-section">
                    {/* Search & Filters */}
                    <div className="filters-bar">
                        <div className="search-input">
                            <Search size={16} />
                            <input
                                type="text"
                                placeholder="Search records..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="filter-group">
                            <label>Category:</label>
                            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                                <option value="">All</option>
                                <option value="Laboratory">Laboratory</option>
                                <option value="Prescription">Prescription</option>
                                <option value="Imaging">Imaging</option>
                                <option value="Notes">Notes</option>
                            </select>
                        </div>
                    </div>

                    <InfoCard title="Medical Records">
                        <DataTable
                            data={filteredRecords}
                            columns={columns}
                            pageSize={8}
                            searchable={false}
                            actions={tableActions}
                            onRowClick={(row) => setSelectedRecord(row)}
                        />
                    </InfoCard>
                </div>

                {/* Sidebar */}
                <div className="sidebar">
                    {/* Vitals History */}
                    <InfoCard title="Recent Vitals">
                        <div className="vitals-list">
                            {mockVitals.map((vital, index) => (
                                <div key={index} className="vital-item">
                                    <div className="vital-date">{vital.date}</div>
                                    <div className="vital-data">
                                        <div className="vital-row">
                                            <span className="label">Blood Pressure</span>
                                            <span className="value">{vital.bp}</span>
                                        </div>
                                        <div className="vital-row">
                                            <span className="label">Pulse</span>
                                            <span className="value">{vital.pulse} bpm</span>
                                        </div>
                                        <div className="vital-row">
                                            <span className="label">Temperature</span>
                                            <span className="value">{vital.temp}</span>
                                        </div>
                                        <div className="vital-row">
                                            <span className="label">Weight</span>
                                            <span className="value">{vital.weight}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </InfoCard>

                    {/* Quick Actions */}
                    <InfoCard title="Quick Actions">
                        <div className="quick-actions">
                            <button className="action-btn">
                                <Download size={18} />
                                Download All Records
                            </button>
                            <button className="action-btn">
                                <FileText size={18} />
                                Request Records
                            </button>
                        </div>
                    </InfoCard>
                </div>
            </div>
        </div>
    );
}
