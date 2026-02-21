import React, { useState } from 'react';
import { Search, MapPin, Clock, ArrowRight, User } from 'lucide-react';

const PassengerDashboard = () => {
    const [startPoint, setStartPoint] = useState('');
    const [endPoint, setEndPoint] = useState('');

    const popularRoutes = [
        { id: 1, from: 'Darajani', to: 'Bububu', price: '500 TZS', time: '15 mins', status: 'Frequent' },
        { id: 2, from: 'Darajani', to: 'Chuokikuu', price: '700 TZS', time: '25 mins', status: 'Moderate' },
        { id: 3, from: 'Mwanakwerekwe', to: 'Posta', price: '400 TZS', time: '20 mins', status: 'Busy' },
    ];

    return (
        <div className="space-y-8">
            {/* Hero Search Section */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 py-12 opacity-10 pointer-events-none">
                    <MapPin size={300} />
                </div>

                <h2 className="text-4xl font-bold mb-4 relative z-10">Where to today?</h2>
                <p className="text-blue-100 mb-8 max-w-lg relative z-10 text-lg">
                    Find the fastest daladala routes across Zanzibar. Real-time schedules and reliable transport.
                </p>

                <div className="bg-white p-4 rounded-2xl shadow-xl flex flex-col md:flex-row gap-4 relative z-10 max-w-4xl">
                    <div className="flex-1 relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="From (e.g. Darajani)"
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 font-medium"
                            value={startPoint}
                            onChange={(e) => setStartPoint(e.target.value)}
                        />
                    </div>
                    <div className="flex-1 relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="To (e.g. Bububu)"
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 font-medium"
                            value={endPoint}
                            onChange={(e) => setEndPoint(e.target.value)}
                        />
                    </div>
                    <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-orange-500/30 flex items-center justify-center gap-2">
                        <Search size={20} /> Search
                    </button>
                </div>
            </div>

            {/* Popular Routes Grid */}
            <div>
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <Clock size={20} className="text-blue-600" /> Popular Routes
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {popularRoutes.map((route) => (
                        <div key={route.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="bg-blue-100 p-3 rounded-xl">
                                    <MapPin size={24} className="text-blue-600" />
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${route.status === 'Busy' ? 'bg-red-100 text-red-600' :
                                        route.status === 'Frequent' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                                    }`}>
                                    {route.status}
                                </span>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <p className="text-gray-400 text-xs uppercase font-bold tracking-wider">Route</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="font-bold text-gray-800">{route.from}</span>
                                        <ArrowRight size={16} className="text-gray-400" />
                                        <span className="font-bold text-gray-800">{route.to}</span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-end border-t border-gray-50 pt-4">
                                    <div>
                                        <p className="text-gray-400 text-xs">Fare</p>
                                        <p className="font-bold text-gray-800">{route.price}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-gray-400 text-xs">Avg. Time</p>
                                        <p className="font-bold text-gray-800">{route.time}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-800">Recent Bookings</h3>
                    <button className="text-blue-600 font-semibold hover:underline">View All</button>
                </div>
                <div className="text-center py-10 text-gray-400 bg-gray-50 rounded-xl border-dashed border-2 border-gray-200">
                    <p>No recent bookings found. Start your journey today!</p>
                </div>
            </div>
        </div>
    );
};

export default PassengerDashboard;
