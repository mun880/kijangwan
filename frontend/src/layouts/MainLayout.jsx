import React from 'react';
import Sidebar from '../components/Sidebar';

const MainLayout = ({ children }) => {
    return (
        <div className="flex bg-slate-50 min-h-screen font-sans">
            <Sidebar />
            <div className="flex-1 ml-72">
                <main className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
