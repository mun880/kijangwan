import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Calendar, Plus, Trash2, Clock, MapPin, Truck, Loader2, Info } from 'lucide-react';
import toast from 'react-hot-toast';

const ManageSchedules = () => {
    const [schedules, setSchedules] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);

    const [newSchedule, setNewSchedule] = useState({
        vehicle: '',
        route: '',
        arrival_start_time: '',
        arrival_end_time: '',
        days_of_week: 'Mon,Tue,Wed,Thu,Fri',
        is_active: true
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [schedRes, vehRes, routeRes] = await Promise.all([
                api.get('/schedules/'),
                api.get('/vehicles/'),
                api.get('/routes/')
            ]);
            setSchedules(schedRes.data);
            setVehicles(vehRes.data);
            setRoutes(routeRes.data);
        } catch (error) {
            toast.error("Failed to fetch schedule data");
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/schedules/', newSchedule);
            // Refresh list to get nested vehicle/route data if backend returns IDs
            fetchData();
            setIsAdding(false);
            setNewSchedule({
                vehicle: '',
                route: '',
                arrival_start_time: '',
                arrival_end_time: '',
                days_of_week: 'Mon,Tue,Wed,Thu,Fri',
                is_active: true
            });
            toast.success("Schedule added");
        } catch (error) {
            toast.error("Failed to add schedule");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this schedule?")) return;
        try {
            await api.delete(`/schedules/${id}/`);
            setSchedules(schedules.filter(s => s.id !== id));
            toast.success("Schedule removed");
        } catch (error) {
            toast.error("Failed to delete schedule");
        }
    };

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-gray-900">My Schedule</h2>
                <button
                    onClick={() => setIsAdding(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition"
                >
                    <Plus size={20} /> Add Timetable
                </button>
            </div>

            {isAdding && (
                <div className="bg-white p-8 rounded-2xl shadow-xl border border-blue-50 border-t-4 border-t-blue-600 animate-in slide-in-from-top-4 duration-300">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <Clock className="text-blue-600" size={20} /> Set New Timetable
                    </h3>
                    <form onSubmit={handleAdd} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Select Vehicle</label>
                                <select
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={newSchedule.vehicle}
                                    onChange={(e) => setNewSchedule({ ...newSchedule, vehicle: e.target.value })}
                                    required
                                >
                                    <option value="">Choose Vehicle</option>
                                    {vehicles.map(v => (
                                        <option key={v.id} value={v.id}>{v.plate_number} ({v.capacity} Seats)</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Select Route</label>
                                <select
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={newSchedule.route}
                                    onChange={(e) => setNewSchedule({ ...newSchedule, route: e.target.value })}
                                    required
                                >
                                    <option value="">Choose Route</option>
                                    {routes.map(r => (
                                        <option key={r.id} value={r.id}>{r.start_point} → {r.end_point}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Arrival Start</label>
                                <input
                                    type="time"
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={newSchedule.arrival_start_time}
                                    onChange={(e) => setNewSchedule({ ...newSchedule, arrival_start_time: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Arrival End</label>
                                <input
                                    type="time"
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={newSchedule.arrival_end_time}
                                    onChange={(e) => setNewSchedule({ ...newSchedule, arrival_end_time: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase block mb-3">Operating Days</label>
                                <div className="flex flex-wrap gap-2">
                                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => {
                                        const days = newSchedule.days_of_week.split(',');
                                        const isSelected = days.includes(day);
                                        return (
                                            <button
                                                key={day}
                                                type="button"
                                                onClick={() => {
                                                    let newDays = isSelected
                                                        ? days.filter(d => d !== day)
                                                        : [...days, day];
                                                    // Filter out empty strings and join
                                                    setNewSchedule({ ...newSchedule, days_of_week: newDays.filter(d => d).join(',') });
                                                }}
                                                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${isSelected
                                                        ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100'
                                                        : 'bg-white text-gray-400 border-gray-100 hover:border-blue-200'
                                                    }`}
                                            >
                                                {day}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button type="submit" className="flex-1 bg-blue-600 text-white p-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200">Save Timetable</button>
                            <button type="button" onClick={() => setIsAdding(false)} className="flex-1 bg-gray-100 text-gray-600 p-3 rounded-xl font-bold hover:bg-gray-200 transition">Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 gap-4">
                {schedules.map((schedule) => (
                    <div key={schedule.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-blue-200 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="bg-blue-50 p-4 rounded-xl text-blue-600">
                                <Clock size={24} />
                            </div>
                            <div>
                                <p className="text-xs text-blue-600 font-bold uppercase tracking-wider">Time Window</p>
                                <h3 className="text-xl font-bold text-gray-900">
                                    {schedule.arrival_start_time?.substring(0, 5)} - {schedule.arrival_end_time?.substring(0, 5)}
                                </h3>
                                <p className="text-sm text-gray-500 font-medium">
                                    {Array.isArray(schedule.days_of_week) ? schedule.days_of_week.join(', ') : schedule.days_of_week}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-8 flex-1 max-w-xl">
                            <div className="flex-1">
                                <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Route</p>
                                <div className="flex items-center gap-2 font-bold text-gray-800">
                                    <MapPin size={14} className="text-gray-400" />
                                    <span>{schedule.route_detail?.start_point}</span>
                                    <span className="text-gray-300">→</span>
                                    <span>{schedule.route_detail?.end_point}</span>
                                </div>
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Vehicle</p>
                                <div className="flex items-center gap-2 font-bold text-gray-800">
                                    <Truck size={14} className="text-gray-400" />
                                    <span>{schedule.vehicle_detail?.plate_number}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Info size={20} /></button>
                            <button onClick={() => handleDelete(schedule.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={20} /></button>
                        </div>
                    </div>
                ))}
            </div>

            {schedules.length === 0 && (
                <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                    <Calendar className="mx-auto text-gray-300 mb-4" size={48} />
                    <h3 className="text-xl font-bold text-gray-800">No active schedules</h3>
                    <p className="text-gray-500">Pick a vehicle and route to start appearing on terminal boards.</p>
                </div>
            )}
        </div>
    );
};

export default ManageSchedules;
