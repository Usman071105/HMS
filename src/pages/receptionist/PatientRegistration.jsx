import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { InfoCard } from '../../components/Cards';
import { UserPlus, ArrowLeft, Check } from 'lucide-react';
import './PatientRegistration.css';

const registrationSchema = yup.object({
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    phone: yup.string().required('Phone number is required'),
    dateOfBirth: yup.date().required('Date of birth is required').max(new Date(), 'Invalid date'),
    gender: yup.string().required('Gender is required'),
    bloodGroup: yup.string(),
    address: yup.string().required('Address is required'),
    city: yup.string().required('City is required'),
    emergencyContactName: yup.string().required('Emergency contact name is required'),
    emergencyContactPhone: yup.string().required('Emergency contact phone is required'),
    allergies: yup.string(),
    medicalHistory: yup.string()
});

export default function PatientRegistration() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        trigger,
        getValues
    } = useForm({
        resolver: yupResolver(registrationSchema)
    });

    const nextStep = async () => {
        const fieldsToValidate = step === 1
            ? ['firstName', 'lastName', 'email', 'phone', 'dateOfBirth', 'gender']
            : ['address', 'city', 'emergencyContactName', 'emergencyContactPhone'];

        const isValid = await trigger(fieldsToValidate);
        if (isValid) setStep(step + 1);
    };

    const prevStep = () => setStep(step - 1);

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            // TODO: API call to register patient
            console.log('Patient data:', data);
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
            setSubmitSuccess(true);
        } catch (error) {
            console.error('Registration failed:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitSuccess) {
        return (
            <div className="registration-page">
                <div className="success-card">
                    <div className="success-icon">
                        <Check size={48} />
                    </div>
                    <h2>Registration Successful!</h2>
                    <p>Patient has been registered successfully.</p>
                    <div className="success-actions">
                        <button className="btn btn-primary" onClick={() => navigate('/receptionist')}>
                            Back to Dashboard
                        </button>
                        <button className="btn btn-outline" onClick={() => {
                            setSubmitSuccess(false);
                            setStep(1);
                        }}>
                            Register Another
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="registration-page">
            <div className="page-header">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ArrowLeft size={20} />
                    Back
                </button>
                <div>
                    <h1>Patient Registration</h1>
                    <p>Register a new patient in the system</p>
                </div>
            </div>

            {/* Progress Steps */}
            <div className="progress-steps">
                <div className={`step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
                    <div className="step-number">1</div>
                    <span>Personal Info</span>
                </div>
                <div className="step-line"></div>
                <div className={`step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
                    <div className="step-number">2</div>
                    <span>Contact & Emergency</span>
                </div>
                <div className="step-line"></div>
                <div className={`step ${step >= 3 ? 'active' : ''}`}>
                    <div className="step-number">3</div>
                    <span>Medical Info</span>
                </div>
            </div>

            <InfoCard>
                <form onSubmit={handleSubmit(onSubmit)} className="registration-form">
                    {/* Step 1: Personal Information */}
                    {step === 1 && (
                        <div className="form-step">
                            <h3>Personal Information</h3>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>First Name *</label>
                                    <input type="text" {...register('firstName')} placeholder="Enter first name" />
                                    {errors.firstName && <span className="error">{errors.firstName.message}</span>}
                                </div>
                                <div className="form-group">
                                    <label>Last Name *</label>
                                    <input type="text" {...register('lastName')} placeholder="Enter last name" />
                                    {errors.lastName && <span className="error">{errors.lastName.message}</span>}
                                </div>
                                <div className="form-group">
                                    <label>Email *</label>
                                    <input type="email" {...register('email')} placeholder="Enter email address" />
                                    {errors.email && <span className="error">{errors.email.message}</span>}
                                </div>
                                <div className="form-group">
                                    <label>Phone Number *</label>
                                    <input type="tel" {...register('phone')} placeholder="Enter phone number" />
                                    {errors.phone && <span className="error">{errors.phone.message}</span>}
                                </div>
                                <div className="form-group">
                                    <label>Date of Birth *</label>
                                    <input type="date" {...register('dateOfBirth')} />
                                    {errors.dateOfBirth && <span className="error">{errors.dateOfBirth.message}</span>}
                                </div>
                                <div className="form-group">
                                    <label>Gender *</label>
                                    <select {...register('gender')}>
                                        <option value="">Select gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                    {errors.gender && <span className="error">{errors.gender.message}</span>}
                                </div>
                                <div className="form-group">
                                    <label>Blood Group</label>
                                    <select {...register('bloodGroup')}>
                                        <option value="">Select blood group</option>
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
                            </div>
                        </div>
                    )}

                    {/* Step 2: Contact & Emergency */}
                    {step === 2 && (
                        <div className="form-step">
                            <h3>Contact & Emergency Information</h3>
                            <div className="form-grid">
                                <div className="form-group full-width">
                                    <label>Address *</label>
                                    <input type="text" {...register('address')} placeholder="Enter street address" />
                                    {errors.address && <span className="error">{errors.address.message}</span>}
                                </div>
                                <div className="form-group">
                                    <label>City *</label>
                                    <input type="text" {...register('city')} placeholder="Enter city" />
                                    {errors.city && <span className="error">{errors.city.message}</span>}
                                </div>
                                <div className="form-group">
                                    <label>State</label>
                                    <input type="text" {...register('state')} placeholder="Enter state" />
                                </div>
                                <div className="form-group">
                                    <label>Emergency Contact Name *</label>
                                    <input type="text" {...register('emergencyContactName')} placeholder="Contact person name" />
                                    {errors.emergencyContactName && <span className="error">{errors.emergencyContactName.message}</span>}
                                </div>
                                <div className="form-group">
                                    <label>Emergency Contact Phone *</label>
                                    <input type="tel" {...register('emergencyContactPhone')} placeholder="Contact phone number" />
                                    {errors.emergencyContactPhone && <span className="error">{errors.emergencyContactPhone.message}</span>}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Medical Information */}
                    {step === 3 && (
                        <div className="form-step">
                            <h3>Medical Information</h3>
                            <div className="form-grid">
                                <div className="form-group full-width">
                                    <label>Known Allergies</label>
                                    <textarea {...register('allergies')} placeholder="List any known allergies (optional)" rows={3}></textarea>
                                </div>
                                <div className="form-group full-width">
                                    <label>Medical History</label>
                                    <textarea {...register('medicalHistory')} placeholder="Brief medical history (optional)" rows={4}></textarea>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Form Actions */}
                    <div className="form-actions">
                        {step > 1 && (
                            <button type="button" className="btn btn-outline" onClick={prevStep}>
                                Previous
                            </button>
                        )}
                        {step < 3 ? (
                            <button type="button" className="btn btn-primary" onClick={nextStep}>
                                Next Step
                            </button>
                        ) : (
                            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <span className="spinner"></span>
                                        Registering...
                                    </>
                                ) : (
                                    <>
                                        <UserPlus size={18} />
                                        Register Patient
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </form>
            </InfoCard>
        </div>
    );
}
