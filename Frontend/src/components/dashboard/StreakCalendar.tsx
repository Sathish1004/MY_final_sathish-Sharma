import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Zap, CheckCircle2 } from 'lucide-react';
import { ActivityLog } from '@/contexts/CourseContext';

interface StreakCalendarProps {
    activityLogs: ActivityLog[];
}

export const StreakCalendar: React.FC<StreakCalendarProps> = ({ activityLogs }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    // Helper to format date key YYYY-MM-DD
    const formatDateKey = (date: Date) => {
        return date.toISOString().split('T')[0];
    };

    // Memoized active days set for O(1) lookup
    const activeDays = useMemo(() => {
        const set = new Set<string>();
        activityLogs.forEach(log => {
            const date = new Date(log.timestamp);
            set.add(formatDateKey(date));
        });
        return set;
    }, [activityLogs]);

    // Get calendar data
    const getCalendarDays = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const firstDayOfMonth = new Date(year, month, 1);
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // 0 = Sunday, 1 = Monday, ... 6 = Saturday
        // We want Monday to be 0 for the grid
        let startingDayIndex = firstDayOfMonth.getDay() - 1;
        if (startingDayIndex === -1) startingDayIndex = 6; // Sunday becomes 6

        const days = [];

        // Previous month padding
        for (let i = 0; i < startingDayIndex; i++) {
            days.push(null);
        }

        // Current month days
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(new Date(year, month, i));
        }

        return days;
    };

    const calendarDays = getCalendarDays();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    const isToday = (date: Date) => formatDateKey(date) === formatDateKey(new Date());
    const isActive = (date: Date) => activeDays.has(formatDateKey(date));
    const isSelected = (date: Date) => selectedDate && formatDateKey(date) === formatDateKey(selectedDate);

    // Get activities: Selected date OR Global (Top 50 recent?)
    const selectedActivities = useMemo(() => {
        if (!selectedDate) {
            // Return recent activities sorted descending
            return [...activityLogs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        }
        const key = formatDateKey(selectedDate);
        return activityLogs.filter(log => formatDateKey(new Date(log.timestamp)) === key);
    }, [selectedDate, activityLogs]);

    const handleDateClick = (date: Date) => {
        if (selectedDate && formatDateKey(date) === formatDateKey(selectedDate)) {
            setSelectedDate(null); // Deselect
        } else {
            setSelectedDate(date);
        }
    };

    return (
        <Card className="border-0 shadow-none bg-transparent">
            <CardHeader className="px-0 py-2">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-700">
                        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </h3>
                    {/* Navigation buttons could go here if we want history traversal */}
                </div>
            </CardHeader>
            <CardContent className="px-0">
                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 mb-4">
                    {weekDays.map(day => (
                        <div key={day} className="text-center text-[10px] uppercase text-slate-400 font-medium py-1">
                            {day}
                        </div>
                    ))}

                    {calendarDays.map((date, index) => {
                        if (!date) return <div key={`empty-${index}`} />;

                        const active = isActive(date);
                        const selected = isSelected(date);
                        const today = isToday(date);

                        return (
                            <TooltipProvider key={index}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button
                                            onClick={() => handleDateClick(date)}
                                            className={`
                                                aspect-square rounded-md flex items-center justify-center text-xs font-medium transition-all duration-200
                                                ${selected
                                                    ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-200'
                                                    : active
                                                        ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                                                        : today
                                                            ? 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                                                            : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}
                                            `}
                                        >
                                            {date.getDate()}
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{active ? 'Activity recorded' : 'No activity'}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        );
                    })}
                </div>

                {/* Activity List Section */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 mt-2">
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-semibold text-slate-700">
                            {selectedDate
                                ? selectedDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })
                                : 'Recent Activity'}
                        </h4>
                        {selectedDate && isActive(selectedDate) && (
                            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full flex items-center gap-1">
                                <Zap className="h-3 w-3" /> Active Day
                            </span>
                        )}
                        {selectedDate && (
                            <button
                                onClick={() => setSelectedDate(null)}
                                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                            >
                                View All
                            </button>
                        )}
                    </div>

                    <div className="space-y-3 max-h-[120px] overflow-y-auto pr-2 custom-scrollbar">
                        {selectedActivities.length > 0 ? (
                            selectedActivities.map((log, idx) => (
                                <div key={idx} className="flex gap-3 items-start p-2 rounded-lg bg-white border border-slate-100 shadow-sm shrink-0 transition-all hover:border-slate-300">
                                    <div className="mt-0.5">
                                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium text-slate-800 line-clamp-1">{log.detail}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded whitespace-nowrap">
                                                {new Date(log.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} • {new Date(log.timestamp).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-slate-400 text-xs">
                                No activity recorded.
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
