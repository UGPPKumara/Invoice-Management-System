// src/views/CompanyProfileManager.jsx

import React, { useState } from 'react';
import { Briefcase, Save } from 'lucide-react';
import InvoiceInput from '../components/Shared/InvoiceInput';

const CompanyProfileManager = ({ companyProfile, setCompanyProfile, showStatus }) => {
    const [tempProfile, setTempProfile] = useState(companyProfile);

    const handleSave = (e) => {
        e.preventDefault();
        setCompanyProfile(tempProfile); // This function now saves to Firestore via useFirestoreData
    };

    return (
        <div className="p-6 bg-white rounded-xl shadow-xl">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
                <Briefcase size={28} className="mr-3 text-blue-500" />
                Manage Company Profile
            </h2>

            <form onSubmit={handleSave} className="space-y-6 max-w-lg">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Company Name</label>
                    <InvoiceInput
                        value={tempProfile.name}
                        onChange={(val) => setTempProfile(p => ({ ...p, name: val }))}
                        placeholder="e.g., Nuvoora IT Solutions"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Tagline (Appears in Invoice Footer)</label>
                    <InvoiceInput
                        value={tempProfile.tagline}
                        onChange={(val) => setTempProfile(p => ({ ...p, tagline: val }))}
                        placeholder="e.g., Shaping Tomorrow with a Fresh Vision."
                    />
                </div>
                <h3 className="text-xl font-semibold pt-4 border-t mt-4">Contact Details (Invoice Header)</h3>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Email Address</label>
                    <InvoiceInput
                        type="email"
                        value={tempProfile.contactMail}
                        onChange={(val) => setTempProfile(p => ({ ...p, contactMail: val }))}
                        placeholder="e.g., info@nuvoora.com"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Mobile Number</label>
                    <InvoiceInput
                        value={tempProfile.contactMobile}
                        onChange={(val) => setTempProfile(p => ({ ...p, contactMobile: val }))}
                        placeholder="e.g., +94 75 5111 360"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Website URL</label>
                    <InvoiceInput
                        value={tempProfile.website}
                        onChange={(val) => setTempProfile(p => ({ ...p, website: val }))}
                        placeholder="e.g., www.nuvoora.com"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg"
                >
                    <Save size={20} />
                    <span>Save Profile Changes</span>
                </button>
            </form>
        </div>
    );
};

export default CompanyProfileManager;