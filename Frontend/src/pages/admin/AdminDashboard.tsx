import { useState, useEffect } from "react";
import {
    Users,
    BookOpen,
    CheckCircle,
    Clock,
    Code,
    Trophy,
    UserCheck,
    Calendar,
    Search,
    Filter,
    MoreVertical,
    LogOut,
    LayoutDashboard,
    Briefcase,
    GraduationCap,
    FileText,
    MessageSquare,
    Settings,
    Database,
    Menu,
    X,
    ChevronRight,
    Play,
    FolderKanban,
    Newspaper,
    Star,
    Plus,
    Edit,
    MapPin,
    DollarSign,
    Briefcase as BriefcaseIcon,
    ExternalLink,
    Trash2
} from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetTrigger } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { io } from "socket.io-client";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';

// Import standalone components
import UserManagement from "./UserManagement";
import CourseManagement from "./CourseManagement";
import DashboardOverview from "@/components/admin/DashboardOverview";
import FeatureManagement from "@/components/admin/FeatureManagement";
import CodingOverview from '@/components/admin/module-overviews/CodingOverview';
import MentorshipOverview from '@/components/admin/module-overviews/MentorshipOverview';
import CoursesOverview from '@/components/admin/module-overviews/CoursesOverview';
import ProjectsOverview from '@/components/admin/module-overviews/ProjectsOverview';
import JobsOverview from '@/components/admin/module-overviews/JobsOverview';

// Socket connection
const socket = io("http://localhost:5000");

// --- Types & Mock Data ---

interface Job {
    id: number;
    title: string;
    company: string;
    type: 'Full-time' | 'Internship';
    mode: 'Remote' | 'Onsite' | 'Hybrid';
    location: string;
    package: string;
    skills: string;
    deadline: string;
    status: 'Active' | 'Closed';
    applicants: number;
    description: string;
    responsibilities?: string;
    eligibility?: string;
    applyLink: string;
    postedDate: string;
    // Helper property for mapping
    job_id?: number;
    job_title?: string;
    company_name?: string;
    job_type?: string;
    work_mode?: string;
    salary_package?: string;
    required_skills?: string;
    job_description?: string;
    responsibilities_db?: string; // naming to avoid collision if needed
    eligibility_db?: string;
    application_deadline?: string;
    application_link?: string;
    created_at?: string;
}


// Job Interface to match DB response


const INITIAL_JOBS: Job[] = [
    {
        id: 1,
        title: "SDE Intern",
        company: "Google",
        type: "Internship",
        mode: "Hybrid",
        location: "Bangalore",
        package: "80K / Month",
        skills: "Python, C++, DSA",
        deadline: "2024-04-10",
        status: "Active",
        applicants: 124,
        description: "Join our core engineering team to build scalable systems. Great opportunity for students.",
        applyLink: "https://careers.google.com",
        postedDate: "2024-03-15"
    },
    {
        id: 2,
        title: "Frontend Developer",
        company: "Microsoft",
        type: "Full-time",
        mode: "Onsite",
        location: "Hyderabad",
        package: "18 LPA",
        skills: "React, TypeScript, Tailwind",
        deadline: "2024-04-05",
        status: "Active",
        applicants: 85,
        description: "Looking for an experienced frontend developer to lead our UI modernization projects.",
        applyLink: "https://careers.microsoft.com",
        postedDate: "2024-03-12"
    },
    {
        id: 3,
        title: "Backend Engineer",
        company: "Amazon",
        type: "Full-time",
        mode: "Remote",
        location: "Remote",
        package: "22 LPA",
        skills: "Java, Spring Boot, AWS",
        deadline: "2024-03-30",
        status: "Closed",
        applicants: 200,
        description: "Work on high-scale distributed systems powering Amazon Web Services.",
        applyLink: "https://amazon.jobs",
        postedDate: "2024-03-01"
    },
    {
        id: 4,
        title: "Walk-in Drive: QA Engineer",
        company: "TCS",
        type: "Full-time",
        mode: "Onsite",
        location: "Chennai",
        package: "4.5 LPA",
        skills: "Manual Testing, Selenium",
        deadline: "2024-03-25",
        status: "Active",
        applicants: 0,
        description: "Freshers walk-in drive for QA roles. Bring updated resume and ID proof.",
        applyLink: "https://tcs.com/careers",
        postedDate: "2024-03-20"
    }
];

// Mock Data for new modules
const PROJECTS = [
    { id: 1, title: "E-Commerce API", student: "Arjun Verma", stack: "Node.js, Express", status: "Pending Review", date: "2024-03-15" },
    { id: 2, title: "Portfolio Website", student: "Meera Reddy", stack: "React, Tailwind", status: "Approved", date: "2024-03-14" },
    { id: 3, title: "Task Manager", student: "Rohan Das", stack: "MERN Stack", status: "Rejected", date: "2024-03-12" },
];

const MENTOR_SESSIONS = [
    { id: 1, student: "Kavya S", mentor: "Dr. Sarah Smith", topic: "Career Guidance", time: "10:00 AM", date: "2024-03-20", status: "Upcoming" },
    { id: 2, student: "Ishaan M", mentor: "Prof. John Doe", topic: "Code Review", time: "2:00 PM", date: "2024-03-19", status: "Completed" },
];

const JOB_APPLICATIONS = [
    { id: 1, company: "Google", role: "SDE Intern", student: "Arjun Verma", status: "Interview", date: "2024-03-10" },
    { id: 2, company: "Microsoft", role: "Frontend Dev", student: "Meera Reddy", status: "Applied", date: "2024-03-12" },
    { id: 3, company: "Amazon", role: "Backend Dev", student: "Rohan Das", status: "Rejected", date: "2024-03-05" },
];

