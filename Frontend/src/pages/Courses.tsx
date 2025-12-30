import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Search,
  Play,
  Clock,
  BookOpen,
  CheckCircle2
} from 'lucide-react';
import FeatureGuard from "@/components/FeatureGuard";

const categories = ['All', 'Frontend', 'Backend', 'AI/ML', 'Data Science', 'Core Subjects', 'Aptitude'];

// Realistic demo data
const initialCourses = [
  {
    id: 1,
    title: 'React.js Complete Guide',
    category: 'Frontend',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=225&fit=crop',
    instructor: 'John Smith',
    duration: '10 Modules',
    difficulty: 'Intermediate',
    totalVideos: 10,
    progress: 0
  },
  {
    id: 2,
    title: 'Node.js & Express Masterclass',
    category: 'Backend',
    thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=225&fit=crop',
    instructor: 'Sarah Johnson',
    duration: '10 Modules',
    difficulty: 'Intermediate',
    totalVideos: 10,
    progress: 0
  },
  {
    id: 3,
    title: 'Machine Learning Fundamentals',
    category: 'AI/ML',
    thumbnail: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400&h=225&fit=crop',
    instructor: 'Dr. Alex Chen',
    duration: '1 min per video',
    difficulty: 'Advanced',
    totalVideos: 10,
    progress: 0
  },
  {
    id: 4,
    title: 'Full Stack Web Development',
    category: 'Frontend',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=225&fit=crop',
    instructor: 'Michael Brown',
    duration: '10 Modules',
    difficulty: 'Beginner',
    totalVideos: 10,
    progress: 0
  },
  {
    id: 5,
    title: 'Aptitude & Logical Reasoning',
    category: 'Aptitude',
    thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=225&fit=crop',
    instructor: 'Emily Davis',
    duration: '1 min per video',
    difficulty: 'Beginner',
    totalVideos: 12,
    progress: 0
  },
  {
    id: 6,
    title: 'Data Structures Basics',
    category: 'Core Subjects',
    thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&h=225&fit=crop',
    instructor: 'Prof. David Lee',
    duration: '10 Modules',
    difficulty: 'Intermediate',
    totalVideos: 10,
    progress: 0
  },
];

export default function Courses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState(initialCourses);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const updatedCourses = initialCourses.map(course => {
      // Use v2 key matching CourseDetails logic
      const savedData = localStorage.getItem(`course_progress_${course.id}_v2`);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        // progress is already calculated 0-100 in saving logic
        return { ...course, progress: parsed.progress || 0 };
      }
      return { ...course, progress: 0 };
    });
    setCourses(updatedCourses);
  }, []);

  const filteredCourses = courses.filter(course => {
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const inProgressCourses = courses.filter(c => c.progress > 0 && c.progress < 100);
  const completedCourses = courses.filter(c => c.progress === 100);

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
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Courses</TabsTrigger>
            <TabsTrigger value="progress">In Progress ({inProgressCourses.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedCourses.length})</TabsTrigger>
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
                        {course.duration}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <BookOpen className="h-4 w-4" />
                        {course.totalVideos || 10} Videos
                      </div>
                    </div>

                    <Button
                      className={`w-full font-medium shadow-sm ${course.progress === 100
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : course.progress > 0
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        }`}
                      onClick={() => navigate(`/courses/${course.id}`)}
                    >
                      {course.progress === 100 ? 'Completed ✅' : course.progress > 0 ? 'Continue Learning' : 'Learn Now'}
                    </Button>
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
                      <Button className="w-full" onClick={() => navigate(`/courses/${course.id}`)}>
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
        </Tabs>
      </div>
    </FeatureGuard>
  );
}
