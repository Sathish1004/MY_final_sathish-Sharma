
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    ArrowRight
} from 'lucide-react';

export default function SharedProgress() {
    const { token } = useParams();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/share/${token}`);
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
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (error || !data) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <h1 className="text-2xl font-bold mb-2">Link Expired or Invalid</h1>
                <p className="text-muted-foreground">This shared progress link is no longer available.</p>
                <Button className="mt-4" onClick={() => window.location.href = '/'}>
                    Go to Prolync
                </Button>
            </div>
        );
    }

    const { student_name, config, data: stats } = data;

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <header className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border">
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white text-2xl font-bold shadow-md">
                            {student_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">{student_name}'s Knowledge Profile</h1>
                            <p className="text-slate-500">Shared via Prolync Student Workspace</p>
                        </div>
                    </div>
                    <Button variant="outline" onClick={() => window.open('https://prolync.in', '_blank')}>
                        Join {student_name} on Prolync
                    </Button>
                </header>

                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {(config.overview || config.courses) && stats.active_courses !== undefined && (
                        <Card className="bg-white/80 backdrop-blur">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-slate-500 mb-2">Active Courses</p>
                                        <p className="text-3xl font-bold text-slate-900">{stats.active_courses}</p>
                                    </div>
                                    <div className="h-12 w-12 rounded-xl bg-blue-100/50 flex items-center justify-center">
                                        <BookOpen className="h-6 w-6 text-blue-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {config.projects && stats.completed_projects !== undefined && (
                        <Card className="bg-white/80 backdrop-blur">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-slate-500 mb-2">Completed Projects</p>
                                        <p className="text-3xl font-bold text-slate-900">{stats.completed_projects}</p>
                                    </div>
                                    <div className="h-12 w-12 rounded-xl bg-purple-100/50 flex items-center justify-center">
                                        <FolderKanban className="h-6 w-6 text-purple-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {config.mentorship && stats.mentor_sessions !== undefined && (
                        <Card className="bg-white/80 backdrop-blur">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-slate-500 mb-2">Mentor Sessions</p>
                                        <p className="text-3xl font-bold text-slate-900">{stats.mentor_sessions}</p>
                                    </div>
                                    <div className="h-12 w-12 rounded-xl bg-green-100/50 flex items-center justify-center">
                                        <Users className="h-6 w-6 text-green-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {config.jobs && stats.job_applications !== undefined && (
                        <Card className="bg-white/80 backdrop-blur">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-slate-500 mb-2">Job Applications</p>
                                        <p className="text-3xl font-bold text-slate-900">{stats.job_applications}</p>
                                    </div>
                                    <div className="h-12 w-12 rounded-xl bg-amber-100/50 flex items-center justify-center">
                                        <Briefcase className="h-6 w-6 text-amber-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Learning Paths */}
                {config.learning_paths && stats.learning_paths && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-slate-900">Learning Paths</h2>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            {stats.learning_paths.map((path: any, index: number) => (
                                <Card key={index} className="bg-white/80 backdrop-blur hover:shadow-md transition-shadow">
                                    <CardContent className="pt-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${path.color} flex items-center justify-center shadow-sm`}>
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

                {/* Upcoming Events (Optional) */}
                {config.events && stats.upcoming_events && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-slate-900">Registered Events</h2>
                        <div className="grid gap-4 md:grid-cols-2">
                            {stats.upcoming_events.map((event: any, index: number) => (
                                <Card key={index} className="bg-white/80 backdrop-blur">
                                    <CardContent className="p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-full bg-indigo-100/50 flex items-center justify-center text-indigo-600">
                                                <Calendar className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-slate-900">{event.title}</h3>
                                                <p className="text-sm text-slate-500">{event.date}</p>
                                            </div>
                                        </div>
                                        <Badge>{event.type}</Badge>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="text-center pt-8 border-t">
                    <p className="text-slate-500 text-sm">
                        &copy; 2025 Prolync Student Workspace. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}
