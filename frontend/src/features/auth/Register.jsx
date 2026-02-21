import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Phone, Lock, FileText, CreditCard, ArrowRight, UserPlus } from 'lucide-react';

const Register = () => {
    const [role, setRole] = useState('PASSENGER');
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        phone: '',
        full_name: '',
        national_id: '',
        license_number: ''
    });

    const { register } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const success = await register(role, formData);
        setIsLoading(false);
        if (success) {
            navigate('/login');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-10 px-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col md:flex-row">

                {/* Left Side (Banner) */}
                <div className="bg-blue-600 p-8 md:w-1/3 flex flex-col justify-between text-white">
                    <div>
                        <h2 className="text-3xl font-bold mb-4">Join Us!</h2>
                        <p className="opacity-90">Start your journey with Kijangwani Transport System today.</p>
                    </div>
                    <div className="hidden md:block">
                        <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm">
                            <p className="text-sm font-medium">"Reliable transport for everyone in Zanzibar."</p>
                        </div>
                    </div>
                </div>

                {/* Right Side (Form) */}
                <div className="p-8 md:w-2/3">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">Create Account</h3>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">I am registering as a...</label>
                            <div className="flex gap-4">
                                <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${role === 'PASSENGER' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-blue-200'}`}>
                                    <input
                                        type="radio"
                                        name="role"
                                        value="PASSENGER"
                                        checked={role === 'PASSENGER'}
                                        onChange={(e) => setRole(e.target.value)}
                                        className="hidden"
                                    />
                                    <User size={18} />
                                    <span className="font-semibold">Passenger</span>
                                </label>
                                <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${role === 'DRIVER' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-blue-200'}`}>
                                    <input
                                        type="radio"
                                        name="role"
                                        value="DRIVER"
                                        checked={role === 'DRIVER'}
                                        onChange={(e) => setRole(e.target.value)}
                                        className="hidden"
                                    />
                                    <CreditCard size={18} />
                                    <span className="font-semibold">Driver</span>
                                </label>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs text-gray-500 uppercase font-semibold">Username</label>
                                    <input name="username" onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 uppercase font-semibold">Full Name</label>
                                    <input name="full_name" onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 uppercase font-semibold">Email</label>
                                    <input name="email" type="email" onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs text-gray-500 uppercase font-semibold">Phone</label>
                                    <input name="phone" onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 uppercase font-semibold">Password</label>
                                    <input name="password" type="password" onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
                                </div>
                            </div>
                        </div>

                        {role === 'DRIVER' && (
                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                                <h4 className="font-semibold text-blue-800 flex items-center gap-2">
                                    <FileText size={16} /> Driver Details
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs text-blue-600 uppercase font-semibold">National ID</label>
                                        <input name="national_id" onChange={handleChange} className="w-full p-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
                                    </div>
                                    <div>
                                        <label className="text-xs text-blue-600 uppercase font-semibold">License Number</label>
                                        <input name="license_number" onChange={handleChange} className="w-full p-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
                                    </div>
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gray-900 text-white p-3 rounded-xl hover:bg-black transition-colors flex items-center justify-center gap-2 font-semibold disabled:opacity-70"
                        >
                            {isLoading ? 'Creating Account...' : (
                                <> Create Account <ArrowRight size={18} /> </>
                            )}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-gray-500">
                        Already have an account? <Link to="/login" className="text-blue-600 font-semibold hover:underline">Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
