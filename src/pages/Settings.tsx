import React, { useEffect, useState } from 'react';
import axiosInstance from '../axios/axiosInstance';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';

const Settings: React.FC = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [dob, setDob] = useState('');
    const [preferences, setPreferences] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(true);
    const user = useSelector((state: any) => state.user);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const res = await axiosInstance.get('/auth/profile'); // Adjusted to match your route
                if (res.data.success) {
                    const { firstName, lastName, phone, dob, preferences } = res.data.user;
                    setFirstName(firstName);
                    setLastName(lastName);
                    setPhone(phone);
                    setDob(dob);
                    setPreferences(preferences);
                }
            } catch (error) {
                console.error(error);
                toast.error('Failed to load user profile');
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const res = await axiosInstance.post('/auth/update', { // Adjusted to match your route
                firstName,
                lastName,
                phone,
                dob,
                preferences,
                password
            });
            if (res.data.success) {
                toast.success('User updated successfully');
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to update user');
        }
    };

    if (loading) {
        return <div className="text-center mt-10">Loading user profile...</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Settings</h1>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
                <div className="mb-4">
                    <label className="block text-gray-700 mb-1">First Name</label>
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-1">Last Name</label>
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-1">Phone</label>
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-1">Date of Birth</label>
                    <input
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-1">Preferences</label>
                    <textarea
                        value={preferences}
                        onChange={(e) => setPreferences(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        rows={3}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-1">New Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                >
                    Update Profile
                </button>
            </form>
        </div>
    );
};

export default Settings;
