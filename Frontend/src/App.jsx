import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Trash2, Printer, Save, LogIn, LogOut, CheckCircle, XCircle, Settings, FileText, Globe, Smartphone, Feather, Code, Menu, X, DollarSign, RotateCcw, ChevronDown, ChevronRight } from 'lucide-react';

// --- CONSTANTS ---
const COMPANY_NAME = "NUVOORA IT SOLUTIONS";
const COMPANY_CONTACT = "Mail: info@nuvoora.com | Mobile: +94 75 5111 360 | www.nuvoora.com";

// Hardcoded Admin Credentials
const ADMIN_EMAIL = "admin@nuvoora.com";
const ADMIN_PASSWORD = "password";

// Initial Dummy Data for Service Management
const INITIAL_SERVICES = {
    WordPress: [
        { id: 'wp-basic', name: 'Basic', description: 'Ideal for small businesses & startups.', rate: 15000, details: ['1 Landing page with 6 sections', 'Responsive Design', 'Basic SEO', '1 Revision'] },
        { id: 'wp-standard', name: 'Standard', description: 'Best for businesses needing a complete WordPress solution.', rate: 25000, details: ['Up to 5 pages', 'Custom Theme & Plugins', 'Speed Optimization', '1 Revision'] },
        { id: 'wp-premium', name: 'Premium', description: 'Perfect for businesses requiring advanced functionality.', rate: 60000, details: ['6-10 pages', 'E-Commerce Setup', 'Security Optimization', '2 Revisions'] },
    ],
    Websites: [
        { id: 'web-small', name: 'Small Business Site', description: 'Static marketing site (up to 5 pages).', rate: 45000, details: ['Tailwind CSS', 'Fast Hosting Setup', 'Basic Contact Form'] },
    ],
    MobileApps: [
        { id: 'app-mvp', name: 'Mobile App MVP', description: 'Cross-platform minimal viable product.', rate: 120000, details: ['React Native or Flutter', '3 Core Screens', 'Basic Authentication'] },
    ],
    UIUX: [
        { id: 'ui-wire', name: 'Wireframing & Prototyping', description: 'Figma wireframes and interactive prototype.', rate: 30000, details: ['5 Page Screens', 'Design System Basic', 'User Flow Documentation'] },
    ],
};

// --- UTILITY COMPONENTS ---

/**
 * Custom Input Field for better UX
 */
const InvoiceInput = ({ value, onChange, placeholder, className = "", type = "text", min = 0 }) => (
    <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        min={min}
        className={`w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ${className}`}
    />
);

/**
 * Currency Formatter for LKR
 */
