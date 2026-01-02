
import React, { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame, Clock, Award, ChevronLeft, ChevronRight, X } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useCourse } from '@/contexts/CourseContext';

interface CalendarDay {
    date: string; // YYYY-MM-DD
    timeSpent: number; // seconds
    actions: string[];
    courses: string[];
}

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export function ActivityCalendar({ className, userId }: { className?: string; userId?: number }) {
    const { stats } = useCourse();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [calendarData, setCalendarData] = useState<Record<string, CalendarDay>>({});
    const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);

    useEffect(() => {
        fetchCalendarData();
    }, [userId]);

    const fetchCalendarData = async () => {
        try {
            const endpoint = userId ? `/admin/users/${userId}/calendar` : '/student/calendar';
            const res = await api.get(endpoint);
            // Convert array to map for easy lookup
            const dataMap: Record<string, CalendarDay> = {};
            // Safety check: Ensure res.data is an array before iterating
            if (Array.isArray(res.data)) {
                res.data.forEach((day: CalendarDay) => {
                    dataMap[day.date] = day;
                });
            } else {
                console.warn("API returned non-array for calendar data:", res.data);
            }
            setCalendarData(dataMap);
        } catch (e) {
            console.error("Failed to fetch calendar", e);
        }
    };

    const daysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const firstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    // Navigation
    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    // Generate Calendar Grid
    const generateGrid = () => {
        const totalDays = daysInMonth(currentDate);
        const startDay = firstDayOfMonth(currentDate);
        const days = [];

        // Empty cells for offset
        for (let i = 0; i < startDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-8 w-8" />);
        }

        // Days
        for (let d = 1; d <= totalDays; d++) {
            const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const dayData = calendarData[dateStr];
            const isToday = new Date().toISOString().split('T')[0] === dateStr;
            const hasActivity = dayData && (dayData.timeSpent > 0 || dayData.actions.length > 0);

            days.push(
                <TooltipProvider key={d}>
                    <Tooltip delayDuration={100}>
                        <TooltipTrigger asChild>
                            <button
                                onClick={() => dayData ? setSelectedDay(dayData) : null}
                                className={cn(
                                    "h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium transition-all",
                                    isToday ? "ring-2 ring-blue-500 ring-offset-2 font-bold" : "",
                                    hasActivity
                                        ? "bg-emerald-500 text-white shadow-sm hover:scale-110 hover:bg-emerald-600 cursor-pointer"
                                        : "bg-slate-100 text-slate-400 hover:bg-slate-200 cursor-default"
                                )}
                            >
                                {d}
                            </button>
                        </TooltipTrigger>
                        {hasActivity && (
                            <TooltipContent className="p-3 bg-slate-900 border-none text-white shadow-xl rounded-xl z-50">
                                <div className="space-y-1">
                                    <p className="font-bold text-sm text-emerald-400">{new Date(dateStr).toDateString()}</p>
                                    <div className="text-xs space-y-0.5">
                                        {dayData.timeSpent > 0 && (
                                            <div className="flex items-center gap-1.5">
                                                <Clock className="h-3 w-3 text-slate-300" />
                                                <span>{Math.round(dayData.timeSpent / 60)} mins learned</span>
                                            </div>
                                        )}
                                        {dayData.actions.slice(0, 2).map((action, i) => (
                                            <div key={i} className="flex items-center gap-1.5 opacity-90">
                                                <div className="h-1 w-1 bg-white rounded-full" />
                                                <span className="truncate max-w-[150px]">{action}</span>
                                            </div>
                                        ))}
                                        {dayData.actions.length > 0 && (
                                            <div className="flex items-center gap-1.5 pt-1 text-emerald-300 font-medium">
                                                <Flame className="h-3 w-3" /> Streak Continued
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </TooltipContent>
                        )}
                    </Tooltip>
                </TooltipProvider>
            );
        }
        return days;
    };

    return (
        <Card className={cn("h-full border-slate-200 shadow-sm flex flex-col", className)}>
            {/* 1. Header */}
            <div className="p-6 bg-slate-900 text-white flex justify-between items-center rounded-t-xl">
                <div>
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <Flame className="h-5 w-5 text-amber-500 fill-amber-500" />
                        Your Activity
                    </h3>
                    <p className="text-slate-400 text-xs mt-1">Keep your streak alive!</p>
                </div>
                <div className="text-right">
                    <span className="text-3xl font-bold block leading-none text-amber-500">{stats.streak}</span>
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">Day Streak</span>
                </div>
            </div>

            {/* 2. Calendar View */}
            <CardContent className="p-4 flex-1">
                <div className="flex items-center justify-between mb-4">
                    <button onClick={prevMonth} className="p-1 hover:bg-slate-100 rounded-full transition-colors"><ChevronLeft className="h-4 w-4 text-slate-500" /></button>
                    <span className="font-semibold text-slate-700 text-sm">
                        {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </span>
                    <button onClick={nextMonth} className="p-1 hover:bg-slate-100 rounded-full transition-colors"><ChevronRight className="h-4 w-4 text-slate-500" /></button>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                    {WEEKDAYS.map(d => (
                        <span key={d} className="text-[10px] font-bold text-slate-400 uppercase">{d}</span>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-x-3 gap-y-4 place-items-center">
                    {generateGrid()}
                </div>
            </CardContent>

            {/* Detail Dialog */}
            {selectedDay && (
                <Dialog open={!!selectedDay} onOpenChange={(o) => !o && setSelectedDay(null)}>
                    <DialogContent className="sm:max-w-sm rounded-2xl overflow-hidden p-0 gap-0">
                        <div className="bg-slate-900 p-6 text-white text-center relative">
                            <button onClick={() => setSelectedDay(null)} className="absolute top-4 right-4 p-1 hover:bg-white/10 rounded-full transition-colors"><X className="h-4 w-4" /></button>
                            <div className="h-12 w-12 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-3 text-emerald-400">
                                <Award className="h-6 w-6" />
                            </div>
                            <h2 className="text-xl font-bold">{new Date(selectedDay.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h2>
                            <p className="text-emerald-400 text-sm font-medium mt-1">Activity Log</p>
                        </div>
                        <div className="p-6 bg-white space-y-4">

                            {/* Stats Row */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                                    <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Time</p>
                                    <p className="text-xl font-bold text-slate-800">{Math.round(selectedDay.timeSpent / 60)}m</p>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                                    <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Actions</p>
                                    <p className="text-xl font-bold text-slate-800">{selectedDay.actions.length}</p>
                                </div>
                            </div>

                            {/* Actions List */}
                            <div>
                                <h4 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-blue-500" /> Timeline
                                </h4>
                                <ScrollArea className="h-[200px] pr-4">
                                    <div className="space-y-3 relative before:absolute before:inset-0 before:ml-1.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                                        {selectedDay.actions.map((action, i) => (
                                            <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                                <div className="ml-6 md:ml-0 md:w-[calc(50%_-_16px)] md:px-4 p-3 bg-white border border-slate-100 rounded-lg shadow-sm hover:border-blue-200 transition-colors w-full">
                                                    <p className="text-sm font-medium text-slate-700">{action}</p>
                                                </div>
                                            </div>
                                        ))}
                                        {selectedDay.actions.length === 0 && (
                                            <p className="text-sm text-slate-400 text-center">No details recorded.</p>
                                        )}
                                    </div>
                                </ScrollArea>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </Card>
    );
}
