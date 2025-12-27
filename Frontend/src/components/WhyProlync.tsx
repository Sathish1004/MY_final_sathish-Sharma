import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, TrendingUp, Briefcase, Zap } from 'lucide-react';

const WhyProlync = () => {
    const blocks = [
        {
            title: "Built for Students",
            description: "Prolync is designed as a next-generation student workspace connecting learning, practice, mentorship, and placements in one ecosystem.",
            icon: GraduationCap,
            color: "bg-blue-500/10 text-blue-600",
            delay: 0.1
        },
        {
            title: "Proven Impact",
            description: "Thousands of learners empowered through hands-on labs, real-world projects, certifications, and mentor-led guidance.",
            icon: TrendingUp,
            color: "bg-purple-500/10 text-purple-600",
            delay: 0.2
        },
        {
            title: "Career-Focused Workspace",
            description: "From coding playgrounds to internships and placements, Prolync bridges the gap between education and industry.",
            icon: Briefcase,
            color: "bg-emerald-500/10 text-emerald-600",
            delay: 0.3
        },
        {
            title: "Scalable & Future-Ready",
            description: "Built to scale across colleges and universities with a modern, enterprise-ready learning platform.",
            icon: Zap,
            color: "bg-amber-500/10 text-amber-600",
            delay: 0.4
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const cardVariants: any = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
        }
    };

    return (
        <section className="py-24 bg-white relative overflow-hidden">
            <div className="container mx-auto px-4 md:px-8">

                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight"
                    >
                        Why Prolync
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-lg md:text-xl text-slate-600 leading-relaxed font-medium"
                    >
                        Empowering students with a unified workspace for learning, skills, and career success.
                    </motion.p>
                </div>

                {/* Content blocks */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto"
                >
                    {blocks.map((block, index) => (
                        <motion.div
                            key={index}
                            variants={cardVariants}
                            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                            className="group bg-white rounded-3xl p-8 md:p-10 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 relative overflow-hidden flex flex-col items-start gap-6"
                        >
                            {/* Decorative background accent */}
                            <div className={`absolute top-0 right-0 w-32 h-32 opacity-5 rounded-bl-full transition-opacity group-hover:opacity-10 pointer-events-none ${block.color.split(' ')[0]}`} />

                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${block.color} shrink-0`}>
                                <block.icon className="w-7 h-7" />
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xl md:text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                    {block.title}
                                </h3>
                                <p className="text-slate-600 text-base md:text-lg leading-relaxed">
                                    {block.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default WhyProlync;
