// src/components/AdminLogin.jsx

import React, { useState } from 'react';
import { LogIn } from 'lucide-react';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase';
import InvoiceInput from './Shared/InvoiceInput';

const AdminLogin = ({ showStatus }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoggingIn(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            showStatus('success', 'Login successful!');
        } catch (error) {
            let message = "Invalid email or password.";
            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
                message = "Invalid email or password.";
            } else if (error.code === 'auth/too-many-requests') {
                 message = "Access temporarily blocked. Please try again later."
            }
            showStatus('error', message);
            console.error("Login error:", error.message);
        } finally {
            setIsLoggingIn(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <form onSubmit={handleSubmit} className="p-8 bg-white rounded-xl shadow-2xl w-full max-w-sm border border-blue-100">
                <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">Admin Login</h2>
                <p className="text-xs text-gray-500 mb-6 text-center">Use the email/password registered in Firebase.</p>
                <div className="space-y-4">
                    <InvoiceInput type="email" value={email} onChange={setEmail} placeholder="Admin Email" />
                    <InvoiceInput type="password" value={password} onChange={setPassword} placeholder="Password" />
                </div>
                <button
                    type="submit"
                    disabled={isLoggingIn}
                    className="w-full mt-8 flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg disabled:opacity-50"
                >
                    <LogIn size={20} />
                    <span>{isLoggingIn ? 'Logging in...' : 'Login'}</span>
                </button>
            </form>
        </div>
    );
};

export default AdminLogin;