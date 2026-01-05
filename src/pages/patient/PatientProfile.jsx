import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { InfoCard } from '../../components/Cards';
import { User, Mail, Phone, MapPin, Calendar, Shield, Camera, Save, Check, AlertCircle } from 'lucide-react';
import './PatientProfile.css';

export default function PatientProfile() {
    const { user } = useAuth();
    const [editMode, setEditMode] = useState(false);
    const [saved, setSaved] = useState(false);
    const [profile, setProfile] = useState({
        firstName: user?.firstName || 'Patient',
        lastName: user?.lastName || 'Demo',
        email: user?.email || 'patient.demo@email.com',
        phone: '+1 234-567-8900',
        dateOfBirth: '1990-05-15',
        gender: 'Male',
        bloodGroup: 'O+',
        address: '456 Health Street, Medical City, MC 12345',
        emergencyName: 'Jane Doe',
        emergencyPhone: '+1 234-567-8901',
        emergencyRelation: 'Spouse',
        allergies: 'Penicillin, Peanuts',
        medications: 'Lisinopril 10mg daily'
    });

    const handleSave = () => {
        // TODO: API call to save profile
        setSaved(true);
        setEditMode(false);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="patient-profile">
            <div className="page-header">
                <div>
                    <h1>My Profile</h1>
                    <p>Manage your personal and medical information</p>
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
                                <h2>{profile.firstName} {profile.lastName}</h2>
                                <p className="patient-id">Patient ID: P001234</p>
                            </div>
                        </div>

                        <div className="profile-stats">
                            <div className="stat-box">
                                <Calendar size={18} />
                                <div>
                                    <span className="value">Member Since</span>
                                    <span className="label">Jan 2024</span>
                                </div>
                            </div>
                            <div className="stat-box">
                                <Shield size={18} />
                                <div>
                                    <span className="value">Insurance</span>
                                    <span className="label">Active</span>
                                </div>
                            </div>
                        </div>

                        {/* Medical Alert */}
                        {profile.allergies && (
                            <div className="medical-alert">
                                <AlertCircle size={16} />
                                <div>
                                    <span className="alert-title">Allergies</span>
                                    <span className="alert-content">{profile.allergies}</span>
                                </div>
                            </div>
                        )}
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
                            <div className="form-group">
                                <label>Date of Birth</label>
                                <input
                                    type="date"
                                    value={profile.dateOfBirth}
                                    onChange={(e) => setProfile({ ...profile, dateOfBirth: e.target.value })}
                                    disabled={!editMode}
                                />
                            </div>
                            <div className="form-group">
                                <label>Gender</label>
                                <select
                                    value={profile.gender}
                                    onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                                    disabled={!editMode}
                                >
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
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

                    <InfoCard title="Medical Information">
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Blood Group</label>
                                <select
                                    value={profile.bloodGroup}
                                    onChange={(e) => setProfile({ ...profile, bloodGroup: e.target.value })}
                                    disabled={!editMode}
                                >
                                    <option value="A+">A+</option>
                                    <option value="A-">A-</option>
                                    <option value="B+">B+</option>
                                    <option value="B-">B-</option>
                                    <option value="AB+">AB+</option>
                                    <option value="AB-">AB-</option>
                                    <option value="O+">O+</option>
                                    <option value="O-">O-</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Current Medications</label>
                                <input
                                    type="text"
                                    value={profile.medications}
                                    onChange={(e) => setProfile({ ...profile, medications: e.target.value })}
                                    disabled={!editMode}
                                />
                            </div>
                            <div className="form-group full-width">
                                <label>Known Allergies</label>
                                <input
                                    type="text"
                                    value={profile.allergies}
                                    onChange={(e) => setProfile({ ...profile, allergies: e.target.value })}
                                    disabled={!editMode}
                                    placeholder="List any known allergies"
                                />
                            </div>
                        </div>
                    </InfoCard>

                    <InfoCard title="Emergency Contact">
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Contact Name</label>
                                <input
                                    type="text"
                                    value={profile.emergencyName}
                                    onChange={(e) => setProfile({ ...profile, emergencyName: e.target.value })}
                                    disabled={!editMode}
                                />
                            </div>
                            <div className="form-group">
                                <label>Relationship</label>
                                <input
                                    type="text"
                                    value={profile.emergencyRelation}
                                    onChange={(e) => setProfile({ ...profile, emergencyRelation: e.target.value })}
                                    disabled={!editMode}
                                />
                            </div>
                            <div className="form-group full-width">
                                <label>Contact Phone</label>
                                <div className="input-with-icon">
                                    <Phone size={16} />
                                    <input
                                        type="tel"
                                        value={profile.emergencyPhone}
                                        onChange={(e) => setProfile({ ...profile, emergencyPhone: e.target.value })}
                                        disabled={!editMode}
                                    />
                                </div>
                            </div>
                        </div>
                    </InfoCard>
                </div>
            </div>
        </div>
    );
}
