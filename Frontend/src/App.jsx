// src/App.jsx (Modified for Document Management and Dashboard)

import React, { useState, useEffect, useCallback } from 'react';
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from './firebase';

// Import hooks and constants
import { INITIAL_FIRESTORE_DATA } from './constants/initialData';
import { useInvoice } from './hooks/useInvoice';
import { useFirestoreData } from './hooks/useFirestoreData';
import { useDocuments } from './hooks/useDocuments'; // NEW: Document Management

// Import components and views
import AdminLogin from './components/AdminLogin';
import Sidebar from './components/Sidebar';
import MobileHeader from './components/MobileHeader';
import StatusMessage from './components/StatusMessage';
import DocumentGenerator from './views/InvoiceGenerator'; 
import ServiceManagement from './views/ServiceManagement';
import CompanyProfileManager from './views/CompanyProfileManager';
import Dashboard from './views/Dashboard'; // NEW: Dashboard View


const App = () => {
    // --- Global UI State ---
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    // Initial view changed to Dashboard
    const [currentView, setCurrentView] = useState('dashboard'); 
    const [statusMessage, setStatusMessage] = useState({ type: null, text: '' });
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [initialAuthCheckComplete, setInitialAuthCheckComplete] = useState(false);

    // --- Status Utility ---
    const showStatus = useCallback((type, text) => {
        setStatusMessage({ type, text });
        setTimeout(() => setStatusMessage({ type: null, text: '' }), 3000);
    }, []);
    
    // --- FIRESTORE DATA HOOKS ---
    // User Settings & Services
    const { 
        services, setServices, 
        companyProfile, setCompanyProfile, 
        taxRate, setTaxRate, 
        isLoadingData 
    } = useFirestoreData(isAuthenticated, showStatus);

    // Document Generation Logic
    const { 
        invoiceItems, setInvoiceItems, 
        invoiceHeader, setInvoiceHeader, 
        subtotal, taxAmount, total,
        documentType, switchDocumentType, 
        updateInvoiceItem, removeInvoiceItem, addInvoiceItem, 
        addServiceToInvoice, handleClearInvoice, loadDocumentData
    } = useInvoice({ 
        services, 
        taxRate, 
        showStatus, 
        setCurrentView 
    });
    
    // Document Management Logic (CRUD & Analytics)
    const {
        documents,
        isLoadingDocuments,
        fetchDocuments,
        saveDocument,
        deleteDocument,
        totalInvoiceCount,
        totalQuotationCount,
        monthlyRevenue,
    } = useDocuments(isAuthenticated, showStatus);


    // --- FIREBASE AUTHENTICATION LISTENER ---
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
                setCurrentView('WordPress'); // Reset view on logout
            }
            setInitialAuthCheckComplete(true); 
        });

        return () => unsubscribe();
    }, []);


    // --- LOGOUT HANDLER ---
    const handleLogout = async () => {
        try {
            await signOut(auth);
            setCurrentView('dashboard');
        } catch (error) {
             showStatus('error', 'Failed to log out.');
        }
    };
    
    // --- Document Save Handler (Combines all current document state) ---
    const handleSaveDocument = async () => {
        if (invoiceItems.length === 0) {
            showStatus('error', `Cannot save empty ${documentType}. Add items first.`);
            return;
        }

        const documentData = {
            ...invoiceHeader,
            invoiceItems,
            subtotal,
            taxAmount,
            total,
            documentType,
            // Include client name and total in top level for dashboard search/sort
            clientName: invoiceHeader.clientName,
        };
        
        const success = await saveDocument(documentData);
        if (success) {
            // Clear the editor after successful save
            handleClearInvoice(documentType);
            setCurrentView('dashboard'); // Redirect to dashboard to see the saved document
        }
    };

    // --- Main Render Logic ---

    if (!initialAuthCheckComplete) {
        return <div className="flex items-center justify-center min-h-screen text-xl font-semibold text-gray-500">Initializing Authentication...</div>;
    }

    if (!isAuthenticated) {
        return <AdminLogin showStatus={showStatus} />;
    }
    
    // MODIFIED: Removed isLoadingDocuments from the condition. Dashboard now manages its own loading screen.
    if (isLoadingData) { 
        return <div className="flex items-center justify-center min-h-screen text-xl font-semibold text-blue-600">Syncing Data from Cloud Firestore...</div>;
    }
    
    // Determine which content component to render
    const renderContent = () => {
        if (currentView === 'dashboard') {
            return (
                <Dashboard 
                    documents={documents}
                    isLoadingDocuments={isLoadingDocuments}
                    fetchDocuments={fetchDocuments}
                    deleteDocument={deleteDocument}
                    totalInvoiceCount={totalInvoiceCount}
                    totalQuotationCount={totalQuotationCount}
                    monthlyRevenue={monthlyRevenue}
                    handleLoadDocumentForEdit={loadDocumentData}
                    setCurrentView={setCurrentView}
                />
            );
        } else if (currentView === 'document') {
             return (
                    <DocumentGenerator 
                        profile={companyProfile}
                        invoiceHeader={invoiceHeader}
                        setInvoiceHeader={setInvoiceHeader}
                        invoiceItems={invoiceItems}
                        subtotal={subtotal}
                        taxRate={taxRate}
                        taxAmount={taxAmount}
                        total={total}
                        documentType={documentType} 
                        handleClearInvoice={handleClearInvoice}
                        addInvoiceItem={addInvoiceItem}
                        updateInvoiceItem={updateInvoiceItem}
                        removeInvoiceItem={removeInvoiceItem}
                        // NEW: Save functionality
                        handleSaveDocument={handleSaveDocument}
                    />
                );
        } else if (currentView === 'profile') {
            return (
                <CompanyProfileManager
                    companyProfile={companyProfile}
                    setCompanyProfile={setCompanyProfile}
                    showStatus={showStatus}
                />
            );
        } else {
            // Service Management (Category views) - handles 'WordPress', 'Websites', etc.
            return (
                <ServiceManagement 
                    category={currentView}
                    services={services}
                    setServices={setServices}
                    taxRate={taxRate}
                    setTaxRate={setTaxRate}
                    showStatus={showStatus}
                    addServiceToInvoice={addServiceToInvoice}
                    documentType={documentType} 
                />
            );
        }
    }


    return (
        <div className="bg-gray-50 font-sans antialiased flex flex-col min-h-screen md:flex-row md:h-screen md:overflow-hidden p-0 print:p-0">
            <StatusMessage type={statusMessage.type} text={statusMessage.text} />
            
            <MobileHeader setIsSidebarOpen={setIsSidebarOpen} />

            <Sidebar 
                services={services}
                currentView={currentView}
                setCurrentView={setCurrentView}
                setIsSidebarOpen={setIsSidebarOpen}
                isSidebarOpen={isSidebarOpen}
                handleLogout={handleLogout}
                invoiceItemCount={invoiceItems.length}
                // NEW props for document management
                documentType={documentType}
                switchDocumentType={switchDocumentType}
            />
            
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden" 
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            <main className="flex-grow p-4 md:p-8 print:p-0 md:overflow-y-auto">
                <div className="max-w-7xl mx-auto">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default App;