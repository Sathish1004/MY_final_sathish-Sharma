import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Code2,
  Briefcase,
  Users,
  PenSquare,
  ArrowRight,
  TrendingUp,
  Clock,
  Target,
  Share2,
  Zap,
  TrendingDown,
  BarChart3,
  TargetIcon,
  CheckCircle2,
  Calendar,

  FolderKanban,
  Star
} from 'lucide-react';
import FeatureGuard from "@/components/FeatureGuard";
import ShareProgressModal from "@/components/ShareProgressModal";


const recentActivities = [
  { title: 'Completed React Fundamentals', time: '2 hours ago', type: 'course', status: 'completed' },
  { title: 'Submitted coding challenge', time: '5 hours ago', type: 'coding', status: 'pending' },
  { title: 'Applied to Frontend Developer role', time: '1 day ago', type: 'job', status: 'applied' },
  { title: 'Booked mentor session', time: '2 days ago', type: 'mentor', status: 'scheduled' },
  { title: 'Published blog post', time: '3 days ago', type: 'blog', status: 'published' },
  { title: 'Joined Web Dev Workshop', time: '4 days ago', type: 'event', status: 'joined' },
];

const upcomingEvents = [
  { title: 'Web Development Workshop', date: 'Dec 20, 2024', type: 'Workshop', priority: 'high' },
  { title: 'AI/ML Hackathon', date: 'Dec 25, 2024', type: 'Hackathon', priority: 'medium' },
  { title: 'Career Guidance Session', date: 'Dec 28, 2024', type: 'Mentorship', priority: 'high' },
  { title: 'Tech Interview Prep', date: 'Jan 5, 2025', type: 'Training', priority: 'medium' },
];

const learningPaths = [
  { title: 'Frontend Developer', progress: 85, courses: 12, icon: Code2, color: 'from-blue-500 to-cyan-400' },
  { title: 'Full Stack Engineer', progress: 60, courses: 18, icon: Briefcase, color: 'from-purple-500 to-pink-400' },
  { title: 'DevOps Engineer', progress: 30, courses: 10, icon: Users, color: 'from-emerald-500 to-green-400' },
  { title: 'UI/UX Designer', progress: 45, courses: 8, icon: PenSquare, color: 'from-amber-500 to-orange-400' },
];

