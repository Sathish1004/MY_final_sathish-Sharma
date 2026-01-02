
import { useState, useEffect } from 'react';
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
import { useAuth } from '@/contexts/AuthContext';
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
  Trophy,
  Image as ImageIcon
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';

// Hardcoded projects removed and replaced with dynamic fetching logic.

export default function Projects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [stats, setStats] = useState({ activeProjects: 0, activeDevelopers: 0 });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [submissionForm, setSubmissionForm] = useState({
    name: '',
    email: '',
    githubUrl: '',
    liveDemoUrl: '',
    techStack: '',
    isOriginalWork: false,
    images: [] as string[],
    description: '',
    projectId: 0
  });
  const [uploading, setUploading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [showInternshipsOnly, setShowInternshipsOnly] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/projects`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      const data = await response.json();
      if (response.ok) {
        setProjects(data);
      }
    } catch (error) {
      console.error('Fetch Projects error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/api/projects/stats`);
      const data = await response.json();
      if (response.ok) {
        setStats(data);
      }
    } catch (error) {
      console.error('Fetch Stats error:', error);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchStats();
  }, []);

  // Auto-fill user details
  useEffect(() => {
    if (user) {
      setSubmissionForm(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.tech_stack && project.tech_stack.some((t: string) => t.toLowerCase().includes(searchQuery.toLowerCase()))) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesInternship = showInternshipsOnly ? Boolean(project.is_internship) : true;

    return matchesSearch && matchesInternship;
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + submissionForm.images.length > 3) {
      toast({
        title: 'Limit Exceeded',
        description: 'You can only upload up to 3 screenshots',
        variant: 'destructive'
      });
      return;
    }

    const validFiles = files.filter(file => {
      const isValidType = ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type);
      const isValidSize = file.size <= 2 * 1024 * 1024;
      if (!isValidType) toast({ title: 'Invalid Type', description: `${file.name} is not a valid image format`, variant: 'destructive' });
      if (!isValidSize) toast({ title: 'File Too Large', description: `${file.name} exceeds 2MB limit`, variant: 'destructive' });
      return isValidType && isValidSize;
    });

    if (validFiles.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    validFiles.forEach(file => formData.append('images', file));

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      const data = await response.json();
      if (response.ok) {
        setSubmissionForm(prev => ({
          ...prev,
          images: [...prev.images, ...data.urls]
        }));
        // For previews, use the newly uploaded URLs (prefixed with API_URL)
        const newPreviews = data.urls.map((url: string) => `${API_URL}${url}`);
        setImagePreviews(prev => [...prev, ...newPreviews]);
      } else {
        throw new Error(data.message || 'Upload failed');
      }
    } catch (error: any) {
      toast({ title: 'Upload Error', description: error.message, variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setSubmissionForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmitForm = async () => {
    if (!submissionForm.name || !submissionForm.email || !submissionForm.githubUrl || submissionForm.images.length === 0) {
      toast({
        title: 'Missing Information',
        description: 'Please fill all required fields and upload at least one screenshot',
        variant: 'destructive'
      });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/projects/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(submissionForm)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit project');
      }

      toast({
        title: 'Project Submitted Successfully!',
        description: 'We will review your submission and get back to you via email within 3-5 business days.',
        duration: 5000,
      });

      // Reset form but keep user info
      setSubmissionForm(prev => ({
        ...prev,
        githubUrl: '',
        liveDemoUrl: '',
        techStack: '',
        isOriginalWork: false,
        images: [],
        description: '',
        projectId: 0
      }));
      setImagePreviews([]);
      setIsSubmitDialogOpen(false);

      // Refresh project list
      fetchProjects();
    } catch (error: any) {
      toast({
        title: 'Submission Error',
        description: error.message,
        variant: 'destructive'
      });
    }
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
    switch (status.toLowerCase()) {
      case 'active': return 'bg-emerald-500/10 text-emerald-500';
      case 'open': return 'bg-blue-500/10 text-blue-500';
      case 'closed': return 'bg-rose-500/10 text-rose-500';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  const isGithubUrlValid = (url: string) => !url || url.startsWith('https://github.com/');
  const isLiveLinkValid = (url: string) => !url || url.startsWith('http://') || url.startsWith('https://');

  const isFormValid =
    submissionForm.name &&
    submissionForm.email &&
    submissionForm.githubUrl &&
    isGithubUrlValid(submissionForm.githubUrl) &&
    isLiveLinkValid(submissionForm.liveDemoUrl) &&
    submissionForm.techStack &&
    submissionForm.isOriginalWork &&
    submissionForm.images.length > 0;

  const handleShowInterest = async () => {
    if (!selectedProject) return;

    const token = localStorage.getItem('token');
    if (!user || !token) {
      toast({
        title: "Authentication Required",
        description: "Please login to show interest in projects.",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/projects/interest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          projectId: selectedProject.id
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to record interest');
      }

      toast({
        title: "Interest Recorded",
        description: "We've notified the project owner of your interest. Check your dashboard for updates.",
        className: "bg-emerald-500 text-white border-none",
        duration: 5000,
      });

      // Refresh data
      fetchProjects();
      fetchStats();

      // Update selected project to reflect new status/interest and increment participants
      setSelectedProject(prev => prev ? {
        ...prev,
        isInterested: true,
        status: 'active',
        participants: (prev.participants || 0) + 1
      } : null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <FeatureGuard feature="projects">
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 md:p-6 animate-in fade-in duration-500">

        {/* Detail View */}
        {selectedProject ? (
          <div className="animate-in slide-in-from-right-8 duration-300 container mx-auto max-w-6xl">
            <Button
              variant="ghost"
              onClick={() => setSelectedProject(null)}
              className="mb-4 hover:bg-muted/50 gap-2 group"
            >
              <div className="bg-primary/10 p-1 rounded-full group-hover:bg-primary/20 transition-colors">
                <ChevronRight className="h-4 w-4 rotate-180 text-primary" />
              </div>
              <span className="font-medium">Back to Projects</span>
            </Button>

            <Card className="border-border/50 backdrop-blur-sm bg-background/80 shadow-lg">
              <CardHeader className="pb-4 border-b border-border/50 bg-muted/20">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/10 shadow-sm">
                        <Code2 className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-3xl font-bold">{selectedProject.title}</CardTitle>
                          {Boolean(selectedProject.is_internship) && (
                            <Badge className="bg-orange-500 text-white hover:bg-orange-600 border-none gap-1.5 px-3 py-1 text-[11px] rounded-full font-medium shadow-sm">
                              <Trophy className="h-3.5 w-3.5" /> Internship Opportunity
                            </Badge>
                          )}
                        </div>
                        <Badge variant="outline" className={`${getStatusColor(selectedProject.status)} mt-2`}>
                          {selectedProject.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={`${getDifficultyColor(selectedProject.difficulty)} text-sm px-3 py-1`}>
                      {selectedProject.difficulty}
                    </Badge>
                    <Button
                      onClick={handleShowInterest}
                      disabled={selectedProject.isInterested}
                      className={`${selectedProject.isInterested ? 'bg-secondary text-secondary-foreground' : 'bg-primary text-primary-foreground'} hover:bg-primary/90 shadow-sm`}
                    >
                      {selectedProject.isInterested ? 'Interest Sent' : 'Show Interest'}
                    </Button>
                  </div>
                </div>
                <p className="text-lg text-muted-foreground mt-4 leading-relaxed max-w-3xl">
                  {selectedProject.description}
                </p>
              </CardHeader>

              <Tabs defaultValue="details" className="w-full">
                <TabsList className="w-full justify-start overflow-x-auto bg-background/50 border-b border-border/50 rounded-none h-14 px-4 gap-6">
                  <TabsTrigger value="details" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none h-14 px-2 font-medium">
                    <FileText className="h-4 w-4 mr-2" />
                    Project Details
                  </TabsTrigger>
                  <TabsTrigger value="submit" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none h-14 px-2 font-medium">
                    <Award className="h-4 w-4 mr-2" />
                    Submit Project
                  </TabsTrigger>
                </TabsList>

                {/* Details Tab */}
                <TabsContent value="details" className="p-6 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                      {Boolean(selectedProject.is_internship) && (
                        <div className="bg-orange-500/5 border border-orange-500/20 rounded-xl p-6">
                          <h3 className="text-orange-500 font-semibold mb-3 flex items-center gap-2">
                            <Briefcase className="h-5 w-5" /> Internship Opportunity
                          </h3>
                          <p className="text-sm text-foreground/80 mb-4">
                            Complete this project successfully to qualify for internship interviews with our partner companies.
                          </p>
                          <div className="space-y-3">
                            <h4 className="text-sm font-medium text-foreground/90">Requirements for internship consideration:</h4>
                            <ul className="space-y-2">
                              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                                <div className="h-1.5 w-1.5 rounded-full bg-orange-400 mt-2" />
                                Complete all 5 tasks within timeline with clean code and proper documentation
                              </li>
                            </ul>
                            <div className="flex items-center gap-2 text-xs text-orange-500/80 mt-4 bg-orange-500/10 p-2 rounded-lg w-fit">
                              <AlertCircle className="h-3.5 w-3.5" />
                              <span>Complete all tasks and submit before deadline for internship eligibility</span>
                            </div>
                          </div>
                        </div>
                      )}
                      <div>
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                          <FileText className="h-5 w-5 text-primary" />
                          Detailed Overview
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">{selectedProject.detailed_description || selectedProject.description}</p>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <Code2 className="h-5 w-5 text-primary" />
                          Technology Stack
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedProject.tech_stack && selectedProject.tech_stack.map((tech: string) => (
                            <Badge key={tech} variant="secondary" className="text-sm px-3 py-1.5 hover:bg-secondary/80 transition-colors">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <Trophy className="h-5 w-5 text-primary" />
                          Learning Objectives
                        </h3>
                        <div className="bg-primary/5 rounded-xl border border-primary/10 p-5 space-y-4">
                          <p className="text-sm text-primary/80 font-medium italic">
                            By working on this project, you will:
                          </p>
                          <ul className="space-y-3">
                            {selectedProject.learning_objectives?.map((objective: string, index: number) => (
                              <li key={index} className="flex items-start gap-3 text-sm">
                                <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                </div>
                                <span className="text-muted-foreground leading-relaxed">{objective}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <Card className="border-border/50 shadow-sm">
                        <CardHeader className="pb-3 bg-muted/20">
                          <CardTitle className="text-sm flex items-center gap-2 font-semibold">
                            <CalendarDays className="h-4 w-4 text-primary" />
                            Project Info
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-4">
                          <div className="flex items-center justify-between p-2 rounded hover:bg-muted/50 transition-colors">
                            <span className="text-sm text-muted-foreground">Duration</span>
                            <span className="font-medium flex items-center gap-2">
                              <Clock className="h-3.5 w-3.5" />
                              {selectedProject.duration}
                            </span>
                          </div>
                          <Separator />
                          <div className="flex items-center justify-between p-2 rounded hover:bg-muted/50 transition-colors">
                            <span className="text-sm text-muted-foreground">Status</span>
                            <Badge variant="outline" className={getStatusColor(selectedProject.status)}>
                              {selectedProject.status}
                            </Badge>
                          </div>
                          <Separator />
                          <div className="flex items-center justify-between p-2 rounded hover:bg-muted/50 transition-colors">
                            <span className="text-sm text-muted-foreground">Participants</span>
                            <div className="flex items-center gap-1 font-medium">
                              <Users className="h-4 w-4 text-primary" />
                              <span>{selectedProject.participants}</span>
                            </div>
                          </div>
                          <Separator />
                          <div className="flex items-center justify-between p-2 rounded hover:bg-muted/50 transition-colors">
                            <span className="text-sm text-muted-foreground">Difficulty</span>
                            <Badge variant="outline" className={`text-xs ${getDifficultyColor(selectedProject.difficulty)} border-current bg-transparent`}>
                              {selectedProject.difficulty}
                            </Badge>
                          </div>
                          {selectedProject.isInterested && selectedProject.deadline && (
                            <>
                              <Separator />
                              <div className="flex flex-col gap-2 p-2 rounded bg-primary/5 border border-primary/10">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-semibold text-primary uppercase tracking-wider">Submission Deadline</span>
                                  <Calendar className="h-3.5 w-3.5 text-primary" />
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-sm font-bold">{new Date(selectedProject.deadline).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                                  <span className={`text-[11px] font-medium ${selectedProject.interestStatus === 'expired' ? 'text-rose-500' : 'text-primary/70'}`}>
                                    {selectedProject.interestStatus === 'expired' ? 'Deadline Passed' : (
                                      `Time remaining: ${Math.ceil((new Date(selectedProject.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days`
                                    )}
                                  </span>
                                </div>
                              </div>
                            </>
                          )}
                        </CardContent>
                      </Card>

                      <Card className="border-border/50 shadow-sm">
                        <CardHeader className="pb-3 bg-muted/20">
                          <CardTitle className="text-sm flex items-center gap-2 font-semibold">
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                            Key Requirements
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <ul className="space-y-3">
                            {selectedProject.requirements?.map((req: string, index: number) => (
                              <li key={index} className="flex items-start gap-3 text-sm">
                                <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                  <CheckCircle2 className="h-3 w-3 text-primary" />
                                </div>
                                <span className="text-muted-foreground">{req}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>


                {/* Submit Tab */}
                <TabsContent value="submit" className="p-6 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="max-w-2xl mx-auto text-center py-8">
                    <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Award className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Ready to Submit?</h3>
                    <p className="text-muted-foreground mb-8 text-lg">
                      Great job! Make sure you have completed all tasks and met the requirements before submitting.
                    </p>

                    <Card className="text-left mb-8 border-border/50 bg-muted/20">
                      <CardContent className="pt-6">
                        <h4 className="font-medium mb-4">Submission Checklist:</h4>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                            <span>Project structure completed</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                            <span>Core functionality working correctly</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                            <span>Responsive design verified</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                            <span>Code pushed to repository</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                            <span>Basic documentation added</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {selectedProject.interestStatus === 'expired' ? (
                      <div className="bg-rose-500/10 text-rose-500 p-6 rounded-xl border border-rose-500/20 max-w-md mx-auto mb-8 text-center">
                        <Clock className="h-10 w-10 mx-auto mb-3" />
                        <h4 className="text-xl font-bold mb-1">Deadline Passed</h4>
                        <p className="text-sm italic mb-2">Expired on {new Date(selectedProject.deadline).toLocaleDateString()}</p>
                        <p className="text-sm">Unfortunately, the 7-day submission window for this project has closed.</p>
                      </div>
                    ) : !selectedProject.isInterested && (
                      <div className="bg-amber-500/10 text-amber-500 p-6 rounded-xl border border-amber-500/20 max-w-md mx-auto mb-8 text-center">
                        <AlertCircle className="h-10 w-10 mx-auto mb-3" />
                        <h4 className="text-xl font-bold mb-1">Interest Required</h4>
                        <p className="text-sm">Please show interest in this project before submitting.</p>
                      </div>
                    )}

                    {selectedProject.isSubmitted ? (
                      <div className="bg-emerald-500/10 text-emerald-500 p-6 rounded-xl border border-emerald-500/20 max-w-md mx-auto">
                        <CheckCircle2 className="h-10 w-10 mx-auto mb-3" />
                        <h4 className="text-xl font-bold mb-1">Project Submitted</h4>
                        <p className="text-sm">You have already submitted this project for review. We'll get back to you soon.</p>
                      </div>
                    ) : (
                      <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
                        <DialogTrigger asChild>
                          <Button
                            className="w-full sm:w-auto px-8 py-6 text-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all"
                            onClick={() => setSubmissionForm({ ...submissionForm, projectId: selectedProject.id })}
                            disabled={!selectedProject.isInterested || selectedProject.interestStatus === 'expired'}
                          >
                            {selectedProject.interestStatus === 'expired' ? 'Deadline Passed' : 'Submit Project for Review'}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Project Submission Form</DialogTitle>
                            <DialogDescription>
                              Fill out the form to submit "{selectedProject.title}" for review
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4 text-left max-h-[70vh] overflow-y-auto px-1">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Full Name</Label>
                                <Input
                                  placeholder="Your name"
                                  value={submissionForm.name}
                                  readOnly
                                  className="bg-muted"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Email</Label>
                                <Input
                                  placeholder="your@email.com"
                                  value={submissionForm.email}
                                  readOnly
                                  className="bg-muted"
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label>GitHub Repository <span className="text-destructive">*</span></Label>
                              <Input
                                placeholder="https://github.com/username/repo"
                                value={submissionForm.githubUrl}
                                onChange={(e) => setSubmissionForm({ ...submissionForm, githubUrl: e.target.value })}
                                className={!isGithubUrlValid(submissionForm.githubUrl) ? 'border-destructive focus-visible:ring-destructive' : ''}
                              />
                              {!isGithubUrlValid(submissionForm.githubUrl) && (
                                <p className="text-[10px] font-medium text-destructive mt-1 flex items-center gap-1">
                                  <AlertCircle className="h-3 w-3" />
                                  GitHub URL must start with https://github.com/
                                </p>
                              )}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Live Demo Link (Optional)</Label>
                                <Input
                                  placeholder="https://project-demo.com"
                                  value={submissionForm.liveDemoUrl}
                                  onChange={(e) => setSubmissionForm({ ...submissionForm, liveDemoUrl: e.target.value })}
                                  className={!isLiveLinkValid(submissionForm.liveDemoUrl) ? 'border-destructive focus-visible:ring-destructive' : ''}
                                />
                                {!isLiveLinkValid(submissionForm.liveDemoUrl) && (
                                  <p className="text-[10px] font-medium text-destructive mt-1 flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" />
                                    URL must start with http:// or https://
                                  </p>
                                )}
                              </div>
                              <div className="space-y-2">
                                <Label>Tech Stack Used <span className="text-destructive">*</span></Label>
                                <Input
                                  placeholder="e.g. React, Next.js, Node.js"
                                  value={submissionForm.techStack}
                                  onChange={(e) => setSubmissionForm({ ...submissionForm, techStack: e.target.value })}
                                />
                              </div>
                            </div>
                            <div className="space-y-3">
                              <Label>Project Screenshots (1-3) <span className="text-destructive">*</span></Label>
                              <div className="grid grid-cols-3 gap-4">
                                {imagePreviews.map((url, index) => (
                                  <div key={index} className="relative aspect-video rounded-lg overflow-hidden border border-border group">
                                    <img src={url} alt={`Screenshot ${index + 1}`} className="w-full h-full object-cover" />
                                    <button
                                      onClick={() => removeImage(index)}
                                      className="absolute top-1 right-1 bg-destructive text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  </div>
                                ))}
                                {imagePreviews.length < 3 && (
                                  <label className={`
                                    flex flex-col items-center justify-center aspect-video rounded-lg border-2 border-dashed border-muted-foreground/25 
                                    hover:border-primary/50 hover:bg-primary/5 cursor-pointer transition-all
                                    ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
                                  `}>
                                    <div className="flex flex-col items-center justify-center py-2">
                                      <ImageIcon className="h-6 w-6 text-muted-foreground mb-1" />
                                      <span className="text-[10px] text-muted-foreground font-medium">
                                        {uploading ? 'Uploading...' : 'Add Image'}
                                      </span>
                                    </div>
                                    <input
                                      type="file"
                                      className="hidden"
                                      accept=".jpg,.jpeg,.png"
                                      onChange={handleFileChange}
                                      disabled={uploading}
                                      multiple
                                    />
                                  </label>
                                )}
                              </div>
                              <p className="text-[10px] text-muted-foreground italic">
                                Support JPG, JPEG, PNG. Max 2MB per image.
                              </p>
                            </div>

                            <div className="space-y-2">
                              <Label>Project Description / Notes</Label>
                              <Textarea
                                placeholder="Tell us about your implementation, challenges faced, etc."
                                value={submissionForm.description}
                                onChange={(e) => setSubmissionForm({ ...submissionForm, description: e.target.value })}
                                className="min-h-[100px]"
                              />
                            </div>
                            <div className="flex items-start space-x-2 pt-2">
                              <input
                                type="checkbox"
                                id="originalWork"
                                className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                checked={submissionForm.isOriginalWork}
                                onChange={(e) => setSubmissionForm({ ...submissionForm, isOriginalWork: e.target.checked })}
                              />
                              <label htmlFor="originalWork" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                I confirm this project is my original work. <span className="text-destructive">*</span>
                              </label>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              onClick={handleSubmitForm}
                              disabled={!isFormValid}
                              className="w-full sm:w-auto"
                            >
                              Submit Project
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        ) : (
          /* Projects List */
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 container mx-auto max-w-7xl">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-6 border-b border-border/50">
              <div className="space-y-1">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Project Collaborations
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl">
                  Work on real-world projects and gain practical experience with internship opportunities
                </p>
              </div>


            </div>



            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-64 rounded-xl bg-card border border-border/50 animate-pulse" />
                ))}
              </div>
            ) : (
              <>
                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card/50 p-4 rounded-xl border border-border/50 backdrop-blur-sm sticky top-4 z-10 shadow-sm">
                  <div className="relative flex-1 w-full max-w-lg">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search projects, technologies, or descriptions..."
                      className="pl-10 border-border/50 bg-background/50"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-3">

                    <Button
                      className={`gap-2 ${showInternshipsOnly ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-600 hover:bg-blue-700'} text-white transition-colors`}
                      onClick={() => setShowInternshipsOnly(!showInternshipsOnly)}
                    >
                      {showInternshipsOnly ? 'Show All Projects' : 'Internship Projects'}
                    </Button>
                  </div>
                </div>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProjects.map((project) => (
                    <Card
                      key={project.id}
                      className="group cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-border/50 overflow-hidden flex flex-col h-full bg-card"
                      onClick={() => setSelectedProject(project)}
                    >
                      <div className="h-2 w-full bg-gradient-to-r from-primary/80 to-primary/20" />
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start mb-2">
                          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <Code2 className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            {Boolean(project.is_internship) && (
                              <Badge className="bg-orange-500 text-white hover:bg-orange-600 border-none gap-1.5 px-3 py-1 text-[11px] rounded-full font-medium shadow-sm">
                                <Trophy className="h-3.5 w-3.5" /> Internship Opportunity
                              </Badge>
                            )}
                            <Badge variant="outline" className={`${getStatusColor(project.status)} uppercase text-[10px] tracking-wider`}>
                              {project.status}
                            </Badge>
                          </div>
                        </div>
                        <CardTitle className="text-xl line-clamp-1 group-hover:text-primary transition-colors">
                          {project.title}
                        </CardTitle>
                        <CardDescription className="line-clamp-2 min-h-[2.5rem]">
                          {project.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-1 pb-3">
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.tech_stack && project.tech_stack.slice(0, 3).map((tech: string) => (
                            <Badge key={tech} variant="secondary" className="text-xs pointer-events-none bg-secondary/50">
                              {tech}
                            </Badge>
                          ))}
                          {project.tech_stack && project.tech_stack.length > 3 && (
                            <Badge variant="secondary" className="text-xs bg-secondary/50">+{project.tech_stack.length - 3}</Badge>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="pt-3 border-t border-border/50 bg-muted/5 flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span>{project.participants}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{project.duration}</span>
                        </div>
                        <Badge variant="outline" className={`text-xs ${getDifficultyColor(project.difficulty)} border-current bg-transparent`}>
                          {project.difficulty}
                        </Badge>
                      </CardFooter>
                    </Card>
                  ))}
                </div>

                {filteredProjects.length === 0 && (
                  <div className="text-center py-20">
                    <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No projects found</h3>
                    <p className="text-muted-foreground">Try adjusting your search or filters to find what you're looking for.</p>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </FeatureGuard>
  );
}
