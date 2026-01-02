import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface FeatureFlag {
    id: number;
    feature_key: string;
    feature_name: string;
    is_enabled: boolean;
}

interface FeatureContextType {
    features: Record<string, boolean>;
    loading: boolean;
    isFeatureEnabled: (key: string) => boolean;
}

const FeatureContext = createContext<FeatureContextType | undefined>(undefined);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export function FeatureProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [features, setFeatures] = useState<Record<string, boolean>>({});
    const [loading, setLoading] = useState(true);

    const fetchFeatures = async () => {
        try {
            // Using the admin/all endpoint as it returns all features in one request
            const res = await fetch(`${API_URL}/api/features/admin/all`);
            if (res.ok) {
                const data: FeatureFlag[] = await res.json();
                const featureMap: Record<string, boolean> = {};
                data.forEach(f => {
                    featureMap[f.feature_key] = f.is_enabled;
                });

                // Only update if changes found to prevent unnecessary re-renders
                setFeatures(prev => {
                    const isDifferent = JSON.stringify(prev) !== JSON.stringify(featureMap);
                    return isDifferent ? featureMap : prev;
                });
            }
        } catch (error) {
            console.error("Failed to fetch features", error);
        } finally {
            setLoading(false);
        }
    };

    // Poll for updates (Real-time reflection) - Only when user is logged in
    useEffect(() => {
        if (user) {
            fetchFeatures(); // Initial fetch on login
            const interval = setInterval(fetchFeatures, 3000); // 3 seconds for faster updates
            return () => clearInterval(interval);
        } else {
            // Stop polling on logout.
            // We can optionally clear features here if we want strictly "no data", 
            // but for features/maintenance flags, keeping last known state might be okay.
            // However, to follow strict "clean state" rule:
            // setFeatures({}); 
        }
    }, [user]);

    const isFeatureEnabled = (key: string) => {
        // If loading, assume enabled? Or disabled? 
        // Better to assume enabled to prevent flash of content hiding? 
        // Or disabled for security?
        // Let's assume DISABLED if not found, unless loading (handled by UI)
        return features[key] ?? false;
    };

    return (
        <FeatureContext.Provider value={{ features, loading, isFeatureEnabled }}>
            {children}
        </FeatureContext.Provider>
    );
}

export function useFeatures() {
    const context = useContext(FeatureContext);
    if (context === undefined) {
        throw new Error('useFeatures must be used within a FeatureProvider');
    }
    return context;
}
