import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Rocket,
    Target,
    Users,
    Briefcase,
    Award,
    BookOpen,
    ChevronRight,
    Sparkles,
    CheckCircle2,
    X,
    PlayCircle,
    Lightbulb,
    ArrowUpRight,
    ArrowLeft
} from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const aboutCards = [
    {
        id: 'vision',
        title: "Student Workspace Vision",
        description: "Our vision is to provide a unified digital ecosystem that empowers students to manage their entire educational journey in one place.",
        icon: <Rocket className="h-6 w-6 text-blue-500" />,
        gradient: "from-blue-500/10 via-blue-500/5 to-transparent",
        border: "border-blue-500/20",
        animation: { x: -100, opacity: 0 },
        details: {
            headline: "Redefining the Student Lifecycle",
            subheadline: "A centralized command center for your academic and career goals.",
            highlights: [
                "Unified Dashboard for all educational tools and resources.",
                "Personalized learning paths tailored to individual interests.",
                "Advanced progress tracking and skill analytics.",
                "Seamless collaboration features for student communities."
            ],
            stats: [
                { label: "Centralized Tools", value: "15+" },
                { label: "Faster Access", value: "40%" },
                { label: "Productivity Boost", value: "2x" }
            ]
        }
    },
    {
        id: 'learning',
        title: "Skill-Based Learning",
        description: "We focus on industry-relevant skills, providing curated courses and interactive coding platforms to bridge the gap between academia and industry.",
        icon: <Target className="h-6 w-6 text-purple-500" />,
        gradient: "from-purple-500/10 via-purple-500/5 to-transparent",
        border: "border-purple-500/20",
        animation: { y: 100, opacity: 0 },
        details: {
            headline: "Learning That Translates into Performance",
            subheadline: "Going beyond theory with practical, hands-on experience.",
            highlights: [
                "Integrated Coding Playgrounds for instant practice.",
                "Curriculum-aligned projects mirroring real-world tasks.",
                "Expert-led masterclasses on trending technologies.",
                "Assessment-driven certification recognized by employers."
            ],
            stats: [
                { label: "Hands-on Hours", value: "1000+" },
                { label: "Tech Stacks", value: "20+" },
                { label: "Lab Accuracy", value: "99%" }
            ]
        }
    },
    {
        id: 'mentorship',
        title: "Real-World Projects & Mentorship",
        description: "Connect with industry experts for 1:1 mentorship and work on real-world projects that add significant value to your professional portfolio.",
        icon: <Users className="h-6 w-6 text-emerald-500" />,
        gradient: "from-emerald-500/10 via-emerald-500/5 to-transparent",
        border: "border-emerald-500/20",
        animation: { x: 100, opacity: 0 },
        details: {
            headline: "Direct Access to Industry Wisdom",
            subheadline: "Learn from those who are already where you want to be.",
            highlights: [
                "1:1 Live Mentorship sessions with FAANG professionals.",
                "Portfolio-worthy industry projects with code reviews.",
                "Exclusive networking opportunities with tech leaders.",
                "Personalized resume and interview preparation guidance."
            ],
            stats: [
                { label: "Expert Mentors", value: "200+" },
                { label: "Guided Projects", value: "50+" },
                { label: "Member Growth", value: "85%" }
            ]
        }
    },
    {
        id: 'placement',
        title: "Career & Placement Readiness",
        description: "Our platform tracks your journey from learning to placement, ensuring you are career-ready with resume building and internship opportunities.",
        icon: <Briefcase className="h-6 w-6 text-orange-500" />,
        gradient: "from-orange-500/10 via-orange-500/5 to-transparent",
        border: "border-orange-500/20",
        animation: { y: 50, opacity: 0 },
        details: {
            headline: "Your Bridge to the Tech Industry",
            subheadline: "Where skill meets opportunity.",
            highlights: [
                "Exclusive hiring drives for certified Prolync students.",
                "Direct internship-to-PPO conversion guidance.",
                "Verified skill badges instantly visible to recruiters.",
                "Comprehensive mock interview support with AI insights."
            ],
            stats: [
                { label: "Partnerships", value: "100+" },
                { label: "Avg Salary Increase", value: "50%" },
                { label: "Placement Rate", value: "92%" }
            ]
        }
    }
];

