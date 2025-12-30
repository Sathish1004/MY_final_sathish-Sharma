import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { features } from '@/data/featuresData';
import { useNavigate } from 'react-router-dom';

export default function ScrollBasedSlider() {
    const [activeTab, setActiveTab] = useState(0);
    const navigate = useNavigate();
    const slides = features;

    return (

        <section id="why-choose-workspace" className="py-12 md:py-16 bg-[#022c22] overflow-hidden relative">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-4 max-w-7xl relative z-10">

                {/* Header */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl md:text-5xl font-serif text-white mb-8 tracking-tight">
                        Why Choose Student Workspace?
                    </h2>

                    {/* Navigation Tabs (Underline Style) */}
                    <div className="flex flex-wrap justify-center gap-8 border-b border-white/10">
                        {slides.map((slide, index) => (
                            <button
                                key={slide.id}
                                onClick={() => setActiveTab(index)}
                                className={`pb-4 text-base md:text-lg font-medium transition-all duration-300 relative
                                ${activeTab === index
                                        ? 'text-white'
                                        : 'text-slate-500 hover:text-white'
                                    }
                            `}
                            >
                                {slide.shortTitle}
                                {activeTab === index && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Content Info */}
                <div className="relative min-h-[500px]">
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="grid lg:grid-cols-12 gap-6 lg:gap-8"
                        >
                            {/* Left Column: Image Area (Span 7) */}
                            <div className="lg:col-span-7 relative group">
                                <div className="relative h-[400px] md:h-[500px] w-full rounded-3xl overflow-hidden shadow-sm">
                                    <img
                                        src={slides[activeTab].image}
                                        alt={slides[activeTab].title}
                                        className="w-full h-full object-cover"
                                    />

                                    {/* Overlay Card Inside Image */}
                                    <div className="absolute top-1/2 -translate-y-1/2 left-8 md:left-12 max-w-sm bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/50">
                                        <h3 className="text-2xl font-bold text-slate-900 mb-4 leading-tight">
                                            {slides[activeTab].overlay} made simple.
                                        </h3>
                                        <button
                                            onClick={() => navigate(`/feature/${slides[activeTab].id}`)}
                                            className="px-6 py-2.5 bg-blue-600 text-white rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors"
                                        >
                                            Read full story
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Info Cards (Span 5) */}
                            <div className="lg:col-span-5 flex flex-col gap-4 h-full">

                                {/* Top Card: Metric/Highlight */}
                                <div className="bg-slate-50 p-8 rounded-3xl flex-1 flex flex-col justify-center">
                                    <div className={`h-12 w-12 ${slides[activeTab].bg} rounded-xl flex items-center justify-center mb-6`}>
                                        {(() => {
                                            const Icon = slides[activeTab].icon;
                                            return <Icon className={`h-6 w-6 ${slides[activeTab].color}`} />;
                                        })()}
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900">
                                        <span className="block text-blue-600 mb-2">{slides[activeTab].title}</span>
                                        in student success rates.
                                    </h3>
                                </div>

                                {/* Bottom Card: Description/Details */}
                                <div className="bg-slate-50 p-8 rounded-3xl flex-1 flex flex-col justify-center">
                                    <p className="text-slate-600 text-lg leading-relaxed mb-6">
                                        "Prolync {slides[activeTab].shortTitle.toLowerCase()} features provide end-to-end visibility and {slides[activeTab].highlight.toLowerCase()}"
                                    </p>

                                    <div className="mt-auto pt-4 border-t border-slate-200">
                                        <div className="flex flex-wrap gap-y-2 gap-x-4">
                                            {slides[activeTab].description.slice(0, 2).map((item, i) => (
                                                <div key={i} className="flex items-center gap-2 text-sm text-slate-500 font-medium bg-white px-3 py-1 rounded-full shadow-sm border border-slate-100">
                                                    <CheckCircle2 className={`h-4 w-4 ${slides[activeTab].color}`} />
                                                    {item}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </motion.div>
                    </AnimatePresence>
                </div>

            </div>
        </section>
    );
}

