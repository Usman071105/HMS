import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import './Cards.css';

// Stat Card Component
export function StatCard({
    title,
    value,
    icon: Icon,
    trend,
    trendValue,
    color = 'primary',
    onClick
}) {
    const getTrendIcon = () => {
        if (!trend) return null;
        if (trend === 'up') return <TrendingUp size={14} />;
        if (trend === 'down') return <TrendingDown size={14} />;
        return <Minus size={14} />;
    };

    return (
        <div
            className={`stat-card stat-card-${color} ${onClick ? 'clickable' : ''}`}
            onClick={onClick}
        >
            <div className="stat-card-header">
                <span className="stat-card-title">{title}</span>
                {Icon && (
                    <div className="stat-card-icon">
                        <Icon size={20} />
                    </div>
                )}
            </div>
            <div className="stat-card-value">{value}</div>
            {(trend || trendValue) && (
                <div className={`stat-card-trend trend-${trend || 'neutral'}`}>
                    {getTrendIcon()}
                    <span>{trendValue}</span>
                </div>
            )}
        </div>
    );
}

// Info Card Component
export function InfoCard({ title, children, actions, className = '' }) {
    return (
        <div className={`info-card ${className}`}>
            {(title || actions) && (
                <div className="info-card-header">
                    {title && <h3 className="info-card-title">{title}</h3>}
                    {actions && <div className="info-card-actions">{actions}</div>}
                </div>
            )}
            <div className="info-card-content">
                {children}
            </div>
        </div>
    );
}

// Action Card Component
export function ActionCard({
    title,
    description,
    icon: Icon,
    onClick,
    color = 'primary',
    badge
}) {
    return (
        <div
            className={`action-card action-card-${color}`}
            onClick={onClick}
        >
            {Icon && (
                <div className="action-card-icon">
                    <Icon size={24} />
                </div>
            )}
            <div className="action-card-content">
                <h4 className="action-card-title">
                    {title}
                    {badge && <span className="action-card-badge">{badge}</span>}
                </h4>
                {description && (
                    <p className="action-card-description">{description}</p>
                )}
            </div>
        </div>
    );
}

// Profile Card Component
export function ProfileCard({
    name,
    role,
    avatar,
    email,
    phone,
    status,
    actions
}) {
    return (
        <div className="profile-card">
            <div className="profile-card-header">
                <div className="profile-avatar">
                    {avatar ? (
                        <img src={avatar} alt={name} />
                    ) : (
                        <span>{name?.charAt(0).toUpperCase() || '?'}</span>
                    )}
                </div>
                <div className="profile-info">
                    <h4 className="profile-name">{name}</h4>
                    <span className="profile-role">{role}</span>
                </div>
                {status && (
                    <span className={`profile-status status-${status.toLowerCase()}`}>
                        {status}
                    </span>
                )}
            </div>
            <div className="profile-details">
                {email && (
                    <div className="profile-detail">
                        <span className="label">Email</span>
                        <span className="value">{email}</span>
                    </div>
                )}
                {phone && (
                    <div className="profile-detail">
                        <span className="label">Phone</span>
                        <span className="value">{phone}</span>
                    </div>
                )}
            </div>
            {actions && (
                <div className="profile-actions">
                    {actions}
                </div>
            )}
        </div>
    );
}

// Appointment Card Component
export function AppointmentCard({
    patientName,
    doctorName,
    time,
    date,
    type,
    status,
    onClick
}) {
    return (
        <div
            className={`appointment-card status-${status?.toLowerCase() || 'pending'}`}
            onClick={onClick}
        >
            <div className="appointment-time">
                <span className="time">{time}</span>
                <span className="date">{date}</span>
            </div>
            <div className="appointment-info">
                <h4 className="patient-name">{patientName}</h4>
                <p className="doctor-name">Dr. {doctorName}</p>
                {type && <span className="appointment-type">{type}</span>}
            </div>
            <span className={`appointment-status status-${status?.toLowerCase() || 'pending'}`}>
                {status || 'Pending'}
            </span>
        </div>
    );
}

export default { StatCard, InfoCard, ActionCard, ProfileCard, AppointmentCard };
