import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  BookOpen, Code2, Briefcase, Users,
  Clock, CheckCircle2, PlayCircle, Award, ArrowRight, Activity, Calendar, Lock, Play
} from 'lucide-react';
import FeatureGuard from "@/components/FeatureGuard";

// Course Metadata (Consistent with Courses.tsx)
const COURSES_METADATA = [
  { id: 1, title: 'React.js Complete Guide', category: 'Frontend', totalVideos: 10 },
  { id: 2, title: 'Node.js & Express Masterclass', category: 'Backend', totalVideos: 10 },
  { id: 3, title: 'Machine Learning Fundamentals', category: 'AI/ML', totalVideos: 10 },
  { id: 4, title: 'Full Stack Web Development', category: 'Frontend', totalVideos: 10 },
  { id: 5, title: 'Aptitude & Logical Reasoning', category: 'Aptitude', totalVideos: 12 },
  { id: 6, title: 'Data Structures Basics', category: 'Core Subjects', totalVideos: 10 },
];

interface ActivityLog {
  type: 'VIDEO_WATCHED' | 'COURSE_COMPLETED';
  detail: string;
  courseName: string;
  timestamp: string;
}

// Standardized Module Generator (Consistent with CourseDetails.tsx)
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

  return standardTitles.map((title, i) => ({
    id: i + 1,
    title: `Module ${i + 1}: ${title}`,
    duration: '10 min',
  }));
};

