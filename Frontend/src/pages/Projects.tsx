
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardDescription as CardDesc, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import FeatureGuard from "@/components/FeatureGuard";
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import {
  Search,
  Users,
  ExternalLink,
  Briefcase,
  Code2,
  Plus,
  FolderKanban,
  GitBranch,
  Calendar,
  Clock,
  Target,
  CheckCircle2,
  Share2,
  Mail,
  Github,
  Globe,
  Video,
  MessageSquare,
  Award,
  TrendingUp,
  FileText,
  Copy,
  X,
  ChevronRight,
  Star,
  UserPlus,
  Users2,
  CalendarDays,
  AlertCircle,
  Rocket,
  Trophy
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const projects = [
  {
    id: 1,
    title: 'E-Commerce Platform',
    description: 'A full-stack e-commerce platform with payment integration, user authentication, and admin dashboard.',
    detailedDescription: 'Build a complete e-commerce solution from scratch. The platform should include user authentication, product catalog, shopping cart, payment gateway integration (Stripe), admin dashboard, and order management system. Focus on creating a responsive design and implementing secure payment processing.',
    techStack: ['React', 'Node.js', 'MongoDB', 'Stripe', 'Express', 'Redux', 'JWT'],
    participants: 45,
    hasInternship: true,
    submissionLink: 'https://forms.google.com/project1',
    duration: '2-3 weeks',
    difficulty: 'Intermediate',
    tasks: [
      { id: 1, title: 'User Authentication System', description: 'Implement JWT-based authentication with email verification', completed: true },
      { id: 2, title: 'Product Catalog', description: 'Create product listing with filters and search', completed: true },
      { id: 3, title: 'Shopping Cart', description: 'Implement cart functionality with local storage', completed: false },
      { id: 4, title: 'Payment Integration', description: 'Integrate Stripe for payment processing', completed: false },
      { id: 5, title: 'Admin Dashboard', description: 'Build dashboard for order and product management', completed: false },
    ],
    requirements: [
      'Must have user authentication',
      'Responsive design for mobile',
      'Payment gateway integration',
      'Admin dashboard',
      'Product reviews and ratings'
    ],
    internshipRequirements: 'Complete all 5 tasks within timeline with clean code and proper documentation',
    teamMembers: [
      { id: 1, name: 'Alex Johnson', role: 'Frontend Lead', avatar: '👨‍💻' },
      { id: 2, name: 'Sarah Miller', role: 'Backend Lead', avatar: '👩‍💻' },
      { id: 3, name: 'David Chen', role: 'UI/UX Designer', avatar: '🎨' },
    ],
    inviteLink: 'https://collab.invite/project1',
    status: 'active'
  },
  {
    id: 2,
    title: 'AI Chatbot',
    description: 'Build an intelligent chatbot using natural language processing and machine learning.',
    detailedDescription: 'Develop a conversational AI chatbot using modern NLP techniques. The chatbot should understand user intent, maintain conversation context, and provide intelligent responses. Implement both rule-based and ML-based approaches for better accuracy.',
    techStack: ['Python', 'TensorFlow', 'Flask', 'NLP', 'NLTK', 'DialogFlow'],
    participants: 32,
    hasInternship: true,
    submissionLink: 'https://forms.google.com/project2',
    duration: '3-4 weeks',
    difficulty: 'Advanced',
    tasks: [
      { id: 1, title: 'Dataset Collection', description: 'Collect and clean training data', completed: true },
      { id: 2, title: 'Model Training', description: 'Train NLP model with TensorFlow', completed: false },
      { id: 3, title: 'API Development', description: 'Create Flask API for chatbot', completed: false },
      { id: 4, title: 'UI Interface', description: 'Build web interface for chatbot', completed: false },
    ],
    requirements: [
      'Intent recognition',
      'Context preservation',
      'Multi-language support',
      'Error handling',
      'API documentation'
    ],
    internshipRequirements: 'Achieve 85%+ accuracy on test dataset with working API',
    teamMembers: [
      { id: 1, name: 'Priya Sharma', role: 'ML Engineer', avatar: '🤖' },
      { id: 2, name: 'Mike Brown', role: 'Full Stack', avatar: '👨‍💻' },
    ],
    inviteLink: 'https://collab.invite/project2',
    status: 'active'
  },
  {
    id: 3,
    title: 'Task Management App',
    description: 'A collaborative task management application with real-time updates and team features.',
    detailedDescription: 'Create a Trello-like task management application with real-time collaboration features. Include drag-and-drop functionality, team management, notifications, and progress tracking.',
    techStack: ['React', 'Firebase', 'TypeScript', 'Socket.io', 'Tailwind'],
    participants: 28,
    hasInternship: false,
    submissionLink: 'https://forms.google.com/project3',
    duration: '2 weeks',
    difficulty: 'Intermediate',
    tasks: [
      { id: 1, title: 'Task Board UI', description: 'Design drag-drop task board', completed: true },
      { id: 2, title: 'Real-time Updates', description: 'Implement Socket.io for live updates', completed: false },
      { id: 3, title: 'User Authentication', description: 'Add Firebase authentication', completed: false },
    ],
    requirements: [
      'Real-time collaboration',
      'Drag and drop functionality',
      'Team invitations',
      'Progress charts',
      'Mobile responsive'
    ],
    internshipRequirements: null,
    teamMembers: [],
    inviteLink: 'https://collab.invite/project3',
    status: 'open'
  },
  {
    id: 4,
    title: 'Weather Dashboard',
    description: 'Create a weather dashboard with data visualization and location-based forecasts.',
    detailedDescription: 'Build a weather application that displays current weather, forecasts, and historical data with beautiful visualizations. Include map integration and location-based services.',
    techStack: ['React', 'D3.js', 'Weather API', 'Leaflet', 'Chart.js'],
    participants: 52,
    hasInternship: false,
    submissionLink: 'https://forms.google.com/project4',
    duration: '1 week',
    difficulty: 'Beginner',
    tasks: [
      { id: 1, title: 'API Integration', description: 'Connect to weather API', completed: true },
      { id: 2, title: 'Data Visualization', description: 'Create charts with D3.js', completed: false },
      { id: 3, title: 'Map Integration', description: 'Add interactive map', completed: false },
    ],
    requirements: [
      'Real-time weather data',
      'Interactive charts',
      'Location detection',
      'Multiple city support',
      'Dark/light theme'
    ],
    internshipRequirements: null,
    teamMembers: [
      { id: 1, name: 'Emma Wilson', role: 'Frontend Dev', avatar: '👩‍💻' },
    ],
    inviteLink: 'https://collab.invite/project4',
    status: 'active'
  },
];

const internshipPartners = [
  { id: 1, name: 'Google', logo: '🔴', projects: 12 },
  { id: 2, name: 'Microsoft', logo: '🔵', projects: 8 },
  { id: 3, name: 'Amazon', logo: '🟠', projects: 15 },
  { id: 4, name: 'Meta', logo: '🔷', projects: 6 },
];

export default function Projects() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showInternshipOnly, setShowInternshipOnly] = useState(false);
  const [selectedProject, setSelectedProject] = useState(projects[0]);
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [submissionForm, setSubmissionForm] = useState({
    name: '',
    email: '',
    githubRepo: '',
    liveLink: '',
    description: '',
    projectId: 0
  });
  const { toast } = useToast();

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.techStack.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesInternship = !showInternshipOnly || project.hasInternship;
    return matchesSearch && matchesInternship;
  });

  const handleSubmitForm = () => {
    if (!submissionForm.name || !submissionForm.email || !submissionForm.githubRepo) {
      toast({
        title: 'Missing Information',
        description: 'Please fill all required fields',
        variant: 'destructive'
      });
      return;
    }

    toast({
      title: '🎉 Project Submitted Successfully!',
      description: 'We will review your submission and get back to you via email within 3-5 business days.',
      duration: 5000,
    });

    // Reset form
    setSubmissionForm({
      name: '',
      email: '',
      githubRepo: '',
      liveLink: '',
      description: '',
      projectId: 0
    });
    setIsSubmitDialogOpen(false);
  };

  const handleCopyInviteLink = () => {
    navigator.clipboard.writeText(selectedProject.inviteLink);
    toast({
      title: 'Link Copied!',
      description: 'Invite link copied to clipboard',
    });
  };

  const handleInviteByEmail = () => {
    toast({
      title: 'Invitations Sent',
      description: 'Project invitations sent to provided emails',
    });
    setIsInviteDialogOpen(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'Intermediate': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'Advanced': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-500/10 text-emerald-500';
      case 'open': return 'bg-blue-500/10 text-blue-500';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };


  return (
    <FeatureGuard feature="projects">
      <div className="space-y-6 animate-fade-in bg-gradient-to-br from-background via-background to-primary/5 min-h-screen p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              Project Collaborations
            </h1>
            <p className="text-muted-foreground mt-1">
              Work on real-world projects and gain practical experience with internship opportunities
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 text-sm bg-gradient-to-r from-primary/10 to-primary/5 px-4 py-2 rounded-lg border border-primary/20">
              <FolderKanban className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">{projects.reduce((acc, p) => acc + p.participants, 0)} Participants</p>
                <p className="text-xs text-muted-foreground">Across all projects</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 px-4 py-2 rounded-lg border border-emerald-500/20">
              <Briefcase className="h-5 w-5 text-emerald-500" />
              <div>
                <p className="font-medium">{projects.filter(p => p.hasInternship).length} Projects</p>
                <p className="text-xs text-muted-foreground">With internship opportunities</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects, technologies, or descriptions..."
              className="pl-10 border-border/50 bg-background/50 backdrop-blur-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={showInternshipOnly ? 'default' : 'outline'}
              onClick={() => setShowInternshipOnly(!showInternshipOnly)}
              className={`gap-2 ${showInternshipOnly ? 'bg-gradient-to-r from-primary to-primary/80' : 'border-border/50'}`}
            >
              <Briefcase className="h-4 w-4" />
              Internship Projects
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-border/50 gap-2">
                  <Plus className="h-4 w-4" />
                  Propose Project
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Propose New Project</DialogTitle>
                  <DialogDescription>
                    Share your project idea with the community
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Project Title</Label>
                    <Input placeholder="Enter project title" />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea placeholder="Describe your project idea" />
                  </div>
                  <div className="space-y-2">
                    <Label>Estimated Duration</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 week</SelectItem>
                        <SelectItem value="2">2 weeks</SelectItem>
                        <SelectItem value="3">3 weeks</SelectItem>
                        <SelectItem value="4">4+ weeks</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button>Submit Proposal</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Internship Partners */}
        {showInternshipOnly && (
          <Card className="border-border/50 backdrop-blur-sm bg-background/80">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-500" />
                Internship Partners
              </CardTitle>
              <CardDescription>
                Companies offering internships for successful project completion
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {internshipPartners.map(partner => (
                  <div key={partner.id} className="p-4 rounded-lg border border-border/50 bg-gradient-to-br from-background to-background/50 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-xl">
                      {partner.logo}
                    </div>
                    <div>
                      <p className="font-semibold">{partner.name}</p>
                      <p className="text-sm text-muted-foreground">{partner.projects} projects</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Projects List */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Available Projects</h2>
              <Badge variant="outline" className="text-xs">
                {filteredProjects.length} projects
              </Badge>
            </div>

            <div className="space-y-3">
              {filteredProjects.map((project) => (
                <Card
                  key={project.id}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-lg border-border/50 backdrop-blur-sm bg-background/80 ${selectedProject.id === project.id ? 'ring-2 ring-primary/30' : ''
                    }`}
                  onClick={() => setSelectedProject(project)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                        <Code2 className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex gap-1">
                        {project.hasInternship && (
                          <Badge className="bg-gradient-to-r from-amber-500/10 to-amber-500/5 text-amber-500 border-amber-500/20 text-xs">
                            <Briefcase className="h-3 w-3 mr-1" />
                            Internship
                          </Badge>
                        )}
                        <Badge variant="outline" className={`text-xs ${getStatusColor(project.status)}`}>
                          {project.status}
                        </Badge>
                      </div>
                    </div>
                    <h3 className="font-semibold text-sm mb-1">{project.title}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{project.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs">
                        <Users className="h-3 w-3" />
                        {project.participants}
                        <Clock className="h-3 w-3 ml-2" />
                        {project.duration}
                      </div>
                      <Badge variant="outline" className={`text-xs ${getDifficultyColor(project.difficulty)}`}>
                        {project.difficulty}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Project Details */}
          <Card className="lg:col-span-2 border-border/50 backdrop-blur-sm bg-background/80">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-2xl">{selectedProject.title}</CardTitle>
                    {selectedProject.hasInternship && (
                      <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                        <Rocket className="h-3 w-3 mr-1" />
                        Internship Opportunity
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="text-base">
                    {selectedProject.description}
                  </CardDescription>
                </div>
                <Badge className={getDifficultyColor(selectedProject.difficulty)}>
                  {selectedProject.difficulty}
                </Badge>
              </div>
            </CardHeader>

            <Tabs defaultValue="details" className="w-full">
              <TabsList className="w-full bg-background/50 border-b border-border/50 rounded-none">
                <TabsTrigger value="details" className="data-[state=active]:border-b-2 data-[state=active]:border-primary">
                  <FileText className="h-4 w-4 mr-2" />
                  Project Details
                </TabsTrigger>
                <TabsTrigger value="tasks" className="data-[state=active]:border-b-2 data-[state=active]:border-primary">
                  <Target className="h-4 w-4 mr-2" />
                  Tasks ({selectedProject.tasks.length})
                </TabsTrigger>
                <TabsTrigger value="collaborate" className="data-[state=active]:border-b-2 data-[state=active]:border-primary">
                  <Users2 className="h-4 w-4 mr-2" />
                  Collaborate
                </TabsTrigger>
                <TabsTrigger value="submit" className="data-[state=active]:border-b-2 data-[state=active]:border-primary">
                  <Award className="h-4 w-4 mr-2" />
                  Submit Project
                </TabsTrigger>
              </TabsList>

              {/* Details Tab */}
              <TabsContent value="details" className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Detailed Description
                  </h3>
                  <p className="text-muted-foreground">{selectedProject.detailedDescription}</p>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Code2 className="h-5 w-5 text-primary" />
                    Technology Stack
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.techStack.map(tech => (
                      <Badge key={tech} variant="secondary" className="text-sm py-1.5">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border-border/50">
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-primary" />
                        Project Timeline
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Duration</span>
                          <span className="font-medium">{selectedProject.duration}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Status</span>
                          <Badge variant="outline" className={getStatusColor(selectedProject.status)}>
                            {selectedProject.status}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Participants</span>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span className="font-medium">{selectedProject.participants}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-border/50">
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        Requirements
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {selectedProject.requirements.map((req, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <div className="h-4 w-4 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <CheckCircle2 className="h-2.5 w-2.5 text-primary" />
                            </div>
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                {selectedProject.hasInternship && (
                  <Card className="border-amber-500/20 bg-gradient-to-r from-amber-500/5 to-transparent">
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center gap-2 text-amber-500">
                        <Briefcase className="h-4 w-4" />
                        Internship Opportunity
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-3">
                        Complete this project successfully to qualify for internship interviews with our partner companies.
                      </p>
                      <div className="space-y-2">
                        <p className="font-medium text-sm">Requirements for internship consideration:</p>
                        <p className="text-sm text-muted-foreground">{selectedProject.internshipRequirements}</p>
                      </div>
                      <div className="mt-4 flex items-center gap-2 text-sm">
                        <AlertCircle className="h-4 w-4 text-amber-500" />
                        <span>Complete all tasks and submit before deadline for internship eligibility</span>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Tasks Tab */}
              <TabsContent value="tasks" className="p-6 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Project Tasks</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Complete all tasks within {selectedProject.duration} to finish the project
                  </p>
                </div>

                <div className="space-y-3">
                  {selectedProject.tasks.map(task => (
                    <div
                      key={task.id}
                      className={`p-4 rounded-lg border transition-all duration-300 ${task.completed
                        ? 'bg-gradient-to-r from-emerald-500/10 to-transparent border-emerald-500/20'
                        : 'bg-muted/30 border-border/50 hover:bg-muted/50'
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${task.completed
                            ? 'bg-emerald-500/20 text-emerald-500'
                            : 'bg-primary/10 text-primary'
                            }`}>
                            {task.completed ? (
                              <CheckCircle2 className="h-4 w-4" />
                            ) : (
                              <Target className="h-4 w-4" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium">{task.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                          </div>
                        </div>
                        <Badge variant={task.completed ? "default" : "outline"}>
                          {task.completed ? 'Completed' : 'Pending'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-border/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Progress</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedProject.tasks.filter(t => t.completed).length} of {selectedProject.tasks.length} tasks completed
                      </p>
                    </div>
                    <Progress
                      value={(selectedProject.tasks.filter(t => t.completed).length / selectedProject.tasks.length) * 100}
                      className="w-32 h-2"
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Collaborate Tab */}
              <TabsContent value="collaborate" className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Users2 className="h-5 w-5 text-primary" />
                    Team Collaboration
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Invite team members to collaborate on this project
                  </p>
                </div>

                {/* Current Team Members */}
                {selectedProject.teamMembers.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-3">Current Team Members</h4>
                    <div className="space-y-3">
                      {selectedProject.teamMembers.map(member => (
                        <div key={member.id} className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-muted/30">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-lg">
                              {member.avatar}
                            </div>
                            <div>
                              <p className="font-medium">{member.name}</p>
                              <p className="text-sm text-muted-foreground">{member.role}</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Separator />

                {/* Invite Section */}
                <div>
                  <h4 className="font-medium mb-3">Invite Collaborators</h4>

                  <div className="space-y-4">
                    {/* Invite Link */}
                    <Card className="border-border/50">
                      <CardHeader>
                        <CardTitle className="text-sm">Share Invite Link</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-2">
                          <Input
                            value={selectedProject.inviteLink}
                            readOnly
                            className="bg-muted/30 border-border/50"
                          />
                          <Button onClick={handleCopyInviteLink} className="gap-2">
                            <Copy className="h-4 w-4" />
                            Copy
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Share this link with collaborators. Anyone with the link can join the project.
                        </p>
                      </CardContent>
                    </Card>

                    {/* Invite by Email */}
                    <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="w-full gap-2" variant="outline">
                          <Mail className="h-4 w-4" />
                          Invite by Email
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Invite Team Members</DialogTitle>
                          <DialogDescription>
                            Send email invitations to collaborators
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label>Email Addresses</Label>
                            <Textarea
                              placeholder="Enter email addresses separated by commas"
                              className="min-h-[100px]"
                            />
                            <p className="text-xs text-muted-foreground">
                              Enter multiple emails separated by commas
                            </p>
                          </div>
                          <div className="space-y-2">
                            <Label>Custom Message (Optional)</Label>
                            <Textarea
                              placeholder="Add a personal message"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={handleInviteByEmail} className="gap-2">
                            <Mail className="h-4 w-4" />
                            Send Invitations
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </TabsContent>

              {/* Submit Tab */}
              <TabsContent value="submit" className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    Submit Your Project
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Complete the form below to submit your project for review. Make sure all tasks are completed.
                  </p>
                </div>

                <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      className="w-full py-6 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                      size="lg"
                      onClick={() => setSubmissionForm({ ...submissionForm, projectId: selectedProject.id })}
                    >
                      <Rocket className="h-5 w-5 mr-2" />
                      Submit Project for Review
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Project Submission Form</DialogTitle>
                      <DialogDescription>
                        Fill out the form to submit "{selectedProject.title}" for review
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name *</Label>
                          <Input
                            id="name"
                            placeholder="Enter your full name"
                            value={submissionForm.name}
                            onChange={(e) => setSubmissionForm({ ...submissionForm, name: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address *</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={submissionForm.email}
                            onChange={(e) => setSubmissionForm({ ...submissionForm, email: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="githubRepo">
                          <Github className="h-4 w-4 inline mr-2" />
                          GitHub Repository URL *
                        </Label>
                        <Input
                          id="githubRepo"
                          placeholder="https://github.com/your-username/project-repo"
                          value={submissionForm.githubRepo}
                          onChange={(e) => setSubmissionForm({ ...submissionForm, githubRepo: e.target.value })}
                        />
                        <p className="text-xs text-muted-foreground">
                          Make sure your repository is public or provide access
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="liveLink">
                          <Globe className="h-4 w-4 inline mr-2" />
                          Live Demo URL (Optional)
                        </Label>
                        <Input
                          id="liveLink"
                          placeholder="https://your-project.vercel.app"
                          value={submissionForm.liveLink}
                          onChange={(e) => setSubmissionForm({ ...submissionForm, liveLink: e.target.value })}
                        />
                        <p className="text-xs text-muted-foreground">
                          Netlify, Vercel, GitHub Pages, or any hosting service
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Project Description</Label>
                        <Textarea
                          id="description"
                          placeholder="Briefly describe your implementation, challenges faced, and features implemented"
                          className="min-h-[120px]"
                          value={submissionForm.description}
                          onChange={(e) => setSubmissionForm({ ...submissionForm, description: e.target.value })}
                        />
                      </div>

                      {selectedProject.hasInternship && (
                        <div className="p-4 rounded-lg bg-gradient-to-r from-amber-500/10 to-amber-500/5 border border-amber-500/20">
                          <div className="flex items-center gap-2 mb-2">
                            <Briefcase className="h-4 w-4 text-amber-500" />
                            <p className="text-sm font-medium text-amber-500">Internship Consideration</p>
                          </div>
                          <p className="text-sm">
                            By submitting this project, you're applying for internship opportunities with our partner companies.
                            Ensure your code follows best practices and includes proper documentation.
                          </p>
                        </div>
                      )}
                    </div>

                    <DialogFooter>
                      <Button
                        onClick={handleSubmitForm}
                        className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Submit Project
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Submission Checklist */}
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="text-sm">Submission Checklist</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        'All project tasks completed',
                        'Code pushed to GitHub repository',
                        'Live demo deployed (if applicable)',
                        'README.md with setup instructions',
                        'Clean and commented code',
                        selectedProject.hasInternship && 'Professional documentation'
                      ].filter(Boolean).map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="h-5 w-5 rounded-full border border-primary/30 flex items-center justify-center flex-shrink-0">
                            <CheckCircle2 className="h-3 w-3 text-primary" />
                          </div>
                          <span className="text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </FeatureGuard>
  );
}