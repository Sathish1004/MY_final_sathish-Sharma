import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
    BookOpen, Code2, Terminal, FolderGit2,
    Users, Briefcase, Target, Calendar,
    Bell, AlertCircle, BarChart3, HeartHandshake,
    MessageSquare, FileText, GraduationCap, Award
} from 'lucide-react';

const stackItems = [
    { icon: BookOpen, label: "Courses", color: "text-lime-400" },
    { icon: Code2, label: "Coding Playground", color: "text-cyan-400" },
    { icon: Terminal, label: "Test Cases", color: "text-emerald-400" },
    { icon: FolderGit2, label: "Projects", color: "text-violet-400" },
    { icon: Users, label: "Mentorship", color: "text-pink-400" },
    { icon: Briefcase, label: "Internships", color: "text-amber-400" },
    { icon: Target, label: "Placements", color: "text-rose-400" },
    { icon: Calendar, label: "Events & Workshops", color: "text-blue-400" },
    { icon: Bell, label: "Exam Notifications", color: "text-yellow-400" },
    { icon: AlertCircle, label: "Important Updates", color: "text-orange-400" },
    { icon: BarChart3, label: "Progress Tracking", color: "text-teal-400" },
    { icon: HeartHandshake, label: "Career Guidance", color: "text-purple-400" },
    { icon: MessageSquare, label: "Mock Interviews", color: "text-sky-400" },
    { icon: FileText, label: "Resume Review", color: "text-indigo-400" },
    { icon: GraduationCap, label: "Learning Paths", color: "text-green-400" },
    { icon: Award, label: "Certifications", color: "text-red-400" }
];

