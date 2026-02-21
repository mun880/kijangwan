import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { MapPin, Plus, Trash2, Edit2, Check, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const ManageRoutes = () => {
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [newRoute, setNewRoute] = useState({ start_point: '', end_point: '', distance: '' });

    useEffect(() => {
        fetchRoutes();
    }, []);

    const fetchRoutes = async () => {
        try {
            const response = await api.get('/routes/');
            setRoutes(response.data);
        } catch (error) {
            toast.error("Failed to fetch routes");
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/routes/', newRoute);
            setRoutes([...routes, response.data]);
            setNewRoute({ start_point: '', end_point: '', distance: '' });
            setIsCreating(false);
            toast.success("Route created successfully");
        } catch (error) {
            toast.error("Failed to create route");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this route?")) return;
        try {
            await api.delete(`/routes/${id}/`);
            setRoutes(routes.filter(r => r.id !== id));
            toast.success("Route deleted");
        } catch (error) {
            toast.error("Failed to delete route");
        }
    };

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-gray-900">Manage Routes</h2>
                <button
                    onClick={() => setIsCreating(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors"
                >
                    <Plus size={20} /> Add Route
                </button>
            </div>

            {isCreating && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-100 animate-in slide-in-from-top-4 duration-300">
                    <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Start Point</label>
                            <input
                                type="text"
                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={newRoute.start_point}
                                onChange={(e) => setNewRoute({ ...newRoute, start_point: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase block mb-1">End Point</label>
                            <input
                                type="text"
                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={newRoute.end_point}
                                onChange={(e) => setNewRoute({ ...newRoute, end_point: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Distance (km)</label>
                            <input
                                type="number"
                                step="0.1"
                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={newRoute.distance}
                                onChange={(e) => setNewRoute({ ...newRoute, distance: e.target.value })}
                                required
                            />
                        </div>
                        <div className="flex gap-2">
                            <button type="submit" className="flex-1 bg-green-600 text-white p-2 rounded-lg font-bold hover:bg-green-700"><Check size={20} className="mx-auto" /></button>
                            <button type="button" onClick={() => setIsCreating(false)} className="flex-1 bg-gray-100 text-gray-600 p-2 rounded-lg font-bold hover:bg-gray-200"><X size={20} className="mx-auto" /></button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs font-bold uppercase">
                        <tr>
                            <th className="px-6 py-4">Start Point</th>
                            <th className="px-6 py-4">End Point</th>
                            <th className="px-6 py-4">Distance</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {routes.map((route) => (
                            <tr key={route.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-800">{route.start_point}</td>
                                <td className="px-6 py-4 font-medium text-gray-800">{route.end_point}</td>
                                <td className="px-6 py-4 text-gray-600">{route.distance} km</td>
                                <td className="px-6 py-4 text-right flex justify-end gap-2">
                                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 size={18} /></button>
                                    <button onClick={() => handleDelete(route.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {routes.length === 0 && (
                    <div className="p-10 text-center text-gray-500">No routes defined yet.</div>
                )}
            </div>
        </div>
    );
};

export default ManageRoutes;
