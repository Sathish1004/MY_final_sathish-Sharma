import { useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { User, FileText, Lock, Upload, Loader2, Camera, Shield, Mail, Phone, BookOpen } from "lucide-react";

export default function Profile() {
    const { user, signIn } = useAuth(); // Re-using signIn to update context if needed, or we might need a refreshUser function in context
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    // Form States
    const [name, setName] = useState(user?.name || "");
    const [phone, setPhone] = useState(user?.phone_number || "");
    const [college, setCollege] = useState(user?.college_name || "");

    // Password States
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // File Refs
    const avatarInputRef = useRef<HTMLInputElement>(null);
    const resumeInputRef = useRef<HTMLInputElement>(null);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
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
                    phone_number: phone,
                    college_name: college
                })
            });

            if (!res.ok) throw new Error("Failed to update profile");

            toast({ title: "Success", description: "Profile updated successfully." });
            // Ideally trigger a context refresh here
        } catch (error) {
            toast({ title: "Error", description: "Failed to update profile.", variant: "destructive" });
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

            const data = await res.json();
            toast({ title: "Success", description: "Profile picture updated." });
            // Reload page to see changes (simple way) or update context
            window.location.reload();
        } catch (error) {
            toast({ title: "Error", description: "Failed to upload avatar.", variant: "destructive" });
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
            window.location.reload();
        } catch (error) {
            toast({ title: "Error", description: "Failed to upload resume.", variant: "destructive" });
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast({ title: "Error", description: "New passwords do not match.", variant: "destructive" });
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
            if (!res.ok) throw new Error(data.message || "Failed to change password");

            toast({ title: "Success", description: "Password changed successfully." });
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error) {
            const err = error as Error;
            toast({ title: "Error", description: err.message, variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-6 md:p-8 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row gap-6 items-center bg-white rounded-2xl p-8 border border-slate-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-500/10 to-indigo-500/10" />

                <div className="relative group">
                    <Avatar className="h-32 w-32 border-4 border-white shadow-md">
                        <AvatarImage src={user?.profile_picture ? `${API_URL}${user.profile_picture}` : undefined} className="object-cover" />
                        <AvatarFallback className="text-4xl bg-blue-50 text-blue-600 font-bold">
                            {user?.name?.charAt(0).toUpperCase()}
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
                    <h1 className="text-3xl font-bold text-slate-900">{user?.name}</h1>
                    <div className="flex flex-wrap gap-4 items-center justify-center md:justify-start text-sm text-slate-500">
                        <span className="flex items-center gap-1.5"><Mail className="h-4 w-4" /> {user?.email}</span>
                        <span className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-medium text-xs border border-blue-100 uppercase tracking-wide">
                            {user?.role || 'Student'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Content Tabs */}
            <Tabs defaultValue="personal" className="w-full">
                <TabsList className="bg-white border p-1 rounded-xl w-full md:w-auto h-auto grid grid-cols-3 md:inline-flex mb-6">
                    <TabsTrigger value="personal" className="py-2.5 px-6 rounded-lg data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 font-medium">
                        <User className="h-4 w-4 mr-2" /> Personal Info
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
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                            <CardDescription>Update your personal details and contact information.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleUpdateProfile} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="name"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="pl-9"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input id="email" value={user?.email} disabled className="pl-9 bg-slate-50" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="phone"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                placeholder="+91 98765 43210"
                                                className="pl-9"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
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
                                </div>
                                <div className="flex justify-end">
                                    <Button type="submit" disabled={loading} className="bg-primary hover:bg-primary/90">
                                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Save Changes
                                    </Button>
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
                            <form onSubmit={handleChangePassword} className="space-y-6 max-w-md">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="current-password">Current Password</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="current-password"
                                                type="password"
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                                className="pl-9"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="new-password">New Password</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="new-password"
                                                type="password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="pl-9"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="confirm-password"
                                                type="password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="pl-9"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <Button type="submit" disabled={loading} variant="destructive" className="w-full sm:w-auto">
                                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Change Password
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>


            </Tabs>
        </div>
    );
}
