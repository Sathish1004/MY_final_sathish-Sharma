import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { lazy, Suspense } from "react";

// Pages
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import CodingPlatform from "./pages/CodingPlatform";
import Jobs from "./pages/Jobs";
import Mentors from "./pages/Mentors";
import News from "./pages/News";
import Projects from "./pages/Projects";
import Events from "./pages/Events";
import Feedback from "./pages/Feedback";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

// Lazy loaded pages
const Pricing = lazy(() => import('./pages/Pricing'));
const Payment = lazy(() => import('./pages/Payment'));
const Placements = lazy(() => import('./pages/Placements'));
const Blog = lazy(() => import('./pages/Blog'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const Contact = lazy(() => import('./pages/Contact'));
const Profile = lazy(() => import('./pages/Profile'));
const Settings = lazy(() => import('./pages/Settings'));
const CourseDetails = lazy(() => import('./pages/CourseDetails'));
const SharedProgress = lazy(() => import('./pages/SharedProgress'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfUse = lazy(() => import('./pages/TermsOfUse'));
const RefundPolicy = lazy(() => import('./pages/RefundPolicy'));
const Support = lazy(() => import('./pages/Support'));
const ContactSupport = lazy(() => import('./pages/ContactSupport'));
const FeatureDetail = lazy(() => import('./pages/FeatureDetail'));

// Layout
import DashboardLayout from "./components/layout/DashboardLayout";
import PublicLayout from "./components/layout/PublicLayout";
import AdminRoute from "./components/auth/AdminRoute";
import ScrollToTop from "./components/ScrollToTop";
import { Loader2 } from "lucide-react";

const queryClient = new QueryClient();

// Loading Fallback
const PageLoader = () => (
  <div className="h-screen w-full flex items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-right" />
      <BrowserRouter>
        <ScrollToTop />
        <AuthProvider>
          <NotificationProvider>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Admin Routes */}
                <Route path="/admin" element={<AdminRoute><Outlet /></AdminRoute>}>
                  <Route path="dashboard" element={<AdminDashboard />} />
                </Route>

                {/* Shared Progress Route (Public, Standalone) */}
                <Route path="/share/:token" element={<SharedProgress />} />

                {/* Public routes with Global Navbar */}
                <Route element={<PublicLayout />}>
                  <Route path="/" element={<Index />} />
                  <Route path="/feature/:featureId" element={<FeatureDetail />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/payment" element={<Payment />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:id" element={<Blog />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/about-prolync" element={<About />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/terms-of-use" element={<TermsOfUse />} />
                  <Route path="/refund-policy" element={<RefundPolicy />} />
                  <Route path="/support" element={<Support />} />
                  <Route path="/contact-support" element={<ContactSupport />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/login" element={<Index />} />
                </Route>

                {/* Protected routes with Dashboard Layout */}
                <Route element={<DashboardLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/courses" element={<Courses />} />
                  <Route path="/courses/:courseId" element={<CourseDetails />} />
                  <Route path="/coding" element={<CodingPlatform />} />
                  <Route path="/placements" element={<Placements />} />
                  <Route path="/jobs" element={<Jobs />} />
                  <Route path="/mentors" element={<Mentors />} />
                  <Route path="/news" element={<News />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/events" element={<Events />} />
                  <Route path="/feedback" element={<Feedback />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/settings" element={<Settings />} />
                </Route>

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </NotificationProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
