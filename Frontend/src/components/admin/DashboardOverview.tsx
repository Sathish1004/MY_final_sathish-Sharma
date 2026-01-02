import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import {
    Users,
    BookOpen,
    Code,
    Trophy,
    Briefcase,
    GraduationCap,
    FolderKanban,
    Zap,
    TrendingUp,
    Activity,
    UserCheck,
    MessageSquare,
    Plus,
    Calendar,
    Settings
} from "lucide-react";
import { api } from '@/services/api';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import QuickAccessDrawer from "@/components/admin/QuickAccessDrawer";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
} from "recharts";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface CoderStats {
    rank: number;
    name: string;
    email: string;
    solved: number;
    percent: string;
    active: string;
}

interface Course {
    name: string;
    students: number;
    progress: number;
}

interface CourseStats {
    total_enrollments: number;
    completion_rate: string;
    top_courses: Course[];
}

interface MentorshipSession {
    name: string;
    email: string;
    mentor: string;
    time: string;
    status: string;
}

interface ProjectStats {
    pending: number;
    approved: number;
    rejected: number;
    recent: { title: string; student: string; status: string }[];
}

interface JobStats {
    active: number;
    applications: number;
    interviews: number;
    placed: number;
}

interface DashboardStats {
    total_users: number;
    daily_active_users: number;
    monthly_active_users: number;
    total_courses: number;
    problems_solved: number;
    mentors_active: number;
    projects_submitted: number;
    jobs_posted: number;
}

interface ActivityItem {
    type: string;
    message: string;
    time: string;
}

interface DashboardOverviewProps {
    onNavigate?: (module: string) => void;
}

