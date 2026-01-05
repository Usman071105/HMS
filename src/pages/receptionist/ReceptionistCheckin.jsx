import { useState, useEffect } from 'react';
import { InfoCard, StatCard } from '../../components/Cards';
import { UserCheck, Clock, Users, AlertCircle, CheckCircle, RefreshCw, Search, LogIn, LogOut } from 'lucide-react';
import './ReceptionistCheckin.css';

// Mock data for waiting queue
const mockQueue = [
    { id: 'P001', name: 'John Smith', checkInTime: '09:00', waitTime: 45, doctor: 'Dr. Williams', status: 'Waiting', priority: 'Normal' },
    { id: 'P002', name: 'Sarah Johnson', checkInTime: '09:15', waitTime: 30, doctor: 'Dr. Chen', status: 'Waiting', priority: 'High' },
    { id: 'P003', name: 'Michael Brown', checkInTime: '09:30', waitTime: 15, doctor: 'Dr. Williams', status: 'In Consultation', priority: 'Normal' },
    { id: 'P004', name: 'Emily Davis', checkInTime: '09:45', waitTime: 5, doctor: 'Dr. Patel', status: 'Waiting', priority: 'Normal' },
    { id: 'P005', name: 'Robert Wilson', checkInTime: '10:00', waitTime: 2, doctor: 'Dr. Adams', status: 'Just Arrived', priority: 'Emergency' }
];

const recentActivity = [
    { id: 1, action: 'Check-in', patient: 'Robert Wilson', time: '10:00 AM', type: 'in' },
    { id: 2, action: 'Completed', patient: 'Lisa Anderson', time: '09:58 AM', type: 'out' },
    { id: 3, action: 'Check-in', patient: 'Emily Davis', time: '09:45 AM', type: 'in' },
    { id: 4, action: 'Completed', patient: 'David Miller', time: '09:40 AM', type: 'out' },
    { id: 5, action: 'Check-in', patient: 'Michael Brown', time: '09:30 AM', type: 'in' }
];

