import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import LoginModal from "@/components/LoginModal";
import { useAuth } from "@/contexts/AuthContext";


export default function PublicLayout() {
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, loading, showOnboarding } = useAuth();

    useEffect(() => {
        // Redirect to dashboard if already logged in AND not in onboarding
        if (!loading && user && !showOnboarding) {
            // Only redirect if we are purely on /login page, but allow home /
            if (location.pathname === '/login') {
                navigate('/dashboard');
            }
        }

        // Check for openAuth state from other pages OR if searching for /login
        if (location.state?.openAuth || location.pathname === '/login') {
            setIsLoginModalOpen(true);
            // Clear state so it doesn't reopen on refresh, IF it was state-based
            if (location.state?.openAuth) {
                window.history.replaceState({}, document.title);
            }
        }
    }, [user, loading, navigate, location, showOnboarding]);

    return (
        <div className="min-h-screen bg-background font-sans">
            <Navbar onLoginClick={() => setIsLoginModalOpen(true)} />
            <main>
                <Outlet context={{ setIsLoginModalOpen }} />
            </main>
            <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />

        </div>
    );
}
