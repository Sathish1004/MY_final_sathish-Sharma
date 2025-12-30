import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Clock,
    Star,
    Play,
    CheckCircle2,
    Award,
    Globe,
    MonitorPlay,
    Download,
    Users,
    ChevronRight,
    RotateCcw,
    Lock,
    PlayCircle,
    PauseCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import CertificateModal from '@/components/CertificateModal';

// Mock Data Generator
const generateModules = (courseTitle: string, category: string) => {
    const standardTitles = [
        'Introduction',
        'Core Concepts',
        'Practical Example',
        'Intermediate Concepts',
        'Hands-on Demo',
        'Problem Solving',
        'Advanced Topic',
        'Real-world Use Case',
        'Summary',
        'Final Recap'
    ];

    const VIDEO_POOL = [
        'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
        'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
        'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
        'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'
    ];

    return standardTitles.map((title, i) => ({
        id: i + 1,
        title: `${category} Module: ${title}`,
        duration: '10 min',
        videoUrl: VIDEO_POOL[i % VIDEO_POOL.length]
    }));
};

const getCourseData = (id: string | undefined) => {
    const courseId = parseInt(id || '1');

    // Base common data
    const common = {
        role: 'Senior Instructor',
        rating: 5.0,
        students: 1,
        description: 'Master specialized skills with this comprehensive course designed for both beginners and intermediate learners. You will build real-world projects and gain deep insights into industry best practices.'
    };

    const specificData: Record<number, any> = {
        1: { title: 'React.js Complete Guide', category: 'Frontend', instructor: 'John Smith', difficulty: 'Intermediate' },
        2: { title: 'Node.js & Express Masterclass', category: 'Backend', instructor: 'Sarah Johnson', difficulty: 'Intermediate' },
        3: { title: 'Machine Learning Fundamentals', category: 'AI/ML', instructor: 'Dr. Alex Chen', difficulty: 'Advanced' },
        4: { title: 'Full Stack Web Development', category: 'Frontend', instructor: 'Michael Brown', difficulty: 'Beginner' },
        5: { title: 'Aptitude & Logical Reasoning', category: 'Aptitude', instructor: 'Emily Davis', difficulty: 'Beginner' },
        6: { title: 'Data Structures Basics', category: 'Core Subjects', instructor: 'Prof. David Lee', difficulty: 'Intermediate' }
    };

    const courseInfo = specificData[courseId] || specificData[1];
    const modules = generateModules(courseInfo.title, courseInfo.category);

    // Dynamic duration calculation
    let totalDuration = '100 min'; // 10 mins * 10 modules

    return {
        id: courseId,
        ...common,
        ...courseInfo,
        thumbnail: '/ai_tutor_avatar.png',
        duration: totalDuration,
        modules,
        learn: [
            'Build powerful, fast, user-friendly applications',
            'Provide amazing user experiences by leveraging the power of modern stacks',
            'Apply for high-paid jobs or work as a freelancer in one the most demanded sectors',
            'Master key concepts and best practices'
        ],
        requirements: [
            'Basic understanding of programming fundamentals',
            'A computer with internet access',
            'Passion for learning and growth'
        ]
    };
};

