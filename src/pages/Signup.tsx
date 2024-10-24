import { useFormik } from 'formik';
import React, { useState } from 'react'
import * as Yup from 'yup'
import { toast } from 'sonner';
import axiosInstance from '../axios/axiosInstance';

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

    const[selectedPreferences,setSelectedPrefernces] = useState<string[]>([])

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
                const res = await axiosInstance.post('/auth/register',{...values,preferences:selectedPreferences})
                if(res.status === 201){
                    
                }
            } catch (error:any) {
                const errorMessage = error.response?.data?.message || 'Signup failed. Please try again.';
        toast.error(errorMessage);
            }
        }
    })
  return (
    <div>
      
    </div>
  )
}

export default Signup
