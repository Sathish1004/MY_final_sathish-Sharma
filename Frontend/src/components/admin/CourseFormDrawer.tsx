import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Plus, PlayCircle, Lock, Trash2, FileVideo } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";

interface Course {
    id?: number;
    title: string;
    description: string;
    instructor: string;
    thumbnail: string;
    category: string;
    level: string;
    price: number;
    status: string;
}

interface Module {
    id: number;
    title: string;
    video_path: string;
    duration_seconds: number;
    order_index: number;
}

interface CourseFormDrawerProps {
    course: Course | null;
    isOpen: boolean;
    onClose: () => void;
    onCourseSaved: () => void;
}

export default function CourseFormDrawer({ course, isOpen, onClose, onCourseSaved }: CourseFormDrawerProps) {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<Course>({
        title: "",
        description: "",
        instructor: "",
        thumbnail: "",
        category: "Development",
        level: "Beginner",
        price: 0,
        status: "Draft"
    });

    // Module State
    const [modules, setModules] = useState<Module[]>([]);
    const [isAddModuleOpen, setIsAddModuleOpen] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [createdCourseId, setCreatedCourseId] = useState<number | null>(null); // New state to track newly created course
    const [newModule, setNewModule] = useState({
        title: "",
        file: null as File | null,
        order: 1
    });

    const refreshModules = async () => {
        const targetCourseId = course?.id || createdCourseId;
        if (!targetCourseId) return;
        try {
            const token = localStorage.getItem('token');
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const res = await fetch(`${apiUrl}/api/modules/course/${targetCourseId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setModules(data);
                setNewModule(prev => ({ ...prev, order: data.length + 1 }));
            }
        } catch (e) {
            console.error("Failed to load modules", e);
        }
    };

    useEffect(() => {
        if (course?.id || createdCourseId) {
            refreshModules();
        } else {
            setModules([]);
        }
    }, [course, createdCourseId]);

    useEffect(() => {
        // Reset or Initialize
        if (course) {
            setFormData(course);
            setCreatedCourseId(null); // Reset
        } else if (!isOpen) {
            // Reset when closed
            setCreatedCourseId(null);
        } else if (!createdCourseId) {
            // Only reset if we are not in "Continue Editing" mode
            setFormData({
                title: "",
                description: "",
                instructor: "",
                thumbnail: "",
                category: "Development",
                level: "Beginner",
                price: 0,
                status: "Draft"
            });
        }
    }, [course, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'price' ? parseFloat(value) : value
        }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        if (!formData.title || !formData.description || !formData.instructor) {
            toast({ title: "Validation Error", description: "Please fill in all required fields", variant: "destructive" });
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const targetId = course?.id || createdCourseId;
            const url = targetId
                ? `${apiUrl}/api/courses/${targetId}`
                : `${apiUrl}/api/courses`;

            const method = targetId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Failed to save course');

            const data = await response.json();

            if (!course && !createdCourseId) {
                // Was a create action
                toast({ title: "Success", description: "Course created! You can now add modules below." });
                setCreatedCourseId(data.courseId);
                onCourseSaved();
                // Do NOT close, let them add modules
            } else {
                toast({ title: "Success", description: "Course updated successfully" });
                onCourseSaved();
                onClose();
            }
        } catch (error) {
            console.error("Save error:", error);
            toast({ title: "Error", description: "Failed to save course", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setNewModule({ ...newModule, file: e.target.files[0] });
        }
    };

    const handleAddModule = async () => {
        const targetCourseId = course?.id || createdCourseId;
        if (!targetCourseId) return;
        if (!newModule.title || !newModule.file) {
            toast({ title: "Error", description: "Title and Video file are required", variant: "destructive" });
            return;
        }

        setIsUploading(true);
        setUploadProgress(10); // Start artificial progress

        try {
            const formData = new FormData();
            formData.append('courseId', targetCourseId.toString());
            formData.append('title', newModule.title);
            formData.append('video', newModule.file);
            formData.append('order', newModule.order.toString());

            const token = localStorage.getItem('token');
            const xhr = new XMLHttpRequest();

            // Using XHR for progress event since fetch doesn't support it natively easily without streams
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            xhr.open('POST', `${apiUrl}/api/modules`);
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);

            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    const percentComplete = (event.loaded / event.total) * 100;
                    setUploadProgress(percentComplete);
                }
            };

            xhr.onload = () => {
                if (xhr.status === 201) {
                    toast({ title: "Success", description: "Module added successfully" });
                    setIsAddModuleOpen(false);
                    setNewModule({ title: "", file: null, order: modules.length + 2 });
                    refreshModules();
                } else {
                    toast({ title: "Error", description: "Failed to upload module", variant: "destructive" });
                }
                setIsUploading(false);
                setUploadProgress(0);
            };

            xhr.onerror = () => {
                toast({ title: "Error", description: "Network Error", variant: "destructive" });
                setIsUploading(false);
            };

            xhr.send(formData);

        } catch (error) {
            console.error("Upload error:", error);
            setIsUploading(false);
        }
    };

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="overflow-y-auto sm:max-w-md w-full">
                <SheetHeader>
                    <SheetTitle>{course ? 'Edit Course' : 'Create New Course'}</SheetTitle>
                    <SheetDescription>
                        {course ? 'Update course details below.' : 'Fill in the details to create a new course.'}
                    </SheetDescription>
                </SheetHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Course Title *</Label>
                        <Input id="title" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Intro to React" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="instructor">Instructor Name *</Label>
                        <Input id="instructor" name="instructor" value={formData.instructor} onChange={handleChange} placeholder="e.g. John Doe" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description *</Label>
                        <Textarea id="description" name="description" value={formData.description} onChange={handleChange} placeholder="Course summary..." rows={3} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Select value={formData.category} onValueChange={(val) => handleSelectChange('category', val)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Development">Development</SelectItem>
                                    <SelectItem value="Design">Design</SelectItem>
                                    <SelectItem value="Business">Business</SelectItem>
                                    <SelectItem value="Marketing">Marketing</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="level">Level</Label>
                            <Select value={formData.level} onValueChange={(val) => handleSelectChange('level', val)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Beginner">Beginner</SelectItem>
                                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                                    <SelectItem value="Advanced">Advanced</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="price">Price ($)</Label>
                            <Input id="price" name="price" type="number" min="0" step="0.01" value={formData.price} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select value={formData.status} onValueChange={(val) => handleSelectChange('status', val)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Draft">Draft</SelectItem>
                                    <SelectItem value="Published">Published</SelectItem>
                                    <SelectItem value="Archived">Archived</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="thumbnail">Thumbnail URL</Label>
                        <Input id="thumbnail" name="thumbnail" value={formData.thumbnail} onChange={handleChange} placeholder="https://..." />
                    </div>
                </div>

                {/* Modules Section */}
                {(course?.id || createdCourseId) && (
                    <div className="space-y-4 pt-4 border-t">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Course Modules ({modules.length})</h3>
                            <Dialog open={isAddModuleOpen} onOpenChange={setIsAddModuleOpen}>
                                <DialogTrigger asChild>
                                    <Button size="sm" variant="outline" className="gap-2">
                                        <Plus className="h-4 w-4" /> Add Module
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Add New Module</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <Label>Module Title</Label>
                                            <Input
                                                value={newModule.title}
                                                onChange={(e) => setNewModule({ ...newModule, title: e.target.value })}
                                                placeholder="e.g. Introduction to Variables"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Order Index</Label>
                                            <Input
                                                type="number"
                                                value={newModule.order}
                                                onChange={(e) => setNewModule({ ...newModule, order: parseInt(e.target.value) })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Video File</Label>
                                            <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors">
                                                <Input
                                                    type="file"
                                                    accept="video/mp4,video/webm"
                                                    className="hidden"
                                                    id="video-upload"
                                                    onChange={handleFileChange}
                                                />
                                                <Label htmlFor="video-upload" className="cursor-pointer flex flex-col items-center gap-2">
                                                    <FileVideo className="h-8 w-8 text-slate-400" />
                                                    <span className="text-sm font-medium text-slate-600">
                                                        {newModule.file ? newModule.file.name : "Click to select video"}
                                                    </span>
                                                    <span className="text-xs text-slate-400">MP4, WebM (Max 500MB)</span>
                                                </Label>
                                            </div>
                                        </div>
                                        {isUploading && (
                                            <div className="space-y-1">
                                                <div className="flex justify-between text-xs">
                                                    <span>Uploading...</span>
                                                    <span>{Math.round(uploadProgress)}%</span>
                                                </div>
                                                <Progress value={uploadProgress} />
                                            </div>
                                        )}
                                    </div>
                                    <DialogFooter>
                                        <Button variant="ghost" onClick={() => setIsAddModuleOpen(false)} disabled={isUploading}>Cancel</Button>
                                        <Button onClick={handleAddModule} disabled={isUploading || !newModule.file}>
                                            {isUploading ? 'Uploading...' : 'Add Module'}
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>

                        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                            {modules.length === 0 ? (
                                <p className="text-sm text-slate-400 text-center py-4">No modules added yet.</p>
                            ) : (
                                modules.map((module) => (
                                    <div key={module.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 bg-slate-200 rounded-full flex items-center justify-center text-xs font-bold text-slate-600">
                                                {module.order_index}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">{module.title}</p>
                                                <p className="text-xs text-slate-400">{Math.floor(module.duration_seconds / 60)} mins • {module.duration_seconds % 60} secs</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {/* Edit/Delete can be added here */}
                                            <PlayCircle className="h-4 w-4 text-slate-400" />
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
                <SheetFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={loading}>{loading ? 'Saving...' : 'Save Course'}</Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
