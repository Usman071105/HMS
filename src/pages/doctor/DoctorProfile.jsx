import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { InfoCard } from '../../components/Cards';
import { User, Mail, Phone, MapPin, Award, Calendar, Clock, Camera, Save, Check } from 'lucide-react';
import './DoctorProfile.css';

export default function DoctorProfile() {
    const { user } = useAuth();
    const [editMode, setEditMode] = useState(false);
    const [saved, setSaved] = useState(false);
    const [profile, setProfile] = useState({
        firstName: user?.firstName || 'John',
        lastName: user?.lastName || 'Williams',
        email: user?.email || 'dr.williams@hospital.com',
        phone: '+1 234-567-8900',
        specialization: 'General Physician',
        department: 'Internal Medicine',
        experience: '15 years',
        qualifications: 'MD, MBBS, FACP',
        licenseNo: 'MED-2010-45678',
        address: '123 Medical Center Drive, City, State 12345',
        bio: 'Board-certified physician with over 15 years of experience in internal medicine. Specialized in preventive care and chronic disease management.'
    });

    const handleSave = () => {
        // TODO: API call to save profile
        setSaved(true);
        setEditMode(false);
        setTimeout(() => setSaved(false), 3000);
    };

    const stats = [
        { label: 'Patients Treated', value: '2,450+', icon: User },
        { label: 'Years Experience', value: '15', icon: Award },
        { label: 'Appointments Today', value: '8', icon: Calendar },
        { label: 'Avg. Consultation', value: '25 min', icon: Clock }
    ];

    return (
        <div className="doctor-profile">
            <div className="page-header">
                <div>
                    <h1>My Profile</h1>
                    <p>Manage your professional profile and information</p>
                </div>
                <button className="btn btn-primary" onClick={editMode ? handleSave : () => setEditMode(true)}>
                    {saved ? <Check size={18} /> : editMode ? <Save size={18} /> : <User size={18} />}
                    {saved ? 'Saved!' : editMode ? 'Save Changes' : 'Edit Profile'}
                </button>
            </div>

            <div className="profile-layout">
                {/* Profile Card */}
                <div className="profile-card">
                    <InfoCard>
                        <div className="profile-header">
                            <div className="avatar-section">
                                <div className="avatar">
                                    {profile.firstName[0]}{profile.lastName[0]}
                                </div>
                                {editMode && (
                                    <button className="avatar-edit">
                                        <Camera size={16} />
                                    </button>
                                )}
                            </div>
                            <div className="profile-info">
                                <h2>Dr. {profile.firstName} {profile.lastName}</h2>
                                <p className="specialization">{profile.specialization}</p>
                                <p className="department">{profile.department}</p>
                            </div>
                        </div>

                        <div className="stats-row">
                            {stats.map((stat, index) => (
                                <div key={index} className="stat-box">
                                    <stat.icon size={20} />
                                    <span className="value">{stat.value}</span>
                                    <span className="label">{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    </InfoCard>
                </div>

                {/* Profile Details */}
                <div className="profile-details">
                    <InfoCard title="Personal Information">
                        <div className="form-grid">
                            <div className="form-group">
                                <label>First Name</label>
                                <input
                                    type="text"
                                    value={profile.firstName}
                                    onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                                    disabled={!editMode}
                                />
                            </div>
                            <div className="form-group">
                                <label>Last Name</label>
                                <input
                                    type="text"
                                    value={profile.lastName}
                                    onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                                    disabled={!editMode}
                                />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <div className="input-with-icon">
                                    <Mail size={16} />
                                    <input
                                        type="email"
                                        value={profile.email}
                                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                        disabled={!editMode}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Phone</label>
                                <div className="input-with-icon">
                                    <Phone size={16} />
                                    <input
                                        type="tel"
                                        value={profile.phone}
                                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                        disabled={!editMode}
                                    />
                                </div>
                            </div>
                            <div className="form-group full-width">
                                <label>Address</label>
                                <div className="input-with-icon">
                                    <MapPin size={16} />
                                    <input
                                        type="text"
                                        value={profile.address}
                                        onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                                        disabled={!editMode}
                                    />
                                </div>
                            </div>
                        </div>
                    </InfoCard>

                    <InfoCard title="Professional Information">
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Specialization</label>
                                <input
                                    type="text"
                                    value={profile.specialization}
                                    onChange={(e) => setProfile({ ...profile, specialization: e.target.value })}
                                    disabled={!editMode}
                                />
                            </div>
                            <div className="form-group">
                                <label>Department</label>
                                <input
                                    type="text"
                                    value={profile.department}
                                    onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                                    disabled={!editMode}
                                />
                            </div>
                            <div className="form-group">
                                <label>Experience</label>
                                <input
                                    type="text"
                                    value={profile.experience}
                                    onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
                                    disabled={!editMode}
                                />
                            </div>
                            <div className="form-group">
                                <label>License Number</label>
                                <input
                                    type="text"
                                    value={profile.licenseNo}
                                    onChange={(e) => setProfile({ ...profile, licenseNo: e.target.value })}
                                    disabled={!editMode}
                                />
                            </div>
                            <div className="form-group full-width">
                                <label>Qualifications</label>
                                <input
                                    type="text"
                                    value={profile.qualifications}
                                    onChange={(e) => setProfile({ ...profile, qualifications: e.target.value })}
                                    disabled={!editMode}
                                />
                            </div>
                            <div className="form-group full-width">
                                <label>Bio</label>
                                <textarea
                                    value={profile.bio}
                                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                    disabled={!editMode}
                                    rows={4}
                                />
                            </div>
                        </div>
                    </InfoCard>
                </div>
            </div>
        </div>
    );
}
