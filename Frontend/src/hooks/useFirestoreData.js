// src/hooks/useFirestoreData.js (FIXED for Stability and Permissions)

import { useState, useEffect, useCallback } from 'react';
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db, getCurrentUserId } from '../firebase';
import { INITIAL_FIRESTORE_DATA } from '../constants/initialData';

const COLLECTION_NAME = "admin_data";

export const useFirestoreData = (isAuthenticated, showStatus) => {
    const [services, setServicesState] = useState(INITIAL_FIRESTORE_DATA.services);
    const [companyProfile, setCompanyProfileState] = useState(INITIAL_FIRESTORE_DATA.companyProfile);
    const [taxRate, setTaxRateState] = useState(INITIAL_FIRESTORE_DATA.taxRate);
    const [isLoadingData, setIsLoadingData] = useState(true);

    const userId = getCurrentUserId();
    const docRef = userId ? doc(db, COLLECTION_NAME, userId) : null;

    // --- Data Saving Utility ---
    const saveData = useCallback(async (updates, successMessage = 'Data saved successfully!') => {
        if (!docRef) return;
        
        try {
            // Use updateDoc if the document definitely exists, otherwise setDoc with merge
            await setDoc(docRef, updates, { merge: true }); 
            showStatus('success', successMessage);
        } catch (error) {
            console.error("Error saving data:", error);
            // This often hits on permission errors if rules are wrong
            showStatus('error', 'Failed to save data. Check Firestore rules.');
        }
    }, [docRef, showStatus]);
    
    // Custom setters that trigger a save operation
    const setAndSaveServices = (newServices) => {
        setServicesState(newServices);
        saveData({ services: newServices }, 'Services updated and saved.');
    };

    const setAndSaveCompanyProfile = (newProfile) => {
        setCompanyProfileState(newProfile);
        saveData({ companyProfile: newProfile }, 'Company Profile updated and saved.');
    };

    const setAndSaveTaxRate = (newRate) => {
        setTaxRateState(newRate);
        saveData({ taxRate: newRate }, 'Tax rate updated and saved.');
    };

    // --- Data Loading (Transactional Load) ---
    useEffect(() => {
        if (!isAuthenticated || !docRef) {
            setIsLoadingData(false);
            return;
        }

        const loadData = async () => {
            setIsLoadingData(true);
            try {
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    // Document exists, load the data
                    const data = docSnap.data();
                    setServicesState(data.services || INITIAL_FIRESTORE_DATA.services);
                    setCompanyProfileState(data.companyProfile || INITIAL_FIRESTORE_DATA.companyProfile);
                    setTaxRateState(data.taxRate || INITIAL_FIRESTORE_DATA.taxRate);
                    showStatus('info', 'Latest data synchronized from cloud.');
                } else {
                    // Document doesn't exist (first login), create it with initial data
                    await setDoc(docRef, INITIAL_FIRESTORE_DATA);
                    showStatus('info', 'Welcome! Initial data configured in cloud.');
                }
            } catch (error) {
                console.error("Firestore read error:", error);
                // This often hits on permission errors
                showStatus('error', 'Error reading data from cloud. Check console for details.');
            } finally {
                setIsLoadingData(false);
            }
        };

        loadData();
    }, [isAuthenticated, docRef, showStatus]);

    return {
        services, setServices: setAndSaveServices,
        companyProfile, setCompanyProfile: setAndSaveCompanyProfile,
        taxRate, setTaxRate: setAndSaveTaxRate,
        isLoadingData,
    };
};