export default function About() {
    const [selectedCard, setSelectedCard] = useState<typeof aboutCards[0] | null>(null);

    // Lock scroll when full page is open
    useEffect(() => {
        if (selectedCard) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [selectedCard]);

    return (
        <div className="min-h-screen bg-slate-50/50 pt-28 pb-20 relative overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-100/30 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-100/20 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2" />

            <div className="container max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-semibold mb-6"
                    >
                        <Sparkles className="h-4 w-4" />
                        Empowering Future Tech Leaders
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight leading-tight"
                    >
                        About <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Prolync</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-lg md:text-xl text-slate-600 leading-relaxed font-medium"
                    >
                        A Unified Student & Educational Workspace designed to bridge the gap between learning and professional success.
                    </motion.p>
                </div>

                {/* Journey Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
                    {aboutCards.map((card, index) => (
                        <motion.div
                            key={card.id}
                            initial={card.animation}
                            whileInView={{ x: 0, y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{
                                duration: 0.8,
                                delay: index * 0.1,
                                ease: [0.21, 0.47, 0.32, 0.98]
                            }}
                            whileHover={{ y: -10 }}
                            onClick={() => setSelectedCard(card)}
                            className={`group p-8 rounded-[2rem] bg-white border ${card.border} shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 relative overflow-hidden h-full flex flex-col items-start cursor-pointer`}
                        >
                            {/* Subtle Gradient Background */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                            <div className="relative z-10 w-full h-full flex flex-col">
                                <div className="p-3 rounded-2xl bg-white shadow-sm border border-slate-100 mb-6 w-fit">
                                    {card.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors">
                                    {card.title}
                                </h3>
                                <p className="text-slate-600 leading-relaxed text-sm md:text-base mb-6">
                                    {card.description}
                                </p>
                                <div className="mt-auto flex items-center text-blue-600 font-semibold text-sm group/link">
                                    Learn More
                                    <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover/link:translate-x-1" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Mission Statement */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-[3rem] p-12 md:p-20 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden text-center"
                >
                    <div className="absolute top-0 right-0 p-8">
                        <BookOpen className="h-12 w-12 text-blue-100" />
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8 max-w-4xl mx-auto">
                        "We are building the next-gen platform where education meets application."
                    </h2>
                    <p className="text-slate-600 text-lg leading-relaxed max-w-3xl mx-auto mb-10">
                        Prolync is not just a tool; it's a partner in your professional journey. From masterclasses and hackathons to placement assistance and profile building, we provide everything a student needs to excel in today's competitive landscape.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <div className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-50 text-slate-700 font-semibold text-sm">
                            <Award className="h-5 w-5 text-amber-500" />
                            Skill Certification
                        </div>
                        <div className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-50 text-slate-700 font-semibold text-sm">
                            <Users className="h-5 w-5 text-indigo-500" />
                            Community Driven
                        </div>
                        <div className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-50 text-slate-700 font-semibold text-sm">
                            <Rocket className="h-5 w-5 text-red-500" />
                            Placement Focused
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Full Page Detail Overlay */}
            <AnimatePresence>
                {selectedCard && (
                    <motion.div
                        initial={{ opacity: 0, y: '100%' }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-0 z-[100] bg-white overflow-hidden"
                    >
                        {/* Header Navigation */}
                        <div className="absolute top-0 left-0 right-0 h-24 bg-white/80 backdrop-blur-md border-b border-slate-100 z-50 px-6 md:px-12 flex items-center justify-between">
                            <Button
                                variant="ghost"
                                onClick={() => setSelectedCard(null)}
                                className="flex items-center gap-2 text-slate-600 hover:text-blue-600 font-bold text-sm md:text-base group"
                            >
                                <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
                                <span>Back to About Page</span>
                            </Button>

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSelectedCard(null)}
                                className="h-12 w-12 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-100"
                            >
                                <X className="h-6 w-6 text-slate-900" />
                            </Button>
                        </div>

                        <ScrollArea className="h-full pt-24">
                            <div className="p-8 md:p-16 max-w-7xl mx-auto">
                                <div className="flex flex-col lg:flex-row gap-16 items-start w-full">
                                    {/* Left: Content */}
                                    <div className="flex-1 space-y-12">
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-3">
                                                <div className="p-3 rounded-2xl bg-slate-50 shadow-sm border border-slate-100">
                                                    {selectedCard.icon}
                                                </div>
                                                <Badge variant="secondary" className="px-3 py-1 bg-blue-50 text-blue-600 font-bold border-none">
                                                    {selectedCard.title}
                                                </Badge>
                                            </div>
                                            <h2 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
                                                {selectedCard.details.headline}
                                            </h2>
                                            <p className="text-xl md:text-2xl text-slate-500 font-medium max-w-3xl">
                                                {selectedCard.details.subheadline}
                                            </p>
                                        </div>

                                        <div className="grid gap-6">
                                            {selectedCard.details.highlights.map((point, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: i * 0.1 + 0.3 }}
                                                    className="flex items-start gap-5 p-6 rounded-[2rem] bg-slate-50/50 hover:bg-slate-50 transition-all border border-slate-100/50 hover:border-slate-200 group"
                                                >
                                                    <div className="shrink-0 h-8 w-8 mt-1 rounded-full bg-green-100 flex items-center justify-center border border-green-200 shadow-sm">
                                                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                                                    </div>
                                                    <p className="text-xl text-slate-700 leading-relaxed font-semibold">
                                                        {point}
                                                    </p>
                                                </motion.div>
                                            ))}
                                        </div>

                                        <div className="flex flex-wrap gap-6 pt-10">
                                            <Button size="lg" className="rounded-[1.5rem] px-10 h-16 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg group shadow-xl shadow-blue-500/20 transition-all">
                                                Start Expedition
                                                <ArrowUpRight className="ml-2 h-6 w-6 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                                            </Button>
                                            <Button variant="outline" size="lg" className="rounded-[1.5rem] px-10 h-16 border-slate-200 text-slate-600 font-bold text-lg hover:bg-slate-50">
                                                Download Brochure
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Right: Stats & Vision */}
                                    <div className="w-full lg:w-[400px] shrink-0 space-y-10">
                                        <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl border border-white/5">
                                            <div className="absolute top-0 right-0 p-6 opacity-10">
                                                <Sparkles className="h-32 w-32" />
                                            </div>
                                            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-600/20 rounded-full blur-[80px]" />

                                            <h4 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-10 relative z-10">Section Performance</h4>
                                            <div className="grid gap-12 relative z-10">
                                                {selectedCard.details.stats.map((stat, i) => (
                                                    <div key={i} className="space-y-2 group/stat">
                                                        <p className="text-5xl font-black group-hover:text-blue-400 transition-colors">{stat.value}</p>
                                                        <p className="text-slate-400 text-sm font-bold group-hover:text-slate-300 transition-colors uppercase tracking-wider">{stat.label}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="p-10 rounded-[3rem] border border-slate-100 bg-slate-50/50 space-y-8 relative group">
                                            <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-[3rem]" />
                                            <div className="flex items-center gap-3 text-slate-900 font-bold text-xl relative z-10">
                                                <Lightbulb className="h-6 w-6 text-amber-500" />
                                                Strategic Tip
                                            </div>
                                            <p className="text-lg text-slate-600 leading-relaxed font-medium relative z-10">
                                                Join our community of 10,000+ students already utilizing these features to accelerate their careers. <strong>Active participation</strong> in hackathons increases placement chances by 3x.
                                            </p>
                                            <div className="flex items-center gap-2 text-sm font-extrabold text-blue-600 cursor-pointer hover:underline relative z-10 group/demo">
                                                <PlayCircle className="h-5 w-5 transition-transform group-hover/demo:scale-110" />
                                                Watch Platform Excellence Demo
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom Disclaimer/Closing */}
                                <div className="mt-32 pt-16 border-t border-slate-100 text-center space-y-4">
                                    <img src="/prolync_logo.png" alt="Prolync" className="h-10 mx-auto opacity-50 grayscale" />
                                    <p className="text-base text-slate-400 font-semibold uppercase tracking-widest">
                                        © 2025 Prolyncinfotech Private Limited
                                    </p>
                                </div>
                            </div>
                        </ScrollArea>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}