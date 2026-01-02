import React from 'react';
import { motion } from 'framer-motion';
import { FaFacebook, FaDiscord, FaSlack, FaReddit, FaTwitter, FaWhatsapp, FaGithub, FaTelegram, FaReact, FaNodeJs, FaPython, FaAws, FaLinux, FaGitAlt } from 'react-icons/fa';
import { SiMongodb, SiExpress, SiHtml5, SiCss3, SiJavascript, SiTypescript, SiTailwindcss, SiNextdotjs, SiFirebase, SiDocker, SiKubernetes, SiRedux, SiBootstrap, SiVite, SiPostgresql, SiMysql, SiGraphql } from 'react-icons/si';
import { MessageCircle, Globe, Users, Zap, Cpu, Database, Terminal, Cloud, Code, Server, Wifi, CpuIcon, Shield } from 'lucide-react';

// Enhanced TechIcon with premium styling




// Enhanced Marquee Community Item
const MarqueeItem = ({ icon: Icon, name, color, index }) => (
    <motion.div
        whileHover={{ scale: 1.2, rotate: 5 }}
        className="relative group/icon mx-2"
    >
        <div className={`
      w-16 h-16 rounded-xl
      bg-gradient-to-br from-white to-gray-50
      flex items-center justify-center 
      text-gray-600 
      shadow-lg shadow-gray-200/50
      border border-white/80
      hover:shadow-2xl
      hover:text-${color}-600
      hover:border-${color}-500/30
      transition-all duration-300
      cursor-pointer
      backdrop-blur-sm
      relative overflow-hidden
    `}>
            {/* Animated Background */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 via-cyan-500/0 to-purple-500/0"
                whileHover={{
                    background: `linear-gradient(135deg, ${color}500/10, ${color}400/5)`
                }}
                transition={{ duration: 0.3 }}
            />
            <Icon size={24} className="relative z-10" />
        </div>

        {/* Floating Label */}
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover/icon:opacity-100 transition-all duration-300 pointer-events-none">
            <div className={`bg-${color}-600 text-white text-xs font-semibold py-1 px-2 rounded-lg whitespace-nowrap shadow-lg backdrop-blur-sm`}>
                {name}
                <div className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-${color}-600 rotate-45`} />
            </div>
        </div>
    </motion.div>
);

// New Community Card Component
const CommunityCard = ({ icon: Icon, name, description, members, color, gradient }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        whileHover={{ y: -10, scale: 1.02 }}
        className="bg-gradient-to-br from-white/90 to-white/50 rounded-2xl p-6 shadow-xl shadow-gray-200/30 border border-white/70 backdrop-blur-sm hover:shadow-2xl hover:shadow-indigo-200/30 transition-all duration-500 group overflow-hidden relative"
    >
        {/* Animated Gradient Background */}
        <motion.div
            className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${gradient}`}
            animate={{
                backgroundPosition: ['0% 0%', '100% 100%']
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />

        <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br from-${color}-500/15 to-${color}-400/10 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-7 h-7 text-${color}-600`} />
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-${color}-100 text-${color}-700`}>
                    {members} members
                </span>
            </div>

            <h4 className={`text-lg font-bold text-gray-900 mb-2 group-hover:text-${color}-700 transition-colors duration-300`}>
                {name}
            </h4>

            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {description}
            </p>

            <div className="flex items-center justify-between">
                <button className={`text-sm font-medium text-${color}-600 hover:text-${color}-700 transition-colors flex items-center gap-1`}>
                    Join Now
                    <motion.svg
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        <path
                            fill="currentColor"
                            d="M5 12H19M19 12L12 5M19 12L12 19"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </motion.svg>
                </button>

                <div className="flex -space-x-2">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gradient-to-br from-indigo-400 to-purple-500"></div>
                    ))}
                </div>
            </div>
        </div>
    </motion.div>
);



// Infinite Marquee Component
const InfiniteMarquee = ({ items, speed = 40 }) => {
    return (
        <div className="relative overflow-hidden">
            <motion.div
                className="flex whitespace-nowrap"
                animate={{ x: [0, -1000] }}
                transition={{
                    x: {
                        repeat: Infinity,
                        duration: speed,
                        ease: "linear",
                    }
                }}
            >
                {[...items, ...items].map((item, index) => (
                    <div key={index} className="inline-block mx-4">
                        {item}
                    </div>
                ))}
            </motion.div>
        </div>
    );
};

