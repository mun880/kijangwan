import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Bus, User, Lock, ArrowRight } from 'lucide-react';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const user = await login({ username, password });
        setIsLoading(false);

        if (user) {
            if (user.role === 'DRIVER') navigate('/driver/dashboard');
            else if (user.role === 'ADMIN') navigate('/admin/dashboard');
            else navigate('/passenger/dashboard');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-900 px-4">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-2xl w-full max-w-md text-white">
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-white/20 p-4 rounded-full mb-4 ring-4 ring-white/10">
                        <Bus size={40} className="text-white" />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight">Welcome Back</h2>
                    <p className="text-blue-100 mt-2">Sign in to Kijangwani TMS</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-blue-100 mb-2">Username</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User size={18} className="text-blue-200" />
                            </div>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-white placeholder-blue-200 transition-all"
                                placeholder="Enter your username"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-blue-100 mb-2">Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock size={18} className="text-blue-200" />
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-white placeholder-blue-200 transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-400 text-white py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-blue-500/30 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Signing In...' : 'Sign In'}
                        {!isLoading && <ArrowRight size={18} />}
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-blue-100">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-white font-semibold hover:text-blue-200 underline decoration-2 underline-offset-4 transition-colors">
                        Create Account
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
