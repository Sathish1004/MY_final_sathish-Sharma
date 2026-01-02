import { useState, useEffect } from "react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import {
    User, Mail, Phone, MapPin, Calendar, Clock, Shield,
    Code, BookOpen, GraduationCap, Github, Linkedin,
    ExternalLink, Activity, Lock, Smartphone, Globe, Loader2,
    XCircle, AlertCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// --- Types ---

interface ActivityLog {
    action: string;
    details: string;
    created_at: string;
}

interface Enrollment {
    id: number;
    title: string;
    enrolled_at: string;
    progress: number;
}

interface CodingStats {
    problems_solved: number;
    problems_attempted: number;
    accuracy: number;
    last_active: string | null;
    top_languages: { name: string; percentage: number }[];
    recent_submissions: { question_id: number; language: string; status: string; created_at: string }[];
}

interface MentorshipSession {
    mentor_name: string;
    topic: string;
    booking_date: string;
    slot_time: string;
    status: string;
    meeting_link?: string;
}

interface UserDetails {
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
    created_at: string;
    last_login?: string;
    gender?: 'Male' | 'Female' | 'Other';
    phone?: string;
    location?: string;
    login_method?: string;
    bio?: string;
    github?: string;
    linkedin?: string;
    college_name?: string;
    profile_picture?: string;
    resume_path?: string;
}

interface UserProfileDrawerProps {
    user: { id: number; name: string; email: string; role: string; status: string; gender?: string; profile_picture?: string } | null;
    isOpen: boolean;
    onClose: () => void;
    onUserUpdated: () => void;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function UserProfileDrawer({ user, isOpen, onClose, onUserUpdated }: UserProfileDrawerProps) {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("overview");
    const [fetching, setFetching] = useState(false); // For data load

    // Data State
    const [profile, setProfile] = useState<UserDetails | null>(null);
    const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const [codingStats, setCodingStats] = useState<CodingStats | null>(null);
    const [mentorshipHistory, setMentorshipHistory] = useState<MentorshipSession[]>([]);

    // Edit State (now read-only display state)
    const [role, setRole] = useState("Student");
    const [status, setStatus] = useState("Active");
    const [gender, setGender] = useState("Male");

    const { toast } = useToast();

    useEffect(() => {
        if (isOpen && user) {
            fetchFullUserDetails(user.id);
            setRole(user.role);
            setStatus(user.status);
            setGender(user.gender || 'Male');
            setActiveTab("overview");
        }
    }, [isOpen, user]);

    const fetchFullUserDetails = async (userId: number) => {
        setFetching(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/admin/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setProfile(data.user);
                setActivityLogs(data.activityLogs || []);
                setEnrollments(data.enrollments || []);
                setCodingStats(data.codingStats || null);
                setMentorshipHistory(data.mentorshipHistory || []);

                // Sync local state if fetched data differs
                if (data.user) {
                    setRole(data.user.role);
                    setStatus(data.user.status);
                    setGender(data.user.gender || 'Male');
                }
            }
        } catch (error) {
            console.error("Failed to fetch user details", error);
            toast({ title: "Error", description: "Could not load user profile data.", variant: "destructive" });
        } finally {
            setFetching(false);
        }
    };

    if (!user) return null;

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="overflow-y-auto sm:max-w-2xl w-full p-0 gap-0 bg-slate-50">
                {/* Custom Header with Gradient */}
                <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-white relative">
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 text-slate-400 hover:text-white transition-colors"
                    >
                        <XCircle className="h-6 w-6" />
                    </button>

                    <div className="flex items-start gap-5">
                        <Avatar className="h-20 w-20 border-4 border-slate-700/50 shadow-xl">
                            <AvatarImage src={(profile?.profile_picture || user.profile_picture) ? `${API_URL}${(profile?.profile_picture || user.profile_picture)}` : `https://ui-avatars.com/api/?name=${(profile?.name || user.name)}&background=6366f1&color=fff`} />
                            <AvatarFallback className="text-2xl font-bold bg-indigo-600 text-white">{(profile?.name || user.name).charAt(0)}</AvatarFallback>
                        </Avatar>

