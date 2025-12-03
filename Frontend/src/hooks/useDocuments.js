// src/hooks/useDocuments.js (Modified to handle loading state more robustly)

import { useState, useEffect, useCallback, useMemo } from 'react';
import { collection, doc, getDocs, setDoc, deleteDoc } from "firebase/firestore";
import { db, getCurrentUserId } from '../firebase';
import { formatCurrency } from '../utils/formatCurrency';

const COLLECTION_NAME = "user_documents";

export const useDocuments = (isAuthenticated, showStatus) => {
    const [documents, setDocuments] = useState([]);
    const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);

    const userId = getCurrentUserId();
    // Path: admin_data/{userId}/documents/{documentId}
    const collectionRef = userId ? collection(db, COLLECTION_NAME, userId, 'documents') : null;

    // --- Document CRUD Operations ---

    // READ: Fetch all saved documents
    const fetchDocuments = useCallback(async () => {
        if (!collectionRef) return;

        setIsLoadingDocuments(true);
        try {
            const snapshot = await getDocs(collectionRef);
            const loadedDocuments = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setDocuments(loadedDocuments);
            showStatus('success', `Found ${loadedDocuments.length} saved documents.`);
        } catch (error) {
            console.error("Error fetching documents:", error);
            // Added explicit error status check
            if (error.code === 'permission-denied') {
                 showStatus('error', 'Security Error: Check Firestore permissions for user_documents.');
            } else {
                 showStatus('error', 'Failed to load saved documents.');
            }
        } finally {
            // Guarantee loading state is cleared regardless of success or failure.
            setIsLoadingDocuments(false); 
        }
    }, [collectionRef, showStatus]);

    // ... (rest of the useDocuments.js hook remains the same)

    const saveDocument = useCallback(async (documentData, docId = documentData.documentNumber) => {
        if (!collectionRef || !docId) {
             showStatus('error', 'Cannot save document: missing ID or user data.');
             return false;
        }

        try {
            const docRef = doc(collectionRef, docId);
            await setDoc(docRef, documentData, { merge: true });
            
            fetchDocuments(); 
            showStatus('success', `${documentData.documentType} ${docId} saved successfully!`);
            return true;
        } catch (error) {
            console.error("Error saving document:", error);
             showStatus('error', `Failed to save ${documentData.documentType}.`);
            return false;
        }
    }, [collectionRef, fetchDocuments, showStatus]);

    const deleteDocument = useCallback(async (docId, type) => {
        if (!collectionRef) return;
        
        if (window.confirm(`Are you sure you want to permanently delete ${type} ${docId}?`)) {
            try {
                const docRef = doc(collectionRef, docId);
                await deleteDoc(docRef);
                
                setDocuments(prev => prev.filter(d => d.documentNumber !== docId));
                showStatus('success', `${type} ${docId} deleted.`);
            } catch (error) {
                console.error("Error deleting document:", error);
                showStatus('error', `Failed to delete ${type}.`);
            }
        }
    }, [collectionRef, showStatus]);


    const { 
        totalInvoiceCount, 
        totalQuotationCount, 
        monthlyRevenue 
    } = useMemo(() => {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        let totalInvoiceCount = 0;
        let totalQuotationCount = 0;
        let monthlyRevenue = 0;

        documents.forEach(doc => {
            if (doc.documentType === 'Invoice') {
                totalInvoiceCount++;
                
                const docDate = new Date(doc.date); 
                
                if (docDate.getMonth() === currentMonth && docDate.getFullYear() === currentYear) {
                    monthlyRevenue += doc.total || 0; 
                }
            } else if (doc.documentType === 'Quotation') {
                totalQuotationCount++;
            }
        });

        return {
            totalInvoiceCount,
            totalQuotationCount,
            monthlyRevenue: formatCurrency(monthlyRevenue), 
        };
    }, [documents]);

    useEffect(() => {
        if (isAuthenticated && userId) {
            fetchDocuments();
        }
    }, [isAuthenticated, userId, fetchDocuments]);

    return {
        documents,
        isLoadingDocuments,
        fetchDocuments,
        saveDocument,
        deleteDocument,
        totalInvoiceCount,
        totalQuotationCount,
        monthlyRevenue,
    };
};