import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { QuickLinkItem, getLinkPath } from '@/config/quickLinks';
import { ArrowRight, LogOut, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';

// Specific props for the component
interface SmartLinkProps {
    link: QuickLinkItem;
    className?: string;
    showIcon?: boolean;
    variant?: 'footer' | 'sidebar' | 'simple'; // Different styles if needed
}

export function SmartLink({ link, className, showIcon = false, variant = 'footer' }: SmartLinkProps) {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Visibility checks
    if (link.hideWhenAuth && user) return null;
    if (link.requiresAuth && !user) return null;

    const handleClick = (e: React.MouseEvent) => {
        // Scroll to top on navigation
        if (!link.publicPath.includes('#')) {
            window.scrollTo(0, 0);
        }

        // Special handling for "Login" link when user is ALREADY logged in
        if (link.id === 'login' && user) {
            e.preventDefault();
            // If it's the login link but we are logged in, we behave like a "Dashboard" link
            const target = user.role === 'ADMIN' ? '/admin' : '/dashboard';
            navigate(target);
            return;
        }

        // Handle Anchor links (Why Prolync)
        if (link.publicPath.startsWith('/#')) {
            // Let default behavior handle hash navigation if on same page, or navigate if not
            // But here we're using React Router Link, so we might need strict handling
            // For now, let's assume standard Link behavior is fine, but we might want to manually scroll
            if (location.pathname === '/' && link.publicPath.includes('#')) {
                e.preventDefault();
                const id = link.publicPath.split('#')[1];
                const element = document.getElementById(id);
                if (element) element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    // Determine target path
    let toPath = getLinkPath(link, user?.role);

    // Override Label if it's the "Login" link and user is logged in
    let label = link.label;
    if (link.id === 'login' && user) {
        label = 'Dashboard';
        toPath = user.role === 'ADMIN' ? '/admin' : '/dashboard';
    }

    // Styles
    const defaultFooterStyle = "group flex items-center gap-2 text-slate-400 hover:text-white transition-all duration-300";
    const simpleStyle = "text-sm text-slate-500 hover:text-blue-600 transition-colors";

    const finalClass = cn(
        variant === 'footer' ? defaultFooterStyle : simpleStyle,
        className
    );

    return (
        <Link
            to={toPath}
            className={finalClass}
            onClick={handleClick}
        >
            {variant === 'footer' && (
                <ArrowRight className="w-3.5 h-3.5 text-blue-500 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            )}
            {showIcon && link.icon && <link.icon className="w-4 h-4 mr-2" />}
            <span className={variant === 'footer' ? "text-[15px]" : ""}>{label}</span>
        </Link>
    );
}
