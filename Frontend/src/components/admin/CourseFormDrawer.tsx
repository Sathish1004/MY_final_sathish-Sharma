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

    useEffect(() => {
        if (course) {
            setFormData(course);
        } else {
            // Reset form for new course
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
            const url = course
                ? `http://localhost:5000/api/courses/${course.id}`
                : 'http://localhost:5000/api/courses';

            const method = course ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Failed to save course');

            toast({ title: "Success", description: `Course ${course ? 'updated' : 'created'} successfully` });
            onCourseSaved();
            onClose();
        } catch (error) {
            console.error("Save error:", error);
            toast({ title: "Error", description: "Failed to save course", variant: "destructive" });
        } finally {
            setLoading(false);
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
                <SheetFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={loading}>{loading ? 'Saving...' : 'Save Course'}</Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
