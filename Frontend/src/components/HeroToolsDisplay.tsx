import React from 'react';
import { motion } from 'framer-motion';
import {
    Code2, Briefcase, BookOpen, Award,
    FolderGit2, Users, Calendar, Building2
} from 'lucide-react';

const HeroToolsDisplay = () => {
    return (
        <div className="relative w-full h-[500px] md:h-[600px] flex items-center justify-center overflow-hidden md:overflow-visible">

            {/* Background: Soft CSS Gradient & Texture (No Images) */}
            <div className="absolute inset-0 z-0 bg-white">
                {/* 1. Base Subtle Gradient */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-50/40 via-white to-white" />

                {/* 2. Soft Atmospheric Glows (Lavender / Violet) */}
                <div className="absolute top-[10%] right-[10%] w-[500px] h-[500px] bg-purple-100/40 rounded-full blur-[120px] mix-blend-multiply animate-pulse" style={{ animationDuration: '8s' }} />
                <div className="absolute bottom-[10%] left-[20%] w-[400px] h-[400px] bg-violet-50/40 rounded-full blur-[100px] mix-blend-multiply" />
            </div>

            {/* Container for Full Spread of Icons */}
            <div className="relative w-full h-full top-0 left-0 z-10">

                {/* --- Filler Text Elements --- */}
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1 }}
                    className="absolute top-[8%] left-[25%] text-slate-400 font-light text-sm md:text-base tracking-wide pointer-events-none select-none hidden md:block"
                >
                    Learn. Build. Grow.
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 1 }}
                    className="absolute top-[35%] right-[20%] text-slate-300 font-light text-sm tracking-wider pointer-events-none select-none hidden md:block"
                >
                    One workspace for everything.
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 1 }}
                    className="absolute bottom-[25%] left-[10%] text-purple-200/80 font-normal text-sm md:text-lg tracking-widest pointer-events-none select-none hidden md:block"
                >
                    SKILLS &bull; CAREERS
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5, duration: 1 }}
                    className="absolute bottom-[2%] right-[30%] text-slate-300 font-light text-xs tracking-wide pointer-events-none select-none hidden md:block"
                >
                    From learning to placement
                </motion.div>


                {/* --- Floating Icons --- */}

                {/* 1. Coding (Top Right) - Blue */}
                <FloatingIcon
                    icon={Code2}
                    label="Coding"
                    color="text-blue-600"
                    bgColor="bg-blue-50"
                    hoverShadow="rgba(37, 99, 235, 0.15)"
                    className="absolute top-[8%] right-[10%]"
                    delay={0}
                />

                {/* 2. Courses (Top Left) - Amber */}
                <FloatingIcon
                    icon={BookOpen}
                    label="Courses"
                    color="text-amber-600"
                    bgColor="bg-amber-50"
                    hoverShadow="rgba(217, 119, 6, 0.15)"
                    className="absolute top-[15%] left-[5%]"
                    delay={1.5}
                />

                {/* 3. Projects (Top Middle/Right) - Indigo */}
                <FloatingIcon
                    icon={FolderGit2}
                    label="Projects"
                    color="text-indigo-600"
                    bgColor="bg-indigo-50"
                    hoverShadow="rgba(79, 70, 229, 0.15)"
                    className="absolute top-[20%] right-[35%]"
                    delay={2.2}
                />

                {/* 4. Events (Center Left) - Pink */}
                <FloatingIcon
                    icon={Calendar}
                    label="Events"
                    color="text-pink-600"
                    bgColor="bg-pink-50"
                    hoverShadow="rgba(219, 39, 119, 0.15)"
                    className="absolute top-[45%] left-[15%]"
                    delay={3.1}
                />

                {/* 5. Internships (Bottom Right) - Emerald */}
                <FloatingIcon
                    icon={Building2}
                    label="Internships"
                    color="text-emerald-600"
                    bgColor="bg-emerald-50"
                    hoverShadow="rgba(5, 150, 105, 0.15)"
                    className="absolute bottom-[20%] right-[20%]"
                    delay={0.5}
                />

                {/* 6. Jobs (Bottom Right - Lower) - Violet */}
                <FloatingIcon
                    icon={Briefcase}
                    label="Jobs"
                    color="text-violet-600"
                    bgColor="bg-violet-50"
                    hoverShadow="rgba(124, 58, 237, 0.15)"
                    className="absolute bottom-[8%] right-[5%]"
                    delay={2.8}
                />

                {/* 7. Mentorship (Bottom Left) - Cyan */}
                <FloatingIcon
                    icon={Users}
                    label="Mentorship"
                    color="text-cyan-600"
                    bgColor="bg-cyan-50"
                    hoverShadow="rgba(8, 145, 178, 0.15)"
                    className="absolute bottom-[15%] left-[8%]"
                    delay={1.8}
                />

                {/* 8. Certification (Bottom Center) - Rose */}
                <FloatingIcon
                    icon={Award}
                    label="Certify"
                    color="text-rose-600"
                    bgColor="bg-rose-50"
                    hoverShadow="rgba(225, 29, 72, 0.15)"
                    className="absolute bottom-[10%] left-[40%]"
                    delay={3.5}
                />

            </div>
        </div>
    );
};

// Reusable Floating Icon Component
const FloatingIcon = ({ icon: Icon, label, color, bgColor, hoverShadow, className, delay }) => {
    return (
        <motion.div
            className={`${className} flex flex-col items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-md border border-white/60 bg-white group cursor-default z-10`}
            initial={{ y: 20, opacity: 0 }}
            animate={{
                y: [0, -15, 0],
                opacity: 1
            }}
            transition={{
                y: {
                    duration: 5 + Math.random() * 2, // Randomize duration slightly
                    ease: "easeInOut",
                    repeat: Infinity,
                    delay: delay
                },
                opacity: { duration: 0.8, delay: delay * 0.5 }
            }}
            whileHover={{
                scale: 1.15,
                boxShadow: `0 20px 40px -5px ${hoverShadow}`,
                zIndex: 50
            }}
        >
            <div className={`p-2 md:p-3 rounded-xl ${bgColor} bg-opacity-50 group-hover:bg-opacity-100 transition-all duration-300`}>
                <Icon className={`w-5 h-5 md:w-7 md:h-7 ${color}`} strokeWidth={1.5} />
            </div>

            <span className={`mt-1 md:mt-2 text-[9px] md:text-[10px] font-medium text-slate-500 group-hover:${color} transition-colors`}>
                {label}
            </span>
        </motion.div>
    );
};

export default HeroToolsDisplay;

