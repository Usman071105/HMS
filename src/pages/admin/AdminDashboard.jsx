import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { StatCard, InfoCard, ActionCard } from '../../components/Cards';
import { LineChart, BarChart, DoughnutChart } from '../../components/Charts';
import DataTable from '../../components/DataTable';
import {
    Users,
    Calendar,
    Stethoscope,
    TrendingUp,
    UserPlus,
    ClipboardList,
    Activity,
    DollarSign
} from 'lucide-react';
import './AdminDashboard.css';

// Mock data - replace with API calls
const mockStats = {
    totalPatients: 1248,
    todayAppointments: 42,
    totalDoctors: 28,
    monthlyRevenue: 52400
};

const mockAppointmentData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
        label: 'Appointments',
        data: [35, 42, 38, 51, 49, 32, 28],
        fill: true
    }]
};

const mockPatientsByDept = {
    labels: ['Cardiology', 'Orthopedics', 'Neurology', 'Pediatrics', 'General'],
    values: [324, 256, 189, 210, 269]
};

const mockRecentPatients = [
    { id: 1, name: 'John Smith', age: 45, phone: '+1 234-567-8900', status: 'Active', lastVisit: '2026-01-05' },
    { id: 2, name: 'Sarah Johnson', age: 32, phone: '+1 234-567-8901', status: 'Active', lastVisit: '2026-01-04' },
    { id: 3, name: 'Michael Brown', age: 58, phone: '+1 234-567-8902', status: 'Active', lastVisit: '2026-01-04' },
    { id: 4, name: 'Emily Davis', age: 28, phone: '+1 234-567-8903', status: 'Inactive', lastVisit: '2025-12-28' },
    { id: 5, name: 'Robert Wilson', age: 67, phone: '+1 234-567-8904', status: 'Active', lastVisit: '2026-01-03' }
];

export default function AdminDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState(mockStats);
    const [loading, setLoading] = useState(false);

    // Fetch dashboard data
    useEffect(() => {
        // TODO: Replace with API call
        // fetchDashboardStats();
    }, []);

    const patientColumns = [
        { key: 'name', label: 'Patient Name' },
        { key: 'age', label: 'Age', width: '80px' },
        { key: 'phone', label: 'Phone' },
        {
            key: 'status',
            label: 'Status',
            render: (value) => (
                <span className={`status-badge ${value.toLowerCase()}`}>{value}</span>
            )
        },
        { key: 'lastVisit', label: 'Last Visit' }
    ];

    return (
        <div className="admin-dashboard">
            {/* Header */}
            <div className="dashboard-header">
                <div>
                    <h1>Dashboard</h1>
                    <p>Welcome back, {user?.firstName || 'Admin'}! Here's what's happening today.</p>
                </div>
                <div className="header-actions">
                    <button className="btn btn-primary">
                        <UserPlus size={18} />
                        Add Patient
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                <StatCard
                    title="Total Patients"
                    value={stats.totalPatients.toLocaleString()}
                    icon={Users}
                    color="primary"
                    trend="up"
                    trendValue="+12% from last month"
                />
                <StatCard
                    title="Today's Appointments"
                    value={stats.todayAppointments}
                    icon={Calendar}
                    color="success"
                    trend="up"
                    trendValue="+5 from yesterday"
                />
                <StatCard
                    title="Active Doctors"
                    value={stats.totalDoctors}
                    icon={Stethoscope}
                    color="warning"
                />
                <StatCard
                    title="Monthly Revenue"
                    value={`$${stats.monthlyRevenue.toLocaleString()}`}
                    icon={DollarSign}
                    color="primary"
                    trend="up"
                    trendValue="+8.2% from last month"
                />
            </div>

            {/* Charts Row */}
            <div className="charts-row">
                <div className="chart-card">
                    <LineChart
                        data={mockAppointmentData}
                        title="Weekly Appointments"
                        subtitle="Appointment trends this week"
                    />
                </div>
                <div className="chart-card">
                    <DoughnutChart
                        data={mockPatientsByDept}
                        title="Patients by Department"
                        subtitle="Distribution across departments"
                    />
                </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
                <h2>Quick Actions</h2>
                <div className="actions-grid">
                    <ActionCard
                        title="Register Patient"
                        description="Add a new patient to the system"
                        icon={UserPlus}
                        color="primary"
                    />
                    <ActionCard
                        title="Schedule Appointment"
                        description="Book a new appointment"
                        icon={Calendar}
                        color="secondary"
                    />
                    <ActionCard
                        title="View Reports"
                        description="Access analytics and reports"
                        icon={Activity}
                        badge="New"
                        color="primary"
                    />
                    <ActionCard
                        title="Manage Staff"
                        description="Staff management & schedules"
                        icon={Stethoscope}
                        color="secondary"
                    />
                </div>
            </div>

            {/* Recent Patients Table */}
            <div className="recent-patients">
                <InfoCard
                    title="Recent Patients"
                    actions={
                        <button className="btn btn-outline btn-sm">View All</button>
                    }
                >
                    <DataTable
                        data={mockRecentPatients}
                        columns={patientColumns}
                        pageSize={5}
                        searchable={false}
                        filterable={false}
                    />
                </InfoCard>
            </div>
        </div>
    );
}
