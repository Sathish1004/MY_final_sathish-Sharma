import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronRight, ChevronLeft, X, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Updated Steps per specific request - ALL 10 MODULES
const TOUR_STEPS = [
    {
        targetId: 'nav-item-courses',
        title: 'Courses',
        description: 'Access structured courses and track your learning progress.',
        sidebarHighlight: 'Courses'
    },
    {
        targetId: 'nav-item-coding-platform',
        title: 'Coding Platform',
        description: 'Practice coding problems and improve your skills.',
        sidebarHighlight: 'Coding Platform'
    },
    {
        targetId: 'nav-item-jobs-internships',
        title: 'Jobs & Internships',
        description: 'Explore job and internship opportunities matched to you.',
        sidebarHighlight: 'Jobs & Internships'
    },
    {
        targetId: 'nav-item-mentors',
        title: 'Mentors',
        description: 'Book 1-on-1 mentor sessions for guidance.',
        sidebarHighlight: 'Mentors'
    },
    {
        targetId: 'nav-item-news-updates',
        title: 'News & Updates',
        description: 'Stay updated with platform announcements and news.',
        sidebarHighlight: 'News & Updates'
    },
    {
        targetId: 'nav-item-projects',
        title: 'Projects',
        description: 'Build real-world projects to strengthen your portfolio.',
        sidebarHighlight: 'Projects'
    },
    {
        targetId: 'nav-item-events',
        title: 'Events',
        description: 'Join live webinars, workshops, and events.',
        sidebarHighlight: 'Events'
    },
    {
        targetId: 'nav-item-placements',
        title: 'Placements',
        description: 'Track placement drives and interview schedules.',
        sidebarHighlight: 'Placements'
    },
    {
        targetId: 'nav-item-feedback',
        title: 'Feedback',
        description: 'Share your feedback to improve the platform.',
        sidebarHighlight: 'Feedback'
    },
    {
        targetId: 'nav-item-dashboard',
        title: 'Dashboard',
        description: 'View your overall progress, stats, and recent activity.',
        sidebarHighlight: 'Dashboard'
    }
];

