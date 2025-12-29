import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from '@/components/ui/sheet';
import {
    Briefcase,
    Users,
    MessageSquare,
    FileText,
    CheckCircle2,
    BookOpen,
    Target,
    ArrowRight,
    Calendar,
    Clock,
    X
} from 'lucide-react';

const placementResources = [
    {
        id: 1,
        title: 'Mastering Group Discussions: A Comprehensive Guide',
        type: 'GD Preparation',
        level: 'Beginner',
        author: 'Sarah Jenkins',
        date: 'Dec 18, 2025',
        description: 'Learn the do\'s and don\'ts of GDs, how to initiate, and effective body language tips.',
        image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=450&fit=crop',
        content: `
            <div class="space-y-6">
                <p class="text-xl font-medium leading-relaxed text-muted-foreground">Group Discussions (GDs) are a critical part of the hiring process used by many companies to assess your communication skills, leadership qualities, and ability to work in a team. It's not just about speaking the most, but speaking the most sensibly.</p>
                
                <h3 class="text-2xl font-extrabold mt-8 mb-4 text-foreground">1. The Art of Initiation</h3>
                <p>Starting the discussion gives you bonus points, but only if done correctly. You can start by:</p>
                <ul class="list-disc pl-5 space-y-2 mt-2">
                    <li>Defining the topic clearly.</li>
                    <li>Providing a shocking statistic or quote.</li>
                    <li>Stating the agenda or structure for the discussion.</li>
                </ul>

                <h3 class="text-2xl font-extrabold mt-8 mb-4 text-foreground">2. Do's and Don'ts</h3>
                <div class="grid md:grid-cols-2 gap-4">
                    <div class="bg-emerald-500/10 p-6 rounded-xl border border-emerald-500/20">
                        <h4 class="font-bold text-emerald-700 mb-3 text-lg">Do's</h4>
                        <ul class="list-disc pl-5 space-y-2 text-base">
                            <li>Listen actively to others.</li>
                            <li>Maintain eye contact.</li>
                            <li>Address the group, not just the moderator.</li>
                            <li>Bring quiet members into the discussion.</li>
                        </ul>
                    </div>
                    <div class="bg-rose-500/10 p-6 rounded-xl border border-rose-500/20">
                        <h4 class="font-bold text-rose-700 mb-3 text-lg">Don'ts</h4>
                        <ul class="list-disc pl-5 space-y-2 text-base">
                            <li>Interrupt aggressively.</li>
                            <li>Point fingers or be rude.</li>
                            <li>Get emotional about sensitive topics.</li>
                            <li>Dominate the conversation completely.</li>
                        </ul>
                    </div>
                </div>

                <h3 class="text-2xl font-extrabold mt-8 mb-4 text-foreground">3. Body Language</h3>
                <p>Your non-verbal cues speak louder than words. Sit straight, don't cross your arms (it signals defensiveness), and use hand gestures naturally. A calm and composed demeanor projects confidence.</p>
            </div>
        `
    },
    {
        id: 2,
        title: 'Top 50 HR Interview Questions & Answers',
        type: 'Interview Crack',
        level: 'Intermediate',
        author: 'James Wilson',
        date: 'Dec 15, 2025',
        description: 'Prepare for common questions like "Tell me about yourself" and "Strengths/Weaknesses".',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=450&fit=crop',
        content: `
            <div class="space-y-6">
                <p class="text-xl font-medium leading-relaxed text-muted-foreground">HR interviews are designed to test your cultural fit and soft skills. Unlike technical rounds, there's no single "right" answer, but there are definitely wrong ones.</p>
                
                <div class="space-y-6">
                    <div class="bg-muted/50 p-6 rounded-2xl border">
                        <h4 class="text-xl font-bold text-primary mb-3">Q1. Tell me about yourself.</h4>
                        <p class="mb-3 text-muted-foreground"><strong>The Trap:</strong> Reciting your resume line-by-line or talking about your childhood.</p>
                        <p class="font-medium text-foreground"><strong>The Strategy:</strong> Use the "Present, Past, Future" formula. Start with your current role, mention 2-3 key achievements from the past, and finish with why you are excited for this future opportunity.</p>
                    </div>

                    <div class="bg-muted/50 p-6 rounded-2xl border">
                        <h4 class="text-xl font-bold text-primary mb-3">Q2. What are your strengths?</h4>
                        <p class="font-medium text-foreground"><strong>The Strategy:</strong> Don't just list adjectives. Back them up with stories. Instead of saying "I am hardworking," say "I have a track record of meeting tight deadlines, for example, in my last project..."</p>
                    </div>

                    <div class="bg-muted/50 p-6 rounded-2xl border">
                        <h4 class="text-xl font-bold text-primary mb-3">Q3. Why should we hire you?</h4>
                        <p class="font-medium text-foreground"><strong>The Strategy:</strong> Connect your skills to their needs. "Based on your job description, you need someone who knows React and can optimize performance. In my internship, I reduced page load time by 40% using..."</p>
                    </div>
                </div>
            </div>
        `
    },
    {
        id: 3,
        title: 'Mock GD Session: "AI in Future - Boon or Bane?"',
        type: 'GD Preparation',
        level: 'Advanced',
        author: 'Tech Insider',
        date: 'Dec 12, 2025',
        description: 'Detailed analysis of a mock group discussion on the impact of AI.',
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=450&fit=crop',
        content: `
            <div class="space-y-6">
                <h3 class="text-2xl font-extrabold mb-4 text-foreground">Topic Overview</h3>
                <p class="text-lg leading-relaxed">This is a classic controversial topic. The key is not to pick a side blindly, but to discuss the nuances. A balanced view often wins more points than a radical one.</p>
                
                <h3 class="text-2xl font-extrabold mt-8 mb-4 text-foreground">Key Arguments to Raise</h3>
                <ul class="list-disc pl-5 space-y-4 text-lg">
                    <li>
                        <strong>Economic Impact:</strong> 
                        <span class="text-muted-foreground block mt-1 text-base">AI will displace repetitive jobs but create new high-value roles in tech, ethics, and maintenance. The transition period will be painful but necessary.</span>
                    </li>
                    <li>
                        <strong>Healthcare Revolution:</strong>
                        <span class="text-muted-foreground block mt-1 text-base">AI in diagnosis (detecting cancer earlier than doctors) and drug discovery is an undeniable boon for humanity.</span>
                    </li>
                    <li>
                        <strong>Ethical Concerns:</strong>
                        <span class="text-muted-foreground block mt-1 text-base">Deepfakes, algorithmic bias, and autonomous weapons are significant threats that need strict regulation.</span>
                    </li>
                </ul>

                <h3 class="text-2xl font-extrabold mt-8 mb-4 text-foreground">Winning Conclusion</h3>
                <div class="p-6 bg-primary/5 rounded-xl border-l-4 border-primary italic text-lg leading-relaxed text-muted-foreground">
                    "To conclude, AI is neither inherently good nor bad; it is a tool. Like nuclear energy, it can power cities or destroy them. The focus should be on creating robust regulations to mitigate the risks while maximizing the benefits for society."
                </div>
            </div>
        `
    },
    {
        id: 4,
        title: 'Technical Interview Cheat Sheet (Java)',
        type: 'Interview Crack',
        level: 'Advanced',
        author: 'Code Master',
        date: 'Dec 10, 2025',
        description: 'Quick revision guide for Java OOPs concepts, collections, and multithreading.',
        image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=450&fit=crop',
        content: `
            <div class="space-y-6">
                <h3 class="text-2xl font-extrabold mb-4 text-foreground">1. Core OOPs Concepts</h3>
                <div class="grid gap-4">
                    <div class="border p-5 rounded-xl group hover:border-primary/50 transition-colors">
                        <strong class="text-lg text-primary block mb-1">Polymorphism</strong>
                        <p class="text-base text-muted-foreground">The ability of an object to take on many forms. Java supports Overloading (Compile-time) and Overriding (Run-time).</p>
                    </div>
                    <div class="border p-5 rounded-xl group hover:border-primary/50 transition-colors">
                        <strong class="text-lg text-primary block mb-1">Encapsulation</strong>
                        <p class="text-base text-muted-foreground">Wrapping data (variables) and code (methods) together. Achieved using 'private' variables and public getter/setter methods.</p>
                    </div>
                </div>

                <h3 class="text-2xl font-extrabold mt-8 mb-4 text-foreground">2. Java Collections Framework</h3>
                <div class="overflow-x-auto rounded-xl border">
                    <table class="w-full text-base">
                        <thead class="bg-muted/50">
                            <tr>
                                <th class="p-4 text-left font-bold text-foreground">Interface</th>
                                <th class="p-4 text-left font-bold text-foreground">Implementation</th>
                                <th class="p-4 text-left font-bold text-foreground">Use Case</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y">
                            <tr>
                                <td class="p-4 font-medium">List</td>
                                <td class="p-4 text-muted-foreground">ArrayList, LinkedList</td>
                                <td class="p-4 text-muted-foreground">Ordered, allows duplicates. Use ArrayList for fast access, LinkedList for fast inserts.</td>
                            </tr>
                            <tr>
                                <td class="p-4 font-medium">Set</td>
                                <td class="p-4 text-muted-foreground">HashSet, TreeSet</td>
                                <td class="p-4 text-muted-foreground">Unique elements only. HashSet is faster (O(1)), TreeSet is sorted (O(log n)).</td>
                            </tr>
                            <tr>
                                <td class="p-4 font-medium">Map</td>
                                <td class="p-4 text-muted-foreground">HashMap, TreeMap</td>
                                <td class="p-4 text-muted-foreground">Key-Value pairs. Keys must be unique.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `
    },
    {
        id: 5,
        title: 'Aptitude: Time & Work Problems',
        type: 'Aptitude Tests',
        level: 'Intermediate',
        author: 'Math Wizard',
        date: 'Dec 05, 2025',
        description: 'Formulas and practice problems for quantitative aptitude.',
        image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=450&fit=crop',
        content: `
            <div class="space-y-6">
                <h3 class="text-2xl font-extrabold mb-4 text-foreground">Basic Formulas</h3>
                <div class="grid md:grid-cols-2 gap-4">
                    <p class="font-mono bg-muted p-4 rounded-xl text-center text-lg border">Work = Rate × Time</p>
                    <p class="font-mono bg-muted p-4 rounded-xl text-center text-lg border">Rate = 1 / Time</p>
                </div>

                <h3 class="text-2xl font-extrabold mt-8 mb-4 text-foreground">Example Problem</h3>
                <div class="bg-card border p-6 rounded-xl shadow-sm">
                    <p class="mb-6 text-xl font-medium leading-relaxed"><strong>Question:</strong> A can do a work in 10 days and B in 15 days. If they work together, how long will they take?</p>
                    
                    <div class="space-y-3 text-muted-foreground text-lg">
                        <p>A's 1 day work = 1/10</p>
                        <p>B's 1 day work = 1/15</p>
                        <div class="my-4 border-t w-1/2"></div>
                        <p>(A + B)'s 1 day work = 1/10 + 1/15</p>
                        <p>= (3 + 2) / 30 = 5/30 = 1/6</p>
                        <p class="text-foreground font-bold text-xl mt-4">Total days = 6 days.</p>
                    </div>
                </div>
            </div>
        `
    },
    {
        id: 6,
        title: 'Resume Building Workshop',
        type: 'Resume Building',
        level: 'Beginner',
        author: 'Career Coach',
        date: 'Dec 01, 2025',
        description: 'Step-by-step guide to creating an ATS-friendly resume.',
        image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&h=450&fit=crop',
        content: `
            <div class="space-y-6">
                <h3 class="text-2xl font-extrabold mb-4 text-foreground">The Structure of a Perfect Resume</h3>
                <ol class="list-decimal pl-6 space-y-4 marker:font-bold marker:text-primary list-outside text-lg text-muted-foreground">
                    <li><strong class="text-foreground">Contact Info:</strong> Name, Phone, Email, LinkedIn, GitHub.</li>
                    <li><strong class="text-foreground">Experience:</strong> Reverse chronological order. Focus on impact, not just duties.</li>
                    <li><strong class="text-foreground">Projects:</strong> Highlight technologies used and the problem solved.</li>
                    <li><strong class="text-foreground">Skills:</strong> Group them (e.g., Languages, Frameworks, Tools).</li>
                    <li><strong class="text-foreground">Education:</strong> Degree, College, CGPA (if good).</li>
                </ol>

                <h3 class="text-2xl font-extrabold mt-8 mb-4 text-foreground">ATS Tips</h3>
                <div class="bg-blue-500/10 p-6 rounded-xl border border-blue-500/20">
                    <h4 class="font-bold text-blue-700 mb-3 text-lg">What is ATS?</h4>
                    <p class="mb-4 text-base">ATS (Applicant Tracking Systems) parse your resume automatically before a human sees it.</p>
                    <ul class="list-disc pl-5 space-y-2 text-base">
                        <li>Use standard headings (Experience, Education).</li>
                        <li>Avoid columns, tables, or complex graphics.</li>
                        <li>Pdf format is usually best unless Word is requested.</li>
                        <li>Include keywords from the job description naturally.</li>
                    </ul>
                </div>
            </div>
        `
    },
    {
        id: 7,
        title: 'Amazon Leadership Principles Decoded',
        type: 'Interview Crack',
        level: 'Advanced',
        author: 'Ex-Amazonian',
        date: 'Dec 22, 2025',
        description: 'How to answer behavioral questions using the STAR method and Amazon LPs.',
        image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=450&fit=crop',
        content: `
            <div class="space-y-6">
                <p class="text-xl font-medium leading-relaxed text-muted-foreground">If you are interviewing at Amazon, the Leadership Principles (LPs) are your bible. Every answer you give is evaluated against these 16 principles.</p>

                <h3 class="text-2xl font-extrabold mt-8 mb-4 text-foreground">Top 3 Principles to Know</h3>
                <ul class="space-y-4">
                    <li class="p-6 bg-muted/30 rounded-xl border hover:border-primary/50 transition-colors">
                        <strong class="text-xl text-foreground block mb-2">Customer Obsession</strong>
                        <p class="text-muted-foreground text-lg">Leaders start with the customer and work backwards. They work vigorously to earn and keep customer trust.</p>
                        <p class="text-sm font-medium text-primary mt-3"><em>Example Q: Tell me about a time you went above and beyond for a customer.</em></p>
                    </li>
                    <li class="p-6 bg-muted/30 rounded-xl border hover:border-primary/50 transition-colors">
                        <strong class="text-xl text-foreground block mb-2">Ownership</strong>
                        <p class="text-muted-foreground text-lg">Leaders look at the long term and don't sacrifice long-term value for short-term results. They never say "that's not my job."</p>
                    </li>
                    <li class="p-6 bg-muted/30 rounded-xl border hover:border-primary/50 transition-colors">
                        <strong class="text-xl text-foreground block mb-2">Bias for Action</strong>
                        <p class="text-muted-foreground text-lg">Speed matters in business. Many decisions are reversible and do not need extensive study. Calculated risk taking is valued.</p>
                    </li>
                </ul>

                <h3 class="text-2xl font-extrabold mt-8 mb-4 text-foreground">The STAR Method</h3>
                <p class="text-lg">Structure every answer using:</p>
                <ul class="list-disc pl-5 font-medium space-y-2 text-lg text-muted-foreground">
                    <li><strong class="text-foreground">S</strong>ituation: What was the context?</li>
                    <li><strong class="text-foreground">T</strong>ask: What was the goal?</li>
                    <li><strong class="text-foreground">A</strong>ction: What specific steps did YOU take?</li>
                    <li><strong class="text-foreground">R</strong>esult: What was the outcome? Use numbers if possible.</li>
                </ul>
            </div>
        `
    },
    {
        id: 8,
        title: 'System Design Basics: Load Balancing',
        type: 'Interview Crack',
        level: 'Expert',
        author: 'System Architect',
        date: 'Dec 25, 2025',
        description: 'Understanding horizontal scaling and load balancers for high-traffic apps.',
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=450&fit=crop',
        content: `
            <div class="space-y-6">
                <p class="text-xl font-medium leading-relaxed text-muted-foreground">Load balancing is the process of distributing network traffic across multiple servers. This ensures no single server bears too much demand.</p>

                <h3 class="text-2xl font-extrabold mt-8 mb-4 text-foreground">Algorithms</h3>
                <ul class="list-disc pl-5 space-y-2 text-lg text-muted-foreground">
                    <li><strong class="text-foreground">Round Robin:</strong> Requests are distributed sequentially.</li>
                    <li><strong class="text-foreground">Least Connections:</strong> Request sent to server with fewest active connections.</li>
                    <li><strong class="text-foreground">IP Hash:</strong> Request sent based on client IP (useful for sticky sessions).</li>
                </ul>

                <h3 class="text-2xl font-extrabold mt-8 mb-4 text-foreground">L4 vs L7 Load Balancing</h3>
                <div class="grid md:grid-cols-2 gap-4">
                    <div class="border p-6 rounded-xl">
                        <strong class="block mb-2 text-xl">Layer 4 (Transport)</strong>
                        <p class="text-muted-foreground">Works at TCP/UDP level. Routes based on IP + Port. Faster, but less "smart".</p>
                    </div>
                    <div class="border p-6 rounded-xl">
                        <strong class="block mb-2 text-xl">Layer 7 (Application)</strong>
                        <p class="text-muted-foreground">Works at HTTP level. Can route based on URL, Cookies, Headers. Smarter, but more CPU intensive.</p>
                    </div>
                </div>
            </div>
        `
    }
];

