// src/pages/Login.tsx
import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axios/axiosInstance'; 
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../store/userSlice';

interface LoginFormValues {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [loginError, setLoginError] = useState<string>('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { email } = useSelector((state: any) => state.user); // Selecting email to check if the user is already logged in

  useEffect(() => {
    if (email) {
      navigate('/home', { replace: true });
    }
  }, [email, navigate]);

  const formik = useFormik<LoginFormValues>({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
    }),
    onSubmit: async (values: LoginFormValues) => {
      setLoginError('');
      try {
        const res = await axiosInstance.post('/auth/login', values);

        if (res.status === 200) {
          const user = res.data; // User data returned from the backend

          dispatch(setUser({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            dob: user.dob,
            preferences: user.preferences,
            token: null, // No token is being stored
          }));
          
          toast.success('Login successful!');
          navigate('/home', { replace: true });
        } else {
          setLoginError('Unexpected response from the server. Please try again.');
          toast.error('Login failed. Please try again.');
        }
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
        setLoginError(errorMessage);
        toast.error(errorMessage);
      }
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-400">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center text-gray-700 mb-6">LOGIN</h1>
        <form onSubmit={formik.handleSubmit}>
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

          {loginError && (
            <div className="mb-4 text-sm text-red-600">
              {loginError}
            </div>
          )}

          <div className="flex justify-center mt-4">
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Log In
            </button>
          </div>

          <p className="text-center mt-4 text-sm text-gray-500">
            Don't have an account? <a href="/signup" className="text-indigo-600 hover:underline">Sign Up</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
