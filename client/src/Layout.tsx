// src/Layout.tsx
import React from 'react';
import { Navbar } from './components/Navbar';
import { useAuth } from './auth/AuthContext';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const { currentUser } = useAuth(); // Utiliser le hook pour obtenir l'utilisateur actuel

    return (
        <div className="flex min-h-screen bg-gray-100 dark:bg-gray-700">
            {/* Sidebar */}
            {currentUser && (
                <Navbar />
            )}

            {/* Main content */}
            <div className="p-6 overflow-y-auto flex-grow max-md:ml-16">
                <div className="flex items-center justify-center gap-4 pt-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Layout;