export default function AdminDashboard() {
    const { signOut } = useAuth();
    const navigate = useNavigate();
    const [activeModule, setActiveModule] = useState('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const sidebarItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'features', label: 'Feature Management', icon: Settings },
        { id: 'users', label: 'User Management', icon: Users },
        { id: 'courses', label: 'Courses & Learning', icon: BookOpen },
        { id: 'coding', label: 'Coding Platform', icon: Code },
        { id: 'projects', label: 'Project Management', icon: FolderKanban },
        { id: 'mentorship', label: 'Mentorship', icon: GraduationCap },
        { id: 'jobs', label: 'Jobs & Placements', icon: BriefcaseIcon },
        { id: 'events', label: 'Events', icon: Calendar },
        { id: 'news', label: 'News & Updates', icon: Newspaper },
        { id: 'feedback', label: 'Feedback', icon: MessageSquare },
    ];

    // Helper to render content based on active module
    const renderContent = () => {
        switch (activeModule) {
            case 'dashboard':
                return <DashboardOverview />;
            case 'users':
                return <UserManagement />; // Using standalone component
            // return <div className="p-10 text-center">User Management is currently disabled for debugging.</div>;
            case 'courses':
                return <CourseManagement />;
            case 'coding':
                return <CodingAnalytics />;
            case 'projects':
                return <ProjectManagement />;
            case 'mentorship':
                return <MentorshipManagement />;
            case 'jobs':
                return <JobsManagement />;
            case 'events':
                return <EventsManagement />;
            case 'news':
                return <NewsManagement />;
            case 'features':
                return <FeatureManagement />;
            case 'feedback':
                return <FeedbackManagement />;
            default:
                return <DashboardOverview />;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar (Desktop) */}
            <aside className={`fixed inset-y-0 left-0 z-50 bg-slate-900 text-white transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'} hidden md:flex flex-col`}>
                <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                        <img src="/brand-logo.png" alt="Prolync Logo" className="h-8 w-8 object-contain" />
                        {isSidebarOpen && (
                            <span className="text-xl font-bold text-white tracking-tight">
                                Prolync
                            </span>
                        )}
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-slate-400 hover:text-white">
                        {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </Button>
                </div>

                <div className="flex-1 py-6 overflow-y-auto">
                    <nav className="space-y-1 px-2">
                        {sidebarItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveModule(item.id)}
                                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${activeModule === item.id
                                    ? item.id === 'features'
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20'
                                        : 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                                    : item.id === 'features'
                                        ? 'text-indigo-400 hover:bg-indigo-500/10 hover:text-indigo-300'
                                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                    }`}
                            >
                                <item.icon className="h-5 w-5 flex-shrink-0" />
                                {isSidebarOpen && <span className="font-medium text-sm">{item.label}</span>}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={() => { signOut(); navigate('/login'); }}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-red-400 hover:bg-slate-800 hover:text-red-300 transition-colors ${!isSidebarOpen && 'justify-center'}`}
                    >
                        <LogOut className="h-5 w-5" />
                        {isSidebarOpen && <span className="font-medium text-sm">Sign Out</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
                {/* Top Header */}
                <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 px-6 flex items-center justify-between">
                    <h1 className="text-xl font-bold text-slate-800 capitalize">
                        {sidebarItems.find(i => i.id === activeModule)?.label}
                    </h1>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-slate-600">Admin User</span>
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold border border-blue-200">
                                A
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-6">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
}


function CoursesManagement() {
    const [showOverview, setShowOverview] = useState(false);
    const [courseStats, setCourseStats] = useState({ total_enrollments: 0, completion_rate: '0%', top_courses: [] });

    useEffect(() => {
        if (showOverview) {
            fetch('http://localhost:5000/api/dashboard/courses')
                .then(res => res.json())
                .then(data => setCourseStats(data))
                .catch(err => console.error("Error fetching course stats", err));
        }
    }, [showOverview]);

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowOverview(!showOverview)}
                    className={`gap-2 ${showOverview ? 'bg-orange-50 border-orange-200 text-orange-700' : ''}`}
                >
                    <BookOpen className="h-4 w-4" />
                    {showOverview ? "Show Management" : "Show Overview"}
                </Button>
            </div>

            {showOverview ? (
                <CoursesOverview courseStats={courseStats} />
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>Courses & Learning Paths</CardTitle>
                        <CardDescription>Manage technical courses and track student progress.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-50 rounded-lg dashed border-2 border-slate-200">
                            <BookOpen className="h-10 w-10 text-slate-400 mb-2" />
                            <h3 className="text-lg font-medium text-slate-900">Course Management Module</h3>
                            <p className="text-slate-500 max-w-sm">This module will track enrolled courses, learning paths, and student progress.</p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

function CodingAnalytics() {
    const [showOverview, setShowOverview] = useState(false);
    const [stats, setStats] = useState({ problems_solved: 0 });
    const [topCoders, setTopCoders] = useState([]);

    useEffect(() => {
        if (showOverview) {
            Promise.all([
                fetch('http://localhost:5000/api/dashboard/overview'),
                fetch('http://localhost:5000/api/dashboard/coders')
            ]).then(async ([overviewRes, codersRes]) => {
                if (overviewRes.ok) setStats(await overviewRes.json());
                if (codersRes.ok) setTopCoders(await codersRes.json());
            }).catch(err => console.error("Error fetching coding stats", err));
        }
    }, [showOverview]);

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowOverview(!showOverview)}
                    className={`gap-2 ${showOverview ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : ''}`}
                >
                    <Code className="h-4 w-4" />
                    {showOverview ? "Show Management" : "Show Overview"}
                </Button>
            </div>

            {showOverview ? (
                <CodingOverview stats={stats} topCoders={topCoders} />
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>Coding Platform Analytics</CardTitle>
                        <CardDescription>Detailed insights into student coding performance.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-50 rounded-lg dashed border-2 border-slate-200">
                            <Code className="h-10 w-10 text-slate-400 mb-2" />
                            <h3 className="text-lg font-medium text-slate-900">Coding Analytics Module</h3>
                            <p className="text-slate-500 max-w-sm">Track problems solved, languages used, and leaderboard status.</p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

function ProjectManagement() {
    const [showOverview, setShowOverview] = useState(false);
    const [projectStats, setProjectStats] = useState({ pending: 0, approved: 0, rejected: 0, recent: [] });

    useEffect(() => {
        if (showOverview) {
            fetch('http://localhost:5000/api/dashboard/projects')
                .then(res => res.json())
                .then(data => setProjectStats(data))
                .catch(err => console.error("Error fetching project stats", err));
        }
    }, [showOverview]);

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowOverview(!showOverview)}
                    className={`gap-2 ${showOverview ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : ''}`}
                >
                    <FolderKanban className="h-4 w-4" />
                    {showOverview ? "Show Submissions" : "Show Overview"}
                </Button>
            </div>

            {showOverview ? (
                <ProjectsOverview projectStats={projectStats} />
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>Project Submissions</CardTitle>
                        <CardDescription>Review and approve student projects.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Project Title</TableHead>
                                    <TableHead>Student</TableHead>
                                    <TableHead>Tech Stack</TableHead>
                                    <TableHead>Submission Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {PROJECTS.map((project) => (
                                    <TableRow key={project.id}>
                                        <TableCell className="font-medium">{project.title}</TableCell>
                                        <TableCell>{project.student}</TableCell>
                                        <TableCell>{project.stack}</TableCell>
                                        <TableCell>{project.date}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={
                                                project.status === 'Approved' ? 'bg-green-50 text-green-700' :
                                                    project.status === 'Rejected' ? 'bg-red-50 text-red-700' : 'bg-yellow-50 text-yellow-700'
                                            }>{project.status}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Button size="sm" variant="outline">Review</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
function MentorshipManagement() {
    const [sessions, setSessions] = useState<any[]>([]);
    const [isFeatureEnabled, setIsFeatureEnabled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const [showOverview, setShowOverview] = useState(false);
    const [mentorshipOverviewStats, setMentorshipOverviewStats] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Feature Status
                const featureRes = await fetch('http://localhost:5000/api/features/mentorship');
                if (featureRes.ok) {
                    const featureData = await featureRes.json();
                    setIsFeatureEnabled(featureData.is_enabled);
                }

                // Fetch Sessions
                const response = await fetch('http://localhost:5000/api/mentorship/sessions');
                if (response.ok) {
                    const data = await response.json();
                    setSessions(data);
                }
            } catch (error) {
                console.error("Failed to fetch data", error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (showOverview) {
            fetch('http://localhost:5000/api/dashboard/mentorship')
                .then(res => res.json())
                .then(data => setMentorshipOverviewStats(data))
                .catch(err => console.error("Error fetching mentorship stats", err));
        }
    }, [showOverview]);

    const handleToggleFeature = async (checked: boolean) => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/features/admin/mentorship', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ enabled: checked })
            });

            if (response.ok) {
                setIsFeatureEnabled(checked);
                toast({
                    title: checked ? "Mentorship Enabled" : "Mentorship Disabled",
                    description: checked
                        ? "Students can now access the mentorship feature."
                        : "Mentorship feature is now hidden from students.",
                });
            } else {
                toast({
                    title: "Error",
                    description: "Failed to update feature status.",
                    variant: "destructive"
                });
            }
        } catch (error) {
            console.error("Error toggling feature", error);
            toast({
                title: "Error",
                description: "Failed to connect to server.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowOverview(!showOverview)}
                    className={`gap-2 ${showOverview ? 'bg-pink-50 border-pink-200 text-pink-700' : ''}`}
                >
                    <GraduationCap className="h-4 w-4" />
                    {showOverview ? "Show Sessions" : "Show Overview"}
                </Button>
            </div>

            {showOverview ? (
                <MentorshipOverview mentorshipStats={mentorshipOverviewStats} />
            ) : (
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Mentorship Sessions</CardTitle>
                            <CardDescription>Manage mentorship feature and view sessions.</CardDescription>
                        </div>
                        <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                            <div className="flex flex-col">
                                <span className="text-sm font-medium">Mentorship Feature</span>
                                <span className="text-xs text-slate-500">
                                    {isFeatureEnabled ? "Live for students" : "Coming Soon mode"}
                                </span>
                            </div>
                            <Switch
                                checked={isFeatureEnabled}
                                onCheckedChange={handleToggleFeature}
                                disabled={isLoading}
                            />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Student</TableHead>
                                    <TableHead>Mentor</TableHead>
                                    <TableHead>Topic</TableHead>
                                    <TableHead>Time</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sessions.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                            No booking sessions found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    sessions.map((session) => (
                                        <TableRow key={session.id}>
                                            <TableCell className="font-medium">{session.user_name}</TableCell>
                                            <TableCell>{session.mentor_name}</TableCell>
                                            <TableCell>{session.topic}</TableCell>
                                            <TableCell>{session.slot_time}</TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">{session.status}</Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

function JobsManagement() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [filter, setFilter] = useState<'All' | 'Internship' | 'Full-time' | 'Closed'>('All');
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showOverview, setShowOverview] = useState(false);
    const [jobOverviewStats, setJobOverviewStats] = useState({ active: 0, applications: 0, interviews: 0, placed: 0 });

    const [formData, setFormData] = useState<Partial<Job>>({});

    useEffect(() => {
        if (showOverview) {
            fetch('http://localhost:5000/api/dashboard/jobs')
                .then(res => res.json())
                .then(data => setJobOverviewStats(data))
                .catch(err => console.error("Error fetching job stats", err));
        }
    }, [showOverview]);

    const isExpired = (deadlineStr: string) => {
        if (!deadlineStr) return false;
        const deadline = new Date(deadlineStr);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        deadline.setHours(0, 0, 0, 0);
        return deadline < today;
    };

    const fetchJobs = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/jobs');
            if (response.ok) {
                const data = await response.json();
                const mappedJobs = data.map((j: any) => ({
                    id: j.job_id,
                    title: j.job_title,
                    company: j.company_name,
                    type: j.job_type,
                    mode: j.work_mode,
                    location: j.location,
                    package: j.salary_package,
                    skills: j.required_skills,
                    deadline: j.application_deadline,
                    status: j.status,
                    applicants: 0, // Not in DB yet
                    description: j.job_description,
                    responsibilities: j.responsibilities,
                    eligibility: j.eligibility,
                    applyLink: j.application_link,
                    postedDate: new Date(j.created_at).toLocaleDateString()
                }));
                setJobs(mappedJobs);
            }
        } catch (error) {
            console.error("Failed to fetch jobs", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const filteredJobs = jobs.filter(job => {
        const expired = isExpired(job.deadline);
        if (filter === 'All') return true;
        if (filter === 'Closed') return job.status === 'Closed' || expired;
        return job.type === filter && job.status !== 'Closed' && !expired;
    });

    const handleAddNew = () => {
        setSelectedJob(null);
        setFormData({
            status: 'Active',
            type: 'Full-time',
            mode: 'Onsite',
            postedDate: new Date().toISOString().split('T')[0],
            applicants: 0
        });
        setIsEditing(true);
        setIsSheetOpen(true);
    };

    const handleView = (job: Job) => {
        setSelectedJob(job);
        setFormData(job);
        setIsEditing(false);
        setIsSheetOpen(true);
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            };

            const payload = {
                job_title: formData.title,
                company_name: formData.company,
                job_type: formData.type,
                work_mode: formData.mode,
                location: formData.location,
                salary_package: formData.package,
                required_skills: formData.skills,
                job_description: formData.description,
                responsibilities: formData.responsibilities,
                eligibility: formData.eligibility,
                application_deadline: formData.deadline,
                application_link: formData.applyLink,
                status: formData.status
            };

            let response;
            if (selectedJob) {
                // Update
                response = await fetch(`http://localhost:5000/api/jobs/${selectedJob.id}`, {
                    method: 'PUT',
                    headers,
                    body: JSON.stringify(payload)
                });
            } else {
                // Create
                response = await fetch(`http://localhost:5000/api/jobs`, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(payload)
                });
            }

            if (response.ok) {
                await fetchJobs(); // Refresh list
                setIsSheetOpen(false);
            } else {
                const errorData = await response.json();
                console.error("Failed to save job", errorData);
                alert(`Failed to save job: ${errorData.message || response.statusText}`);
            }

        } catch (error) {
            console.error("Error saving job", error);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this job?")) return;
        try {
            const token = localStorage.getItem('token');
            await fetch(`http://localhost:5000/api/jobs/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setJobs(jobs.filter(j => j.id !== id));
            setIsSheetOpen(false);
        } catch (error) {
            console.error("Failed to delete job", error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowOverview(!showOverview)}
                    className={`gap-2 ${showOverview ? 'bg-cyan-50 border-cyan-200 text-cyan-700' : ''}`}
                >
                    <Briefcase className="h-4 w-4" />
                    {showOverview ? "Show Listings" : "Show Overview"}
                </Button>
            </div>

            {showOverview ? (
                <JobsOverview jobStats={jobOverviewStats} />
            ) : (
                <Card className="h-full border-none shadow-none">
                    <CardHeader className="px-0 pt-0 pb-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-2xl font-bold">Jobs & Recruitments</CardTitle>
                                <CardDescription>Manage active job postings, walk-ins, and internships.</CardDescription>
                            </div>
                            <Button onClick={handleAddNew} className="bg-blue-600 hover:bg-blue-700">
                                <Plus className="h-4 w-4 mr-2" /> Post New Job
                            </Button>
                        </div>

                        {/* Filters */}
                        <div className="flex gap-2 mt-6">
                            {['All', 'Internship', 'Full-time', 'Closed'].map((f) => (
                                <Button
                                    key={f}
                                    variant={filter === f ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setFilter(f as any)}
                                    className={filter === f ? "bg-slate-900" : "text-slate-600"}
                                >
                                    {f}
                                </Button>
                            ))}
                        </div>
                    </CardHeader>

                    <CardContent className="px-0">
                        <div className="rounded-md border border-slate-200 overflow-hidden">
                            <Table>
                                <TableHeader className="bg-slate-50">
                                    <TableRow>
                                        <TableHead>Role & Company</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Location</TableHead>
                                        <TableHead>Deadline</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredJobs.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                                                No jobs found matching this filter.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredJobs.map((job) => (
                                            <TableRow key={job.id} className="hover:bg-slate-50/50">
                                                <TableCell>
                                                    <div>
                                                        <p className="font-semibold text-slate-900">{job.title}</p>
                                                        <p className="text-sm text-slate-500">{job.company}</p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary" className={
                                                        job.type === 'Internship' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'
                                                    }>
                                                        {job.type}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-slate-600 text-sm">
                                                    <div className="flex items-center gap-1">
                                                        <MapPin className="h-3 w-3" /> {job.location}
                                                    </div>
                                                </TableCell>
                                                <TableCell className={isExpired(job.deadline) ? "text-red-600 font-bold text-sm" : "text-slate-500 text-sm"}>
                                                    {new Date(job.deadline).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell>
                                                    {isExpired(job.deadline) ? (
                                                        <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">
                                                            Closed
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="outline" className={job.status === 'Active' ? 'text-green-600 border-green-200 bg-green-50' : 'text-slate-500'}>
                                                            {job.status}
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="sm" onClick={() => handleView(job)}>
                                                        View
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Right Side Sheet Modal */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent className="sm:max-w-xl overflow-y-auto">
                    <SheetHeader className="mb-6">
                        <SheetTitle>{isEditing ? (selectedJob ? 'Edit Job Posting' : 'Create New Job') : 'Job Details'}</SheetTitle>
                        <SheetDescription>
                            {isEditing ? 'Fill in the details below to post a job.' : 'Review job details and applicant stats.'}
                        </SheetDescription>
                    </SheetHeader>

                    {isEditing ? (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Job Title</Label>
                                    <Input value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. SDE Intern" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Company Name</Label>
                                    <Input value={formData.company || ''} onChange={e => setFormData({ ...formData, company: e.target.value })} placeholder="e.g. Google" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Job Type</Label>
                                    <Select value={formData.type} onValueChange={(val: any) => setFormData({ ...formData, type: val })}>
                                        <SelectTrigger><SelectValue placeholder="Select Type" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Full-time">Full-time</SelectItem>
                                            <SelectItem value="Internship">Internship</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Work Mode</Label>
                                    <Select value={formData.mode} onValueChange={(val: any) => setFormData({ ...formData, mode: val })}>
                                        <SelectTrigger><SelectValue placeholder="Select Mode" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Onsite">Onsite</SelectItem>
                                            <SelectItem value="Hybrid">Hybrid</SelectItem>
                                            <SelectItem value="Remote">Remote</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Location</Label>
                                    <Input value={formData.location || ''} onChange={e => setFormData({ ...formData, location: e.target.value })} placeholder="e.g. Bangalore" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Salary / Package</Label>
                                    <Input value={formData.package || ''} onChange={e => setFormData({ ...formData, package: e.target.value })} placeholder="e.g. 12 LPA" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Required Skills</Label>
                                <Input value={formData.skills || ''} onChange={e => setFormData({ ...formData, skills: e.target.value })} placeholder="e.g. React, Node.js, Python" />
                            </div>

                            <div className="space-y-2">
                                <Label>Job Description</Label>
                                <Textarea value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })} className="h-24" placeholder="Enter detailed job description..." />
                            </div>

                            <div className="space-y-2">
                                <Label>Key Responsibilities (One per line)</Label>
                                <Textarea value={formData.responsibilities || ''} onChange={e => setFormData({ ...formData, responsibilities: e.target.value })} className="h-24" placeholder="e.g. Design UI components&#10;Develop backend APIs" />
                            </div>

                            <div className="space-y-2">
                                <Label>Eligibility Criteria (One per line)</Label>
                                <Textarea value={formData.eligibility || ''} onChange={e => setFormData({ ...formData, eligibility: e.target.value })} className="h-24" placeholder="e.g. B.Tech in CS&#10;GPA > 7.5" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Application Deadline</Label>
                                    <Input type="date" value={formData.deadline || ''} onChange={e => setFormData({ ...formData, deadline: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Application Link</Label>
                                    <Input value={formData.applyLink || ''} onChange={e => setFormData({ ...formData, applyLink: e.target.value })} placeholder="https://..." />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Status</Label>
                                <Select value={formData.status} onValueChange={(val: any) => setFormData({ ...formData, status: val })}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Active">Active</SelectItem>
                                        <SelectItem value="Closed">Closed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <SheetFooter className="mt-8">
                                <Button variant="outline" onClick={() => setIsSheetOpen(false)}>Cancel</Button>
                                <Button onClick={handleSave}>Save Job</Button>
                            </SheetFooter>
                        </div>
                    ) : selectedJob && (
                        <div className="space-y-6">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-12 w-12 rounded-lg bg-slate-100 flex items-center justify-center text-xl font-bold text-slate-700">
                                        {selectedJob.company.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900">{selectedJob.title}</h3>
                                        <p className="text-slate-500 font-medium">{selectedJob.company}</p>
                                    </div>
                                </div>
                                {isExpired(selectedJob.deadline) ? (
                                    <Badge className="bg-red-100 text-red-700">
                                        Closed
                                    </Badge>
                                ) : (
                                    <Badge className={selectedJob.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}>
                                        {selectedJob.status}
                                    </Badge>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-100">
                                <div className="space-y-1">
                                    <p className="text-xs text-slate-400 uppercase tracking-wide">Package</p>
                                    <p className="font-semibold text-slate-800 flex items-center gap-1">
                                        <DollarSign className="h-4 w-4 text-green-600" /> {selectedJob.package}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-slate-400 uppercase tracking-wide">Location</p>
                                    <p className="font-semibold text-slate-800 flex items-center gap-1">
                                        <MapPin className="h-4 w-4 text-blue-500" /> {selectedJob.location} ({selectedJob.mode})
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-slate-400 uppercase tracking-wide">Type</p>
                                    <p className="font-medium text-slate-800 flex items-center gap-1">
                                        <BriefcaseIcon className="h-4 w-4 text-purple-500" /> {selectedJob.type}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-slate-400 uppercase tracking-wide">Deadline</p>
                                    <p className="font-medium text-slate-800 flex items-center gap-1">
                                        <Calendar className="h-4 w-4 text-orange-500" /> {selectedJob.deadline}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h4 className="font-semibold text-slate-900">Description</h4>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    {selectedJob.description}
                                </p>
                            </div>

                            {selectedJob.responsibilities && (
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-slate-900">Responsibilities</h4>
                                    <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
                                        {selectedJob.responsibilities.split('\n').filter(r => r.trim()).map((r, i) => (
                                            <li key={i}>{r}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {selectedJob.eligibility && (
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-slate-900">Eligibility</h4>
                                    <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
                                        {selectedJob.eligibility.split('\n').filter(e => e.trim()).map((e, i) => (
                                            <li key={i}>{e}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="space-y-2">
                                <h4 className="font-semibold text-slate-900">Skills Required</h4>
                                <div className="flex flex-wrap gap-2">
                                    {selectedJob.skills.split(',').map(skill => (
                                        <Badge key={skill} variant="secondary" className="bg-slate-100 text-slate-700">
                                            {skill.trim()}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <Button className="flex-1" onClick={handleEdit}>
                                    <Edit className="h-4 w-4 mr-2" /> Edit Job
                                </Button>
                                <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleDelete(selectedJob.id)}>
                                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                                </Button>
                            </div>
                        </div>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    );
}


function PlacementsManagement() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Jobs & Placements</CardTitle>
                <CardDescription>Track job applications and placement success.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Company</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Student</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {JOB_APPLICATIONS.map((job) => (
                            <TableRow key={job.id}>
                                <TableCell className="font-medium">{job.company}</TableCell>
                                <TableCell>{job.role}</TableCell>
                                <TableCell>{job.student}</TableCell>
                                <TableCell>{job.date}</TableCell>
                                <TableCell>
                                    <Badge variant="outline">{job.status}</Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}


function EventsManagement() {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [showOverview, setShowOverview] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        type: 'Workshop',
        date: '',
        startTime: '',
        duration: '',
        location: '',
        prize: '',
        description: '',
        registration_link: '',
        image_url: ''
    });

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/events');
            if (response.ok) {
                const data = await response.json();
                setEvents(data);
            }
        } catch (error) {
            console.error('Failed to fetch events', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEdit = (event: any) => {
        setEditingId(event.id);

        // Parse time string back to start time and duration if possible
        // Expected format: "10:00 AM - 12:00 PM"
        let startTime = '';
        let duration = '';

        if (event.time && event.time.includes(' - ')) {
            const parts = event.time.split(' - ');
            const startTimeStr = parts[0]; // "10:00 AM"
            const endTimeStr = parts[1]; // "12:00 PM"

            // Convert 12h to 24h for input type="time"
            const convertTo24Hour = (timeStr: string) => {
                const [time, modifier] = timeStr.split(' ');
                let [hours, minutes] = time.split(':');
                if (hours === '12') hours = '00';
                if (modifier === 'PM') hours = (parseInt(hours, 10) + 12).toString();
                return `${hours}:${minutes}`;
            };

            startTime = convertTo24Hour(startTimeStr);

            // Calculate duration
            const start = new Date(`2000/01/01 ${startTimeStr}`);
            const end = new Date(`2000/01/01 ${endTimeStr}`);
            const diff = (end.getTime() - start.getTime()) / 1000 / 60 / 60;
            duration = diff.toString();
        }

        setFormData({
            title: event.title,
            type: event.type,
            date: event.date,
            startTime: startTime,
            duration: duration,
            location: event.location,
            prize: event.prize || '',
            description: event.description,
            registration_link: event.registration_link,
            image_url: event.image_url
        });
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this event?')) return;
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/events/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                alert('Event deleted successfully');
                fetchEvents();
            } else {
                alert('Failed to delete event');
            }
        } catch (error) {
            console.error('Error deleting event:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Format time string
        let formattedTime = formData.startTime;
        if (formData.duration) {
            const [hours, minutes] = formData.startTime.split(':').map(Number);
            const durationHours = parseFloat(formData.duration);

            const startDate = new Date();
            startDate.setHours(hours, minutes);

            const endDate = new Date(startDate.getTime() + durationHours * 60 * 60 * 1000);

            const formatTime = (date: Date) => {
                return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            };

            formattedTime = `${formatTime(startDate)} - ${formatTime(endDate)}`;
        }

        const payload = {
            ...formData,
            time: formattedTime
        };

        try {
            const token = localStorage.getItem('token');
            const url = editingId
                ? `http://localhost:5000/api/events/${editingId}`
                : 'http://localhost:5000/api/events';

            const method = editingId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                alert(`Event ${editingId ? 'updated' : 'added'} successfully!`);
                setFormData({
                    title: '',
                    type: 'Workshop',
                    date: '',
                    startTime: '',
                    duration: '',
                    location: '',
                    prize: '',
                    description: '',
                    registration_link: '',
                    image_url: ''
                });
                setIsDialogOpen(false);
                setEditingId(null);
                fetchEvents();
            } else {
                const errorText = await response.text();
                alert(`Failed to ${editingId ? 'update' : 'add'} event: ${response.status} ${errorText}`);
            }
        } catch (error) {
            console.error('Error saving event:', error);
            alert('Error saving event');
        } finally {
            setLoading(false);
        }
    };

    const openNewEventSheet = () => {
        setEditingId(null);
        setFormData({
            title: '',
            type: 'Workshop',
            date: '',
            startTime: '',
            duration: '',
            location: '',
            prize: '',
            description: '',
            registration_link: '',
            image_url: ''
        });
        setIsDialogOpen(true);
    };

    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="space-y-6">
            <div className="flex justify-end pt-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowOverview(!showOverview)}
                    className={`gap-2 ${showOverview ? 'bg-amber-50 border-amber-200 text-amber-700' : ''}`}
                >
                    <Calendar className="h-4 w-4" />
                    {showOverview ? "Show Management" : "Show Overview"}
                </Button>
            </div>

            {showOverview ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
                    <Card className="bg-amber-50 border-amber-100 p-4">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-amber-700">Total Events</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-amber-900">{events.length}</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-white border-slate-100 p-4">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-slate-500">Upcoming Workshops</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-slate-900">
                                {events.filter(e => e.type === 'Workshop').length}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-white border-slate-100 p-4">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-slate-500">Active Competitions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-slate-900">
                                {events.filter(e => e.type === 'Competition' || e.type === 'Hackathon').length}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            ) : (
                <>
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight">Events Management</h2>
                            <p className="text-muted-foreground">Create and manage your events here.</p>
                        </div>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button onClick={openNewEventSheet}>
                                    <Plus className="mr-2 h-4 w-4" /> Add Event
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-2xl">
                                <DialogHeader>
                                    <DialogTitle>{editingId ? 'Edit Event' : 'Add New Event'}</DialogTitle>
                                    <DialogDescription>
                                        {editingId ? 'Update event details below.' : 'Fill in the details to create a new event.'}
                                    </DialogDescription>
                                </DialogHeader>

                                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Event Title</label>
                                            <Input name="title" value={formData.title} onChange={handleChange} required placeholder="Ex: Hackathon 2024" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Category</label>
                                            <select
                                                name="type"
                                                value={formData.type}
                                                onChange={handleChange}
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                            >
                                                <option value="Workshop">Workshop</option>
                                                <option value="Hackathon">Hackathon</option>
                                                <option value="Paper Presentation">Paper Presentation</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Date</label>
                                            <Input type="date" min={today} name="date" value={formData.date} onChange={handleChange} required />
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Start Time</label>
                                                <Input type="time" name="startTime" value={formData.startTime} onChange={handleChange} required />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Duration (Hours)</label>
                                                <Input type="number" step="0.5" name="duration" value={formData.duration} onChange={handleChange} placeholder="Ex: 2" required />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Location</label>
                                            <Input name="location" value={formData.location} onChange={handleChange} required placeholder="Ex: Virtual / Main Hall" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Prize (Optional)</label>
                                            <Input name="prize" value={formData.prize} onChange={handleChange} placeholder="Ex: ₹10,000" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Registration Link</label>
                                            <Input name="registration_link" value={formData.registration_link} onChange={handleChange} required placeholder="https://..." />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Image URL</label>
                                            <Input name="image_url" value={formData.image_url} onChange={handleChange} required placeholder="https://..." />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Description</label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            required
                                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                                            placeholder="Enter event details..."
                                        />
                                    </div>
                                    <div className="flex justify-end">
                                        <Button type="submit" disabled={loading}>
                                            {loading ? (editingId ? 'Updating...' : 'Adding...') : (editingId ? 'Update Event' : 'Add Event')}
                                        </Button>
                                    </div>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Existing Events</CardTitle>
                            <CardDescription>View and manage your scheduled events.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {events.length === 0 ? (
                                    <p className="text-center text-muted-foreground py-4">No events found.</p>
                                ) : (
                                    events.map((event) => (
                                        <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-accent/50 transition-colors">
                                            <div className="space-y-1">
                                                <h4 className="font-semibold">{event.title}</h4>
                                                <div className="text-sm text-muted-foreground flex items-center gap-3">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        {event.date}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        {event.time}
                                                    </div>
                                                    <Badge variant="secondary" className="text-xs">{event.type}</Badge>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => handleEdit(event)}
                                                    title="Edit Event"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="icon"
                                                    onClick={() => handleDelete(event.id)}
                                                    title="Delete Event"
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    );
}

function FeedbackManagement() {
    const [feedback, setFeedback] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showOverview, setShowOverview] = useState(false);

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/feedback/all');
                if (response.ok) {
                    const data = await response.json();
                    setFeedback(data);
                }
            } catch (error) {
                console.error("Failed to fetch feedback", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchFeedback();
    }, []);

    const renderStars = (rating: number) => {
        return (
            <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`h-3 w-3 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "fill-slate-200 text-slate-200"}`}
                    />
                ))}
                <span className="ml-1 text-xs font-semibold text-slate-700">{rating}</span>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-end pt-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowOverview(!showOverview)}
                    className={`gap-2 ${showOverview ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : ''}`}
                >
                    <MessageSquare className="h-4 w-4" />
                    {showOverview ? "Show Detailed Feedback" : "Show Overview"}
                </Button>
            </div>

            {showOverview ? (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                    <Card className="bg-indigo-50 border-indigo-100 p-4">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-indigo-700">Total Feedback</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-indigo-900">{feedback.length}</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-white border-slate-100 p-4">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-slate-500">Avg. Rating</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-slate-900">
                                {feedback.length > 0
                                    ? (feedback.reduce((acc, curr) => acc + (curr.rating || 0), 0) / feedback.length).toFixed(1)
                                    : "0.0"}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-white border-slate-100 p-4">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-slate-500">Positive</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                {feedback.filter(f => f.rating >= 4).length}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-white border-slate-100 p-4">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-slate-500">Needs Attention</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-500">
                                {feedback.filter(f => f.rating <= 2).length}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            ) : (
                <Card className="border-0 shadow-sm bg-transparent">
                    <CardHeader className="px-0 pt-0 pb-4">
                        <CardTitle>Student Feedback & Ratings</CardTitle>
                        <CardDescription>Review detailed feedback from students regarding the platform and courses.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="rounded-md border bg-white shadow-sm overflow-hidden">
                            <div className="relative w-full overflow-auto max-h-[calc(100vh-250px)]">
                                <Table>
                                    <TableHeader className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                                        <TableRow>
                                            <TableHead className="w-[60px] font-bold text-slate-700">S.No</TableHead>
                                            <TableHead className="w-[120px] font-bold text-slate-700">Date</TableHead>
                                            <TableHead className="w-[180px] font-bold text-slate-700">User</TableHead>
                                            <TableHead className="w-[140px] font-bold text-slate-700">Overall Rating</TableHead>

                                            <TableHead className="min-w-[200px] font-bold text-slate-700">Detailed Ratings</TableHead>
                                            <TableHead className="min-w-[250px] font-bold text-slate-700">General Feedback</TableHead>
                                            <TableHead className="min-w-[200px] font-bold text-slate-700">Additional Comments</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {isLoading ? (
                                            <TableRow>
                                                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                                                    Loading feedback...
                                                </TableCell>
                                            </TableRow>
                                        ) : feedback.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={7} className="h-32 text-center">
                                                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                                                        <MessageSquare className="h-8 w-8 mb-2 opacity-20" />
                                                        <p>No feedback received yet</p>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            feedback.map((item, index) => (
                                                <TableRow key={item.id} className="even:bg-slate-50 hover:bg-slate-100 transition-colors">
                                                    <TableCell className="font-medium text-slate-500">
                                                        {(index + 1).toString().padStart(2, '0')}
                                                    </TableCell>
                                                    <TableCell className="text-slate-500 text-sm">
                                                        {new Date(item.created_at).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex flex-col">
                                                            <span className="font-semibold text-slate-900 text-sm">{item.user_name}</span>
                                                            <span className="text-xs text-slate-400 max-w-[150px] truncate" title={item.user_email}>
                                                                {item.user_email}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center">
                                                            <Badge variant="secondary" className="bg-yellow-50 text-yellow-700 border-yellow-200 px-2 py-0.5 rounded-full flex gap-1 items-center">
                                                                <span className="font-bold">{item.rating}</span>
                                                                <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                                                            </Badge>
                                                        </div>
                                                    </TableCell>

                                                    <TableCell>
                                                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                                                            <div className="flex justify-between items-center text-slate-600">
                                                                <span>Course:</span>
                                                                <span className="font-medium text-slate-900">{item.rating_course || '-'}</span>
                                                            </div>
                                                            <div className="flex justify-between items-center text-slate-600">
                                                                <span>UI:</span>
                                                                <span className="font-medium text-slate-900">{item.rating_ui || '-'}</span>
                                                            </div>
                                                            <div className="flex justify-between items-center text-slate-600">
                                                                <span>UX:</span>
                                                                <span className="font-medium text-slate-900">{item.rating_ux || '-'}</span>
                                                            </div>
                                                            <div className="flex justify-between items-center text-slate-600">
                                                                <span>Code:</span>
                                                                <span className="font-medium text-slate-900">{item.rating_coding || '-'}</span>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <p className="text-sm text-slate-700 line-clamp-2 max-w-[250px]" title={item.message}>
                                                            {item.message}
                                                        </p>
                                                    </TableCell>
                                                    <TableCell>
                                                        <p className="text-sm text-slate-500 italic line-clamp-2 max-w-[200px]" title={item.comments}>
                                                            {item.comments || 'No additional comments'}
                                                        </p>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

function NewsManagement() {
    const [news, setNews] = useState<any[]>([]);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "Tech Update",
        status: "Publish",
        publish_date: new Date().toISOString().split('T')[0],
        image_url: "",
        external_link: ""
    });
    const [editId, setEditId] = useState<number | null>(null);
    const [showOverview, setShowOverview] = useState(false);

    const initialFormState = {
        title: "",
        description: "",
        category: "Tech Update",
        status: "Publish",
        publish_date: new Date().toISOString().split('T')[0],
        image_url: "",
        external_link: ""
    };

    const fetchNews = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/news');
            if (response.ok) {
                const data = await response.json();
                setNews(data);
            }
        } catch (error) {
            console.error("Failed to fetch news", error);
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleEdit = (item: any) => {
        // Safe date parsing
        let safeDate = new Date().toISOString().split('T')[0];
        try {
            if (item.publish_date) {
                const parsed = new Date(item.publish_date);
                if (!isNaN(parsed.getTime())) {
                    safeDate = parsed.toISOString().split('T')[0];
                }
            }
        } catch (e) {
            console.error("Date parsing error", e);
        }

        setFormData({
            title: item.title,
            description: item.description,
            category: item.category,
            status: item.status,
            publish_date: safeDate,
            image_url: item.image_url || "",
            external_link: item.external_link || ""
        });
        setEditId(item.id);
        setIsAddOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this news article?")) return;

        try {
            const response = await fetch(`http://localhost:5000/api/news/delete/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                fetchNews();
            } else {
                console.error("Failed to delete news");
            }
        } catch (error) {
            console.error("Error deleting news", error);
        }
    };

    const handleOpenChange = (open: boolean) => {
        setIsAddOpen(open);
        if (!open) {
            setFormData(initialFormState);
            setEditId(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const url = editId
                ? `http://localhost:5000/api/news/update/${editId}`
                : 'http://localhost:5000/api/news/add';

            const method = editId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                handleOpenChange(false);
                fetchNews(); // Refresh list
            } else {
                console.error("Failed to save news");
            }
        } catch (error) {
            console.error("Error submitting news", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-end pt-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowOverview(!showOverview)}
                    className={`gap-2 ${showOverview ? 'bg-blue-50 border-blue-200 text-blue-700' : ''}`}
                >
                    <Newspaper className="h-4 w-4" />
                    {showOverview ? "Show Listings" : "Show Overview"}
                </Button>
            </div>

            {showOverview ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
                    <Card className="bg-blue-50 border-blue-100 p-4">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-blue-700">Live Articles</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-900">{news.filter(n => n.status === 'Publish').length}</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-white border-slate-100 p-4">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-slate-500">Tech Updates</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-slate-900">
                                {news.filter(n => n.category === 'Tech Update').length}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-white border-slate-100 p-4">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-slate-500">Exam Notifications</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-slate-900">
                                {news.filter(n => n.category === 'Exam Update').length}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            ) : (
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>News & Updates</CardTitle>
                            <CardDescription>Manage platform announcements and tech news.</CardDescription>
                        </div>
                        <Dialog open={isAddOpen} onOpenChange={handleOpenChange}>
                            <DialogTrigger asChild>
                                <Button className="bg-blue-600 hover:bg-blue-700">
                                    <Newspaper className="mr-2 h-4 w-4" />
                                    Add News/Exam Update
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                    <DialogTitle>{editId ? 'Edit News/Exam Update' : 'Add News/Exam Update'}</DialogTitle>
                                    <DialogDescription>{editId ? 'Update the details of the article.' : 'Create a new announcement or update.'}</DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Title</Label>
                                        <Input
                                            id="title"
                                            name="title"
                                            placeholder="Enter article title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea
                                            id="description"
                                            name="description"
                                            placeholder="Enter article content..."
                                            className="min-h-[100px]"
                                            value={formData.description}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="category">Category</Label>
                                            <Select
                                                value={formData.category}
                                                onValueChange={(value) => handleSelectChange('category', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Tech Update">Tech Update</SelectItem>
                                                    <SelectItem value="Exam Update">Exam Update</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="status">Status</Label>
                                            <Select
                                                value={formData.status}
                                                onValueChange={(value) => handleSelectChange('status', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Publish">Publish</SelectItem>
                                                    <SelectItem value="Draft">Draft</SelectItem>
                                                    <SelectItem value="Archived">Archived</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="publish_date">Publish Date</Label>
                                            <Input
                                                id="publish_date"
                                                name="publish_date"
                                                type="date"
                                                value={formData.publish_date}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="image_url">Image URL</Label>
                                            <Input
                                                id="image_url"
                                                name="image_url"
                                                placeholder="https://example.com/image.jpg"
                                                value={formData.image_url}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="external_link">External Link</Label>
                                        <Input
                                            id="external_link"
                                            name="external_link"
                                            placeholder="https://example.com/article"
                                            value={formData.external_link}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <DialogFooter>
                                        <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>Cancel</Button>
                                        <Button type="submit" disabled={isLoading}>
                                            {isLoading ? (editId ? 'Updating...' : 'Publishing...') : (editId ? 'Update Article' : 'Publish Article')}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </CardHeader>
                    <CardContent>
                        {news.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-50 rounded-lg dashed border-2 border-slate-200">
                                <Newspaper className="h-10 w-10 text-slate-400 mb-2" />
                                <h3 className="text-lg font-medium text-slate-900">No News Articles</h3>
                                <p className="text-slate-500 max-w-sm">Get started by adding a new article.</p>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {news.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-medium">{item.title}</TableCell>
                                            <TableCell>{item.category}</TableCell>
                                            <TableCell>{new Date(item.publish_date).toLocaleDateString()}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={item.status === 'Publish' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}>
                                                    {item.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right space-x-2">
                                                <Button size="sm" variant="ghost" onClick={() => handleEdit(item)}>Edit</Button>
                                                <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(item.id)}>Delete</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
