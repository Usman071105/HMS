import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth, ROLES } from '../context/AuthContext';
import {
    LayoutDashboard,
    Users,
    Calendar,
    FileText,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Stethoscope,
    ClipboardList,
    UserPlus,
    BarChart3,
    Bell,
    Search,
    Menu,
    X,
    User,
    Home,
    ArrowLeft
} from 'lucide-react';
import './Layout.css';

const NAVIGATION_ITEMS = {
    [ROLES.ADMIN]: [
        { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/admin/users', icon: Users, label: 'User Management' },
        { path: '/admin/patients', icon: ClipboardList, label: 'Patients' },
        { path: '/admin/appointments', icon: Calendar, label: 'Appointments' },
        { path: '/admin/staff', icon: Stethoscope, label: 'Staff' },
        { path: '/admin/reports', icon: BarChart3, label: 'Reports' },
        { path: '/admin/settings', icon: Settings, label: 'Settings' }
    ],
    [ROLES.DOCTOR]: [
        { path: '/doctor', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/doctor/appointments', icon: Calendar, label: 'My Appointments' },
        { path: '/doctor/patients', icon: ClipboardList, label: 'My Patients' },
        { path: '/doctor/schedule', icon: FileText, label: 'Schedule' },
        { path: '/doctor/profile', icon: User, label: 'Profile' }
    ],
    [ROLES.RECEPTIONIST]: [
        { path: '/receptionist', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/receptionist/register', icon: UserPlus, label: 'Register Patient' },
        { path: '/receptionist/appointments', icon: Calendar, label: 'Appointments' },
        { path: '/receptionist/patients', icon: ClipboardList, label: 'Patients' },
        { path: '/receptionist/checkin', icon: FileText, label: 'Check-In' }
    ],
    [ROLES.PATIENT]: [
        { path: '/patient', icon: Home, label: 'Dashboard' },
        { path: '/patient/appointments', icon: Calendar, label: 'My Appointments' },
        { path: '/patient/book', icon: UserPlus, label: 'Book Appointment' },
        { path: '/patient/records', icon: FileText, label: 'Medical Records' },
        { path: '/patient/profile', icon: User, label: 'Profile' }
    ]
};

// Get dashboard path for each role
const DASHBOARD_PATHS = {
    [ROLES.ADMIN]: '/admin',
    [ROLES.DOCTOR]: '/doctor',
    [ROLES.RECEPTIONIST]: '/receptionist',
    [ROLES.PATIENT]: '/patient'
};

export default function Layout({ children }) {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navItems = NAVIGATION_ITEMS[user?.role] || [];
    const dashboardPath = DASHBOARD_PATHS[user?.role] || '/';

    // Check if currently on dashboard (main menu)
    const isOnDashboard = location.pathname === dashboardPath;

    // Handle back navigation
    const handleBack = () => {
        navigate(dashboardPath);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className={`layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
            {/* Sidebar */}
            <aside className={`sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
                <div className="sidebar-header">
                    <div className="logo">
                        <Stethoscope className="logo-icon" />
                        {!sidebarCollapsed && <span className="logo-text">HMS</span>}
                    </div>
                    <button
                        className="sidebar-toggle desktop-only"
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        aria-label="Toggle sidebar"
                    >
                        {sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                    </button>
                    <button
                        className="sidebar-toggle mobile-only"
                        onClick={() => setMobileMenuOpen(false)}
                        aria-label="Close menu"
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav className="sidebar-nav">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <item.icon size={20} />
                            {!sidebarCollapsed && <span>{item.label}</span>}
                        </Link>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <button className="nav-item logout-btn" onClick={handleLogout}>
                        <LogOut size={20} />
                        {!sidebarCollapsed && <span>Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Mobile Overlay */}
            {mobileMenuOpen && (
                <div className="mobile-overlay" onClick={() => setMobileMenuOpen(false)} />
            )}

            {/* Main Content */}
            <div className="main-wrapper">
                {/* Header */}
                <header className="main-header">
                    <div className="header-left">
                        {/* Back Button */}
                        {!isOnDashboard && (
                            <button
                                className="back-button"
                                onClick={handleBack}
                                aria-label="Back to Dashboard"
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => e.key === 'Enter' && handleBack()}
                            >
                                <ArrowLeft size={20} />
                                <span className="back-text">Back</span>
                            </button>
                        )}
                        <button
                            className="mobile-menu-btn mobile-only"
                            onClick={() => setMobileMenuOpen(true)}
                            aria-label="Open menu"
                        >
                            <Menu size={24} />
                        </button>
                        <div className="search-box">
                            <Search size={18} />
                            <input type="text" placeholder="Search..." />
                        </div>
                    </div>

                    <div className="header-right">
                        <button className="header-btn notification-btn">
                            <Bell size={20} />
                            <span className="notification-badge">3</span>
                        </button>
                        <div className="user-menu">
                            <div className="user-avatar">
                                {user?.firstName?.[0] || user?.email?.[0] || 'U'}
                            </div>
                            <div className="user-info">
                                <span className="user-name">{user?.firstName || 'User'} {user?.lastName || ''}</span>
                                <span className="user-role">{user?.role?.toLowerCase() || 'Guest'}</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="main-content">
                    {children}
                </main>
            </div>
        </div>
    );
}
