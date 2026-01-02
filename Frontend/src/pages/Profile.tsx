import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { User as UserIcon, Users, FileText, Lock, Upload, Loader2, Camera, Shield, Mail, Phone, BookOpen, AlertTriangle, CheckCircle2, Info, Github, Linkedin } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const SecurityTabContent = ({ API_URL }: { API_URL: string }) => {
    const { toast } = useToast();
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast({ title: "Error", description: "New passwords do not match.", variant: "destructive" });
            return;
        }

        if (newPassword.length < 6) {
            toast({ title: "Weak Password", description: "Password must be at least 6 characters.", variant: "destructive" });
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/profile/change-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ currentPassword, newPassword })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to update password");

            toast({ title: "Success", description: "Password updated successfully. Please login again." });
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-md mx-auto py-4">
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input
                        id="current-password"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter current password"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                        id="new-password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password (min 6 chars)"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input
                        id="confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                    />
                </div>
            </div>

            <Button onClick={handleChangePassword} disabled={loading} className="w-full bg-slate-900 hover:bg-slate-800 text-white">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Change Password
            </Button>

            <div className="pt-4 text-center">
                <Button variant="link" className="text-sm text-blue-600" onClick={() => toast({ title: "Forgot Password", description: "Please contact support or check your email for reset instructions." })}>
                    Forgot Password?
                </Button>
            </div>
        </div>
    );
};

