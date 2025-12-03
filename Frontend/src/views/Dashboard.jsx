// src/views/Dashboard.jsx (NEW - Dashboard View)

import React from 'react';
import { FileText, FileSignature, DollarSign, List, Edit, Trash2, RefreshCw } from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';

// Component to display a single metric card
const MetricCard = ({ title, value, icon: Icon, color }) => (
    <div className={`p-6 bg-white rounded-xl shadow-lg border-t-4 ${color} flex items-center justify-between`}>
        <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <Icon size={32} className={`text-opacity-75 ${color.replace('border-', 'text-').replace('-4', '-500')}`} />
    </div>
);

// Component to display a single row in the documents table
const DocumentRow = ({ doc, handleLoadForEdit, handleDelete }) => {
    const isQuotation = doc.documentType === 'Quotation';
    // Show total for Invoices, show 'Estimate' for Quotations
    const totalDisplay = isQuotation ? 'Estimate' : doc.total; 

    return (
        <tr className="border-b hover:bg-gray-50">
            <td className="p-3 font-semibold text-blue-700">{doc.documentNumber}</td>
            <td className="p-3 text-sm">{doc.documentType}</td>
            <td className="p-3 text-sm">{doc.clientName || 'N/A'}</td>
            <td className="p-3 text-sm">{doc.date}</td>
            <td className={`p-3 text-right font-bold ${isQuotation ? 'text-gray-500' : 'text-green-600'}`}>
                {totalDisplay}
            </td>
            <td className="p-3 text-right space-x-2 print:hidden">
                <button
                    onClick={() => handleLoadForEdit(doc)}
                    className="p-2 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-100 rounded-full transition"
                    title="Load for Editing"
                >
                    <Edit size={16} />
                </button>
                <button
                    onClick={() => handleDelete(doc.documentNumber, doc.documentType)}
                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-100 rounded-full transition"
                    title="Delete Document"
                >
                    <Trash2 size={16} />
                </button>
            </td>
        </tr>
    );
};


const Dashboard = ({ 
    documents, 
    isLoadingDocuments, 
    fetchDocuments,
    deleteDocument,
    totalInvoiceCount, 
    totalQuotationCount, 
    monthlyRevenue,
    handleLoadDocumentForEdit, 
    setCurrentView,
}) => {

    const handleLoadForEdit = (doc) => {
        handleLoadDocumentForEdit(doc); 
        setCurrentView('document'); // Switch to the document generator view
    };

    return (
        <div className="p-6 bg-white rounded-xl shadow-xl">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center justify-between">
                <span className="flex items-center"><List size={28} className="mr-3 text-blue-500" /> Admin Dashboard</span>
                <button 
                    onClick={fetchDocuments}
                    disabled={isLoadingDocuments}
                    className="flex items-center text-sm px-3 py-1 bg-gray-100 text-gray-600 rounded-lg font-medium hover:bg-gray-200 transition disabled:opacity-50"
                >
                    <RefreshCw size={16} className={`mr-1 ${isLoadingDocuments ? 'animate-spin' : ''}`} /> 
                    {isLoadingDocuments ? 'Loading...' : 'Refresh Data'}
                </button>
            </h2>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <MetricCard 
                    title="Total Invoices"
                    value={totalInvoiceCount}
                    icon={FileText}
                    color="border-blue-500"
                />
                <MetricCard 
                    title="Total Quotations"
                    value={totalQuotationCount}
                    icon={FileSignature}
                    color="border-yellow-500"
                />
                <MetricCard 
                    title={`Monthly Revenue (${new Date().toLocaleString('default', { month: 'long' })})`}
                    value={monthlyRevenue}
                    icon={DollarSign}
                    color="border-green-500"
                />
            </div>
            
            {/* Documents List */}
            <h3 className="text-xl font-bold text-gray-700 mb-4 border-b pb-2">Saved Documents ({documents.length})</h3>

            <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">ID</th>
                            <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Type</th>
                            <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Client</th>
                            <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Date</th>
                            <th className="p-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-600">Total</th>
                            <th className="p-3 w-12 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100 text-sm">
                        {documents.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="p-4 text-center text-gray-500 italic">No saved documents found.</td>
                            </tr>
                        ) : (
                            documents.map((doc) => (
                                <DocumentRow 
                                    key={doc.documentNumber}
                                    doc={doc}
                                    handleLoadForEdit={handleLoadForEdit}
                                    handleDelete={deleteDocument}
                                />
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            
            {isLoadingDocuments && (
                <div className="p-4 text-center text-blue-600 font-medium">Loading documents...</div>
            )}
        </div>
    );
};

export default Dashboard;