export default function WorkspaceStack() {
    const [isPaused, setIsPaused] = useState(false);
    const row1Ref = useRef(null);
    const row2Ref = useRef(null);

    // Duplicated for seamless loop
    const duplicatedItems = [...stackItems, ...stackItems];

    useEffect(() => {
        const row1 = row1Ref.current;
        const row2 = row2Ref.current;
        if (!row1 || !row2) return;

        let animationFrameId;
        let startTime = null;
        let row1Position = 0;
        let row2Position = 0;
        const row1Speed = 0.3;
        const row2Speed = 0.4;

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;

            if (!isPaused) {
                const elapsed = timestamp - startTime;
                row1Position = (elapsed * row1Speed) % (row1.scrollWidth / 2);
                row2Position = (elapsed * row2Speed) % (row2.scrollWidth / 2);
                row1.style.transform = `translateX(-${row1Position}px)`;
                row2.style.transform = `translateX(-${row2Position}px)`;
            }
            animationFrameId = requestAnimationFrame(animate);
        };
        animationFrameId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrameId);
    }, [isPaused]);

    return (
        <section className="py-10 md:py-16 bg-white relative">
            <div className="container mx-auto px-4 md:px-6 relative">

                {/* Small Blue Floating Box (Height Reduced 30%) */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="absolute right-4 top-4 md:right-6 md:top-6 z-40 w-[90%] max-w-[360px] md:max-w-none md:w-[38%] lg:w-[30%] bg-gradient-to-br from-[#0b1221] via-[#1e1b4b] to-[#312e81] rounded-3xl shadow-lg shadow-blue-900/10 p-5 md:p-6 text-white overflow-hidden border border-white/5"
                >
                    {/* Cosmic Background Effects */}
                    <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-indigo-500/10 rounded-full blur-[60px] pointer-events-none" />
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 mix-blend-overlay"></div>

                    <div className="relative z-10 flex flex-col gap-3 text-left">
                        {/* Top: Headline */}
                        <div>
                            <h3 className="text-base md:text-lg font-bold leading-snug mb-1 tracking-tight">
                                One platform for all your <br />
                                student challenges
                            </h3>
                            <p className="text-blue-200 text-[10px] md:text-xs leading-relaxed max-w-xs">
                                Unified learning & career acceleration.
                            </p>
                        </div>

                        {/* Middle: Feature Tags (Student Workspace Scope) */}
                        <div className="flex gap-2 justify-start flex-wrap">
                            <div className="px-2.5 py-1 bg-white/10 border border-white/20 rounded-md text-[10px] md:text-xs font-medium text-blue-100 flex items-center gap-1.5 backdrop-blur-sm">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                                Learn
                            </div>
                            <div className="px-2.5 py-1 bg-white/10 border border-white/20 rounded-md text-[10px] md:text-xs font-medium text-purple-100 flex items-center gap-1.5 backdrop-blur-sm">
                                <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
                                Build
                            </div>
                            <div className="px-2.5 py-1 bg-white/10 border border-white/20 rounded-md text-[10px] md:text-xs font-medium text-emerald-100 flex items-center gap-1.5 backdrop-blur-sm">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                                Elevate
                            </div>
                        </div>

                        {/* Bottom: Stats Row */}
                        <div className="border-t border-white/10 pt-3 flex justify-between gap-2 text-left">
                            <div>
                                <div className="text-base md:text-lg font-bold text-blue-100">100%</div>
                                <div className="text-[10px] text-blue-300">Placement</div>
                            </div>
                            <div className="border-l border-white/10 pl-2">
                                <div className="text-base md:text-lg font-bold text-blue-100">3X</div>
                                <div className="text-[10px] text-blue-300">Faster</div>
                            </div>
                            <div className="border-l border-white/10 pl-2">
                                <div className="text-base md:text-lg font-bold text-blue-100">50+</div>
                                <div className="text-[10px] text-blue-300">Partners</div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Compact Dark Container */}
                <div
                    className="relative rounded-[2.5rem] overflow-hidden bg-black border border-slate-800 shadow-2xl shadow-slate-200/50 transform transition-all hover:scale-[1.01] duration-500"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    {/* Background Effects (Contained) */}
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent"></div>

                    {/* Large Blue Floating Banner (The "Turbo360" Style Card) */}

                    {/* Content Wrapper */}
                    <div className="relative z-10 py-12 md:py-16">

                        {/* Header (Inside Box - Left Aligned) */}
                        <div className="text-left mb-10 md:mb-12 px-6 md:px-16 max-w-2xl">
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight leading-tight">
                                Everything You Need in <br />
                                One <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">Workspace</span>
                            </h2>
                            <p className="text-slate-400 text-sm md:text-base mt-4 max-w-lg">
                                A complete ecosystem of tools designed to help you learn, build, and grow your career.
                            </p>
                        </div>

                        {/* Animated Rows */}
                        <div className="relative overflow-hidden w-full mask-linear-fade">
                            {/* Fades for sides */}
                            <div className="absolute left-0 top-0 bottom-0 w-24 md:w-40 z-20 bg-gradient-to-r from-black via-black/80 to-transparent pointer-events-none"></div>
                            <div className="absolute right-0 top-0 bottom-0 w-24 md:w-40 z-20 bg-gradient-to-l from-black via-black/80 to-transparent pointer-events-none"></div>

                            <div className="flex flex-col gap-5 md:gap-6 py-4">
                                {/* Row 1 */}
                                <div ref={row1Ref} className="flex gap-4 md:gap-6 w-max" style={{ willChange: 'transform' }}>
                                    {duplicatedItems.map((item, index) => (
                                        <div
                                            key={`r1-${index}`}
                                            className="group flex-shrink-0 w-36 h-28 md:w-44 md:h-32 bg-gray-900/40 backdrop-blur-md rounded-2xl border border-white/5 flex flex-col items-center justify-center gap-3 hover:bg-gray-800/60 hover:border-emerald-500/30 transition-all duration-300 cursor-default"
                                        >
                                            <item.icon className={`h-6 w-6 md:h-8 md:w-8 ${item.color} opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300`} />
                                            <span className="text-xs md:text-sm font-medium text-slate-300 group-hover:text-white transition-colors text-center px-2">
                                                {item.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* Row 2 */}
                                <div ref={row2Ref} className="flex gap-4 md:gap-6 w-max" style={{ willChange: 'transform' }}>
                                    {[...duplicatedItems].reverse().map((item, index) => (
                                        <div
                                            key={`r2-${index}`}
                                            className="group flex-shrink-0 w-36 h-28 md:w-44 md:h-32 bg-gray-900/40 backdrop-blur-md rounded-2xl border border-white/5 flex flex-col items-center justify-center gap-3 hover:bg-gray-800/60 hover:border-cyan-500/30 transition-all duration-300 cursor-default"
                                        >
                                            <item.icon className={`h-6 w-6 md:h-8 md:w-8 ${item.color} opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300`} />
                                            <span className="text-xs md:text-sm font-medium text-slate-300 group-hover:text-white transition-colors text-center px-2">
                                                {item.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}