export default function DashboardOverview({ onNavigate }: DashboardOverviewProps) {
    const navigate = useNavigate();
    const [stats, setStats] = useState<DashboardStats>({
        total_users: 0,
        daily_active_users: 0,
        monthly_active_users: 0,
        total_courses: 0,
        problems_solved: 0,
        mentors_active: 0,
        projects_submitted: 0,
        jobs_posted: 0
    });
    const [growthData, setGrowthData] = useState<any[]>([]);
    const [activityFeed, setActivityFeed] = useState<ActivityItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [timeRange, setTimeRange] = useState("week"); // 'day', 'week', 'month', 'year'
    const [growthRate, setGrowthRate] = useState(0);

    // --- Drill Down State ---
    const [selectedPoint, setSelectedPoint] = useState<any>(null);
    const [isUserListOpen, setIsUserListOpen] = useState(false);

    // --- State for Quick Access Drawer ---
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [activeDrawerModule, setActiveDrawerModule] = useState<string | null>(null);

    // --- State for Module-Specific Analytics (to pass to Quick Access Drawer) ---
    const [topCoders, setTopCoders] = useState<CoderStats[]>([]);
    const [courseStats, setCourseStats] = useState<CourseStats>({ total_enrollments: 0, completion_rate: '0%', top_courses: [] });
    const [mentorshipStats, setMentorshipStats] = useState<MentorshipSession[]>([]);
    const [projectStats, setProjectStats] = useState<ProjectStats>({ pending: 0, approved: 0, rejected: 0, recent: [] });
    const [jobStats, setJobStats] = useState<JobStats>({ active: 0, applications: 0, interviews: 0, placed: 0 });

    // Fetch Growth Data separately when timeRange changes
    useEffect(() => {
        const fetchGrowth = async () => {
            try {
                const res = await api.get(`/admin/charts?period=${timeRange}`);
                const data = res.data;

                const chartData = data.chart || [];
                const formattedData = chartData.map((d: any) => ({
                    date: d.date,
                    count: d.count,
                    users: d.users
                }));
                setGrowthData(formattedData);
                setGrowthRate(data.growth || 0);

            } catch (e) {
                console.error("Error fetching growth data:", e);
            }
        };
        fetchGrowth();
    }, [timeRange]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setIsLoading(true);
                // Use the API service instead of hardcoded fetch
                const [overviewRes, activityRes] = await Promise.all([
                    api.get('/admin/stats').catch(e => ({ data: { total_users: 0, daily_active_users: 0, monthly_active_users: 0, total_courses: 0, problems_solved: 0, mentors_active: 0, projects_submitted: 0, jobs_posted: 0 } })),
                    api.get('/admin/activity').catch(e => ({ data: [] }))
                ]);

                // Map 'overviewRes.data' (camelCase from backend) to 'stats' state (snake_case expected by UI)
                const backendStats = overviewRes.data || {};
                const mappedStats = {
                    total_users: backendStats.totalUsers || 0,
                    daily_active_users: backendStats.activeUsers || 0, // Approx
                    monthly_active_users: backendStats.activeUsers || 0,
                    total_courses: backendStats.totalCourses || 0,
                    problems_solved: 0, // Not yet in backend
                    mentors_active: 0, // Not yet in backend
                    projects_submitted: backendStats.totalEnrollments || 0, // Using enrollments as proxy or 0
                    jobs_posted: 0 // Not yet in backend
                };
                setStats(mappedStats);

                if (activityRes.data) setActivityFeed(activityRes.data);

                // For other widgets (coders, courses via /admin/students/progress?)
                // Trying to fetch aggregated data where possible
                // ... (Leaving existing structure if backend endpoints exist, otherwise would need robust endpoints)

            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const StatCard = ({ title, value, icon: Icon, trend, color, subtext, onClick }: any) => (
        <Card
            className={`shadow-sm hover:shadow-md transition-all duration-200 border-slate-100 relative group ${onClick ? 'cursor-pointer hover:bg-slate-50' : ''}`}
            onClick={onClick}
            role={onClick ? "button" : undefined}
            tabIndex={onClick ? 0 : undefined}
            onKeyDown={(e) => {
                if (onClick && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    onClick();
                }
            }}
        >
            <CardContent className="p-6">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm font-medium text-slate-500 mb-1 group-hover:text-slate-700 transition-colors">{title}</p>
                        <h3 className="text-2xl font-bold text-slate-900 group-hover:scale-105 transition-transform origin-left duration-200">{value}</h3>
                    </div>
                    <div className={`p-2 rounded-lg ${color} group-hover:ring-2 ring-offset-2 ring-opacity-50 transition-all`}>
                        <Icon className="h-5 w-5" />
                    </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                    {trend && (
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${trend > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                            }`}>
                            {trend > 0 ? '+' : ''}{trend}%
                        </span>
                    )}
                    <span className="text-xs text-slate-400 group-hover:text-slate-500">{subtext || "vs last month"}</span>
                </div>
            </CardContent>
        </Card>
    );

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900">Dashboard Overview</h2>
                    <p className="text-slate-500 mt-1">Welcome back, Admin. Here's what's happening today.</p>
                </div>
                <div className="flex items-center gap-3">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="gap-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900">
                                <Zap className="h-4 w-4 text-amber-500" />
                                Quick Access
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>Jump to Module</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => { setActiveDrawerModule('coding'); setIsDrawerOpen(true); }}>
                                <Code className="mr-2 h-4 w-4" /> Coding Platform
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => { setActiveDrawerModule('courses'); setIsDrawerOpen(true); }}>
                                <BookOpen className="mr-2 h-4 w-4" /> Courses & Learning
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => { setActiveDrawerModule('mentorship'); setIsDrawerOpen(true); }}>
                                <GraduationCap className="mr-2 h-4 w-4" /> Mentorship
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => { setActiveDrawerModule('projects'); setIsDrawerOpen(true); }}>
                                <FolderKanban className="mr-2 h-4 w-4" /> Projects
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => { setActiveDrawerModule('jobs'); setIsDrawerOpen(true); }}>
                                <Briefcase className="mr-2 h-4 w-4" /> Jobs & Placements
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => { setActiveDrawerModule('users'); setIsDrawerOpen(true); }}>
                                <Users className="mr-2 h-4 w-4" /> Users
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button
                        variant="outline"
                        className="gap-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                        onClick={() => onNavigate?.('features')}
                    >
                        <Settings className="h-4 w-4" />
                        Feature Management
                    </Button>

                    <Button className="gap-2 bg-primary">
                        <Plus className="h-4 w-4" />
                        Add New
                    </Button>
                </div>
            </div>

            {/* Quick Access Slide Drawer */}
            <QuickAccessDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                module={activeDrawerModule}
                data={{
                    stats,
                    topCoders,
                    courseStats,
                    mentorshipStats,
                    projectStats,
                    jobStats
                }}
            />

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Users"
                    value={stats.total_users}
                    icon={Users}
                    color="bg-blue-50 text-blue-600"
                    trend={12}
                    subtext="vs last month"
                    onClick={() => navigate('/admin/dashboard?tab=users')}
                />
                <StatCard
                    title="Daily Active Users"
                    value={stats.daily_active_users}
                    icon={Activity}
                    color="bg-green-50 text-green-600"
                    trend={5}
                    subtext="vs yesterday"
                    onClick={() => navigate('/admin/dashboard?tab=users&filter=active_today')}
                />
                <StatCard
                    title="Monthly Active"
                    value={stats.monthly_active_users}
                    icon={Calendar}
                    color="bg-purple-50 text-purple-600"
                    trend={8}
                    subtext="vs last month"
                    onClick={() => navigate('/admin/dashboard?tab=users&filter=active_month')}
                />
                <StatCard
                    title="Total Courses"
                    value={stats.total_courses}
                    icon={BookOpen}
                    color="bg-orange-50 text-orange-600"
                    subtext="New course added today"
                    onClick={() => navigate('/admin/dashboard?tab=courses')}
                />
                <StatCard
                    title="Problems Solved"
                    value={stats.problems_solved}
                    icon={Trophy}
                    color="bg-yellow-50 text-yellow-600"
                    trend={150}
                    subtext="this week"
                    onClick={() => navigate('/admin/dashboard?tab=coding')}
                />
                <StatCard
                    title="Mentors Active"
                    value={stats.mentors_active}
                    icon={GraduationCap}
                    color="bg-pink-50 text-pink-600"
                    subtext="All slots booked"
                    onClick={() => navigate('/admin/dashboard?tab=mentorship')}
                />
                <StatCard
                    title="Projects Submitted"
                    value={stats.projects_submitted}
                    icon={FolderKanban}
                    color="bg-indigo-50 text-indigo-600"
                    subtext="3 pending review"
                    onClick={() => navigate('/admin/dashboard?tab=projects')}
                />
                <StatCard
                    title="Jobs Posted"
                    value={stats.jobs_posted}
                    icon={Briefcase}
                    color="bg-cyan-50 text-cyan-600"
                    subtext="2 closing soon"
                    onClick={() => navigate('/admin/dashboard?tab=jobs')}
                />
            </div>

            {/* --- Platform Growth & Activity --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 shadow-lg border-slate-100 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
                    <CardHeader className="pb-0">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <CardTitle className="text-xl font-bold text-slate-900">Platform Growth</CardTitle>
                                <CardDescription className="text-slate-500">
                                    {timeRange === 'day' && "Last 24 Hours (Hourly Data)"}
                                    {timeRange === 'week' && "Last 7 Days (Week View)"}
                                    {timeRange === 'month' && "Last 30 Days (Monthly View)"}
                                    {timeRange === 'year' && "Last 12 Months (Yearly View)"}
                                </CardDescription>
                                <div className="mt-4 flex items-baseline gap-3">
                                    <h2 className="text-4xl font-extrabold text-slate-900">{stats.total_users.toLocaleString()}</h2>
                                    <span className={`flex items-center gap-1 text-sm font-semibold px-2 py-1 rounded-full border ${growthRate >= 0 ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 'text-red-600 bg-red-50 border-red-100'}`}>
                                        <TrendingUp className={`h-3 w-3 ${growthRate < 0 ? 'rotate-180' : ''}`} />
                                        {growthRate > 0 ? '+' : ''}{growthRate}%
                                    </span>
                                    <span className="text-xs text-slate-400">
                                        {timeRange === 'day' && "vs previous 24 hours"}
                                        {timeRange === 'week' && "vs previous week"}
                                        {timeRange === 'month' && "vs previous 30 days"}
                                        {timeRange === 'year' && "vs previous year"}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 self-start md:self-center">
                                <Tabs value={timeRange} onValueChange={setTimeRange} className="w-auto">
                                    <TabsList className="grid w-full grid-cols-4 h-9 bg-slate-100 p-1 gap-1 rounded-lg">
                                        <TabsTrigger value="day" className="text-xs font-medium data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=inactive]:text-slate-600 data-[state=inactive]:hover:bg-slate-200 transition-all rounded px-3">Day</TabsTrigger>
                                        <TabsTrigger value="week" className="text-xs font-medium data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=inactive]:text-slate-600 data-[state=inactive]:hover:bg-slate-200 transition-all rounded px-3">Week</TabsTrigger>
                                        <TabsTrigger value="month" className="text-xs font-medium data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=inactive]:text-slate-600 data-[state=inactive]:hover:bg-slate-200 transition-all rounded px-3">Month</TabsTrigger>
                                        <TabsTrigger value="year" className="text-xs font-medium data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=inactive]:text-slate-600 data-[state=inactive]:hover:bg-slate-200 transition-all rounded px-3">Year</TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="px-2 sm:px-6 pb-6 pt-6">
                        <div className="h-[320px] w-full">
                            {growthData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart
                                        data={growthData}
                                        margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
                                        onClick={(e) => {
                                            if (e && e.activePayload && e.activePayload.length > 0) {
                                                const payload = e.activePayload[0].payload;
                                                setSelectedPoint(payload);
                                                setIsUserListOpen(true);
                                            }
                                        }}
                                        className="cursor-pointer"
                                    >
                                        <defs>
                                            <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} dy={10} />
                                        <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} tickCount={5} />
                                        <RechartsTooltip
                                            content={({ active, payload, label }) => {
                                                if (active && payload && payload.length) {
                                                    return (
                                                        <div className="bg-slate-800 border-none rounded-lg p-3 shadow-xl text-white">
                                                            <p className="text-xs text-slate-300 mb-1">
                                                                {timeRange === 'day' && `Users registered at ${label}`}
                                                                {timeRange === 'week' && `Users registered on ${label}`}
                                                                {timeRange === 'month' && `Users registered on ${label}`}
                                                                {timeRange === 'year' && `Users registered in ${label}`}
                                                            </p>
                                                            <p className="text-lg font-bold">
                                                                {payload[0].value} Users
                                                            </p>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            }}
                                            cursor={{ stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '4 4' }}
                                        />
                                        <Area type="monotone" dataKey="count" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorGrowth)" activeDot={{ r: 6, strokeWidth: 0, fill: '#4f46e5' }} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex h-full items-center justify-center flex-col gap-2 text-slate-400">
                                    <TrendingUp className="h-8 w-8 opacity-20" />
                                    <p>No growth data available</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white shadow-lg border-slate-100 flex flex-col h-full">
                    <CardHeader className="pb-4 border-b border-slate-50">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-lg font-bold text-slate-900">Live Activity</CardTitle>
                                <CardDescription>Real-time platform events</CardDescription>
                            </div>
                            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold border border-emerald-100 animate-pulse">
                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                LIVE
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0 flex-1 overflow-hidden">
                        <div className="h-[400px] overflow-y-auto custom-scrollbar p-4 space-y-5">
                            {activityFeed.length > 0 ? (
                                activityFeed.map((item, i) => (
                                    <div key={i} className="flex gap-3 group">
                                        <div className={`mt-1 h-8 w-8 rounded-lg flex items-center justify-center shrink-0 border shadow-sm transition-colors
                                        ${item.type === 'registration' ? 'bg-blue-50 border-blue-100 text-blue-600 group-hover:bg-blue-100 group-hover:border-blue-200' :
                                                item.type === 'feedback' ? 'bg-orange-50 border-orange-100 text-orange-600 group-hover:bg-orange-100 group-hover:border-orange-200' :
                                                    'bg-slate-50 border-slate-100 text-slate-600'
                                            }`}>
                                            {item.type === 'registration' && <UserCheck className="h-4 w-4" />}
                                            {item.type === 'feedback' && <MessageSquare className="h-4 w-4" />}
                                            {!['registration', 'feedback'].includes(item.type) && <Activity className="h-4 w-4" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-0.5">
                                                <p className="text-sm font-semibold text-slate-800 truncate pr-2 group-hover:text-indigo-600 transition-colors">
                                                    {item.type === 'registration' ? 'New User' :
                                                        item.type === 'feedback' ? 'Feedback' : 'Activity'}
                                                </p>
                                                <span className="text-[10px] text-slate-400 font-mono whitespace-nowrap">
                                                    {new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-600 line-clamp-1">{item.message}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-slate-400 py-8">
                                    <Activity className="h-8 w-8 mb-2 opacity-20" />
                                    <p className="text-sm">No recent activity</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Drill Down Modal */}
            <Dialog open={isUserListOpen} onOpenChange={setIsUserListOpen}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
                    <DialogHeader>
                        <DialogTitle>User Registration Details</DialogTitle>
                        <DialogDescription>
                            Users registered on {selectedPoint?.date} ({selectedPoint?.count} users)
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto mt-4 pr-2 custom-scrollbar">
                        {selectedPoint?.users && selectedPoint.users.length > 0 ? (
                            <div className="space-y-3">
                                {selectedPoint.users.map((u: any, i: number) => (
                                    <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-sm">
                                                {u.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-900">{u.name}</p>
                                                <p className="text-xs text-slate-500">{u.email}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <Badge variant={u.status === 'Active' ? 'default' : 'secondary'} className={u.status === 'Active' ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-slate-100 text-slate-700'}>
                                                {u.status || 'Active'}
                                            </Badge>
                                            <p className="text-xs text-slate-400 mt-1">
                                                {new Date(u.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-40 text-slate-400">
                                <Users className="h-10 w-10 mb-2 opacity-20" />
                                <p>No detailed records found for this period.</p>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div >
    );
}
