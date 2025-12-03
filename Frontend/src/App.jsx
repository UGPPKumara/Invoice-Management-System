// src/App.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from './firebase';

// Import hooks and constants
import { INITIAL_FIRESTORE_DATA } from './constants/initialData';
import { useInvoice } from './hooks/useInvoice';
import { useFirestoreData } from './hooks/useFirestoreData';

// Import components and views
import AdminLogin from './components/AdminLogin';
import Sidebar from './components/Sidebar';
import MobileHeader from './components/MobileHeader';
import StatusMessage from './components/StatusMessage';
import InvoiceGenerator from './views/InvoiceGenerator';
import ServiceManagement from './views/ServiceManagement';
import CompanyProfileManager from './views/CompanyProfileManager';


const App = () => {
    // --- Global UI State ---
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentView, setCurrentView] = useState('WordPress');
    const [statusMessage, setStatusMessage] = useState({ type: null, text: '' });
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [initialAuthCheckComplete, setInitialAuthCheckComplete] = useState(false);

    // --- Status Utility ---
    const showStatus = useCallback((type, text) => {
        setStatusMessage({ type, text });
        setTimeout(() => setStatusMessage({ type: null, text: '' }), 3000);
    }, []);
    
    // --- FIRESTORE DATA HOOK ---
    // Manages loading and saving services, profile, and tax rate
    const { 
        services, setServices, 
        companyProfile, setCompanyProfile, 
        taxRate, setTaxRate, 
        isLoadingData 
    } = useFirestoreData(isAuthenticated, showStatus);


    // --- FIREBASE AUTHENTICATION LISTENER ---
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            }
            setInitialAuthCheckComplete(true); 
        });

        return () => unsubscribe();
    }, []);


    // --- LOGOUT HANDLER ---
    const handleLogout = async () => {
        try {
            await signOut(auth);
            setCurrentView('WordPress');
        } catch (error) {
             showStatus('error', 'Failed to log out.');
        }
    };
    
    // --- INVOICE CALCULATION HOOK ---
    const { 
        invoiceItems, setInvoiceItems, 
        invoiceHeader, setInvoiceHeader, 
        subtotal, taxAmount, total,
        updateInvoiceItem, removeInvoiceItem, addInvoiceItem, 
        addServiceToInvoice, handleClearInvoice
    } = useInvoice({ 
        services, 
        taxRate, 
        showStatus, 
        setCurrentView 
    });


    // --- Main Render Logic ---

    if (!initialAuthCheckComplete) {
        return <div className="flex items-center justify-center min-h-screen text-xl font-semibold text-gray-500">Initializing Authentication...</div>;
    }

    if (!isAuthenticated) {
        return <AdminLogin showStatus={showStatus} />;
    }
    
    if (isLoadingData) {
        return <div className="flex items-center justify-center min-h-screen text-xl font-semibold text-blue-600">Syncing Data from Cloud Firestore...</div>;
    }
    
    // Determine which content component to render
    const renderContent = () => {
        switch (currentView) {
            case 'invoice':
                return (
                    <InvoiceGenerator 
                        profile={companyProfile}
                        invoiceHeader={invoiceHeader}
                        setInvoiceHeader={setInvoiceHeader}
                        invoiceItems={invoiceItems}
                        subtotal={subtotal}
                        taxRate={taxRate}
                        taxAmount={taxAmount}
                        total={total}
                        handleClearInvoice={handleClearInvoice}
                        addInvoiceItem={addInvoiceItem}
                        updateInvoiceItem={updateInvoiceItem}
                        removeInvoiceItem={removeInvoiceItem}
                    />
                );
            case 'profile':
                return (
                    <CompanyProfileManager
                        companyProfile={companyProfile}
                        setCompanyProfile={setCompanyProfile}
                        showStatus={showStatus}
                    />
                );
            default:
                // Service Management (Category views)
                return (
                    <ServiceManagement 
                        category={currentView}
                        services={services}
                        setServices={setServices}
                        taxRate={taxRate}
                        setTaxRate={setTaxRate}
                        showStatus={showStatus}
                        addServiceToInvoice={addServiceToInvoice}
                    />
                );
        }
    }

    return (
        <div className="bg-gray-50 min-h-screen font-sans antialiased flex flex-col md:flex-row p-0 print:p-0">
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
            />
            
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden" 
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            <main className="flex-grow p-4 md:p-8 print:p-0">
                <div className="max-w-7xl mx-auto">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default App;