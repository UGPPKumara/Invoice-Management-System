// src/components/ServiceCard.jsx

import React from 'react';
import { Trash2, Plus } from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';

const ServiceCard = ({ service, category, handleEdit, handleDelete, addServiceToInvoice, documentType = 'Invoice' }) => (
    <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
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
                <Trash2 size={16} className='inline-block mr-1'/> Delete
            </button>
            <button
                onClick={() => addServiceToInvoice(category, service)}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md flex items-center space-x-1"
            >
                <Plus size={16} />
                <span>{`Add to ${documentType}`}</span>
            </button>
        </div>
    </div>
);

export default ServiceCard;