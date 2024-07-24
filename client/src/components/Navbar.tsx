"use client";

import { DarkThemeToggle, Sidebar } from "flowbite-react";
import { FaChartLine, FaDownload, FaHandHoldingHand, FaHouse, FaLink, FaBars, FaUserSlash } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../auth/logout";
import { useAuth } from "../auth/AuthContext"; // Importer le contexte d'authentification
import { useState } from "react";

export function Navbar() {
    const { currentUser } = useAuth(); // Utiliser le hook pour obtenir l'utilisateur actuel
    const navigate = useNavigate();
    const [collapse, setCollapse] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/login'); // Rediriger vers la page de connexion après la déconnexion
    };

    // Afficher un message ou rediriger si l'utilisateur n'est pas connecté
    if (!currentUser) {
        return null;
    }

    return (
        // <Sidebar className="h-screen fixed top-0 left-0 shadow-md z-10 overflow-y-auto bg-gray-100 dark:bg-gray-700">
        <Sidebar className="h-screen fixed z-15" collapsed={collapse} >
            <Sidebar.Items className="flex justify-center items-center h-full">
                <Sidebar.ItemGroup className="flex flex-col gap-8">
                    <Sidebar.Item href="#" onClick={() => { setCollapse(!collapse) }} icon={FaBars}>
                        Menu
                    </Sidebar.Item>
                    <Sidebar.Item as={Link} to="/" icon={FaChartLine}>
                        Dashboard
                    </Sidebar.Item>
                    <Sidebar.Item as={Link} to="/associations" icon={FaHandHoldingHand}>
                        Associations
                    </Sidebar.Item>
                    <Sidebar.Item as={Link} to="/messagesHome" icon={FaHouse}>
                        Messages d'accueil
                    </Sidebar.Item>
                    <Sidebar.Item as={Link} to="/liens" icon={FaLink}>
                        Liens Utiles
                    </Sidebar.Item>
                    <Sidebar.Item as={Link} to="/updates" icon={FaDownload}>
                        Mise à jour
                    </Sidebar.Item>
                    <Sidebar.Item  onClick={handleLogout} color="failure" size="sm" icon={FaUserSlash}>
                        Déconnexion
                    </Sidebar.Item>
                    <DarkThemeToggle />
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
    );
}
