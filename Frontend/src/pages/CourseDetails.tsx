
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Clock,
    BookOpen,
    Star,
    Play,
    CheckCircle2,
    Award,
    Video,
    Globe,
    MonitorPlay,
    Download,
    Share2,
    Lock,
    Unlock,
    Users,
    AlertCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// Mock Data (duplicated from Courses.tsx for standalone functionality, ideally should be in a shared store)
const modules = [
    {
        id: 1,
        title: 'Introduction & Setup',
        duration: '45 min',
        videos: 3,
        lessons: [
            { title: 'Welcome to the Course', duration: '5:00', completed: true },
            { title: 'Setting up Environment', duration: '15:00', completed: true },
            { title: 'Hello World', duration: '25:00', completed: true },
        ]
    },
    {
        id: 2,
        title: 'Core Concepts',
        duration: '1.5 hours',
        videos: 5,
        lessons: [
            { title: 'Variables & Data Types', duration: '20:00', completed: true },
            { title: 'Control Structures', duration: '25:00', completed: false },
            { title: 'Functions', duration: '30:00', completed: false },
            { title: 'Arrays & Objects', duration: '15:00', completed: false },
        ]
    },
    {
        id: 3,
        title: 'Advanced Topics',
        duration: '2 hours',
        videos: 6,
        lessons: [
            { title: 'Async Programming', duration: '30:00', completed: false },
            { title: 'Error Handling', duration: '20:00', completed: false },
            { title: 'Modules', duration: '25:00', completed: false },
            { title: 'Testing', duration: '45:00', completed: false },
        ]
    },
];

const benefits = [
    "Build industry-ready projects",
    "Master technical interview concepts",
    "Get 1-on-1 mentorship support",
    "Earn a verified certificate"
];

const requirements = [
    "Basic understanding of programming logic",
    "A computer with internet access",
    "Code editor (VS Code recommended)"
];

const getCourseData = (id: string | undefined) => {
    // Mock database fetch
    const courseId = parseInt(id || '1');
    return {
        id: courseId,
        title: courseId === 1 ? 'React.js Complete Guide' :
            courseId === 2 ? 'Node.js & Express Masterclass' :
                courseId === 3 ? 'Machine Learning Fundamentals' : 'Advanced Web Development',
        category: courseId === 1 ? 'Frontend' : courseId === 2 ? 'Backend' : 'AI/ML',
        thumbnail: courseId === 1 ? 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop' :
            courseId === 2 ? 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=400&fit=crop' :
                'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&h=400&fit=crop',
        instructor: 'John Smith',
        role: 'Senior Software Engineer',
        rating: 4.8,
        students: 2340,
        difficulty: 'Intermediate',
        duration: '12 hours',
        lessons: 48,
        progress: 65, // Mock progress
        description: 'Master specialized skills with this comprehensive course designed for both beginners and intermediate learners. You will build real-world projects and gain deep insights into industry best practices.',
        isEnrolled: true
    };
};

