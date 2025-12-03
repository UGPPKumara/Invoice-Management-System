// src/views/ServiceManagement.jsx

import React, { useState } from 'react';
import { Settings, DollarSign, Plus, Trash2 } from 'lucide-react';
import InvoiceInput from '../components/Shared/InvoiceInput';
import ServiceCard from '../components/ServiceCard';
import { getServiceIcon } from '../components/Sidebar';

const ServiceList = ({ category, services, setServices, addServiceToInvoice, showStatus, documentType }) => { // <-- documentType added here
    const [isAdding, setIsAdding] = useState(false);
    const [currentPackage, setCurrentPackage] = useState({ id: null, name: '', description: '', rate: 0, details: [''] });

    const currentServices = services[category] || [];
    // ... existing handlers (handleSave, handleDelete, etc.) ...
    const handleSave = (e) => {
        e.preventDefault();
        if (!currentPackage.name || !currentPackage.rate) {
            showStatus('error', 'Package name and rate are required.');
            return;
        }

        const newServices = [...currentServices];
        
        // Clean up details list before saving
        const packageToSave = {
            ...currentPackage,
            rate: parseFloat(currentPackage.rate) || 0,
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

        // Update the top-level services state, which triggers a Firestore save
        setServices(prev => ({ ...prev, [category]: newServices }));

        setIsAdding(false);
        setCurrentPackage({ id: null, name: '', description: '', rate: 0, details: [''] });
    };

    const handleDelete = (id, name) => {
        if (window.confirm(`Are you sure you want to delete the ${name} package? This cannot be undone.`)) {
            const newServices = currentServices.filter(s => s.id !== id);
            setServices(prev => ({ ...prev, [category]: newServices }));
            showStatus('success', `Deleted ${name} package.`);
        }
    };

    const handleEdit = (service) => {
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
                            onChange={(val) => setCurrentPackage(p => ({ ...p, rate: val }))} 
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
            
            {currentServices.length === 0 && !isAdding && (
                <p className="text-gray-500 italic p-4 border rounded-lg">No packages defined for this category. Click "Add New Package" to start.</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentServices.map(service => (
                    <ServiceCard
                        key={service.id}
                        service={service}
                        category={category}
                        handleEdit={handleEdit}
                        handleDelete={handleDelete}
                        addServiceToInvoice={addServiceToInvoice}
                        documentType={documentType} // <-- Passed documentType
                    />
                ))}
            </div>
        </div>
    );
};


const ServiceManagement = ({ category, services, setServices, taxRate, setTaxRate, showStatus, addServiceToInvoice, documentType }) => { // <-- documentType added here
    const [tempTaxRate, setTempTaxRate] = useState(taxRate * 100);

    const handleTaxRateUpdate = () => {
        const newRate = parseFloat(tempTaxRate) / 100;
        if (newRate >= 0 && newRate <= 1) {
            setTaxRate(newRate); // Triggers Firestore save via hook
        } else {
            showStatus('error', 'Tax rate must be between 0 and 100.');
        }
    };

    const Icon = getServiceIcon(category);

    return (
        <div className="p-6 bg-white rounded-xl shadow-xl">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                {React.createElement(Icon, { size: 28, className: "mr-3 text-blue-500" })}
                Manage {category} Packages
            </h2>
            
            {/* Global Settings (Tax Rate) */}
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
                services={services} 
                setServices={setServices} 
                addServiceToInvoice={addServiceToInvoice} 
                showStatus={showStatus}
                documentType={documentType} // <-- Passed documentType
            />
        </div>
    );
};

export default ServiceManagement;