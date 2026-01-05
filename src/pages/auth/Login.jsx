import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth, ROLE_ROUTES } from '../../context/AuthContext';
import { Eye, EyeOff, Stethoscope, Mail, Lock, AlertCircle } from 'lucide-react';
import './Login.css';

const loginSchema = yup.object({
    email: yup
        .string()
        .email('Please enter a valid email address')
        .required('Email is required'),
    password: yup
        .string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required')
});

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, loading, error: authError } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: yupResolver(loginSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    });

    const onSubmit = async (data) => {
        setError('');
        const result = await login(data.email, data.password);

        if (result.success) {
            // Redirect to appropriate dashboard based on role
            const from = location.state?.from?.pathname || ROLE_ROUTES[result.role] || '/';
            navigate(from, { replace: true });
        } else {
            setError(result.error);
        }
    };

    // Demo login function for testing
    const handleDemoLogin = (role) => {
        const demoCredentials = {
            ADMIN: { email: 'admin@hospital.com', password: 'admin123' },
            DOCTOR: { email: 'doctor@hospital.com', password: 'doctor123' },
            RECEPTIONIST: { email: 'receptionist@hospital.com', password: 'receptionist123' },
            PATIENT: { email: 'patient@hospital.com', password: 'patient123' }
        };

        // For demo, we'll simulate login with mock data
        localStorage.setItem('token', 'demo-token-' + role.toLowerCase());
        localStorage.setItem('user', JSON.stringify({
            id: '1',
            email: demoCredentials[role].email,
            firstName: role === 'DOCTOR' ? 'Dr. John' : role.charAt(0) + role.slice(1).toLowerCase(),
            lastName: 'Demo',
            role: role
        }));

        window.location.href = ROLE_ROUTES[role];
    };

    return (
        <div className="login-page">
            <div className="login-container">
                {/* Left Panel - Branding */}
                <div className="login-branding">
                    <div className="branding-content">
                        <div className="logo">
                            <Stethoscope size={48} />
                            <h1>HMS</h1>
                        </div>
                        <h2>Hospital Management System</h2>
                        <p>
                            Streamline your healthcare facility with our comprehensive
                            management solution. Manage patients, appointments, and staff
                            all in one place.
                        </p>
                        <div className="features">
                            <div className="feature">
                                <span className="feature-icon">📋</span>
                                <span>Patient Records</span>
                            </div>
                            <div className="feature">
                                <span className="feature-icon">📅</span>
                                <span>Appointment Scheduling</span>
                            </div>
                            <div className="feature">
                                <span className="feature-icon">👥</span>
                                <span>Staff Management</span>
                            </div>
                            <div className="feature">
                                <span className="feature-icon">📊</span>
                                <span>Analytics & Reports</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel - Login Form */}
                <div className="login-form-panel">
                    <div className="login-form-container">
                        <div className="form-header">
                            <h2>Welcome Back</h2>
                            <p>Please sign in to your account</p>
                        </div>

                        {(error || authError) && (
                            <div className="error-alert">
                                <AlertCircle size={18} />
                                <span>{error || authError}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <div className={`input-wrapper ${errors.email ? 'error' : ''}`}>
                                    <Mail size={18} />
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        {...register('email')}
                                        disabled={isSubmitting || loading}
                                    />
                                </div>
                                {errors.email && (
                                    <span className="error-message">{errors.email.message}</span>
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <div className={`input-wrapper ${errors.password ? 'error' : ''}`}>
                                    <Lock size={18} />
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Enter your password"
                                        {...register('password')}
                                        disabled={isSubmitting || loading}
                                    />
                                    <button
                                        type="button"
                                        className="toggle-password"
                                        onClick={() => setShowPassword(!showPassword)}
                                        tabIndex={-1}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <span className="error-message">{errors.password.message}</span>
                                )}
                            </div>

                            <div className="form-options">
                                <label className="checkbox-wrapper">
                                    <input type="checkbox" />
                                    <span>Remember me</span>
                                </label>
                                <a href="#forgot" className="forgot-link">Forgot Password?</a>
                            </div>

                            <button
                                type="submit"
                                className="login-btn"
                                disabled={isSubmitting || loading}
                            >
                                {isSubmitting || loading ? (
                                    <>
                                        <span className="spinner"></span>
                                        Signing In...
                                    </>
                                ) : (
                                    'Sign In'
                                )}
                            </button>
                        </form>

                        {/* Demo Login Buttons */}
                        <div className="demo-section">
                            <p className="demo-label">Quick Demo Access</p>
                            <div className="demo-buttons">
                                <button onClick={() => handleDemoLogin('ADMIN')} className="demo-btn admin">
                                    Admin
                                </button>
                                <button onClick={() => handleDemoLogin('DOCTOR')} className="demo-btn doctor">
                                    Doctor
                                </button>
                                <button onClick={() => handleDemoLogin('RECEPTIONIST')} className="demo-btn receptionist">
                                    Receptionist
                                </button>
                                <button onClick={() => handleDemoLogin('PATIENT')} className="demo-btn patient">
                                    Patient
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
