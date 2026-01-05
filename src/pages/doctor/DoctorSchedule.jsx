import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { InfoCard } from '../../components/Cards';
import AppointmentCalendar from '../../components/Calendar';
import { Calendar, Clock, Plus, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import './DoctorSchedule.css';

// Mock schedule data
const mockSchedule = {
    monday: { start: '09:00', end: '17:00', breaks: [{ start: '12:00', end: '13:00' }], available: true },
    tuesday: { start: '09:00', end: '17:00', breaks: [{ start: '12:00', end: '13:00' }], available: true },
    wednesday: { start: '10:00', end: '18:00', breaks: [{ start: '13:00', end: '14:00' }], available: true },
    thursday: { start: '09:00', end: '17:00', breaks: [{ start: '12:00', end: '13:00' }], available: true },
    friday: { start: '09:00', end: '15:00', breaks: [], available: true },
    saturday: { start: '10:00', end: '13:00', breaks: [], available: true },
    sunday: { start: '', end: '', breaks: [], available: false }
};

const mockAppointments = [
    { id: '1', title: 'John Smith', start: new Date('2026-01-06T09:00'), end: new Date('2026-01-06T09:30'), status: 'CONFIRMED' },
    { id: '2', title: 'Sarah Johnson', start: new Date('2026-01-06T10:30'), end: new Date('2026-01-06T11:00'), status: 'CONFIRMED' },
    { id: '3', title: 'Michael Brown', start: new Date('2026-01-06T14:00'), end: new Date('2026-01-06T14:30'), status: 'PENDING' },
    { id: '4', title: 'Emily Davis', start: new Date('2026-01-07T09:00'), end: new Date('2026-01-07T09:30'), status: 'CONFIRMED' },
    { id: '5', title: 'Robert Wilson', start: new Date('2026-01-07T11:00'), end: new Date('2026-01-07T11:30'), status: 'CONFIRMED' }
];

const timeSlots = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'];

export default function DoctorSchedule() {
    const { user } = useAuth();
    const [view, setView] = useState('calendar');
    const [schedule, setSchedule] = useState(mockSchedule);
    const [editMode, setEditMode] = useState(false);

    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const dayLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const handleScheduleChange = (day, field, value) => {
        setSchedule({
            ...schedule,
            [day]: { ...schedule[day], [field]: value }
        });
    };

    const toggleAvailability = (day) => {
        setSchedule({
            ...schedule,
            [day]: { ...schedule[day], available: !schedule[day].available }
        });
    };

    return (
        <div className="doctor-schedule">
            <div className="page-header">
                <div>
                    <h1>My Schedule</h1>
                    <p>Manage your availability and working hours</p>
                </div>
                <div className="header-actions">
                    <div className="view-toggle">
                        <button className={`toggle-btn ${view === 'calendar' ? 'active' : ''}`} onClick={() => setView('calendar')}>
                            Calendar View
                        </button>
                        <button className={`toggle-btn ${view === 'settings' ? 'active' : ''}`} onClick={() => setView('settings')}>
                            Work Hours
                        </button>
                    </div>
                </div>
            </div>

            {view === 'calendar' ? (
                <div className="calendar-section">
                    <AppointmentCalendar
                        events={mockAppointments}
                        initialView="timeGridWeek"
                        onEventClick={(event) => console.log('Event clicked:', event)}
                        onDateClick={(date) => console.log('Date clicked:', date)}
                    />
                </div>
            ) : (
                <div className="schedule-settings">
                    <InfoCard
                        title="Working Hours"
                        actions={
                            <button className="btn btn-outline btn-sm" onClick={() => setEditMode(!editMode)}>
                                <Settings size={16} />
                                {editMode ? 'Done' : 'Edit'}
                            </button>
                        }
                    >
                        <div className="schedule-grid">
                            {days.map((day, index) => (
                                <div key={day} className={`schedule-row ${!schedule[day].available ? 'unavailable' : ''}`}>
                                    <div className="day-info">
                                        <label className="day-toggle">
                                            <input
                                                type="checkbox"
                                                checked={schedule[day].available}
                                                onChange={() => toggleAvailability(day)}
                                                disabled={!editMode}
                                            />
                                            <span className="checkbox"></span>
                                        </label>
                                        <span className="day-name">{dayLabels[index]}</span>
                                    </div>

                                    {schedule[day].available ? (
                                        <div className="time-inputs">
                                            <div className="time-group">
                                                <label>Start</label>
                                                <select
                                                    value={schedule[day].start}
                                                    onChange={(e) => handleScheduleChange(day, 'start', e.target.value)}
                                                    disabled={!editMode}
                                                >
                                                    {timeSlots.map(time => (
                                                        <option key={time} value={time}>{time}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <span className="time-separator">to</span>
                                            <div className="time-group">
                                                <label>End</label>
                                                <select
                                                    value={schedule[day].end}
                                                    onChange={(e) => handleScheduleChange(day, 'end', e.target.value)}
                                                    disabled={!editMode}
                                                >
                                                    {timeSlots.map(time => (
                                                        <option key={time} value={time}>{time}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    ) : (
                                        <span className="off-label">Day Off</span>
                                    )}
                                </div>
                            ))}
                        </div>

                        {editMode && (
                            <div className="save-actions">
                                <button className="btn btn-primary" onClick={() => setEditMode(false)}>
                                    Save Schedule
                                </button>
                            </div>
                        )}
                    </InfoCard>

                    {/* Quick Stats */}
                    <InfoCard title="This Week's Overview">
                        <div className="week-stats">
                            <div className="stat-item">
                                <Calendar size={20} />
                                <div>
                                    <span className="stat-value">32</span>
                                    <span className="stat-label">Total Slots</span>
                                </div>
                            </div>
                            <div className="stat-item">
                                <Clock size={20} />
                                <div>
                                    <span className="stat-value">18</span>
                                    <span className="stat-label">Booked</span>
                                </div>
                            </div>
                            <div className="stat-item available">
                                <Plus size={20} />
                                <div>
                                    <span className="stat-value">14</span>
                                    <span className="stat-label">Available</span>
                                </div>
                            </div>
                        </div>
                    </InfoCard>
                </div>
            )}
        </div>
    );
}