                        <div className="space-y-1 mt-1">
                            <h2 className="text-2xl font-bold tracking-tight">{user.name}</h2>
                            <div className="flex items-center gap-2 text-slate-300 text-sm">
                                <Mail className="h-3.5 w-3.5" /> {user.email}
                            </div>
                            <div className="flex items-center gap-2 mt-3">
                                <Badge className={`${role === 'Admin' ? 'bg-purple-500' :
                                    role === 'Instructor' ? 'bg-orange-500' : 'bg-blue-500'
                                    } hover:bg-opacity-80 border-0`}>
                                    {role}
                                </Badge>
                                <Badge variant="outline" className={`${status === 'Active' ? 'text-green-400 border-green-400/30 bg-green-400/10' :
                                    'text-red-400 border-red-400/30 bg-red-400/10'
                                    }`}>
                                    {status}
                                </Badge>
                                <Badge variant="outline" className="text-slate-300 border-slate-700/50 bg-slate-800/50">
                                    {gender}
                                </Badge>
                            </div>
                            {user.role === 'Student' && (
                                <Button
                                    size="sm"
                                    className="mt-4 bg-indigo-600 hover:bg-indigo-700 border-none text-white shadow-lg shadow-indigo-900/20"
                                    onClick={() => navigate(`/admin/student-view/${user.id}`)}
                                >
                                    <Activity className="h-4 w-4 mr-2" /> View Student Dashboard
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="w-full justify-start bg-white border h-11 p-1 mb-6 rounded-lg shadow-sm overflow-x-auto">
                            <TabsTrigger value="overview" className="data-[state=active]:bg-slate-100">Overview</TabsTrigger>
                            <TabsTrigger value="learning" className="data-[state=active]:bg-slate-100">Learning</TabsTrigger>
                            <TabsTrigger value="coding" className="data-[state=active]:bg-slate-100">Coding</TabsTrigger>
                            <TabsTrigger value="mentorship" className="data-[state=active]:bg-slate-100">Mentorship</TabsTrigger>
                            <TabsTrigger value="activity" className="data-[state=active]:bg-slate-100">Activity</TabsTrigger>
                            <TabsTrigger value="security" className="data-[state=active]:bg-slate-100">Security</TabsTrigger>
                        </TabsList>

                        {fetching ? (
                            <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                                <Loader2 className="h-8 w-8 animate-spin mb-3 text-indigo-600" />
                                <p>Loading detailed profile...</p>
                            </div>
                        ) : (
                            <>
                                {/* OVERVIEW TAB */}
                                <TabsContent value="overview" className="space-y-6 mt-0">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-white p-4 rounded-xl border shadow-sm space-y-4">
                                            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                                                <User className="h-4 w-4 text-slate-500" /> Personal Details
                                            </h3>
                                            <div className="space-y-3 text-sm">
                                                <div className="flex justify-between py-1 border-b border-slate-50">
                                                    <span className="text-slate-500">User ID</span>
                                                    <span className="font-mono text-slate-700">#{profile?.id}</span>
                                                </div>
                                                <div className="flex justify-between py-1 border-b border-slate-50">
                                                    <span className="text-slate-500">Phone</span>
                                                    <span className="text-slate-700">{profile?.phone || "N/A"}</span>
                                                </div>
                                                <div className="flex justify-between py-1 border-b border-slate-50">
                                                    <span className="text-slate-500">Location</span>
                                                    <span className="text-slate-700">{profile?.location || "Unknown"}</span>
                                                </div>
                                                <div className="flex justify-between py-1 border-b border-slate-50">
                                                    <span className="text-slate-500">Joined Date</span>
                                                    <span className="text-slate-700">{profile?.created_at ? new Date(profile.created_at).toLocaleString() : 'N/A'}</span>
                                                </div>
                                                <div className="flex justify-between py-1 border-b border-slate-50">
                                                    <span className="text-slate-500">College</span>
                                                    <span className="text-slate-700">{profile?.college_name || "N/A"}</span>
                                                </div>
                                                {profile?.resume_path && (
                                                    <div className="flex justify-between py-1 border-b border-slate-50">
                                                        <span className="text-slate-500">Resume</span>
                                                        <a href={`${API_URL}${profile.resume_path}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-xs flex items-center">
                                                            View Resume PDF <ExternalLink className="h-3 w-3 ml-1" />
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="bg-white p-4 rounded-xl border shadow-sm space-y-4">
                                            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                                                <Globe className="h-4 w-4 text-slate-500" /> Online Presence
                                            </h3>
                                            <div className="space-y-3">
                                                <a
                                                    href={profile?.github && profile.github !== 'Not connected' ? profile.github : undefined}
                                                    target={profile?.github && profile.github !== 'Not connected' ? "_blank" : undefined}
                                                    rel="noreferrer"
                                                    className={`flex items-center gap-3 p-2 rounded-lg bg-slate-50 transition-colors border border-transparent 
                                                        ${profile?.github && profile.github !== 'Not connected' ? 'hover:bg-slate-100 hover:border-slate-200 cursor-pointer' : 'opacity-70 cursor-not-allowed'}`}
                                                    onClick={(e) => { if (!profile?.github || profile.github === 'Not connected') e.preventDefault(); }}
                                                >
                                                    <Github className="h-5 w-5 text-slate-700" />
                                                    <div className="flex-1 overflow-hidden">
                                                        <p className="text-xs text-slate-500">GitHub</p>
                                                        <p className="text-sm font-medium truncate">
                                                            {profile?.github && profile.github !== 'Not connected' ? profile.github : "Not connected"}
                                                        </p>
                                                    </div>
                                                    <ExternalLink className="h-3 w-3 text-slate-400" />
                                                </a>

                                                <a
                                                    href={profile?.linkedin && profile.linkedin !== 'Not connected' ? profile.linkedin : undefined}
                                                    target={profile?.linkedin && profile.linkedin !== 'Not connected' ? "_blank" : undefined}
                                                    rel="noreferrer"
                                                    className={`flex items-center gap-3 p-2 rounded-lg bg-blue-50 transition-colors border border-transparent 
                                                        ${profile?.linkedin && profile.linkedin !== 'Not connected' ? 'hover:bg-blue-100 hover:border-blue-200 cursor-pointer' : 'opacity-70 cursor-not-allowed'}`}
                                                    onClick={(e) => { if (!profile?.linkedin || profile.linkedin === 'Not connected') e.preventDefault(); }}
                                                >
                                                    <Linkedin className="h-5 w-5 text-blue-700" />
                                                    <div className="flex-1 overflow-hidden">
                                                        <p className="text-xs text-blue-500">LinkedIn</p>
                                                        <p className="text-sm font-medium text-blue-900 truncate">
                                                            {profile?.linkedin && profile.linkedin !== 'Not connected' ? profile.linkedin : "Not connected"}
                                                        </p>
                                                    </div>
                                                    <ExternalLink className="h-3 w-3 text-blue-400" />
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white p-4 rounded-xl border shadow-sm">
                                        <h3 className="font-semibold text-slate-900 mb-3">Bio</h3>
                                        <p className="text-sm text-slate-600 leading-relaxed italic">
                                            "{profile?.bio || "No bio added yet."}"
                                        </p>
                                    </div>
                                </TabsContent>

                                {/* LEARNING TAB */}
                                <TabsContent value="learning" className="space-y-4 mt-0">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-blue-50 p-4 rounded-xl ring-1 ring-blue-100">
                                            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Enrolled Courses</p>
                                            <p className="text-3xl font-bold text-blue-900 mt-1">{enrollments.length}</p>
                                        </div>
                                        <div className="bg-emerald-50 p-4 rounded-xl ring-1 ring-emerald-100">
                                            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Certificates</p>
                                            <p className="text-3xl font-bold text-emerald-900 mt-1">0</p>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                                        <div className="px-4 py-3 border-b bg-slate-50/50">
                                            <h3 className="font-semibold text-slate-800">Recent Enrollments</h3>
                                        </div>
                                        {enrollments.length > 0 ? (
                                            <div className="divide-y">
                                                {enrollments.map((course) => (
                                                    <div key={course.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                                                                <BookOpen className="h-5 w-5" />
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-slate-900">{course.title}</p>
                                                                <p className="text-xs text-slate-500">Enrolled: {new Date(course.enrolled_at).toLocaleDateString()}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col items-end gap-1">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                                    <div className="h-full bg-green-500 rounded-full" style={{ width: `${course.progress}%` }}></div>
                                                                </div>
                                                                <span className="text-xs font-bold text-slate-700">{course.progress}%</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="p-8 text-center text-slate-500">
                                                No active enrollments found.
                                            </div>
                                        )}
                                    </div>
                                </TabsContent>

                                {/* CODING TAB */}
                                <TabsContent value="coding" className="space-y-4 mt-0">
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="bg-white p-4 rounded-xl border shadow-sm text-center">
                                            <p className="text-xs text-slate-500">Solved</p>
                                            <p className="text-2xl font-bold text-slate-900">{codingStats?.problems_solved || 0}</p>
                                        </div>
                                        <div className="bg-white p-4 rounded-xl border shadow-sm text-center">
                                            <p className="text-xs text-slate-500">Attempted</p>
                                            <p className="text-2xl font-bold text-slate-900">{codingStats?.problems_attempted || 0}</p>
                                        </div>
                                        <div className="bg-white p-4 rounded-xl border shadow-sm text-center">
                                            <p className="text-xs text-slate-500">Accuracy</p>
                                            <p className="text-2xl font-bold text-green-600">{codingStats?.accuracy || 0}%</p>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                                        <div className="px-4 py-3 border-b">
                                            <h3 className="font-semibold text-slate-800">Recent Submissions</h3>
                                        </div>
                                        <div className="divide-y">
                                            {codingStats?.recent_submissions?.length ? codingStats.recent_submissions.map((sub, i) => (
                                                <div key={i} className="p-3 flex items-center justify-between text-sm">
                                                    <div className="flex items-center gap-3">
                                                        <Code className="h-4 w-4 text-slate-400" />
                                                        <span className="font-mono text-slate-700">Problem #{sub.question_id}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <Badge variant="outline">{sub.language}</Badge>
                                                        <span className={`font-medium ${sub.status === 'Accepted' ? 'text-green-600' : 'text-red-500'}`}>
                                                            {sub.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            )) : (
                                                <div className="p-6 text-center text-slate-500 italic">No recent coding activity.</div>
                                            )}
                                        </div>
                                    </div>
                                </TabsContent>

                                {/* MENTORSHIP TAB */}
                                <TabsContent value="mentorship" className="space-y-4 mt-0">
                                    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                                        <div className="px-4 py-3 border-b bg-slate-50/50 flex justify-between items-center">
                                            <h3 className="font-semibold text-slate-800">Booking History</h3>
                                            <Badge variant="secondary" className="bg-white">{mentorshipHistory.length} Sessions</Badge>
                                        </div>
                                        {mentorshipHistory.length > 0 ? (
                                            <div className="divide-y">
                                                {mentorshipHistory.map((sess, i) => (
                                                    <div key={i} className="p-4 hover:bg-slate-50 transition-colors">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <div className="flex items-center gap-2">
                                                                <GraduationCap className="h-4 w-4 text-purple-500" />
                                                                <span className="font-medium text-slate-900">{sess.mentor_name}</span>
                                                            </div>
                                                            <Badge variant="outline" className={
                                                                sess.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-200' :
                                                                    sess.status === 'Upcoming' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                                        'bg-slate-100 text-slate-500'
                                                            }>{sess.status}</Badge>
                                                        </div>
                                                        <p className="text-sm text-slate-600 mb-2">{sess.topic}</p>
                                                        <div className="flex items-center gap-4 text-xs text-slate-400">
                                                            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(sess.booking_date).toLocaleDateString()}</span>
                                                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {sess.slot_time}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                                                <GraduationCap className="h-12 w-12 mb-3 opacity-20" />
                                                <p>No mentorship sessions booked yet.</p>
                                            </div>
                                        )}
                                    </div>
                                </TabsContent>

                                {/* ACTIVITY TAB */}
                                <TabsContent value="activity" className="space-y-4 mt-0">
                                    <div className="bg-white rounded-xl border shadow-sm p-6 relative">
                                        <div className="absolute top-6 left-8 bottom-6 w-0.5 bg-slate-100"></div>
                                        <div className="space-y-6">
                                            {activityLogs.length > 0 ? activityLogs.map((log, i) => (
                                                <div key={i} className="relative pl-8">
                                                    <div className="absolute left-0 top-1 h-4 w-4 rounded-full bg-white border-4 border-slate-200 ring-2 ring-white"></div>
                                                    <p className="text-sm font-semibold text-slate-800">{log.action}</p>
                                                    <p className="text-sm text-slate-500 mt-1">{log.details}</p>
                                                    <span className="text-xs text-slate-400 mt-1 block">
                                                        {new Date(log.created_at).toLocaleString()}
                                                    </span>
                                                </div>
                                            )) : (
                                                <p className="text-center text-slate-500">No activity logs found.</p>
                                            )}
                                        </div>
                                    </div>
                                </TabsContent>

                                {/* SECURITY TAB */}
                                <TabsContent value="security" className="space-y-6 mt-0">
                                    <div className="bg-white p-5 rounded-xl border shadow-sm space-y-4">
                                        <h3 className="font-semibold text-slate-900 border-b pb-2">Account Status (View Only)</h3>
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label className="text-base text-slate-700">Role</Label>
                                                <p className="text-xs text-slate-500">Current access level for this user.</p>
                                            </div>
                                            <Badge className={`${role === 'Admin' ? 'bg-purple-100 text-purple-700 hover:bg-purple-100' :
                                                role === 'Instructor' ? 'bg-orange-100 text-orange-700 hover:bg-orange-100' :
                                                    'bg-blue-100 text-blue-700 hover:bg-blue-100'
                                                } text-sm px-3 py-1 border-0 rounded-md`}>
                                                {role}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label className="text-base text-slate-700">Account Status</Label>
                                                <p className="text-xs text-slate-500">Status determines login ability.</p>
                                            </div>
                                            <Badge variant="outline" className={`${status === 'Active' ? 'text-green-600 bg-green-50 border-green-200' :
                                                'text-red-600 bg-red-50 border-red-200'
                                                } text-sm px-3 py-1 rounded-md`}>
                                                {status}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label className="text-base text-slate-700">Gender</Label>
                                                <p className="text-xs text-slate-500">Gender identity.</p>
                                            </div>
                                            <span className="text-sm font-medium text-slate-700 bg-slate-100 px-3 py-1 rounded-md">
                                                {gender}
                                            </span>
                                        </div>
                                    </div>

                                    <Button disabled className="w-full bg-slate-100 text-slate-400 hover:bg-slate-100 cursor-not-allowed border h-12 text-md">
                                        <Lock className="mr-2 h-4 w-4" />
                                        No editable fields
                                    </Button>
                                </TabsContent>
                            </>
                        )}
                    </Tabs>
                </div>
            </SheetContent>
        </Sheet >
    );
}