const getResourceIcon = (type: string) => {
    switch (type) {
        case 'GD Preparation': return Users;
        case 'Interview Crack': return MessageSquare;
        case 'Aptitude Tests': return Target;
        case 'Resume Building': return FileText;
        default: return BookOpen;
    }
};

const getResourceColor = (type: string) => {
    switch (type) {
        case 'GD Preparation': return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
        case 'Interview Crack': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
        case 'Aptitude Tests': return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
        case 'Resume Building': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
        default: return 'bg-primary/10 text-primary border-primary/20';
    }
};

import FeatureGuard from "@/components/FeatureGuard";

export default function Placements() {
    const [selectedResource, setSelectedResource] = useState<typeof placementResources[0] | null>(null);

    const gdResources = placementResources.filter(r => r.type === 'GD Preparation');
    const interviewResources = placementResources.filter(r => r.type === 'Interview Crack');

    const renderResourceCard = (resource: typeof placementResources[0], index: number) => {
        const Icon = getResourceIcon(resource.type);

        return (
            <Card
                key={resource.id}
                onClick={() => setSelectedResource(resource)}
                className="overflow-hidden hover:shadow-lg transition-all duration-300 card-hover animate-fade-in group cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}
            >
                <div className="relative h-48 overflow-hidden">
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10" />
                    <img
                        src={resource.image}
                        alt={resource.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <Badge className={`absolute top-4 left-4 z-20 backdrop-blur-md bg-white/90 ${getResourceColor(resource.type)}`}>
                        <Icon className="h-3 w-3 mr-1" />
                        {resource.type}
                    </Badge>
                </div>

                <CardContent className="p-5">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                        <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" /> Read Article</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Target className="h-3 w-3" /> {resource.level}</span>
                    </div>

                    <h3 className="font-bold text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors">{resource.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {resource.description}
                    </p>

                    <div className="text-primary text-sm font-medium flex items-center group-hover:translate-x-1 transition-transform">
                        Read More <ArrowRight className="ml-1 h-4 w-4" />
                    </div>
                </CardContent>
            </Card>
        );
    };

    return (
        <FeatureGuard feature="placements">
            <div className="space-y-8 animate-fade-in p-6 md:p-8 max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Placement Hub</h1>
                        <p className="text-muted-foreground mt-1 text-lg">
                            Complete guide to crack your dream job interview
                        </p>
                    </div>

                </div>

                <Tabs defaultValue="all" className="w-full">
                    <TabsList className="mb-8 w-full md:w-auto overflow-x-auto justify-start h-auto p-1 bg-muted/50 backdrop-blur-sm border">
                        <TabsTrigger value="all" className="px-4 py-2 font-medium">All Resources</TabsTrigger>
                        <TabsTrigger value="gd" className="px-4 py-2 font-medium">GD Preparation</TabsTrigger>
                        <TabsTrigger value="interview" className="px-4 py-2 font-medium">Interview Crack</TabsTrigger>
                        <TabsTrigger value="aptitude" className="px-4 py-2 font-medium">Aptitude & Resume</TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="mt-0">
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {placementResources.map((res, index) => renderResourceCard(res, index))}
                        </div>
                    </TabsContent>

                    <TabsContent value="gd" className="mt-0">
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {gdResources.map((res, index) => renderResourceCard(res, index))}
                        </div>
                    </TabsContent>

                    <TabsContent value="interview" className="mt-0">
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {interviewResources.map((res, index) => renderResourceCard(res, index))}
                        </div>
                    </TabsContent>

                    <TabsContent value="aptitude" className="mt-0">
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {placementResources.filter(r => ['Aptitude Tests', 'Resume Building'].includes(r.type)).map((res, index) => renderResourceCard(res, index))}
                        </div>
                    </TabsContent>
                </Tabs>

                {/* Content Sheet (Side Drawer) */}
                <Sheet open={!!selectedResource} onOpenChange={(open) => !open && setSelectedResource(null)}>
                    <SheetContent className="w-full sm:max-w-[calc(100vw-270px)] p-0 gap-0 overflow-y-auto border-l shadow-2xl">
                        {selectedResource && (
                            <>
                                <div className="relative w-full h-64 md:h-72 shrink-0 bg-black">
                                    <img
                                        src={selectedResource.image}
                                        alt={selectedResource.title}
                                        className="w-full h-full object-contain"
                                    />
                                    {/* Bottom Blur / Gradient Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent flex items-end">
                                        <div className="w-full h-32 bg-gradient-to-t from-background to-transparent opacity-90 backdrop-blur-[2px]" />
                                    </div>
                                </div>

                                <div className="px-8 pb-12 -mt-12 relative z-10">
                                    {/* Header Meta */}
                                    <div className="flex items-center gap-3 mb-6">
                                        <Badge className={`${getResourceColor(selectedResource.type)} border-0 px-3 py-1 text-sm font-semibold shadow-sm`}>
                                            {selectedResource.type}
                                        </Badge>
                                        <span className="text-sm font-medium text-muted-foreground flex items-center gap-1 bg-background/50 backdrop-blur-sm px-2 py-1 rounded-md">
                                            <Calendar className="h-4 w-4" /> {selectedResource.date}
                                        </span>
                                    </div>

                                    <SheetHeader className="mb-8 space-y-4">
                                        <SheetTitle className="text-4xl md:text-5xl font-extrabold text-foreground leading-tight tracking-tight">
                                            {selectedResource.title}
                                        </SheetTitle>

                                        {/* Author Block */}
                                        <div className="flex items-center gap-3 pt-2">
                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                                                {selectedResource.author.charAt(0)}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-foreground">{selectedResource.author}</span>
                                                <span className="text-xs text-muted-foreground">Student Hub Editorial</span>
                                            </div>
                                        </div>
                                    </SheetHeader>

                                    <SheetDescription className="text-base text-muted-foreground hidden">
                                        {selectedResource.description}
                                    </SheetDescription>

                                    <div
                                        className="prose prose-lg dark:prose-invert max-w-none text-foreground prose-headings:font-extrabold prose-headings:tracking-tight prose-headings:text-foreground prose-p:text-muted-foreground prose-p:leading-relaxed prose-li:text-muted-foreground prose-strong:text-foreground prose-strong:font-bold"
                                        dangerouslySetInnerHTML={{ __html: selectedResource.content }}
                                    />
                                </div>
                            </>
                        )}
                    </SheetContent>
                </Sheet>

                {/* Quick Tips Section */}
                <div className="grid md:grid-cols-2 gap-6 mt-12 bg-primary/5 rounded-2xl p-8 border border-primary/10">
                    <div>
                        <h3 className="text-2xl font-bold mb-4">Why Preparation Matters?</h3>
                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <div className="h-10 w-10 rounded-lg bg-background flex items-center justify-center shrink-0 shadow-sm text-primary">
                                    <Users className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="font-semibold">Stand Out in Crowd</h4>
                                    <p className="text-sm text-muted-foreground">Detailed preparation helps you articulate unique points in Group Discussions.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="h-10 w-10 rounded-lg bg-background flex items-center justify-center shrink-0 shadow-sm text-primary">
                                    <Briefcase className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="font-semibold">Confidence Boost</h4>
                                    <p className="text-sm text-muted-foreground">Mock interviews significantly reduce anxiety and improve body language.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="relative h-full min-h-[200px] rounded-xl overflow-hidden">
                        <img
                            src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80"
                            alt="Team Success"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                            <p className="text-white font-medium italic">"Success is where preparation and opportunity meet."</p>
                        </div>
                    </div>
                </div>
            </div>
        </FeatureGuard>
    );
}