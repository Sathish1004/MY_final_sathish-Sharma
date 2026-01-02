import { useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Search,
  Clock,
  BookOpen,
  CheckCircle2,
  Circle,
  Loader2,
  Play

} from 'lucide-react';
import FeatureGuard from "@/components/FeatureGuard";
import { useToast } from '@/components/ui/use-toast';
import { useCourse } from '@/contexts/CourseContext';

const categories = ['All', 'Frontend', 'Backend', 'AI/ML', 'Aptitude'];

export default function Courses() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  // Use Global Context
  const { courses, progressMap, enroll } = useCourse();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Local UI state for ephemeral transitions
  const [enrollingId, setEnrollingId] = useState<number | null>(null);
  const [successId, setSuccessId] = useState<number | null>(null);

  const initialTab = searchParams.get('status') || 'all';

  const handleStartLearning = (courseId: number) => {
    navigate(`/courses/${courseId}`);
  };

  const handleEnroll = async (courseId: number) => {
    // 1. Loading State
    setEnrollingId(courseId);

    try {
      // 2. Call Context Action (Handling API + 3s Delay internally? Or here?)
      // Plan said context handles logic, but let's double check context implementation. 
      // Context has 3s delay.
      await enroll(courseId);

      // 3. Success State
      setEnrollingId(null);
      setSuccessId(courseId);

      // 4. Clear success after 2-3s
      setTimeout(() => {
        setSuccessId(null);
      }, 2500);

    } catch (error: any) {
      console.error("Enrollment failed", error);
      setEnrollingId(null);

      if (error?.response?.status === 401) {
        toast({
          title: "Session Expired",
          description: "Please login again to enroll.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Enrollment Failed",
          description: "Please try again later.",
          variant: "destructive"
        });
      }
    }
  };

  // Merge Course Data with Progress Data for display
  const displayCourses = courses.map(course => {
    const userProgress = progressMap[course.id];
    return {
      ...course,
      isEnrolled: !!userProgress?.enrolled,
      progress: userProgress?.progress || 0,
      status: userProgress?.status || 'Not Started'
    };
  });

  const filteredCourses = displayCourses.filter(course => {
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const inProgressCourses = filteredCourses.filter(c => c.progress > 0 && c.progress < 100);
  const completedCourses = filteredCourses.filter(c => c.progress === 100);
  const notStartedCourses = filteredCourses.filter(c => c.progress === 0);

  // Helper to render Action Button
  const renderActionButton = (course: any) => {
    // 1. Enrollment Success Message (High Priority Override)
    if (successId === course.id) {
      return (
        <div className="w-full py-2 bg-emerald-100 text-emerald-800 text-center rounded-md font-medium text-sm animate-pulse flex items-center justify-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          Successfully Enrolled ..!
        </div>
      );
    }

    // 2. Enrolling Loading State
    if (enrollingId === course.id) {
      return (
        <Button disabled className="w-full font-medium shadow-sm cursor-not-allowed">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enrolling...
        </Button>
      );
    }

    // 3. Completed State
    if (course.progress === 100) {
      return (
        <Button
          className="w-full font-medium shadow-sm bg-emerald-600 hover:bg-emerald-700 text-white"
          disabled
        >
          Completed ✅
        </Button>
      );
    }

    // 4. Enrolled / In Progress -> Start Learning
    if (course.isEnrolled || course.progress > 0) {
      return (
        <Button
          className="w-full font-medium shadow-sm bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => handleStartLearning(course.id)}
        >
          {course.progress > 0 ? "Continue Learning" : "Start Learning"}
        </Button>
      );
    }

    // 5. Default -> Enroll Now
    return (
      <Button
        className="w-full font-medium shadow-sm bg-emerald-600 hover:bg-emerald-700 text-white"
        onClick={() => handleEnroll(course.id)}
      >
        Enroll Now
      </Button>
    );
  };

  return (
    <FeatureGuard feature="courses">
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Course Learning</h1>
            <p className="text-muted-foreground mt-1">
              Expand your skills with structured courses and certifications
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search courses..."
                className="pl-10 w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue={initialTab} className="w-full">
          <TabsList className="mb-8 w-full justify-start h-auto p-2 bg-slate-100/80 rounded-2xl border border-slate-200/50 gap-2 overflow-x-auto">
            <TabsTrigger
              value="all"
              className="text-base px-6 py-2.5 rounded-xl data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-md hover:bg-white/60 hover:text-indigo-600 transition-all duration-300"
            >
              All Courses
            </TabsTrigger>
            <TabsTrigger
              value="progress"
              className="text-base px-6 py-2.5 rounded-xl data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-md hover:bg-white/60 hover:text-indigo-600 transition-all duration-300"
            >
              In Progress ({inProgressCourses.length})
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="text-base px-6 py-2.5 rounded-xl data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-md hover:bg-white/60 hover:text-indigo-600 transition-all duration-300"
            >
              Completed ({completedCourses.length})
            </TabsTrigger>
            <TabsTrigger
              value="not-started"
              className="text-base px-6 py-2.5 rounded-xl data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-md hover:bg-white/60 hover:text-indigo-600 transition-all duration-300"
            >
              Not Started ({notStartedCourses.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            {/* Categories */}
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="rounded-full"
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Course Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredCourses.map((course, index) => (
                <Card
                  key={course.id}
                  className="overflow-hidden card-hover opacity-0 animate-fade-in border-border/50 shadow-sm hover:shadow-md transition-all duration-300"
                  style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}
                >
                  <div className="relative group">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <Badge
                      className="absolute top-3 right-3 shadow-sm"
                      variant={course.difficulty === 'Beginner' ? 'secondary' : course.difficulty === 'Intermediate' ? 'default' : 'destructive'}
                    >
                      {course.difficulty}
                    </Badge>
                  </div>
                  <CardContent className="p-5 space-y-4">
                    <div>
                      <Badge variant="outline" className="mb-2 text-xs">{course.category}</Badge>
                      <h3 className="font-semibold text-lg line-clamp-2 leading-tight min-h-[3rem] text-foreground">
                        {course.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">by {course.instructor}</p>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        {course.total_duration ?
                          `${Math.floor(course.total_duration / 3600)}h ${Math.round((course.total_duration % 3600) / 60)}m`
                          : '0h 0m'}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <BookOpen className="h-4 w-4" />
                        {course.total_modules || 0} Modules
                      </div>
                    </div>

                    {renderActionButton(course)}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="progress">
            {inProgressCourses.length === 0 ? (
              <div className="text-center py-12">
                <Play className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No starting courses yet</h3>
                <p className="text-muted-foreground mb-4">Start watching a course video to track progress!</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {inProgressCourses.map((course, index) => (
                  <Card
                    key={course.id}
                    className="overflow-hidden card-hover opacity-0 animate-fade-in border-border/50 shadow-sm"
                    style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}
                  >
                    <div className="relative">
                      <img src={course.thumbnail} alt={course.title} className="w-full h-48 object-cover" />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-transparent p-3">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-foreground font-medium text-white">{course.progress}% Complete</span>
                        </div>
                        <Progress value={course.progress} className="h-1.5" />
                      </div>
                    </div>
                    <CardContent className="p-5 space-y-4">
                      <h3 className="font-semibold text-lg line-clamp-1">{course.title}</h3>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => navigate(`/courses/${course.id}`)}>
                        Continue Learning
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed">
            {completedCourses.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No completed courses yet</h3>
                <p className="text-muted-foreground mb-4">Complete a course video to see it here!</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {completedCourses.map((course, index) => (
                  <Card
                    key={course.id}
                    className="overflow-hidden card-hover opacity-0 animate-fade-in border-border/50 shadow-sm"
                    style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}
                  >
                    <div className="relative">
                      <img src={course.thumbnail} alt={course.title} className="w-full h-48 object-cover grayscale" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <Badge className="bg-emerald-600 hover:bg-emerald-700 text-lg py-1 px-3">Completed</Badge>
                      </div>
                    </div>
                    <CardContent className="p-5 space-y-4">
                      <h3 className="font-semibold text-lg line-clamp-1">{course.title}</h3>
                      <div className="flex items-center gap-2 text-emerald-600 text-sm font-medium">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Generic Certification Earned</span>
                      </div>
                      <Button variant="outline" className="w-full" onClick={() => navigate(`/courses/${course.id}`)}>
                        Review Course
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="not-started">
            {notStartedCourses.length === 0 ? (
              <div className="text-center py-12">
                <Circle className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">You've started everything!</h3>
                <p className="text-muted-foreground mb-4">Incredible job! You have started every single course.</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Reuse same card structure as 'All' tab but filtered */}
                {notStartedCourses.map((course, index) => (
                  <Card
                    key={course.id}
                    className="overflow-hidden card-hover opacity-0 animate-fade-in border-border/50 shadow-sm hover:shadow-md transition-all duration-300"
                    style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}
                  >
                    <div className="relative group">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <Badge
                        className="absolute top-3 right-3 shadow-sm"
                        variant="outline"
                      >
                        Not Started
                      </Badge>
                    </div>
                    <CardContent className="p-5 space-y-4">
                      <div>
                        <Badge variant="outline" className="mb-2 text-xs">{course.category}</Badge>
                        <h3 className="font-semibold text-lg line-clamp-2 leading-tight min-h-[3rem] text-foreground">
                          {course.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">by {course.instructor}</p>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4" />
                          {course.duration}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <BookOpen className="h-4 w-4" />
                          {course.totalVideos || 10} Videos
                        </div>
                      </div>

                      {renderActionButton(course)}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </FeatureGuard >
  );
}