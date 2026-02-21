import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Users, Bus, Map, TrendingUp, MoreVertical, AlertTriangle, Loader2, Clock, Truck, MapPin } from 'lucide-react';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        total_users: 0,
        active_vehicles: 0,
        total_routes: 0,
        pending_drivers: 0
    });
    const [recentDrivers, setRecentDrivers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [statsRes, driversRes] = await Promise.all([
                api.get('/stats/'),
                api.get('/drivers/')
            ]);
            setStats(statsRes.data);
            setRecentDrivers(driversRes.data.slice(0, 5));
        } catch (error) {
            console.error("Failed to fetch dashboard data", error);
        } finally {
            setLoading(false);
        }
    };

    const statsConfig = [
        { label: 'Total Users', value: stats.total_users, icon: <Users size={24} />, color: 'text-blue-600', bg: 'bg-blue-100' },
        { label: 'Active Vehicles', value: stats.active_vehicles, icon: <Bus size={24} />, color: 'text-green-600', bg: 'bg-green-100' },
        { label: 'Total Routes', value: stats.total_routes, icon: <MapPin size={24} />, color: 'text-purple-600', bg: 'bg-purple-100' },
        { label: 'Pending Approvals', value: stats.pending_drivers, icon: <AlertTriangle size={24} />, color: 'text-orange-600', bg: 'bg-orange-100' },
    ];

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-900">System Overview</h2>

            {/* Analytics Rows */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {statsConfig.map((item, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`${item.bg} p-3 rounded-lg ${item.color}`}>
                                {item.icon}
                            </div>
                        </div>
                        <p className="text-gray-500 text-sm font-medium">{item.label}</p>
                        <h3 className="text-3xl font-bold text-gray-900 mt-1">{item.value}</h3>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Registrations Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-bold text-gray-900">Recent Driver Registrations</h3>
                        <button className="text-sm text-blue-600 font-semibold hover:underline">View All</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                                <tr>
                                    <th className="px-6 py-4 text-left">Name</th>
                                    <th className="px-6 py-4 text-left">License</th>
                                    <th className="px-6 py-4 text-left">Status</th>
                                    <th className="px-6 py-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {recentDrivers.map((driver) => (
                                    <tr key={driver.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center font-bold text-xs text-blue-600">
                                                    {driver.full_name?.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm text-gray-900">{driver.full_name}</p>
                                                    <p className="text-xs text-gray-500">{driver.user?.phone}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{driver.license_number}</td>
                                        <td className="px-6 py-4">
                                            <span className={`text-xs px-2 py-1 rounded-full font-bold ${driver.is_approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                {driver.is_approved ? 'Approved' : 'Pending'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-gray-400 hover:text-blue-600"><MoreVertical size={18} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* System Alerts */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                    <div className="p-6 border-b border-gray-100">
                        <h3 className="font-bold text-gray-900">System Alerts</h3>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="flex items-start gap-4 p-4 bg-red-50 rounded-xl border border-red-100">
                            <AlertTriangle className="text-red-500 shrink-0" size={20} />
                            <div>
                                <h4 className="text-red-800 font-bold text-sm">High Traffic Alert</h4>
                                <p className="text-red-600 text-sm mt-1">Unusual congestion reported on Darajani-Bububu route.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                            <TrendingUp className="text-blue-500 shrink-0" size={20} />
                            <div>
                                <h4 className="text-blue-800 font-bold text-sm">Peak Hours Approaching</h4>
                                <p className="text-blue-600 text-sm mt-1">Expected passenger surge around 16:00 - 18:00.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
