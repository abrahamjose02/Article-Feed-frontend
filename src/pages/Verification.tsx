import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'sonner';
import axiosInstance from '../axios/axiosInstance';
import { useNavigate } from 'react-router-dom';

const Verification: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false); // State for loading

    const formik = useFormik({
        initialValues: {
            verificationCode: '',
        },
        validationSchema: Yup.object({
            verificationCode: Yup.string()
                .required('Verification code is required'),
        }),
        onSubmit: async (values) => {
            setLoading(true); // Set loading to true
            try {
                const res = await axiosInstance.post('/auth/verify', {
                    code: values.verificationCode,
                });
                setLoading(false); // Reset loading state
                if (res.status === 200) {
                    toast.success('Verification successful! Redirecting...');
                    navigate('/dashboard');
                } else {
                    toast.error('Unexpected response from the server. Please try again.');
                }
            } catch (error: any) {
                setLoading(false); // Reset loading state
                const errorMessage = error.response?.data?.message || 'Verification failed. Please try again.';
                toast.error(errorMessage);
            }
        },
    });

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-400 p-4">
            <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full">
                <h1 className="text-2xl font-bold text-center text-gray-700 mb-6">VERIFICATION</h1>
                <form onSubmit={formik.handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700">Verification Code</label>
                        <input
                            type="text"
                            id="verificationCode"
                            className={`mt-1 block w-full px-3 py-2 border ${formik.errors.verificationCode && formik.touched.verificationCode ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                            {...formik.getFieldProps('verificationCode')}
                        />
                        {formik.touched.verificationCode && formik.errors.verificationCode && (
                            <p className="text-red-500 text-sm mt-1">{formik.errors.verificationCode}</p>
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
                            'Verify'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Verification;
