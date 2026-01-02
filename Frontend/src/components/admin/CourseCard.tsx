import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, Star, Clock, MoreVertical, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CourseCardProps {
    course: any;
    onClick: () => void;
    onEdit: (e: any) => void;
    onDelete: (e: any) => void;
}

export default function CourseCard({ course, onClick, onEdit, onDelete }: CourseCardProps) {
    const handleEditClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onEdit(course);
    };

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete(course.id);
    };

    return (
        <Card
            className="group hover:shadow-md transition-all duration-300 cursor-pointer border-slate-200 overflow-hidden flex flex-col h-full"
            onClick={onClick}
        >
            {/* Thumbnail Section */}
            <div className="relative h-40 bg-slate-100 overflow-hidden">
                {course.thumbnail ? (
                    <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-50">
                        No Image
                    </div>
                )}
                <div className="absolute top-3 right-3">
                    <Badge variant={course.status === 'Published' ? 'default' : 'secondary'} className={
                        course.status === 'Published' ? 'bg-green-500 hover:bg-green-600' :
                            course.status === 'Draft' ? 'bg-yellow-500 hover:bg-yellow-600' :
                                'bg-slate-500 hover:bg-slate-600'
                    }>
                        {course.status}
                    </Badge>
                </div>
                <div className="absolute top-3 left-3">
                    <Badge variant="outline" className="bg-white/90 backdrop-blur-sm shadow-sm">
                        {course.category || 'General'}
                    </Badge>
                </div>
            </div>

            <CardHeader className="pb-2 p-4">
                <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-lg leading-tight line-clamp-2 text-slate-900 group-hover:text-blue-600 transition-colors">
                        {course.title}
                    </h3>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 -mt-1 -mr-2 text-slate-400 hover:text-slate-600">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={handleEditClick}>
                                <Edit className="h-4 w-4 mr-2" /> Edit Details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600" onClick={handleDeleteClick}>
                                <Trash2 className="h-4 w-4 mr-2" /> Delete Course
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <p className="text-sm text-slate-500 font-medium">by {course.instructor}</p>
            </CardHeader>

            <CardContent className="p-4 pt-0 flex-grow space-y-4">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-1.5 text-slate-600">
                        <Users className="h-4 w-4 text-blue-500" />
                        <span className="font-semibold">{course.enrolled || 0}</span> Enrolled
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-semibold">{Number(course.rating || 0).toFixed(1)}</span> Rating
                    </div>
                    {/* Placeholder for future duration stat */}
                    {/* <div className="flex items-center gap-1.5 text-slate-600">
                        <Clock className="h-4 w-4 text-slate-400" />
                        <span>2h 15m</span>
                    </div> */}
                </div>

                {/* Progress Bar (Mocked Average, or real if backend provides) */}
                <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-slate-500">
                        <span>Avg. Completion</span>
                        <span className="font-medium text-slate-700">
                            {course.enrolled > 0 ? Math.round((course.completed / course.enrolled) * 100) : 0}%
                        </span>
                    </div>
                    <Progress value={course.enrolled > 0 ? Math.round((course.completed / course.enrolled) * 100) : 0} className="h-1.5" />
                </div>
            </CardContent>

            <CardFooter className="p-4 pt-0 border-t border-slate-50 mt-auto bg-slate-50/50">
                <div className="flex justify-between items-center w-full text-xs text-slate-500 mt-3">
                    <span>
                        <span className="font-semibold text-slate-900">{course.completed || 0}</span> Completed
                    </span>
                    <span>
                        {(course.enrolled || 0) - (course.completed || 0)} Ongoing
                    </span>
                </div>
            </CardFooter>
        </Card>
    );
}
