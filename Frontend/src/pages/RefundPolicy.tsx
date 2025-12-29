import React from 'react';
import PolicyPageLayout from '@/components/layout/PolicyPageLayout';

const RefundPolicy = () => {
    return (
        <PolicyPageLayout
            title="Refund Policy"
            subtitle="Our commitment to transparency regarding payments and subscriptions."
        >
            <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Educational Investment</h2>
                <p>
                    Prolync offers a mix of free resources and premium features (like advanced courses and personalized mentorship). We want you to feel confident in your investment in your future.
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Subscription Upgrades</h2>
                <p>
                    We offer a 7-day "No-Questions-Asked" refund policy for first-time subscription upgrades. If you find that the premium workspace features aren't a fit for your current learning style, you can request a full refund within the first week.
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Mentorship Sessions</h2>
                <p>
                    Mentorship is a high-value interaction with industry experts.
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li><strong>Cancellations:</strong> Refunds are provided if a session is cancelled at least 24 hours in advance.</li>
                    <li><strong>Rescheduling:</strong> You can reschedule a session once for free, provided the mentor is notified 12 hours prior.</li>
                    <li><strong>No-Shows:</strong> Sessions missed without notice are not eligible for a refund.</li>
                </ul>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Special Courses & Certifications</h2>
                <p>
                    Fees for specialized certification Exams or one-time intensive bootcamps are generally non-refundable once the course materials have been accessed or the exam token has been generated.
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">How to Request a Refund</h2>
                <p>
                    Simply drop an email to <strong>support@prolync.in</strong> with your registered email ID and the transaction details. Our student support team will process your request within 3-5 business days.
                </p>
            </section>

            <div className="pt-8 border-t border-slate-100">
                <p className="text-sm text-slate-400">
                    Last Updated: December 2025
                </p>
            </div>
        </PolicyPageLayout>
    );
};

export default RefundPolicy;
