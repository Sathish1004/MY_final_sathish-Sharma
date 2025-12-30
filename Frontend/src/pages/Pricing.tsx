import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Check, Lock, BookOpen, Code2, Briefcase, Users, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import UpgradeModal from '@/components/UpgradeModal';
import SaaSBackground from '@/components/SaaSBackground';

export default function Pricing() {
    const navigate = useNavigate();
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

    const features = [
        { name: 'Courses', icon: BookOpen },
        { name: 'Coding IDE', icon: Code2 },
        { name: 'Jobs', icon: Briefcase },
        { name: 'Mentors', icon: Users },
        { name: 'Events', icon: Calendar },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-sans selection:bg-blue-100">
            <SaaSBackground />

            <div className="relative pt-24 pb-20 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
                    <div className="flex justify-center gap-6 md:gap-8 mb-10 text-slate-400">
                        {features.map((item) => (
                            <div key={item.name} className="flex flex-col items-center gap-2 group">
                                <div className="p-3 rounded-2xl bg-white shadow-sm border border-slate-100 group-hover:border-blue-200 group-hover:shadow-md transition-all duration-300">
                                    <item.icon className="h-5 w-5 md:h-6 md:w-6 text-slate-500 group-hover:text-blue-500 transition-colors" />
                                </div>
                                <span className="text-[10px] md:text-xs font-semibold uppercase tracking-wider hidden sm:block opacity-0 group-hover:opacity-100 transition-opacity">
                                    {item.name}
                                </span>
                            </div>
                        ))}
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
                        Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Workspace Plan</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
                        Start free. Upgrade anytime to unlock your full career workspace with one simple login.
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto items-start">
                    {/* Free Plan */}
                    <div className="relative bg-white rounded-3xl p-8 md:p-10 border border-slate-200 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-slate-200/60 transition-shadow duration-300">
                        <div className="absolute top-0 right-0 p-6">
                            <span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                                Free Plan
                            </span>
                        </div>

                        <div className="mb-8">
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">Student Starter</h3>
                            <div className="flex items-baseline gap-1 mb-4">
                                <span className="text-4xl font-bold text-slate-900">₹0</span>
                                <span className="text-slate-500 font-medium">/ month</span>
                            </div>
                            <p className="text-slate-600 leading-relaxed">
                                Perfect for beginners to start learning and coding.
                            </p>
                        </div>

                        <div className="space-y-4 mb-10">
                            <div className="flex items-start gap-3">
                                <div className="p-0.5 rounded-full bg-green-100 mt-1">
                                    <Check className="h-3.5 w-3.5 text-green-600" />
                                </div>
                                <span className="text-slate-700">Courses (Basic access)</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="p-0.5 rounded-full bg-green-100 mt-1">
                                    <Check className="h-3.5 w-3.5 text-green-600" />
                                </div>
                                <span className="text-slate-700">Coding Platform (Limited problems)</span>
                            </div>

                            {/* Locked Features */}
                            {['Mentorship', 'Placement & Job Referrals', 'Events & Workshops', 'Certificates', 'Pro Workspace Badge'].map((feature) => (
                                <div key={feature} className="flex items-start gap-3 text-slate-400">
                                    <Lock className="h-4 w-4 mt-1 flex-shrink-0" />
                                    <span>{feature}</span>
                                </div>
                            ))}

                            <p className="text-xs text-slate-400 font-medium italic pt-2">
                                Upgrade to unlock these features
                            </p>
                        </div>

                        <Button
                            variant="outline"
                            className="w-full h-14 text-base font-bold border-2 border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-700 rounded-xl transition-all"
                            onClick={() => navigate('/dashboard')}
                        >
                            Get Started Free
                        </Button>
                    </div>

                    {/* Pro Plan */}
                    <div className="relative bg-white rounded-3xl p-8 md:p-10 border border-blue-100 shadow-2xl shadow-blue-900/10 hover:shadow-blue-900/15 transition-shadow duration-300 ring-4 ring-blue-50/50">
                        <div className="absolute top-0 right-0 p-6">
                            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-lg shadow-blue-500/20">
                                Most Popular
                            </span>
                        </div>

                        <div className="mb-8">
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">Pro Workspace</h3>
                            <div className="flex items-baseline gap-1 mb-4">
                                <span className="text-4xl font-bold text-slate-900">₹26</span>
                                <span className="text-slate-500 font-medium">/ month</span>
                            </div>
                            <p className="text-slate-600 leading-relaxed">
                                All-in-one career workspace for serious learners.
                            </p>
                        </div>

                        <div className="space-y-4 mb-10">
                            {[
                                "Unlimited Courses",
                                "Full Coding IDE (Unlimited runs)",
                                "Mentorship Access",
                                "Placement & Job Referrals",
                                "Events & Workshops",
                                "Certificates & Pro Badge",
                                "Career Dashboard",
                                "Priority Support"
                            ].map((feature) => (
                                <div key={feature} className="flex items-start gap-3">
                                    <div className="p-0.5 rounded-full bg-blue-100 mt-1">
                                        <Check className="h-3.5 w-3.5 text-blue-600" />
                                    </div>
                                    <span className="text-slate-900 font-medium">{feature}</span>
                                </div>
                            ))}
                        </div>

                        <Button
                            className="w-full h-14 text-base font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all hover:scale-[1.02]"
                            onClick={() => navigate('/payment')}
                        >
                            Subscribe & Unlock All
                        </Button>

                        <p className="text-center text-xs text-slate-500 mt-4 font-medium">
                            Lifetime access option also available inside
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
