import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface UpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
    const navigate = useNavigate();

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop with Blur */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-slate-900/30 backdrop-blur-md"
                    onClick={onClose}
                />

                {/* Modal Content */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-8 overflow-hidden z-10"
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 mb-6 shadow-lg shadow-blue-500/30">
                            <span className="text-3xl">🚀</span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
                            Upgrade to Pro Workspace
                        </h2>
                        <p className="text-slate-600 text-lg">
                            Unlock mentorship, placements, certificates & full workspace access.
                        </p>
                    </div>

                    <div className="space-y-4 mb-8 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                        {[
                            "Unlimited Projects & storage",
                            "Priority Mentorship Access",
                            "Verified Pro Badge",
                            "Job Referrals"
                        ].map((feature, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                                    <Check className="h-3.5 w-3.5 text-green-600" />
                                </div>
                                <span className="text-slate-700 font-medium">{feature}</span>
                            </div>
                        ))}
                    </div>

                    <Button
                        size="lg"
                        className="w-full h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
                        onClick={() => navigate('/payment')}
                    >
                        Upgrade Now
                    </Button>

                    <p className="text-center text-sm text-slate-500 mt-4">
                        30-day money-back guarantee. Cancel anytime.
                    </p>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}