import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useNotifications } from '@/contexts/NotificationContext';
import { useAuth } from '@/contexts/AuthContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  Search,
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  Building2,
  ExternalLink,
  Bookmark,
  Globe,
  Home,
  FileText,
  CheckCircle2,
  Calendar,
  Code,
  AlertCircle
} from 'lucide-react';

// Empty initial state, will fetch from API
const INITIAL_JOBS: any[] = [];

const getModeIcon = (mode: string) => {
  switch (mode) {
    case 'Remote': return <Globe className="h-4 w-4" />;
    case 'Onsite': return <Building2 className="h-4 w-4" />;
    case 'Hybrid': return <Home className="h-4 w-4" />;
    default: return <MapPin className="h-4 w-4" />;
  }
};

import FeatureGuard from "@/components/FeatureGuard";

export default function Jobs() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [modeFilter, setModeFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [savedJobs, setSavedJobs] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addNotification } = useNotifications();
  const { user } = useAuth();

  // Helper to format date diff
  const getPostedTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    return `${diffDays} days ago`;
  };

  const isExpired = (deadlineStr: string) => {
    if (!deadlineStr) return false;
    const deadline = new Date(deadlineStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    deadline.setHours(0, 0, 0, 0);
    return deadline < today;
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/jobs');
        if (response.ok) {
          const data = await response.json();
          const mappedJobs = data.map((j: any) => ({
            id: j.job_id,
            title: j.job_title,
            company: j.company_name,
            location: j.location,
            type: j.job_type,
            mode: j.work_mode,
            stipend: j.salary_package,
            posted: getPostedTime(j.created_at),
            deadline: j.application_deadline,
            isInternship: j.job_type === 'Internship',
            logo: j.company_name.substring(0, 2).toUpperCase(),
            skills: j.required_skills ? j.required_skills.split(',').map((s: string) => s.trim()) : [],
            description: j.job_description,
            roles: j.responsibilities ? j.responsibilities.split('\n').filter((r: string) => r.trim() !== '') : [],
            eligibility: j.eligibility ? j.eligibility.split('\n').filter((e: string) => e.trim() !== '') : [],
            applyUrl: j.application_link,
            status: j.status
          }));
          setJobs(mappedJobs);
        }
      } catch (error) {
        console.error("Failed to fetch jobs", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMode = modeFilter === 'all' || job.mode.toLowerCase() === modeFilter;
    const matchesType = typeFilter === 'all' ||
      (typeFilter === 'internship' && job.isInternship) ||
      (typeFilter === 'fulltime' && !job.isInternship);
    return matchesSearch && matchesMode && matchesType;
  });

  const toggleSaveJob = (jobId: number) => {
    setSavedJobs(prev =>
      prev.includes(jobId) ? prev.filter(id => id !== jobId) : [...prev, jobId]
    );
  };

  const handleRegister = async (job: any) => {
    // Track application click (fire and forget, don't block navigation)
    if (user?.id) {
      fetch('http://localhost:5000/api/jobs/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job_id: job.id, user_id: user.id })
      }).catch(err => console.error("Failed to track job application", err));
    }

    window.open(job.applyUrl, '_blank');
    addNotification({
      title: 'Job Registration Started',
      description: `You have initiated the application for ${job.title} at ${job.company}. Check the external link to complete your registration.`,
      type: 'success',
    });
  };

  return (
    <FeatureGuard feature="jobs">
      <div className="space-y-6 animate-fade-in pb-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Jobs & Internships</h1>
            <p className="text-muted-foreground mt-1">
              Find your next career opportunity
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm bg-primary/10 px-4 py-2 rounded-full">
            <Briefcase className="h-4 w-4 text-primary" />
            <span className="font-medium text-primary">{jobs.length} Opportunities Available</span>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search jobs, companies..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Job Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="fulltime">Full-time</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                </SelectContent>
              </Select>
              <Select value={modeFilter} onValueChange={setModeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Work Mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Modes</SelectItem>
                  <SelectItem value="remote">Remote</SelectItem>
                  <SelectItem value="onsite">Onsite</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Jobs Grid */}
        <div className="grid gap-4">
          {filteredJobs.map((job, index) => (
            <Card
              key={job.id}
              className="card-hover opacity-0 animate-fade-in group"
              style={{ animationDelay: `${index * 0.05}s`, animationFillMode: 'forwards' }}
            >
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  {/* Company Logo */}
                  <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <span className="text-lg font-bold text-primary">{job.logo}</span>
                  </div>

                  {/* Job Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-lg">{job.title}</h3>
                        <p className="text-muted-foreground">{job.company}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleSaveJob(job.id)}
                        className={savedJobs.includes(job.id) ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}
                      >
                        <Bookmark className={`h-5 w-5 ${savedJobs.includes(job.id) ? 'fill-current' : ''}`} />
                      </Button>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mt-3">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        {getModeIcon(job.mode)}
                        {job.mode}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <DollarSign className="h-4 w-4" />
                        {job.stipend}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {job.posted}
                      </div>
                    </div>

                    {/* Skills preview */}
                    <div className="flex flex-wrap gap-2 mt-4 hidden md:flex">
                      <Badge variant={job.isInternship ? 'secondary' : 'default'}>
                        {job.type}
                      </Badge>
                      {job.skills.slice(0, 3).map(skill => (
                        <Badge key={skill} variant="outline" className="text-xs">{skill}</Badge>
                      ))}
                      {job.skills.length > 3 && (
                        <Badge variant="outline" className="text-xs">+{job.skills.length - 3}</Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                      {isExpired(job.deadline) ? (
                        <Badge variant="destructive" className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20 gap-1.5 pl-2 pr-3 py-1">
                          <AlertCircle className="h-3.5 w-3.5" />
                          <span>Closed: {new Date(job.deadline).toLocaleDateString()}</span>
                        </Badge>
                      ) : (
                        <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-secondary/50 px-2.5 py-1 rounded-md border border-border/50">
                          <Clock className="h-3.5 w-3.5" />
                          <span>Expires: {new Date(job.deadline).toLocaleDateString()}</span>
                        </div>
                      )}

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="rounded-full shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300">
                            View More
                            <ExternalLink className="ml-2 h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-[80vw] h-[80vh] flex flex-col p-0 overflow-hidden bg-background/95 backdrop-blur-md">
                          <div className="flex-1 overflow-y-auto">
                            <DialogHeader className="p-6 pb-0">
                              <div className="flex items-start gap-4 mb-4">
                                <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                  <span className="text-xl font-bold text-primary">{job.logo}</span>
                                </div>
                                <div>
                                  <DialogTitle className="text-2xl font-bold">{job.title}</DialogTitle>
                                  <DialogDescription className="text-lg text-primary font-medium mt-1">
                                    {job.company}
                                  </DialogDescription>
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-3 mb-6">
                                <Badge variant="secondary" className="px-3 py-1 flex items-center gap-1">
                                  <MapPin className="h-3 w-3" /> {job.location}
                                </Badge>
                                <Badge variant="secondary" className="px-3 py-1 flex items-center gap-1">
                                  {getModeIcon(job.mode)} {job.mode}
                                </Badge>
                                <Badge variant="secondary" className="px-3 py-1 flex items-center gap-1">
                                  <DollarSign className="h-3 w-3" /> {job.stipend}
                                </Badge>
                                <Badge variant={job.isInternship ? 'secondary' : 'default'} className="px-3 py-1">
                                  {job.type}
                                </Badge>
                              </div>
                            </DialogHeader>

                            <div className="p-6 pt-2 space-y-6">

                              {/* Stats */}
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 bg-primary/5 rounded-xl border border-primary/10">
                                <div className="space-y-1">
                                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Posted</p>
                                  <p className="text-sm font-semibold text-foreground">{job.posted}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Deadline</p>
                                  <p className={`text-sm font-semibold ${isExpired(job.deadline) ? 'text-red-500' : 'text-foreground'}`}>
                                    {new Date(job.deadline).toLocaleDateString()}
                                  </p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Eligibility</p>
                                  <p className="text-sm font-semibold text-foreground">{job.isInternship ? 'Students' : 'All Candidates'}</p>
                                </div>
                              </div>

                              {/* Job Details Content Area with Scrollbar */}
                              <div className="space-y-8 pr-2 max-h-[440px] overflow-y-auto custom-scrollbar">
                                {/* Job Description */}
                                <section className="space-y-3">
                                  <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                                    <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500">
                                      <FileText className="h-4 w-4" />
                                    </div>
                                    <h3 className="text-lg font-bold text-foreground tracking-tight">Job Description</h3>
                                  </div>
                                  <p className="text-muted-foreground leading-relaxed text-sm">
                                    {job.description || "No description provided."}
                                  </p>
                                </section>

                                {/* Key Responsibilities */}
                                <section className="space-y-3">
                                  <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                                    <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
                                      <Briefcase className="h-4 w-4" />
                                    </div>
                                    <h3 className="text-lg font-bold text-foreground tracking-tight">Key Responsibilities</h3>
                                  </div>
                                  <ul className="grid gap-3">
                                    {job.roles && job.roles.length > 0 ? (
                                      job.roles.map((role: string, i: number) => (
                                        <li key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 group hover:bg-muted/50 transition-colors border border-transparent hover:border-border/50">
                                          <div className="h-5 w-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                                            <CheckCircle2 className="h-3 w-3" />
                                          </div>
                                          <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{role}</span>
                                        </li>
                                      ))
                                    ) : (
                                      <li className="text-sm text-muted-foreground italic p-3 rounded-lg bg-muted/30 border border-dashed border-border">
                                        Not specified for this role.
                                      </li>
                                    )}
                                  </ul>
                                </section>

                                {/* Eligibility Criteria */}
                                <section className="space-y-3">
                                  <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                                    <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-500">
                                      <CheckCircle2 className="h-4 w-4" />
                                    </div>
                                    <h3 className="text-lg font-bold text-foreground tracking-tight">Eligibility Criteria</h3>
                                  </div>
                                  <ul className="grid gap-3">
                                    {job.eligibility && job.eligibility.length > 0 ? (
                                      job.eligibility.map((item: string, i: number) => (
                                        <li key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 group hover:bg-muted/50 transition-colors border border-transparent hover:border-border/50">
                                          <div className="h-5 w-5 rounded-full bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0 mt-0.5">
                                            <div className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                                          </div>
                                          <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{item}</span>
                                        </li>
                                      ))
                                    ) : (
                                      <li className="text-sm text-muted-foreground italic p-3 rounded-lg bg-muted/30 border border-dashed border-border">
                                        General eligibility applies.
                                      </li>
                                    )}
                                  </ul>
                                </section>

                                {/* Required Skills */}
                                <section className="space-y-4">
                                  <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                                    <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
                                      <Code className="h-4 w-4" />
                                    </div>
                                    <h3 className="text-lg font-bold text-foreground tracking-tight">Required Skills</h3>
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    {job.skills && job.skills.length > 0 ? (
                                      job.skills.map((skill: string) => (
                                        <Badge key={skill} variant="outline" className="px-4 py-1.5 text-xs font-semibold bg-background hover:bg-amber-500/5 hover:text-amber-500 hover:border-amber-500/30 transition-all border-border">
                                          {skill}
                                        </Badge>
                                      ))
                                    ) : (
                                      <span className="text-sm text-muted-foreground italic">No specific skills mentioned.</span>
                                    )}
                                  </div>
                                </section>
                              </div>

                            </div>
                          </div>

                          {/* Sticky Footer */}
                          <div className="p-4 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                            <Button
                              size="lg"
                              className="w-full text-lg shadow-lg hover:shadow-xl transition-all"
                              onClick={() => handleRegister(job)}
                              disabled={job.status === 'Closed' || isExpired(job.deadline)}
                            >
                              {job.status === 'Closed' || isExpired(job.deadline) ? 'Job Closed' : 'Register Now'}
                              <ExternalLink className="ml-2 h-5 w-5" />
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {
          filteredJobs.length === 0 && (
            <div className="text-center py-12">
              <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
              <p className="text-muted-foreground">Try adjusting your filters or search query</p>
            </div>
          )
        }
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </FeatureGuard>
  );
}
