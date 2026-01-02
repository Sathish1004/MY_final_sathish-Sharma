import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Clock, 
  Users, 
  Star, 
  BookOpen,
  Play,
  Filter,
  ChevronRight
} from 'lucide-react';

const categories = ['All', 'Frontend', 'Backend', 'AI/ML', 'Data Science', 'Core Subjects', 'Aptitude'];

const courses = [
  {
    id: 1,
    title: 'React.js Complete Guide',
    category: 'Frontend',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=225&fit=crop',
    instructor: 'John Smith',
    duration: '12 hours',
    lessons: 48,
    enrolled: 2340,
    rating: 4.8,
    progress: 65,
    difficulty: 'Intermediate'
  },
  {
    id: 2,
    title: 'Node.js & Express Masterclass',
    category: 'Backend',
    thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=225&fit=crop',
    instructor: 'Sarah Johnson',
    duration: '15 hours',
    lessons: 62,
    enrolled: 1890,
    rating: 4.9,
    progress: 30,
    difficulty: 'Intermediate'
  },
  {
    id: 3,
    title: 'Machine Learning Fundamentals',
    category: 'AI/ML',
    thumbnail: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400&h=225&fit=crop',
    instructor: 'Dr. Alex Chen',
    duration: '20 hours',
    lessons: 80,
    enrolled: 3200,
    rating: 4.7,
    progress: 0,
    difficulty: 'Advanced'
  },
  {
    id: 4,
    title: 'Data Structures & Algorithms',
    category: 'Core Subjects',
    thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&h=225&fit=crop',
    instructor: 'Prof. David Lee',
    duration: '25 hours',
    lessons: 95,
    enrolled: 4500,
    rating: 4.9,
    progress: 45,
    difficulty: 'Intermediate'
  },
  {
    id: 5,
    title: 'Python for Data Science',
    category: 'Data Science',
    thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=225&fit=crop',
    instructor: 'Emily Davis',
    duration: '18 hours',
    lessons: 72,
    enrolled: 2100,
    rating: 4.6,
    progress: 0,
    difficulty: 'Beginner'
  },
  {
    id: 6,
    title: 'Quantitative Aptitude',
    category: 'Aptitude',
    thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=225&fit=crop',
    instructor: 'Michael Brown',
    duration: '10 hours',
    lessons: 40,
    enrolled: 5600,
    rating: 4.5,
    progress: 80,
    difficulty: 'Beginner'
  },
];

import FeatureGuard from "@/components/FeatureGuard";

