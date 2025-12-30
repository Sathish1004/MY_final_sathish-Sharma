import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Code, BookOpen, GraduationCap, FolderKanban, Briefcase,
    Users, MessageSquare, ArrowRight, ExternalLink, Calendar,
    CheckCircle2, Clock
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface QuickAccessDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    module: string | null;
    data: any; // Using any for flexibility with the complex dashboard data structure
}

export default function QuickAccessDrawer({ isOpen, onClose, module, data }: QuickAccessDrawerProps) {
    if (!module) return null;

    const renderContent = () => {
        switch (module) {
            case "coding":
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <Card className="bg-slate-50 border-slate-100">
                                <CardContent className="p-4 text-center">
                                    <p className="text-sm text-slate-500 mb-1">Top Coder</p>
                                    <p className="font-bold text-slate-900 truncate">
                                        {data.topCoders?.[0]?.name || "N/A"}
                                    </p>
                                    <Badge variant="secondary" className="mt-2 text-xs">Rank #1</Badge>
                                </CardContent>
                            </Card>
                            <Card className="bg-slate-50 border-slate-100">
                                <CardContent className="p-4 text-center">
                                    <p className="text-sm text-slate-500 mb-1">Total Solved</p>
                                    <p className="font-bold text-2xl text-slate-900">
                                        {data.stats?.problems_solved || 0}
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                                <Code className="h-4 w-4" /> Recent Activity
                            </h3>
                            <div className="bg-white rounded-xl border shadow-sm divide-y">
                                {data.topCoders?.slice(0, 5).map((coder: any, i: number) => (
                                    <div key={i} className="p-3 flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                                                {coder.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-900">{coder.name}</p>
                                                <p className="text-xs text-slate-500">{coder.solved} problems solved</p>
                                            </div>
                                        </div>
                                        <Badge variant="outline" className="text-xs">{coder.percent}%</Badge>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case "courses":
                return (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between bg-blue-50 p-4 rounded-xl text-blue-900 mb-6">
                            <div>
                                <p className="text-sm font-medium opacity-80">Total Active Courses</p>
                                <h3 className="text-3xl font-bold">{data.stats?.total_courses || 0}</h3>
                            </div>
                            <BookOpen className="h-8 w-8 opacity-20" />
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-slate-900 mb-3">Popular Courses</h3>
                            <div className="space-y-3">
                                {data.courseStats?.top_courses?.map((course: any, i: number) => (
                                    <div key={i} className="bg-white p-3 rounded-lg border flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded bg-indigo-50 flex items-center justify-center text-indigo-600">
                                                <BookOpen className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-900">{course.name}</p>
                                                <p className="text-xs text-slate-500">{course.students} students enrolled</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-bold text-green-600">{course.progress}% Avg</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case "mentorship":
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-purple-50 p-4 rounded-xl text-purple-900">
                                <p className="text-xs font-bold uppercase tracking-wider opacity-70">Active Mentors</p>
                                <p className="text-2xl font-bold mt-1">{data.mentorshipStats?.active_mentors || 0}</p>
                            </div>
                            <div className="bg-orange-50 p-4 rounded-xl text-orange-900">
                                <p className="text-xs font-bold uppercase tracking-wider opacity-70">Sessions</p>
                                <p className="text-2xl font-bold mt-1">{data.mentorshipStats?.total_sessions || 0}</p>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                                <Calendar className="h-4 w-4" /> Upcoming Sessions
                            </h3>
                            {data.mentorshipStats?.upcoming_sessions?.length > 0 ? (
                                <div className="space-y-3">
                                    {data.mentorshipStats.upcoming_sessions.map((session: any, i: number) => (
                                        <div key={i} className="bg-white border rounded-xl p-3 shadow-sm">
                                            <div className="flex justify-between items-start mb-2">
                                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                                    {session.status}
                                                </Badge>
                                                <span className="text-xs text-slate-400">{session.time}</span>
                                            </div>
                                            <p className="font-medium text-slate-900 text-sm mb-1">{session.name}</p>
                                            <p className="text-xs text-slate-500 flex items-center gap-1">
                                                with <span className="font-semibold text-slate-700">{session.mentor}</span>
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-slate-500 italic p-4 text-center bg-slate-50 rounded-lg">No upcoming sessions.</p>
                            )}
                        </div>
                    </div>
                );

            case "projects":
                return (
                    <div className="space-y-6">
                        <div className="flex gap-4 overflow-x-auto pb-2">
                            <div className="min-w-[120px] bg-white border p-3 rounded-lg shadow-sm">
                                <p className="text-xs text-slate-500">Pending</p>
                                <p className="text-xl font-bold text-orange-600">{data.projectStats?.pending || 0}</p>
                            </div>
                            <div className="min-w-[120px] bg-white border p-3 rounded-lg shadow-sm">
                                <p className="text-xs text-slate-500">Approved</p>
                                <p className="text-xl font-bold text-green-600">{data.projectStats?.approved || 0}</p>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                                <FolderKanban className="h-4 w-4" /> Recent Submissions
                            </h3>
                            <div className="divide-y border rounded-xl bg-white overflow-hidden">
                                {data.projectStats?.recent?.map((project: any, i: number) => (
                                    <div key={i} className="p-3 hover:bg-slate-50 transition-colors">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-sm font-medium text-slate-900">{project.title}</p>
                                                <p className="text-xs text-slate-500">by {project.student}</p>
                                            </div>
                                            <Badge className={
                                                project.status === 'Approved' ? 'bg-green-100 text-green-700 hover:bg-green-200' :
                                                    project.status === 'Pending' ? 'bg-orange-100 text-orange-700 hover:bg-orange-200' :
                                                        'bg-red-100 text-red-700 hover:bg-red-200'
                                            } variant="secondary">
                                                {project.status}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case "jobs":
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-900 text-white p-4 rounded-xl">
                                <p className="text-xs opacity-70 uppercase">Active Jobs</p>
                                <p className="text-3xl font-bold mt-1">{data.jobStats?.active || 0}</p>
                            </div>
                            <div className="bg-white border p-4 rounded-xl shadow-sm">
                                <p className="text-xs text-slate-500 uppercase">Total Applications</p>
                                <p className="text-3xl font-bold text-slate-900 mt-1">{data.jobStats?.applications || 0}</p>
                            </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
                            <div className="flex items-center gap-3 mb-2">
                                <Users className="h-5 w-5 text-blue-600" />
                                <h3 className="font-semibold text-blue-900">Placements</h3>
                            </div>
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-2xl font-bold text-blue-900">{data.jobStats?.placed || 0}</p>
                                    <p className="text-xs text-blue-600">Students Hired</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-blue-900">{data.jobStats?.interviews || 0}</p>
                                    <p className="text-xs text-blue-600">Interviews Scheduled</p>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            /* Fallback for other modules not fully detailed in stats */
            default:
                return (
                    <div className="flex flex-col items-center justify-center h-40 text-slate-400">
                        <FolderKanban className="h-10 w-10 mb-2 opacity-20" />
                        <p className="text-sm">Quick access details coming soon for {module}</p>
                    </div>
                );
        }
    };

    const getTitle = () => {
        switch (module) {
            case "coding": return "Coding Platform";
            case "courses": return "Courses & Learning";
            case "mentorship": return "Mentorship Program";
            case "projects": return "Project Management";
            case "jobs": return "Jobs & Placements";
            case "users": return "User Management";
            case "feedback": return "Feedback";
            default: return "Quick Access";
        }
    };

    const getIcon = () => {
        switch (module) {
            case "coding": return <Code className="h-5 w-5" />;
            case "courses": return <BookOpen className="h-5 w-5" />;
            case "mentorship": return <GraduationCap className="h-5 w-5" />;
            case "projects": return <FolderKanban className="h-5 w-5" />;
            case "jobs": return <Briefcase className="h-5 w-5" />;
            case "users": return <Users className="h-5 w-5" />;
            case "feedback": return <MessageSquare className="h-5 w-5" />;
            default: return null;
        }
    }

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent side="right" className="w-[400px] sm:w-[450px] p-0 border-l border-slate-200 shadow-2xl">
                <SheetHeader className="px-6 py-5 border-b bg-white">
                    <div className="flex items-center gap-3 text-slate-800">
                        <div className="p-2 bg-slate-100 rounded-lg">
                            {getIcon()}
                        </div>
                        <div>
                            <SheetTitle className="text-lg">{getTitle()}</SheetTitle>
                            <SheetDescription className="text-xs">Quick Overview</SheetDescription>
                        </div>
                    </div>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-85px)]">
                    <div className="p-6">
                        {renderContent()}
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
}
