import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    ArrowLeft,
    Clock,
    BookOpen,
    Calendar,
    BarChart3,
    TrendingUp,
    Award
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import FeatureGuard from "@/components/FeatureGuard";

export default function LearningAnalytics() {
    const navigate = useNavigate();

    // Mock data - in a real app this would come from an API/Context
    const analyticsData = {
        totalHours: 5,
        totalMinutes: 30,
        coursesStarted: 2,
        coursesCompleted: 4,
        streak: 2,
        weeklyActivity: [45, 30, 60, 0, 90, 45, 30], // Minutes per day
        courseBreakdown: [
            { title: 'React.js Complete Guide', timeSpent: 120, progress: 30, lastActive: '2024-12-31' },
            { title: 'Node.js & Express Masterclass', timeSpent: 330, progress: 100, lastActive: '2024-12-30' },
            { title: 'Machine Learning Fundamentals', timeSpent: 0, progress: 0, lastActive: null },
        ]
    };

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    return (
        <FeatureGuard feature="dashboard">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in mb-20">

                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Learning Analytics</h1>
                        <p className="text-muted-foreground">Track your progress and study habits</p>
                    </div>
                </div>

                {/* Overview Cards */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Study Time</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{analyticsData.totalHours}h {analyticsData.totalMinutes}m</div>
                            <p className="text-xs text-muted-foreground">+12% from last week</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Streak</CardTitle>
                            <TrendingUp className="h-4 w-4 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{analyticsData.streak} Days</div>
                            <p className="text-xs text-muted-foreground">Keep it up!</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Courses Completed</CardTitle>
                            <Award className="h-4 w-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{analyticsData.coursesCompleted}</div>
                            <p className="text-xs text-muted-foreground">Top 10% of learners</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Lessons Learned</CardTitle>
                            <BookOpen className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">48</div>
                            <p className="text-xs text-muted-foreground">Across {analyticsData.coursesStarted + analyticsData.coursesCompleted} courses</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts & Breakdown */}
                <div className="grid gap-8 md:grid-cols-2">

                    {/* Daily Activity Chart (Mock) */}
                    <Card className="col-span-1">
                        <CardHeader>
                            <CardTitle>Daily Learning Activity</CardTitle>
                            <CardDescription>Time spent learning over the last 7 days</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[200px] flex items-end justify-between gap-2 pt-4">
                                {analyticsData.weeklyActivity.map((minutes, i) => (
                                    <div key={i} className="flex flex-col items-center gap-2 w-full">
                                        <div
                                            className="w-full bg-primary/20 hover:bg-primary/40 transition-all rounded-t-md relative group"
                                            style={{ height: `${Math.max(minutes, 10)}%` }} // Scaling for demo
                                        >
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                                {minutes}m
                                            </div>
                                        </div>
                                        <span className="text-xs text-muted-foreground">{days[i]}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Course Breakdown */}
                    <Card className="col-span-1">
                        <CardHeader>
                            <CardTitle>Course Progress Breakdown</CardTitle>
                            <CardDescription>Detailed look at your active courses</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {analyticsData.courseBreakdown.map((course, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between items-center text-sm">
                                        <div className="font-medium">{course.title}</div>
                                        <div className="text-muted-foreground">
                                            {course.timeSpent > 0 ? `${Math.floor(course.timeSpent / 60)}h ${course.timeSpent % 60}m` : 'Not started'}
                                        </div>
                                    </div>
                                    <Progress value={course.progress} className="h-2" />
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>{course.progress}% Complete</span>
                                        {course.lastActive && <span>Last active: {course.lastActive}</span>}
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </FeatureGuard>
    );
}
