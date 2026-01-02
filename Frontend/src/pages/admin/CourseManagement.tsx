import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, LayoutGrid, List as ListIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import CourseFormDrawer from "@/components/admin/CourseFormDrawer";
import CourseCard from "@/components/admin/CourseCard";
import CourseDetailDrawer from "@/components/admin/CourseDetailDrawer";

interface Course {
    id: number;
    title: string;
    description: string;
    instructor: string;
    thumbnail: string;
    category: string;
    level: string;
    price: number;
    status: 'Draft' | 'Published' | 'Archived';
    created_at: string;
    enrolled: number;
    completed: number;
    rating: number;
}

export default function CourseManagement() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [levelFilter, setLevelFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const { toast } = useToast();

    // Drawer States
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [isFormDrawerOpen, setIsFormDrawerOpen] = useState(false);
    const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const queryParams = new URLSearchParams();
            if (search) queryParams.append('search', search);
            if (levelFilter !== 'all') queryParams.append('level', levelFilter);
            if (statusFilter !== 'all') queryParams.append('status', statusFilter);

            const response = await fetch(`http://localhost:5000/api/courses?${queryParams}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!response.ok) throw new Error('Failed to fetch courses');

            const data = await response.json();
            setCourses(data);
        } catch (error) {
            console.error("Error fetching courses:", error);
            toast({
                title: "Error",
                description: "Failed to load courses",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchCourses();
        }, 300); // Debounce search
        return () => clearTimeout(timer);
    }, [search, levelFilter, statusFilter]);

    const handleOpenCreate = () => {
        setSelectedCourse(null);
        setIsFormDrawerOpen(true);
    };

    const handleEdit = (course: Course) => {
        setSelectedCourse(course);
        setIsFormDrawerOpen(true);
    };

    const handleCardClick = (course: Course) => {
        setSelectedCourse(course);
        setIsDetailDrawerOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this course?")) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/courses/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!response.ok) throw new Error('Failed to delete course');

            toast({ title: "Success", description: "Course deleted successfully" });
            fetchCourses();
        } catch (error) {
            console.error("Delete error:", error);
            toast({ title: "Error", description: "Failed to delete course", variant: "destructive" });
        }
    };

    return (
        <div className="space-y-6 p-6 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Courses & Learning</h2>
                    <p className="text-slate-500 mt-1">Manage curriculum, track student progress, and analyze performance.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => setViewMode('grid')} className={viewMode === 'grid' ? 'bg-slate-100' : ''}>
                        <LayoutGrid className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => setViewMode('list')} className={viewMode === 'list' ? 'bg-slate-100' : ''}>
                        <ListIcon className="h-4 w-4" />
                    </Button>
                    <Button onClick={handleOpenCreate} className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="mr-2 h-4 w-4" /> Create Course
                    </Button>
                </div>
            </div>

            {/* Filters & Control Bar */}
            <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Search by title, instructor, or category..."
                        className="pl-10 border-slate-200 focus-visible:ring-blue-500"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-full md:w-auto">
                    <TabsList>
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="Published">Published</TabsTrigger>
                        <TabsTrigger value="Draft">Drafts</TabsTrigger>
                    </TabsList>
                </Tabs>
                <Select value={levelFilter} onValueChange={setLevelFilter}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by Level" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Levels</SelectItem>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Course Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((n) => (
                        <div key={n} className="h-[300px] bg-slate-100 animate-pulse rounded-xl" />
                    ))}
                </div>
            ) : courses.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
                    <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="h-8 w-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900">No courses found</h3>
                    <p className="text-slate-500 max-w-sm mx-auto mt-2">Try adjusting your search or filters, or create a new course to get started.</p>
                    <Button variant="outline" className="mt-6" onClick={() => { setSearch(""); setLevelFilter("all"); setStatusFilter("all"); }}>
                        Clear Filters
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {courses.map((course) => (
                        <CourseCard
                            key={course.id}
                            course={course}
                            onClick={() => handleCardClick(course)}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}

            {/* Drawers */}
            <CourseFormDrawer
                course={selectedCourse}
                isOpen={isFormDrawerOpen}
                onClose={() => setIsFormDrawerOpen(false)}
                onCourseSaved={fetchCourses}
            />

            <CourseDetailDrawer
                course={selectedCourse}
                isOpen={isDetailDrawerOpen}
                onClose={() => setIsDetailDrawerOpen(false)}
            />
        </div>
    );
}