export default function Profile() {
    const { user, refreshUser } = useAuth();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    // Form States
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [college, setCollege] = useState("");
    const [email, setEmail] = useState("");
    const [bio, setBio] = useState("");

    const [github, setGithub] = useState("");
    const [linkedin, setLinkedin] = useState("");
    const [gender, setGender] = useState("");
    const [currentRole, setCurrentRole] = useState("");

    // Initialize state from user object
    useEffect(() => {
        if (user) {
            setName(user.name || "");
            setPhone(user.phone_number || "");
            setCollege(user.college_name || "");
            setEmail(user.email || "");
            setBio(user.bio || "");

            setGithub(user.github || "");
            setLinkedin(user.linkedin || "");
            setGender(user.gender || "");
            setCurrentRole(user.current_role || "Student");
        }
    }, [user]);

    // Validation State
    const [phoneError, setPhoneError] = useState("");

    // Locked State Logic: If user has a phone number saved, profile is "Verified/Locked"
    const isProfileLocked = !!user?.phone_number;

    // File Refs
    const avatarInputRef = useRef<HTMLInputElement>(null);
    const resumeInputRef = useRef<HTMLInputElement>(null);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    const validatePhone = (value: string) => {
        // Allow empty during typing if not locked, but strictly validate on save
        if (!value) return "Phone number is required.";
        // Regex for +91 followed by 10 digits, allowing optional spaces
        const clean = value.replace(/\s+/g, '').replace(/^\+91/, '');
        if (!/^\d{10}$/.test(clean)) return "Please enter a valid 10-digit number.";
        return "";
    };

    const validateUrl = (url: string, type: 'github' | 'linkedin') => {
        if (!url) return ""; // Optional during typing, check requirement later if needed (user said mandatory)
        if (type === 'github') {
            const githubRegex = /^https?:\/\/(www\.)?github\.com\//;
            if (!githubRegex.test(url)) return "GitHub URL must start with https://github.com/";
        }
        if (type === 'linkedin') {
            const linkedinRegex = /^https?:\/\/(www\.)?linkedin\.com\/in\//;
            if (!linkedinRegex.test(url)) return "LinkedIn URL must start with https://linkedin.com/in/";
        }
        return "";
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPhone(e.target.value);
        if (phoneError) setPhoneError("");
    };

    const handleRequestChange = () => {
        toast({
            title: "Request Change",
            description: "A request has been sent to the admin. You will be notified via email once you can edit these fields.",
        });
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();

        // Phone Validation
        const pError = validatePhone(phone);
        if (pError) {
            setPhoneError(pError);
            return;
        }

        // URL Validation
        const ghError = validateUrl(github, 'github');
        if (ghError) {
            toast({ title: "Invalid GitHub URL", description: ghError, variant: "destructive" });
            return;
        }
        if (!github) {
            toast({ title: "Missing Field", description: "GitHub Profile URL is required.", variant: "destructive" });
            return;
        }

        const liError = validateUrl(linkedin, 'linkedin');
        if (liError) {
            toast({ title: "Invalid LinkedIn URL", description: liError, variant: "destructive" });
            return;
        }
        if (!linkedin) {
            toast({ title: "Missing Field", description: "LinkedIn Profile URL is required.", variant: "destructive" });
            return;
        }


        // Add +91 if missing
        let formattedPhone = phone;
        if (!phone.startsWith('+91')) {
            formattedPhone = `+91 ${phone}`;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/profile/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    name,
                    phone_number: formattedPhone,
                    college_name: college,
                    bio,
                    github,
                    linkedin,
                    gender,
                    current_role: currentRole
                })
            });

            const resData = await res.json();
            if (!res.ok) throw new Error(resData.message || "Failed to update profile");

            toast({ title: "Success", description: "Profile updated successfully." });
            await refreshUser();
        } catch (error: any) {
            toast({ title: "Error", description: error.message || "Failed to update profile", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('avatar', file);

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/profile/upload-avatar`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData
            });

            if (!res.ok) throw new Error("Failed to upload avatar");

            toast({ title: "Success", description: "Profile picture updated." });
            await refreshUser();
        } catch (error) {
            toast({ title: "Error", description: "Image upload failed. Please try again.", variant: "destructive" });
        }
    };

    const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('resume', file);

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/profile/upload-resume`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData
            });

            if (!res.ok) throw new Error("Failed to upload resume");

            toast({ title: "Success", description: "Resume uploaded successfully." });
            await refreshUser();
        } catch (error) {
            toast({ title: "Error", description: "Resume upload failed. Please try again.", variant: "destructive" });
        }
    };





    return (
        <div className="max-w-5xl mx-auto p-6 md:p-8 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row gap-6 items-center bg-white rounded-2xl p-8 border border-slate-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-500/10 to-indigo-500/10" />

                <div className="relative group">
                    <Avatar className="h-32 w-32 border-4 border-white shadow-md bg-white">
                        <AvatarImage src={user?.profile_picture ? `${API_URL}${user.profile_picture}` : undefined} className="object-cover" />
                        <AvatarFallback className="text-4xl bg-blue-50 text-blue-600 font-bold">
                            {name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div
                        className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white"
                        onClick={() => avatarInputRef.current?.click()}
                    >
                        <Camera className="h-8 w-8" />
                    </div>
                    <input
                        type="file"
                        ref={avatarInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                    />
                </div>

                <div className="pt-8 md:pt-0 text-center md:text-left space-y-2">
                    <h1 className="text-3xl font-bold text-slate-900">{name}</h1>
                    <div className="flex flex-wrap gap-4 items-center justify-center md:justify-start text-sm text-slate-500">
                        <span className="flex items-center gap-1.5"><Mail className="h-4 w-4" /> {email}</span>
                        <span className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-medium text-xs border border-blue-100 uppercase tracking-wide">
                            {user?.current_role || user?.role || 'Student'}
                        </span>
                        {user?.created_at && (
                            <span className="flex items-center gap-1.5 text-slate-400 text-xs">
                                Joined {new Date(user.created_at!).toLocaleDateString()}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Certificate Safety Banner */}
            <Alert className="bg-amber-50 border-amber-200 text-amber-900">
                <Shield className="h-4 w-4 text-amber-600" />
                <AlertTitle className="text-amber-800 font-semibold mb-1">Certificate Safety Protocol</AlertTitle>
                <AlertDescription className="text-amber-700/90 text-sm">
                    Your Full Name, Email, and Phone Number are securely locked because they are used for generating official certificates.
                    Changes to these fields require admin approval to ensure authenticity.
                </AlertDescription>
            </Alert>


            {/* Content Tabs */}
            <Tabs defaultValue="personal" className="w-full">
                <TabsList className="bg-white border p-1 rounded-xl w-full md:w-auto h-auto grid grid-cols-3 md:inline-flex mb-6">
                    <TabsTrigger value="personal" className="py-2.5 px-6 rounded-lg data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 font-medium">
                        <UserIcon className="h-4 w-4 mr-2" /> Personal Info
                    </TabsTrigger>
                    <TabsTrigger value="resume" className="py-2.5 px-6 rounded-lg data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 font-medium">
                        <FileText className="h-4 w-4 mr-2" /> Resume
                    </TabsTrigger>
                    <TabsTrigger value="security" className="py-2.5 px-6 rounded-lg data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 font-medium">
                        <Shield className="h-4 w-4 mr-2" /> Security
                    </TabsTrigger>
                </TabsList>

                {/* Personal Info Tab */}
                <TabsContent value="personal">
                    <Card className="border shadow-sm">
                        <CardHeader className="flex flex-row items-start justify-between">
                            <div>
                                <CardTitle>Personal Information</CardTitle>
                                <CardDescription>Update your personal details and contact information.</CardDescription>
                            </div>
                            {isProfileLocked && (
                                <Button variant="outline" size="sm" onClick={handleRequestChange} className="text-xs gap-1.5 border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-700">
                                    <AlertTriangle className="h-3.5 w-3.5" /> Request Change
                                </Button>
                            )}
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleUpdateProfile} className="space-y-8">
                                <div className="grid md:grid-cols-2 gap-8">

                                    {/* USER ID */}
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <Label htmlFor="userId">User ID</Label>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild><Info className="h-3.5 w-3.5 text-muted-foreground/60" /></TooltipTrigger>
                                                    <TooltipContent><p>Unique identifier for your account</p></TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                        <div className="relative">
                                            <Input
                                                id="userId"
                                                value={user?.id ? `Pro@${user.id}` : 'Loading...'}
                                                className="bg-slate-100 text-slate-600 font-medium cursor-not-allowed border-slate-200 font-mono"
                                                readOnly
                                            />
                                        </div>
                                    </div>

                                    {/* FULL NAME */}
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <Label htmlFor="name">Full Name</Label>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild><Lock className="h-3.5 w-3.5 text-muted-foreground/60" /></TooltipTrigger>
                                                    <TooltipContent><p>Name cannot be changed as it appears on certificates.</p></TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                        <div className="relative">
                                            <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="name"
                                                value={name}
                                                className="pl-9 bg-slate-100 text-slate-600 font-medium cursor-not-allowed border-slate-200"
                                                readOnly
                                            />
                                        </div>
                                        <p className="text-xs text-muted-foreground">Contact admin if this needs correction.</p>
                                    </div>

                                    {/* EMAIL */}
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild><Lock className="h-3.5 w-3.5 text-muted-foreground/60" /></TooltipTrigger>
                                                    <TooltipContent><p>Email cannot be changed directly</p></TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input id="email" value={email} disabled className="pl-9 bg-slate-100 text-slate-600 font-medium cursor-not-allowed border-slate-200" />
                                        </div>
                                    </div>

                                    {/* PHONE NUMBER */}
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <Label htmlFor="phone">Phone Number <span className="text-red-500">*</span></Label>
                                            {isProfileLocked && (
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild><Lock className="h-3.5 w-3.5 text-muted-foreground/60" /></TooltipTrigger>
                                                        <TooltipContent><p>Locked for certificate generation</p></TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            )}
                                        </div>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="phone"
                                                value={phone}
                                                onChange={handlePhoneChange}
                                                placeholder="+91 98765 43210"
                                                className={`pl-9 ${isProfileLocked ? 'bg-slate-50 text-muted-foreground cursor-not-allowed border-slate-200' : ''} ${phoneError ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                                                readOnly={isProfileLocked}
                                            />
                                        </div>
                                        {phoneError && <p className="text-xs text-red-500 font-medium mt-1">{phoneError}</p>}
                                        {!isProfileLocked && !phoneError && <p className="text-xs text-muted-foreground">Required for certificate verification. This cannot be changed later.</p>}
                                    </div>

                                    {/* CURRENT ROLE */}
                                    <div className="space-y-3">
                                        <Label htmlFor="currentRole">Current Role</Label>
                                        <div className="relative">
                                            <select
                                                id="currentRole"
                                                value={currentRole}
                                                onChange={(e) => setCurrentRole(e.target.value)}
                                                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-9"
                                            >
                                                <option value="Student">Student</option>
                                                <option value="Professor">Professor</option>
                                                <option value="Recruiter">Recruiter</option>
                                                <option value="Professional">Professional</option>
                                            </select>
                                            <Users className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                                        </div>
                                    </div>

                                    {/* GENDER */}
                                    <div className="space-y-3">
                                        <Label htmlFor="gender">Gender</Label>
                                        <div className="relative">
                                            <select
                                                id="gender"
                                                value={gender}
                                                onChange={(e) => setGender(e.target.value)}
                                                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-9"
                                            >
                                                <option value="" disabled>Select Gender</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                            <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                                        </div>
                                    </div>

                                    {/* COLLEGE */}
                                    <div className="space-y-3 md:col-span-2">
                                        <Label htmlFor="college">College / University</Label>
                                        <div className="relative">
                                            <BookOpen className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="college"
                                                value={college}
                                                onChange={(e) => setCollege(e.target.value)}
                                                placeholder="Enter your college name"
                                                className="pl-9"
                                            />
                                        </div>
                                    </div>

                                    {/* SEPARATOR */}
                                    <div className="col-span-full py-4">
                                        <div className="h-px bg-slate-100" />
                                        <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-2">Online Presence</h3>
                                        <p className="text-sm text-muted-foreground mb-4">Add your professional profiles to showcase your work.</p>
                                    </div>

                                    {/* GITHUB */}
                                    <div className="space-y-3">
                                        <Label htmlFor="github">GitHub Profile URL <span className="text-red-500">*</span></Label>
                                        <div className="relative">
                                            <Github className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="github"
                                                value={github}
                                                onChange={(e) => setGithub(e.target.value)}
                                                placeholder="https://github.com/username"
                                                className="pl-9"
                                            />
                                        </div>
                                    </div>

                                    {/* LINKEDIN */}
                                    <div className="space-y-3">
                                        <Label htmlFor="linkedin">LinkedIn Profile URL <span className="text-red-500">*</span></Label>
                                        <div className="relative">
                                            <Linkedin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="linkedin"
                                                value={linkedin}
                                                onChange={(e) => setLinkedin(e.target.value)}
                                                placeholder="https://linkedin.com/in/username"
                                                className="pl-9"
                                            />
                                        </div>
                                    </div>


                                    {/* BIO */}
                                    <div className="space-y-3 md:col-span-2">
                                        <Label htmlFor="bio">Bio / About Me</Label>
                                        <div className="relative">
                                            <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <textarea
                                                id="bio"
                                                value={bio}
                                                onChange={(e) => setBio(e.target.value)}
                                                placeholder="Tell us a little about yourself..."
                                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-9"
                                            />
                                        </div>
                                        <p className="text-xs text-muted-foreground">This bio will be visible to administrators.</p>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4 border-t">
                                    {!isProfileLocked && (
                                        <Button type="submit" disabled={loading || !!phoneError} className="bg-primary hover:bg-primary/90 min-w-[140px]">
                                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            Save Changes
                                        </Button>
                                    )}
                                    {isProfileLocked && (
                                        <Button type="submit" disabled={loading} className="bg-primary hover:bg-primary/90">
                                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            Update Profile
                                        </Button>
                                    )}
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Resume Tab */}
                <TabsContent value="resume">
                    <Card className="border shadow-sm">
                        <CardHeader>
                            <CardTitle>Resume Upload</CardTitle>
                            <CardDescription>Upload your latest resume to apply for jobs and internships.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center bg-slate-50/50 hover:bg-slate-50 transition-colors">
                                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Upload className="h-8 w-8" />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900">
                                    {user?.resume_path ? "Update Your Resume" : "Upload Your Resume"}
                                </h3>
                                <p className="text-slate-500 max-w-sm mx-auto mt-2 mb-6 text-sm">
                                    Drag and drop or click to upload. Supported formats: PDF, DOC, DOCX. Max size: 5MB.
                                </p>
                                <Button variant="outline" onClick={() => resumeInputRef.current?.click()}>
                                    Select File
                                </Button>
                                <input
                                    type="file"
                                    ref={resumeInputRef}
                                    className="hidden"
                                    accept=".pdf,.doc,.docx"
                                    onChange={handleResumeUpload}
                                />
                            </div>

                            {user?.resume_path && (
                                <div className="bg-green-50 border border-green-100 rounded-lg p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                            <FileText className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-green-900 text-sm">Resume Uploaded</p>
                                            <a
                                                href={`${API_URL}${user.resume_path}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-xs text-green-700 hover:underline"
                                            >
                                                View Current Resume
                                            </a>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm" className="text-green-700 hover:text-green-800 hover:bg-green-100" onClick={() => window.open(`${API_URL}${user.resume_path}`, '_blank')}>
                                        Download
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Security Tab */}
                <TabsContent value="security">
                    <Card className="border shadow-sm">
                        <CardHeader>
                            <CardTitle>Security Settings</CardTitle>
                            <CardDescription>Manage your password and account security.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <SecurityTabContent API_URL={API_URL} />
                        </CardContent>
                    </Card>
                </TabsContent>

            </Tabs>
        </div>
    );
}
