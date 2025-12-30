import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export default function AdminRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!user || user.role !== 'ADMIN') {
        // Redirect to login if not authenticated or not an admin
        // Pass openAuth state to trigger login modal if needed, or just standard login page
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
}
