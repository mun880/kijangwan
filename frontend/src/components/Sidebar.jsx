import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Home, Bus, Calendar, Users, Settings, LogOut, MapPin, BarChart3, ChevronRight, History
} from 'lucide-react';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const getLinks = () => {
        switch (user?.role) {
            case 'DRIVER':
                return [
                    { name: 'Dashboard', path: '/driver/dashboard', icon: <Home size={20} /> },
                    { name: 'My Vehicle', path: '/driver/vehicle', icon: <Bus size={20} /> },
                    { name: 'My Schedule', path: '/driver/schedule', icon: <Calendar size={20} /> },
                    { name: 'Settings', path: '/driver/settings', icon: <Settings size={20} /> },
                ];
            case 'PASSENGER':
                return [
                    { name: 'Find Routes', path: '/passenger/dashboard', icon: <MapPin size={20} /> },
                    { name: 'My Bookings', path: '/passenger/bookings', icon: <Bus size={20} /> },
                    { name: 'Settings', path: '/passenger/settings', icon: <Settings size={20} /> },
                ];
            case 'ADMIN':
                return [
                    { name: 'Overview', path: '/admin/dashboard', icon: <BarChart3 size={20} /> },
                    { name: 'Drivers', path: '/admin/drivers', icon: <Users size={20} /> },
                    { name: 'Routes', path: '/admin/routes', icon: <MapPin size={20} /> },
                    { name: 'Vehicles', path: '/admin/vehicles', icon: <Bus size={20} /> },
                    { name: 'System Logs', path: '/admin/logs', icon: <History size={20} /> },
                    { name: 'Settings', path: '/admin/settings', icon: <Settings size={20} /> },
                ];
            default:
                return [];
        }
    };

    return (
        <div className="bg-slate-900 w-72 h-screen fixed left-0 top-0 text-white flex flex-col shadow-2xl z-50">
            {/* Header */}
            <div className="p-6 border-b border-slate-700/50 bg-slate-950">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-600 p-2 rounded-lg">
                        <Bus size={24} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight">Kijangwani</h1>
                        <p className="text-xs text-slate-400 font-medium">Transport System</p>
                    </div>
                </div>
            </div>

            {/* User Profile Snippet */}
            <div className="px-6 py-6">
                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center font-bold text-sm">
                        {user?.username?.charAt(0).toUpperCase()}
                    </div>
                    <div className="overflow-hidden">
                        <p className="font-medium text-sm truncate">{user?.username}</p>
                        <p className="text-xs text-blue-400 capitalize">{user?.role?.toLowerCase()}</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
                {getLinks().map((link) => {
                    const isActive = location.pathname === link.path;
                    return (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`flex items-center justify-between p-3 rounded-xl transition-all duration-200 group ${isActive
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                {link.icon}
                                <span className="font-medium text-sm">{link.name}</span>
                            </div>
                            {isActive && <ChevronRight size={16} className="text-blue-200" />}
                        </Link>
                    )
                })}
            </nav>

            {/* Footer / Logout */}
            <div className="p-4 border-t border-slate-800 bg-slate-950">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 p-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl w-full transition-all duration-200 font-medium text-sm"
                >
                    <LogOut size={18} />
                    <span>Sign Out</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
