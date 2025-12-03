// src/views/InvoiceGenerator.jsx

import React from 'react';
import { FileText, Printer, RotateCcw, Plus } from 'lucide-react';
import InvoiceLineItem from '../components/InvoiceLineItem';
import InvoiceInput from '../components/Shared/InvoiceInput';
import { formatCurrency } from '../utils/formatCurrency';

const InvoiceGenerator = ({ 
    profile, 
    invoiceHeader, 
    setInvoiceHeader, 
    invoiceItems, 
    subtotal, 
    taxRate, 
    taxAmount, 
    total,
    handleClearInvoice,
    addInvoiceItem,
    updateInvoiceItem,
    removeInvoiceItem,
}) => {
    const contactLine = `Mail: ${profile.contactMail} | Mobile: ${profile.contactMobile} | ${profile.website}`;

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
                        <h1 className="text-4xl font-extrabold text-blue-700 tracking-tight">{profile.name}</h1>
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
                    <p>Thank you for your business. Please remit payment within 30 days.</p>
                    <p className="mt-1">"{profile.tagline}"</p>
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

export default InvoiceGenerator;