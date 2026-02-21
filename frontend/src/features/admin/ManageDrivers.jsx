import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Users, CheckCircle, XCircle, Loader2, Mail, Phone, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

const ManageDrivers = () => {
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDrivers();
    }, []);

    const fetchDrivers = async () => {
        try {
            const response = await api.get('/drivers/');
            setDrivers(response.data);
        } catch (error) {
            toast.error("Failed to fetch drivers");
        } finally {
            setLoading(false);
        }
    };

    const handleApproval = async (id, approve) => {
        const action = approve ? 'approve' : 'reject';
        if (!window.confirm(`Are you sure you want to ${action} this driver?`)) return;

        try {
            // We need an endpoint for this. I'll use a custom action on the ViewSet if I defined it, 
            // or I'll just update the driver profile.
            // Let's assume we can patch the DriverProfile.
            await api.patch(`/drivers/${id}/`, { is_approved: approve });
            setDrivers(drivers.map(d => d.id === id ? { ...d, is_approved: approve } : d));
            toast.success(`Driver ${approve ? 'approved' : 'rejected'}`);
        } catch (error) {
            toast.error(`Failed to ${action} driver`);
        }
    };

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Driver Management</h2>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs font-bold uppercase">
                        <tr>
                            <th className="px-6 py-4">Driver Details</th>
                            <th className="px-6 py-4">Documents</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {drivers.map((driver) => (
                            <tr key={driver.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
                                            {driver.user.username.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{driver.full_name}</p>
                                            <div className="flex flex-col text-xs text-gray-500">
                                                <span className="flex items-center gap-1"><Mail size={12} /> {driver.user.email}</span>
                                                <span className="flex items-center gap-1"><Phone size={12} /> {driver.user.phone}</span>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="space-y-1 text-sm text-gray-600">
                                        <p className="flex items-center gap-1 font-medium"><FileText size={14} className="text-gray-400" /> ID: {driver.national_id}</p>
                                        <p className="flex items-center gap-1 font-medium"><FileText size={14} className="text-gray-400" /> License: {driver.license_number}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${driver.is_approved
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {driver.is_approved ? 'Approved' : 'Pending'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    {!driver.is_approved ? (
                                        <button
                                            onClick={() => handleApproval(driver.id, true)}
                                            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 flex items-center gap-1 ml-auto"
                                        >
                                            <CheckCircle size={16} /> Approve
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleApproval(driver.id, false)}
                                            className="text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg text-sm font-bold border border-red-100 inline-flex items-center gap-1"
                                        >
                                            <XCircle size={16} /> Revoke
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {drivers.length === 0 && (
                    <div className="p-10 text-center text-gray-500">No drivers registered yet.</div>
                )}
            </div>
        </div>
    );
};

export default ManageDrivers;
