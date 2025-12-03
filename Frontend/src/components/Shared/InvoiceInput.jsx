// src/components/Shared/InvoiceInput.jsx

import React from 'react';

const InvoiceInput = ({ value, onChange, placeholder, className = "", type = "text", min = 0, rows = 1 }) => {
    if (type === 'textarea') {
        return (
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                rows={rows}
                className={`w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ${className}`}
            />
        );
    }
    
    return (
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            min={min}
            className={`w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ${className}`}
        />
    );
}

export default InvoiceInput;