const SlidingToolsSection = () => {


    const communities = [
        { icon: FaFacebook, color: 'blue', name: 'Facebook' },
        { icon: FaDiscord, color: 'indigo', name: 'Discord' },
        { icon: FaReddit, color: 'orange', name: 'Reddit' },
        { icon: FaSlack, color: 'purple', name: 'Slack' },
        { icon: FaTwitter, color: 'sky', name: 'Twitter' },
        { icon: FaWhatsapp, color: 'green', name: 'WhatsApp' },
        { icon: FaGithub, color: 'gray', name: 'GitHub' },
        { icon: FaTelegram, color: 'blue', name: 'Telegram' },
    ];

    const detailedCommunities = [
        {
            icon: FaDiscord,
            name: "Discord Hub",
            description: "Real-time tech discussions, coding help, and community events",
            members: "15K+",
            color: "indigo",
            gradient: "bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10"
        },
        {
            icon: FaGithub,
            name: "GitHub Org",
            description: "Open source projects, contributions, and collaborative coding",
            members: "8K+",
            color: "gray",
            gradient: "bg-gradient-to-br from-gray-500/10 via-slate-500/10 to-zinc-500/10"
        },
        {
            icon: FaTelegram,
            name: "Telegram Groups",
            description: "Daily coding challenges and quick tech support",
            members: "12K+",
            color: "blue",
            gradient: "bg-gradient-to-br from-blue-500/10 via-cyan-500/10 to-teal-500/10"
        },
        {
            icon: FaSlack,
            name: "Slack Workspace",
            description: "Professional networking and career opportunities",
            members: "6K+",
            color: "purple",
            gradient: "bg-gradient-to-br from-purple-500/10 via-violet-500/10 to-fuchsia-500/10"
        }
    ];



    const marqueeItems = communities.map((community, index) => (
        <MarqueeItem key={index} {...community} index={index} />
    ));

    return (
        <section className="relative py-10 md:py-16 overflow-hidden bg-gradient-to-b from-gray-50 via-white to-indigo-50/30">
            {/* Enhanced Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Animated Gradient Orbs */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-indigo-300/20 to-purple-300/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-cyan-300/20 to-emerald-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-3/4 left-1/2 w-80 h-80 bg-gradient-to-r from-pink-300/15 to-rose-300/15 rounded-full blur-3xl animate-pulse delay-500"></div>

                {/* Grid Pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `linear-gradient(to right, #4F46E5 1px, transparent 1px),
                             linear-gradient(to bottom, #4F46E5 1px, transparent 1px)`,
                        backgroundSize: '40px 40px'
                    }}></div>
                </div>

                {/* Floating Tech Icons */}
                {[...Array(12)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute opacity-5"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -30, 0],
                            rotate: [0, 180, 360],
                            scale: [1, 1.2, 1]
                        }}
                        transition={{
                            duration: 15 + Math.random() * 10,
                            repeat: Infinity,
                            ease: "linear",
                            delay: Math.random() * 5
                        }}
                    >
                        <FaReact className="w-20 h-20 text-indigo-400" />
                    </motion.div>
                ))}
            </div>

            {/* Network Lines */}
            <svg className="absolute inset-0 w-full h-full opacity-10">
                {[...Array(8)].map((_, i) => (
                    <motion.path
                        key={i}
                        d={`M ${i * 12.5},0 Q ${50 + i * 5},${50 + i * 10} ${100 - i * 12.5},100`}
                        fill="none"
                        stroke="#4F46E5"
                        strokeWidth="0.5"
                        strokeDasharray="5,5"
                        animate={{
                            strokeDashoffset: [0, 50],
                        }}
                        transition={{
                            duration: 3 + i,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    />
                ))}
            </svg>

            {/* Floating Educational Keywords Removed */}

            <style >{`
        @keyframes floatWord {
          0% { transform: translateY(0px); }
          100% { transform: translateY(-6px); }
        }
      `}</style>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-10xl relative z-10">
                {/* Enhanced Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, type: "spring" }}
                    className="text-center mb-10"
                >
                    <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/80 backdrop-blur-sm border border-white/70 shadow-lg shadow-gray-200/30 mb-8 hover:shadow-xl hover:shadow-indigo-200/30 transition-all duration-500 group">
                        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 animate-pulse group-hover:scale-150 transition-transform duration-300"></div>
                        <span className="text-sm font-semibold bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent">
                            Global Developer Network
                        </span>
                        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-cyan-500 via-purple-500 to-indigo-500 animate-pulse group-hover:scale-150 transition-transform duration-300 delay-150"></div>
                    </div>

                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 tracking-tight">
                        <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                            ProLync{' '}
                        </span>
                        <span className="relative inline-block">
                            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent">
                                Community
                            </span>
                            <motion.div
                                className="absolute -bottom-3 left-0 right-0 h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 rounded-full blur-sm"
                                initial={{ scaleX: 0 }}
                                whileInView={{ scaleX: 1 }}
                                transition={{ duration: 1.2, delay: 0.3 }}
                            />
                        </span>
                        <br />
                        <span className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 bg-clip-text text-transparent">
                            Ecosystem
                        </span>
                    </h1>



                </motion.div>

                {/* Active Communities Section */}
                <motion.div
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="mb-12"
                >


                    {/* Infinite Marquee */}
                    <div className="relative mb-12">
                        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10"></div>
                        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10"></div>
                        <InfiniteMarquee
                            items={marqueeItems}
                            speed={60}
                        />
                    </div>

                    {/* Detailed Community Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {detailedCommunities.map((community, index) => (
                            <CommunityCard key={index} {...community} />
                        ))}
                    </div>
                </motion.div>

                {/* CTA Section */}

            </div>
        </section>
    );
};

export default SlidingToolsSection;
// Force HMR update