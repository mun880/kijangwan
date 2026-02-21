import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { History, User, Activity, Clock, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const ManageLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const response = await api.get('/logs/');
            setLogs(response.data);
        } catch (error) {
            toast.error("Failed to load system logs");
        } finally {
            setLoading(false);
        }
    };

    const getActionColor = (action) => {
        switch (action) {
            case 'CREATE': return 'bg-green-100 text-green-700';
            case 'DELETE': return 'bg-red-100 text-red-700';
            case 'APPROVAL': return 'bg-blue-100 text-blue-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                    <History className="text-blue-600" /> System Activity
                </h2>
                <button
                    onClick={fetchLogs}
                    className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-blue-600 transition-colors"
                >
                    <RefreshCw size={16} /> Refresh
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                            <tr>
                                <th className="px-6 py-4 text-left">User</th>
                                <th className="px-6 py-4 text-left">Action</th>
                                <th className="px-6 py-4 text-left">Resource</th>
                                <th className="px-6 py-4 text-left">Details</th>
                                <th className="px-6 py-4 text-right">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {logs.map((log) => (
                                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                                                <User size={14} className="text-slate-500" />
                                            </div>
                                            <span className="font-bold text-sm text-gray-900">{log.username || 'System'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${getActionColor(log.action)}`}>
                                            {log.action}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-semibold text-gray-700">
                                        {log.resource}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                                        {log.details}
                                    </td>
                                    <td className="px-6 py-4 text-right text-xs text-gray-400 font-medium">
                                        {new Date(log.timestamp).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {logs.length === 0 && (
                    <div className="p-20 text-center">
                        <Activity className="mx-auto text-gray-200 mb-4" size={48} />
                        <p className="text-gray-500">No system events recorded yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageLogs;
