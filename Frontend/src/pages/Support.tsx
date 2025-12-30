import React from 'react';
import PolicyPageLayout from '@/components/layout/PolicyPageLayout';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from "@/components/ui/accordion";

const Support = () => {
    const faqs = [
        {
            category: "Workspace & Dashboard",
            items: [
                {
                    q: "What is the Prolync Student Workspace?",
                    a: "It's a unified platform that brings your courses, coding, projects, and career planning into one single dashboard. No more jumping between ten different tabs!"
                },
                {
                    q: "How do I customize my Quick Links?",
                    a: "Your dashboard automatically pins your most-used tools. You can also manually adjust these in your Profile Settings under 'Workspace Preferences'."
                }
            ]
        },
        {
            category: "Courses & Coding",
            items: [
                {
                    q: "Are the coding certificates recognized by companies?",
                    a: "Yes! Prolync skill badges and certifications are verified and can be directly linked to your LinkedIn profile for recruiters to see."
                },
                {
                    q: "Can I use the coding playground for my college projects?",
                    a: "Absolutely. Our 'Playground' mode is designed for you to experiment and build whatever you like, with support for multiple languages and stacks."
                }
            ]
        },
        {
            category: "Mentorship & Jobs",
            items: [
                {
                    q: "How do I book a session with a FAANG mentor?",
                    a: "Navigate to the 'Mentors' page, choose your domain, and pick a slot that fits your schedule. You'll receive a calendar invite instantly."
                },
                {
                    q: "Will Prolync help me get an internship?",
                    a: "Our 'Jobs & Placements' section lists exclusive drives for Prolync students. Completing relevant courses and projects increases your visibility to our hiring partners."
                }
            ]
        }
    ];

    return (
        <PolicyPageLayout
            title="Support & FAQs"
            subtitle="Everything you need to know about navigating the Prolync ecosystem."
        >
            <div className="space-y-12">
                {faqs.map((group, idx) => (
                    <div key={idx} className="space-y-6">
                        <h2 className="text-2xl font-bold text-slate-900 border-l-4 border-blue-500 pl-4">
                            {group.category}
                        </h2>
                        <Accordion type="single" collapsible className="w-full">
                            {group.items.map((faq, fIdx) => (
                                <AccordionItem key={fIdx} value={`item-${idx}-${fIdx}`} className="border-slate-100">
                                    <AccordionTrigger className="text-left font-semibold text-slate-700 hover:text-blue-600 hover:no-underline py-4">
                                        {faq.q}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-slate-500 text-lg leading-relaxed pb-4">
                                        {faq.a}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                ))}
            </div>

            <section className="bg-blue-50/50 rounded-3xl p-8 mt-12 border border-blue-100 text-center">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Still have questions?</h3>
                <p className="text-slate-600 mb-6 font-medium">Our team is here to help you clear any academic or technical doubts.</p>
                <div className="flex flex-wrap justify-center gap-4">
                    <p className="text-slate-700 font-bold">Email: support@prolync.in</p>
                    <span className="hidden md:inline text-slate-300">|</span>
                    <p className="text-slate-700 font-bold">Response Time: &lt; 24 Hours</p>
                </div>
            </section>

            <div className="pt-8 border-t border-slate-100">
                <p className="text-sm text-slate-400">
                    Last Updated: December 2025
                </p>
            </div>
        </PolicyPageLayout>
    );
};

export default Support;
