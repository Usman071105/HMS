import { useState } from 'react';
import { InfoCard, StatCard } from '../../components/Cards';
import { LineChart, BarChart, DoughnutChart } from '../../components/Charts';
import { BarChart3, TrendingUp, Users, Calendar, Download, Filter } from 'lucide-react';
import './ReportsPage.css';

// Mock data for charts
const patientTrendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
        label: 'New Patients',
        data: [65, 78, 90, 81, 95, 110, 120, 105, 115, 125, 140, 132],
        fill: true
    }]
};

const appointmentsByDeptData = {
    labels: ['Cardiology', 'Orthopedics', 'Neurology', 'Pediatrics', 'General'],
    values: [324, 256, 189, 210, 369]
};

const revenueData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
        label: 'Revenue ($)',
        data: [4500, 5200, 4800, 5800, 6200, 3200, 2800]
    }]
};

const appointmentStatusData = {
    labels: ['Completed', 'Confirmed', 'Pending', 'Cancelled'],
    values: [450, 280, 120, 45],
    colors: ['#10B981', '#0077B6', '#F59E0B', '#EF4444']
};

export default function ReportsPage() {
    const [dateRange, setDateRange] = useState('month');
    const [reportType, setReportType] = useState('overview');

    return (
        <div className="reports-page">
            <div className="page-header">
                <div>
                    <h1>Reports & Analytics</h1>
                    <p>View hospital performance metrics and analytics</p>
                </div>
                <div className="header-actions">
                    <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="date-select">
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                        <option value="quarter">This Quarter</option>
                        <option value="year">This Year</option>
                    </select>
                    <button className="btn btn-primary">
                        <Download size={18} />
                        Export Report
                    </button>
                </div>
            </div>

            {/* Report Type Tabs */}
            <div className="report-tabs">
                <button
                    className={`tab ${reportType === 'overview' ? 'active' : ''}`}
                    onClick={() => setReportType('overview')}
                >
                    Overview
                </button>
                <button
                    className={`tab ${reportType === 'patients' ? 'active' : ''}`}
                    onClick={() => setReportType('patients')}
                >
                    Patients
                </button>
                <button
                    className={`tab ${reportType === 'appointments' ? 'active' : ''}`}
                    onClick={() => setReportType('appointments')}
                >
                    Appointments
                </button>
                <button
                    className={`tab ${reportType === 'revenue' ? 'active' : ''}`}
                    onClick={() => setReportType('revenue')}
                >
                    Revenue
                </button>
            </div>

            {/* Stats Overview */}
            <div className="stats-grid">
                <StatCard
                    title="Total Revenue"
                    value="$52,400"
                    icon={TrendingUp}
                    color="primary"
                    trend="up"
                    trendValue="+12.5%"
                />
                <StatCard
                    title="Total Patients"
                    value="1,248"
                    icon={Users}
                    color="success"
                    trend="up"
                    trendValue="+8.2%"
                />
                <StatCard
                    title="Appointments"
                    value="892"
                    icon={Calendar}
                    color="warning"
                    trend="up"
                    trendValue="+5.4%"
                />
                <StatCard
                    title="Avg. Daily Visits"
                    value="42"
                    icon={BarChart3}
                    color="primary"
                />
            </div>

            {/* Charts Grid */}
            <div className="charts-grid">
                <div className="chart-full">
                    <LineChart
                        data={patientTrendData}
                        title="Patient Trends"
                        subtitle="Monthly new patient registrations"
                    />
                </div>

                <div className="chart-half">
                    <BarChart
                        data={revenueData}
                        title="Weekly Revenue"
                        subtitle="Revenue breakdown by day"
                    />
                </div>

                <div className="chart-half">
                    <DoughnutChart
                        data={appointmentStatusData}
                        title="Appointment Status"
                        subtitle="Distribution by status"
                    />
                </div>

                <div className="chart-full">
                    <BarChart
                        data={{
                            labels: appointmentsByDeptData.labels,
                            datasets: [{ label: 'Appointments', data: appointmentsByDeptData.values }]
                        }}
                        title="Appointments by Department"
                        subtitle="Total appointments across departments"
                    />
                </div>
            </div>

            {/* Quick Stats Table */}
            <InfoCard title="Department Performance">
                <table className="stats-table">
                    <thead>
                        <tr>
                            <th>Department</th>
                            <th>Patients</th>
                            <th>Appointments</th>
                            <th>Revenue</th>
                            <th>Growth</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Cardiology</td>
                            <td>324</td>
                            <td>285</td>
                            <td>$18,500</td>
                            <td className="positive">+15%</td>
                        </tr>
                        <tr>
                            <td>Orthopedics</td>
                            <td>256</td>
                            <td>198</td>
                            <td>$14,200</td>
                            <td className="positive">+8%</td>
                        </tr>
                        <tr>
                            <td>Neurology</td>
                            <td>189</td>
                            <td>156</td>
                            <td>$12,800</td>
                            <td className="positive">+12%</td>
                        </tr>
                        <tr>
                            <td>Pediatrics</td>
                            <td>210</td>
                            <td>180</td>
                            <td>$9,400</td>
                            <td className="negative">-3%</td>
                        </tr>
                        <tr>
                            <td>General</td>
                            <td>269</td>
                            <td>320</td>
                            <td>$8,200</td>
                            <td className="positive">+5%</td>
                        </tr>
                    </tbody>
                </table>
            </InfoCard>
        </div>
    );
}
