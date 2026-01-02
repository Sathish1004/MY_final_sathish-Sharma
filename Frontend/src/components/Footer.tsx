import React from 'react';
import { Link } from 'react-router-dom';
import {
    GraduationCap,
    ArrowRight,
    Globe,
    Mail,
    Shield,
    Star,
    Heart,
    CheckCircle2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Footer = () => {
    const { user } = useAuth();
    return (
        <footer className="bg-gradient-to-br from-[#020617] via-[#0b1221] to-[#020617] text-slate-300 border-t border-white/5 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20 pointer-events-none" />
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-[1700px] mx-auto px-6 pt-16 pb-10 md:pt-24 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">

                    <div className="lg:col-span-4 space-y-4">
                        <div className="inline-flex items-center justify-center bg-white rounded-xl p-1 md:p-1.5 shadow-2xl shadow-black/40 border border-white/10">
                            <img
                                src="/prolync_logo.png"
                                alt="Prolync Logo"
                                className="h-8 md:h-7 w-auto object-contain"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = "/logo.png"; // Fallback
                                }}
                            />
                        </div>

                        <div className="space-y-3 pt-2">
                            <p className="text-slate-100 font-medium text-lg leading-relaxed max-w-sm">
                                Building the next-generation workspace for education.
                            </p>
                            <p className="text-slate-400 text-base leading-relaxed max-w-sm">
                                Connecting students, colleges, and universities in one unified digital ecosystem. We bridge the gap between academia and industry through AI-driven learning and real-world career opportunities.
                            </p>
                        </div>
                    </div>

                    {/* Center Section: Quick Links */}
                    <div className="lg:col-span-3">
                        <h3 className="text-white font-bold text-lg mb-8 flex items-center gap-3">
                            Quick Links
                            <span className="h-[2px] w-12 bg-blue-500/50 rounded-full"></span>
                        </h3>
                        <ul className="grid gap-4">
                            {(user ? [
                                { label: "Dashboard", href: "/dashboard" },
                                { label: "Courses", href: "/courses" },
                                { label: "Coding Arena", href: "/coding" },
                                { label: "Mentorship", href: "/mentors" },
                                { label: "Jobs & Internships", href: "/jobs" },
                                { label: "Projects", href: "/projects" },
                                { label: "Events", href: "/events" },
                                { label: "Certifications", href: "/dashboard" }, // Fallback to dashboard for now
                                { label: "Community", href: "/dashboard" },
                                { label: "Pricing", href: "/pricing" }
                            ] : [
                                { label: "Home", href: "/" },
                                { label: "Why Prolync?", href: "/#why-choose-workspace" },
                                { label: "Pricing", href: "/pricing" },
                                { label: "About Us", href: "/about-prolync" },
                                { label: "Contact", href: "/contact" },
                                { label: "Login / Register", href: "/login" }
                            ]).map((item, i) => (
                                <li key={i}>
                                    <Link
                                        to={item.href}
                                        className="group flex items-center gap-2 text-slate-400 hover:text-white transition-all duration-300"
                                        onClick={() => window.scrollTo(0, 0)}
                                    >
                                        <ArrowRight className="w-3.5 h-3.5 text-blue-500 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                        <span className="text-[15px]">{item.label}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Center-Right Section: Learning Hub */}
                    <div className="lg:col-span-2">
                        <h3 className="text-white font-bold text-lg mb-8 flex items-center gap-3">
                            Learning Hub
                            <span className="h-[2px] w-8 bg-purple-500/50 rounded-full"></span>
                        </h3>
                        <ul className="grid gap-4">
                            {[
                                { label: "About Prolync", href: "/about-prolync" },
                                { label: "Privacy Policy", href: "/privacy-policy" },
                                { label: "Terms of Use", href: "/terms-of-use" },
                                { label: "Refund Policy", href: "/refund-policy" },
                                { label: "Support & FAQs", href: "/support" },
                                { label: "Contact Support", href: "/contact-support" }
                            ].map((item, i) => (
                                <li key={i}>
                                    <Link
                                        to={item.href}
                                        className={`transition-all duration-300 text-[15px] ${window.location.pathname === item.href
                                            ? 'text-white font-bold'
                                            : 'text-slate-400 hover:text-white'
                                            }`}
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Right Section: Connect & Address */}
                    <div className="lg:col-span-3 space-y-8">
                        <div>
                            <h3 className="text-white font-bold text-lg mb-8 flex items-center gap-3">
                                Connect With Us
                                <span className="h-[2px] w-12 bg-blue-500/50 rounded-full"></span>
                            </h3>

                            <div className="text-slate-400 text-[15px] leading-relaxed space-y-1 mb-8">
                                <p>Block 2, Off No. 14, CIIC Campus,</p>
                                <p>Crescent University, GST Road,</p>
                                <p>Vandalur, Chennai, Tamil Nadu – 600048.</p>
                            </div>

                            <div className="flex gap-4 flex-wrap">
                                {[
                                    { icon: Globe, color: 'hover:bg-blue-600', href: 'https://www.prolync.in/' },
                                    { icon: Mail, color: 'hover:bg-purple-600', href: 'mailto:contact@prolync.in' },
                                ].map((social, idx) => (
                                    <a
                                        key={idx}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white ${social.color} transition-all duration-500 hover:scale-110 hover:shadow-lg hover:shadow-black/20`}
                                    >
                                        <social.icon className="w-5 h-5" />
                                    </a>
                                ))}
                                <a
                                    href="https://www.linkedin.com/company/prolync"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#0077b5] transition-all duration-500 hover:scale-110"
                                >
                                    <span className="font-bold text-sm">in</span>
                                </a>
                                <a
                                    href="#"
                                    className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-red-600 transition-all duration-500 hover:scale-110"
                                >
                                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" /></svg>
                                </a>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Bottom Section: Copyright & Legal */}
                <div className="border-t border-slate-800/60 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
                    <p>
                        &copy; 2025 <span className="text-slate-400 font-medium">Prolync Infotech.in  Pvt  Ltd</span>. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-blue-400 transition-colors">Cookies</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