export default function ReceptionistCheckin() {
    const [queue, setQueue] = useState(mockQueue);
    const [searchQuery, setSearchQuery] = useState('');
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());

    // Update time every minute
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const stats = {
        waiting: queue.filter(q => q.status === 'Waiting' || q.status === 'Just Arrived').length,
        inConsultation: queue.filter(q => q.status === 'In Consultation').length,
        avgWaitTime: Math.round(queue.reduce((sum, q) => sum + q.waitTime, 0) / queue.length),
        todayTotal: 24
    };

    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => setIsRefreshing(false), 1000);
    };

    const handleCheckIn = (patientId) => {
        // TODO: API call
        console.log('Check in patient:', patientId);
    };

    const handleCheckOut = (patientId) => {
        setQueue(queue.filter(q => q.id !== patientId));
    };

    const getWaitTimeColor = (minutes) => {
        if (minutes >= 30) return 'critical';
        if (minutes >= 15) return 'warning';
        return 'normal';
    };

    const getPriorityColor = (priority) => {
        if (priority === 'Emergency') return 'emergency';
        if (priority === 'High') return 'high';
        return 'normal';
    };

    const filteredQueue = queue.filter(q =>
        q.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="receptionist-checkin">
            <div className="page-header">
                <div>
                    <h1>Check-In</h1>
                    <p>Real-time patient check-in and queue management</p>
                </div>
                <div className="header-actions">
                    <div className="current-time">
                        <Clock size={16} />
                        <span>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <button className={`btn btn-outline ${isRefreshing ? 'spinning' : ''}`} onClick={handleRefresh}>
                        <RefreshCw size={18} />
                        Refresh
                    </button>
                    <button className="btn btn-primary">
                        <LogIn size={18} />
                        Quick Check-In
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="stats-grid">
                <StatCard title="Currently Waiting" value={stats.waiting} icon={Users} color="warning" />
                <StatCard title="In Consultation" value={stats.inConsultation} icon={UserCheck} color="success" />
                <StatCard title="Avg. Wait Time" value={`${stats.avgWaitTime} min`} icon={Clock} color="primary" />
                <StatCard title="Today's Check-ins" value={stats.todayTotal} icon={CheckCircle} color="primary" />
            </div>

            {/* Alert Banner */}
            {stats.avgWaitTime > 20 && (
                <div className="alert-banner">
                    <AlertCircle size={20} />
                    <span>High wait times detected. Average wait is {stats.avgWaitTime} minutes.</span>
                </div>
            )}

            {/* Content Grid */}
            <div className="content-grid">
                {/* Queue Section */}
                <div className="queue-section">
                    <InfoCard
                        title="Patient Queue"
                        actions={
                            <div className="search-box">
                                <Search size={16} />
                                <input
                                    type="text"
                                    placeholder="Search patient..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        }
                    >
                        <div className="queue-list">
                            {filteredQueue.map((patient, index) => (
                                <div key={patient.id} className={`queue-item ${patient.status.toLowerCase().replace(' ', '-')}`}>
                                    <div className="queue-number">{index + 1}</div>
                                    <div className={`priority-indicator ${getPriorityColor(patient.priority)}`}></div>
                                    <div className="patient-info">
                                        <div className="patient-header">
                                            <span className="name">{patient.name}</span>
                                            <span className={`status-badge ${patient.status.toLowerCase().replace(' ', '-')}`}>
                                                {patient.status}
                                            </span>
                                        </div>
                                        <div className="patient-details">
                                            <span className="id">{patient.id}</span>
                                            <span className="doctor">{patient.doctor}</span>
                                        </div>
                                    </div>
                                    <div className="wait-info">
                                        <div className={`wait-time ${getWaitTimeColor(patient.waitTime)}`}>
                                            <Clock size={14} />
                                            <span>{patient.waitTime} min</span>
                                        </div>
                                        <span className="checkin-time">Checked in: {patient.checkInTime}</span>
                                    </div>
                                    <div className="queue-actions">
                                        {patient.status === 'In Consultation' ? (
                                            <button className="btn btn-sm btn-success" onClick={() => handleCheckOut(patient.id)}>
                                                <LogOut size={14} />
                                                Complete
                                            </button>
                                        ) : (
                                            <button className="btn btn-sm btn-primary" onClick={() => handleCheckIn(patient.id)}>
                                                Call Next
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {filteredQueue.length === 0 && (
                                <div className="empty-queue">
                                    <CheckCircle size={48} />
                                    <p>No patients in queue</p>
                                </div>
                            )}
                        </div>
                    </InfoCard>
                </div>

                {/* Sidebar */}
                <div className="sidebar">
                    {/* Wait Time Metrics */}
                    <InfoCard title="Wait Time Metrics">
                        <div className="metrics-grid">
                            <div className="metric-item">
                                <span className="metric-label">Min Wait</span>
                                <span className="metric-value">2 min</span>
                            </div>
                            <div className="metric-item">
                                <span className="metric-label">Max Wait</span>
                                <span className="metric-value critical">45 min</span>
                            </div>
                            <div className="metric-item">
                                <span className="metric-label">Avg Wait</span>
                                <span className="metric-value">{stats.avgWaitTime} min</span>
                            </div>
                            <div className="metric-item">
                                <span className="metric-label">Target</span>
                                <span className="metric-value success">15 min</span>
                            </div>
                        </div>
                        <div className="wait-chart">
                            <h4>Hourly Distribution</h4>
                            <div className="chart-bars">
                                {['9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM'].map((hour, i) => (
                                    <div key={hour} className="chart-bar">
                                        <div className="bar" style={{ height: `${[60, 80, 70, 40, 50, 75, 55][i]}%` }}></div>
                                        <span className="hour">{hour}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </InfoCard>

                    {/* Recent Activity */}
                    <InfoCard title="Recent Activity">
                        <div className="activity-list">
                            {recentActivity.map(activity => (
                                <div key={activity.id} className={`activity-item ${activity.type}`}>
                                    <div className={`activity-icon ${activity.type}`}>
                                        {activity.type === 'in' ? <LogIn size={14} /> : <LogOut size={14} />}
                                    </div>
                                    <div className="activity-info">
                                        <span className="action">{activity.action}</span>
                                        <span className="patient">{activity.patient}</span>
                                    </div>
                                    <span className="time">{activity.time}</span>
                                </div>
                            ))}
                        </div>
                    </InfoCard>
                </div>
            </div>
        </div>
    );
}
