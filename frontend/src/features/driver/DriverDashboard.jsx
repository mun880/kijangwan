import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Truck, Calendar, DollarSign, Star, Clock, MapPin, AlertCircle, Bus, BarChart2, Loader2 } from 'lucide-react';

const DriverDashboard = () => {
    const { user } = useAuth();
    const [statsData, setStatsData] = useState({
        total_trips: 0,
        active_vehicle: 'None',
        rating: 0,
        status: 'Loading...'
    });
    const [todaySchedule, setTodaySchedule] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDriverData();
    }, []);

    const fetchDriverData = async () => {
        try {
            const [statsRes, scheduleRes] = await Promise.all([
                api.get('/stats/'),
                api.get('/schedules/')
            ]);
            setStatsData(statsRes.data);
            setTodaySchedule(scheduleRes.data.slice(0, 3));
        } catch (error) {
            console.error("Failed to fetch driver data", error);
        } finally {
            setLoading(false);
        }
    };

    const statsConfig = [
        { label: 'Total Trips', value: statsData.total_trips, icon: <BarChart2 size={24} />, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Active Vehicle', value: statsData.active_vehicle, icon: <Bus size={24} />, color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: 'Rating', value: statsData.rating, icon: <Star size={24} />, color: 'text-yellow-500', bg: 'bg-yellow-50' },
        { label: 'Driver Status', value: statsData.status, icon: <Clock size={24} />, color: 'text-green-600', bg: 'bg-green-50' },
    ];

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
                    <p className="text-gray-500">Welcome back, {user?.username} 👋</p>
                </div>
                <button className="bg-black text-white px-6 py-2 rounded-xl font-medium hover:bg-gray-800 transition-colors">
                    View Reports
                </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {statsConfig.map((item, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className={`${item.bg} p-4 rounded-xl ${item.color}`}>
                            {item.icon}
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">{item.label}</p>
                            <p className="text-2xl font-bold text-gray-900">{item.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Upcoming Schedule */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-bold text-gray-900 text-lg">Today's Schedule</h3>
                        <span className="text-sm text-blue-600 font-medium cursor-pointer">View All</span>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {todaySchedule.map((item) => (
                                <div key={item.id} className="flex items-center p-4 border rounded-xl hover:bg-gray-50 transition-colors">
                                    <div className="bg-gray-100 p-3 rounded-lg mr-4 text-center min-w-[60px]">
                                        <span className="block font-bold text-gray-900">{item.arrival_start_time?.substring(0, 5)}</span>
                                        <span className="text-xs text-gray-500">SET</span>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-gray-900 flex items-center gap-2">
                                            {item.route_detail?.start_point} <span className="text-gray-400">→</span> {item.route_detail?.end_point}
                                        </h4>
                                        <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                                            <Truck size={14} /> Vehicle: {item.vehicle_detail?.plate_number}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span className={`text-xs px-3 py-1 rounded-full font-bold ${item.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                            {item.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {todaySchedule.length === 0 && (
                                <div className="text-center py-6 text-gray-400">
                                    <p>No more trips scheduled for today.</p>
                                    <button className="mt-2 text-blue-600 text-sm font-medium">+ Add Trip</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Vehicle Status */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 h-fit">
                    <div className="p-6 border-b border-gray-100">
                        <h3 className="font-bold text-gray-900 text-lg">Vehicle Status</h3>
                    </div>
                    <div className="p-6 text-center">
                        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-green-100">
                            <Truck size={40} className="text-green-600" />
                        </div>
                        <h4 className="text-xl font-bold text-gray-800">T 567 DFG</h4>
                        <p className="text-gray-500 mb-6">Toyota Coaster (25 Seats)</p>

                        <div className="space-y-3">
                            <div className="flex justify-between text-sm py-2 border-b border-gray-50">
                                <span className="text-gray-500">Status</span>
                                <span className="text-green-600 font-bold flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Active</span>
                            </div>
                            <div className="flex justify-between text-sm py-2 border-b border-gray-50">
                                <span className="text-gray-500">Next Service</span>
                                <span className="text-gray-900 font-medium">12 Oct 2026</span>
                            </div>
                            <div className="flex justify-between text-sm py-2">
                                <span className="text-gray-500">Insurance</span>
                                <span className="text-gray-900 font-medium">Valid</span>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
                        <button className="text-sm font-bold text-gray-700 hover:text-black">Manage Vehicle</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DriverDashboard;
