import React from 'react';
import PolicyPageLayout from '@/components/layout/PolicyPageLayout';

const TermsOfUse = () => {
    return (
        <PolicyPageLayout
            title="Terms of Use"
            subtitle="Guidelines for a productive and respectful workspace for all Prolync students."
        >
            <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Welcome to the Prolync Ecosystem</h2>
                <p>
                    By using Prolync, you're joining a community dedicated to skill-building and career growth. These terms ensure that the platform remains a safe and effective workspace for everyone.
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Platform Access</h2>
                <ul className="list-decimal pl-6 space-y-2">
                    <li><strong>Eligibility:</strong> Prolync is designed for students, educators, and lifelong learners.</li>
                    <li><strong>Account Security:</strong> You are responsible for maintaining the confidentiality of your workspace login.</li>
                    <li><strong>Fair Use:</strong> Our coding platforms and resources are provided for educational purposes. Any attempt to disrupt service or scrape content is prohibited.</li>
                </ul>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Academic Integrity</h2>
                <p>
                    We value honest learning. While collaboration is encouraged in our community, using platform resources (like coding playgrounds) to bypass academic requirements or engage in plagiarism is strictly against our guidelines.
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Community Conduct</h2>
                <p>
                    Our student community, mentorship sessions, and hackathons are spaces for growth. We expect all members to:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li>Be respectful and inclusive of all backgrounds.</li>
                    <li>Share knowledge and constructive feedback.</li>
                    <li>Refer to the Mentorship Code of Conduct during 1:1 sessions.</li>
                </ul>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Ownership of Work</h2>
                <p>
                    You retain ownership of the projects and code you create within the Prolync workspace. We provide the tools, but the innovation is yours!
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Changes to Service</h2>
                <p>
                    Education is always evolving, and so is Prolync. We may occasionally update platform features or subscription plans to better serve the student community.
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

export default TermsOfUse;
