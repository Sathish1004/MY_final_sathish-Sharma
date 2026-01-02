import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Mail, Clock, Globe, Send, Loader2, CheckCircle2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

export default function Contact() {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: 'General Inquiry',
        message: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubjectChange = (value: string) => {
        setFormData({ ...formData, subject: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/contact/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to send message');
            }

            setSuccess(true);
            toast({
                title: "Message Sent!",
                description: "Thank you for contacting Prolync. We'll get back to you shortly.",
                duration: 5000,
            });
            setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });

        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Something went wrong. Please try again.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative py-20 bg-gradient-to-b from-primary/5 to-background text-center overflow-hidden">
                <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[bottom_1px_center] [mask-image:linear-gradient(to_bottom,transparent,black)] pointer-events-none" />
                <div className="container relative z-10 mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent animate-fade-in-up">
                        Contact Prolync
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in-up delay-100">
                        Have questions about Student Workspace? We’re here to help.
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-12">
                <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <Card className="border-border/50 shadow-xl bg-card/50 backdrop-blur-sm animate-fade-in-up delay-200">
                            <CardHeader>
                                <CardTitle className="text-2xl">Send us a Message</CardTitle>
                                <CardDescription>
                                    Fill out the form below and we'll get back to you as soon as possible.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {success ? (
                                    <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                                        <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-2 animate-scale-in">
                                            <CheckCircle2 className="h-8 w-8" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-foreground">Thank You!</h3>
                                        <p className="text-muted-foreground max-w-md">
                                            Your message has been sent successfully. Check your email for a confirmation.
                                        </p>
                                        <Button
                                            variant="outline"
                                            onClick={() => setSuccess(false)}
                                            className="mt-4"
                                        >
                                            Send Another Message
                                        </Button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                    Full Name
                                                </label>
                                                <Input
                                                    name="name"
                                                    placeholder="John Doe"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                    Email Address
                                                </label>
                                                <Input
                                                    type="email"
                                                    name="email"
                                                    placeholder="john@example.com"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                Subject
                                            </label>
                                            <Select
                                                value={formData.subject}
                                                onValueChange={handleSubjectChange}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a subject" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="General Inquiry">General Inquiry</SelectItem>
                                                    <SelectItem value="Student Workspace">Student Workspace</SelectItem>
                                                    <SelectItem value="Pricing & Plans">Pricing & Plans</SelectItem>
                                                    <SelectItem value="Support">Support</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                Message
                                            </label>
                                            <Textarea
                                                name="message"
                                                placeholder="How can we help you?"
                                                className="min-h-[150px]"
                                                value={formData.message}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                    Sending...
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="mr-2 h-5 w-5" />
                                                    Send Message
                                                </>
                                            )}
                                        </Button>
                                    </form>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Support Info Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card className="border-border/50 shadow-md bg-card/50 backdrop-blur-sm animate-fade-in-right delay-300">
                            <CardHeader>
                                <CardTitle className="text-xl">Contact Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="h-10 w-10 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-foreground">Email Us</h4>
                                        <p className="text-sm text-muted-foreground mb-1">For general inquiries</p>
                                        <a href="mailto:support@prolync.in" className="text-primary hover:underline font-medium">
                                            support@prolync.in
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="h-10 w-10 shrink-0 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                                        <Globe className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-foreground">Visit Us</h4>
                                        <p className="text-sm text-muted-foreground mb-1">Prolync Student Workspace</p>
                                        <a href="https://prolync.in" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
                                            www.prolync.in
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="h-10 w-10 shrink-0 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                        <Clock className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-foreground">Response Time</h4>
                                        <p className="text-sm text-muted-foreground">
                                            We aim to respond to all inquiries within <span className="font-medium text-foreground">24 hours</span>.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/10 animate-fade-in-right delay-400">
                            <h4 className="font-semibold mb-2">Need immediate help?</h4>
                            <p className="text-sm text-muted-foreground mb-4">
                                Check out our documentation and FAQ for quick answers to common questions.
                            </p>
                            <Button variant="outline" className="w-full bg-background/50">
                                Visit Help Center
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
