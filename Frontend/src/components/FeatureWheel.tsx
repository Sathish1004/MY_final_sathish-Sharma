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

    // Radius of the circle
    const radius = 220; // Increased radius for spacing

    return (
        <div className="relative w-full h-[350px] md:h-[600px] flex items-center justify-center overflow-hidden">

            {/* Background Grid Pattern (Subtle) */}
            <div className="absolute inset-0 z-0 bg-transparent opacity-30"
                style={{ backgroundImage: 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
            </div>

            {/* Central Hub with Premium Booking CTA */}
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute z-20 flex items-center justify-center perspective-[1000px]"
            >
                <motion.button
                    onClick={() => navigate('/pricing')}
                    animate={{
                        rotateX: [0, 10, 0, -5, 0], // Gentle top-tilt loop
                        y: [0, -4, 0, -2, 0] // Subtle float
                    }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    whileHover={{ scale: 1.05, rotateX: 0, y: 0 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative group cursor-pointer"
                >
                    {/* Glow Effect (Pulsing) */}
                    <div className={`absolute inset-0 rounded-full blur-xl transition-all duration-1000 group-hover:bg-opacity-70
                        ${showAltText ? 'bg-emerald-500/40' : 'bg-blue-500/40'}
                    `} />

                    {/* Button Shape */}
                    <div className={`relative px-8 py-4 rounded-full shadow-lg border border-white/20 overflow-hidden min-w-[200px] flex items-center justify-center transition-all duration-1000
                        ${showAltText
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-emerald-500/30'
                            : 'bg-gradient-to-r from-blue-600 to-cyan-500 shadow-blue-500/30'}
                    `}>

                        {/* Shimmer/Sheen Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 translate-x-[-200%] animate-shimmer" />

                        {/* Animated Text Content */}
                        <AnimatePresence mode='wait'>
                            {!showAltText ? (
                                <motion.span
                                    key="premium"
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -15 }}
                                    transition={{ duration: 0.4 }}
                                    className="font-bold text-white text-lg tracking-wide whitespace-nowrap"
                                >
                                    Premium Booking
                                </motion.span>
                            ) : (
                                <motion.span
                                    key="booksoon"
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -15 }}
                                    transition={{ duration: 0.4 }}
                                    className="font-bold text-white text-lg tracking-wide whitespace-nowrap"
                                >
                                    Book Soon
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.button>
            </motion.div>

            {/* Orbiting Features */}
            <div className="relative w-[500px] h-[500px] z-10 flex items-center justify-center scale-[0.45] sm:scale-[0.6] md:scale-100 transition-transform duration-300">
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
                                delay: index * 0.1,
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
