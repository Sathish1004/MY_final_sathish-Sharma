import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, TrendingUp, Briefcase, Zap, ChevronLeft, ChevronRight, Star, Smile } from 'lucide-react';

const WhyProlync = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const blocks = [
        {
            title: "Built for Students",
            description: "Prolync is designed as a next-generation student workspace connecting learning, practice, mentorship, and placements in one ecosystem. We provide hands-on experience and real-world projects to prepare you for the industry.",
            icon: GraduationCap,
            gradient: "from-blue-50 to-blue-100/30",
            iconColor: "text-blue-600",
            iconBg: "bg-blue-600/10",
            accentColor: "bg-blue-600",
            author: "Learning Team",
            role: "Education Specialist"
        },
        {
            title: "Proven Impact",
            description: "Thousands of learners empowered through hands-on labs, real-world projects, certifications, and mentor-led guidance. Our statistics show a 95% placement rate for students completing our core tracks.",
            icon: TrendingUp,
            gradient: "from-purple-50 to-purple-100/30",
            iconColor: "text-purple-600",
            iconBg: "bg-purple-600/10",
            accentColor: "bg-purple-600",
            author: "Success Metrics",
            role: "Career Growth"
        },
        {
            title: "Career-Focused Workspace",
            description: "From coding playgrounds to internships and placements, Prolync bridges the gap between education and industry. We focus on building a sustainable ecosystem for student professional development.",
            icon: Briefcase,
            gradient: "from-emerald-50 to-emerald-100/30",
            iconColor: "text-emerald-600",
            iconBg: "bg-emerald-600/10",
            accentColor: "bg-emerald-600",
            author: "Placement Cell",
            role: "Industry Interface"
        },
        {
            title: "Scalable & Future-Ready",
            description: "Built to scale across colleges and universities with a modern, enterprise-ready learning platform. Our infrastructure supports million-plus concurrent users with seamless experience.",
            icon: Zap,
            gradient: "from-orange-50 to-orange-100/30",
            iconColor: "text-orange-600",
            iconBg: "bg-orange-600/10",
            accentColor: "bg-orange-600",
            author: "Tech Vision",
            role: "Platform Architecture"
        }
    ];

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % blocks.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + blocks.length) % blocks.length);
    };

    const activeBlock = blocks[currentIndex];
    const Icon = activeBlock.icon;

    return (
        <section id="why-choose-workspace" className="py-12 bg-white relative overflow-hidden">
            {/* Background Glow */}
            <div className={`absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br transition-all duration-1000 blur-[120px] opacity-20 pointer-events-none rounded-full ${activeBlock.gradient}`} />

            <div className="container mx-auto px-4 md:px-8 relative z-10">
                <div className="lg:grid lg:grid-cols-[1fr_1.5fr] lg:gap-24 items-center">

                    {/* Left Side: Content */}
                    <div className="max-w-xl mb-10 lg:mb-0">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-8 tracking-tight leading-[1.1]"
                        >
                            Why Choose <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Prolync</span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-lg md:text-xl text-slate-600 leading-relaxed font-medium mb-12"
                        >
                            Business owners and students from across the world share proven ways to work more efficiently and drive impact with our suite of products.
                        </motion.p>
                    </div>

                    {/* Right Side: Slider */}
                    <div className="relative group">
                        {/* Navigation Arrows */}
                        <button
                            onClick={handlePrev}
                            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 md:-translate-x-full z-20 w-12 h-12 bg-white rounded-full shadow-lg border border-slate-100 flex items-center justify-center text-slate-600 hover:text-blue-600 transition-all hover:scale-110 active:scale-95"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                            onClick={handleNext}
                            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 md:translate-x-full z-20 w-12 h-12 bg-white rounded-full shadow-lg border border-slate-100 flex items-center justify-center text-slate-600 hover:text-blue-600 transition-all hover:scale-110 active:scale-95"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>

                        <div className="relative overflow-hidden rounded-[2.5rem] bg-white border border-slate-100 shadow-2xl shadow-slate-200/50">
                            {/* Accent Top Border */}
                            <motion.div
                                className={`h-1.5 w-full ${activeBlock.accentColor} absolute top-0 left-0 z-10`}
                                layoutId="activeAccent"
                            />

                            {/* Floating Decorative Icon */}
                            <div className="absolute top-6 left-6 z-20">
                                <div className={`w-14 h-14 rounded-full ${activeBlock.accentColor} flex items-center justify-center text-white ring-[10px] ring-white shadow-xl`}>
                                    <Smile className="w-8 h-8" />
                                </div>
                            </div>

                            <div className="min-h-[320px] md:min-h-[380px] p-8 md:p-12 relative pt-16">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentIndex}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.5, ease: "easeOut" }}
                                        className="flex flex-col items-center text-center space-y-6"
                                    >
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map((i) => (
                                                <Star key={i} className="w-5 h-5 fill-slate-900 text-slate-900" />
                                            ))}
                                        </div>

                                        <p className="text-lg md:text-xl text-slate-600 leading-relaxed font-medium">
                                            "{activeBlock.description}"
                                        </p>

                                        <div className="space-y-2 pt-6">
                                            <h4 className="text-2xl font-bold text-slate-900">
                                                {activeBlock.author}
                                            </h4>
                                            <p className="text-slate-500 font-medium text-lg">
                                                {activeBlock.role}
                                            </p>
                                        </div>

                                        <div className="pt-8 flex items-center justify-center gap-3">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${activeBlock.iconBg} ${activeBlock.iconColor}`}>
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <span className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                                                Prolync
                                            </span>
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhyProlync;
