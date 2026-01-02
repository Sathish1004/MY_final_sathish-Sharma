import { useFeatures } from '@/contexts/FeatureContext';
import { Loader2 } from 'lucide-react';

interface FeatureGuardProps {
    feature: string;
    children: React.ReactNode;
    fallback?: React.ReactNode;
    quiet?: boolean;
}

export default function FeatureGuard({ feature, children, fallback = null, quiet = false }: FeatureGuardProps) {
    const { isFeatureEnabled, loading } = useFeatures();

    if (loading) {
        // Optional: Show loader or just render nothing until loaded
        // For smoother UI, we might render nothing or children?
        // Defaulting to null to avoid flashing
        return null;
    }

    if (!isFeatureEnabled(feature)) {
        if (quiet) return null;
        return <>{fallback}</>;
    }

    return <>{children}</>;
}