export default function OnboardingOverlay() {
    const navigate = useNavigate();
    const { setShowOnboarding } = useAuth();
    const [currentStep, setCurrentStep] = useState(0);
    const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [stage, setStage] = useState<'center' | 'target'>('center');

    const mountedRef = useRef(true);

    // Initial load
    useEffect(() => {
        return () => { mountedRef.current = false; };
    }, []);

    const updatePosition = () => {
        if (stage === 'center') {
            setPosition({
                top: window.innerHeight / 2,
                left: window.innerWidth / 2,
            });
            return;
        }

        const step = TOUR_STEPS[currentStep];
        const element = document.getElementById(step.targetId);

        if (element) {
            const rect = element.getBoundingClientRect();

            // WhatsApp style: Right of sidebar
            const left = rect.right + 15;
            const top = rect.top + (rect.height / 2); // vertically centered to item

            setPosition({ top, left });
        } else {
            // Fallback center
            setPosition({
                top: window.innerHeight / 2,
                left: window.innerWidth / 2,
            });
        }
    };

    // Update position on step change or resize
    useEffect(() => {
        updatePosition();
        window.addEventListener('resize', updatePosition);
        return () => window.removeEventListener('resize', updatePosition);
    }, [currentStep, stage]);

    // Handle highlighting (Side Effects on DOM)
    useEffect(() => {
        // Clear previous
        const allNavItems = document.querySelectorAll('[id^="nav-item-"]');
        allNavItems.forEach(el => {
            (el as HTMLElement).style.backgroundColor = '';
            (el as HTMLElement).style.color = '';
            (el as HTMLElement).style.boxShadow = '';
            (el as HTMLElement).style.transition = '';
            (el as HTMLElement).style.pointerEvents = '';
        });

        if (isVisible && stage === 'target') {
            const step = TOUR_STEPS[currentStep];
            const element = document.getElementById(step.targetId);

            if (element) {
                element.style.transition = 'all 0.3s ease';
                // Light green background for active item
                element.style.backgroundColor = '#dcf8c6';
                // Dark text
                element.style.color = '#075e54';
                // Slight green glow
                element.style.boxShadow = 'inset 0 0 0 1px #25D366';

                // Disable direct click interactions on the item itself (optional, based on requirement "disabled")
                // Requirement says "Left sidebar modules remain visible but disabled"
                // "Sidebar clickable ONLY after onboarding completes"
                // So strict pointer-events: none is good.
                element.style.pointerEvents = 'none';
            }
        }

        return () => {
            const step = TOUR_STEPS[currentStep];
            const element = document.getElementById(step.targetId);
            if (element) {
                element.style.backgroundColor = '';
                element.style.color = '';
                element.style.boxShadow = '';
                element.style.pointerEvents = '';
            }
        };
    }, [currentStep, isVisible, stage]);

    // Initial Trigger
    useEffect(() => {
        // Start center
        setStage('center');
        updatePosition();

        // Move to first target after delay
        const timer = setTimeout(() => {
            if (mountedRef.current) {
                setStage('target');
            }
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    const handleNext = () => {
        if (currentStep < TOUR_STEPS.length - 1) {
            setIsAnimating(true);

            // 1. Move back to center
            setStage('center');

            // 2. Wait for move to complete, then change content and move to next target
            setTimeout(() => {
                if (mountedRef.current) {
                    setCurrentStep(prev => prev + 1);

                    // Small pause at center to read/register (optional, keeps it smooth)
                    setTimeout(() => {
                        if (mountedRef.current) {
                            setStage('target');
                            setIsAnimating(false);
                        }
                    }, 600); // Wait at center
                }
            }, 600); // Travel time to center

        } else {
            finishTour();
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setIsAnimating(true);
            // Same animation for back: Center -> Prev Target
            setStage('center');

            setTimeout(() => {
                if (mountedRef.current) {
                    setCurrentStep(prev => prev - 1);
                    setTimeout(() => {
                        if (mountedRef.current) {
                            setStage('target');
                            setIsAnimating(false);
                        }
                    }, 600);
                }
            }, 600);
        }
    };

    const { toast } = useToast();

    const finishTour = () => {
        setIsVisible(false);
        setTimeout(() => {
            setShowOnboarding(false);
            localStorage.setItem('onboarding_complete', 'true');
            toast({
                title: "You’re all set!",
                description: "Start exploring your workspace 🚀",
                duration: 5000,
                className: "bg-[#dcf8c6] border-[#25D366] text-[#075e54]"
            });
        }, 500);
    };

    const stepData = TOUR_STEPS[currentStep];
    if (!stepData) return null;

    return (
        <div className={cn("absolute inset-0 z-[50] transition-opacity duration-500", isVisible ? "opacity-100" : "opacity-0")}>
            {/* 
               Content Blur:
               The overlay is absolute inside <main>. 
               bg-background/20 with backdrop-blur-md blurs specifically what is BEHIND it (the dashboard).
               Since sidebar is OUTSIDE <main>, it is NOT blurred.
            */}
            <div className="absolute inset-0 bg-background/40 backdrop-blur-md" />

            {/* Notification Card - Fixed Position to break out of any container overflow/clipping */}
            {position && (
                <div
                    className={cn(
                        "fixed z-[100] transition-all duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)]", // smooth ease
                        isAnimating ? "scale-95 opacity-80" : "scale-100 opacity-100" // subtle breathe effect
                    )}
                    style={{
                        top: position.top,
                        left: position.left,
                        transform: 'translateY(-50%)' // Center vertically relative to top coordinate (which is center of item)
                    }}
                >
                    <div className={cn("flex items-center", stage === 'center' ? "justify-center" : "")}>

                        {/* Animated Arrow - Only show when at target */}
                        {stage === 'target' && (
                            <div className="mr-[-1px] z-10 animate-pulse-horizontal text-blue-500 drop-shadow-sm transition-opacity duration-300">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-500 fill-current">
                                    <path d="M24 0l-24 12 24 12v-24z" />
                                </svg>
                            </div>
                        )}

                        {/* WhatsApp Style Card */}
                        <div className={cn(
                            "bg-white text-[#075e54] w-[320px] rounded-lg shadow-xl border border-[#25D366]/20 relative overflow-hidden transition-all duration-500",
                            // In center mode, maybe slightly larger or more prominent?
                            stage === 'center' ? "shadow-2xl scale-105" : ""
                        )}>
                            {/* Green Top Bar */}
                            <div className="h-1 w-full bg-[#25D366]" />

                            <div className="p-5">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg text-[#075e54] leading-tight">
                                        {stepData.title}
                                    </h3>
                                    {/* Keep skip enabled? Prompt implied blocking until finish, but 'View Dashboard' is the exit. 
                                        Usually skipping is allowed, but prompt says "Dashboard interaction must be blocked until onboarding finishes"
                                        and "On clicking View Dashboard... Remove all blur".
                                        So maybe NO close button? Let's keep it safe, but users hate unskippable tours. 
                                        Reference says "Button: View Dashboard" at end. 
                                        I'll include it for safety but focus on the main flow buttons.
                                    */}
                                    <button onClick={finishTour} className="text-[#aebac1] hover:text-[#075e54] transition-colors">
                                        <X size={16} />
                                    </button>
                                </div>

                                <p className="text-sm text-[#4a5f63] leading-relaxed mb-4">
                                    {stepData.description}
                                </p>

                                <div className="flex justify-between items-center pt-2">
                                    {/* Steps Indicator */}
                                    <div className="flex gap-1.5">
                                        {TOUR_STEPS.map((_, i) => (
                                            <div
                                                key={i}
                                                className={cn(
                                                    "h-1.5 rounded-full transition-all duration-300",
                                                    i === currentStep ? "w-4 bg-[#25D366]" : "w-1.5 bg-[#e9edef]"
                                                )}
                                            />
                                        ))}
                                    </div>

                                    <div className="flex gap-2">
                                        {/* Back button logic */}
                                        {currentStep > 0 && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={handleBack}
                                                disabled={isAnimating}
                                                className="h-8 px-3 text-[#075e54] hover:bg-[#f0f2f5] hover:text-[#075e54]"
                                            >
                                                Back
                                            </Button>
                                        )}

                                        <Button
                                            size="sm"
                                            onClick={handleNext}
                                            disabled={isAnimating}
                                            className="h-9 px-5 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold rounded-md shadow-sm hover:shadow-md transition-all whitespace-nowrap"
                                        >
                                            {currentStep === TOUR_STEPS.length - 1 ? (
                                                "View Dashboard"
                                            ) : (
                                                <span className="flex items-center gap-1">Next <ChevronRight size={14} /></span>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes pulse-horizontal {
                    0%, 100% { transform: translateX(0); }
                    50% { transform: translateX(-6px); }
                }
                .animate-pulse-horizontal {
                    animation: pulse-horizontal 1.2s infinite ease-in-out;
                }
            `}</style>
        </div>
    );
}