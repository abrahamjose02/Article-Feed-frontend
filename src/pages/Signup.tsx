import { useFormik } from 'formik';
import React, { useState } from 'react';
import * as Yup from 'yup';
import { toast } from 'sonner';
import axiosInstance from '../axios/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/userSlice';
import { ArticleCategory } from '../enum/ArticleCategory';

interface SignupFormValues {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dob: string;
    password: string;
    preferences: string[];
}

const Signup: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [loading, setLoading] = useState(false); // State for loading

    const formik = useFormik<SignupFormValues>({
        initialValues: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            dob: "",
            password: "",
            preferences: [],
        },
        validationSchema: Yup.object({
            firstName: Yup.string()
                .max(50, 'Must be 50 characters or less')
                .required('First Name is required'),
            lastName: Yup.string()
                .max(50, 'Must be 50 characters or less')
                .required('Last Name is required'),
            email: Yup.string()
                .email('Invalid email address')
                .required('Email is required'),
            phone: Yup.string()
                .matches(/^\d{10}$/, 'Must be exactly 10 digits')
                .required('Phone Number is required'),
            dob: Yup.date()
                .max(new Date('2022-01-01'), 'Date of Birth must be before 2022')
                .required('Date of Birth is required'),
            password: Yup.string()
                .min(6, 'Password must be at least 6 characters')
                .required('Password is required'),
        }),
        onSubmit: async (values: SignupFormValues) => {
            setLoading(true); // Set loading to true
            try {
                const res = await axiosInstance.post('/auth/register', {
                    firstName: values.firstName,
                    lastName: values.lastName,
                    phone: values.phone,
                    email: values.email,
                    dob: values.dob,
                    password: values.password,
                    preferences: values.preferences,
                });
                setLoading(false); // Reset loading state
                if (res.status === 201) {
                    dispatch(
                        setUser({
                            firstName: values.firstName,
                            lastName: values.lastName,
                            email: values.email,
                            phone: values.phone,
                            dob: values.dob,
                            preferences: values.preferences, // Store preferences in Redux
                            token: res.data.token,
                        })
                    );
                    toast.success('Registration successful! Redirecting to verification...');
                    navigate('/verification');
                } else {
                    toast.error('Unexpected response from the server. Please try again.');
                }
            } catch (error: any) {
                setLoading(false); // Reset loading state
                const errorMessage = error.response?.data?.message || 'Signup failed. Please try again.';
                toast.error(errorMessage);
            }
        }
    });

    const preferenceOptions = Object.values(ArticleCategory);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-400 p-4">
            <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full">
                <h1 className="text-2xl font-bold text-center text-gray-700 mb-6">SIGN UP</h1>
                <form onSubmit={formik.handleSubmit}>
                    <div className="flex space-x-4 mb-4">
                        <div className="flex-1">
                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                            <input
                                type="text"
                                id="firstName"
                                className={`mt-1 block w-full px-3 py-2 border ${formik.errors.firstName && formik.touched.firstName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                                {...formik.getFieldProps('firstName')}
                            />
                            {formik.touched.firstName && formik.errors.firstName && (
                                <p className="text-red-500 text-sm mt-1">{formik.errors.firstName}</p>
                            )}
                        </div>
                        <div className="flex-1">
                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                            <input
                                type="text"
                                id="lastName"
                                className={`mt-1 block w-full px-3 py-2 border ${formik.errors.lastName && formik.touched.lastName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                                {...formik.getFieldProps('lastName')}
                            />
                            {formik.touched.lastName && formik.errors.lastName && (
                                <p className="text-red-500 text-sm mt-1">{formik.errors.lastName}</p>
                            )}
                        </div>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                        <input
                            type="email"
                            id="email"
                            className={`mt-1 block w-full px-3 py-2 border ${formik.errors.email && formik.touched.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                            {...formik.getFieldProps('email')}
                        />
                        {formik.touched.email && formik.errors.email && (
                            <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                        <input
                            type="tel"
                            id="phone"
                            className={`mt-1 block w-full px-3 py-2 border ${formik.errors.phone && formik.touched.phone ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                            {...formik.getFieldProps('phone')}
                        />
                        {formik.touched.phone && formik.errors.phone && (
                            <p className="text-red-500 text-sm mt-1">{formik.errors.phone}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="dob" className="block text-sm font-medium text-gray-700">Date of Birth</label>
                        <input
                            type="date"
                            id="dob"
                            className={`mt-1 block w-full px-3 py-2 border ${formik.errors.dob && formik.touched.dob ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                            {...formik.getFieldProps('dob')}
                        />
                        {formik.touched.dob && formik.errors.dob && (
                            <p className="text-red-500 text-sm mt-1">{formik.errors.dob}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label 
                            className="block text-sm font-medium text-gray-700 cursor-pointer" 
                            onClick={() => setDropdownVisible(!dropdownVisible)}
                        >
                            Preferences
                        </label>
                        <div className="relative">
                            <button 
                                type="button" 
                                className={`mt-1 block w-full border ${formik.values.preferences.length === 0 ? 'border-gray-300' : 'border-indigo-500'} rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-left py-3 px-4 flex justify-between items-center`}
                                onClick={() => setDropdownVisible(!dropdownVisible)}
                            >
                                <span>
                                    {formik.values.preferences.length === 0 ? 'Select Preferences' : formik.values.preferences.join(', ')}
                                </span>
                                <span className="ml-2">
                                    <svg
                                        className="h-5 w-5 text-gray-600"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </span>
                            </button>
                            {dropdownVisible && (
                                <div className="absolute z-10 bg-white shadow-lg rounded-md max-h-40 w-full overflow-y-auto mt-1 border border-gray-300">
                                    {preferenceOptions.map((preference) => (
                                        <label key={preference} className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="mr-2"
                                                value={preference}
                                                checked={formik.values.preferences.includes(preference)}
                                                onChange={() => {
                                                    const currentIndex = formik.values.preferences.indexOf(preference);
                                                    const newPreferences = [...formik.values.preferences];

                                                    if (currentIndex === -1) {
                                                        newPreferences.push(preference);
                                                    } else {
                                                        newPreferences.splice(currentIndex, 1);
                                                    }

                                                    formik.setFieldValue('preferences', newPreferences);
                                                }}
                                            />
                                            {preference}
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            id="password"
                            className={`mt-1 block w-full px-3 py-2 border ${formik.errors.password && formik.touched.password ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                            {...formik.getFieldProps('password')}
                        />
                        {formik.touched.password && formik.errors.password && (
                            <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className={`w-full py-2 px-4 font-semibold text-white rounded-md ${loading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'} transition duration-200`}
                        disabled={loading}
                    >
                        {loading ? (
                            <svg
                                className="animate-spin h-5 w-5 mx-auto text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                            >
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8-8-3.582-8-8z"></path>
                            </svg>
                        ) : (
                            'Create Account'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Signup;