export default function Courses() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

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
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
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
                className="overflow-hidden card-hover opacity-0 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}
              >
                <div className="relative">
                  <img 
                    src={course.thumbnail} 
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                  <Badge 
                    className="absolute top-3 right-3"
                    variant={course.difficulty === 'Beginner' ? 'secondary' : course.difficulty === 'Intermediate' ? 'default' : 'destructive'}
                  >
                    {course.difficulty}
                  </Badge>
                  {course.progress > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-transparent p-3">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-foreground font-medium">{course.progress}% Complete</span>
                      </div>
                      <Progress value={course.progress} className="h-1.5" />
                    </div>
                  )}
                </div>
                <CardContent className="p-5">
                  <Badge variant="outline" className="mb-2">{course.category}</Badge>
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">{course.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">by {course.instructor}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {course.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      {course.lessons} lessons
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-warning text-warning" />
                        <span className="font-medium">{course.rating}</span>
                      </div>
                      <span className="text-muted-foreground text-sm">
                        ({course.enrolled.toLocaleString()} students)
                      </span>
                    </div>
                    <Button 
                      size="sm" 
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                      onClick={() => navigate(`/courses/${course.id}`)}
                    >
                      View More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="progress">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {inProgressCourses.map((course, index) => (
              <Card 
                key={course.id} 
                className="overflow-hidden card-hover opacity-0 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}
              >
                <div className="relative">
                  <img 
                    src={course.thumbnail} 
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-transparent p-3">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-foreground font-medium">{course.progress}% Complete</span>
                    </div>
                    <Progress value={course.progress} className="h-1.5" />
                  </div>
                </div>
                <CardContent className="p-5">
                  <h3 className="font-semibold text-lg mb-2">{course.title}</h3>
                  <Button 
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={() => navigate(`/courses/${course.id}`)}
                  >
                    View More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed">
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No completed courses yet</h3>
            <p className="text-muted-foreground mb-4">Keep learning to earn your first certificate!</p>
            <Button>Browse Courses</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
    </FeatureGuard>
  );
}





//                                       <span className="flex items-center gap-1">
//                                         <Video className="h-3 w-3" />
//                                         {module.videos} videos
//                                       </span>
//                                     </div>
//                                   </div>
//                                 </div>
//                                 <Button 
//                                   size="sm" 
//                                   variant={module.completed ? "outline" : "default"}
//                                   className={!module.completed ? 'bg-gradient-to-r from-primary to-primary/80' : ''}
//                                 >
//                                   {module.completed ? 'Review' : 'Start'}
//                                 </Button>
//                               </div>
//                             ))}
//                           </div>
//                         </CardContent>
//                       </Card>
//                     </div>

//                     {/* Right Column - Actions & Info */}
//                     <div className="space-y-6">
//                       {/* Instructor Info */}
//                       <Card className="border-border/50">
//                         <CardHeader>
//                           <CardTitle className="text-lg">Instructor</CardTitle>
//                         </CardHeader>
//                         <CardContent>
//                           <div className="flex items-center gap-3">
//                             <img 
//                               src={course.instructorAvatar} 
//                               alt={course.instructor}
//                               className="h-12 w-12 rounded-full border-2 border-primary/20"
//                             />
//                             <div>
//                               <h4 className="font-semibold">{course.instructor}</h4>
//                               <p className="text-sm text-muted-foreground">Senior Instructor</p>
//                             </div>
//                           </div>
//                           <div className="mt-4 space-y-2">
//                             <div className="flex items-center justify-between text-sm">
//                               <span className="text-muted-foreground">Rating</span>
//                               <span className="font-medium flex items-center gap-1">
//                                 <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
//                                 {course.rating}/5.0
//                               </span>
//                             </div>
//                             <div className="flex items-center justify-between text-sm">
//                               <span className="text-muted-foreground">Students</span>
//                               <span className="font-medium">{course.enrolled.toLocaleString()}</span>
//                             </div>
//                           </div>
//                         </CardContent>
//                       </Card>

//                       {/* Course Details */}
//                       <Card className="border-border/50">
//                         <CardHeader>
//                           <CardTitle className="text-lg">Course Details</CardTitle>
//                         </CardHeader>
//                         <CardContent className="space-y-3">
//                           <div className="flex items-center justify-between">
//                             <span className="text-sm text-muted-foreground">Category</span>
//                             <Badge variant="secondary">{course.category}</Badge>
//                           </div>
//                           <div className="flex items-center justify-between">
//                             <span className="text-sm text-muted-foreground">Difficulty</span>
//                             <Badge variant={course.difficulty === 'Beginner' ? 'secondary' : course.difficulty === 'Intermediate' ? 'default' : 'destructive'}>
//                               {course.difficulty}
//                             </Badge>
//                           </div>
//                           <div className="flex items-center justify-between">
//                             <span className="text-sm text-muted-foreground">Duration</span>
//                             <span className="font-medium">{course.duration}</span>
//                           </div>
//                           <div className="flex items-center justify-between">
//                             <span className="text-sm text-muted-foreground">Lessons</span>
//                             <span className="font-medium">{course.lessons}</span>
//                           </div>
//                           <div className="flex items-center justify-between">
//                             <span className="text-sm text-muted-foreground">Certification</span>
//                             <span className="font-medium flex items-center gap-1 text-emerald-500">
//                               <Award className="h-4 w-4" />
//                               Available
//                             </span>
//                           </div>
//                         </CardContent>
//                       </Card>

//                       {/* Prerequisites */}
//                       <Card className="border-border/50">
//                         <CardHeader>
//                           <CardTitle className="text-lg">Prerequisites</CardTitle>
//                         </CardHeader>
//                         <CardContent>
//                           <ul className="space-y-2">
//                             {course.prerequisites.map((prereq, index) => (
//                               <li key={index} className="flex items-center gap-2 text-sm">
//                                 <ChevronRight className="h-4 w-4 text-primary" />
//                                 {prereq}
//                               </li>
//                             ))}
//                           </ul>
//                         </CardContent>
//                       </Card>

//                       {/* Certificate Section - Only show if course is 100% complete */}
//                       {course.progress === 100 && (
//                         <Card className="border-border/50 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5">
//                           <CardHeader>
//                             <CardTitle className="text-lg flex items-center gap-2">
//                               <Award className="h-5 w-5 text-emerald-500" />
//                               Your Certificate
//                             </CardTitle>
//                             <CardDescription>
//                               Congratulations! You've completed this course.
//                             </CardDescription>
//                           </CardHeader>
//                           <CardContent className="space-y-4">
//                             <div className="p-4 rounded-lg bg-gradient-to-r from-emerald-500/20 to-transparent border border-emerald-500/30">
//                               <div className="flex items-center gap-3">
//                                 <Award className="h-8 w-8 text-emerald-500" />
//                                 <div>
//                                   <h4 className="font-semibold">Certificate of Completion</h4>
//                                   <p className="text-sm text-muted-foreground">Issued on {new Date().toLocaleDateString()}</p>
//                                 </div>
//                               </div>
//                             </div>
//                             <div className="flex gap-2">
//                               <Button 
//                                 className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
//                                 onClick={() => handleDownloadCertificate(course.id)}
//                               >
//                                 <Download className="h-4 w-4 mr-2" />
//                                 Download
//                               </Button>
//                               <Button 
//                                 variant="outline" 
//                                 className="flex-1 border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10"
//                                 onClick={() => handleShareCertificate(course.id)}
//                               >
//                                 <Share2 className="h-4 w-4 mr-2" />
//                                 Share
//                               </Button>
//                             </div>
//                           </CardContent>
//                         </Card>
//                       )}

//                       {/* Action Buttons */}
//                       <div className="space-y-3">
//                         <Button 
//                           className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/25"
//                           size="lg"
//                         >
//                           {course.progress === 0 ? (
//                             <>
//                               <Play className="h-5 w-5 mr-2" />
//                               Enroll & Start Learning
//                             </>
//                           ) : course.progress === 100 ? (
//                             <>
//                               <CheckCircle2 className="h-5 w-5 mr-2" />
//                               View Certificate
//                             </>
//                           ) : (
//                             <>
//                               <Play className="h-5 w-5 mr-2" />
//                               Continue Learning
//                             </>
//                           )}
//                         </Button>
//                         {course.progress < 100 && (
//                           <Button variant="outline" className="w-full" size="lg">
//                             <Bookmark className="h-5 w-5 mr-2" />
//                             Save for Later
//                           </Button>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </DialogContent>
//               </Dialog>
//             ))}
//           </div>
//         </TabsContent>

//         <TabsContent value="progress">
//           {inProgressCourses.length > 0 ? (
//             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//               {inProgressCourses.map((course, index) => (
//                 <Card 
//                   key={course.id} 
//                   className="overflow-hidden card-hover border-border/50 shadow-md hover:shadow-lg transition-all duration-300 backdrop-blur-sm bg-background/80 opacity-0 animate-fade-in"
//                   style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}
//                 >
//                   <div className="relative">
//                     <img 
//                       src={course.thumbnail} 
//                       alt={course.title}
//                       className="w-full h-48 object-cover"
//                     />
//                     <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background/90 to-transparent p-4">
//                       <div className="flex items-center justify-between text-sm mb-2">
//                         <span className="text-primary-foreground font-medium">{course.progress}% Complete</span>
//                         <span className="text-muted-foreground">{course.duration} total</span>
//                       </div>
//                       <Progress value={course.progress} className="h-2" />
//                     </div>
//                   </div>
//                   <CardContent className="p-5">
//                     <h3 className="font-semibold text-lg mb-3">{course.title}</h3>
//                     <div className="flex items-center gap-2 mb-4">
//                       {course.modules.filter(m => m.completed).length > 0 && (
//                         <Badge variant="outline" className="text-xs">
//                           {course.modules.filter(m => m.completed).length}/{course.modules.length} modules
//                         </Badge>
//                       )}
//                     </div>
//                     <Button className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
//                       <Play className="h-4 w-4 mr-2" />
//                       Continue Learning
//                     </Button>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           ) : (
//             <Card className="border-border/50 backdrop-blur-sm bg-background/80">
//               <CardContent className="py-12 text-center">
//                 <Play className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
//                 <h3 className="text-lg font-semibold mb-2">No courses in progress</h3>
//                 <p className="text-muted-foreground mb-6">Start a new course to begin your learning journey</p>
//                 <Button className="bg-gradient-to-r from-primary to-primary/80">
//                   Browse All Courses
//                 </Button>
//               </CardContent>
//             </Card>
//           )}
//         </TabsContent>

//         <TabsContent value="completed">
//           {completedCourses.length > 0 ? (
//             <div className="space-y-6">
//               <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//                 {completedCourses.map((course, index) => (
//                   <Card 
//                     key={course.id} 
//                     className="overflow-hidden card-hover border-border/50 shadow-md hover:shadow-lg transition-all duration-300 backdrop-blur-sm bg-background/80 opacity-0 animate-fade-in"
//                     style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}
//                   >
//                     <div className="relative">
//                       <img 
//                         src={course.thumbnail} 
//                         alt={course.title}
//                         className="w-full h-48 object-cover"
//                       />
//                       <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/30 to-transparent" />
//                       <div className="absolute top-3 left-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
//                         <Award className="h-3 w-3 inline mr-1" />
//                         Certified
//                       </div>
//                     </div>
//                     <CardContent className="p-5">
//                       <h3 className="font-semibold text-lg mb-2">{course.title}</h3>
//                       <p className="text-sm text-muted-foreground mb-4">Completed on {new Date().toLocaleDateString()}</p>
                      
//                       <div className="space-y-3">
//                         <Button 
//                           className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
//                           onClick={() => handleDownloadCertificate(course.id)}
//                         >
//                           <Download className="h-4 w-4 mr-2" />
//                           Download Certificate
//                         </Button>
//                         <Button variant="outline" className="w-full" onClick={() => handleShareCertificate(course.id)}>
//                           <Share2 className="h-4 w-4 mr-2" />
//                           Share Achievement
//                         </Button>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </div>
              
//               {/* Certificate Showcase */}
//               <Card className="border-border/50 backdrop-blur-sm bg-background/80">
//                 <CardHeader>
//                   <CardTitle className="text-lg flex items-center gap-2">
//                     <Award className="h-5 w-5 text-emerald-500" />
//                     Your Certificates ({completedCourses.length})
//                   </CardTitle>
//                   <CardDescription>
//                     Professional certifications earned through course completion
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="grid gap-4 md:grid-cols-2">
//                     {completedCourses.map(course => (
//                       <div key={course.id} className="p-4 rounded-lg border border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 to-transparent">
//                         <div className="flex items-center justify-between">
//                           <div>
//                             <h4 className="font-semibold">{course.title}</h4>
//                             <p className="text-sm text-muted-foreground">Issued: {new Date().toLocaleDateString()}</p>
//                           </div>
//                           <Award className="h-8 w-8 text-emerald-500" />
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           ) : (
//             <Card className="border-border/50 backdrop-blur-sm bg-background/80">
//               <CardContent className="py-12 text-center">
//                 <Award className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
//                 <h3 className="text-lg font-semibold mb-2">No completed courses yet</h3>
//                 <p className="text-muted-foreground mb-6">Complete a course to earn your first certificate!</p>
//                 <Button className="bg-gradient-to-r from-primary to-primary/80">
//                   Browse Courses
//                 </Button>
//               </CardContent>
//             </Card>
//           )}
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// }
