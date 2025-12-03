// src/components/MobileHeader.jsx

import React from 'react';
import { Menu } from 'lucide-react';

const MobileHeader = ({ setIsSidebarOpen }) => (
    <header className="md:hidden w-full bg-white shadow-md border-b sticky top-0 z-30 p-4 flex justify-between items-center print:hidden">
        <h1 className="text-xl font-bold text-blue-800">Admin Panel</h1>
        <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-gray-700 rounded-lg hover:bg-gray-100">
            <Menu size={24} />
        </button>
    </header>
);

export default MobileHeader;