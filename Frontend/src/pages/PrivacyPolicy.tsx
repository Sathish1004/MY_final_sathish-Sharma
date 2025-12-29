import React from 'react';
import PolicyPageLayout from '@/components/layout/PolicyPageLayout';

const PrivacyPolicy = () => {
    return (
        <PolicyPageLayout
            title="Privacy Policy"
            subtitle="How we protect your data and learning journey at Prolync Student Workspace."
        >
            <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Your Privacy is Our Priority</h2>
                <p>
                    At Prolync, we believe that your educational journey should be secure, private, and focused. This policy explains how we collect, use, and protect your information when you use our unified student workspace.
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">What Data We Collect</h2>
                <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Account Info:</strong> Name, email, and college details to set up your personalized dashboard.</li>
                    <li><strong>Learning Progress:</strong> Your course completions, coding platform activity, and project milestones to help you track growth.</li>
                    <li><strong>Professional Data:</strong> Resume information and skill badges if you choose to use our placement and recruitment features.</li>
                </ul>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">How We Use Your Information</h2>
                <p>
                    We use your data strictly to enhance your learning experience:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li>To provide a personalized "Quick Links" section on your dashboard.</li>
                    <li>To recommend courses and mentorship sessions tailored to your career goals.</li>
                    <li>To connect you with relevant internship and job opportunities based on your skills.</li>
                </ul>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Learning Analytics</h2>
                <p>
                    We analyze platform usage to improve our coding playground and course delivery. This data is used to understand common learning hurdles and provide better educational resources for the entire student community.
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Data Protection</h2>
                <p>
                    Your data is encrypted and stored securely. We do not sell your personal information to third-party advertisers. Access to your professional profile is only shared with verified recruiters after your explicit consent.
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Your Rights</h2>
                <p>
                    You have full control over your data. You can update your profile, export your learning certificates, or request account deletion at any time through your dashboard settings.
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

export default PrivacyPolicy;
