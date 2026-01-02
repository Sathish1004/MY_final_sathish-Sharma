import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronDown, User, Menu, X, LogOut, Settings, User as UserIcon, Bell, LayoutDashboard } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NavbarProps {
    onLoginClick: () => void;
}
export default function Navbar({ onLoginClick }: NavbarProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { user, signOut } = useAuth();

    const handleSignOut = () => {
        signOut();
        navigate('/login');
    };

    return (
        <nav className="fixed w-full z-50 top-0 start-0 bg-white shadow-none transition-all duration-300">
            <div className="container flex items-center justify-between h-20 px-6 mx-auto">
                {/* 1. Logo (Far Left) */}
                <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => {
                        navigate('/');
                        window.scrollTo(0, 0);
                    }}
                >
                    <img src="/prolync_logo.png" alt="Prolync" className="h-12 md:h-16 w-auto object-contain" />
                </div>

                {/* 2. Desktop Links (Right Aligned) */}
                <div className="hidden md:flex items-center gap-8 ml-auto mr-8">

                    {/* Why Workspace Dropdown */}
                    <div className="relative group">
                        <button className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors py-2 relative">
                            Why Workspace
                            <ChevronDown className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-180" />
                        </button>

                        {/* Dropdown Menu */}
                        <div className="absolute top-full right-0 w-56 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                            <div className="bg-white rounded-xl shadow-xl shadow-slate-200/50 border border-slate-100 p-2 flex flex-col gap-1 ring-1 ring-slate-900/5">
                                {['All in one space', 'Easy teach', 'Hybrid cloud', 'Learning'].map((item) => (
                                    <a
                                        key={item}
                                        href={item === 'All in one space' ? '/#why-choose-workspace' : '#'}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (item === 'All in one space') {
                                                if (location.pathname === '/') {
                                                    document.getElementById('why-choose-workspace')?.scrollIntoView({ behavior: 'smooth' });
                                                } else {
                                                    navigate('/', { state: { scrollTo: 'why-choose-workspace' } });
                                                }
                                            }
                                        }}
                                        className="text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-blue-50 hover:text-blue-600 text-slate-600 transition-colors text-left"
                                    >
                                        {item}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Other Links */}
                    {['Pricing', 'Blog', 'About Prolync', 'Contact Us'].map((item) => (
                        <a
                            key={item}
                            href={item === 'Pricing' ? '/pricing' : item === 'Blog' ? '/blog' : item === 'About Prolync' ? '/about-prolync' : item === 'Contact Us' ? '/contact' : '#'}
                            onClick={(e) => {
                                e.preventDefault();
                                const path = item === 'Pricing' ? '/pricing' : item === 'Blog' ? '/blog' : item === 'About Prolync' ? '/about-prolync' : '/contact';
                                navigate(path);
                            }}
                            className="relative text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors py-2 group"
                        >
                            {item}
                        </a>
                    ))}
                </div>

                {/* 3. Auth Section (Far Right) & Mobile Toggle */}
                <div className="flex items-center gap-4">


                    <div className="hidden md:flex items-center gap-4">
                        {!user ? (
                            // GUEST USER STATE - Only Icon
                            <div
                                className="h-9 w-9 rounded-full bg-slate-50 flex items-center justify-center border border-slate-200 hover:border-blue-200 hover:bg-blue-50 transition-colors cursor-pointer group"
                                onClick={onLoginClick}
                                title="Login"
                            >
                                <User className="h-4 w-4 text-slate-500 group-hover:text-blue-600 transition-colors" />
                            </div>
                        ) : (
                            // LOGGED IN USER STATE - DROPDOWN
                            <>
                                <Button
                                    variant="ghost"
                                    className="hidden lg:flex items-center gap-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50"
                                    onClick={() => navigate(user.role === 'ADMIN' ? '/admin' : '/dashboard')}
                                >
                                    <span className="font-medium">Dashboard</span>
                                </Button>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Avatar className="h-10 w-10 border border-blue-200 cursor-pointer hover:shadow-md transition-all">
                                            <AvatarImage src={user.profile_picture ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${user.profile_picture}` : undefined} />
                                            <AvatarFallback className="bg-blue-100 text-blue-700 font-bold text-sm">
                                                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                            </AvatarFallback>
                                        </Avatar>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56 bg-white rounded-xl shadow-xl border border-slate-100 p-2">
                                        <DropdownMenuLabel className="font-normal">
                                            <div className="flex flex-col space-y-1">
                                                <p className="text-sm font-medium leading-none text-slate-900">{user.name}</p>
                                                <p className="text-xs leading-none text-slate-500">{user.email}</p>
                                            </div>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator className="bg-slate-100 my-2" />
                                        <DropdownMenuItem className="cursor-pointer rounded-lg hover:bg-slate-50 focus:bg-slate-50 text-slate-700" onClick={() => navigate(user.role === 'ADMIN' ? '/admin' : '/dashboard')}>
                                            <LayoutDashboard className="mr-2 h-4 w-4" />
                                            <span>Dashboard</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="cursor-pointer rounded-lg hover:bg-slate-50 focus:bg-slate-50 text-slate-700" onClick={() => navigate('/profile')}>
                                            <UserIcon className="mr-2 h-4 w-4" />
                                            <span>My Profile</span>
                                        </DropdownMenuItem>
                                        {!user.role || user.role !== 'ADMIN' ? (
                                            <DropdownMenuItem className="cursor-pointer rounded-lg hover:bg-slate-50 focus:bg-slate-50 text-slate-700" onClick={() => navigate('/settings')}>
                                                <Settings className="mr-2 h-4 w-4" />
                                                <span>Settings</span>
                                            </DropdownMenuItem>
                                        ) : null}
                                        <DropdownMenuSeparator className="bg-slate-100 my-2" />
                                        <DropdownMenuItem className="cursor-pointer rounded-lg hover:bg-red-50 focus:bg-red-50 text-red-600 focus:text-red-700" onClick={handleSignOut}>
                                            <LogOut className="mr-2 h-4 w-4" />
                                            <span>Sign Out</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-slate-600 hover:text-blue-600"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-slate-200 shadow-lg p-4 flex flex-col gap-4 animate-in slide-in-from-top-5">
                    {/* Mobile Links */}
                    <div className="flex flex-col gap-2">
                        <div className="font-medium text-slate-900 px-2 py-1">Why Workspace</div>
                        <div className="pl-4 flex flex-col gap-2">
                            {['All in one space', 'Easy teach', 'Hybrid cloud', 'Learning'].map((item) => (
                                <a key={item} href="#" className="text-sm text-slate-600 hover:text-blue-600">{item}</a>
                            ))}
                        </div>
                    </div>

                    {['Pricing', 'Blog', 'About Prolync', 'Contact Us'].map((item) => (
                        <a
                            key={item}
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                setMobileMenuOpen(false);
                                const path = item === 'Pricing' ? '/pricing' : item === 'Blog' ? '/blog' : item === 'About Prolync' ? '/about-prolync' : '/contact';
                                navigate(path);
                            }}
                            className="text-base font-medium text-slate-600 hover:text-blue-600 px-2 py-1"
                        >
                            {item}
                        </a>
                    ))}

                    <div className="h-px bg-slate-100 my-1" />

                    {!user ? (
                        <Button
                            className="w-full bg-slate-900 text-white hover:bg-blue-600"
                            onClick={() => {
                                setMobileMenuOpen(false);
                                onLoginClick();
                            }}
                        >
                            Login / Sign Up
                        </Button>
                    ) : (
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-3 px-2 py-2 bg-slate-50 rounded-lg">
                                <Avatar className="h-8 w-8 border border-blue-200">
                                    <AvatarImage src={user.profile_picture ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${user.profile_picture}` : undefined} />
                                    <AvatarFallback className="bg-blue-100 text-blue-700 font-bold text-xs">
                                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-slate-900">{user.name}</span>
                                    <span className="text-xs text-slate-500">{user.email}</span>
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                className="w-full justify-start"
                                onClick={() => {
                                    setMobileMenuOpen(false);
                                    navigate('/profile');
                                }}
                            >
                                <UserIcon className="mr-2 h-4 w-4" />
                                My Profile
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full justify-start"
                                onClick={() => {
                                    setMobileMenuOpen(false);
                                    navigate('/settings');
                                }}
                            >
                                <Settings className="mr-2 h-4 w-4" />
                                Settings
                            </Button>
                            <Button
                                variant="ghost"
                                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => {
                                    setMobileMenuOpen(false);
                                    handleSignOut();
                                }}
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                Sign Out
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
}