export default function CourseDetails() {
    const { user } = useAuth();
    const { courseId } = useParams();
    const navigate = useNavigate();

    const location = useLocation();

    // Data State
    const [course, setCourse] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Progress State
    const [completedVideos, setCompletedVideos] = useState<number[]>([]);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showCertificate, setShowCertificate] = useState(false);

    // Derived State
    const totalVideos = course?.modules?.length || 10;
    const progress = Math.round((completedVideos.length / totalVideos) * 100);
    const isCourseCompleted = completedVideos.length === totalVideos;

    // Certificate Details
    const certId = `CERT-${courseId}-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`;
    const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        setIsLoading(true);
        const data = getCourseData(courseId);
        setCourse(data);

        // Load progress
        const savedData = localStorage.getItem(`course_progress_${courseId}_v2`); // v2 for new schema
        let initialIndex = 0;
        let completedIds: number[] = [];

        if (savedData) {
            const { completed, lastIndex } = JSON.parse(savedData);
            completedIds = completed || [];
            // Validate index
            const idx = lastIndex || 0;
            initialIndex = idx < 10 ? idx : 0;
        }

        // Deep link override (if coming from dashboard module click)
        if (location.state?.moduleIndex !== undefined) {
            initialIndex = location.state.moduleIndex;
            // Update storage immediately to reflect this jump
            const progressData = {
                completed: completedIds,
                lastIndex: initialIndex,
                status: completedIds.length === 10 ? 'Completed' : 'In Progress',
                progress: Math.round((completedIds.length / 10) * 100),
                minutesConsumed: completedIds.length * 10,
                lastUpdated: new Date().toISOString()
            };
            localStorage.setItem(`course_progress_${courseId}_v2`, JSON.stringify(progressData));
        }

        setCompletedVideos(completedIds);
        setCurrentVideoIndex(initialIndex);

        setIsLoading(false);
    }, [courseId, location.state]);

    // Helper to log user activity
    const logActivity = (type: 'VIDEO_WATCHED' | 'COURSE_COMPLETED', detail: string) => {
        const activity = {
            type,
            detail,
            courseName: course.title,
            timestamp: new Date().toISOString()
        };
        const logs = JSON.parse(localStorage.getItem('user_activity_log') || '[]');
        logs.unshift(activity); // Add to beginning
        localStorage.setItem('user_activity_log', JSON.stringify(logs.slice(0, 50))); // Keep last 50
    };

    const saveProgress = (completed: number[], lastIndex: number) => {
        const uniqueCompleted = Array.from(new Set(completed));
        const progressPercentage = Math.round((uniqueCompleted.length / course.modules.length) * 100);
        const isCompletedNow = uniqueCompleted.length === course.modules.length;

        // Calculate minutes based on module duration logic (now all 10 mins)
        let minutesConsumed = uniqueCompleted.length * 10;

        const progressData = {
            completed: uniqueCompleted,
            lastIndex,
            status: isCompletedNow ? 'Completed' : 'In Progress',
            progress: progressPercentage,
            minutesConsumed,
            lastUpdated: new Date().toISOString()
        };

        localStorage.setItem(`course_progress_${course.id}_v2`, JSON.stringify(progressData));
        setCompletedVideos(uniqueCompleted);

        // Check if just completed (compare new status with previous derived state)
        const wasCompleted = completedVideos.length === course.modules.length;
        if (isCompletedNow && !wasCompleted) {
            logActivity('COURSE_COMPLETED', `Completed course: ${course.title}`);
        }
    };

    const handlePlay = () => {
        if (videoRef.current) {
            videoRef.current.play();
            setIsPlaying(true);
        }
    };

    const handleVideoEnded = () => {
        const currentModule = course.modules[currentVideoIndex];
        const total = course.modules.length;

        if (!completedVideos.includes(currentModule.id)) {
            const newCompleted = [...completedVideos, currentModule.id];

            // Log video completion
            logActivity('VIDEO_WATCHED', `Watched: ${currentModule.title}`);

            // Allow saveProgress to handle course completion check
            saveProgress(newCompleted, currentVideoIndex); // Temporarily save at current index
        }

        // Auto-advance if not last video
        if (currentVideoIndex < total - 1) {
            const nextIndex = currentVideoIndex + 1;
            setCurrentVideoIndex(nextIndex);

            // Update storage with new index
            const savedData = localStorage.getItem(`course_progress_${course.id}_v2`);
            if (savedData) {
                const parsed = JSON.parse(savedData);
                localStorage.setItem(`course_progress_${course.id}_v2`, JSON.stringify({
                    ...parsed,
                    lastIndex: nextIndex
                }));
            }
        }
    };

    const handleModuleSelect = (index: number) => {
        setCurrentVideoIndex(index);
        setIsPlaying(true);

        // Update lastIndex in storage so returning resumes here
        const savedData = localStorage.getItem(`course_progress_${course.id}_v2`);
        if (savedData) {
            const parsed = JSON.parse(savedData);
            localStorage.setItem(`course_progress_${course.id}_v2`, JSON.stringify({
                ...parsed,
                lastIndex: index,
                lastUpdated: new Date().toISOString()
            }));
        }

        setTimeout(() => {
            if (videoRef.current) videoRef.current.play();
        }, 100);
    };

    if (isLoading || !course) {
        return <div className="flex h-screen items-center justify-center">Loading...</div>;
    }

    const currentModule = course.modules[currentVideoIndex];

    return (
        <div className="min-h-screen bg-background pb-20 pt-8 animate-fade-in">
            <div className="container mx-auto px-4 lg:px-6">

                {/* Header Section */}
                <div className="mb-8 space-y-4">
                    <Button variant="ghost" className="pl-0 hover:bg-transparent" onClick={() => navigate('/courses')}>
                        <ChevronRight className="h-4 w-4 rotate-180 mr-2" /> Back to Courses
                    </Button>
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                        <div className="space-y-4">
                            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                                {course.category}
                            </Badge>
                            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                                {course.title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1.5">
                                    <Users className="h-4 w-4" />
                                    <span>{course.students} Enrolled</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Clock className="h-4 w-4" />
                                    <span>{course.duration}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Globe className="h-4 w-4" />
                                    <span>{course.difficulty}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                                    <span className="font-medium text-foreground">{course.rating}</span>
                                    <span>(New)</span>
                                </div>
                            </div>
                        </div>
                        {course.duration && (
                            <div className="hidden md:block text-right">
                                <div className="text-2xl font-bold">{course.duration}</div>
                                <div className="text-sm text-muted-foreground">Total content</div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* LEFT COLUMN: Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Video Player */}
                        <Card className="overflow-hidden border-border shadow-lg">
                            <div className="aspect-video bg-black relative group">
                                <video
                                    key={currentModule.videoUrl} // Force reload on url change
                                    ref={videoRef}
                                    src={currentModule.videoUrl}
                                    poster={course.thumbnail}
                                    className="w-full h-full object-contain"
                                    controls
                                    controlsList="nodownload"
                                    onContextMenu={(e) => e.preventDefault()}
                                    onPlay={() => setIsPlaying(true)}
                                    onPause={() => setIsPlaying(false)}
                                    onEnded={handleVideoEnded}
                                />
                            </div>

                            <CardContent className="p-4 space-y-4">
                                <div>
                                    <h3 className="font-medium text-lg line-clamp-1" title={currentModule.title}>
                                        {(currentVideoIndex + 1).toString().padStart(2, '0')}. {currentModule.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">Module {currentVideoIndex + 1} of 10</p>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm font-medium">
                                        <span className={isCourseCompleted ? 'text-emerald-500' : 'text-muted-foreground'}>
                                            {isCourseCompleted ? 'Course Completed' : `${progress}% Completed`}
                                        </span>
                                        <span>{progress}%</span>
                                    </div>
                                    <Progress value={progress} className={`h-2 ${isCourseCompleted ? '[&>div]:bg-emerald-500' : ''}`} />
                                </div>
                            </CardContent>
                        </Card>

                        {/* CERTIFICATE CARD - Only when 100% */}
                        {isCourseCompleted && (
                            <Card className="border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/10 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
                                <CardContent className="p-6 text-center space-y-4">
                                    <div className="h-12 w-12 mx-auto bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-2">
                                        <Award className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <Button
                                        onClick={() => setShowCertificate(true)}
                                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-md group"
                                    >
                                        View Certificate
                                        <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                                    </Button>
                                </CardContent>
                            </Card>
                        )}

                        {/* What you'll learn */}
                        <Card className="border-border/50 bg-card/50">
                            <CardHeader><CardTitle>What you'll learn</CardTitle></CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {course.learn.map((item: string, i: number) => (
                                        <div key={i} className="flex gap-3 items-start">
                                            <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
                                            <span className="text-sm">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Requirements */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold">Requirements</h3>
                            <ul className="space-y-2">
                                {course.requirements.map((req: string, i: number) => (
                                    <li key={i} className="flex items-center gap-3 text-muted-foreground">
                                        <div className="h-1.5 w-1.5 rounded-full bg-primary/60" />
                                        {req}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Playlist - ENHANCED */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <Card className="border-border shadow-md flex flex-col h-[650px] bg-card/80 backdrop-blur-sm">
                                <CardHeader className="py-4 px-5 border-b bg-muted/40">
                                    <CardTitle className=" text-base font-bold flex items-center gap-2">
                                        <MonitorPlay className="h-5 w-5 text-primary" /> Course Playlist
                                    </CardTitle>
                                    <CardDescription>
                                        {completedVideos.length} / 10 Modules Completed
                                    </CardDescription>
                                </CardHeader>
                                <ScrollArea className="flex-1 p-3">
                                    <div className="space-y-3">
                                        {course.modules.map((module: any, index: number) => {
                                            const isCompleted = completedVideos.includes(module.id);
                                            const isCurrent = index === currentVideoIndex;
                                            // Icon selection
                                            const StatusIcon = isCompleted ? CheckCircle2 : (isCurrent ? PlayCircle : PlayCircle);
                                            // 0-indexed to 01, 02...
                                            const serialNo = (index + 1).toString().padStart(2, '0');

                                            return (
                                                <button
                                                    key={module.id}
                                                    onClick={() => handleModuleSelect(index)}
                                                    className={`w-full flex items-start gap-4 p-4 text-left transition-all rounded-xl border group
                                                        ${isCurrent
                                                            ? 'bg-primary/5 border-primary shadow-sm ring-1 ring-primary/20'
                                                            : 'bg-card border-border hover:border-primary/50 hover:shadow-sm'
                                                        }`}
                                                >
                                                    <div className="shrink-0 pt-0.5">
                                                        {isCompleted ? (
                                                            <div className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                                                <CheckCircle2 className="h-4 w-4" />
                                                            </div>
                                                        ) : (
                                                            <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center text-[10px] font-bold
                                                                ${isCurrent ? 'border-primary text-primary' : 'border-muted-foreground/30 text-muted-foreground'}`}>
                                                                {isCurrent ? <Play className="h-2.5 w-2.5 fill-current" /> : <div className="h-2.5 w-2.5 rounded-full bg-transparent" /> /* Circle outline */}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="min-w-0 flex-1 space-y-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <Badge variant="outline" className={`h-5 px-1.5 text-[10px] ${isCurrent ? 'border-primary/30 text-primary' : 'text-muted-foreground'}`}>
                                                                Module {serialNo}
                                                            </Badge>
                                                        </div>
                                                        <p className={`text-sm font-semibold leading-tight line-clamp-2 ${isCurrent ? 'text-primary' : 'text-foreground group-hover:text-primary/80'}`}>
                                                            {module.title.split(': ')[1] || module.title}
                                                        </p>
                                                        <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
                                                            <Clock className="h-3 w-3" />
                                                            <span>{module.duration}</span>
                                                        </div>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </ScrollArea>
                            </Card>

                            <CertificateModal
                                isOpen={showCertificate}
                                onClose={() => setShowCertificate(false)}
                                studentName={user?.name || "Student Name"}
                                courseTitle={course.title}
                                instructor={course.instructor}
                                date={currentDate}
                                certId={certId}
                            />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
