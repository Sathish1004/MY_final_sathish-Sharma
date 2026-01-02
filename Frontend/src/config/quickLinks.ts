import { LucideIcon, LayoutDashboard, Home, Percent, Info, Mail, LogIn, LogOut } from 'lucide-react';

export interface QuickLinkItem {
    id: string;
    label: string;
    publicPath: string; // URL for non-logged-in users
    studentPath?: string; // URL for students (defaults to publicPath if undefined)
    adminPath?: string; // URL for admins (defaults to publicPath if undefined)
    icon?: LucideIcon;
    requiresAuth?: boolean; // If true, only visible when logged in (optional)
    hideWhenAuth?: boolean; // If true, only visible when logged out (e.g. "Login")
    isExternal?: boolean;
}

export const quickLinks: QuickLinkItem[] = [
    {
        id: 'home',
        label: 'Home',
        publicPath: '/',
        studentPath: '/dashboard',
        adminPath: '/admin',
        icon: Home
    },
    {
        id: 'why-prolync',
        label: 'Why Prolync?',
        publicPath: '/#why-choose-workspace',
        studentPath: '/dashboard', // Maybe redirect to a specific dashboard section or keep as #
        adminPath: '/admin',
        icon: Info
    },
    {
        id: 'pricing',
        label: 'Pricing',
        publicPath: '/pricing',
        studentPath: '/pricing', // Students can see pricing too? Or maybe billing? Keeping pricing for now.
        adminPath: '/admin', // Admin probably doesn't need pricing, maybe redirect to settings?
        icon: Percent
    },
    {
        id: 'about',
        label: 'About Us',
        publicPath: '/about-prolync',
        studentPath: '/about-prolync',
        adminPath: '/about-prolync',
        icon: Info
    },
    {
        id: 'contact',
        label: 'Contact',
        publicPath: '/contact',
        studentPath: '/contact',
        adminPath: '/contact',
        icon: Mail
    },
    {
        id: 'login',
        label: 'Login / Register',
        publicPath: '/login',
        studentPath: '/dashboard', // If logged in, go to dashboard
        adminPath: '/admin',
        hideWhenAuth: true, // Special handling might be needed in regular footer, but SmartLink can handle "if auth, show Dashboard/Logout"
        icon: LogIn
    }
];

// Helper to get the correct path based on user role
export const getLinkPath = (link: QuickLinkItem, role?: string): string => {
    if (!role) return link.publicPath;
    if (role === 'ADMIN' || role === 'admin') return link.adminPath || link.publicPath;
    return link.studentPath || link.publicPath;
};
