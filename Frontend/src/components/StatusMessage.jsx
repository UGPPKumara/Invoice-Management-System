// src/components/StatusMessage.jsx

import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

const StatusMessage = ({ type, text }) => {
    if (!type) return null;

    return (
        <div 
            className={`fixed top-4 right-4 z-50 p-3 rounded-lg shadow-xl flex items-center space-x-2 
                ${type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
        >
            {type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
            <span>{text}</span>
        </div>
    );
};

export default StatusMessage;