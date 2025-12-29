



import { useEffect, useState } from 'react';
import { useNavigate, useLocation, useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import Chatbot from '@/components/Chatbot';
import ScrollBasedSlider from '@/components/ScrollBasedSlider';
import FeaturesRow from '@/components/FeaturesRow';
import DetailedFeatures from '@/components/DetailedFeatures';
import WorkspaceStack from '@/components/WorkspaceStack';

import SlidingToolsSection from '@/components/SlidingToolsSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import SaaSBackground from '@/components/SaaSBackground';
import HeroOrbit from '@/components/HeroOrbit';
import FeatureWheel from '@/components/FeatureWheel';
import WhyProlync from '@/components/WhyProlync';
import Footer from '@/components/Footer';
import { ArrowRight } from 'lucide-react';

export default function Index() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { setIsLoginModalOpen } = useOutletContext<{ setIsLoginModalOpen: (open: boolean) => void }>();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
    // Check for openAuth state from other pages
    if (location.state?.openAuth) {
      setIsLoginModalOpen(true);
      window.history.replaceState({}, document.title);
    }
    // Handle Scroll Navigation
    if (location.state?.scrollTo) {
      const element = document.getElementById(location.state.scrollTo);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100); // Small delay to ensure rendering
        window.history.replaceState({}, document.title);
      }
    }
  }, [user, loading, navigate, location]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      {/* Navbar */}


      {/* Unified Hero & Features Section with SaaS Background */}
      <div className="relative w-full bg-white isolate">
        <SaaSBackground />

        {/* Hero Section */}
        <section className="relative overflow-hidden pt-24 pb-12 lg:pt-40 lg:pb-32">
          {/* Background - Clean gradient REMOVED for SaaS Background */}

          <div className="max-w-[1700px] mx-auto px-4 md:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

              {/* Left Content */}
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left order-1 lg:order-1 max-w-2xl lg:max-w-none mx-auto lg:mx-0 mt-0 lg:mt-16">

                <h1 className="text-4xl md:text-5xl lg:text-[4.5rem] font-bold tracking-tight text-slate-900 mb-4 md:mb-6 leading-[1.15] lg:leading-[1.1] drop-shadow-sm flex flex-col gap-1 md:gap-2">
                  <span className="block">Scale Your Learning.</span>

                  {/* Static Blue Gradient Text */}
                  <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent pb-1 md:pb-2">
                    Power the Enterprise.
                  </span>
                </h1>

                <p className="text-lg md:text-xl text-slate-600 mb-4 md:mb-10 leading-relaxed max-w-xl lg:max-w-full font-medium">
                  Get free access to learning tools, coding platforms, and career opportunities using Prolync Student Workspace.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-4 md:mb-10">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-500 h-12 px-8 text-lg font-semibold rounded-lg shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] transition-all hover:-translate-y-0.5 border border-blue-400/30"
                    onClick={() => navigate('/pricing')}
                  >
                    Start Free Trial
                  </Button>

                </div>

                {/* "Go premium" Link with Arrow Box */}
                <div
                  className="flex items-center gap-3 group cursor-pointer w-fit p-2 -ml-2 rounded-lg hover:bg-slate-100 transition-colors"
                  onClick={() => navigate('/pricing')}
                >
                  <div className="h-6 w-6 bg-slate-100 rounded-md flex items-center justify-center group-hover:bg-blue-600 transition-colors shadow-sm ring-1 ring-slate-200">
                    <ArrowRight className="h-3.5 w-3.5 text-blue-600 group-hover:text-white" />
                  </div>
                  <span className="text-base font-semibold text-slate-600 underline-offset-4 group-hover:text-slate-900 transition-colors">
                    Go premium. See plans and pricing
                  </span>
                </div>
              </div>

              {/* Right Visual (New Feature Wheel) */}
              <div className="relative w-full h-[320px] sm:h-[500px] lg:h-[600px] flex items-center justify-center order-2 lg:order-2 mt-0 lg:mt-0">
                <FeatureWheel />
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Section 3: Everything You Need to Succeed */}
      <FeaturesRow />

      {/* Section 4: Interactive Scroll Slider (Why Choose Student Workspace?) */}
      <ScrollBasedSlider />

      {/* Student Workspace Animated Section */}


      {/* Section 5: Detailed Features (Pastel Cards) */}
      <DetailedFeatures />

      {/* Section 6: Sliding Tools Ecosystem */}
      <SlidingToolsSection />



      {/* Section 7: Student Workspace Stack */}
      <WorkspaceStack />

      {/* Learning Testimonials Section */}
      <TestimonialsSection />

      {/* Why Prolync Section (Scroll Triggered) */}
      <WhyProlync />

      {/* CTA Section */}
      {/* Animated Text Banner (Above Footer) */}
      <section className="py-20 bg-[#020617] relative overflow-hidden flex items-center justify-center border-t border-slate-800/50">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />

        <div className="w-full relative z-10 px-4 md:px-8 flex justify-center">
          <h2 className="flex flex-wrap justify-center gap-4 md:gap-8 text-4xl md:text-6xl lg:text-7xl font-black uppercase leading-none tracking-tighter">
            {["Prolync", "MAKES", "LEARNER", "CLEVER"].map((word, i) => {
              const isConstant = word === "Prolync";
              return (
                <div
                  key={i}
                  className={`flex cursor-default transition-transform duration-200 hover:scale-110 ${isConstant
                    ? "bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-300 bg-clip-text text-transparent"
                    : "text-slate-700 hover:text-transparent hover:bg-gradient-to-r hover:from-blue-400 hover:via-indigo-400 hover:to-cyan-300 hover:bg-clip-text"
                    }`}
                >
                  {word.split("").map((char, j) => (
                    <span
                      key={j}
                      className="inline-block"
                    >
                      {char}
                    </span>
                  ))}
                </div>
              );
            })}
          </h2>
        </div>
      </section>
      {/* Footer */}
      <Footer />
      {/* AI Chatbot */}
      <Chatbot />
    </div>
  );
}