const platformStats = [
  { label: 'Active Courses', value: '8', change: '+2', icon: BookOpen, trend: 'up' },
  { label: 'Completed Projects', value: '15', change: '+3', icon: FolderKanban, trend: 'up' },
  { label: 'Mentor Sessions', value: '12', change: '+5', icon: Users, trend: 'up' },
  { label: 'Job Applications', value: '23', change: '+7', icon: Briefcase, trend: 'up' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] || 'Student';

  // Function to share dashboard link
  const handleShareDashboard = () => {
    // ... (keep logic)
    const dashboardUrl = `${window.location.origin}/dashboard`;
    if (navigator.share) {
      navigator.share({
        title: 'My Learning Dashboard',
        text: `Check out my learning progress and achievements!`,
        url: dashboardUrl,
      });
    } else {
      navigator.clipboard.writeText(dashboardUrl);
      alert('Dashboard link copied to clipboard!');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case 'pending': return <Clock className="h-4 w-4 text-amber-500" />;
      case 'applied': return <TargetIcon className="h-4 w-4 text-blue-500" />;
      case 'scheduled': return <Calendar className="h-4 w-4 text-purple-500" />;
      default: return <CheckCircle2 className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <FeatureGuard feature="dashboard">
      <div className="space-y-8 animate-fade-in bg-gradient-to-br from-background via-background to-primary/5 min-h-screen">
        {/* Welcome Section with Professional Header */}
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
                  Welcome back, {firstName}! 👋
                </h1>
                <p className="text-muted-foreground mt-1">
                  Your personalized learning journey dashboard
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <ShareProgressModal />

            <Button asChild className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/25 transition-all duration-300 group">
              <Link to="/explore" className="gap-2">
                <Zap className="h-4 w-4" />
                Explore Features
              </Link>
            </Button>
          </div>
        </div>



        {/* Platform Overview Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3 bg-background/50 backdrop-blur-sm border">
            <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Overview
            </TabsTrigger>
            <FeatureGuard feature="courses" quiet>
              <TabsTrigger value="learning" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Learning
              </TabsTrigger>
            </FeatureGuard>
            <FeatureGuard feature="coding" quiet>
              <TabsTrigger value="progress" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Progress
              </TabsTrigger>
            </FeatureGuard>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <FeatureGuard feature="courses" quiet>
                <Card className="card-hover border-border/50 shadow-sm hover:shadow-lg transition-all duration-300 backdrop-blur-sm bg-background/80">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">Active Courses</p>
                        <div className="flex items-baseline gap-2">
                          <p className="text-2xl font-bold text-foreground">8</p>
                          <div className="flex items-center gap-1 text-emerald-500">
                            <TrendingUp className="h-4 w-4" />
                            <span className="text-sm font-medium">+2</span>
                          </div>
                        </div>
                      </div>
                      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center ring-2 ring-primary/20">
                        <BookOpen className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FeatureGuard>

              <FeatureGuard feature="projects" quiet>
                <Card className="card-hover border-border/50 shadow-sm hover:shadow-lg transition-all duration-300 backdrop-blur-sm bg-background/80">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">Completed Projects</p>
                        <div className="flex items-baseline gap-2">
                          <p className="text-2xl font-bold text-foreground">15</p>
                          <div className="flex items-center gap-1 text-emerald-500">
                            <TrendingUp className="h-4 w-4" />
                            <span className="text-sm font-medium">+3</span>
                          </div>
                        </div>
                      </div>
                      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center ring-2 ring-primary/20">
                        <FolderKanban className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FeatureGuard>

              <FeatureGuard feature="mentorship" quiet>
                <Card className="card-hover border-border/50 shadow-sm hover:shadow-lg transition-all duration-300 backdrop-blur-sm bg-background/80">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">Mentor Sessions</p>
                        <div className="flex items-baseline gap-2">
                          <p className="text-2xl font-bold text-foreground">12</p>
                          <div className="flex items-center gap-1 text-emerald-500">
                            <TrendingUp className="h-4 w-4" />
                            <span className="text-sm font-medium">+5</span>
                          </div>
                        </div>
                      </div>
                      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center ring-2 ring-primary/20">
                        <Users className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FeatureGuard>

              <FeatureGuard feature="jobs" quiet>
                <Card className="card-hover border-border/50 shadow-sm hover:shadow-lg transition-all duration-300 backdrop-blur-sm bg-background/80">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">Job Applications</p>
                        <div className="flex items-baseline gap-2">
                          <p className="text-2xl font-bold text-foreground">23</p>
                          <div className="flex items-center gap-1 text-emerald-500">
                            <TrendingUp className="h-4 w-4" />
                            <span className="text-sm font-medium">+7</span>
                          </div>
                        </div>
                      </div>
                      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center ring-2 ring-primary/20">
                        <Briefcase className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FeatureGuard>
            </div>

            {/* Learning Paths */}
            <FeatureGuard feature="courses" quiet>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-foreground">Learning Paths</h2>
                  <Button variant="ghost" size="sm" asChild className="text-primary hover:text-primary/80">
                    <Link to="/learning-paths">View all paths</Link>
                  </Button>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {learningPaths.map((path, index) => (
                    <Card key={index} className="card-hover border-border/50 shadow-sm hover:shadow-lg transition-all duration-300 backdrop-blur-sm bg-background/80 group">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${path.color} flex items-center justify-center shadow-md`}>
                            <path.icon className="h-5 w-5 text-white" />
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {path.courses} courses
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-foreground mb-2">{path.title}</h3>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Progress</span>
                            <span className="text-sm font-semibold">{path.progress}%</span>
                          </div>
                          <Progress value={path.progress} className="h-2 [&>div]:bg-gradient-to-r from-primary to-primary/70" />
                        </div>
                        <Button variant="ghost" size="sm" className="w-full mt-4 group-hover:bg-primary/10" asChild>
                          <Link to={`/path/${path.title.toLowerCase().replace(' ', '-')}`}>
                            Continue
                            <ArrowRight className="ml-2 h-3 w-3" />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </FeatureGuard>
          </TabsContent>

          <TabsContent value="learning" className="space-y-6">
            <FeatureGuard feature="courses" quiet>
              <Card className="border-border/50 shadow-md backdrop-blur-sm bg-background/80">
                {/* ... existing code ... */}
                <CardHeader>
                  <CardTitle className="text-lg">Current Learning Focus</CardTitle>
                  <CardDescription>What you're actively working on</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Check individual items if needed, or assume this whole block is for courses/coding */}
                    <FeatureGuard feature="courses" quiet>
                      <div className="p-4 rounded-lg border bg-gradient-to-r from-primary/5 to-transparent">
                        <div className="flex items-center justify-between mb-2">
                          {/* ... details ... */}
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Code2 className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h4 className="font-semibold">Advanced React Patterns</h4>
                              <p className="text-sm text-muted-foreground">Course • 65% complete</p>
                            </div>
                          </div>
                          <Button size="sm" asChild>
                            <Link to="/continue">Continue</Link>
                          </Button>
                        </div>
                        <Progress value={65} className="h-2" />
                      </div>
                    </FeatureGuard>

                    <FeatureGuard feature="projects" quiet>
                      <div className="p-4 rounded-lg border bg-gradient-to-r from-blue-500/5 to-transparent">
                        {/* ... details ... */}
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                              <FolderKanban className="h-5 w-5 text-blue-500" />
                            </div>
                            <div>
                              <h4 className="font-semibold">E-commerce Dashboard</h4>
                              <p className="text-sm text-muted-foreground">Project • 40% complete</p>
                            </div>
                          </div>
                          <Button size="sm" variant="outline" asChild>
                            <Link to="/project">Work on it</Link>
                          </Button>
                        </div>
                        <Progress value={40} className="h-2" />
                      </div>
                    </FeatureGuard>
                  </div>
                </CardContent>
              </Card>
            </FeatureGuard>
          </TabsContent>

          <TabsContent value="progress">
            <FeatureGuard feature="coding" quiet>
              <Card className="border-border/50 shadow-md backdrop-blur-sm bg-background/80">
                <CardHeader>
                  <CardTitle className="text-lg">Detailed Progress Analytics</CardTitle>
                  <CardDescription>Track your learning journey in detail</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                      <div>
                        <p className="font-medium">Weekly Learning Streak</p>
                        <p className="text-sm text-muted-foreground">Current streak: 7 days</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {[...Array(7)].map((_, i) => (
                          <div key={i} className="h-8 w-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg border">
                        <p className="text-sm text-muted-foreground mb-1">Avg. Daily Hours</p>
                        <p className="text-2xl font-bold">2.5h</p>
                      </div>
                      <div className="p-4 rounded-lg border">
                        <p className="text-sm text-muted-foreground mb-1">Completion Rate</p>
                        <p className="text-2xl font-bold">78%</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FeatureGuard>
          </TabsContent>
        </Tabs>

        {/* Activity and Events Section */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Activity */}
          <Card className="border-border/50 shadow-md backdrop-blur-sm bg-background/80">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg text-foreground">Recent Activity</CardTitle>
                  <CardDescription>Your latest platform interactions</CardDescription>
                </div>
                <Badge variant="outline" className="gap-1">
                  <Star className="h-3 w-3" />
                  Active
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-all duration-300 group cursor-pointer"
                  >
                    <div className="flex-shrink-0">
                      {getStatusIcon(activity.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate group-hover:text-primary transition-colors duration-300">
                        {activity.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs px-2 py-0">
                          {activity.type}
                        </Badge>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-4 text-primary hover:text-primary/80 hover:bg-primary/5" asChild>
                <Link to="/activity">View Full Activity Log</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Upcoming Events & Notifications */}
          <div className="space-y-6">
            {/* Upcoming Events */}
            <FeatureGuard feature="events" quiet>
              <Card className="border-border/50 shadow-md backdrop-blur-sm bg-background/80">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-foreground">Upcoming Events</CardTitle>
                  <CardDescription>Platform events & deadlines</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {upcomingEvents.map((event, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-all duration-300 group cursor-pointer"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center ${event.priority === 'high' ? 'bg-red-500/10' : 'bg-blue-500/10'
                            }`}>
                            <Calendar className={`h-5 w-5 ${event.priority === 'high' ? 'text-red-500' : 'text-blue-500'
                              }`} />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-sm truncate group-hover:text-primary transition-colors duration-300">
                              {event.title}
                            </p>
                            <p className="text-xs text-muted-foreground">{event.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={event.priority === 'high' ? 'destructive' : 'secondary'}
                            className="text-xs"
                          >
                            {event.priority}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {event.type}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4 border-primary/20 hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-all duration-300" asChild>
                    <Link to="/events" className="gap-2">
                      View All Events
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </FeatureGuard>

            {/* Platform Updates */}
            <Card className="border-border/50 shadow-md backdrop-blur-sm bg-background/80">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-foreground">Platform Updates</CardTitle>
                <CardDescription>New features and announcements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-gradient-to-r from-primary/5 to-transparent border">
                    <div className="flex items-center gap-3">
                      <Zap className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium text-sm">New AI Mentor Feature</p>
                        <p className="text-xs text-muted-foreground">Try our new AI-powered code review</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500/5 to-transparent border">
                    <div className="flex items-center gap-3">
                      <BarChart3 className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium text-sm">Enhanced Analytics</p>
                        <p className="text-xs text-muted-foreground">Track your progress with detailed insights</p>
                      </div>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="w-full mt-3" asChild>
                  <Link to="/updates">See all updates</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </FeatureGuard>
  );
}