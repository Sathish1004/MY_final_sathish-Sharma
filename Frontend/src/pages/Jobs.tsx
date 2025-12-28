import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
  Calendar
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
            roles: [], // Not available in DB
            eligibility: [], // Not available in DB
            applyUrl: j.application_link,
            duration: 'N/A',
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

  const handleRegister = (url: string) => {
    window.open(url, '_blank');
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
                      <p className={`text-sm ${isExpired(job.deadline) ? 'text-red-500 font-bold' : 'text-muted-foreground'}`}>
                        Deadline: <span className={isExpired(job.deadline) ? 'text-red-500' : 'text-foreground font-medium'}>
                          {new Date(job.deadline).toLocaleDateString()}
                        </span>
                        {isExpired(job.deadline) && <span className="ml-2">(Job has closed)</span>}
                      </p>

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
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg">
                                <div>
                                  <p className="text-xs text-muted-foreground uppercase font-bold">Posted</p>
                                  <p className="text-sm font-medium">{job.posted}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground uppercase font-bold">Deadline</p>
                                  <p className={`text-sm font-medium ${isExpired(job.deadline) ? 'text-red-500 font-bold' : ''}`}>
                                    {new Date(job.deadline).toLocaleDateString()}
                                    {isExpired(job.deadline) && <span className="ml-1">(Job has closed)</span>}
                                  </p>
                                </div>
                                {job.duration && (
                                  <div>
                                    <p className="text-xs text-muted-foreground uppercase font-bold">Duration</p>
                                    <p className="text-sm font-medium">{job.duration}</p>
                                  </div>
                                )}
                                <div>
                                  <p className="text-xs text-muted-foreground uppercase font-bold">Eligibility</p>
                                  <p className="text-sm font-medium">{job.isInternship ? 'Students' : 'Generals'}</p>
                                </div>
                              </div>

                              {/* Description */}
                              <div>
                                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                                  <FileText className="h-5 w-5 text-primary" />
                                  Job Description
                                </h3>
                                <p className="text-muted-foreground leading-relaxed">
                                  {job.description}
                                </p>
                              </div>

                              {/* Roles */}
                              <div>
                                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                                  <Briefcase className="h-5 w-5 text-primary" />
                                  Key Responsibilities
                                </h3>
                                <ul className="space-y-2">
                                  {job.roles?.map((role, i) => (
                                    <li key={i} className="flex items-start gap-2 text-muted-foreground">
                                      <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                                      {role}
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Eligibility */}
                              <div>
                                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                                  <CheckCircle2 className="h-5 w-5 text-primary" />
                                  Eligibility Criteria
                                </h3>
                                <ul className="space-y-2">
                                  {job.eligibility?.map((item, i) => (
                                    <li key={i} className="flex items-start gap-2 text-muted-foreground">
                                      <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                                      {item}
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Skills */}
                              <div>
                                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                                  <Building2 className="h-5 w-5 text-primary" />
                                  Required Skills
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                  {job.skills.map(skill => (
                                    <Badge key={skill} variant="outline" className="px-3 py-1 text-sm">
                                      {skill}
                                    </Badge>
                                  ))}
                                </div>
                              </div>

                            </div>
                          </div>

                          {/* Sticky Footer */}
                          <div className="p-4 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                            <Button
                              size="lg"
                              className="w-full text-lg shadow-lg hover:shadow-xl transition-all"
                              onClick={() => handleRegister(job.applyUrl)}
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
    </FeatureGuard>
  );
}
