import { BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function CoursesOverview({ courseStats }: { courseStats: any }) {
    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-orange-600" />
                    Courses Overview
                </h3>
            </div>
            <Card>
                <CardContent className="p-0">
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-orange-50/30">
                        <div>
                            <p className="text-sm text-slate-500">Total Enrollments</p>
                            <p className="text-2xl font-bold text-slate-900">{courseStats.total_enrollments}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-slate-500">Completion Rate</p>
                            <p className="text-2xl font-bold text-green-600">{courseStats.completion_rate}</p>
                        </div>
                    </div>
                    <div className="p-4">
                        <p className="text-sm font-semibold text-slate-900 mb-3">Top Performing Courses</p>
                        <div className="space-y-3">
                            {courseStats.top_courses && courseStats.top_courses.length > 0 ? (
                                courseStats.top_courses.map((course: any, i: number) => (
                                    <div key={i} className="flex items-center justify-between text-sm">
                                        <span className="text-slate-700 truncate max-w-[180px]">{course.name}</span>
                                        <div className="flex items-center gap-3">
                                            <span className="text-slate-400 text-xs">{course.students} students</span>
                                            <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-orange-500" style={{ width: `${course.progress}%` }}></div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-xs text-slate-400">No courses data available.</p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
