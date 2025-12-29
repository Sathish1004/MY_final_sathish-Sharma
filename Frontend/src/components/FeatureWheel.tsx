import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Briefcase,
    GraduationCap,
    BookOpen,
    Code2,
    FolderGit2,
    Calendar,
    Users,
    Award
} from 'lucide-react';

const FeatureWheel = () => {
    const navigate = useNavigate();
    const [showAltText, setShowAltText] = useState(false);

    // Continuous Text Swap Interval
    useEffect(() => {
        const interval = setInterval(() => {
            setShowAltText(prev => !prev);
        }, 3000); // Swap every 3 seconds

        return () => clearInterval(interval);
    }, []);

    // Configuration for the icons distributed in a circle
    const features = [
        { icon: Briefcase, label: "Internships", color: "text-emerald-500", bg: "bg-emerald-50", iconBg: "bg-emerald-500", angle: -45 }, // Top Right ish
        { icon: GraduationCap, label: "Jobs", color: "text-blue-600", bg: "bg-blue-50", iconBg: "bg-blue-600", angle: 0 }, // Right
        { icon: BookOpen, label: "Courses", color: "text-orange-500", bg: "bg-orange-50", iconBg: "bg-orange-500", angle: 45 }, // Bottom Right
        { icon: Code2, label: "Coding", color: "text-cyan-500", bg: "bg-cyan-50", iconBg: "bg-cyan-500", angle: 90 }, // Bottom
        { icon: FolderGit2, label: "Projects", color: "text-purple-500", bg: "bg-purple-50", iconBg: "bg-purple-500", angle: 135 }, // Bottom Left
        { icon: Calendar, label: "Events", color: "text-pink-500", bg: "bg-pink-50", iconBg: "bg-pink-500", angle: 180 }, // Left
        { icon: Users, label: "Mentorship", color: "text-teal-500", bg: "bg-teal-50", iconBg: "bg-teal-500", angle: 225 }, // Top Left
        { icon: Award, label: "Certificates", color: "text-rose-500", bg: "bg-rose-50", iconBg: "bg-rose-500", angle: 270 }, // Top
    ];

    // Radius of the circle - now responsive
    const [radius, setRadius] = useState(220);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setRadius(160);
            } else {
                setRadius(220);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="relative w-full h-full flex items-center justify-center overflow-visible">

            {/* Background Grid Pattern (Subtle) */}
            <div className="absolute inset-0 z-0 bg-transparent opacity-20"
                style={{ backgroundImage: 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
            </div>

            {/* Premium Centerpiece: Unified Login Message */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="absolute z-20 flex flex-col items-center justify-center text-center px-4 w-full max-w-[240px] md:max-w-md"
            >
                <motion.div
                    animate={{
                        scale: [1, 1.02, 1],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="relative"
                >
                    {/* Background Soft Glow - Animating Colors */}
                    <motion.div
                        animate={{
                            backgroundColor: ['rgba(37, 99, 235, 0.05)', 'rgba(124, 58, 237, 0.05)', 'rgba(6, 182, 212, 0.05)', 'rgba(37, 99, 235, 0.05)'],
                            filter: ['blur(30px)', 'blur(50px)', 'blur(30px)'],
                        }}
                        transition={{ duration: 8, repeat: Infinity }}
                        className="absolute inset-x-[-30px] inset-y-[-15px] rounded-full z-0"
                    />

                    <div className="relative z-10 space-y-1 md:space-y-2">
                        <motion.h3
                            className="text-lg md:text-3xl lg:text-4xl font-black tracking-tighter text-slate-900 leading-[1.1]"
                            animate={{
                                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                            }}
                            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                            style={{
                                background: 'linear-gradient(to right, #1e293b, #3b82f6, #8b5cf6, #1e293b)',
                                backgroundSize: '300% auto',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            One Unified Login.
                        </motion.h3>
                        <p className="text-[9px] md:text-sm lg:text-lg font-bold text-slate-500 tracking-tight leading-none">
                            Your Entire Professional Ecosystem.
                        </p>

                        {/* Decorative Dot Line */}
                        <div className="flex items-center justify-center gap-1 md:gap-1.5 pt-1 md:pt-2">
                            {[1, 2, 3].map((i) => (
                                <motion.div
                                    key={i}
                                    animate={{
                                        opacity: [0.3, 1, 0.3],
                                        scale: [1, 1.2, 1]
                                    }}
                                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                                    className={`h-1 w-1 md:h-1.5 md:w-1.5 rounded-full ${i === 1 ? 'bg-blue-500' : i === 2 ? 'bg-purple-500' : 'bg-cyan-500'}`}
                                />
                            ))}
                        </div>
                    </div>
                </motion.div>
            </motion.div>

            {/* Orbiting Features */}
            <div className="relative w-full h-full z-10 flex items-center justify-center scale-[0.6] sm:scale-[0.7] md:scale-[0.8] lg:scale-100 transition-all duration-500">
                {features.map((item, index) => {
                    const angleRad = (item.angle * Math.PI) / 180;
                    const x = Math.cos(angleRad) * radius;
                    const y = Math.sin(angleRad) * radius;

                    return (
                        <motion.div
                            key={item.label}
                            initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                            animate={{ opacity: 1, scale: 1, x: x, y: y }}
                            transition={{
                                duration: 0.6,
                                delay: index * 0.05,
                                type: "spring", stiffness: 100
                            }}
                            className="absolute flex flex-col items-center justify-center p-4 bg-white rounded-[2rem] shadow-[0_10px_30px_rgba(0,0,0,0.08)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.12)] transition-shadow cursor-default w-28 h-28"
                        >
                            <div className={`w-12 h-12 rounded-xl ${item.iconBg} flex items-center justify-center mb-2 shadow-sm text-white`}>
                                <item.icon className="w-6 h-6" strokeWidth={2} />
                            </div>
                            <span className="text-xs font-bold text-slate-700">{item.label}</span>
                        </motion.div>
                    );
                })}
            </div>

        </div>
    );
};

export default FeatureWheel;
