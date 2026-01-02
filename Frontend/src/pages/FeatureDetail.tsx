import { useParams, useNavigate } from 'react-router-dom';
import { features } from '@/data/featuresData';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const FeatureDetail = () => {
    const { featureId } = useParams();
    const navigate = useNavigate();
    const feature = features.find(f => f.id === featureId);

    if (!feature) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Feature not found</h2>
                    <button
                        onClick={() => navigate('/')}
                        className="text-blue-600 hover:underline"
                    >
                        Return Home
                    </button>
                </div>
            </div>
        );
    }

    const Icon = feature.icon;

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section - Blue Background */}
            <section className="bg-blue-600 pt-32 pb-24 relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
                    <div className="absolute top-[-100px] right-[-100px] w-96 h-96 bg-white rounded-full blur-[100px]" />
                    <div className="absolute bottom-[-100px] left-[-100px] w-96 h-96 bg-blue-400 rounded-full blur-[100px]" />
                </div>

                <div className="container mx-auto px-4 relative z-10 text-center text-white">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center justify-center p-3 bg-white/10 backdrop-blur-sm rounded-xl mb-6 ring-1 ring-white/20">
                            <Icon className="w-8 h-8 text-white" />
                        </div>
                        {/* Reduced font size as requested */}
                        <h1 className="text-2xl md:text-4xl font-bold mb-4 tracking-tight leading-tight max-w-4xl mx-auto">
                            {feature.heroTitle}
                        </h1>
                        <p className="text-sm md:text-base text-blue-100 max-w-2xl mx-auto mb-8 font-medium leading-relaxed">
                            {feature.heroDescription}
                        </p>

                        <div className="flex items-center justify-center gap-4">
                            <button
                                onClick={() => feature.route ? navigate(feature.route) : navigate('/login')}
                                className="px-6 py-2.5 bg-white text-blue-600 rounded-full font-bold text-base hover:bg-blue-50 transition-colors shadow-lg shadow-blue-900/20"
                            >
                                Get Started
                            </button>
                            {/* Scroll-to-hash navigation via Router State */}
                            <button
                                onClick={() => navigate('/', { state: { scrollTo: 'why-choose-workspace' } })}
                                className="px-6 py-2.5 bg-blue-700/50 text-white border border-blue-400/30 rounded-full font-semibold text-base hover:bg-blue-700 transition-colors backdrop-blur-sm flex items-center gap-2"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Split Content Section */}
            <section className="py-20 md:py-28">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-12 gap-12 lg:gap-24">
                        {/* Left Sidebar - About */}
                        <div className="lg:col-span-4 space-y-8">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                                    <span className="w-8 h-1 bg-blue-600 rounded-full block"></span>
                                    {feature.aboutTitle}
                                </h3>
                                <p className="text-slate-600 leading-relaxed text-lg">
                                    {feature.aboutDescription}
                                </p>
                            </div>

                            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                <h4 className="font-semibold text-slate-900 mb-4">Why this matters?</h4>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-3 text-slate-600 text-sm">
                                        <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                        <span>Industry-aligned curriculum</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-slate-600 text-sm">
                                        <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                        <span>Practical skill development</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-slate-600 text-sm">
                                        <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                        <span>Career-ready outcomes</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Right Main Content */}
                        <div className="lg:col-span-8">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                            >
                                <h2 className="text-3xl md:text-5xl font-serif text-slate-900 mb-8">
                                    {feature.mainContentTitle}
                                </h2>

                                <div className="prose prose-lg text-slate-600 mb-12 max-w-none">
                                    <p className="leading-relaxed text-slate-600 text-lg">
                                        {feature.mainContentBody}
                                    </p>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-6">
                                    {feature.benefits?.map((benefit, idx) => (
                                        <div key={idx} className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors duration-300">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                                <CheckCircle2 className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-slate-900 mb-1">Key Benefit {idx + 1}</h4>
                                                <p className="text-slate-600">{benefit}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Image Removed as requested */}
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default FeatureDetail;
