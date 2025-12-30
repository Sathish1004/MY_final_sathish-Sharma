import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const TestimonialsSection = () => {
    return (
        <section className="py-16 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Left Side: Content */}
                    <div>
                        <span className="text-purple-600 font-bold tracking-wider uppercase text-xs mb-2 block">
                            Learning Testimonials
                        </span>
                        <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                            Some feedback from <br />
                            our <span className="text-purple-600">learners</span>
                        </h2>

                        <div className="flex gap-1 mb-6">
                            {[1, 2, 3, 4, 5].map((_, i) => (
                                <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                        </div>

                        <blockquote className="text-lg text-slate-600 leading-relaxed mb-8">
                            "I struggled with AWS concepts until I joined Prolync. The hands-on labs and certification roadmap made everything clear and achievable."
                        </blockquote>

                        <div>
                            <h4 className="font-bold text-blue-600 text-lg">Rahul Verma</h4>
                            <p className="text-sm text-slate-500 font-medium">Cloud Engineer</p>
                        </div>

                        <div className="flex gap-4 mt-12">
                            <button className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-white hover:text-purple-600 hover:shadow-lg transition-all">
                                <ArrowLeft size={20} />
                            </button>
                            <button className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-white hover:text-purple-600 hover:shadow-lg transition-all">
                                <ArrowRight size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Right Side: Visuals (Scattered Avatars) */}
                    <div className="relative h-[500px] flex items-center justify-center">
                        {/* Central Glow */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-purple-100/50 rounded-full blur-[80px]" />

                        {/* Avatars positioned to match the image approximately */}
                        <motion.div
                            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1 }}
                            className="absolute top-[10%] right-[20%] w-16 h-16 rounded-full border-4 border-white shadow-lg overflow-hidden"
                        >
                            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" className="w-full h-full object-cover" />
                        </motion.div>

                        <motion.div
                            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }}
                            className="absolute top-[30%] right-[5%] w-24 h-24 rounded-full border-4 border-white shadow-xl overflow-hidden bg-purple-100"
                        >
                            <img src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=200&q=80" className="w-full h-full object-cover mix-blend-multiply opacity-90" />
                        </motion.div>

                        <motion.div
                            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 }}
                            className="absolute top-[25%] left-[20%] w-16 h-16 rounded-full border-4 border-white shadow-lg overflow-hidden"
                        >
                            <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80" className="w-full h-full object-cover" />
                        </motion.div>

                        <motion.div
                            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4 }}
                            className="absolute bottom-[35%] left-[10%] w-14 h-14 rounded-full border-4 border-white shadow-lg overflow-hidden"
                        >
                            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80" className="w-full h-full object-cover" />
                        </motion.div>

                        <motion.div
                            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 }}
                            className="absolute bottom-[30%] right-[30%] w-24 h-24 rounded-full border-4 border-white shadow-xl overflow-hidden"
                        >
                            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80" className="w-full h-full object-cover" />
                        </motion.div>

                        <motion.div
                            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.6 }}
                            className="absolute bottom-[10%] right-[10%] w-16 h-16 rounded-full border-4 border-white shadow-lg overflow-hidden"
                        >
                            <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80" className="w-full h-full object-cover" />
                        </motion.div>

                        <motion.div
                            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.7 }}
                            className="absolute bottom-[5%] left-[30%] w-20 h-20 rounded-full border-4 border-white shadow-lg overflow-hidden grayscale"
                        >
                            <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80" className="w-full h-full object-cover" />
                        </motion.div>

                        <motion.div
                            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.8 }}
                            className="absolute top-[50%] left-[40%] w-32 h-32 rounded-full border-4 border-white shadow-2xl overflow-hidden z-20"
                        >
                            <img src="https://images.unsplash.com/photo-1628157588553-5eeea00af15c?auto=format&fit=crop&w=300&q=80" className="w-full h-full object-cover" />
                        </motion.div>

                    </div>
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
