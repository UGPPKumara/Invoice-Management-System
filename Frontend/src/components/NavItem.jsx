// src/components/NavItem.jsx

import React from 'react';

const NavItem = ({ icon: Icon, label, view, currentView, setCurrentView, setIsSidebarOpen }) => {
    const isActive = currentView === view;
    return (
        <button
            onClick={() => {
                setCurrentView(view);
                setIsSidebarOpen(false);
            }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition duration-150 text-left
                ${isActive 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'text-blue-200 hover:bg-blue-700 hover:text-white'
                }`}
        >
            <Icon size={20} className="flex-shrink-0" />
            <span className="truncate">{label}</span>
        </button>
    );
};

export default NavItem;