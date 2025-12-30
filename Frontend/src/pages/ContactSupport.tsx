import React from 'react';
import PolicyPageLayout from '@/components/layout/PolicyPageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Mail,
    MessageSquare,
    MapPin,
    Send,
    HeadphonesIcon
} from 'lucide-react';
import { toast } from 'sonner';

const ContactSupport = () => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success("Support ticket created! We'll get back to you shortly.");
    };

    return (
        <PolicyPageLayout
            title="Contact Support"
            subtitle="Get in touch with our technical and academic support team."
        >
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                {/* Contact Form */}
                <div className="lg:col-span-3 space-y-8">
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-slate-900">Send a Message</h2>
                        <p className="text-slate-500 font-medium">Please include your registered email for faster assistance.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                                <Input placeholder="John Doe" className="h-12 rounded-xl border-slate-200 focus:border-blue-500 transition-all" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                                <Input type="email" placeholder="john@college.edu" className="h-12 rounded-xl border-slate-200 focus:border-blue-500 transition-all" required />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">Issue Category</label>
                            <select className="flex h-12 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all">
                                <option>Dashboard & Progress</option>
                                <option>Coding Platform / Labs</option>
                                <option>Mentorship Booking</option>
                                <option>Payments & Billing</option>
                                <option>Others</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">Message</label>
                            <Textarea
                                placeholder="Describe your issue or feedback in detail..."
                                className="min-h-[150px] rounded-2xl border-slate-200 focus:border-blue-500 transition-all p-4"
                                required
                            />
                        </div>

                        <Button className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg shadow-xl shadow-blue-500/20 group transition-all">
                            Submit Support Ticket
                            <Send className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </form>
                </div>

                {/* Contact Info Sidebar */}
                <div className="lg:col-span-2 space-y-10 lg:pl-8">
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-slate-900">Support Channels</h2>

                        <div className="space-y-4">
                            <div className="flex items-start gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-blue-200 transition-all">
                                <div className="p-3 rounded-xl bg-blue-100 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                                    <Mail className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900">Email Us</p>
                                    <p className="text-slate-500 text-sm">support@prolync.in</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-purple-200 transition-all">
                                <div className="p-3 rounded-xl bg-purple-100 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-all">
                                    <MessageSquare className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900">Live Chat</p>
                                    <p className="text-slate-500 text-sm">Available Mon-Fri, 9am - 6pm</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-amber-200 transition-all">
                                <div className="p-3 rounded-xl bg-amber-100 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-all">
                                    <HeadphonesIcon className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900">Help Center</p>
                                    <p className="text-slate-500 text-sm">Read tutorials and guides</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6 border-t border-slate-100 pt-10">
                        <h2 className="text-2xl font-bold text-slate-900">Our Office</h2>
                        <div className="text-slate-500 leading-relaxed font-medium flex gap-3">
                            <MapPin className="h-5 w-5 shrink-0 text-blue-500" />
                            <p>
                                Block 2, Off No. 14, CIIC Campus,<br />
                                Crescent University, GST Road,<br />
                                Vandalur, Chennai – 600048.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-8 border-t border-slate-100 mt-12">
                <p className="text-sm text-slate-400 text-center">
                    Response time: Usually within 24 hours.
                </p>
            </div>
        </PolicyPageLayout>
    );
};

export default ContactSupport;
