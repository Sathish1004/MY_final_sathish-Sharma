import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '@/services/api';
import { ActivityCalendar } from '@/components/dashboard/ActivityCalendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Clock, PlayCircle, CheckCircle2, Flame, Award, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";

interface StudentStats {
    totalMinutes: number;
    streak: number;
    maxStreak: number;
    completedCourses: number;
    activeCourses: number;
    notStartedCourses: number;
    lastActive: string | null;
}

export default function AdminStudentView() {
    const { userId } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [stats, setStats] = useState<StudentStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [studentName, setStudentName] = useState("Student");

    useEffect(() => {
        if (userId) {
            fetchData();
        }
    }, [userId]);

    const fetchData = async () => {
        try {
            setLoading(true);
            // 1. Fetch Stats
            const statsRes = await api.get(`/admin/users/${userId}/stats`);
            setStats(statsRes.data);

            // 2. Fetch User Profile for Name
            const userRes = await api.get(`/admin/users/${userId}`);
            setStudentName(userRes.data.user.name);

        } catch (error) {
            console.error("Failed to fetch student data:", error);
            toast({ title: "Error", description: "Could not load student data.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-center">Loading student data...</div>;
    }

    if (!stats) {
        return <div className="p-8 text-center">Student data not found.</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8 space-y-8 bg-slate-50/50 min-h-screen">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Student Dashboard View</h1>
                    <p className="text-slate-500">Viewing data for <span className="font-semibold text-slate-900">{studentName}</span></p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Current Streak</p>
                            <div className="flex items-baseline gap-2">
                                <p className="text-3xl font-bold text-amber-500">{stats.streak}</p>
                                <span className="text-xs text-slate-400">Max: {stats.maxStreak}</span>
                            </div>
                        </div>
                        <div className="h-10 w-10 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center">
                            <Flame className="h-5 w-5" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Total Learning Time</p>
                            <p className="text-2xl font-bold text-slate-900">
                                {Math.floor(stats.totalMinutes / 60)}<span className="text-sm text-slate-400 font-normal mx-1">h</span>
                                {stats.totalMinutes % 60}<span className="text-sm text-slate-400 font-normal mx-1">m</span>
                            </p>
                        </div>
                        <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                            <Clock className="h-5 w-5" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Completed Courses</p>
                            <p className="text-3xl font-bold text-slate-900">{stats.completedCourses}</p>
                        </div>
                        <div className="h-10 w-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
                            <CheckCircle2 className="h-5 w-5" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Active Courses</p>
                            <p className="text-3xl font-bold text-slate-900">{stats.activeCourses}</p>
                        </div>
                        <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                            <BookOpen className="h-5 w-5" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Statistics & Activity Calendar */}
                <div className="lg:col-span-2 space-y-8">
                    <section className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-1 bg-amber-500 rounded-full" />
                            <h2 className="text-xl font-bold text-slate-800">Learning Activity Calendar</h2>
                        </div>
                        <ActivityCalendar userId={Number(userId)} className="min-h-[400px]" />
                    </section>
                </div>

                {/* Right Column: Additional Info? */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Quick Stats</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center py-2 border-b">
                                <span className="text-slate-500">Last Active</span>
                                <span className="font-medium">{stats.lastActive ? new Date(stats.lastActive).toLocaleDateString() : 'Never'}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b">
                                <span className="text-slate-500">Not Started</span>
                                <span className="font-medium">{stats.notStartedCourses}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
