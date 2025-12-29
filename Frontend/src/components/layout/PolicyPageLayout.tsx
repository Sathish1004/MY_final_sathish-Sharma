import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface PolicyPageLayoutProps {
    title: string;
    subtitle: string;
    children: React.ReactNode;
}

const PolicyPageLayout: React.FC<PolicyPageLayoutProps> = ({ title, subtitle, children }) => {
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-28 pb-20 relative overflow-hidden">
            {/* Decorative Orbs */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-100/30 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-100/20 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2 pointer-events-none" />

            <div className="container max-w-4xl mx-auto px-6 relative z-10">
                {/* Back Button */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-8"
                >
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 text-slate-600 hover:text-blue-600 font-semibold group rounded-full px-4"
                    >
                        <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
                        Back to Home
                    </Button>
                </motion.div>

                {/* Content Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden"
                >
                    {/* Header Section */}
                    <div className="p-8 md:p-12 border-b border-slate-50 text-center md:text-left bg-slate-50/30">
                        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
                            {title}
                        </h1>
                        <p className="text-lg text-slate-600 font-medium max-w-2xl">
                            {subtitle}
                        </p>
                    </div>

                    {/* Content Section */}
                    <div className="p-8 md:p-16 prose prose-slate max-w-none">
                        <div className="space-y-8 text-slate-600 leading-relaxed text-lg">
                            {children}
                        </div>
                    </div>

                    {/* Bottom Navigation */}
                    <div className="p-8 border-t border-slate-50 flex justify-center bg-slate-50/30">
                        <Button
                            onClick={() => navigate('/')}
                            className="rounded-full px-8 h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-1"
                        >
                            Back to Home
                        </Button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default PolicyPageLayout;
