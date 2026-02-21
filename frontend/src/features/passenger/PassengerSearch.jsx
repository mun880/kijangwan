import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Search, MapPin, Clock, Truck, ChevronRight, Loader2, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

const PassengerSearch = () => {
    const [schedules, setSchedules] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searching, setSearching] = useState(false);

    const [searchParams, setSearchParams] = useState({
        start_point: '',
        end_point: ''
    });

    useEffect(() => {
        fetchRoutes();
        fetchAllSchedules();
    }, []);

    const fetchRoutes = async () => {
        try {
            const response = await api.get('/routes/');
            setRoutes(response.data);
        } catch (error) {
            console.error("Failed to fetch routes");
        }
    };

    const fetchAllSchedules = async () => {
        setLoading(true);
        try {
            const response = await api.get('/schedules/');
            setSchedules(response.data);
        } catch (error) {
            toast.error("Failed to fetch schedules");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        setSearching(true);
        try {
            // Backend filtering logic if supported, or frontend filtering
            const response = await api.get('/schedules/');
            let filtered = response.data;
            if (searchParams.start_point) {
                filtered = filtered.filter(s => s.route_detail?.start_point.toLowerCase().includes(searchParams.start_point.toLowerCase()));
            }
            if (searchParams.end_point) {
                filtered = filtered.filter(s => s.route_detail?.end_point.toLowerCase().includes(searchParams.end_point.toLowerCase()));
            }
            setSchedules(filtered);
        } catch (error) {
            toast.error("Search failed");
        } finally {
            setSearching(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Search Hero */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Search className="text-blue-600" size={24} /> Find Your Daladala
                </h2>
                <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                    <div className="relative">
                        <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">From</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="E.g. Darajani"
                                value={searchParams.start_point}
                                onChange={(e) => setSearchParams({ ...searchParams, start_point: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="relative">
                        <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">To</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="E.g. Bububu"
                                value={searchParams.end_point}
                                onChange={(e) => setSearchParams({ ...searchParams, end_point: e.target.value })}
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={searching}
                        className="bg-blue-600 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition shadow-lg shadow-blue-100 disabled:opacity-70"
                    >
                        {searching ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
                        Search Schedules
                    </button>
                </form>
            </div>

            {/* Results Grid */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-800">{schedules.length} Vehicles Available</h3>
                    <button onClick={fetchAllSchedules} className="text-sm text-blue-600 font-semibold hover:underline">Clear Filters</button>
                </div>

                {loading ? (
                    <div className="flex justify-center p-20"><Loader2 className="animate-spin text-blue-600" size={40} /></div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {schedules.map((item) => (
                            <div key={item.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all group">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="bg-blue-50 p-3 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                        <Truck size={24} />
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-400 font-bold uppercase">Time Window</p>
                                        <p className="font-bold text-gray-900">{item.arrival_start_time?.substring(0, 5)} - {item.arrival_end_time?.substring(0, 5)}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="relative">
                                        <div className="absolute left-[7px] top-[14px] bottom-[14px] w-[2px] bg-slate-100"></div>
                                        <div className="flex items-center gap-3 relative">
                                            <div className="w-4 h-4 rounded-full bg-blue-500 ring-4 ring-blue-50"></div>
                                            <span className="font-bold text-gray-800">{item.route_detail?.start_point}</span>
                                        </div>
                                        <div className="flex items-center gap-3 relative mt-4">
                                            <div className="w-4 h-4 rounded-full bg-slate-300 ring-4 ring-slate-50"></div>
                                            <span className="font-bold text-gray-800">{item.route_detail?.end_point}</span>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
                                        <div>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase">Vehicle</p>
                                            <p className="text-sm font-bold text-gray-900">{item.vehicle_detail?.plate_number}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] text-gray-400 font-bold uppercase">Days</p>
                                            <p className="text-xs font-medium text-blue-600">
                                                {Array.isArray(item.days_of_week)
                                                    ? item.days_of_week.slice(0, 3).join(', ')
                                                    : item.days_of_week?.split(',').slice(0, 3).join(', ')}...
                                            </p>
                                        </div>
                                    </div>

                                    <button className="w-full bg-slate-900 text-white p-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-colors opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 duration-200">
                                        View Details <ChevronRight size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && schedules.length === 0 && (
                    <div className="p-20 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                        <MapPin className="mx-auto text-gray-300 mb-4" size={48} />
                        <h3 className="text-xl font-bold text-gray-800">No schedules found</h3>
                        <p className="text-gray-500">Try searching for a different route or check back later.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PassengerSearch;
