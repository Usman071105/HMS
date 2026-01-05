import { useState, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import './Calendar.css';

export default function AppointmentCalendar({
    events = [],
    onEventClick,
    onDateClick,
    onEventDrop,
    selectable = true,
    editable = false,
    initialView = 'timeGridWeek'
}) {
    const calendarRef = useRef(null);
    const [currentView, setCurrentView] = useState(initialView);

    const handleEventClick = (info) => {
        if (onEventClick) {
            onEventClick({
                id: info.event.id,
                title: info.event.title,
                start: info.event.start,
                end: info.event.end,
                extendedProps: info.event.extendedProps
            });
        }
    };

    const handleDateClick = (info) => {
        if (onDateClick) {
            onDateClick({
                date: info.date,
                dateStr: info.dateStr,
                allDay: info.allDay
            });
        }
    };

    const handleEventDrop = (info) => {
        if (onEventDrop) {
            onEventDrop({
                id: info.event.id,
                oldStart: info.oldEvent.start,
                newStart: info.event.start,
                newEnd: info.event.end
            });
        }
    };

    // Transform events to FullCalendar format
    const calendarEvents = events.map(event => ({
        id: event.id,
        title: event.title || event.patientName || 'Appointment',
        start: event.start || event.dateTime,
        end: event.end,
        backgroundColor: getEventColor(event.status),
        borderColor: getEventColor(event.status),
        textColor: '#ffffff',
        extendedProps: {
            patientId: event.patientId,
            doctorId: event.doctorId,
            status: event.status,
            type: event.type,
            notes: event.notes
        }
    }));

    return (
        <div className="calendar-container">
            <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView={currentView}
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                }}
                events={calendarEvents}
                selectable={selectable}
                editable={editable}
                eventClick={handleEventClick}
                dateClick={handleDateClick}
                eventDrop={handleEventDrop}
                slotMinTime="08:00:00"
                slotMaxTime="20:00:00"
                slotDuration="00:30:00"
                allDaySlot={false}
                weekends={true}
                nowIndicator={true}
                dayMaxEvents={3}
                eventDisplay="block"
                height="auto"
                aspectRatio={1.5}
                viewDidMount={(info) => setCurrentView(info.view.type)}
            />
        </div>
    );
}

// Helper function to get event color based on status
function getEventColor(status) {
    const colors = {
        'CONFIRMED': '#10B981',
        'PENDING': '#F59E0B',
        'CANCELLED': '#EF4444',
        'COMPLETED': '#0077B6',
        'CHECKED_IN': '#7C3AED'
    };
    return colors[status] || '#64748B';
}

export { AppointmentCalendar };
