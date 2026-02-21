import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Truck, Plus, Trash2, CheckCircle, XCircle, Loader2, Info, Bus } from 'lucide-react';
import toast from 'react-hot-toast';

const ManageVehicles = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [newVehicle, setNewVehicle] = useState({ plate_number: '', capacity: '', color: '', vehicle_type: 'Daladala' });

    useEffect(() => {
        fetchVehicles();
    }, []);

    const fetchVehicles = async () => {
        try {
            const response = await api.get('/vehicles/');
            setVehicles(response.data);
        } catch (error) {
            toast.error("Failed to fetch vehicles");
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/vehicles/', newVehicle);
            setVehicles([...vehicles, response.data]);
            setNewVehicle({ plate_number: '', capacity: '', color: '', vehicle_type: 'Daladala' });
            setIsAdding(false);
            toast.success("Vehicle added successfully");
        } catch (error) {
            toast.error(error.response?.data?.plate_number?.[0] || "Failed to add vehicle");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this vehicle?")) return;
        try {
            await api.delete(`/vehicles/${id}/`);
            setVehicles(vehicles.filter(v => v.id !== id));
            toast.success("Vehicle removed");
        } catch (error) {
            toast.error("Failed to remove vehicle");
        }
    };

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-gray-900">My Vehicles</h2>
                <button
                    onClick={() => setIsAdding(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition"
                >
                    <Plus size={20} /> Add Vehicle
                </button>
            </div>

            {isAdding && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-100 animate-in slide-in-from-top-4 duration-300">
                    <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Plate Number</label>
                            <input
                                type="text"
                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="E.g. T 123 ABC"
                                value={newVehicle.plate_number}
                                onChange={(e) => setNewVehicle({ ...newVehicle, plate_number: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Capacity</label>
                            <input
                                type="number"
                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Seats"
                                value={newVehicle.capacity}
                                onChange={(e) => setNewVehicle({ ...newVehicle, capacity: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Color</label>
                            <input
                                type="text"
                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="E.g. White/Blue"
                                value={newVehicle.color}
                                onChange={(e) => setNewVehicle({ ...newVehicle, color: e.target.value })}
                                required
                            />
                        </div>
                        <div className="flex gap-2">
                            <button type="submit" className="flex-1 bg-green-600 text-white p-2 rounded-lg font-bold hover:bg-green-700">Save</button>
                            <button type="button" onClick={() => setIsAdding(false)} className="flex-1 bg-gray-100 text-gray-600 p-2 rounded-lg font-bold hover:bg-gray-200">Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vehicles.map((vehicle) => (
                    <div key={vehicle.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative">
                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-slate-100 p-3 rounded-xl text-slate-600">
                                <Truck size={24} />
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${vehicle.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                }`}>
                                {vehicle.is_active ? 'Active' : 'Inactive'}
                            </span>
                        </div>

                        <h3 className="text-xl font-bold text-gray-900">{vehicle.plate_number}</h3>
                        <p className="text-gray-500 text-sm mb-4">{vehicle.vehicle_type} • {vehicle.capacity} Seats</p>

                        <div className="flex justify-between items-center border-t border-gray-50 pt-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: vehicle.color.toLowerCase() }}></div>
                                {vehicle.color}
                            </div>
                            <button
                                onClick={() => handleDelete(vehicle.id)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {vehicles.length === 0 && (
                <div className="bg-blue-50 p-10 rounded-3xl text-center border-2 border-dashed border-blue-200">
                    <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <Bus className="text-blue-600 shadow-xl" size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-blue-900 mb-2">No Vehicles Found</h3>
                    <p className="text-blue-700 max-w-xs mx-auto mb-6">You haven't added any vehicles to your profile yet. Click "Add Vehicle" to register your first daladala.</p>
                </div>
            )}
        </div>
    );
};

export default ManageVehicles;
