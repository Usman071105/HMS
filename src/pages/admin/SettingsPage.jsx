import { useState } from 'react';
import { InfoCard } from '../../components/Cards';
import { Settings, User, Bell, Shield, Database, Palette, Save, Check } from 'lucide-react';
import './SettingsPage.css';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('general');
    const [saved, setSaved] = useState(false);
    const [settings, setSettings] = useState({
        hospitalName: 'City General Hospital',
        email: 'admin@hospital.com',
        phone: '+1 234-567-8900',
        address: '123 Medical Center Drive, City, State 12345',
        timezone: 'America/New_York',
        dateFormat: 'MM/DD/YYYY',
        emailNotifications: true,
        smsNotifications: false,
        appointmentReminders: true,
        darkMode: true,
        autoBackup: true,
        backupFrequency: 'daily'
    });

    const handleSave = () => {
        // TODO: API call to save settings
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const tabs = [
        { id: 'general', label: 'General', icon: Settings },
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'backup', label: 'Backup', icon: Database },
        { id: 'appearance', label: 'Appearance', icon: Palette }
    ];

    return (
        <div className="settings-page">
            <div className="page-header">
                <div>
                    <h1>Settings</h1>
                    <p>Manage your system preferences and configurations</p>
                </div>
                <button className="btn btn-primary" onClick={handleSave}>
                    {saved ? <Check size={18} /> : <Save size={18} />}
                    {saved ? 'Saved!' : 'Save Changes'}
                </button>
            </div>

            <div className="settings-layout">
                {/* Sidebar */}
                <div className="settings-sidebar">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="settings-content">
                    {activeTab === 'general' && (
                        <InfoCard title="General Settings">
                            <div className="form-section">
                                <div className="form-group">
                                    <label>Hospital Name</label>
                                    <input
                                        type="text"
                                        value={settings.hospitalName}
                                        onChange={(e) => setSettings({ ...settings, hospitalName: e.target.value })}
                                    />
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Email</label>
                                        <input
                                            type="email"
                                            value={settings.email}
                                            onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Phone</label>
                                        <input
                                            type="tel"
                                            value={settings.phone}
                                            onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Address</label>
                                    <textarea
                                        value={settings.address}
                                        onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                                        rows={2}
                                    />
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Timezone</label>
                                        <select
                                            value={settings.timezone}
                                            onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                                        >
                                            <option value="America/New_York">Eastern Time</option>
                                            <option value="America/Chicago">Central Time</option>
                                            <option value="America/Denver">Mountain Time</option>
                                            <option value="America/Los_Angeles">Pacific Time</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Date Format</label>
                                        <select
                                            value={settings.dateFormat}
                                            onChange={(e) => setSettings({ ...settings, dateFormat: e.target.value })}
                                        >
                                            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </InfoCard>
                    )}

                    {activeTab === 'notifications' && (
                        <InfoCard title="Notification Preferences">
                            <div className="form-section">
                                <div className="toggle-item">
                                    <div className="toggle-info">
                                        <h4>Email Notifications</h4>
                                        <p>Receive email notifications for important updates</p>
                                    </div>
                                    <label className="toggle">
                                        <input
                                            type="checkbox"
                                            checked={settings.emailNotifications}
                                            onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                                        />
                                        <span className="toggle-slider"></span>
                                    </label>
                                </div>
                                <div className="toggle-item">
                                    <div className="toggle-info">
                                        <h4>SMS Notifications</h4>
                                        <p>Receive SMS alerts for critical updates</p>
                                    </div>
                                    <label className="toggle">
                                        <input
                                            type="checkbox"
                                            checked={settings.smsNotifications}
                                            onChange={(e) => setSettings({ ...settings, smsNotifications: e.target.checked })}
                                        />
                                        <span className="toggle-slider"></span>
                                    </label>
                                </div>
                                <div className="toggle-item">
                                    <div className="toggle-info">
                                        <h4>Appointment Reminders</h4>
                                        <p>Send automatic reminders to patients</p>
                                    </div>
                                    <label className="toggle">
                                        <input
                                            type="checkbox"
                                            checked={settings.appointmentReminders}
                                            onChange={(e) => setSettings({ ...settings, appointmentReminders: e.target.checked })}
                                        />
                                        <span className="toggle-slider"></span>
                                    </label>
                                </div>
                            </div>
                        </InfoCard>
                    )}

                    {activeTab === 'backup' && (
                        <InfoCard title="Backup Settings">
                            <div className="form-section">
                                <div className="toggle-item">
                                    <div className="toggle-info">
                                        <h4>Automatic Backup</h4>
                                        <p>Automatically backup system data</p>
                                    </div>
                                    <label className="toggle">
                                        <input
                                            type="checkbox"
                                            checked={settings.autoBackup}
                                            onChange={(e) => setSettings({ ...settings, autoBackup: e.target.checked })}
                                        />
                                        <span className="toggle-slider"></span>
                                    </label>
                                </div>
                                {settings.autoBackup && (
                                    <div className="form-group">
                                        <label>Backup Frequency</label>
                                        <select
                                            value={settings.backupFrequency}
                                            onChange={(e) => setSettings({ ...settings, backupFrequency: e.target.value })}
                                        >
                                            <option value="hourly">Hourly</option>
                                            <option value="daily">Daily</option>
                                            <option value="weekly">Weekly</option>
                                            <option value="monthly">Monthly</option>
                                        </select>
                                    </div>
                                )}
                                <button className="btn btn-outline">
                                    <Database size={18} />
                                    Backup Now
                                </button>
                            </div>
                        </InfoCard>
                    )}

                    {activeTab === 'appearance' && (
                        <InfoCard title="Appearance">
                            <div className="form-section">
                                <div className="toggle-item">
                                    <div className="toggle-info">
                                        <h4>Dark Mode</h4>
                                        <p>Use dark theme for the interface</p>
                                    </div>
                                    <label className="toggle">
                                        <input
                                            type="checkbox"
                                            checked={settings.darkMode}
                                            onChange={(e) => setSettings({ ...settings, darkMode: e.target.checked })}
                                        />
                                        <span className="toggle-slider"></span>
                                    </label>
                                </div>
                            </div>
                        </InfoCard>
                    )}

                    {(activeTab === 'profile' || activeTab === 'security') && (
                        <InfoCard title={activeTab === 'profile' ? 'Profile Settings' : 'Security Settings'}>
                            <div className="placeholder-content">
                                <p>Configure your {activeTab} settings here.</p>
                                <p className="text-muted">This section will be connected to user profile management.</p>
                            </div>
                        </InfoCard>
                    )}
                </div>
            </div>
        </div>
    );
}
