import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    BookOpen,
    FolderKanban,
    Users,
    Briefcase,
    TrendingUp,
    TrendingDown,
    Code2,
    Calendar,
    PenSquare,
    CheckCircle2,
    ArrowRight,
    Flame,
    Clock,
    Award,
    Lock
} from 'lucide-react';

export default function SharedProgress() {
    const { token } = useParams();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL} /api/share / ${token} `);
                if (response.ok) {
                    const result = await response.json();
                    setData(result);
                } else {
                    setError(true);
                }
            } catch (err) {
                console.error(err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchData();
        }
    }, [token]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-slate-50">Loading profile...</div>;
    }

    if (error || !data) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50">
                <div className="text-center space-y-4">
                    <div className="bg-red-100 p-4 rounded-full inline-flex">
                        <Lock className="h-8 w-8 text-red-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">Profile Not Available</h1>
                    <p className="text-slate-500">This shared link may have expired or is invalid.</p>
                    <Button onClick={() => window.location.href = '/'}>
                        Go Home
                    </Button>
                </div>
            </div>
        );
    }

    const { student_name, config, data: stats } = data;

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <header className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-6">
                        <div className="h-20 w-20 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg ring-4 ring-slate-50">
                            {student_name.charAt(0).toUpperCase()}
                        </div>
                        <div className="text-center md:text-left">
                            <h1 className="text-3xl font-bold text-slate-900">{student_name}</h1>
                            <p className="text-slate-500 font-medium">Learning Profile • Prolync Student</p>
                        </div>
                    </div>
                    <Button onClick={() => window.open('/', '_blank')} className="bg-slate-900 text-white hover:bg-slate-800">
                        View Prolync
                    </Button>
                </header>

                {/* Stats Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {(config.overview || config.courses) && (
                        <>
                            <Card className="bg-white border-slate-100 shadow-sm hover:shadow-md transition-all">
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-slate-500 mb-1">Active Courses</p>
                                            <p className="text-3xl font-bold text-slate-900">{stats.active_courses || 0}</p>
                                        </div>
                                        <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center">
                                            <BookOpen className="h-6 w-6 text-blue-600" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-white border-slate-100 shadow-sm hover:shadow-md transition-all">
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-slate-500 mb-1">Completed</p>
                                            <p className="text-3xl font-bold text-slate-900">{stats.completed_courses || 0}</p>
                                        </div>
                                        <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                                            <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    )}

                    <Card className="bg-white border-slate-100 shadow-sm hover:shadow-md transition-all">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500 mb-1">Current Streak</p>
                                    <p className="text-3xl font-bold text-slate-900">{stats.learning_streak || 0}<span className="text-sm text-slate-400 font-normal ml-1">days</span></p>
                                </div>
                                <div className="h-12 w-12 rounded-xl bg-amber-50 flex items-center justify-center">
                                    <Flame className="h-6 w-6 text-amber-500" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white border-slate-100 shadow-sm hover:shadow-md transition-all">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500 mb-1">Learning Time</p>
                                    <p className="text-2xl font-bold text-slate-900">
                                        {Math.floor((stats.total_learning_time || 0) / 60)}h {(stats.total_learning_time || 0) % 60}m
                                    </p>
                                </div>
                                <div className="h-12 w-12 rounded-xl bg-purple-50 flex items-center justify-center">
                                    <Clock className="h-6 w-6 text-purple-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Achievements / Completed Courses */}
                {stats.completed_courses_list && stats.completed_courses_list.length > 0 && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <Award className="h-5 w-5 text-amber-500" /> Achievements
                        </h2>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {stats.completed_courses_list.map((course: any, index: number) => (
                                <Card key={index} className="bg-white border-slate-100 hover:shadow-md transition-all">
                                    <CardContent className="p-4 flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-slate-900 line-clamp-1">{course.title}</h3>
                                            <p className="text-xs text-slate-500">Completed on {new Date(course.date).toLocaleDateString()}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* Learning Paths (Optional/Mock for now) */}
                {config.learning_paths && stats.learning_paths && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-slate-900">Learning Paths</h2>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            {stats.learning_paths.map((path: any, index: number) => (
                                <Card key={index} className="bg-white border-slate-100 hover:shadow-md transition-all">
                                    <CardContent className="pt-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className={`h - 10 w - 10 rounded - lg bg - gradient - to - br ${path.color || 'from-blue-500 to-cyan-500'} flex items - center justify - center shadow - sm`}>
                                                <Code2 className="h-5 w-5 text-white" />
                                            </div>
                                            <Badge variant="secondary" className="text-xs">
                                                {path.courses} courses
                                            </Badge>
                                        </div>
                                        <h3 className="font-semibold text-slate-900 mb-2">{path.title}</h3>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-slate-500">Progress</span>
                                                <span className="text-sm font-semibold">{path.progress}%</span>
                                            </div>
                                            <Progress value={path.progress} className="h-2" />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="text-center pt-12 pb-8 border-t border-slate-100">
                    <p className="text-slate-400 text-sm">
                        &copy; {new Date().getFullYear()} Prolync Student Workspace. Verified Profile.
                    </p>
                </div>
            </div>
        </div>
    );
}
