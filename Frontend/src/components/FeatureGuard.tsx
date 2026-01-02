import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Clock, Rocket } from 'lucide-react';
import { useLocation } from 'react-router-dom';

interface FeatureGuardProps {
    feature: string;
    children: React.ReactNode;
    quiet?: boolean;
}

export default function FeatureGuard({ feature, children, quiet = false }: FeatureGuardProps) {
    // Feature guard disabled - strictly rendering children
    return <>{children}</>;
}
