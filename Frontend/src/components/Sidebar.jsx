// src/components/Sidebar.jsx

import React, { useState } from 'react';
import { LogOut, Settings, FileText, Globe, Smartphone, Feather, Code, X, ChevronDown, ChevronRight, Briefcase } from 'lucide-react';
import NavItem from './NavItem';

export const getServiceIcon = (category) => {
    switch (category) {
        case 'WordPress': return Code;
        case 'Websites': return Globe;
        case 'MobileApps': return Smartphone;
        case 'UIUX': return Feather;
        default: return Settings;
    }
};

const SubNavItem = ({ category, currentView, setCurrentView, setIsSidebarOpen }) => {
    const isActive = currentView === category;
    const Icon = getServiceIcon(category);

    return (
        <button
            onClick={() => {
                setCurrentView(category);
                setIsSidebarOpen(false);
            }}
            className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg font-medium transition duration-150 text-left text-sm
                ${isActive 
                    ? 'bg-blue-700 text-white shadow-inner' 
                    : 'text-blue-300 hover:bg-blue-700 hover:text-white'
                }`}
        >
            <Icon size={16} className="flex-shrink-0" />
            <span className="truncate">{category} Packages</span>
        </button>
    );
};


const Sidebar = ({ services, currentView, setCurrentView, setIsSidebarOpen, isSidebarOpen, handleLogout, invoiceItemCount }) => {
    const [isServicesOpen, setIsServicesOpen] = useState(true);
    const serviceCategories = Object.keys(services);

    return (
        <nav className={`fixed inset-y-0 left-0 z-40 w-64 bg-blue-800 text-white flex flex-col transition-transform duration-300 ease-in-out print:hidden 
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 md:flex-shrink-0`}>
            
            {/* Logo/Header */}
            <div className="p-6 border-b border-blue-700 flex justify-between items-center">
                <h1 className="text-2xl font-extrabold flex items-center">
                    <Code size={24} className="mr-2 text-blue-300" /> Admin
                </h1>
                <button className="md:hidden p-1 rounded-full hover:bg-blue-700" onClick={() => setIsSidebarOpen(false)}>
                    <X size={24} />
                </button>
            </div>

            {/* Main Navigation */}
            <div className="flex-grow p-4 space-y-2 overflow-y-auto">
                
                {/* Company Profile Item */}
                <NavItem
                    icon={Briefcase}
                    label="Company Profile"
                    view="profile"
                    currentView={currentView}
                    setCurrentView={setCurrentView}
                    setIsSidebarOpen={setIsSidebarOpen}
                />

                {/* Manage Services Main Item */}
                <button
                    onClick={() => setIsServicesOpen(!isServicesOpen)}
                    className={`w-full flex items-center justify-between space-x-3 px-4 py-3 rounded-lg font-medium transition duration-150 text-left ${
                        serviceCategories.includes(currentView)
                        ? 'bg-blue-600 text-white shadow-lg' 
                        : 'text-blue-200 hover:bg-blue-700 hover:text-white'
                    }`}
                >
                    <span className="flex items-center space-x-3">
                        <Settings size={20} className="flex-shrink-0" />
                        <span className="truncate">Manage Services</span>
                    </span>
                    {isServicesOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                </button>

                {/* Service Sub-Navigation */}
                {isServicesOpen && (
                    <div className="pl-4 space-y-1">
                        {serviceCategories.map(category => (
                            <SubNavItem
                                key={category}
                                category={category}
                                currentView={currentView}
                                setCurrentView={setCurrentView}
                                setIsSidebarOpen={setIsSidebarOpen}
                            />
                        ))}
                    </div>
                )}
                
                {/* Invoice Generator Item */}
                <NavItem
                    icon={FileText}
                    label={`Generate Invoice (${invoiceItemCount})`}
                    view="invoice"
                    currentView={currentView}
                    setCurrentView={setCurrentView}
                    setIsSidebarOpen={setIsSidebarOpen}
                />

            </div>

            {/* Logout Button */}
            <div className="p-4 border-t border-blue-700">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center space-x-3 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition shadow-md"
                >
                    <LogOut size={18} />
                    <span>Logout</span>
                </button>
            </div>
        </nav>
    );
};

export default Sidebar;