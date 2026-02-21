import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Truck, Search, Loader2, MoreVertical, Filter, User } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminManageVehicles = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchVehicles();
    }, []);

    const fetchVehicles = async () => {
        try {
            const response = await api.get('/vehicles/');
            setVehicles(response.data);
        } catch (error) {
            toast.error("Failed to load vehicles");
        } finally {
            setLoading(false);
        }
    };

    const filteredVehicles = vehicles.filter(v =>
        v.plate_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.driver_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Terminal Vehicles</h2>
                    <p className="text-gray-500">Manage and monitor all daladalas in the system</p>
                </div>

                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search plate or driver..."
                            className="pl-10 pr-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="p-2 border rounded-xl hover:bg-gray-50"><Filter size={20} /></button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVehicles.map((vehicle) => (
                    <div key={vehicle.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-200 transition-colors">
                        <div className="flex justify-between items-start mb-6">
                            <div className="bg-slate-100 p-4 rounded-2xl text-slate-700">
                                <Truck size={32} />
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full font-bold ${vehicle.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {vehicle.is_active ? 'Active' : 'Inactive'}
                            </span>
                        </div>

                        <h3 className="text-2xl font-bold text-gray-900 mb-1">{vehicle.plate_number}</h3>
                        <p className="text-gray-500 text-sm font-medium mb-6">{vehicle.vehicle_type} • {vehicle.capacity} Seats</p>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                                    {vehicle.driver_name?.substring(0, 2).toUpperCase()}
                                </div>
                                <span className="text-sm font-bold text-gray-700">{vehicle.driver_name}</span>
                            </div>
                            <button className="text-gray-400 hover:text-blue-600">
                                <MoreVertical size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {filteredVehicles.length === 0 && (
                <div className="bg-gray-50 rounded-3xl p-20 text-center border-2 border-dashed">
                    <Truck className="mx-auto text-gray-200 mb-4" size={48} />
                    <p className="text-gray-500">No vehicles matching your search found.</p>
                </div>
            )}
        </div>
    );
};

export default AdminManageVehicles;
