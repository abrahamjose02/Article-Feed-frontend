import { useFormik } from 'formik';
import React, { useState } from 'react'
import * as Yup from 'yup'
import { toast } from 'sonner';
import axiosInstance from '../axios/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/userSlice';
import { ArticleCategory } from '../enum/ArticleCategory';

interface SignupFormValues {
    firstName:string;
    lastName:string;
    email:string;
    phone:string;
    dob:string;
    password:string;
    preferences: string[]
}

const Signup:React.FC = () => {

 const dispatch = useDispatch()
 const navigate = useNavigate()

    const formik = useFormik<SignupFormValues>({
        initialValues:{
            firstName:"",
            lastName:"",
            email:"",
            phone:"",
            dob:"",
            password:"",
            preferences:[],
        },
        validationSchema:Yup.object({
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
      dob: Yup.string()
        .required('Date of Birth is required'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
        }),
        onSubmit:async(values:SignupFormValues) =>{
            try {
                const res = await axiosInstance.post('/auth/register',{
                  firstName: values.firstName,
                  lastName: values.lastName,
                  phone: values.phone,
                  email: values.email,
                  dob: values.dob,
                  password: values.password,
                  preferences: values.preferences,
                })
                if(res.status === 201){
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
                }
                else{
                  toast.error('Unexpected response from the server. Please try again.');
                }
            } catch (error:any) {
                const errorMessage = error.response?.data?.message || 'Signup failed. Please try again.';
        toast.error(errorMessage);
            }
        }
    });

    const preferenceOptions = Object.values(ArticleCategory)

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-400">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center text-gray-700 mb-6">SIGN UP</h1>
        <form onSubmit={formik.handleSubmit}>
          {/* First Name */}
          <div className="mb-4">
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

          {/* Last Name */}
          <div className="mb-4">
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

          {/* Email */}
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

          {/* Phone Number */}
          <div className="mb-4">
            <label htmlFor="phonenumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="tel"
              id="phonenumber"
              className={`mt-1 block w-full px-3 py-2 border ${formik.errors.phone && formik.touched.phone ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              {...formik.getFieldProps('phonenumber')}
            />
            {formik.touched.phone && formik.errors.phone && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.phone}</p>
            )}
          </div>

          {/* Date of Birth */}
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

          {/* Preferences */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Preferences</label>
            <div className="mt-1">
              {preferenceOptions.map((preference) => (
                <div key={preference} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id={preference}
                    value={preference}
                    checked={formik.values.preferences.includes(preference)}
                    onChange={(e) => {
                      const selectedPreferences = formik.values.preferences;
                      if (e.target.checked) {
                        formik.setFieldValue('preferences', [...selectedPreferences, preference]);
                      } else {
                        formik.setFieldValue('preferences', selectedPreferences.filter(p => p !== preference));
                      }
                    }}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                  <label htmlFor={preference} className="ml-2 block text-sm text-gray-700">
                    {preference}
                  </label>
                </div>
              ))}
            </div>
            {formik.touched.preferences && formik.errors.preferences && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.preferences}</p>
            )}
          </div>

          {/* Password */}
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
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  )
}

export default Signup
