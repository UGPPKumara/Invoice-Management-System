// src/components/InvoiceLineItem.jsx

import React from 'react';
import { Trash2 } from 'lucide-react';
import InvoiceInput from './Shared/InvoiceInput';
import { formatCurrency } from '../utils/formatCurrency';

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

export default InvoiceLineItem;