const formatCurrency = (amount) => {
    return `LKR ${Number(amount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
};

// --- CORE APP COMPONENT ---

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentView, setCurrentView] = useState('WordPress'); // Default view is now a service category
    const [services, setServices] = useState(INITIAL_SERVICES);
    const [taxRate, setTaxRate] = useState(0.15); // Default 15% Tax Rate
    const [invoiceItems, setInvoiceItems] = useState([]);
    const [invoiceHeader, setInvoiceHeader] = useState({
        clientName: '',
        clientAddress: '',
        invoiceNumber: 'INV-' + Math.floor(Math.random() * 100000),
        date: new Date().toLocaleDateString(),
    });
    const [statusMessage, setStatusMessage] = useState({ type: null, text: '' });
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // For mobile menu

    // --- Local Storage Persistence (Effect 1) ---
    useEffect(() => {
        // Load data from localStorage on initial mount
        const savedServices = localStorage.getItem('nuvooraServices');
        const savedTaxRate = localStorage.getItem('nuvooraTaxRate');

        if (savedServices) {
            setServices(JSON.parse(savedServices));
        }
        if (savedTaxRate) {
            setTaxRate(parseFloat(savedTaxRate));
        }
    }, []);

    // --- Local Storage Persistence (Effect 2: Save on change) ---
    useEffect(() => {
        localStorage.setItem('nuvooraServices', JSON.stringify(services));
    }, [services]);

    useEffect(() => {
        localStorage.setItem('nuvooraTaxRate', taxRate);
    }, [taxRate]);

    // --- Authentication Logic ---

    const handleLogin = (email, password) => {
        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
            setIsAuthenticated(true);
            setCurrentView('WordPress'); // Set to first service category
            showStatus('success', 'Login successful! Welcome Admin.');
        } else {
            showStatus('error', 'Invalid username or password.');
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setCurrentView('WordPress'); // Reset view
        showStatus('success', 'Logged out successfully.');
    };

    // --- Status Utility ---
    const showStatus = (type, text) => {
        setStatusMessage({ type, text });
        setTimeout(() => setStatusMessage({ type: null, text: '' }), 3000);
    };

    // --- Invoice Calculation Logic ---
    const { subtotal, taxAmount, total } = useMemo(() => {
        const calculatedSubtotal = invoiceItems.reduce((acc, item) => {
            const qty = parseFloat(item.quantity) || 0;
            const rate = parseFloat(item.rate) || 0;
            return acc + (qty * rate);
        }, 0);

        const calculatedTaxAmount = calculatedSubtotal * taxRate;
        const calculatedTotal = calculatedSubtotal + calculatedTaxAmount;

        return {
            subtotal: calculatedSubtotal,
            taxAmount: calculatedTaxAmount,
            total: calculatedTotal,
        };
    }, [invoiceItems, taxRate]);

    // --- Invoice Item Handlers ---

    const updateInvoiceItem = (index, newItem) => {
        const newItems = [...invoiceItems];
        newItems[index] = newItem;
        setInvoiceItems(newItems);
    };

    const removeInvoiceItem = (index) => {
        const newItems = invoiceItems.filter((_, i) => i !== index);
        setInvoiceItems(newItems);
    };

    const addInvoiceItem = (item) => {
        setInvoiceItems(prev => [...prev, item]);
    };

    const addServiceToInvoice = (category, service) => {
        setInvoiceItems(prev => [...prev, {
            id: Date.now(),
            description: `${category}: ${service.name} Package`,
            quantity: 1,
            rate: service.rate,
        }]);
        showStatus('success', `Added ${service.name} to invoice.`);
        setCurrentView('invoice');
    };
    
    const handleClearInvoice = () => {
        if (window.confirm("Are you sure you want to clear all items from the current invoice?")) {
            setInvoiceItems([]);
            setInvoiceHeader({
                clientName: '',
                clientAddress: '',
                invoiceNumber: 'INV-' + Math.floor(Math.random() * 100000),
                date: new Date().toLocaleDateString(),
            });
            showStatus('success', 'Invoice cleared. Starting a new quote.');
        }
    }


    // --- Components for Admin Views ---

    const AdminLogin = ({ onLogin }) => {
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');

        const handleSubmit = (e) => {
            e.preventDefault();
            onLogin(email, password);
        };

        return (
            <div className="flex items-center justify-center min-h-screen">
                <form onSubmit={handleSubmit} className="p-8 bg-white rounded-xl shadow-2xl w-full max-w-sm border border-blue-100">
                    <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">Admin Login</h2>
                    <p className="text-xs text-gray-500 mb-6 text-center">Use: admin@nuvoora.com / password</p>
                    <div className="space-y-4">
                        <InvoiceInput type="email" value={email} onChange={setEmail} placeholder="Admin Email" />
                        <InvoiceInput type="password" value={password} onChange={setPassword} placeholder="Password" />
                    </div>
                    <button
                        type="submit"
                        className="w-full mt-8 flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg"
                    >
                        <LogIn size={20} />
                        <span>Login</span>
                    </button>
                </form>
            </div>
        );
    };

    const Sidebar = () => {
        const [isServicesOpen, setIsServicesOpen] = useState(true);
        const serviceCategories = Object.keys(services);

        return (
            <nav className={`fixed inset-y-0 left-0 z-20 w-64 bg-blue-800 text-white flex flex-col transition-transform duration-300 ease-in-out print:hidden 
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
                        label={`Generate Invoice (${invoiceItems.length})`}
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

    const getServiceIcon = (category) => {
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

    const NavItem = ({ icon: Icon, label, view, currentView, setCurrentView, setIsSidebarOpen }) => {
        const isActive = currentView === view;
        return (
            <button
                onClick={() => {
                    setCurrentView(view);
                    setIsSidebarOpen(false); // Close sidebar on mobile after selection
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

    const MobileHeader = () => (
        <header className="md:hidden w-full bg-white shadow-md border-b sticky top-0 z-10 p-4 flex justify-between items-center print:hidden">
            <h1 className="text-xl font-bold text-blue-800">Admin Panel</h1>
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-gray-700 rounded-lg hover:bg-gray-100">
                <Menu size={24} />
            </button>
        </header>
    );

    const ServiceManagement = ({ category }) => {
        const [tempTaxRate, setTempTaxRate] = useState(taxRate * 100);

        const handleTaxRateUpdate = () => {
            const newRate = parseFloat(tempTaxRate) / 100;
            if (newRate >= 0 && newRate <= 1) {
                setTaxRate(newRate);
                showStatus('success', `Tax rate updated to ${tempTaxRate}% and saved locally.`);
            } else {
                showStatus('error', 'Tax rate must be between 0 and 100.');
            }
        };

        return (
            <div className="p-6 bg-white rounded-xl shadow-xl">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                    <Settings size={28} className="mr-3 text-blue-500" />
                    Manage {category} Packages
                </h2>
                
                {/* Global Settings */}
                <div className="mb-8 p-4 border border-yellow-200 bg-yellow-50 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0">
                    <div className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                        <DollarSign size={20} className="text-yellow-600" />
                        <span>Current Tax Rate: **{(taxRate * 100).toFixed(2)}%**</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <InvoiceInput
                            type="number"
                            value={tempTaxRate}
                            onChange={setTempTaxRate}
                            placeholder="New Tax %"
                            className="w-24 text-right p-1"
                            min={0}
                        />
                        <button
                            onClick={handleTaxRateUpdate}
                            className="px-3 py-1 bg-yellow-600 text-white rounded-lg text-sm hover:bg-yellow-700 transition"
                        >
                            Update Tax Rate
                        </button>
                    </div>
                </div>

                <ServiceList 
                    category={category} 
                    services={services[category]} 
                    setServices={setServices} 
                    addServiceToInvoice={addServiceToInvoice} 
                    showStatus={showStatus}
                />
            </div>
        );
    };

    const ServiceList = ({ category, services, setServices, addServiceToInvoice, showStatus }) => {
        const [isAdding, setIsAdding] = useState(false);
        const [currentPackage, setCurrentPackage] = useState({ id: null, name: '', description: '', rate: 0, details: [''] });

        const handleSave = (e) => {
            e.preventDefault();
            if (!currentPackage.name || !currentPackage.rate) {
                showStatus('error', 'Package name and rate are required.');
                return;
            }

            setServices(prev => {
                const newServices = [...prev[category]];
                
                // Clean up details list before saving
                const packageToSave = {
                    ...currentPackage,
                    details: currentPackage.details.filter(d => d && d.trim() !== ''),
                };


                if (currentPackage.id && currentPackage.id !== 'new') {
                    // Edit existing
                    const index = newServices.findIndex(s => s.id === currentPackage.id);
                    if (index > -1) newServices[index] = packageToSave;
                    showStatus('success', `Updated ${currentPackage.name}.`);
                } else {
                    // Add new
                    const newId = category.toLowerCase() + '-' + Date.now();
                    newServices.push({ ...packageToSave, id: newId });
                    showStatus('success', `Added new package: ${currentPackage.name}.`);
                }
                return { ...prev, [category]: newServices };
            });

            setIsAdding(false);
            setCurrentPackage({ id: null, name: '', description: '', rate: 0, details: [''] });
        };

        const handleDelete = (id, name) => {
            // Replaced window.confirm with a simpler alert/confirm for canvas compatibility
            if (window.confirm(`Are you sure you want to delete the ${name} package? This cannot be undone.`)) {
                setServices(prev => ({
                    ...prev,
                    [category]: prev[category].filter(s => s.id !== id)
                }));
                showStatus('success', `Deleted ${name} package.`);
            }
        };

        const handleEdit = (service) => {
            // Ensure details array exists and has at least one empty string for the dynamic input
            const details = service.details && service.details.length > 0 ? [...service.details, ''] : [''];
            setCurrentPackage({...service, details});
            setIsAdding(true);
        };
        
        const handleNew = () => {
            setCurrentPackage({ id: 'new', name: '', description: '', rate: 0, details: [''] });
            setIsAdding(true);
        }

        const handleDetailChange = (index, value) => {
            const newDetails = [...currentPackage.details];
            newDetails[index] = value;
            
            // Auto-add new empty field if the last one is being typed into
            if (index === newDetails.length - 1 && value.trim() !== '') {
                newDetails.push('');
            }
            
            // Auto-remove empty fields except for the last one
            const filteredDetails = newDetails.filter((d, i) => d.trim() !== '' || i === newDetails.length - 1);
            
            setCurrentPackage(prev => ({ ...prev, details: filteredDetails }));
        };
        
        const handleDetailRemove = (index) => {
            const newDetails = currentPackage.details.filter((_, i) => i !== index);
            // Ensure at least one empty input remains if the list becomes empty
            if (newDetails.length === 0) {
                newDetails.push('');
            }
            setCurrentPackage(prev => ({ ...prev, details: newDetails }));
        }


        return (
            <div>
                {!isAdding && (
                    <button 
                        onClick={handleNew}
                        className="mb-6 flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition shadow-md"
                    >
                        <Plus size={20} />
                        <span>Add New {category} Package</span>
                    </button>
                )}

                {isAdding && (
                    <div className="bg-gray-100 p-6 rounded-xl mb-6 border border-blue-200">
                        <h3 className="text-xl font-bold mb-4">{currentPackage.id === 'new' || !currentPackage.id ? 'Add New Package' : `Edit ${currentPackage.name}`}</h3>
                        <form onSubmit={handleSave} className="space-y-4">
                            <InvoiceInput 
                                value={currentPackage.name} 
                                onChange={(val) => setCurrentPackage(p => ({ ...p, name: val }))} 
                                placeholder="Package Name (e.g., Premium)"
                            />
                            <InvoiceInput 
                                value={currentPackage.description} 
                                onChange={(val) => setCurrentPackage(p => ({ ...p, description: val }))} 
                                placeholder="Short Description"
                            />
                            <InvoiceInput 
                                type="number"
                                value={currentPackage.rate || ''} 
                                onChange={(val) => setCurrentPackage(p => ({ ...p, rate: parseFloat(val) || 0 }))} 
                                placeholder="Price (LKR)"
                                min={0}
                            />

                            <div className="space-y-2 pt-2">
                                <label className="text-sm font-medium text-gray-700 block">Package Details/Deliverables (Add/Edit):</label>
                                {currentPackage.details.map((detail, index) => (
                                    <div key={index} className="flex space-x-2 items-center">
                                        <InvoiceInput 
                                            value={detail} 
                                            onChange={(val) => handleDetailChange(index, val)} 
                                            placeholder={`Detail ${index + 1}`}
                                        />
                                        {(currentPackage.details.length > 1 || detail.trim() !== '') && (
                                            <button 
                                                type="button" 
                                                onClick={() => handleDetailRemove(index)}
                                                className="text-red-500 hover:text-red-700 p-1"
                                                title="Remove detail"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            
                            <div className="flex space-x-4 pt-4">
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition shadow-md"
                                >
                                    Save Package
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsAdding(false)}
                                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg font-semibold hover:bg-gray-400 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}
                
                {services.length === 0 && !isAdding && (
                    <p className="text-gray-500 italic p-4 border rounded-lg">No packages defined for this category. Click "Add New Package" to start.</p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map(service => (
                        <div key={service.id} className="p-6 bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
                            <h4 className="text-2xl font-bold text-blue-700 mb-1">{service.name}</h4>
                            <p className="text-xl font-extrabold text-green-600 mt-1">{formatCurrency(service.rate)}</p>
                            <p className="text-gray-600 mt-2">{service.description}</p>
                            
                            <ul className="list-disc list-inside text-sm text-gray-500 mt-3 space-y-1">
                                {service.details.map((detail, i) => (
                                    <li key={i}>{detail}</li>
                                ))}
                            </ul>

                            <div className="mt-5 flex space-x-3">
                                <button
                                    onClick={() => handleEdit(service)}
                                    className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(service.id, service.name)}
                                    className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() => addServiceToInvoice(category, service)}
                                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md"
                                >
                                    Add to Invoice
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // --- Invoice Generator View ---

    const InvoiceGenerator = () => {
        return (
            <div className="p-6 bg-white rounded-xl shadow-xl">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center justify-between">
                    <span className="flex items-center"><FileText size={28} className="mr-3 text-blue-500" /> Generate Customer Invoice</span>
                    <button
                        onClick={handleClearInvoice}
                        className="flex items-center text-sm px-3 py-1 bg-gray-100 text-red-600 rounded-lg font-medium hover:bg-gray-200 transition"
                    >
                        <RotateCcw size={16} className="mr-1" /> Clear Invoice
                    </button>
                </h2>

                <div className="w-full bg-white print:shadow-none print:rounded-none print:p-0">
                    
                    {/* Header Section */}
                    <header className="flex flex-col sm:flex-row justify-between items-start mb-10 border-b pb-4">
                        <div className="flex flex-col mb-4 sm:mb-0">
                            <h1 className="text-4xl font-extrabold text-blue-700 tracking-tight">{COMPANY_NAME}</h1>
                            <p className="text-sm text-gray-500 mt-1 print:text-[10px]">{COMPANY_CONTACT}</p>
                            <p className="text-xs text-gray-400 mt-1">Status: Ready to Print</p>
                        </div>
                        <div className="text-left sm:text-right">
                            <h2 className="text-3xl font-bold text-gray-800 mb-2">INVOICE</h2>
                            <div className="text-sm text-gray-600 print:text-xs">
                                <p className="mb-1 flex justify-end items-center sm:block">
                                    <strong className="sm:mr-2">Invoice #:</strong> 
                                    <InvoiceInput 
                                        value={invoiceHeader.invoiceNumber} 
                                        onChange={(val) => setInvoiceHeader(p => ({ ...p, invoiceNumber: val }))} 
                                        placeholder="INV-XXXXX" 
                                        className="p-1 w-32 text-right text-sm border-dashed print:border-none"
                                    />
                                </p>
                                <p>
                                    <strong>Date:</strong> {invoiceHeader.date}
                                </p>
                            </div>
                        </div>
                    </header>

                    {/* Client Info Section */}
                    <section className="mb-10 p-4 border rounded-lg bg-gray-50 print:p-2 print:border-none print:bg-white">
                        <h3 className="text-sm font-semibold uppercase text-gray-600 mb-2">Billed To:</h3>
                        <div className="flex flex-col space-y-2">
                            <InvoiceInput 
                                value={invoiceHeader.clientName} 
                                onChange={(val) => setInvoiceHeader(p => ({ ...p, clientName: val }))}
                                placeholder="Client Name"
                                className="text-lg font-semibold"
                            />
                            <InvoiceInput 
                                value={invoiceHeader.clientAddress} 
                                onChange={(val) => setInvoiceHeader(p => ({ ...p, clientAddress: val }))}
                                placeholder="Client Address (e.g., City, Country)"
                                className="text-sm"
                            />
                        </div>
                    </section>

                    {/* Line Items Table */}
                    <section className="mb-10 overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-blue-50 print:bg-gray-100">
                                <tr>
                                    <th scope="col" className="p-3 text-left text-xs font-semibold uppercase tracking-wider text-blue-700 w-auto print:text-[10px]">
                                        Description
                                    </th>
                                    <th scope="col" className="p-3 text-right text-xs font-semibold uppercase tracking-wider text-blue-700 w-28 print:text-[10px]">
                                        Quantity
                                    </th>
                                    <th scope="col" className="p-3 text-right text-xs font-semibold uppercase tracking-wider text-blue-700 w-32 print:text-[10px]">
                                        Rate (LKR)
                                    </th>
                                    <th scope="col" className="p-3 text-right text-xs font-semibold uppercase tracking-wider text-blue-700 w-36 print:text-[10px]">
                                        Amount (LKR)
                                    </th>
                                    <th scope="col" className="p-3 w-12 print:hidden"></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100 text-sm">
                                {invoiceItems.length === 0 && (
                                    <tr className="text-center text-gray-500"><td colSpan="5" className="p-4 italic">No items added. Add services from the Admin Dashboard or add a custom item below.</td></tr>
                                )}
                                {invoiceItems.map((item, index) => (
                                    <InvoiceLineItem
                                        key={item.id}
                                        item={item}
                                        index={index}
                                        updateItem={updateInvoiceItem}
                                        removeItem={removeInvoiceItem}
                                    />
                                ))}
                            </tbody>
                        </table>
                        <div className="mt-4 print:hidden">
                            <button
                                onClick={() => addInvoiceItem({ id: Date.now(), description: '', quantity: 1, rate: 0 })}
                                className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition duration-150 p-2 rounded-lg border border-blue-200 hover:bg-blue-50"
                            >
                                <Plus size={16} />
                                <span>Add Custom Item</span>
                            </button>
                        </div>
                    </section>

                    {/* Totals and Footer */}
                    <div className="flex justify-end">
                        <div className="w-full max-w-sm">
                            <div className="space-y-2 text-sm text-gray-700 print:text-xs">
                                <div className="flex justify-between p-2 border-b">
                                    <span>Subtotal:</span>
                                    <span className="font-medium">{formatCurrency(subtotal)}</span>
                                </div>
                                <div className="flex justify-between p-2 border-b">
                                    <span>Tax ({(taxRate * 100).toFixed(2)}%):</span>
                                    <span className="font-medium">{formatCurrency(taxAmount)}</span>
                                </div>
                                <div className="flex justify-between p-3 bg-blue-50/70 rounded-lg font-bold text-lg text-blue-700 print:bg-gray-100 print:text-base">
                                    <span>TOTAL:</span>
                                    <span>{formatCurrency(total)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Notes */}
                    <footer className="mt-12 pt-6 border-t border-gray-200 text-center text-xs text-gray-500 print:mt-6 print:text-[10px]">
                        <p>Thank you for your business. Please remit payment within 30 days.</p>
                        <p className="mt-1">"Shaping Tomorrow with a Fresh Vision."</p>
                    </footer>

                </div>

                {/* Print Button (Hidden on Print) */}
                <div className="print:hidden mt-6 w-full flex justify-end">
                    <button
                        onClick={() => window.print()}
                        className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition shadow-xl"
                    >
                        <Printer size={20} />
                        <span>Print Invoice (to PDF)</span>
                    </button>
                </div>
            </div>
        );
    };

    const InvoiceLineItem = ({ item, index, updateItem, removeItem }) => {
        const handleValueChange = (key, value) => {
            let numericValue = (key === 'quantity' || key === 'rate') ? parseFloat(value) || 0 : value;
            if (key === 'quantity' && numericValue < 0) numericValue = 0;
            if (key === 'rate' && numericValue < 0) numericValue = 0;
            
            updateItem(index, { ...item, [key]: numericValue });
        };
    
        const total = (parseFloat(item.quantity) || 0) * (parseFloat(item.rate) || 0);
    
        return (
            <tr className="border-b border-gray-100 print:text-xs">
                <td className="p-3">
                    <InvoiceInput 
                        value={item.description} 
                        onChange={(val) => handleValueChange('description', val)}
                        placeholder="E.g., Wordpress Premium Package"
                    />
                </td>
                <td className="p-3 w-28">
                    <InvoiceInput 
                        type="number"
                        value={item.quantity === 0 ? '' : item.quantity} 
                        onChange={(val) => handleValueChange('quantity', val)}
                        placeholder="Qty"
                        className="text-right"
                        min={0}
                    />
                </td>
                <td className="p-3 w-32">
                    <InvoiceInput 
                        type="number"
                        value={item.rate === 0 ? '' : item.rate} 
                        onChange={(val) => handleValueChange('rate', val)}
                        placeholder="Rate"
                        className="text-right"
                        min={0}
                    />
                </td>
                <td className="p-3 w-36 text-right font-medium text-gray-800 print:w-24">
                    {formatCurrency(total)}
                </td>
                <td className="p-3 w-12 print:hidden">
                    <button
                        onClick={() => removeItem(index)}
                        className="p-1 text-red-500 hover:text-red-700 transition duration-150 rounded-full"
                        title="Remove Item"
                    >
                        <Trash2 size={16} />
                    </button>
                </td>
            </tr>
        );
    };

    // --- Main Render ---

    if (!isAuthenticated) {
        return <AdminLogin onLogin={handleLogin} />;
    }
    
    // Determine which content component to render
    const renderContent = () => {
        if (currentView === 'invoice') {
            return <InvoiceGenerator />;
        }
        
        // All other views are service management tabs
        return <ServiceManagement category={currentView} />;
    }

    return (
        <div className="bg-gray-50 min-h-screen font-sans antialiased flex flex-col md:flex-row p-0 print:p-0">
             {/* Status Message */}
             {statusMessage.type && (
                <div 
                    className={`fixed top-4 right-4 z-50 p-3 rounded-lg shadow-xl flex items-center space-x-2 
                        ${statusMessage.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
                >
                    {statusMessage.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
                    <span>{statusMessage.text}</span>
                </div>
            )}
            
            {/* Mobile Header (Shows Menu Button) */}
            <MobileHeader />

            {/* Sidebar Navigation */}
            <Sidebar />
            
            {/* Overlay for mobile view */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden" 
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}
            import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Trash2, Printer, Save, LogIn, LogOut, CheckCircle, XCircle, Settings, FileText, Globe, Smartphone, Feather, Code, Menu, X, DollarSign, RotateCcw, ChevronDown, ChevronRight, Briefcase } from 'lucide-react';

// --- CONSTANTS ---
// These are now used as INITIAL fallback values, not hardcoded strings in the UI.
const INITIAL_COMPANY_PROFILE = {
    name : "NUVOORA IT SOLUTIONS",
    contactMail: "info@nuvoora.com",
    contactMobile: "+94 75 5111 360",
    website: "www.nuvoora.com",
    tagline: "Shaping Tomorrow with a Fresh Vision.",
};

// Hardcoded Admin Credentials
const ADMIN_EMAIL = "admin@nuvoora.com";
const ADMIN_PASSWORD = "password";

// Initial Dummy Data for Service Management
const INITIAL_SERVICES = {
    WordPress: [
        { id: 'wp-basic', name: 'Basic', description: 'Ideal for small businesses & startups.', rate: 15000, details: ['1 Landing page with 6 sections', 'Responsive Design', 'Basic SEO', '1 Revision'] },
        { id: 'wp-standard', name: 'Standard', description: 'Best for businesses needing a complete WordPress solution.', rate: 25000, details: ['Up to 5 pages', 'Custom Theme & Plugins', 'Speed Optimization', '1 Revision'] },
        { id: 'wp-premium', name: 'Premium', description: 'Perfect for businesses requiring advanced functionality.', rate: 60000, details: ['6-10 pages', 'E-Commerce Setup', 'Security Optimization', '2 Revisions'] },
    ],
    Websites: [
        { id: 'web-small', name: 'Small Business Site', description: 'Static marketing site (up to 5 pages).', rate: 45000, details: ['Tailwind CSS', 'Fast Hosting Setup', 'Basic Contact Form'] },
    ],
    MobileApps: [
        { id: 'app-mvp', name: 'Mobile App MVP', description: 'Cross-platform minimal viable product.', rate: 120000, details: ['React Native or Flutter', '3 Core Screens', 'Basic Authentication'] },
    ],
    UIUX: [
        { id: 'ui-wire', name: 'Wireframing & Prototyping', description: 'Figma wireframes and interactive prototype.', rate: 30000, details: ['5 Page Screens', 'Design System Basic', 'User Flow Documentation'] },
    ],
};

// --- UTILITY COMPONENTS ---

/**
 * Custom Input Field for better UX
 */
const InvoiceInput = ({ value, onChange, placeholder, className = "", type = "text", min = 0, rows = 1 }) => (
    type === 'textarea' ? (
        <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            className={`w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ${className}`}
        />
    ) : (
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            min={min}
            className={`w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ${className}`}
        />
    )
);

/**
 * Currency Formatter for LKR
 */
const formatCurrency = (amount) => {
    return `LKR ${Number(amount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
};

// --- CORE APP COMPONENT ---

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentView, setCurrentView] = useState('WordPress'); // Default view is now a service category
    const [services, setServices] = useState(INITIAL_SERVICES);
    const [taxRate, setTaxRate] = useState(0.15); // Default 15% Tax Rate
    const [invoiceItems, setInvoiceItems] = useState([]);
    const [invoiceHeader, setInvoiceHeader] = useState({
        clientName: '',
        clientAddress: '',
        invoiceNumber: 'INV-' + Math.floor(Math.random() * 100000),
        date: new Date().toLocaleDateString(),
    });
    const [companyProfile, setCompanyProfile] = useState(INITIAL_COMPANY_PROFILE);
    const [statusMessage, setStatusMessage] = useState({ type: null, text: '' });
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // For mobile menu

    // --- Local Storage Persistence (Effect 1: Load on initial mount) ---
    useEffect(() => {
        const savedServices = localStorage.getItem('nuvooraServices');
        const savedTaxRate = localStorage.getItem('nuvooraTaxRate');
        const savedProfile = localStorage.getItem('nuvooraCompanyProfile');

        if (savedServices) {
            setServices(JSON.parse(savedServices));
        }
        if (savedTaxRate) {
            setTaxRate(parseFloat(savedTaxRate));
        }
        if (savedProfile) {
            setCompanyProfile(JSON.parse(savedProfile));
        }
    }, []);

    // --- Local Storage Persistence (Effect 2: Save on state change) ---
    useEffect(() => {
        localStorage.setItem('nuvooraServices', JSON.stringify(services));
    }, [services]);

    useEffect(() => {
        localStorage.setItem('nuvooraTaxRate', taxRate);
    }, [taxRate]);

    useEffect(() => {
        localStorage.setItem('nuvooraCompanyProfile', JSON.stringify(companyProfile));
    }, [companyProfile]);

    // --- Authentication Logic ---

    const handleLogin = (email, password) => {
        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
            setIsAuthenticated(true);
            setCurrentView('WordPress'); // Set to first service category
            showStatus('success', 'Login successful! Welcome Admin.');
        } else {
            showStatus('error', 'Invalid username or password.');
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setCurrentView('WordPress'); // Reset view
        showStatus('success', 'Logged out successfully.');
    };

    // --- Status Utility ---
    const showStatus = (type, text) => {
        setStatusMessage({ type, text });
        setTimeout(() => setStatusMessage({ type: null, text: '' }), 3000);
    };

    // --- Invoice Calculation Logic ---
    const { subtotal, taxAmount, total } = useMemo(() => {
        const calculatedSubtotal = invoiceItems.reduce((acc, item) => {
            const qty = parseFloat(item.quantity) || 0;
            const rate = parseFloat(item.rate) || 0;
            return acc + (qty * rate);
        }, 0);

        const calculatedTaxAmount = calculatedSubtotal * taxRate;
        const calculatedTotal = calculatedSubtotal + calculatedTaxAmount;

        return {
            subtotal: calculatedSubtotal,
            taxAmount: calculatedTaxAmount,
            total: calculatedTotal,
        };
    }, [invoiceItems, taxRate]);

    // --- Invoice Item Handlers ---

    const updateInvoiceItem = (index, newItem) => {
        const newItems = [...invoiceItems];
        newItems[index] = newItem;
        setInvoiceItems(newItems);
    };

    const removeInvoiceItem = (index) => {
        const newItems = invoiceItems.filter((_, i) => i !== index);
        setInvoiceItems(newItems);
    };

    const addInvoiceItem = (item) => {
        setInvoiceItems(prev => [...prev, item]);
    };

    const addServiceToInvoice = (category, service) => {
        setInvoiceItems(prev => [...prev, {
            id: Date.now(),
            description: `${category}: ${service.name} Package`,
            quantity: 1,
            rate: service.rate,
        }]);
        showStatus('success', `Added ${service.name} to invoice.`);
        setCurrentView('invoice');
    };
    
    const handleClearInvoice = () => {
        if (window.confirm("Are you sure you want to clear all items from the current invoice?")) {
            setInvoiceItems([]);
            setInvoiceHeader({
                clientName: '',
                clientAddress: '',
                invoiceNumber: 'INV-' + Math.floor(Math.random() * 100000),
                date: new Date().toLocaleDateString(),
            });
            showStatus('success', 'Invoice cleared. Starting a new quote.');
        }
    }


    // --- Components for Admin Views ---

    const AdminLogin = ({ onLogin }) => {
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');

        const handleSubmit = (e) => {
            e.preventDefault();
            onLogin(email, password);
        };

        return (
            <div className="flex items-center justify-center min-h-screen">
                <form onSubmit={handleSubmit} className="p-8 bg-white rounded-xl shadow-2xl w-full max-w-sm border border-blue-100">
                    <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">Admin Login</h2>
                    <p className="text-xs text-gray-500 mb-6 text-center">Use: admin@nuvoora.com / password</p>
                    <div className="space-y-4">
                        <InvoiceInput type="email" value={email} onChange={setEmail} placeholder="Admin Email" />
                        <InvoiceInput type="password" value={password} onChange={setPassword} placeholder="Password" />
                    </div>
                    <button
                        type="submit"
                        className="w-full mt-8 flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg"
                    >
                        <LogIn size={20} />
                        <span>Login</span>
                    </button>
                </form>
            </div>
        );
    };

    const Sidebar = () => {
        const [isServicesOpen, setIsServicesOpen] = useState(true);
        const serviceCategories = Object.keys(services);

        return (
            <nav className={`fixed inset-y-0 left-0 z-20 w-64 bg-blue-800 text-white flex flex-col transition-transform duration-300 ease-in-out print:hidden 
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
                        label={`Generate Invoice (${invoiceItems.length})`}
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

    const getServiceIcon = (category) => {
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

    const NavItem = ({ icon: Icon, label, view, currentView, setCurrentView, setIsSidebarOpen }) => {
        const isActive = currentView === view;
        return (
            <button
                onClick={() => {
                    setCurrentView(view);
                    setIsSidebarOpen(false); // Close sidebar on mobile after selection
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

    const MobileHeader = () => (
        <header className="md:hidden w-full bg-white shadow-md border-b sticky top-0 z-10 p-4 flex justify-between items-center print:hidden">
            <h1 className="text-xl font-bold text-blue-800">Admin Panel</h1>
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-gray-700 rounded-lg hover:bg-gray-100">
                <Menu size={24} />
            </button>
        </header>
    );

    const CompanyProfileManager = () => {
        const [tempProfile, setTempProfile] = useState(companyProfile);

        const handleSave = (e) => {
            e.preventDefault();
            setCompanyProfile(tempProfile);
            showStatus('success', 'Company Profile updated and saved locally.');
        };

        return (
            <div className="p-6 bg-white rounded-xl shadow-xl">
                <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
                    <Briefcase size={28} className="mr-3 text-blue-500" />
                    Manage Company Profile
                </h2>

                <form onSubmit={handleSave} className="space-y-6 max-w-lg">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Company Name</label>
                        <InvoiceInput
                            value={tempProfile.name}
                            onChange={(val) => setTempProfile(p => ({ ...p, name: val }))}
                            placeholder="e.g., Nuvoora IT Solutions"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Tagline (Appears in Invoice Footer)</label>
                        <InvoiceInput
                            value={tempProfile.tagline}
                            onChange={(val) => setTempProfile(p => ({ ...p, tagline: val }))}
                            placeholder="e.g., Shaping Tomorrow with a Fresh Vision."
                        />
                    </div>
                    <h3 className="text-xl font-semibold pt-4 border-t mt-4">Contact Details (Invoice Header)</h3>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Email Address</label>
                        <InvoiceInput
                            type="email"
                            value={tempProfile.contactMail}
                            onChange={(val) => setTempProfile(p => ({ ...p, contactMail: val }))}
                            placeholder="e.g., info@nuvoora.com"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Mobile Number</label>
                        <InvoiceInput
                            value={tempProfile.contactMobile}
                            onChange={(val) => setTempProfile(p => ({ ...p, contactMobile: val }))}
                            placeholder="e.g., +94 75 5111 360"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Website URL</label>
                        <InvoiceInput
                            value={tempProfile.website}
                            onChange={(val) => setTempProfile(p => ({ ...p, website: val }))}
                            placeholder="e.g., www.nuvoora.com"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg"
                    >
                        <Save size={20} />
                        <span>Save Profile Changes</span>
                    </button>
                </form>
            </div>
        );
    };


    const ServiceManagement = ({ category }) => {
        const [tempTaxRate, setTempTaxRate] = useState(taxRate * 100);

        const handleTaxRateUpdate = () => {
            const newRate = parseFloat(tempTaxRate) / 100;
            if (newRate >= 0 && newRate <= 1) {
                setTaxRate(newRate);
                showStatus('success', `Tax rate updated to ${tempTaxRate}% and saved locally.`);
            } else {
                showStatus('error', 'Tax rate must be between 0 and 100.');
            }
        };

        return (
            <div className="p-6 bg-white rounded-xl shadow-xl">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                    {/* Display the correct icon based on the current category view */}
                    {React.createElement(getServiceIcon(category), { size: 28, className: "mr-3 text-blue-500" })}
                    Manage {category} Packages
                </h2>
                
                {/* Global Settings */}
                <div className="mb-8 p-4 border border-yellow-200 bg-yellow-50 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0">
                    <div className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                        <DollarSign size={20} className="text-yellow-600" />
                        <span>Current Tax Rate: **{(taxRate * 100).toFixed(2)}%**</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <InvoiceInput
                            type="number"
                            value={tempTaxRate}
                            onChange={setTempTaxRate}
                            placeholder="New Tax %"
                            className="w-24 text-right p-1"
                            min={0}
                        />
                        <button
                            onClick={handleTaxRateUpdate}
                            className="px-3 py-1 bg-yellow-600 text-white rounded-lg text-sm hover:bg-yellow-700 transition"
                        >
                            Update Tax Rate
                        </button>
                    </div>
                </div>

                <ServiceList 
                    category={category} 
                    services={services[category]} 
                    setServices={setServices} 
                    addServiceToInvoice={addServiceToInvoice} 
                    showStatus={showStatus}
                />
            </div>
        );
    };

    const ServiceList = ({ category, services, setServices, addServiceToInvoice, showStatus }) => {
        const [isAdding, setIsAdding] = useState(false);
        const [currentPackage, setCurrentPackage] = useState({ id: null, name: '', description: '', rate: 0, details: [''] });

        const handleSave = (e) => {
            e.preventDefault();
            if (!currentPackage.name || !currentPackage.rate) {
                showStatus('error', 'Package name and rate are required.');
                return;
            }

            setServices(prev => {
                const newServices = [...prev[category]];
                
                // Clean up details list before saving
                const packageToSave = {
                    ...currentPackage,
                    details: currentPackage.details.filter(d => d && d.trim() !== ''),
                };


                if (currentPackage.id && currentPackage.id !== 'new') {
                    // Edit existing
                    const index = newServices.findIndex(s => s.id === currentPackage.id);
                    if (index > -1) newServices[index] = packageToSave;
                    showStatus('success', `Updated ${currentPackage.name}.`);
                } else {
                    // Add new
                    const newId = category.toLowerCase() + '-' + Date.now();
                    newServices.push({ ...packageToSave, id: newId });
                    showStatus('success', `Added new package: ${currentPackage.name}.`);
                }
                return { ...prev, [category]: newServices };
            });

            setIsAdding(false);
            setCurrentPackage({ id: null, name: '', description: '', rate: 0, details: [''] });
        };

        const handleDelete = (id, name) => {
            // Replaced window.confirm with a simpler alert/confirm for canvas compatibility
            if (window.confirm(`Are you sure you want to delete the ${name} package? This cannot be undone.`)) {
                setServices(prev => ({
                    ...prev,
                    [category]: prev[category].filter(s => s.id !== id)
                }));
                showStatus('success', `Deleted ${name} package.`);
            }
        };

        const handleEdit = (service) => {
            // Ensure details array exists and has at least one empty string for the dynamic input
            const details = service.details && service.details.length > 0 ? [...service.details, ''] : [''];
            setCurrentPackage({...service, details});
            setIsAdding(true);
        };
        
        const handleNew = () => {
            setCurrentPackage({ id: 'new', name: '', description: '', rate: 0, details: [''] });
            setIsAdding(true);
        }

        const handleDetailChange = (index, value) => {
            const newDetails = [...currentPackage.details];
            newDetails[index] = value;
            
            // Auto-add new empty field if the last one is being typed into
            if (index === newDetails.length - 1 && value.trim() !== '') {
                newDetails.push('');
            }
            
            // Auto-remove empty fields except for the last one
            const filteredDetails = newDetails.filter((d, i) => d.trim() !== '' || i === newDetails.length - 1);
            
            setCurrentPackage(prev => ({ ...prev, details: filteredDetails }));
        };
        
        const handleDetailRemove = (index) => {
            const newDetails = currentPackage.details.filter((_, i) => i !== index);
            // Ensure at least one empty input remains if the list becomes empty
            if (newDetails.length === 0) {
                newDetails.push('');
            }
            setCurrentPackage(prev => ({ ...prev, details: newDetails }));
        }


        return (
            <div>
                {!isAdding && (
                    <button 
                        onClick={handleNew}
                        className="mb-6 flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition shadow-md"
                    >
                        <Plus size={20} />
                        <span>Add New {category} Package</span>
                    </button>
                )}

                {isAdding && (
                    <div className="bg-gray-100 p-6 rounded-xl mb-6 border border-blue-200">
                        <h3 className="text-xl font-bold mb-4">{currentPackage.id === 'new' || !currentPackage.id ? 'Add New Package' : `Edit ${currentPackage.name}`}</h3>
                        <form onSubmit={handleSave} className="space-y-4">
                            <InvoiceInput 
                                value={currentPackage.name} 
                                onChange={(val) => setCurrentPackage(p => ({ ...p, name: val }))} 
                                placeholder="Package Name (e.g., Premium)"
                            />
                            <InvoiceInput 
                                value={currentPackage.description} 
                                onChange={(val) => setCurrentPackage(p => ({ ...p, description: val }))} 
                                placeholder="Short Description"
                            />
                            <InvoiceInput 
                                type="number"
                                value={currentPackage.rate || ''} 
                                onChange={(val) => setCurrentPackage(p => ({ ...p, rate: parseFloat(val) || 0 }))} 
                                placeholder="Price (LKR)"
                                min={0}
                            />

                            <div className="space-y-2 pt-2">
                                <label className="text-sm font-medium text-gray-700 block">Package Details/Deliverables (Add/Edit):</label>
                                {currentPackage.details.map((detail, index) => (
                                    <div key={index} className="flex space-x-2 items-center">
                                        <InvoiceInput 
                                            value={detail} 
                                            onChange={(val) => handleDetailChange(index, val)} 
                                            placeholder={`Detail ${index + 1}`}
                                        />
                                        {(currentPackage.details.length > 1 || detail.trim() !== '') && (
                                            <button 
                                                type="button" 
                                                onClick={() => handleDetailRemove(index)}
                                                className="text-red-500 hover:text-red-700 p-1"
                                                title="Remove detail"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            
                            <div className="flex space-x-4 pt-4">
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition shadow-md"
                                >
                                    Save Package
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsAdding(false)}
                                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg font-semibold hover:bg-gray-400 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}
                
                {services.length === 0 && !isAdding && (
                    <p className="text-gray-500 italic p-4 border rounded-lg">No packages defined for this category. Click "Add New Package" to start.</p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map(service => (
                        <div key={service.id} className="p-6 bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
                            <h4 className="text-2xl font-bold text-blue-700 mb-1">{service.name}</h4>
                            <p className="text-xl font-extrabold text-green-600 mt-1">{formatCurrency(service.rate)}</p>
                            <p className="text-gray-600 mt-2">{service.description}</p>
                            
                            <ul className="list-disc list-inside text-sm text-gray-500 mt-3 space-y-1">
                                {service.details.map((detail, i) => (
                                    <li key={i}>{detail}</li>
                                ))}
                            </ul>

                            <div className="mt-5 flex space-x-3">
                                <button
                                    onClick={() => handleEdit(service)}
                                    className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(service.id, service.name)}
                                    className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() => addServiceToInvoice(category, service)}
                                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md"
                                >
                                    Add to Invoice
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // --- Invoice Generator View ---

    const InvoiceGenerator = () => {
        const contactLine = `Mail: ${companyProfile.contactMail} | Mobile: ${companyProfile.contactMobile} | ${companyProfile.website}`;

        return (
            <div className="p-6 bg-white rounded-xl shadow-xl">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center justify-between">
                    <span className="flex items-center"><FileText size={28} className="mr-3 text-blue-500" /> Generate Customer Invoice</span>
                    <button
                        onClick={handleClearInvoice}
                        className="flex items-center text-sm px-3 py-1 bg-gray-100 text-red-600 rounded-lg font-medium hover:bg-gray-200 transition"
                    >
                        <RotateCcw size={16} className="mr-1" /> Clear Invoice
                    </button>
                </h2>

                <div className="w-full bg-white print:shadow-none print:rounded-none print:p-0">
                    
                    {/* Header Section */}
                    <header className="flex flex-col sm:flex-row justify-between items-start mb-10 border-b pb-4">
                        <div className="flex flex-col mb-4 sm:mb-0">
                            <h1 className="text-4xl font-extrabold text-blue-700 tracking-tight">{companyProfile.name}</h1>
                            <p className="text-sm text-gray-500 mt-1 print:text-[10px]">{contactLine}</p>
                            <p className="text-xs text-gray-400 mt-1">Status: Ready to Print</p>
                        </div>
                        <div className="text-left sm:text-right">
                            <h2 className="text-3xl font-bold text-gray-800 mb-2">INVOICE</h2>
                            <div className="text-sm text-gray-600 print:text-xs">
                                <p className="mb-1 flex justify-end items-center sm:block">
                                    <strong className="sm:mr-2">Invoice #:</strong> 
                                    <InvoiceInput 
                                        value={invoiceHeader.invoiceNumber} 
                                        onChange={(val) => setInvoiceHeader(p => ({ ...p, invoiceNumber: val }))} 
                                        placeholder="INV-XXXXX" 
                                        className="p-1 w-32 text-right text-sm border-dashed print:border-none"
                                    />
                                </p>
                                <p>
                                    <strong>Date:</strong> {invoiceHeader.date}
                                </p>
                            </div>
                        </div>
                    </header>

                    {/* Client Info Section */}
                    <section className="mb-10 p-4 border rounded-lg bg-gray-50 print:p-2 print:border-none print:bg-white">
                        <h3 className="text-sm font-semibold uppercase text-gray-600 mb-2">Billed To:</h3>
                        <div className="flex flex-col space-y-2">
                            <InvoiceInput 
                                value={invoiceHeader.clientName} 
                                onChange={(val) => setInvoiceHeader(p => ({ ...p, clientName: val }))}
                                placeholder="Client Name"
                                className="text-lg font-semibold"
                            />
                            <InvoiceInput 
                                value={invoiceHeader.clientAddress} 
                                onChange={(val) => setInvoiceHeader(p => ({ ...p, clientAddress: val }))}
                                placeholder="Client Address (e.g., City, Country)"
                                className="text-sm"
                            />
                        </div>
                    </section>

                    {/* Line Items Table */}
                    <section className="mb-10 overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-blue-50 print:bg-gray-100">
                                <tr>
                                    <th scope="col" className="p-3 text-left text-xs font-semibold uppercase tracking-wider text-blue-700 w-auto print:text-[10px]">
                                        Description
                                    </th>
                                    <th scope="col" className="p-3 text-right text-xs font-semibold uppercase tracking-wider text-blue-700 w-28 print:text-[10px]">
                                        Quantity
                                    </th>
                                    <th scope="col" className="p-3 text-right text-xs font-semibold uppercase tracking-wider text-blue-700 w-32 print:text-[10px]">
                                        Rate (LKR)
                                    </th>
                                    <th scope="col" className="p-3 text-right text-xs font-semibold uppercase tracking-wider text-blue-700 w-36 print:text-[10px]">
                                        Amount (LKR)
                                    </th>
                                    <th scope="col" className="p-3 w-12 print:hidden"></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100 text-sm">
                                {invoiceItems.length === 0 && (
                                    <tr className="text-center text-gray-500"><td colSpan="5" className="p-4 italic">No items added. Add services from the Admin Dashboard or add a custom item below.</td></tr>
                                )}
                                {invoiceItems.map((item, index) => (
                                    <InvoiceLineItem
                                        key={item.id}
                                        item={item}
                                        index={index}
                                        updateItem={updateInvoiceItem}
                                        removeItem={removeInvoiceItem}
                                    />
                                ))}
                            </tbody>
                        </table>
                        <div className="mt-4 print:hidden">
                            <button
                                onClick={() => addInvoiceItem({ id: Date.now(), description: '', quantity: 1, rate: 0 })}
                                className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition duration-150 p-2 rounded-lg border border-blue-200 hover:bg-blue-50"
                            >
                                <Plus size={16} />
                                <span>Add Custom Item</span>
                            </button>
                        </div>
                    </section>

                    {/* Totals and Footer */}
                    <div className="flex justify-end">
                        <div className="w-full max-w-sm">
                            <div className="space-y-2 text-sm text-gray-700 print:text-xs">
                                <div className="flex justify-between p-2 border-b">
                                    <span>Subtotal:</span>
                                    <span className="font-medium">{formatCurrency(subtotal)}</span>
                                </div>
                                <div className="flex justify-between p-2 border-b">
                                    <span>Tax ({(taxRate * 100).toFixed(2)}%):</span>
                                    <span className="font-medium">{formatCurrency(taxAmount)}</span>
                                </div>
                                <div className="flex justify-between p-3 bg-blue-50/70 rounded-lg font-bold text-lg text-blue-700 print:bg-gray-100 print:text-base">
                                    <span>TOTAL:</span>
                                    <span>{formatCurrency(total)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Notes */}
                    <footer className="mt-12 pt-6 border-t border-gray-200 text-center text-xs text-gray-500 print:mt-6 print:text-[10px]">
                        <p>Thank thank you for your business. Please remit payment within 30 days.</p>
                        <p className="mt-1">"{companyProfile.tagline}"</p>
                    </footer>

                </div>

                {/* Print Button (Hidden on Print) */}
                <div className="print:hidden mt-6 w-full flex justify-end">
                    <button
                        onClick={() => window.print()}
                        className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition shadow-xl"
                    >
                        <Printer size={20} />
                        <span>Print Invoice (to PDF)</span>
                    </button>
                </div>
            </div>
        );
    };

    const InvoiceLineItem = ({ item, index, updateItem, removeItem }) => {
        const handleValueChange = (key, value) => {
            let numericValue = (key === 'quantity' || key === 'rate') ? parseFloat(value) || 0 : value;
            if (key === 'quantity' && numericValue < 0) numericValue = 0;
            if (key === 'rate' && numericValue < 0) numericValue = 0;
            
            updateItem(index, { ...item, [key]: numericValue });
        };
    
        const total = (parseFloat(item.quantity) || 0) * (parseFloat(item.rate) || 0);
    
        return (
            <tr className="border-b border-gray-100 print:text-xs">
                <td className="p-3">
                    <InvoiceInput 
                        value={item.description} 
                        onChange={(val) => handleValueChange('description', val)}
                        placeholder="E.g., Wordpress Premium Package"
                    />
                </td>
                <td className="p-3 w-28">
                    <InvoiceInput 
                        type="number"
                        value={item.quantity === 0 ? '' : item.quantity} 
                        onChange={(val) => handleValueChange('quantity', val)}
                        placeholder="Qty"
                        className="text-right"
                        min={0}
                    />
                </td>
                <td className="p-3 w-32">
                    <InvoiceInput 
                        type="number"
                        value={item.rate === 0 ? '' : item.rate} 
                        onChange={(val) => handleValueChange('rate', val)}
                        placeholder="Rate"
                        className="text-right"
                        min={0}
                    />
                </td>
                <td className="p-3 w-36 text-right font-medium text-gray-800 print:w-24">
                    {formatCurrency(total)}
                </td>
                <td className="p-3 w-12 print:hidden">
                    <button
                        onClick={() => removeItem(index)}
                        className="p-1 text-red-500 hover:text-red-700 transition duration-150 rounded-full"
                        title="Remove Item"
                    >
                        <Trash2 size={16} />
                    </button>
                </td>
            </tr>
        );
    };

    // --- Main Render ---

    if (!isAuthenticated) {
        return <AdminLogin onLogin={handleLogin} />;
    }
    
    // Determine which content component to render
    const renderContent = () => {
        if (currentView === 'invoice') {
            return <InvoiceGenerator />;
        }
        if (currentView === 'profile') {
            return <CompanyProfileManager />;
        }
        
        // All other views are service management tabs
        return <ServiceManagement category={currentView} />;
    }

    return (
        <div className="bg-gray-50 min-h-screen font-sans antialiased flex flex-col md:flex-row p-0 print:p-0">
             {/* Status Message */}
             {statusMessage.type && (
                <div 
                    className={`fixed top-4 right-4 z-50 p-3 rounded-lg shadow-xl flex items-center space-x-2 
                        ${statusMessage.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
                >
                    {statusMessage.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
                    <span>{statusMessage.text}</span>
                </div>
            )}
            
            {/* Mobile Header (Shows Menu Button) */}
            <MobileHeader />

            {/* Sidebar Navigation */}
            <Sidebar />
            
            {/* Overlay for mobile view */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden" 
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* Content Area */}
            <main className="flex-grow p-4 md:p-8 print:p-0">
                <div className="max-w-7xl mx-auto">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default App;
            {/* Content Area */}
            <main className="flex-grow p-4 md:p-8 print:p-0">
                <div className="max-w-7xl mx-auto">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default App;