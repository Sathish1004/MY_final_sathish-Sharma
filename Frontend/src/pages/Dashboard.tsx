import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCourse } from '@/contexts/CourseContext';
import {
  BookOpen, Activity, PlayCircle, CheckCircle2, Clock, Calendar, ArrowRight, Zap,
  Award, Lock, Share2, Copy, Check, Flame, Trophy, Briefcase, Code, Users, Search,
  Github, Linkedin, FileText, ExternalLink, Star
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Link, useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from "@/components/ui/use-toast";
import FeatureGuard from "@/components/FeatureGuard";
import { ActivityCalendar } from '@/components/dashboard/ActivityCalendar';
import CertificateModal from '@/components/CertificateModal';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


// Mock Mentor Data
// Mock Mentor Data
const MENTOR_DATA = [
  { id: '1', name: 'Sarah Jenkins', role: 'Frontend Developer', field: 'Programming', level: 'Beginner', rating: 4.9, sessions: 120, tags: ['React', 'CSS', 'Basics'], image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
  { id: '2', name: 'David Chen', role: 'Senior Software Engineer', field: 'Programming', level: 'Intermediate', rating: 4.8, sessions: 85, tags: ['System Design', 'Node.js'], image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David' },
  { id: '3', name: 'Emily Zhang', role: 'Product Designer', field: 'Design', level: 'Beginner', rating: 4.9, sessions: 95, tags: ['UI/UX', 'Figma', 'Colors'], image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily' },
  { id: '4', name: 'Michael Brown', role: 'Art Director', field: 'Design', level: 'Advanced', rating: 4.7, sessions: 200, tags: ['Brand Strategy', 'Direction'], image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael' },
  { id: '5', name: 'Jessica Lee', role: 'Data Scientist', field: 'Data / AI', level: 'Intermediate', rating: 4.9, sessions: 150, tags: ['Python', 'Pandas', 'ML'], image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica' },
  { id: '6', name: 'Robert Wilson', role: 'Career Coach', field: 'Core', level: 'Beginner', rating: 4.8, sessions: 300, tags: ['Resume', 'Soft Skills'], image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Robert' },
  // Fallbacks
  { id: '7', name: 'Alex Thompson', role: 'Full Stack Dev', field: 'Programming', level: 'Advanced', rating: 5.0, sessions: 60, tags: ['Architecture', 'Cloud'], image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
  { id: '8', name: 'Lisa Ray', role: 'AI Researcher', field: 'Data / AI', level: 'Advanced', rating: 4.9, sessions: 110, tags: ['Deep Learning', 'NLP'], image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa' },
];

export default function Dashboard() {
  const { user, signOut: logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { courses, progressMap, stats: rawStats } = useCourse();
  const firstName = user?.name?.split(' ')[0] || 'Student';

  // Mentor Selection State
  const [selectedLevel, setSelectedLevel] = useState('Beginner');
  const [selectedField, setSelectedField] = useState('Programming');

  // Filter Active Mentor
  const activeMentor = MENTOR_DATA.find(m => m.field === selectedField && m.level === selectedLevel) ||
    MENTOR_DATA.find(m => m.field === selectedField) ||
    MENTOR_DATA[0];

  // --- Extended Stats with Fallbacks ---
  const stats = {
    ...rawStats,
    problemsSolved: rawStats?.problemsSolved ?? 0,
    projectsSubmitted: rawStats?.projectsSubmitted ?? 0,
    badgesEarned: rawStats?.badgesEarned ?? 0,
    jobsApplied: rawStats?.jobsApplied ?? 0,
    mentorBookings: rawStats?.mentorBookings ?? 0,
    nextSession: rawStats?.nextSession ?? null
  };

  // --- Logic for Sections ---
  // Filter for Completed Courses for the Achievements section
  const completedCoursesList = courses.filter(c => progressMap[c.id]?.status === 'Completed');

  // Certificate Modal State
  const [showCertModal, setShowCertModal] = useState(false);
  const [selectedCert, setSelectedCert] = useState<any>(null);

  // Badge Modal State
  const [showBadgeModal, setShowBadgeModal] = useState(false);

  // Sharing State
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const handleShareProgress = async () => {
    try {
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

        {/* 1. HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Welcome back, {firstName}!
            </h1>
            <p className="text-slate-500 text-lg">
              Let's continue your learning journey
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Button onClick={handleShareProgress} variant="outline" className="gap-2 hidden md:flex border-blue-200 text-blue-700 hover:bg-blue-50">
              <Share2 className="h-4 w-4" /> Share Progress
            </Button>


          </div>
        </div>

        {/* 2. METRICS ROW 1 (4 COLORED BOXES) */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Box 1: Courses Completed (Green Gradient) */}
          <Card
            className="dashboard-card-premium hover-gradient-emerald overflow-hidden relative group cursor-pointer bg-emerald-50/50"
            onClick={() => navigate('/courses')}
          >
            <div className="absolute -right-6 -top-6 h-24 w-24 bg-emerald-200/40 rounded-full blur-2xl group-hover:bg-emerald-300/40 transition-colors" />
            <CardContent className="p-6 relative isolate">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-white rounded-xl shadow-sm text-emerald-600 ring-1 ring-emerald-100">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <Badge variant="secondary" className="bg-white/80 backdrop-blur text-emerald-700 shadow-sm">
                  Verified
                </Badge>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900 tracking-tight">{stats.completedCourses}</p>
                <p className="text-sm font-medium text-emerald-700 mt-1">Courses Completed</p>
              </div>
            </CardContent>
          </Card>

          {/* Box 2: Problems Solved (Blue Gradient) */}
          <Card
            className="dashboard-card-premium hover-gradient-blue overflow-hidden relative group cursor-pointer bg-blue-50/50"
            onClick={() => navigate('/coding')}
          >
            <div className="absolute -right-6 -top-6 h-24 w-24 bg-blue-200/40 rounded-full blur-2xl group-hover:bg-blue-300/40 transition-colors" />
            <CardContent className="p-6 relative isolate">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-white rounded-xl shadow-sm text-blue-600 ring-1 ring-blue-100">
                  <Code className="h-6 w-6" />
                </div>
                <Badge variant="secondary" className="bg-white/80 backdrop-blur text-blue-700 shadow-sm">
                  Hand On Practice
                </Badge>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900 tracking-tight">{stats.problemsSolved}</p>
                <p className="text-sm font-medium text-blue-700 mt-1">Problems Solved</p>
              </div>
            </CardContent>
          </Card>

          {/* Box 3: Projects Submitted (Purple Gradient) */}
          <Card
            className="dashboard-card-premium hover-gradient-purple overflow-hidden relative group cursor-pointer bg-violet-50/50"
            onClick={() => navigate('/projects')}
          >
            <div className="absolute -right-6 -top-6 h-24 w-24 bg-violet-200/40 rounded-full blur-2xl group-hover:bg-violet-300/40 transition-colors" />
            <CardContent className="p-6 relative isolate">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-white rounded-xl shadow-sm text-violet-600 ring-1 ring-violet-100">
                  <Briefcase className="h-6 w-6" />
                </div>
                <Badge variant="secondary" className="bg-white/80 backdrop-blur text-violet-700 shadow-sm">
                  Review Pending
                </Badge>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900 tracking-tight">{stats.projectsSubmitted}</p>
                <p className="text-sm font-medium text-violet-700 mt-1">Projects Submitted</p>
              </div>
            </CardContent>
          </Card>

          {/* Box 4: Badges Earned (Amber Gradient) */}
          <Card
            className="dashboard-card-premium hover-gradient-orange overflow-hidden relative group cursor-pointer bg-amber-50/50"
            onClick={() => setShowBadgeModal(true)}
          >
            <div className="absolute -right-6 -top-6 h-24 w-24 bg-amber-200/40 rounded-full blur-2xl group-hover:bg-amber-300/40 transition-colors" />
            <CardContent className="p-6 relative isolate">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-white rounded-xl shadow-sm text-amber-600 ring-1 ring-amber-100">
                  <Trophy className="h-6 w-6" />
                </div>
                <Badge variant="secondary" className="bg-white/80 backdrop-blur text-amber-700 shadow-sm">
                  Elite
                </Badge>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900 tracking-tight">{stats.badgesEarned}</p>
                <p className="text-sm font-medium text-amber-700 mt-1">Badges Earned</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 3. ROW 2: ACTIVITY & QUICK STATS */}
        {/* 3. ROW 2: ACTIVITY & QUICK STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* LEFT: BIG BOX - ACTIVITY & STREAK (Now 50% width on large screens) */}
          <div className="col-span-1">
            <Card className="border-slate-200 shadow-sm h-full hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                      <Activity className="h-5 w-5 text-blue-600" />
                      Learning Activity
                    </CardTitle>
                    <p className="text-sm text-slate-500">Track your daily progress and consistency</p>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-orange-50 text-orange-600 rounded-full border border-orange-100">
                    <Flame className="h-4 w-4 fill-current" />
                    <span className="font-bold">{stats.streak} Day Streak</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* We use ActivityCalendar as the main visual here */}
                <ActivityCalendar />
              </CardContent>
            </Card>
          </div>

          {/* RIGHT: 3 SMALL BOXES (1/3) */}
          <div className="flex flex-col gap-4 h-full">

            {/* 1. Active Learning (Center Fix) */}
            <Card
              className="dashboard-card-premium hover-gradient-blue bg-blue-50/50 flex-1 overflow-hidden"
              onClick={() => navigate('/courses')}
            >
              <CardContent className="p-0 flex h-full items-stretch">
                <div className="flex-1 p-5 flex flex-col justify-center">
                  <p className="text-sm font-semibold text-blue-900/70">Active Learning</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">{stats.activeCourses} Courses</p>

                  {/* Progress & Guidance */}
                  <div className="mt-4">
                    <div className="w-24 h-1.5 bg-blue-200/50 rounded-full overflow-hidden mb-2">
                      <div className="h-full bg-blue-500 w-2/3" />
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="mt-0.5 text-blue-500 animate-breathe">
                        <PlayCircle className="h-3 w-3 fill-blue-500/20" />
                      </div>
                      <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-[180px]">
                        You can resume your active course here
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Box */}
                <div className="w-24 bg-blue-100/50 hover:bg-blue-100 transition-colors flex flex-col items-center justify-center border-l border-blue-100">
                  <PlayCircle className="h-6 w-6 text-blue-600 mb-1" />
                  <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wide">Continue</span>
                </div>
              </CardContent>
            </Card>

            {/* 2. Career Ops */}
            <Card
              className="dashboard-card-premium hover-gradient-pink bg-pink-50/50 flex-1 overflow-hidden"
              onClick={() => navigate('/jobs')}
            >
              <CardContent className="p-0 flex h-full items-stretch">
                <div className="flex-1 p-5 flex flex-col justify-center">
                  <p className="text-sm font-semibold text-pink-900/70">Career Ops</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">{stats.jobsApplied} Applied</p>
                  <p className="text-xs text-pink-700 font-medium mt-1 bg-white/60 px-2 py-0.5 rounded-full w-fit">2 Interviews Pending</p>
                </div>
                {/* Action Box */}
                <div className="w-24 bg-pink-100/50 hover:bg-pink-100 transition-colors flex flex-col items-center justify-center border-l border-pink-100">
                  <Briefcase className="h-6 w-6 text-pink-600 mb-1" />
                  <span className="text-[10px] font-bold text-pink-700 uppercase tracking-wide">Apply</span>
                </div>
              </CardContent>
            </Card>

            {/* 3. Mentorship */}
            <Card
              className="dashboard-card-premium hover-gradient-violet bg-violet-50/50 flex-1 overflow-hidden"
              onClick={() => navigate('/mentors')}
            >
              <CardContent className="p-0 flex h-full items-stretch">
                <div className="flex-1 p-5 flex flex-col justify-center">
                  <p className="text-sm font-semibold text-violet-900/70">Mentorship</p>
                  {stats.nextSession ? (
                    <div>
                      <p className="text-lg font-bold text-slate-900 mt-1">{new Date(stats.nextSession.schedule_time).toLocaleDateString()}</p>
                      <p className="text-xs text-violet-700 font-bold bg-white/60 px-2 py-0.5 rounded-full w-fit mt-1">Upcoming Session</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-3xl font-bold text-slate-900 mt-1">No Bookings</p>
                      <p className="text-sm text-slate-400 font-medium mt-1">Book a session today</p>
                    </div>
                  )}
                </div>
                {/* Action Box */}
                <div className="w-24 bg-violet-100/50 hover:bg-violet-100 transition-colors flex flex-col items-center justify-center border-l border-violet-100">
                  <Users className="h-6 w-6 text-violet-600 mb-1" />
                  <span className="text-[10px] font-bold text-violet-700 uppercase tracking-wide">Book Now</span>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>

        {/* 4. BOTTOM SECTIONS: MENTOR, PORTFOLIO, CERTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* LEFT: MENTOR CARD & SOCIALS */}
          <div className="space-y-6">

            {/* Mentor Highlight - Dynamic */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-12 translate-x-12" />
              <div className="relative z-10">
                {stats.nextSession ? (
                  <>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <Badge className="bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border-none mb-2">Upcoming Session</Badge>
                        <h3 className="text-xl font-bold">{stats.nextSession.mentor_name}</h3>
                        <p className="text-slate-400 text-sm">Mentorship Call</p>
                      </div>
                      <div className="h-12 w-12 bg-white/10 rounded-full flex items-center justify-center text-white backdrop-blur-sm">
                        <Users className="h-6 w-6" />
                      </div>
                    </div>

                    <div className="bg-white/5 rounded-xl p-3 mb-6 border border-white/10">
                      <div className="flex items-center gap-3 text-sm">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-200">
                          {new Date(stats.nextSession.schedule_time).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })} at {new Date(stats.nextSession.schedule_time).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Button
                        className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white border-none"
                        onClick={() => window.open(stats.nextSession.meeting_link, '_blank')}
                      >
                        Join Meeting
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 bg-white text-slate-900 border-none hover:bg-slate-100"
                        onClick={() => navigate('/mentors')}
                      >
                        Details
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden">
                      {/* Background Accents */}
                      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                      <div className="relative z-10 mb-8">
                        <h3 className="text-2xl font-bold mb-2">Expert Mentorship</h3>
                        <p className="text-slate-300 max-w-xl">Get guidance from mentors matched to your skill level and career goals.</p>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                        {/* 1. Skill Level Selector */}
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 flex flex-col h-full">
                          <h4 className="font-semibold mb-4 text-slate-200">Your Level</h4>
                          <div className="flex flex-col gap-3 flex-1">
                            {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                              <button
                                key={level}
                                onClick={() => setSelectedLevel(level)}
                                className={`w-full flex items-center justify-between p-3 rounded-lg transition-all text-sm ${selectedLevel === level
                                  ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 ring-1 ring-indigo-400'
                                  : 'bg-slate-800/50 hover:bg-slate-800 text-slate-400 border border-white/5'
                                  }`}
                              >
                                <span className="font-medium">{level}</span>
                                {selectedLevel === level && <Check className="h-4 w-4" />}
                              </button>
                            ))}
                          </div>
                          <p className="text-xs text-slate-400 mt-4 pt-4 border-t border-white/10 hidden xl:block">
                            {selectedLevel === 'Beginner' ? 'New learners start best with beginner mentors' :
                              selectedLevel === 'Intermediate' ? 'Great for refining skills and project reviews' :
                                'Expert guidance for advanced career moves'}
                          </p>
                        </div>

                        {/* 2. Field Selection */}
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 flex flex-col h-full">
                          <h4 className="font-semibold mb-4 text-slate-200">Your Field</h4>
                          <div className="flex flex-wrap gap-2 content-start flex-1">
                            {['Programming', 'Design', 'Data / AI', 'Core'].map((field, i) => (
                              <button
                                key={field}
                                onClick={() => setSelectedField(field)}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${selectedField === field
                                  ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-200 ring-1 ring-indigo-500/30'
                                  : 'bg-slate-800/50 border-white/5 text-slate-400 hover:border-white/20'
                                  }`}
                              >
                                {field}
                              </button>
                            ))}
                          </div>
                          <p className="text-xs text-slate-400 mt-4 pt-4 border-t border-white/10 hidden xl:block">
                            Showing mentors for <span className="text-indigo-300">{selectedField}</span>
                          </p>
                        </div>

                        {/* 3. Recommended Mentor */}
                        <div className="bg-white rounded-xl p-1 text-slate-900 shadow-xl overflow-hidden relative group h-full flex flex-col">
                          {activeMentor ? (
                            <div className="p-4 bg-gradient-to-b from-indigo-50 to-white flex-1 flex flex-col animate-in fade-in slide-in-from-right-4 duration-300" key={activeMentor.id}>
                              <div className="flex items-start gap-3">
                                <Avatar className="h-12 w-12 border-2 border-white shadow-md flex-shrink-0">
                                  <AvatarImage src={activeMentor.image} />
                                  <AvatarFallback>{activeMentor.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="min-w-0">
                                  <h5 className="font-bold text-base leading-tight truncate">{activeMentor.name}</h5>
                                  <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500 mt-0.5">
                                    <Briefcase className="h-3 w-3" /> {activeMentor.role}
                                  </div>
                                  <div className="flex items-center gap-1 mt-0.5">
                                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                    <span className="text-xs font-bold text-slate-800">{activeMentor.rating}</span>
                                    <span className="text-[10px] text-slate-400">({activeMentor.sessions} sessions)</span>
                                  </div>
                                </div>
                              </div>

                              <div className="mt-3 flex flex-wrap gap-1.5 mb-3">
                                {activeMentor.tags.map(tag => (
                                  <Badge key={tag} variant="secondary" className="bg-indigo-50 text-indigo-700 text-[10px] px-2 py-0.5 hover:bg-indigo-100">{tag}</Badge>
                                ))}
                              </div>

                              <div className="mt-auto pt-3 border-t border-slate-100">
                                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 rounded-full group-hover:scale-[1.02] transition-transform h-auto py-2.5 px-2 text-xs font-bold whitespace-normal leading-tight mx-auto block" onClick={() => navigate('/mentors')}>
                                  Book {activeMentor.name.split(' ')[0]}
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center h-full text-slate-400 text-sm p-4 text-center">
                              No mentor found for this combination.
                            </div>
                          )}
                        </div>

                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>



          </div>

          {/* RIGHT: COURSE COMPLETION / CERTS */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">Your Achievements</h2>
              <Button variant="ghost" size="sm" className="text-blue-600 gap-1">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            <ScrollArea className="h-[320px] pr-4">
              <div className="space-y-3">
                {completedCoursesList.length > 0 ? completedCoursesList.map(course => (
                  <div key={course.id} className="group p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center gap-4"
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
                    <div className="h-12 w-12 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center ring-1 ring-amber-100 group-hover:scale-105 transition-transform">
                      <Award className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900 line-clamp-1">{course.title}</h4>
                      <p className="text-xs text-slate-500">Completed on {new Date().toLocaleDateString()}</p>
                    </div>
                    <Button size="sm" variant="ghost" className="text-slate-400 group-hover:text-blue-600">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                )) : (
                  <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                    <Award className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                    <p className="text-slate-500 font-medium">No certificates yet</p>
                    <Button variant="link" className="text-blue-600" onClick={() => window.location.href = '/courses'}>Start Learning</Button>
                  </div>
                )}


              </div>
            </ScrollArea>
          </div>
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

      {/* Badge Details Modal */}
      <Dialog open={showBadgeModal} onOpenChange={setShowBadgeModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-500" />
              Badge Breakdown
            </DialogTitle>
            <DialogDescription>
              Track your achievements across different metrics.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">

            {/* 1. Coding Badges */}
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl border border-blue-100">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                  <Code className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-slate-800">Coding Streaks</p>
                  <p className="text-xs text-slate-500">1 Badge per 5 problems</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold text-blue-700">{Math.floor(stats.problemsSolved / 5)}</span>
                <p className="text-[10px] text-blue-600 uppercase font-bold">Badges</p>
              </div>
            </div>

            {/* 2. Time Badges */}
            <div className="flex items-center justify-between p-3 bg-amber-50 rounded-xl border border-amber-100">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-slate-800">Learning Dedication</p>
                  <p className="text-xs text-slate-500">1 Badge per 10 Hours</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold text-amber-700">{Math.floor(stats.totalMinutes / 600)}</span>
                <p className="text-[10px] text-amber-600 uppercase font-bold">Badges</p>
              </div>
            </div>



          </div>
        </DialogContent>
      </Dialog>

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
