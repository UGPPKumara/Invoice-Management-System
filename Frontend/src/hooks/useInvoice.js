// src/hooks/useInvoice.js (FIXED for ReferenceError/TypeError)

import { useState, useMemo } from 'react';

const INITIAL_INVOICE_HEADER = {
    clientName: '',
    clientAddress: '',
    invoiceNumber: 'INV-' + Math.floor(Math.random() * 100000),
    date: new Date().toLocaleDateString(),
};

// Simplified arguments
export const useInvoice = ({ services, taxRate, showStatus, setCurrentView }) => { 
    const [invoiceItems, setInvoiceItems] = useState([]); 
    const [invoiceHeader, setInvoiceHeader] = useState(INITIAL_INVOICE_HEADER);

    // --- Calculation Logic ---
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
        addInvoiceItem({
            id: Date.now(),
            description: `${category}: ${service.name} Package`,
            quantity: 1,
            rate: service.rate,
        });
        showStatus('success', `Added ${service.name} to invoice.`);
        setCurrentView('invoice');
    };
    
    const handleClearInvoice = () => {
        if (window.confirm("Are you sure you want to clear all items from the current invoice?")) {
            setInvoiceItems([]);
            setInvoiceHeader(INITIAL_INVOICE_HEADER);
            showStatus('success', 'Invoice cleared. Starting a new quote.');
        }
    }

    return {
        // State
        invoiceItems,
        setInvoiceItems, // <--- Correctly returned
        invoiceHeader,
        setInvoiceHeader,
        
        // Calculated values
        subtotal,
        taxAmount,
        total,
        
        // Handlers
        updateInvoiceItem,
        removeInvoiceItem,
        addInvoiceItem,
        addServiceToInvoice,
        handleClearInvoice,
    };
};