export default function CourseDetails() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [course, setCourse] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Scroll detection for layout transition
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const scrollContainer = document.querySelector('main > div.overflow-auto');
        if (!scrollContainer) return;

        const handleScroll = () => {
            // Threshold: approx height of Hero section content (~400px)
            const threshold = 400;
            setIsScrolled(scrollContainer.scrollTop > threshold);
        };

        scrollContainer.addEventListener('scroll', handleScroll);
        return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            const data = getCourseData(courseId);
            setCourse(data);
            setIsLoading(false);
        }, 500);
    }, [courseId]);

    if (isLoading) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    if (!course) {
        return <div className="text-center p-10">Course not found</div>;
    }

    const isCompleted = course.progress === 100;

    const handleDownloadCertificate = () => {
        alert("Certificate downloaded!");
    };

    return (
        <div className="min-h-screen bg-background pb-10">
            {/* Main Layout Container */}
            <div className="container mx-auto px-4 py-8">
                {/* Layout Grid: Transitions from 3 columns (Hero) to 1 column (Full Width) on scroll */}
                <div className={`grid gap-8 transition-all duration-500 ease-in-out ${isScrolled ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-3'}`}>

                    {/* LEFT COLUMN - Scrollable Content */}
                    <div className={`space-y-10 transition-all duration-500 ${isScrolled ? 'col-span-1 max-w-4xl mx-auto w-full' : 'lg:col-span-2'}`}>

                        {/* 1. Header & Intro (Moved inside left column) */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="text-primary bg-primary/10">{course.category}</Badge>
                                <Badge variant="outline">{course.difficulty}</Badge>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">{course.title}</h1>
                            <p className="text-lg text-muted-foreground">{course.description}</p>

                            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                                    <span className="font-medium text-foreground">{course.rating}</span>
                                    <span>({course.students.toLocaleString()} ratings)</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Users className="h-4 w-4" />
                                    <span>{course.students.toLocaleString()} students</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    <span>{course.duration} total</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Globe className="h-4 w-4" />
                                    <span>English</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 pt-2">
                                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                    {course.instructor.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-medium text-foreground">{course.instructor}</p>
                                    <p className="text-xs text-muted-foreground">{course.role}</p>
                                </div>
                            </div>
                        </section>

                        <Separator />

                        {/* 2. About Course */}
                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold">About This Course</h2>
                            <div className="text-muted-foreground leading-relaxed">
                                <p>
                                    This course is designed to take you from a complete beginner to a job-ready developer.
                                    We cover starting from the absolute basics, assuming no prior knowledge, and slowly progress into advanced topics.
                                </p>
                                <ul className="list-disc pl-5 mt-4 space-y-1">
                                    <li>Understanding the core principles and architecture</li>
                                    <li>Building real-world applications with modern best practices</li>
                                    <li>Mastering state management and component lifecycles</li>
                                    <li>Optimizing performance and deployment</li>
                                </ul>
                            </div>
                        </section>

                        {/* 3. Benefits */}
                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold">What You'll Learn</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {benefits.map((benefit, idx) => (
                                    <div key={idx} className="flex items-start gap-3 p-4 rounded-lg border bg-card/50">
                                        <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
                                        <span className="text-sm font-medium">{benefit}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* 4. Course Content / Modules */}
                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold">Course Content</h2>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                                <span>{modules.length} modules</span>
                                <span>•</span>
                                <span>{modules.reduce((acc, m) => acc + m.lessons.length, 0)} lectures</span>
                                <span>•</span>
                                <span>{course.duration} total length</span>
                            </div>

                            <Accordion type="single" collapsible className="w-full border rounded-lg bg-card">
                                {modules.map((module) => (
                                    <AccordionItem value={`item-${module.id}`} key={module.id} className="px-2">
                                        <AccordionTrigger className="hover:no-underline px-4 py-3 bg-muted/20 hover:bg-muted/30 rounded-md my-1">
                                            <div className="flex items-center justify-between w-full pr-4">
                                                <div className="flex items-center gap-3">
                                                    <span className="font-semibold text-foreground">{module.title}</span>
                                                </div>
                                                <span className="text-sm text-muted-foreground font-normal">{module.lessons.length} lectures • {module.duration}</span>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="pt-2 pb-4">
                                            <div className="space-y-1">
                                                {module.lessons.map((lesson, idx) => (
                                                    <div key={idx} className="flex items-center justify-between py-2 px-4 hover:bg-muted/50 rounded-md transition-colors group cursor-pointer">
                                                        <div className="flex items-center gap-3">
                                                            {lesson.completed ? (
                                                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                                            ) : (
                                                                <Video className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                                                            )}
                                                            <span className={`text-sm ${lesson.completed ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                                                                {lesson.title}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-4">
                                                            <span className="text-xs text-muted-foreground">{lesson.duration}</span>
                                                            {lesson.completed || idx === 0 ? (
                                                                <Unlock className="h-3 w-3 text-emerald-500" />
                                                            ) : (
                                                                <Lock className="h-3 w-3 text-muted-foreground" />
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </section>

                        {/* 5. Requirements */}
                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold">Requirements</h2>
                            <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                                {requirements.map((req, i) => (
                                    <li key={i}>{req}</li>
                                ))}
                            </ul>
                        </section>
                    </div>

                    {/* RIGHT COLUMN - Sticky Card */}
                    <div className={`transition-all duration-500 ease-in-out ${isScrolled ? 'opacity-0 translate-x-10 pointer-events-none hidden lg:block w-0 p-0 overflow-hidden' : 'lg:col-span-1 opacity-100 translate-x-0'}`}>
                        {/* Wrapper div for sticky positioning - MUST have h-fit to stick properly */}
                        <div className="sticky top-6 h-fit z-10">
                            <Card className="border-border/50 shadow-lg bg-background/95 backdrop-blur">
                                <div className="aspect-video w-full overflow-hidden rounded-t-lg relative group">
                                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button size="icon" variant="ghost" className="rounded-full h-12 w-12 bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm">
                                            <Play className="h-6 w-6 ml-1" />
                                        </Button>
                                    </div>
                                </div>
                                <CardHeader className="pb-4">
                                    <div className="flex items-end gap-2">
                                        <span className="text-3xl font-bold">Free</span>
                                        <span className="text-muted-foreground line-through text-sm mb-1.5">$19.99</span>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {course.isEnrolled ? (
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="font-medium">Course Progress</span>
                                                    <span>{course.progress}%</span>
                                                </div>
                                                <Progress value={course.progress} className="h-2" />
                                            </div>
                                            {isCompleted ? (
                                                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 gap-2" onClick={handleDownloadCertificate}>
                                                    <Download className="h-4 w-4" />
                                                    Download Certificate
                                                </Button>
                                            ) : (
                                                <Button className="w-full gap-2 font-semibold">
                                                    <Play className="h-4 w-4" />
                                                    Continue Learning
                                                </Button>
                                            )}
                                        </div>
                                    ) : (
                                        <Button className="w-full size-lg text-lg font-semibold shadow-md">Enroll Now</Button>
                                    )}
                                    <p className="text-xs text-center text-muted-foreground">30-Day Money-Back Guarantee</p>

                                    <div className="space-y-3 pt-4 border-t">
                                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                            <MonitorPlay className="h-4 w-4 text-primary" />
                                            <span>{course.lessons} comprehensive lessons</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                            <Download className="h-4 w-4 text-primary" />
                                            <span>Downloadable resources</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                            <Award className="h-4 w-4 text-primary" />
                                            <span>Certificate of completion</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                            <Globe className="h-4 w-4 text-primary" />
                                            <span>Access on mobile and TV</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


