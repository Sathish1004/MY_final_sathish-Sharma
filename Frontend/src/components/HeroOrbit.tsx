import React from 'react';
import { motion } from 'framer-motion';
import {
    Code2,
    BookOpen,
    GraduationCap,
    Briefcase,
    MessageCircle,
    CheckCircle2,
    Award,
    Calendar,
    Layout,
    Globe,
    Cpu,
    Database
} from 'lucide-react';

const HeroOrbit = () => {
    // Icons configuration: [IconComponent, ColorClass, OrbitRadius, AnimationDelay, InitialAngle]
    const orbitIcons = [
        { Icon: Code2, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20", radius: 260, duration: 40, delay: 0 },
        { Icon: BookOpen, color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/20", radius: 320, duration: 50, delay: 2 },
        { Icon: GraduationCap, color: "text-pink-500", bg: "bg-pink-500/10", border: "border-pink-500/20", radius: 220, duration: 35, delay: 1 },
        { Icon: Briefcase, color: "text-indigo-500", bg: "bg-indigo-500/10", border: "border-indigo-500/20", radius: 290, duration: 45, delay: 3 },
        { Icon: MessageCircle, color: "text-cyan-500", bg: "bg-cyan-500/10", border: "border-cyan-500/20", radius: 240, duration: 38, delay: 4 },
        { Icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20", radius: 340, duration: 55, delay: 5 },
        { Icon: Award, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20", radius: 270, duration: 42, delay: 1.5 },
        { Icon: Database, color: "text-teal-500", bg: "bg-teal-500/10", border: "border-teal-500/20", radius: 310, duration: 48, delay: 2.5 },
        { Icon: Layout, color: "text-violet-500", bg: "bg-violet-500/10", border: "border-violet-500/20", radius: 200, duration: 32, delay: 0.5 },
        { Icon: Cpu, color: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-500/20", radius: 360, duration: 60, delay: 3.5 },
    ];

    return (
        <div className="relative w-full h-[600px] flex items-center justify-center overflow-visible">
            {/* Ambient Glow Center */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-[80px] animate-pulse-soft" />

            {/* Core decorative circles */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150px] h-[150px] bg-white/5 rounded-full border border-white/10 backdrop-blur-sm z-10" />

            {/* Orbit Container */}
            <div className="absolute inset-0 flex items-center justify-center">
                {orbitIcons.map((item, index) => (
                    <Orbitring
                        key={index}
                        {...item}
                        index={index}
                    />
                ))}
            </div>

            {/* Floating particles */}
            {[...Array(5)].map((_, i) => (
                <motion.div
                    key={`particle-${i}`}
                    className="absolute w-1 h-1 bg-blue-400 rounded-full"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                        opacity: [0, 1, 0],
                        scale: [0, 1.5, 0],
                        x: Math.random() * 400 - 200,
                        y: Math.random() * 400 - 200
                    }}
                    transition={{
                        duration: 3 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                        ease: "easeOut"
                    }}
                    style={{ top: '50%', left: '50%' }}
                />
            ))}
        </div>
    );
};

// Individual Orbit Ring Component to handle complex animations smoothly
const Orbitring = ({ Icon, color, bg, border, radius, duration, delay, index }: any) => {
    return (
        <motion.div
            className="absolute rounded-full flex items-center justify-center border border-slate-100/10"
            style={{
                width: radius * 2,
                height: radius * 2,
            }}
            animate={{ rotate: 360 }}
            transition={{
                duration: duration,
                repeat: Infinity,
                ease: "linear",
                delay: -delay * 5 // Negative delay to start at different positions
            }}
        >
            {/* Icon Container - Counter Rotates to stay upright */}
            <motion.div
                className="absolute -top-6 left-1/2 -translate-x-1/2"
                initial={{ scale: 0 }}
                animate={{
                    rotate: -360,
                    scale: 1
                }}
                transition={{
                    rotate: { duration: duration, repeat: Infinity, ease: "linear", delay: -delay * 5 },
                    scale: { duration: 0.5, delay: index * 0.1 }
                }}
            >
                <div
                    className={`
                        relative group cursor-pointer 
                        w-12 h-12 md:w-14 md:h-14 
                        rounded-2xl ${bg} ${border} border backdrop-blur-md 
                        flex items-center justify-center 
                        shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-${color}/20
                        transition-all duration-300
                        hover:scale-125 hover:z-50
                    `}
                >
                    <Icon className={`w-6 h-6 md:w-7 md:h-7 ${color} transition-transform duration-300 group-hover:scale-110`} />

                    {/* Hover Glow */}
                    <div className={`absolute inset-0 rounded-2xl ${bg} blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10`} />
                </div>
            </motion.div>
        </motion.div>
    );
};

export default HeroOrbit;
