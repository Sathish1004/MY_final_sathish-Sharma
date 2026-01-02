
import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Share2, Copy, Linkedin, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ShareConfig {
    overview: boolean;
    courses: boolean;
    projects: boolean;
    mentorship: boolean;
    jobs: boolean;
    learning_paths: boolean;
    events: boolean;
}

export default function ShareProgressModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [generatedLink, setGeneratedLink] = useState<string | null>(null);
    const [config, setConfig] = useState<ShareConfig>({
        overview: true,
        courses: true,
        projects: true,
        mentorship: false,
        jobs: true,
        learning_paths: true,
        events: false
    });
    const { toast } = useToast();

    const handleToggle = (key: keyof ShareConfig) => {
        setConfig(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleGenerateLink = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/share-progress`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // Authenticated request
                },
                body: JSON.stringify({ share_config: config })
            });

            if (response.ok) {
                const data = await response.json();
                setGeneratedLink(data.share_url);
            } else {
                toast({
                    title: "Error",
                    description: "Failed to generate share link.",
                    variant: "destructive"
                });
            }
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Something went wrong.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCopyLink = () => {
        if (generatedLink) {
            navigator.clipboard.writeText(generatedLink);
            toast({
                title: "Link Copied!",
                description: "Share link copied to clipboard.",
            });
        }
    };

    const handleLinkedInShare = () => {
        if (generatedLink) {
            const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(generatedLink)}`;
            window.open(linkedInUrl, '_blank');
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 border-primary/20 hover:bg-primary/5">
                    <Share2 className="h-4 w-4" />
                    Share Progress
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Share Your Progress</DialogTitle>
                    <DialogDescription>
                        Select what you want to share publicly. You can toggle visibility for specific sections.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <h3 className="text-sm font-medium mb-2">Select Sections to Share</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                            <Checkbox id="overview" checked={config.overview} onCheckedChange={() => handleToggle('overview')} />
                            <Label htmlFor="overview">Overview Stats</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="courses" checked={config.courses} onCheckedChange={() => handleToggle('courses')} />
                            <Label htmlFor="courses">Active Courses</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="projects" checked={config.projects} onCheckedChange={() => handleToggle('projects')} />
                            <Label htmlFor="projects">Projects</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="learning_paths" checked={config.learning_paths} onCheckedChange={() => handleToggle('learning_paths')} />
                            <Label htmlFor="learning_paths">Learning Paths</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="mentorship" checked={config.mentorship} onCheckedChange={() => handleToggle('mentorship')} />
                            <Label htmlFor="mentorship">Mentorship Stats</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="jobs" checked={config.jobs} onCheckedChange={() => handleToggle('jobs')} />
                            <Label htmlFor="jobs">Job Applications</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="events" checked={config.events} onCheckedChange={() => handleToggle('events')} />
                            <Label htmlFor="events">Upcoming Events</Label>
                        </div>
                    </div>

                    {generatedLink && (
                        <div className="mt-4 p-3 bg-muted rounded-md flex items-center justify-between">
                            <p className="text-sm truncate max-w-[200px] text-muted-foreground">{generatedLink}</p>
                            <div className="flex items-center gap-2">
                                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleCopyLink}>
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="flex-col sm:flex-row gap-2">
                    {!generatedLink ? (
                        <Button onClick={handleGenerateLink} disabled={loading} className="w-full">
                            {loading ? "Generating..." : "Generate Share Link"}
                        </Button>
                    ) : (
                        <>
                            <Button onClick={handleCopyLink} variant="outline" className="w-full sm:w-auto">
                                <Copy className="mr-2 h-4 w-4" />
                                Copy
                            </Button>
                            <Button onClick={handleLinkedInShare} className="w-full sm:w-auto bg-[#0077b5] hover:bg-[#00669c]">
                                <Linkedin className="mr-2 h-4 w-4" />
                                Share on LinkedIn
                            </Button>
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
