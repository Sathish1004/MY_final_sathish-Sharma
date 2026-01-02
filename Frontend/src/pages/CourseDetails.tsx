
import { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Clock,
    Star,
    Play,
    CheckCircle2,
    Award,
    Globe,
    MonitorPlay,
    Users,
    ChevronRight,
    Lock,
    PlayCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';
import { useCourse } from '@/contexts/CourseContext';
import CertificateModal from '@/components/CertificateModal';
import { COURSES_DATA } from '@/data/courses';

// Debounce helper
const debounce = (func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};

export default function CourseDetails() {
    const { user } = useAuth();
    const { updateProgress } = useCourse();
    const { courseId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { toast } = useToast();

    // State
    const [course, setCourse] = useState<any>(null);
    const [modules, setModules] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    // Progress Map: { moduleId: { watched_seconds, is_completed } }
    const [moduleProgress, setModuleProgress] = useState<Record<number, any>>({});

    // Course Level Progress
    const [courseProgressPercent, setCourseProgressPercent] = useState(0);
    const [isCourseCompleted, setIsCourseCompleted] = useState(false);

    const [showCertificate, setShowCertificate] = useState(false);
    const [showEnrollmentSuccess, setShowEnrollmentSuccess] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);
    const progressUpdateQueue = useRef<Record<number, number>>({});

    // Fetch Data
    useEffect(() => {
        const loadData = async () => {
            if (!courseId) return;
            setIsLoading(true);
            try {
                // 1. Course Details
                const courseRes = await api.get(`/courses/${courseId}`);
                let courseData = courseRes.data;

                // 2. Modules & Mock Enrichment
                const modulesRes = await api.get(`/modules/course/${courseId}`);
                let modulesData = modulesRes.data;

                // --- MOCK DATA ENRICHMENT ---
                // Find matching mock course by title or id
                // We use title matching because mock IDs might differ or be used as seed
                const mockCourse = COURSES_DATA.find(c => c.title === courseData.title) || COURSES_DATA.find(c => c.id === parseInt(courseId!));

                if (mockCourse) {
                    // Enrich Course Metadata (Description, Learn, Requirements)
                    courseData = {
                        ...courseData,
                        description: courseData.description || mockCourse.description,
                        learn: (courseData.learn && courseData.learn.length > 0) ? courseData.learn : mockCourse.learn,
                        requirements: (courseData.requirements && courseData.requirements.length > 0) ? courseData.requirements : mockCourse.requirements,
                        level: courseData.level || mockCourse.difficulty,
                        // If Duration is 0, use mock duration
                        duration: (courseData.total_duration && courseData.total_duration > 0) ? `${Math.floor(courseData.total_duration / 60)} mins` : mockCourse.duration
                    };

                    // Enrich Modules if empty
                    if (modulesData.length === 0 && mockCourse.totalVideos > 0) {
                        // Generate mock modules
                        modulesData = Array.from({ length: mockCourse.totalVideos }).map((_, i) => ({
                            id: 99000 + i, // Fake IDs
                            course_id: courseData.id,
                            title: `Module ${String(i + 1).padStart(2, '0')}: ${mockCourse.learn?.[i % mockCourse.learn.length] || 'Topic Overview'}`,
                            video_key: 'mock-video', // Needs handling in player
                            duration_seconds: 900, // 15 mins default
                            order_index: i
                        }));

                        // HYDRATION: Restore "Checked" status for mock modules based on saved Course Progress
                        if (courseData.progress && courseData.progress > 0) {
                            const completedCount = Math.round((courseData.progress / 100) * modulesData.length);
                            modulesData.forEach((mod: any, index: number) => {
                                if (index < completedCount) {
                                    // We need to update the moduleProgress map later in the flow
                                    // But setModuleProgress is state setter, we can't call it here synchronously comfortably
                                    // We can defer it to the useEffect or store it in a temp var
                                    // Actually we can just run a quick loop after setModules
                                }
                            });
                        }
                    }
                }

                setCourse(courseData);
                setModules(modulesData);

                // HYDRATION: Restore "Checked" status for mock modules based on saved Course Progress
                // This ensures refresh doesn't wipe the green ticks for demo courses
                if (modulesData.length > 0 && modulesData[0].video_key === 'mock-video' && courseData.progress > 0) {
                    const completedCount = Math.round((courseData.progress / 100) * modulesData.length);
                    const initialProgress: Record<number, any> = {};
                    modulesData.forEach((mod: any, index: number) => {
                        initialProgress[mod.id] = {
                            is_completed: index < completedCount,
                            watched_seconds: index < completedCount ? mod.duration_seconds : 0
                        };
                    });
                    // Set local state
                    setModuleProgress(prev => ({ ...prev, ...initialProgress }));
                }

                // 3. User Progress (Enrollment & Module Status)
                // We'll fetch 'my-courses' to get overall status, but for module-level ticks we need granular data.
                // We'll iterate modules or assume we start with 0 if stored.
                // Optimally: Fetch /api/courses/:id/progress (User specific)
                // Since we don't have a bulk module progress endpoint, we'll fetch individual progress lazily or use user_progress for overall.
                // Wait, we need to show ticks on the playlist.
                // Use `getModuleProgress` for each module? That's too many requests.
                // Better: Update `moduleRoutes` to get all progress for a course. 
                // For now, I'll fetch progress for the *current* module and trusted "completed_modules" count from course enrollments? No.
                // I'll fetch `my-courses` to get the list of enrolled courses and their status.

                const enrollmentRes = await api.get('/courses/my-courses');
                const myCourse = enrollmentRes.data.find((c: any) => c.course_id === parseInt(courseId));

                if (myCourse) {
                    setCourseProgressPercent(myCourse.progress);
                    setIsCourseCompleted(myCourse.status === 'Completed');
                }

                // If enrolled, we should probably fetch progress for all modules to show ticks.
                // I'll add a quick helper in the component to fetch status for all modules in parallel (limit generic concurrency)
                // Or just fetch for the visible ones.
                // Ideally backend sends `is_completed` with modules list if user is logged in. But `getCourseModules` is public.
                // I'll do a quick parallel fetch.
                if (modulesRes.data.length > 0) {
                    const progressData: Record<number, any> = {};
                    await Promise.all(modulesRes.data.map(async (m: any) => {
                        try {
                            const pRes = await api.get(`/modules/${m.id}/progress`);
                            progressData[m.id] = pRes.data;
                        } catch (e) {
                            progressData[m.id] = { watched_seconds: 0, is_completed: false };
                        }
                    }));
                    setModuleProgress(progressData);

                    // Find last watched or first incomplete
                    // Check location state or find first non-completed
                    if (location.state?.moduleIndex !== undefined) {
                        setCurrentModuleIndex(location.state.moduleIndex);
                    } else {
                        const firstIncomplete = modulesRes.data.findIndex((m: any) => !progressData[m.id]?.is_completed);
                        setCurrentModuleIndex(firstIncomplete >= 0 ? firstIncomplete : 0);
                    }
                }

            } catch (error) {
                console.error("Failed to load course", error);
                toast({ title: "Error", description: "Could not load course details", variant: "destructive" });
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [courseId, location.state]);



    // Update Progress Handler
    const updateBackendProgress = useCallback(async (moduleId: number, seconds: number) => {
        const currentMod = modules.find(m => m.id === moduleId);
        const isMock = currentMod?.video_key === 'mock-video';

        // Optimistic / Mock Handling
        if (isMock) {
            // Check completion (90% threshold)
            // Fix: Use actual video duration if available, else fallback to metadata
            // This prevents issues where mock video is shorter than metadata duration
            let duration = currentMod?.duration_seconds || 900;
            if (videoRef.current && videoRef.current.duration > 0) {
                duration = videoRef.current.duration;
            }

            const isCompleted = seconds >= (duration * 0.9);

            if (isCompleted) {
                setModuleProgress(prev => ({
                    ...prev,
                    [moduleId]: { ...prev[moduleId], is_completed: true, watched_seconds: seconds }
                }));
                // Update Global Context (Dashboard)
                updateProgress(parseInt(courseId!), currentModuleIndex, moduleId, seconds / 60);
            }
            return;
        }

        // Real Backend Handling
        try {
            const res = await api.post(`/modules/${moduleId}/progress`, {
                watchedSeconds: seconds,
                courseId: parseInt(courseId!)
            });

            // Check if completed
            if (res.data.isCompleted) {
                setModuleProgress(prev => ({
                    ...prev,
                    [moduleId]: { ...prev[moduleId], is_completed: true, watched_seconds: seconds }
                }));
                // Update Global Context (Dashboard)
                updateProgress(parseInt(courseId!), currentModuleIndex, moduleId, seconds / 60);
            }
        } catch (e) {
            console.error("Progress sync failed", e);
        }
    }, [courseId, modules, currentModuleIndex, updateProgress]);

    // Fix: Use Ref to avoid stale closure in debounce
    const latestUpdateRef = useRef(updateBackendProgress);
    useEffect(() => {
        latestUpdateRef.current = updateBackendProgress;
    }, [updateBackendProgress]);

    const debouncedUpdate = useRef(debounce((moduleId: number, time: number) => {
        latestUpdateRef.current(moduleId, time);
    }, 5000)).current;

    const handleTimeUpdate = () => {
        if (videoRef.current && modules[currentModuleIndex]) {
            const time = videoRef.current.currentTime;
            const moduleId = modules[currentModuleIndex].id;
            // Immediate local update? No, just sync.
            debouncedUpdate(moduleId, time);
        }
    };

    const handleVideoEnded = () => {
        if (modules[currentModuleIndex]) {
            const moduleId = modules[currentModuleIndex].id;
            const duration = videoRef.current?.duration || modules[currentModuleIndex].duration_seconds;
            // Force strict update
            updateBackendProgress(moduleId, duration);

            // Auto Advance
            if (currentModuleIndex < modules.length - 1) {
                setTimeout(() => {
                    setCurrentModuleIndex(currentModuleIndex + 1);
                    setIsPlaying(true);
                }, 1000);
            }
        }
    };

    const handleModuleSelect = (index: number) => {
        setCurrentModuleIndex(index);
        setIsPlaying(true);
    };

    const handleStartLearning = () => {
        setShowEnrollmentSuccess(false);
        if (videoRef.current) videoRef.current.play();
        setIsPlaying(true);
    };

    if (isLoading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
    if (!course) return <div className="flex h-screen items-center justify-center">Course Not Found</div>;

    const currentModule = modules[currentModuleIndex];
    // Calculate total progress checks
    const completedCount = Object.values(moduleProgress).filter((p: any) => p.is_completed).length;
    const progressPercent = modules.length > 0 ? Math.round((completedCount / modules.length) * 100) : 0;
    const isCompleted = progressPercent === 100;

    return (
        <div className="min-h-screen bg-background pb-20 pt-8 animate-fade-in">
            <div className="container mx-auto px-4 lg:px-6">

                {/* Header */}
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
                                    <span>{course.students || 0} Learners</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Clock className="h-4 w-4" />
                                    <span>{Math.round(modules.reduce((acc, m) => acc + m.duration_seconds, 0) / 60)} mins</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Globe className="h-4 w-4" />
                                    <span>{course.level}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                                    <span className="font-medium text-foreground">{parseFloat(course.rating).toFixed(1)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-8">
                        <Card className="overflow-hidden border-border shadow-lg">
                            <div className="aspect-video bg-black relative group">
                                {showEnrollmentSuccess ? (
                                    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm p-6 text-center animate-in fade-in duration-500">
                                        <div className="mb-6 rounded-full bg-emerald-500/20 p-4">
                                            <CheckCircle2 className="h-12 w-12 text-emerald-500" />
                                        </div>
                                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Congratulations!</h2>
                                        <p className="text-gray-300 mb-8 text-lg">You have enrolled successfully.</p>
                                        <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full" onClick={handleStartLearning}>
                                            <PlayCircle className="mr-2 h-6 w-6" /> Start Learning
                                        </Button>
                                    </div>
                                ) : null}

                                {currentModule ? (
                                    <video
                                        key={currentModule.id}
                                        ref={videoRef}
                                        // Handle Mock Vs Real Video
                                        src={currentModule.video_key === 'mock-video'
                                            ? 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
                                            : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/modules/${currentModule.id}/video`
                                        }
                                        poster={course.thumbnail}
                                        className="w-full h-full object-contain"
                                        controls={!showEnrollmentSuccess}
                                        controlsList="nodownload"
                                        onContextMenu={(e) => e.preventDefault()}
                                        onPlay={() => setIsPlaying(true)}
                                        onPause={() => setIsPlaying(false)}
                                        onTimeUpdate={handleTimeUpdate}
                                        onEnded={handleVideoEnded}
                                        autoPlay={isPlaying}
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-white">Select a module to start</div>
                                )}
                            </div>
                            <CardContent className="p-6 space-y-6">
                                <div>
                                    <h3 className="font-bold text-2xl leading-tight mb-2">
                                        {currentModule ? `${(currentModuleIndex + 1).toString().padStart(2, '0')}. ${currentModule.title}` : 'No Module Selected'}
                                    </h3>
                                    <p className="text-muted-foreground">Module {currentModuleIndex + 1} of {modules.length}</p>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-sm font-medium">
                                        <span className="text-foreground/90 font-semibold">
                                            {completedCount} / {modules.length} Modules Completed
                                        </span>
                                        <span className="text-muted-foreground">{progressPercent}%</span>
                                    </div>
                                    <Progress value={progressPercent} className="h-2.5 w-full bg-secondary/30" indicatorClassName={isCompleted ? 'bg-emerald-500' : 'bg-primary'} />
                                </div>
                            </CardContent>
                        </Card>

                        {/* CERTIFICATE */}
                        {isCompleted && (
                            <Card className="border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/10 animate-in fade-in slide-in-from-bottom-4">
                                <CardContent className="p-6 text-center space-y-4">
                                    <div className="h-12 w-12 mx-auto bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-2">
                                        <Award className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <Button onClick={() => setShowCertificate(true)} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-md">
                                        View Certificate
                                    </Button>
                                </CardContent>
                            </Card>
                        )}

                        {/* What you'll learn */}
                        {course.learn && course.learn.length > 0 && (
                            <Card className="border-border shadow-sm">
                                <CardContent className="p-6">
                                    <h3 className="text-xl font-bold mb-4">What you'll learn</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {course.learn.map((item: string, i: number) => (
                                            <div key={i} className="flex items-start gap-2">
                                                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                                                <span className="text-sm">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Requirements */}
                        {course.requirements && course.requirements.length > 0 && (
                            <div className="space-y-3">
                                <h3 className="text-xl font-bold">Requirements</h3>
                                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
                                    {course.requirements.map((req: string, i: number) => (
                                        <li key={i}>{req}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Description */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold">About this Course</h3>
                            <p className="text-muted-foreground leading-relaxed">{course.description}</p>
                        </div>
                    </div>

                    {/* Right Column: Playlist */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <Card className="border-border shadow-md flex flex-col h-[650px] bg-card/80 backdrop-blur-sm">
                                <CardHeader className="py-4 px-5 border-b bg-muted/40">
                                    <CardTitle className=" text-base font-bold flex items-center gap-2">
                                        <MonitorPlay className="h-5 w-5 text-primary" /> Course Playlist
                                    </CardTitle>
                                    <CardDescription>
                                        {completedCount} / {modules.length} Modules Completed
                                    </CardDescription>
                                </CardHeader>
                                <ScrollArea className="flex-1 p-3">
                                    <div className="space-y-3">
                                        {modules.map((module: any, index: number) => {
                                            const isModCompleted = moduleProgress[module.id]?.is_completed;
                                            const isCurrent = currentModuleIndex === index;
                                            // Lock logic
                                            const isLocked = !isModCompleted && !isCurrent && index > 0 && !moduleProgress[modules[index - 1].id]?.is_completed;

                                            return (
                                                <div
                                                    key={module.id}
                                                    onClick={() => !isLocked && handleModuleSelect(index)}
                                                    className={`flex items-start gap-4 p-4 rounded-xl border transition-all duration-200
                                                        ${isCurrent
                                                            ? 'bg-primary/5 border-primary/20 shadow-sm ring-1 ring-primary/10'
                                                            : isModCompleted
                                                                ? 'bg-emerald-50/50 dark:bg-emerald-950/10 border-emerald-500/10 cursor-pointer'
                                                                : isLocked
                                                                    ? 'opacity-50 cursor-not-allowed bg-muted/30 border-transparent'
                                                                    : 'hover:bg-accent/50 border-transparent cursor-pointer'
                                                        }`}
                                                >
                                                    <div className={`mt-0.5 h-6 w-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors
                                                        ${isModCompleted
                                                            ? 'bg-emerald-500 border-emerald-500 text-white'
                                                            : isCurrent
                                                                ? 'border-primary text-primary'
                                                                : 'border-muted-foreground/30'
                                                        }`}>
                                                        {isModCompleted ? (
                                                            <CheckCircle2 className="h-3.5 w-3.5 stroke-[3]" />
                                                        ) : isCurrent ? (
                                                            <Play className="h-2.5 w-2.5 fill-current" />
                                                        ) : (
                                                            <span className="text-[10px] font-medium text-muted-foreground">{index + 1}</span>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 space-y-1">
                                                        <div className="flex justify-between items-start gap-2">
                                                            <p className={`text-sm font-semibold line-clamp-2 ${isModCompleted ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                                                                {module.title}
                                                            </p>
                                                            {isLocked && <Lock className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />}
                                                        </div>
                                                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                            <span className="flex items-center gap-1">
                                                                <Clock className="h-3 w-3" /> {Math.floor(module.duration_seconds / 60)}:{(module.duration_seconds % 60).toString().padStart(2, '0')}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </ScrollArea>
                            </Card>
                            <CertificateModal
                                isOpen={showCertificate}
                                onClose={() => setShowCertificate(false)}
                                studentName={user?.name || "Student"}
                                courseTitle={course.title}
                                instructor={course.instructor}
                                date={new Date().toLocaleDateString()}
                                certId={`CERT-${course.id}`}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}