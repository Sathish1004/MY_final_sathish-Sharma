import { useState } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  LayoutDashboard,
  BookOpen,
  Code2,
  Briefcase,
  Users,
  Newspaper,
  FolderKanban,
  Calendar,
  MessageSquare,
  LogOut,
  Settings,
  PanelLeft,
  Home
} from 'lucide-react';
import { cn } from '@/lib/utils';
import OnboardingOverlay from "../OnboardingOverlay";
import { NotificationCenter } from "../NotificationCenter";

const navItems = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard, id: 'nav-item-dashboard' },
  { title: 'Courses', url: '/courses', icon: BookOpen, id: 'nav-item-courses' },
  { title: 'Coding Platform', url: '/coding', icon: Code2, id: 'nav-item-coding-platform' },
  { title: 'Jobs & Internships', url: '/jobs', icon: Briefcase, id: 'nav-item-jobs-internships' },
  { title: 'Mentors', url: '/mentors', icon: Users, id: 'nav-item-mentors' },
  { title: 'News & Updates', url: '/news', icon: Newspaper, id: 'nav-item-news-updates' },
  { title: 'Projects', url: '/projects', icon: FolderKanban, id: 'nav-item-projects' },
  { title: 'Events', url: '/events', icon: Calendar, id: 'nav-item-events' },
  { title: 'Placements', url: '/placements', icon: Briefcase, id: 'nav-item-placements' },
  { title: 'Feedback', url: '/feedback', icon: MessageSquare, id: 'nav-item-feedback' },
];

export default function DashboardLayout() {
  const { user, loading, showOnboarding, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar (Desktop) */}
      <aside className={`fixed inset-y-0 left-0 z-50 bg-slate-900 text-white transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-64' : 'w-28'} hidden md:flex flex-col shadow-xl`}>
        <div className={`h-16 flex items-center border-b border-slate-800 transition-all duration-300 ${isSidebarOpen ? 'px-6 justify-start' : 'justify-center p-0'}`}>
          {isSidebarOpen ? (
            <div className="bg-white px-4 py-2 rounded-xl flex items-center gap-3 shadow-sm">
              <img src="/brand-logo.png" alt="Prolync Logo" className="h-6 w-6 object-contain" />
              <span className="text-xl font-bold text-slate-900 tracking-tight">
                Prolync
              </span>
            </div>
          ) : (
            <div className="bg-white p-2 rounded-lg flex items-center justify-center">
              <img src="/brand-logo.png" alt="Prolync Logo" className="h-6 w-6 object-contain" />
            </div>
          )}
        </div>

        <div className="flex-1 py-6 overflow-y-auto">
          <nav className={`space-y-4 ${isSidebarOpen ? 'px-3' : 'px-1'}`}>
            {navItems.map((item) => {
              const isActive = location.pathname === item.url;
              return (
                <Link
                  key={item.title}
                  to={item.url}
                  id={item.id}
                  className={cn(
                    "w-full flex items-center py-3 rounded-lg transition-all duration-200 group relative",
                    isSidebarOpen ? "px-3" : "justify-center px-0",
                    isActive
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  )}
                  title={!isSidebarOpen ? item.title : ''}
                >
                  <item.icon className={cn(
                    "h-5 w-5 flex-shrink-0 transition-transform duration-200",
                    !isSidebarOpen && "group-hover:scale-110"
                  )} />
                  {isSidebarOpen && (
                    <span className="font-medium text-sm ml-3 animate-in fade-in slide-in-from-left-2 duration-200">
                      {item.title}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800">
          <Link
            to="/"
            className={cn(
              "w-full flex items-center py-3 rounded-lg transition-all duration-200 group relative text-slate-400 hover:bg-slate-800 hover:text-white",
              isSidebarOpen ? "px-3" : "justify-center px-0"
            )}
            title={!isSidebarOpen ? "Home Page" : ''}
          >
            <Home className={cn(
              "h-5 w-5 flex-shrink-0 transition-transform duration-200",
              !isSidebarOpen && "group-hover:scale-110"
            )} />
            {isSidebarOpen && (
              <span className="font-medium text-sm ml-3 animate-in fade-in slide-in-from-left-2 duration-200">
                Home Page
              </span>
            )}
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 min-w-0 flex flex-col min-h-screen relative transition-all duration-300 ease-in-out ${isSidebarOpen ? 'md:ml-64' : 'md:ml-28'}`}>
        {showOnboarding && <OnboardingOverlay />}

        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 px-4 md:px-6 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden md:flex text-slate-500 hover:text-slate-900 hover:bg-slate-100"
            >
              <PanelLeft className={cn("h-5 w-5 transition-transform duration-300", !isSidebarOpen && "rotate-180")} />
            </Button>
            <h1 className="text-xl font-bold text-slate-800 capitalize">
              {navItems.find(i => i.url === location.pathname)?.title || 'Dashboard'}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <NotificationCenter />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full border border-border/50 hover:bg-accent">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.profile_picture ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${user.profile_picture}` : undefined} alt={user?.name} />
                    <AvatarFallback className="bg-primary/10 text-primary font-medium text-xs">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer">
                  <Users className="mr-2 h-4 w-4" />
                  <span>My Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/settings')} className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive cursor-pointer focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 p-4 md:p-6 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
