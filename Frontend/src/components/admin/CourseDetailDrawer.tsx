import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line
} from 'recharts';
import { Loader2, BookOpen, Users, BarChart2, Settings, Plus, PlayCircle, Download, Edit } from "lucide-react";

interface CourseDetailDrawerProps {
    course: any;
    isOpen: boolean;
    onClose: () => void;
}

export default function CourseDetailDrawer({ course, isOpen, onClose }: CourseDetailDrawerProps) {
    const [activeTab, setActiveTab] = useState("analytics");
    const [loading, setLoading] = useState(false);
    const [analytics, setAnalytics] = useState<any>(null);
    const [curriculum, setCurriculum] = useState<any[]>([]);
    const [students, setStudents] = useState<any[]>([]);

    useEffect(() => {
        if (isOpen && course) {
            fetchCourseDetails();
        }
    }, [isOpen, course, activeTab]);

    const fetchCourseDetails = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        const baseUrl = 'http://localhost:5000/api/courses/' + course.id;

        try {
            if (activeTab === 'analytics' && !analytics) {
                const res = await fetch(`${baseUrl}/analytics`, { headers });
                if (res.ok) setAnalytics(await res.json());
            }
            else if (activeTab === 'curriculum' && curriculum.length === 0) {
                const res = await fetch(`${baseUrl}/curriculum`, { headers });
                if (res.ok) setCurriculum(await res.json());
            }
            else if (activeTab === 'students' && students.length === 0) {
                const res = await fetch(`${baseUrl}/students`, { headers });
                if (res.ok) setStudents(await res.json());
            }
        } catch (error) {
            console.error("Failed to fetch course details", error);
        } finally {
            setLoading(false);
        }
    };

    if (!course) return null;

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="sm:max-w-4xl w-full p-0 flex flex-col gap-0 h-full">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                    <SheetHeader className="mb-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <Badge variant="outline" className="mb-2 bg-white">{course.category}</Badge>
                                <SheetTitle className="text-2xl font-bold text-slate-900">{course.title}</SheetTitle>
                                <SheetDescription className="line-clamp-1 mt-1">
                                    By {course.instructor} • {course.level} Level
                                </SheetDescription>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => {/* Handle Edit */ }}>
                                Edit Course
                            </Button>
                        </div>
                    </SheetHeader>

                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
                            <TabsTrigger value="analytics">Analytics</TabsTrigger>
                            <TabsTrigger value="students">Students</TabsTrigger>
                            <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                            <TabsTrigger value="settings">Settings</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                <div className="flex-1 overflow-hidden bg-slate-50/30">
                    <ScrollArea className="h-full p-6">
                        {loading ? (
                            <div className="flex justify-center items-center h-40">
                                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                            </div>
                        ) : (
                            <>
                                <TabsContent value="analytics" className="mt-0 space-y-6">
                                    {/* Summary Cards */}
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                                            <p className="text-sm text-slate-500">Total Revenue</p>
                                            <p className="text-2xl font-bold text-slate-900">${(course.price * (course.enrolled || 0)).toLocaleString()}</p>
                                        </div>
                                        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                                            <p className="text-sm text-slate-500">Avg. Completion</p>
                                            <p className="text-2xl font-bold text-blue-600">
                                                {course.enrolled > 0 ? Math.round((course.completed / course.enrolled) * 100) : 0}%
                                            </p>
                                        </div>
                                        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                                            <p className="text-sm text-slate-500">Rating</p>
                                            <div className="flex items-center gap-1">
                                                <p className="text-2xl font-bold text-yellow-600">{Number(course.rating || 0).toFixed(1)}</p>
                                                <span className="text-xs text-slate-400">/ 5.0</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Charts */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                                            <h4 className="font-semibold text-slate-800 mb-4">Enrollment Growth</h4>
                                            <div className="h-[250px] w-full">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <LineChart data={analytics?.enrollmentGrowth || []}>
                                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                        <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                                        <YAxis fontSize={12} tickLine={false} axisLine={false} />
                                                        <RechartsTooltip />
                                                        <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
                                                    </LineChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                                            <h4 className="font-semibold text-slate-800 mb-4">Completion Status</h4>
                                            <div className="h-[250px] w-full">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <BarChart data={analytics?.completionStats || []}>
                                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                        <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                                        <YAxis fontSize={12} tickLine={false} axisLine={false} />
                                                        <RechartsTooltip cursor={{ fill: 'transparent' }} />
                                                        <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="students" className="mt-0">
                                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                                            <h3 className="font-semibold text-slate-900">Enrolled Students ({students.length})</h3>
                                            <Button variant="outline" size="sm" className="gap-2">
                                                <Download className="h-4 w-4" /> Export CSV
                                            </Button>
                                        </div>
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="bg-slate-50 hover:bg-slate-50">
                                                    <TableHead>Student</TableHead>
                                                    <TableHead>Enrolled Date</TableHead>
                                                    <TableHead>Current Module</TableHead>
                                                    <TableHead>Time Spent</TableHead>
                                                    <TableHead>Status</TableHead>
                                                    <TableHead>Progress</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {students.length === 0 ? (
                                                    <TableRow>
                                                        <TableCell colSpan={4} className="text-center py-8 text-slate-500">
                                                            No students enrolled yet.
                                                        </TableCell>
                                                    </TableRow>
                                                ) : (
                                                    students.map((student) => (
                                                        <TableRow key={student.id}>
                                                            <TableCell>
                                                                <div className="font-medium text-slate-900">{student.name}</div>
                                                                <div className="text-xs text-slate-500">{student.email}</div>
                                                            </TableCell>
                                                            <TableCell className="text-slate-500 text-sm">
                                                                {new Date(student.enrolled_at).toLocaleDateString()}
                                                            </TableCell>
                                                            <TableCell className="text-sm text-slate-600">
                                                                {student.progress === 100 ? "Final Project" : student.progress > 50 ? "Advanced Concepts" : "Introduction"}
                                                            </TableCell>
                                                            <TableCell className="text-sm text-slate-600">
                                                                {Math.floor(Math.random() * 20) + 2}h {Math.floor(Math.random() * 60)}m
                                                            </TableCell>
                                                            <TableCell>
                                                                <Badge variant={student.progress === 100 ? "default" : "secondary"}
                                                                    className={student.progress === 100 ? "bg-green-100 text-green-700" : "bg-blue-50 text-blue-700"}>
                                                                    {student.progress === 100 ? "Completed" : "In Progress"}
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell className="w-[150px]">
                                                                <div className="flex items-center gap-2">
                                                                    <Progress value={student.progress} className="h-2 w-full" />
                                                                    <span className="text-xs font-medium w-8 text-right">{student.progress}%</span>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </TabsContent>

                                <TabsContent value="curriculum" className="mt-0 space-y-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="text-lg font-semibold text-slate-900">Course Content</h3>
                                        <Button size="sm" className="gap-2">
                                            <Plus className="h-4 w-4" /> Add Module
                                        </Button>
                                    </div>

                                    {curriculum.length === 0 ? (
                                        <div className="text-center py-12 bg-white rounded-xl border border-slate-200 border-dashed">
                                            <BookOpen className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                                            <p className="text-slate-500">No content added yet.</p>
                                            <Button variant="link" className="text-blue-600">Start creating curriculum</Button>
                                        </div>
                                    ) : (
                                        <Accordion type="multiple" className="space-y-4">
                                            {curriculum.map((module) => (
                                                <AccordionItem key={module.id} value={`m-${module.id}`} className="bg-white border rounded-lg px-4 shadow-sm">
                                                    <AccordionTrigger className="hover:no-underline py-4">
                                                        <span className="font-semibold text-slate-800 text-left">{module.title}</span>
                                                        <Badge variant="secondary" className="ml-auto mr-4 text-xs font-normal">
                                                            {module.lessons.length} Lessons
                                                        </Badge>
                                                    </AccordionTrigger>
                                                    <AccordionContent className="pt-0 pb-4 space-y-1">
                                                        {module.lessons.map((lesson: any) => (
                                                            <div key={lesson.id} className="flex items-center gap-3 p-3 rounded-md hover:bg-slate-50 transition-colors group cursor-pointer border border-transparent hover:border-slate-100">
                                                                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                                                    <PlayCircle className="h-4 w-4" />
                                                                </div>
                                                                <div className="flex-1">
                                                                    <p className="text-sm font-medium text-slate-900">{lesson.title}</p>
                                                                    <p className="text-xs text-slate-500">{lesson.duration || 10} min</p>
                                                                </div>
                                                                <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                                                                    <Edit className="h-3 w-3 text-slate-400" />
                                                                </Button>
                                                            </div>
                                                        ))}
                                                        <Button variant="ghost" className="w-full mt-2 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 border border-dashed border-blue-200">
                                                            + Add Lesson
                                                        </Button>
                                                    </AccordionContent>
                                                </AccordionItem>
                                            ))}
                                        </Accordion>
                                    )}
                                </TabsContent>

                                <TabsContent value="settings" className="mt-0">
                                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                        <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                            <Settings className="h-4 w-4" /> General Settings
                                        </h3>
                                        <p className="text-slate-500 text-sm">Course settings and configuration options would go here.</p>
                                        <div className="mt-8 flex gap-4">
                                            <Button variant="destructive">Archive Course</Button>
                                            <Button variant="outline">Duplicate Course</Button>
                                        </div>
                                    </div>
                                </TabsContent>
                            </>
                        )}
                    </ScrollArea>
                </div>
            </SheetContent>
        </Sheet>
    );
}
