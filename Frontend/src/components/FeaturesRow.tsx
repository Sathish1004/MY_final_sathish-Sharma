import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionTemplate } from 'framer-motion';
import { BookOpen, Code2, Users, Briefcase, Calendar, ArrowUpRight, Building2, Sparkles } from 'lucide-react';

const features = [
    {
        id: 1,
        title: "Course Learning",
        subtitle: "Master the Fundamentals",
        description: "Industry-ready courses designed to take you from beginner to pro.",
        hoverDesc: "Access 100+ premium courses with hands-on projects.",
        icon: BookOpen,
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2671&auto=format&fit=crop",
        color: "from-blue-600 to-blue-400",
        shadow: "shadow-blue-500/20",
        border: "group-hover:border-blue-500/50"
    },
    {
        id: 2,
        title: "Coding Platform",
        subtitle: "Build & Deploy",
        description: "Practice real-world coding problems in our integrated IDE.",
        hoverDesc: "Run test cases, debug code, and track your progress daily.",
        icon: Code2,
        image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=2531&auto=format&fit=crop",
        color: "from-indigo-600 to-indigo-400",
        shadow: "shadow-indigo-500/20",
        border: "group-hover:border-indigo-500/50"
    },
    {
        id: 3,
        title: "Mentorship",
        subtitle: "Learn from Experts",
        description: "Get personalized guidance from industry professionals.",
        hoverDesc: "Book 1-on-1 sessions and get your career questions answered.",
        icon: Users,
        image: "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=2694&auto=format&fit=crop",
        color: "from-emerald-600 to-emerald-400",
        shadow: "shadow-emerald-500/20",
        border: "group-hover:border-emerald-500/50"
    },
    {
        id: 4,
        title: "Jobs & Internship",
        subtitle: "Launch Your Career",
        description: "Exclusive opportunities with top tech companies.",
        hoverDesc: "Apply to verified jobs and gain real-world experience.",
        icon: Building2,
        image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2670&auto=format&fit=crop",
        color: "from-orange-600 to-orange-400",
        shadow: "shadow-orange-500/20",
        border: "group-hover:border-orange-500/50"
    },
    {
        id: 5,
        title: "Exams & Updates",
        subtitle: "Stay Ahead",
        description: "Latest updates on exams, hackathons, and hiring drives.",
        hoverDesc: "Never miss a deadline with our real-time alerts.",
        icon: Briefcase,
        image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=2672&auto=format&fit=crop",
        color: "from-purple-600 to-purple-400",
        shadow: "shadow-purple-500/20",
        border: "group-hover:border-purple-500/50"
    },
    {
        id: 6,
        title: "Events",
        subtitle: "Network & Grow",
        description: "Join exclusive workshops, hackathons, and tech meetups.",
        hoverDesc: "Connect with peers and expand your professional network.",
        icon: Calendar,
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2670&auto=format&fit=crop",
        color: "from-rose-600 to-rose-400",
        shadow: "shadow-rose-500/20",
        border: "group-hover:border-rose-500/50"
    }
];

const FeatureCard = ({ feature, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`group relative w-full h-[260px] md:h-[320px] overflow-hidden rounded-[2rem] cursor-pointer border border-white/40 shadow-xl ${feature.shadow} transition-all duration-500 hover:shadow-2xl hover:-translate-y-2`}
        >
            {/* Background Image with Zoom Effect */}
            <div className="absolute inset-0">
                <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />

                {/* Default Dark Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-40" />

                {/* Colorful Hover Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t ${feature.color} opacity-0 group-hover:opacity-90 transition-opacity duration-500 mix-blend-multiply`} />
            </div>

            {/* Animated Gradient Border */}
            <div className={`absolute inset-0 border-2 border-transparent ${feature.border} rounded-[2rem] transition-colors duration-300 pointer-events-none`} />

            {/* Content Overlay */}
            <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between z-10">

                {/* Top: Icon and Badge */}
                <div className="flex justify-between items-start">
                    <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 group-hover:bg-white/20 transition-colors duration-300">
                        <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                        <div className="bg-white text-slate-900 rounded-full p-2">
                            <ArrowUpRight className="h-4 w-4" />
                        </div>
                    </div>
                </div>

                {/* Bottom: Text Content */}
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <MOTION_SPAN className={`text-xs font-bold uppercase tracking-wider bg-gradient-to-r ${feature.color} bg-clip-text text-transparent mb-2 inline-block`}>
                        {feature.subtitle}
                    </MOTION_SPAN>
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight">
                        {feature.title}
                    </h3>
                    <div className="relative overflow-hidden">
                        <p className="text-slate-300 text-sm md:text-base leading-relaxed group-hover:opacity-0 transition-opacity duration-300 absolute top-0 left-0 w-full line-clamp-2">
                            {feature.description}
                        </p>
                        <p className="text-white/90 text-sm md:text-base leading-relaxed opacity-0 translate-y-8 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                            {feature.hoverDesc}
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// Helper workaround for motion.span typescript issue if needed, though simple span works usually.
const MOTION_SPAN = motion.span;

export default function FeaturesRow() {
    return (
        <section className="relative py-32 bg-slate-50 overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-100/40 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-indigo-100/30 rounded-full blur-[80px] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-20 max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm mb-6"
                    >
                        <Sparkles className="h-4 w-4 text-indigo-500 fill-indigo-500" />
                        <span className="text-sm font-semibold text-slate-700">Unlock Your Potential</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight leading-tight"
                    >
                        Everything You Need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">Succeed</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-lg md:text-xl text-slate-600 leading-relaxed"
                    >
                        Access multiple learning and career domains with a single login.
                        Designed for students who want to build the future.
                    </motion.p>
                </div>

                {/* Grid Layout - Forced Single Row on Large Screens */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
                    {features.map((feature, index) => (
                        <FeatureCard key={feature.id} feature={feature} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}
