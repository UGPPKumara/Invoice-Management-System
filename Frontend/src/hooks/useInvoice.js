// src/hooks/useInvoice.js (Modified to export header and add loadDocumentData)

import { useState, useMemo, useCallback } from 'react'; 

const generateHeader = (type = 'Invoice') => ({
    clientName: '',
    clientAddress: '',
    // Use a basic unique ID and prefix based on type
    documentNumber: type === 'Quotation' ? 'QUO-' + Math.floor(Math.random() * 100000) : 'INV-' + Math.floor(Math.random() * 100000),
    date: new Date().toLocaleDateString(),
    // Add validUntil for Quotations, default to 30 days later
    validUntil: type === 'Quotation' ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString() : '',
});

export const INITIAL_INVOICE_HEADER = generateHeader('Invoice'); // EXPORTED

// Simplified arguments
export const useInvoice = ({ services, taxRate, showStatus, setCurrentView }) => { 
    // State to hold the current document type (Invoice or Quotation)
    const [documentType, setDocumentType] = useState('Invoice');
    const [invoiceItems, setInvoiceItems] = useState([]); 
    const [invoiceHeader, setInvoiceHeader] = useState(INITIAL_INVOICE_HEADER);

    // Function to clear the invoice and optionally change type
    const handleClearInvoice = useCallback((newType = documentType) => {
        if (window.confirm(`Are you sure you want to clear all items and start a new ${newType}?`)) {
            setInvoiceItems([]);
            setInvoiceHeader(generateHeader(newType));
            setDocumentType(newType); // Update the type if clearing
            showStatus('success', `${newType} cleared. Starting a new draft.`);
        }
    }, [documentType, showStatus]);
    
    // Handler to switch between document types and reset the form
    const switchDocumentType = useCallback((newType) => {
        // Only trigger clear/reset if the type is actually changing
        if (newType !== documentType) {
            handleClearInvoice(newType);
        }
    }, [documentType, handleClearInvoice]);


    // --- Calculation Logic (remains the same) ---
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
        showStatus('success', `Added ${service.name} to ${documentType}.`);
        setCurrentView('document'); 
    };
    
    // NEW: Function to populate the editor with loaded document data
    const loadDocumentData = useCallback((doc) => {
        setDocumentType(doc.documentType || 'Invoice');
        setInvoiceHeader({
            clientName: doc.clientName || '',
            clientAddress: doc.clientAddress || '',
            documentNumber: doc.documentNumber || generateHeader(doc.documentType).documentNumber,
            date: doc.date || new Date().toLocaleDateString(),
            validUntil: doc.validUntil || '',
        });
        setInvoiceItems(doc.invoiceItems || []);
        showStatus('info', `${doc.documentType} ${doc.documentNumber} loaded for editing.`);
        setCurrentView('document');
    }, [showStatus, setCurrentView]);


    return {
        // State
        invoiceItems,
        setInvoiceItems, 
        invoiceHeader,
        setInvoiceHeader,
        documentType, 
        setDocumentType, 
        switchDocumentType, 
        
        // Calculated values
        subtotal,
        taxAmount,
        total,
        
        // Handlers
        updateInvoiceItem,
        removeInvoiceItem,
        addInvoiceItem,
        addServiceToInvoice,
        handleClearInvoice: () => handleClearInvoice(documentType), 
        loadDocumentData, // EXPORTED
    };
};