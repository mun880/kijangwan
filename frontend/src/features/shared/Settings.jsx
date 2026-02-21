import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Settings as SettingsIcon, User, Phone, Mail, Lock, Loader2, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const Settings = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: user?.username || '',
        email: user?.email || '',
        phone: user?.phone || '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Placeholder for profile update API
            // await api.put('/auth/profile/', formData);
            await new Promise(resolve => setTimeout(resolve, 800)); // Simulate
            toast.success("Profile updated successfully (Simulated)");
        } catch (error) {
            toast.error("Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                    <SettingsIcon className="text-blue-600" /> Account Settings
                </h2>
                <p className="text-gray-500 mt-1">Manage your profile and security preferences</p>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-50">
                    <div className="flex items-center gap-6">
                        <div className="h-20 w-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold">
                            {user?.username?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">{user?.username}</h3>
                            <p className="text-blue-600 font-semibold capitalize bg-blue-50 px-3 py-1 rounded-full text-xs inline-block mt-1">
                                {user?.role}
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                                <User size={12} /> Username
                            </label>
                            <input
                                type="text"
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                disabled
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                                <Mail size={12} /> Email Address
                            </label>
                            <input
                                type="email"
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                                <Phone size={12} /> Phone Number
                            </label>
                            <input
                                type="text"
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex border-t border-gray-50 gap-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-blue-600 text-white p-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition shadow-lg shadow-blue-100 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                            Save Changes
                        </button>
                        <button
                            type="button"
                            className="bg-gray-100 text-gray-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-200 transition"
                        >
                            Change Password
                        </button>
                    </div>
                </form>
            </div>

            <div className="bg-red-50 rounded-3xl p-8 border border-red-100 flex items-center justify-between">
                <div>
                    <h4 className="text-red-900 font-bold mb-1">Danger Zone</h4>
                    <p className="text-red-700 text-sm">Once you delete your account, there is no going back. Please be certain.</p>
                </div>
                <button className="bg-white text-red-600 border border-red-200 px-6 py-3 rounded-xl font-bold hover:bg-red-600 hover:text-white transition">
                    Delete Account
                </button>
            </div>
        </div>
    );
};

export default Settings;
