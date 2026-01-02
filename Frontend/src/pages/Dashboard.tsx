import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCourse } from '@/contexts/CourseContext';
import {
  BookOpen, Activity, PlayCircle, CheckCircle2, Clock, Calendar, ArrowRight, Zap,
  Award, Lock, Share2, Copy, Check, Flame
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from "@/components/ui/use-toast";
import FeatureGuard from "@/components/FeatureGuard";
import { StreakCalendar } from '@/components/dashboard/StreakCalendar';
import { ActivityCalendar } from '@/components/dashboard/ActivityCalendar';
import CertificateModal from '@/components/CertificateModal';

// Mock generator for modules (restoring this utility)
const generateModules = (courseTitle: string) => {
  const structure = [
    { title: 'Module 01: Introduction', duration: '10 min' },
    { title: 'Module 02: Core Concepts', duration: '15 min' },
    { title: 'Module 03: Practical Example', duration: '20 min' },
    { title: 'Module 04: Intermediate Concepts', duration: '15 min' },
    { title: 'Module 05: Hands-on Demo', duration: '20 min' },
    { title: 'Module 06: Problem Solving', duration: '25 min' },
    { title: 'Module 07: Advanced Topic', duration: '30 min' },
    { title: 'Module 08: Real-world Use Case', duration: '20 min' },
  ];
  return structure.map((item, i) => ({
    id: i + 1,
    title: item.title,
    duration: item.duration,
  }));
};

export default function Dashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { courses, progressMap, activityLogs, stats } = useCourse();
  const firstName = user?.name?.split(' ')[0] || 'Student';

  // --- Logic for Sections ---
  const courseList = courses.map(c => {
    const p = progressMap[c.id];
    return {
      ...c,
      progress: p?.progress || 0,
      status: p?.status || 'Not Started',
      lastAccessedAt: p?.lastAccessedAt || null,
      minutesConsumed: p?.minutesConsumed || 0,
      completedModules: p?.completedModules || []
    };
  });

  const activeCourses = courseList.filter(c => c.status === 'In Progress' || c.status === 'Completed')
    .sort((a, b) => new Date(b.lastAccessedAt || 0).getTime() - new Date(a.lastAccessedAt || 0).getTime());

  const completedCourses = courseList.filter(c => c.status === 'Completed');
  const mostRecentCourse = activeCourses[0];
  const recentModules = mostRecentCourse ? generateModules(mostRecentCourse.title) : [];

  // Certificate Modal State
  const [showCertModal, setShowCertModal] = useState(false);
  const [selectedCert, setSelectedCert] = useState<any>(null);

  // Sharing State
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const handleShareProgress = async () => {
    try {
      // Mock share data generation
      const dummyUrl = `https://workspace.prolync.in/share/${user?.id || 'demo'}/${Date.now()}`;
      setShareUrl(dummyUrl);
      setShowShareModal(true);
    } catch (error) {
      toast({ title: "Sharing Failed", description: "Could not generate link.", variant: "destructive" });
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Copied!", description: "Link copied to clipboard." });
  };

  return (
    <FeatureGuard feature="dashboard">
      <div className="container mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-500 min-h-screen pb-20 bg-slate-50/50">

        {/* 1. WELCOME HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Welcome back, {firstName}!
            </h1>
            <p className="text-slate-500 text-lg">
              Let's continue your learning journey
            </p>
          </div>
          <Button onClick={handleShareProgress} variant="outline" className="gap-2 hidden md:flex">
            <Share2 className="h-4 w-4" /> Share Progress
          </Button>
        </div>

        {/* 2. STATS CARDS */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Link to="/courses?status=progress">
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Active Courses</p>
                  <p className="text-3xl font-bold text-slate-900">{stats.activeCourses}</p>
                </div>
                <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link to="/courses?status=completed">
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Completed</p>
                  <p className="text-3xl font-bold text-slate-900">{stats.completedCourses}</p>
                </div>
                <div className="h-10 w-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link to="/courses">
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Total Learning Time</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {Math.floor(stats.totalMinutes / 60)}<span className="text-sm text-slate-400 font-normal mx-1">h</span>
                    {stats.totalMinutes % 60}<span className="text-sm text-slate-400 font-normal mx-1">m</span>
                  </p>
                </div>
                <div className="h-10 w-10 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center">
                  <Clock className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link to="/courses?status=not-started">
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Not Started</p>
                  <p className="text-3xl font-bold text-slate-900">{stats.notStartedCourses}</p>
                </div>
                <div className="h-10 w-10 bg-slate-100 text-slate-600 rounded-lg flex items-center justify-center">
                  <PlayCircle className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* 3. MAIN DASHBOARD CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* LEFT COLUMN (Main Content) - Spans Full Width now */}
          <div className="lg:col-span-12 space-y-8">

            {/* A. CONTINUE LEARNING & CALENDAR SPLIT */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Left: Continue Learning (2/3 width) */}
              <div className="xl:col-span-2">
                <FeatureGuard feature="courses" fallback={<div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100 text-center text-slate-500 py-12">Course access is currently disabled by administrator.</div>}>
                  <section className="space-y-4 h-full">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-1 bg-blue-600 rounded-full" />
                      <h2 className="text-xl font-bold text-slate-800">Continue Learning</h2>
                    </div>

                    {mostRecentCourse ? (
                      <Card className="border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row justify-between gap-6 mb-8">
                            <div className="space-y-4 flex-1">
                              <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1">
                                {mostRecentCourse.category}
                              </Badge>
                              <div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">{mostRecentCourse.title}</h3>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                                  <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded">
                                    <Clock className="h-3.5 w-3.5" /> {mostRecentCourse.minutesConsumed}m watched
                                  </span>
                                  <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded">
                                    <Calendar className="h-3.5 w-3.5" /> Last activity: {new Date(mostRecentCourse.lastAccessedAt || Date.now()).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="md:w-72 space-y-4 bg-slate-50 p-5 rounded-xl border border-slate-100 h-fit">
                              <div className="flex justify-between text-sm font-medium items-center">
                                <span className="text-slate-700">Course Progress</span>
                                <span className="text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-md">{mostRecentCourse.progress}%</span>
                              </div>
                              <Progress value={mostRecentCourse.progress} className="h-2.5" />
                              <Button className="w-full bg-blue-600 hover:bg-blue-700 shadow-sm" size="lg" asChild>
                                <Link to={`/courses/${mostRecentCourse.id}`}>
                                  Resume Learning <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                              </Button>
                            </div>
                          </div>

                          {/* Suggested Modules */}
                          <div className="space-y-4 pt-6 border-t border-slate-100">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-semibold text-slate-700">Suggested Next Modules</p>
                            </div>
                            <ScrollArea className="w-full whitespace-nowrap pb-2">
                              <div className="flex gap-4">
                                {recentModules.map((module, i) => {
                                  const isCompleted = mostRecentCourse.completedModules?.includes(module.id);
                                  const firstUncompletedId = recentModules.find(m => !mostRecentCourse.completedModules?.includes(m.id))?.id;
                                  const isCurrent = !isCompleted && module.id === firstUncompletedId;

                                  return (
                                    <Link
                                      key={module.id}
                                      to={`/courses/${mostRecentCourse.id}`}
                                      state={{ moduleIndex: i }}
                                      className={`inline-flex flex-col justify-between w-[180px] p-4 rounded-xl border transition-all cursor-pointer hover:scale-[1.02] duration-200
                                            ${isCurrent ? 'bg-blue-50/50 border-blue-200 ring-1 ring-blue-100 shadow-sm' : 'bg-white border-slate-200 opacity-90 hover:opacity-100'}
                                        `}>
                                      <div className="flex justify-between items-start mb-3">
                                        <Badge variant="outline" className="text-[10px] h-5 px-1.5 bg-white border-slate-200 text-slate-500 font-mono">MOD {String(i + 1).padStart(2, '0')}</Badge>
                                        {isCompleted ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : isCurrent ? <PlayCircle className="h-4 w-4 text-blue-500 animate-pulse" /> : <Lock className="h-4 w-4 text-slate-300" />}
                                      </div>
                                      <p className="text-xs font-semibold whitespace-normal line-clamp-2 text-slate-800 leading-relaxed" title={module.title}>
                                        {module.title.replace(/Module \d+: /, '')}
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
                    ) : (
                      <Card className="border-dashed border-2 bg-slate-50/50">
                        <CardContent className="p-10 text-center flex flex-col items-center justify-center">
                          <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                            <BookOpen className="h-8 w-8 text-blue-500" />
                          </div>
                          <h3 className="text-lg font-bold text-slate-900 mb-2">Start Your Journey Today</h3>
                          <p className="text-slate-500 mb-6 max-w-sm">You haven't enrolled in any courses yet. Browse our catalog to find your first course.</p>
                          <Button asChild className="bg-blue-600 hover:bg-blue-700 px-8"><Link to="/courses">Browse Courses</Link></Button>
                        </CardContent>
                      </Card>
                    )}
                  </section>
                </FeatureGuard>
              </div>

              {/* Right: Activity Calendar (1/3 width) */}
              <div className="xl:col-span-1 h-full">
                <ActivityCalendar className="h-full min-h-[400px]" />
              </div>
            </div>
            <div className={`grid grid-cols-1 gap-6 ${completedCourses.length > 0 ? 'md:grid-cols-2' : 'md:grid-cols-1'}`}>

              {/* C. RECENT ACTIVITY */}
              <section className="space-y-4 h-full flex flex-col">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <Activity className="h-4 w-4" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-800">Recent Activity</h2>
                </div>

                <Card className="border-slate-200 shadow-sm h-full flex flex-col">
                  <CardContent className="p-0 flex-1 min-h-0">
                    <ScrollArea className="h-[200px]">
                      {activityLogs.length > 0 ? (
                        <div className="p-6">
                          <div className="space-y-6">
                            {activityLogs.map((log, index) => (
                              <div key={index} className="flex gap-4 relative group">
                                {index !== activityLogs.length - 1 && (
                                  <div className="absolute left-[19px] top-8 bottom-[-24px] w-0.5 bg-slate-100 group-hover:bg-slate-200 transition-colors" />
                                )}
                                <div className={`
                                      h-10 w-10 shrink-0 rounded-full flex items-center justify-center border-4 border-white shadow-sm z-10
                                      ${log.type === 'COURSE_COMPLETED' ? 'bg-green-100 text-green-600' :
                                    log.type === 'ENROLLED' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'}
                                   `}>
                                  {log.type === 'COURSE_COMPLETED' ? <Award className="h-4 w-4" /> :
                                    log.type === 'ENROLLED' ? <BookOpen className="h-4 w-4" /> : <PlayCircle className="h-4 w-4" />}
                                </div>

                                <div className="space-y-1 py-1">
                                  <p className="text-sm font-semibold text-slate-800 leading-none">{log.detail}</p>
                                  <p className="text-xs text-slate-500 font-medium">
                                    {new Date(log.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-12 text-slate-400">
                          <Activity className="h-10 w-10 mx-auto mb-2 opacity-20" />
                          <p>No activity yet</p>
                        </div>
                      )}
                    </ScrollArea>
                  </CardContent>
                </Card>
              </section>

              {/* D. ACHIEVEMENTS */}
              <FeatureGuard feature="courses" quiet>
                {completedCourses.length > 0 && (
                  <section className="space-y-4 h-full flex flex-col">
                    <div className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-amber-500" />
                      <h2 className="text-xl font-bold text-slate-800">Achievements</h2>
                    </div>
                    <Card className="border-amber-100 bg-amber-50/30 h-full flex flex-col">
                      <CardContent className="p-0 flex-1 min-h-0">
                        <ScrollArea className="h-[200px]">
                          <div className="divide-y divide-amber-100">
                            {completedCourses.map(course => (
                              <div key={course.id}
                                className="p-4 flex items-center justify-between hover:bg-amber-50 cursor-pointer transition-colors group"
                                onClick={() => {
                                  setSelectedCert({
                                    courseTitle: course.title,
                                    instructor: course.instructor || 'Instructor',
                                    date: new Date().toLocaleDateString(),
                                    certId: `CERT-${course.id}`
                                  });
                                  setShowCertModal(true);
                                }}
                              >
                                <div className="flex items-center gap-3">
                                  <div className="h-9 w-9 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                    <Award className="h-5 w-5" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-bold text-slate-800 line-clamp-1">{course.title}</p>
                                    <p className="text-xs text-amber-600 font-medium">View Certificate</p>
                                  </div>
                                </div>
                                <ArrowRight className="h-4 w-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  </section>
                )}
              </FeatureGuard>

            </div>

          </div>

          {/* RIGHT COLUMN Removed - Streak relocated */}

        </div>
      </div>

      <CertificateModal
        isOpen={showCertModal}
        onClose={() => setShowCertModal(false)}
        studentName={firstName}
        courseTitle={selectedCert?.courseTitle || ''}
        instructor={selectedCert?.instructor || ''}
        date={selectedCert?.date || ''}
        certId={selectedCert?.certId || ''}
      />

      {/* Share Modal Logic */}
      <Dialog open={showShareModal} onOpenChange={setShowShareModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Your Progress</DialogTitle>
            <DialogDescription>
              Anyone with this link can view your read-only profile.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <div className="flex items-center space-x-2">
              <div className="grid flex-1 gap-2">
                <Label htmlFor="link" className="sr-only">Link</Label>
                <Input id="link" value={shareUrl} readOnly className="h-9" />
              </div>
              <Button type="button" size="sm" className="px-3" onClick={copyToClipboard}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </FeatureGuard>
  );
}