export default function Dashboard() {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] || 'Student';

  // Dashboard State
  const [stats, setStats] = useState({
    enrolled: 0,
    inProgress: 0,
    completed: 0,
    totalMinutes: 0,
    certificates: 0
  });
  const [activeCourses, setActiveCourses] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<ActivityLog[]>([]);
  const [completedCourses, setCompletedCourses] = useState<any[]>([]);

  useEffect(() => {
    // 1. Calculate Stats & Identify Active Courses
    let totalEnrolled = 0;
    let totalInProgress = 0;
    let totalCompleted = 0;
    let minutes = 0;
    const activeList: any[] = [];
    const completedList: any[] = [];

    COURSES_METADATA.forEach(course => {
      const savedData = localStorage.getItem(`course_progress_${course.id}_v2`);
      if (savedData) {
        const data = JSON.parse(savedData);
        const progress = data.progress || 0;
        const status = data.status || 'Not Started';
        const courseMinutes = data.minutesConsumed || 0;

        if (progress > 0 || status === 'In Progress' || status === 'Completed') {
          totalEnrolled++;
          if (status === 'Completed') {
            totalCompleted++;
            completedList.push({ ...course, ...data });
          } else {
            totalInProgress++;
            activeList.push({ ...course, ...data });
          }
        }
        minutes += courseMinutes;
      }
    });

    setStats({
      enrolled: totalEnrolled,
      inProgress: totalInProgress,
      completed: totalCompleted,
      totalMinutes: minutes,
      certificates: totalCompleted // Assuming 1 cert per completed course
    });
    // Sort active courses by last updated desc
    activeList.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());

    setActiveCourses(activeList);
    setCompletedCourses(completedList);

    // 2. Load Activity Log
    const logs = JSON.parse(localStorage.getItem('user_activity_log') || '[]');
    setRecentActivity(logs);

  }, []);

  const mostRecentCourse = activeCourses[0];
  const recentModules = mostRecentCourse ? generateModules(mostRecentCourse.title, mostRecentCourse.category) : [];

  return (
    <FeatureGuard feature="dashboard">
      <div className="space-y-8 animate-fade-in bg-gradient-to-br from-background via-background to-primary/5 min-h-screen pb-20">

        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg ring-4 ring-primary/20">
                <span className="text-2xl font-bold text-primary-foreground">
                  {firstName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                  Welcome back, {firstName}!
                </h1>
                <p className="text-muted-foreground mt-1">
                  Your personalized learning command center
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* TOP SUMMARY CARDS */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="card-hover border-border/50 shadow-sm hover:shadow-lg transition-all bg-card/50 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Courses</p>
                  <p className="text-2xl font-bold">{stats.inProgress}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <BookOpen className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="card-hover border-border/50 shadow-sm hover:shadow-lg transition-all bg-card/50 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">{stats.completed}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="card-hover border-border/50 shadow-sm hover:shadow-lg transition-all bg-card/50 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Learning Time</p>
                  <p className="text-2xl font-bold">{stats.totalMinutes} <span className="text-sm font-normal text-muted-foreground">min</span></p>
                </div>
                <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
                  <Clock className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="card-hover border-border/50 shadow-sm hover:shadow-lg transition-all bg-card/50 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Certificates</p>
                  <p className="text-2xl font-bold">{stats.certificates}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500">
                  <Award className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* LEFT COLUMN (2/3 width) */}
          <div className="lg:col-span-2 space-y-8">

            {/* SECTION 1: CURRENTLY LEARNING (HERO) */}
            {mostRecentCourse && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <PlayCircle className="text-primary h-5 w-5" />
                  <h2 className="text-xl font-bold">Currently Learning</h2>
                </div>
                <Card className="border-primary/20 shadow-md bg-gradient-to-br from-card to-primary/5">
                  <CardContent className="p-6 space-y-6">
                    <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                      <div className="space-y-2">
                        <Badge variant="outline" className="text-primary border-primary/30">{mostRecentCourse.category}</Badge>
                        <h3 className="text-2xl font-bold">{mostRecentCourse.title}</h3>
                        <p className="text-muted-foreground">
                          {mostRecentCourse.minutesConsumed} min watched total • Last active {mostRecentCourse.lastUpdated ? new Date(mostRecentCourse.lastUpdated).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                      <div className="w-full md:w-auto flex flex-col items-end gap-3 min-w-[200px]">
                        <div className="w-full flex justify-between text-sm mb-1">
                          <span className="font-medium">Progress</span>
                          <span>{mostRecentCourse.progress}%</span>
                        </div>
                        <Progress value={mostRecentCourse.progress} className="h-3 w-full" />
                        <Button className="w-full mt-2" size="lg" asChild>
                          <Link to={`/courses/${mostRecentCourse.id}`}>Resume Learning</Link>
                        </Button>
                      </div>
                    </div>

                    {/* HORIZONTAL MODULE STEPPER */}
                    <div className="pt-4 border-t border-primary/10">
                      <p className="text-sm font-semibold mb-3">Course Modules</p>
                      <ScrollArea className="w-full whitespace-nowrap pb-2">
                        <div className="flex gap-4">
                          {recentModules.map((module, i) => {
                            // Determine status
                            const isCompleted = mostRecentCourse.completed?.includes(module.id);
                            let isCurrent = false;
                            // A module is current if it's the next one after the last completed, OR if it's the very first one and nothing is completed
                            if (!isCompleted) {
                              // If this is the *first* uncompleted module, it's current
                              const firstUncompletedId = recentModules.find(m => !mostRecentCourse.completed?.includes(m.id))?.id;
                              if (module.id === firstUncompletedId) isCurrent = true;
                            }
                            const isLocked = !isCompleted && !isCurrent;

                            return (
                              <Link
                                key={module.id}
                                to={`/courses/${mostRecentCourse.id}`}
                                state={{ moduleIndex: i }}
                                className={`flex flex-col gap-2 w-[140px] shrink-0 p-3 rounded-lg border transition-all cursor-pointer hover:shadow-md
                                            ${isCurrent ? 'bg-background border-primary shadow-sm ring-1 ring-primary/20' :
                                    isCompleted ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800' :
                                      'bg-muted/30 border-transparent opacity-70 hover:opacity-100'}`}
                              >

                                <div className="flex justify-between items-start">
                                  <Badge variant="outline" className={`text-[10px] h-5 ${isCurrent ? 'border-primary/30 text-primary' : 'border-muted-foreground/30 text-muted-foreground'}`}>
                                    {String(i + 1).padStart(2, '0')}
                                  </Badge>
                                  {isCompleted ? (
                                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                  ) : isCurrent ? (
                                    <PlayCircle className="h-4 w-4 text-primary animate-pulse" />
                                  ) : (
                                    <Lock className="h-3 w-3 text-muted-foreground/50" />
                                  )}
                                </div>

                                <p className={`text-xs font-medium leading-tight whitespace-normal line-clamp-2 min-h-[2.5em]
                                                ${isCurrent ? 'text-foreground' : 'text-muted-foreground'}`}>
                                  {module.title.split(': ')[1] || module.title}
                                </p>
                              </Link>
                            );
                          })}
                        </div>
                        <ScrollBar orientation="horizontal" />
                      </ScrollArea>
                    </div>

                  </CardContent>
                </Card>
              </div>
            )}




          </div>

          {/* RIGHT COLUMN (1/3 width) */}
          <div className="space-y-8">

            {/* SECTION 4: LEARNING ACTIVITY LOG */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Activity className="text-primary h-5 w-5" />
                <h2 className="text-xl font-bold">Learning Activity</h2>
              </div>
              <Card className="h-[400px] overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Recent Timeline</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-[340px] overflow-y-auto p-4 space-y-4">
                    {recentActivity.length > 0 ? (
                      recentActivity.map((log, i) => (
                        <div key={i} className="flex gap-3 relative pb-4 border-l pl-4 border-border last:border-0">
                          <div className={`absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full ${log.type === 'COURSE_COMPLETED' ? 'bg-green-500' : 'bg-blue-500'}`} />
                          <div>
                            <p className="text-sm font-medium leading-none">{log.detail}</p>
                            <p className="text-xs text-muted-foreground mt-1">{log.courseName}</p>
                            <p className="text-[10px] text-muted-foreground mt-1 tabular-nums">
                              {new Date(log.timestamp).toLocaleString(undefined, {
                                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-center text-muted-foreground py-8">No activity recorded yet.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>



          </div>
        </div>

      </div>
    </FeatureGuard>
  );
}
