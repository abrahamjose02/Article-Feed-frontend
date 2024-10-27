import React, { useEffect, useState } from 'react';
import axiosInstance from '../axios/axiosInstance';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import Navbar from '../components/Navbar';
import { ArticleCategory } from '../enum/ArticleCategory';

const Settings: React.FC = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [dob, setDob] = useState('');
    const [preferences, setPreferences] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<ArticleCategory | ''>('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const res = await axiosInstance.get('/auth/profile');
                if (res.data.success) {
                    const { firstName, lastName, phone, dob, preferences } = res.data.user;
                    setFirstName(firstName || '');
                    setLastName(lastName || '');
                    setPhone(phone || '');
                    setDob(dob ? new Date(dob).toISOString().split('T')[0] : '');
                    setPreferences(preferences || []);
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

    const validateInputs = () => {
        const newErrors: { [key: string]: string } = {};

        if (!firstName.trim()) newErrors.firstName = 'First name is required';
        if (!lastName.trim()) newErrors.lastName = 'Last name is required';
        if (phone && !/^\d{10,15}$/.test(phone)) newErrors.phone = 'Phone number should be 10 digits';
        if (password && password.length < 6) newErrors.password = 'Password should be at least 6 characters';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validateInputs()) return;

        const updateData = {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            phone,
            dob,
            preferences,
            password,
        };

        try {
            const res = await axiosInstance.post('/auth/update', updateData);
            if (res.data.success) {
                toast.success('User updated successfully');
            }
        } catch (error: any) {
            console.error('Error updating user:', error);
            toast.error(error.response?.data?.message || 'Failed to update user');
        }
    };

    const handleRemovePreference = (preference: string) => {
        setPreferences(preferences.filter((pref) => pref !== preference));
        toast.success(`Removed preference: ${preference}`);
    };

    const handleAddPreference = () => {
        if (selectedCategory && !preferences.includes(selectedCategory)) {
            setPreferences([...preferences, selectedCategory]);
            toast.success(`Added preference: ${selectedCategory}`);
            setSelectedCategory('');
        } else {
            toast.error('Preference already exists or no category selected');
        }
    };

    if (loading) {
        return <div className="text-center mt-10">Loading user profile...</div>;
    }

    return (
        <div>
            <Navbar />
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
                        {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
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
                        {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-1">Phone</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full border rounded px-3 py-2"
                        />
                        {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
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
                        <div className="flex flex-wrap mb-2">
                            {preferences.map((preference) => (
                                <div key={preference} className="flex items-center bg-blue-100 text-blue-800 rounded-full px-3 py-1 mr-2 mb-2">
                                    <span>{preference}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemovePreference(preference)}
                                        className="ml-2 text-red-600 hover:text-red-800"
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="flex mb-2">
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value as ArticleCategory)}
                                className="border rounded px-3 py-2 w-full"
                            >
                                <option value="">Select a category</option>
                                {Object.values(ArticleCategory).map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                            <button
                                type="button"
                                onClick={handleAddPreference}
                                className="bg-green-600 text-white py-2 px-4 rounded ml-2 hover:bg-green-700 transition"
                            >
                                Add
                            </button>
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-1">New Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border rounded px-3 py-2"
                        />
                        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                    >
                        Update Profile
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Settings;
