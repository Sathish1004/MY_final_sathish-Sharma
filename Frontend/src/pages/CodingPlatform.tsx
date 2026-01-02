
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import FeatureGuard from "@/components/FeatureGuard";
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
    Code2,
    Play,
    CheckCircle2,
    Trophy,
    Zap,
    TrendingUp,
    Clock,
    RotateCcw,
    ChevronRight,
    ChevronLeft,
    Star,
    Award,
    BookOpen,
    Filter,
    Search,
    Cpu,
    Database,
    Globe,
    Layout,
    Server,
    Smartphone,
    Terminal,
    AlertCircle,
    Check,
    X,
    Maximize2,
    Minimize2,
    Settings,
    Share2,
    Copy,
    Activity,
    Box,
    Target,
    Users,
    Loader2,
    Lock,
    BrainCircuit,
    Briefcase,
    Building2,
    Send,
    Sun,
    Moon
} from 'lucide-react';
import Editor from "@monaco-editor/react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';

// Mock Data
// Problems moved to state fetched from API

// Badge Definitions
const BADGES = [
    { id: 1, name: "First Step", description: "Solved your first problem", icon: Trophy, color: "text-amber-500 bg-amber-50" },
    { id: 2, name: "Streak Starter", description: "3-Day Learning Streak", icon: Zap, color: "text-blue-500 bg-blue-50" },
    { id: 3, name: "Problem Hunter", description: "Solved 10 Problems", icon: Target, color: "text-emerald-500 bg-emerald-50" },
    { id: 5, name: "Array Master", description: "Complete the Arrays Kit", icon: Layout, color: "text-cyan-500 bg-cyan-50" },
    { id: 6, name: "String Wizard", description: "Complete the Strings Kit", icon: Code2, color: "text-pink-500 bg-pink-50" }
];

const codingKits = [
    {
        id: 1,
        title: "Arrays",
        subtitle: "Master Array Operations",
        progress: 0,
        total: 10,
        color: "from-blue-500 to-cyan-500",
        icon: <Layout className="h-6 w-6 text-white" />,
        badge: { name: "Array Master", icon: <Target className="h-3 w-3" />, color: "text-blue-500" }
    },
    {
        id: 2,
        title: "Strings",
        subtitle: "String Manipulation",
        progress: 0,
        total: 10,
        color: "from-purple-500 to-pink-500",
        icon: <Code2 className="h-6 w-6 text-white" />,
        badge: { name: "String Wizard", icon: <Code2 className="h-3 w-3" />, color: "text-purple-500" }
    }
];

const topics = [
    { name: "Arrays & Hashing", count: 45, color: "text-blue-500", bg: "bg-blue-500/10" },
    { name: "Two Pointers", count: 23, color: "text-green-500", bg: "bg-green-500/10" },
    { name: "Stack", count: 31, color: "text-purple-500", bg: "bg-purple-500/10" },
    { name: "Binary Search", count: 28, color: "text-amber-500", bg: "bg-amber-500/10" },
    { name: "Sliding Window", count: 15, color: "text-rose-500", bg: "bg-rose-500/10" },
    { name: "Linked List", count: 35, color: "text-cyan-500", bg: "bg-cyan-500/10" },
    { name: "Trees", count: 52, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { name: "Dynamic Programming", count: 64, color: "text-indigo-500", bg: "bg-indigo-500/10" },
];

const badgesList = [
    { id: 1, name: "Problem Solver", icon: <Trophy className="h-5 w-5" />, color: "text-amber-500", bg: "bg-amber-50", requirement: "Solve 10 problems to unlock" },
    { id: 2, name: "30 Day Streak", icon: <Zap className="h-5 w-5" />, color: "text-blue-500", bg: "bg-blue-50", requirement: "Maintain a 30-day coding streak" },
    { id: 3, name: "Array Master", icon: <Layout className="h-5 w-5" />, color: "text-cyan-500", bg: "bg-cyan-50", requirement: "Complete the Arrays Kit (all problems solved)" },
    { id: 4, name: "String Wizard", icon: <Code2 className="h-5 w-5" />, color: "text-pink-500", bg: "bg-pink-50", requirement: "Complete the Strings Kit (all problems solved)" },
];

const StreakCalendar = ({ history }: { history: { date: string, count: number }[] }) => {
    // State to track the end date of the view (default to today)
    const [referenceDate, setReferenceDate] = useState(new Date());

    // Helper to get the 3 months to display based on referenceDate
    // Returns array of 3 Date objects representing the 1st of each month
    const getMonthAnchors = () => {
        const anchors = [];
        // We want Current Month + 2 previous
        // e.g. Ref=Jan 15 -> [Nov 1, Dec 1, Jan 1]
        for (let i = 2; i >= 0; i--) {
            const d = new Date(referenceDate.getFullYear(), referenceDate.getMonth() - i, 1);
            anchors.push(d);
        }
        return anchors;
    };

    const monthAnchors = getMonthAnchors();

    const handlePrev = () => {
        // Shift back by 1 month (sliding window) or 3 months (paged)?
        // "Support viewing older months". Sliding 1 month feels smoother.
        const newDate = new Date(referenceDate);
        newDate.setMonth(newDate.getMonth() - 1);
        setReferenceDate(newDate);
    };

    const handleNext = () => {
        // Prevent going into future beyond today's month
        const today = new Date();
        const nextMonth = new Date(referenceDate);
        nextMonth.setMonth(nextMonth.getMonth() + 1);

        // Allow if the *start* of the new view doesn't exceed current month excessively?
        // Simple Logic: Don't allow if referenceDate is already current month
        if (referenceDate.getMonth() === today.getMonth() && referenceDate.getFullYear() === today.getFullYear()) return;

        setReferenceDate(nextMonth);
    };

    const isCurrentMonth = referenceDate.getMonth() === new Date().getMonth() && referenceDate.getFullYear() === new Date().getFullYear();

    const getIntensity = (date: Date | null) => {
        if (!date) return 0;
        // Fix: Use local date construction to avoid UTC timezone shifts (e.g. Jan 2nd IST -> Jan 1st UTC)
        const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

        // If future relative to *actual* today, invisible/inactive
        if (date > new Date()) return -1;

        const entry = history.find(h => h.date === dateStr);
        if (!entry || entry.count === 0) return 0;
        if (entry.count === 1) return 1;
        if (entry.count <= 3) return 2;
        return 3;
    };

    const getColor = (intensity: number) => {
        switch (intensity) {
            case -1: return 'invisible';
            case 0: return 'bg-[#27272a]';
            case 1: return 'bg-emerald-900';
            case 2: return 'bg-emerald-600';
            case 3: return 'bg-emerald-400';
            default: return 'bg-[#27272a]';
        }
    };

    const monthsLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    return (
        <div className="w-full flex flex-col justify-center bg-[#1e1e1e] rounded-lg">
            {/* Header with Controls - Compact */}
            <div className="flex justify-between items-center mb-1 px-1">
                <Button variant="ghost" size="icon" className="h-5 w-5 text-zinc-500 hover:text-white" onClick={handlePrev}>
                    <ChevronLeft className="h-3 w-3" />
                </Button>
                <div className="text-[10px] font-medium text-zinc-400">
                    {monthsLabels[monthAnchors[0].getMonth()]} - {monthsLabels[monthAnchors[2].getMonth()]} {monthAnchors[2].getFullYear()}
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className={`h-5 w-5 text-zinc-500 hover:text-white ${isCurrentMonth ? 'opacity-30 cursor-not-allowed' : ''}`}
                    onClick={handleNext}
                    disabled={isCurrentMonth}
                >
                    <ChevronRight className="h-3 w-3" />
                </Button>
            </div>


            {/* Calendar Container */}
            <div className="flex gap-2">
                {/* Day Labels - Compact */}
                <div className="flex flex-col justify-between py-[15px] h-[126px] text-[10px] text-zinc-600 font-medium w-6">
                    {weekDays.map((d, i) => (
                        <div key={i} className="h-2.5 flex items-center">{d}</div>
                    ))}
                </div>

                {/* Main Grid Area */}
                <div className="flex flex-1 overflow-x-auto pb-2 scrollbar-hide">
                    {monthAnchors.map((anchor, mIndex) => {
                        const monthName = monthsLabels[anchor.getMonth()];
                        const year = anchor.getFullYear();
                        const monthStart = new Date(year, anchor.getMonth(), 1);
                        const monthEnd = new Date(year, anchor.getMonth() + 1, 0);

                        const startPadding = (monthStart.getDay() + 6) % 7;

                        const dates: (Date | null)[] = [];
                        for (let k = 0; k < startPadding; k++) dates.push(null);

                        let d = new Date(monthStart);
                        while (d <= monthEnd) {
                            dates.push(new Date(d));
                            d.setDate(d.getDate() + 1);
                        }

                        while (dates.length % 7 !== 0) {
                            dates.push(null);
                        }

                        const weeks: (Date | null)[][] = [];
                        for (let k = 0; k < dates.length; k += 7) {
                            weeks.push(dates.slice(k, k + 7));
                        }

                        return (
                            <div key={mIndex} className="flex flex-col mx-1.5 first:ml-0">
                                {/* Month Label - Compact */}
                                <div className="text-[10px] text-zinc-500 font-medium mb-1 h-3">
                                    {monthName.slice(0, 3)}
                                </div>

                                {/* Weeks Columns - Dense Gap */}
                                <div className="flex gap-[3px]">
                                    {weeks.map((week, wIndex) => (
                                        <div key={wIndex} className="flex flex-col gap-[3px]">
                                            {week.map((day, dIndex) => {
                                                const intensity = getIntensity(day);
                                                const colorClass = getColor(intensity);

                                                if (!day) return <div key={dIndex} className="w-2.5 h-2.5" />;

                                                return (
                                                    <TooltipProvider key={dIndex}>
                                                        <Tooltip delayDuration={0}>
                                                            <TooltipTrigger asChild>
                                                                <div
                                                                    className={`w-2.5 h-2.5 rounded-[1px] transition-colors duration-200 ${colorClass} ${intensity >= 0 ? 'hover:ring-1 hover:ring-white/50 cursor-pointer' : ''}`}
                                                                />
                                                            </TooltipTrigger>
                                                            <TooltipContent className="bg-zinc-900 text-zinc-300 border-zinc-800 text-xs font-medium px-2 py-1">
                                                                <p>
                                                                    {day instanceof Date ? day.toLocaleDateString() : ''}: {day instanceof Date ? (history.find(h => {
                                                                        const localStr = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`;
                                                                        return h.date === localStr;
                                                                    })?.count || 0) : 0} submissions
                                                                </p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                );
                                            })}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Legend - Minimal */}
            <div className="flex items-center gap-2 mt-2 text-[10px] text-zinc-600 font-medium pl-8">
                <span>Less</span>
                <div className={`w-2 h-2 rounded-[1px] ${getColor(0)}`}></div>
                <div className={`w-2 h-2 rounded-[1px] ${getColor(1)}`}></div>
                <div className={`w-2 h-2 rounded-[1px] ${getColor(2)}`}></div>
                <div className={`w-2 h-2 rounded-[1px] ${getColor(3)}`}></div>
                <span>More</span>
            </div>
        </div>
    );
};

export default function CodingPlatform() {
    // Replaced static problems with state
    const [problems, setProblems] = useState<any[]>([]);

    const [selectedProblem, setSelectedProblem] = useState<any | null>(null);
    const [activeDetailTab, setActiveDetailTab] = useState("description");
    const [code, setCode] = useState("");
    const [language, setLanguage] = useState("python");
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [theme, setTheme] = useState("vs-dark");
    const [output, setOutput] = useState<string | null>(null);
    const [runResults, setRunResults] = useState<any[]>([]); // Results for sample test cases
    const [isRunning, setIsRunning] = useState(false);
    const [solvedProblems, setSolvedProblems] = useState<number[]>([]);
    const { toast } = useToast();
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("problems");

    const [selectedDifficulty, setSelectedDifficulty] = useState("all");
    const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [selectedKit, setSelectedKit] = useState<any>(null);

    // Filtering logic
    const filteredProblems = problems.filter(p =>
        (p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.topic.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (selectedDifficulty === "all" || p.difficulty.toLowerCase() === selectedDifficulty.toLowerCase()) &&
        (selectedStatus === "all" || (selectedStatus === "solved" ? solvedProblems.includes(p.id) : !solvedProblems.includes(p.id))) &&
        (!selectedTopic || p.topic === selectedTopic)
    );

    const solvedCount = solvedProblems.length;
    const totalCount = problems.length;

    const { user } = useAuth();

    interface ProgressStats {
        overall: { solved: number; total: number; progressPercent: number };
        difficulty: {
            easy: { solved: number; total: number };
            medium: { solved: number; total: number };
            hard: { solved: number; total: number };
        };
        streak: number;
        submissionHistory?: { date: string, count: number }[];
        badges: number;
        ownedBadgeIds?: number[];
    }

    const [progress, setProgress] = useState<ProgressStats | null>(null);

    const fetchProgress = async () => {
        if (!user?.id) return;
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            // Add timestamp to prevent caching
            const res = await axios.get(`${API_URL}/api/coding/progress?user_id=${user.id}&_t=${Date.now()}`);
            setProgress(res.data);
            if (res.data.solvedProblemIds) {
                setSolvedProblems(res.data.solvedProblemIds);
            }
        } catch (err) {
            console.error("Failed to fetch progress", err);
        }
    };

    const fetchProblems = async () => {
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const res = await axios.get(`${API_URL}/api/coding/questions?_t=${Date.now()}`);

            // Transform API data to include missing UI fields if needed
            // The API returns title, description, difficulty, template_code.
            // We need to ensure specific UI fields like examples are present or default them.
            const mappedProblems = res.data.map((p: any) => ({
                ...p,
                topic: p.topic || "",
                acceptance: null,
                solved: false,
                examples: p.examples || [],
                constraints: p.constraints || []
            }));

            setProblems(mappedProblems);

            // Removed auto-selection of first problem to allow user to see dashboard first
            // if (!selectedProblem && mappedProblems.length > 0) {
            //     setSelectedProblem(mappedProblems[0]);
            // }
        } catch (err) {
            console.error("Failed to fetch problems", err);
        }
    };

    useEffect(() => {
        fetchProblems();
    }, []);

    useEffect(() => {
        if (user?.id) {
            fetchProgress();
        }
    }, [user]);

    const handleRunCode = async () => {
        if (!code || !selectedProblem) return;
        setIsRunning(true);
        setOutput("Running...");
        // ... (omitted code) ...
        // ...
        {/* Top Stats Cards - Now in Header */ }
        <div className="flex flex-wrap gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-border p-3 px-5 flex items-center gap-4 min-w-[180px]">
                <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                    <Trophy className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Problems Solved</div>
                    <div className="text-xl font-bold text-foreground leading-none mt-0.5">
                        {progress ? progress.overall.solved : 0}
                        <span className="text-sm text-muted-foreground font-medium">/{progress ? progress.overall.total : 0}</span>
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-border p-3 px-5 flex items-center gap-4 min-w-[160px]">
                <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center">
                    <Zap className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Day Streak</div>
                    <div className="text-xl font-bold text-foreground leading-none mt-0.5">{progress ? progress.streak : 0}</div>
                </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-border p-3 px-5 flex items-center gap-4 min-w-[160px]">
                <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center">
                    <Award className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Badges</div>
                    <div className="text-xl font-bold text-foreground leading-none mt-0.5">{progress ? progress.badges : 0}</div>
                </div>
            </div>
        </div>

        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

        try {
            // Updated to send all sample test cases
            const testCases = selectedProblem.examples.map((ex: any) => ({
                input: ex.input,
                expected_output: ex.output
            }));

            const response = await axios.post(`${API_URL}/api/coding/run`, {
                code,
                language,
                testCases: testCases
            });

            if (response.data.results) {
                setRunResults(response.data.results);
                // Also check if detailed selection of a test case is needed? 
                // For now, we just update the state so the list re-renders with statuses.
                setActiveDetailTab("test-cases"); // Ensure we stay on test cases
            } else {
                // Fallback for single result if any
                setOutput(response.data.output);
            }
        } catch (error: any) {
            setOutput(`Execution Failed: ${error.response?.data?.error || error.message}`);
            toast({ title: "Error", description: "Failed to run code.", variant: "destructive" });
        } finally {
            setIsRunning(false);
        }
    };

    const handleSubmitCode = async () => {
        if (!code || !selectedProblem) return;
        if (!user) {
            toast({ title: "Error", description: "You must be logged in to submit.", variant: "destructive" });
            return;
        }
        setIsRunning(true);
        setOutput("Submitting...");

        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            // For now using mock user ID 1 or logic from auth context if available
            // In real app useAuth().user.id
            const response = await axios.post(`${API_URL}/api/coding/submit`, {
                user_id: user.id,
                question_id: selectedProblem.id,
                code,
                language
            });

            const { status, passed, details } = response.data;

            if (passed) {
                setOutput(`Status: ${status}\n\nAll Test Cases Passed! 🎉`);
                toast({ title: "Accepted!", description: "Great job! You solved the problem.", className: "bg-emerald-500 text-white" });
                if (!solvedProblems.includes(selectedProblem.id)) {
                    setSolvedProblems(prev => [...prev, selectedProblem.id]);
                }
                // Always fetch progress to update streak/calendar regardless of new/old solve
                fetchProgress();
            } else {
                let msg = `Status: ${status}\n`;
                if (details) {
                    msg += `\nFailed Input: ${details.input}\nExpected: ${details.expected}\nActual: ${details.actual}`;
                    if (details.error) msg += `\nError: ${details.error}`;
                }
                setOutput(msg);
                toast({ title: "Rejected", description: "Some test cases failed.", variant: "destructive" });
            }

        } catch (error: any) {
            setOutput(`Submission Error: ${error.response?.data?.error || error.message}`);
            toast({ title: "Error", description: "Submission failed.", variant: "destructive" });
        } finally {
            setIsRunning(false);
        }
    };

    const getDifficultyColor = (diff: string) => {
        switch (diff) {
            case 'Easy': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'Medium': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'Hard': return 'bg-rose-50 text-rose-600 border-rose-100';
            default: return '';
        }
    };

    const getDefaultCode = (problem: any, lang: string) => {
        if (!problem) return "";

        // Use DB template if available
        if (problem.template_code && problem.template_code[lang]) {
            return problem.template_code[lang];
        }

        const methodName = problem.title
            .toLowerCase()
            .replace(/[^a-zA-Z0-9]/g, ' ')
            .split(' ')
            .map((word: string, i: number) => i === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1))
            .join('');

        if (lang === 'python') {
            return `import sys

def ${methodName}(args):
    """
    ${problem.description.split('\n')[0]}...
    """
    # Write your code here
    pass

if __name__ == "__main__":
    # Driver code to handle input
    pass`;
        } else if (lang === 'cpp') {
            return `#include <iostream>
#include <vector>
#include <string>
#include <sstream>

using namespace std;

class Solution {
public:
    // Change return type and arguments as needed
    void ${methodName}() {
        // Write your solution here
    }
};

int main() {
    // Driver to read from stdin
    Solution sol;
    // sol.${methodName}();
    return 0;
}`;
        } else if (lang === 'java') {
            return `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Solution sol = new Solution();
        // Read input and call sol.${methodName}(...);
    }
}

class Solution {
    public void ${methodName}() {
        // Write your solution here
    }
}`;
        } else {
            return `// Write your solution for ${problem.title}\n// Ensure you handle Stdin and Stdout`;
        }
    };

    const handleResetCode = () => {
        if (selectedProblem) {
            setCode(getDefaultCode(selectedProblem, language));
            setOutput(null);
        }
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsFullScreen(false);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        if (selectedProblem) {
            window.scrollTo(0, 0);
            setCode(getDefaultCode(selectedProblem, language));
            setOutput(null);
            setRunResults([]); // Clear previous test case results
            setActiveDetailTab("description");
        }
    }, [selectedProblem, language]);


    useEffect(() => {
        // Update solved status for problems
        problems.forEach(p => {
            p.solved = solvedProblems.includes(p.id);
        });
    }, [solvedProblems]);

    return (
        <FeatureGuard feature="coding">
            <div className="min-h-screen bg-background p-2 md:p-4 animate-fade-in font-sans">
                {selectedProblem ? (
                    /* Problem Detail View (Split Pane) */
                    <div className="flex flex-col h-[calc(100vh-2rem)]">
                        {/* Header */}


                        <ResizablePanelGroup direction="horizontal" className="flex-1 min-h-0 border rounded-xl shadow-sm" autoSaveId="coding-platform-horizontal">
                            {/* Left Pane: Problem Description */}
                            <ResizablePanel defaultSize={40} minSize={25} className="bg-background">
                                <div className="h-full overflow-y-auto pr-2 custom-scrollbar p-1">
                                    <div className="space-y-4 h-full">
                                        <Card className="border-border shadow-none h-full border-0">
                                            <CardContent className="p-4 md:p-6 space-y-6">
                                                {/* Problem Header (Moved from Top) */}
                                                <div className="bg-muted/20 border border-border/50 rounded-xl p-4 mb-6">
                                                    <div className="flex items-center gap-3">
                                                        <Button variant="ghost" size="icon" onClick={() => setSelectedProblem(null)} className="h-8 w-8 hover:bg-background hover:shadow-sm -ml-1 shrink-0">
                                                            <ChevronRight className="h-5 w-5 rotate-180" />
                                                        </Button>
                                                        <div className="space-y-1">
                                                            <h2 className="text-xl font-bold text-foreground flex flex-wrap items-center gap-3">
                                                                {selectedProblem.title}
                                                                <div className="flex items-center gap-2">
                                                                    <Badge className={`${getDifficultyColor(selectedProblem.difficulty)} border px-2 py-0.5 text-xs font-semibold uppercase`}>
                                                                        {selectedProblem.difficulty}
                                                                    </Badge>
                                                                    {solvedProblems.includes(selectedProblem.id) && (
                                                                        <Badge variant="secondary" className="bg-emerald-50 text-emerald-600 border-emerald-100 py-0.5 px-2 flex gap-1 items-center text-xs">
                                                                            <CheckCircle2 className="h-3 w-3" /> Solved
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                            </h2>
                                                        </div>
                                                    </div>
                                                </div>


                                                <div className="space-y-4">
                                                    <div className="space-y-2">
                                                        <h3 className="text-xl font-bold text-foreground">Problem Description</h3>
                                                        <div className="text-muted-foreground font-normal leading-relaxed text-sm prose prose-sm max-w-none whitespace-pre-line">
                                                            {selectedProblem.description}
                                                        </div>
                                                    </div>

                                                    {selectedProblem.examples && selectedProblem.examples.length > 0 && (
                                                        <div className="space-y-4 pt-4">
                                                            {selectedProblem.examples.map((example, index) => {
                                                                const result = runResults[index];
                                                                const isPassed = result?.passed;
                                                                const isRun = result !== undefined;

                                                                return (
                                                                    <div key={index} className={`space-y-2 border rounded-xl p-4 ${isRun ? (isPassed ? "border-green-200 bg-green-50/50" : "border-red-200 bg-red-50/50") : "bg-muted/30 border-border"}`}>
                                                                        <div className="flex items-center justify-between mb-2">
                                                                            <h4 className="text-sm font-bold text-foreground uppercase tracking-wider">Example {index + 1}</h4>
                                                                            {isRun && (
                                                                                <Badge variant={isPassed ? "default" : "destructive"} className={isPassed ? "bg-green-600 hover:bg-green-700" : ""}>
                                                                                    {isPassed ? "Pass" : "Fail"}
                                                                                </Badge>
                                                                            )}
                                                                        </div>

                                                                        <div className="space-y-3 font-mono text-[13px]">
                                                                            <div className="flex gap-2">
                                                                                <span className="text-primary font-bold shrink-0">Input:</span>
                                                                                <span className="text-foreground break-all">{example.input}</span>
                                                                            </div>
                                                                            <div className="flex gap-2">
                                                                                <span className="text-primary font-bold shrink-0">Expected:</span>
                                                                                <span className="text-foreground break-all">{example.output}</span>
                                                                            </div>
                                                                            {isRun && (
                                                                                <div className="flex gap-2">
                                                                                    <span className={`${isPassed ? "text-green-600" : "text-red-600"} font-bold shrink-0`}>Your Output:</span>
                                                                                    <span className="text-foreground break-all">{result.output}</span>
                                                                                </div>
                                                                            )}
                                                                            {example.explanation && (
                                                                                <div className="flex gap-2 pt-1 border-t border-slate-200/50">
                                                                                    <span className="text-primary font-bold shrink-0">Explanation:</span>
                                                                                    <span className="text-muted-foreground italic font-sans">{example.explanation}</span>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    )}

                                                    <div className="space-y-3 mt-6">
                                                        <h3 className="text-lg font-bold text-foreground">Constraints</h3>
                                                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-sm">
                                                            <ul className="space-y-2">
                                                                {selectedProblem.constraints.map((c, i) => (
                                                                    <li key={i} className="flex gap-3 text-sm text-foreground/80 items-start font-normal">
                                                                        <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                                                                        <code className="bg-white border border-slate-200 px-1.5 py-0.5 rounded text-foreground text-[12px] font-mono leading-tight">{c}</code>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </div>

                                                    <div className="mt-6 pt-2 border-t border-slate-100">
                                                        <h3 className="text-lg font-bold text-foreground mb-3">Topics</h3>
                                                        <div className="flex flex-wrap gap-2">
                                                            <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10 hover:bg-primary/10 transition-colors py-1 px-3 font-medium rounded-lg">
                                                                {selectedProblem.topic}
                                                            </Badge>
                                                            {["Algorithms", "Logic"].map(topic => (
                                                                <Badge key={topic} variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors py-1 px-3 font-medium rounded-lg">
                                                                    {topic}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            </ResizablePanel>

                            <ResizableHandle withHandle />

                            <ResizablePanel defaultSize={60} minSize={30}>
                                <ResizablePanelGroup direction="vertical" autoSaveId="coding-platform-vertical">
                                    {/* Top Right: Code Editor */}
                                    <ResizablePanel defaultSize={65} minSize={20} className="p-1">
                                        <Card className={`flex flex-col h-full border-slate-200 shadow-none overflow-hidden border-0 ${isFullScreen ? "fixed inset-0 z-50 h-screen w-screen bg-background !m-0 rounded-none" : ""}`}>
                                            <div className="flex items-center justify-between px-4 py-2 bg-muted/30 border-b border-border">
                                                <div className="flex items-center gap-3">
                                                    <Select value={language} onValueChange={setLanguage}>
                                                        <SelectTrigger className="w-32 h-9 bg-white border-slate-200 text-sm">
                                                            <div className="flex items-center gap-2">
                                                                <Code2 className="h-4 w-4 text-muted-foreground" />
                                                                <SelectValue />
                                                            </div>
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="python">Python</SelectItem>
                                                            <SelectItem value="javascript">JavaScript</SelectItem>
                                                            <SelectItem value="java">Java</SelectItem>
                                                            <SelectItem value="cpp">C++</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-muted-foreground"
                                                        onClick={handleResetCode}
                                                        title="Reset Code"
                                                    >
                                                        <RotateCcw className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-muted-foreground"
                                                        onClick={() => setIsFullScreen(!isFullScreen)}
                                                    >
                                                        {isFullScreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-muted-foreground"
                                                        onClick={() => setTheme(theme === "vs-dark" ? "light" : "vs-dark")}
                                                    >
                                                        {theme === "vs-dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                                                    </Button>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        className="h-9 px-4 text-slate-700 bg-white border-slate-200 hover:bg-slate-50 gap-2 font-semibold"
                                                        onClick={handleRunCode}
                                                        disabled={isRunning}
                                                    >
                                                        {isRunning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4 fill-current" />}
                                                        Run
                                                    </Button>
                                                    <Button
                                                        className="h-9 px-4 bg-cyan-500 hover:bg-cyan-600 text-white gap-2 font-semibold border-0 shadow-sm"
                                                        onClick={handleSubmitCode}
                                                        disabled={isRunning}
                                                    >
                                                        {isRunning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                                        Submit
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="flex-1 bg-[#1e1e1e]">
                                                <Editor
                                                    height="100%"
                                                    language={language}
                                                    theme={theme}
                                                    value={code}
                                                    onChange={(val) => setCode(val || "")}
                                                    options={{
                                                        fontSize: 14,
                                                        minimap: { enabled: false },
                                                        padding: { top: 20 },
                                                        fontFamily: "'Fira Code', monospace",
                                                        scrollBeyondLastLine: false,
                                                        automaticLayout: true
                                                    }}
                                                />
                                            </div>
                                        </Card>
                                    </ResizablePanel>

                                    <ResizableHandle withHandle />

                                    {/* Bottom Right: Terminal / Tests */}
                                    <ResizablePanel defaultSize={35} minSize={10} className="p-1">
                                        <Card className="h-full border-slate-200 shadow-none overflow-hidden flex flex-col border-0">
                                            <Tabs defaultValue="test-cases" className="flex-1 flex flex-col h-full">
                                                <div className="px-4 border-b border-slate-200 bg-slate-50">
                                                    <TabsList className="h-12 bg-transparent gap-6">
                                                        <TabsTrigger value="test-cases" className="bg-transparent border-0 rounded-none h-12 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary font-bold text-muted-foreground">Test Cases</TabsTrigger>
                                                        <TabsTrigger value="test-results" className="bg-transparent border-0 rounded-none h-12 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary font-bold text-muted-foreground">Output / Result</TabsTrigger>
                                                    </TabsList>
                                                </div>

                                                <div className="flex-1 overflow-hidden p-0 relative">
                                                    <TabsContent value="test-cases" className="m-0 h-full p-4 overflow-y-auto custom-scrollbar space-y-4">
                                                        {selectedProblem.examples && selectedProblem.examples.map((ex, i) => (
                                                            <div key={i} className="rounded-lg border border-border p-4 bg-white shadow-sm">
                                                                <div className="text-xs font-bold text-muted-foreground uppercase mb-2">Case {i + 1}</div>
                                                                <div className="space-y-2 text-sm font-mono">
                                                                    <div className="grid grid-cols-[80px_1fr] gap-2">
                                                                        <span className="text-slate-500">Input:</span>
                                                                        <span className="text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded">{ex.input}</span>
                                                                    </div>
                                                                    <div className="grid grid-cols-[80px_1fr] gap-2">
                                                                        <span className="text-slate-500">Expected:</span>
                                                                        <span className="text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded">{ex.output}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                        <div className="rounded-lg border border-border p-4 bg-white shadow-sm">
                                                            <div className="text-xs font-bold text-muted-foreground uppercase mb-2">Custom Input</div>
                                                            <textarea
                                                                className="w-full min-h-[100px] p-3 rounded-lg border border-input bg-background font-mono text-sm focus:ring-1 focus:ring-primary"
                                                                placeholder="Enter custom input here..."
                                                            />
                                                        </div>
                                                    </TabsContent>

                                                    <TabsContent value="test-results" className="m-0 h-full p-0 bg-[#1e1e1e]">
                                                        <div className="h-full w-full p-4 font-mono text-sm overflow-auto text-emerald-400 whitespace-pre-wrap">
                                                            {output ? (
                                                                output
                                                            ) : (
                                                                <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-2">
                                                                    <Zap className="h-8 w-8 opacity-20" />
                                                                    <p>Run your code to see output</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </TabsContent>
                                                </div>
                                            </Tabs>
                                        </Card>
                                    </ResizablePanel>
                                </ResizablePanelGroup>
                            </ResizablePanel>
                        </ResizablePanelGroup>
                    </div>
                ) : (
                    /* Dashboard View (Problem List) */
                    /* Dashboard View */
                    <div className="max-w-7xl mx-auto space-y-12 pb-20">
                        {/* Header Section */}
                        {/* Header Section with Stats */}
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                            <div className="flex flex-col gap-2">
                                <h1 className="text-3xl font-bold text-foreground tracking-tight">Coding Platform</h1>
                                <p className="text-muted-foreground text-base font-normal">Master DSA through kits and real-world scenarios</p>
                            </div>

                            {/* Top Stats Cards - Now in Header */}
                            <div className="flex flex-wrap gap-4">
                                <div className="min-w-[180px]">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <div className="bg-white rounded-xl shadow-sm border border-border p-3 px-5 flex items-center gap-4 min-w-[180px] cursor-pointer hover:shadow-md transition-all">
                                                <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                                                    <Trophy className="h-5 w-5 text-blue-600" />
                                                </div>
                                                <div>
                                                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Problems Solved</div>
                                                    <div className="text-xl font-bold text-foreground leading-none mt-0.5">
                                                        {progress ? progress.overall.solved : 0}
                                                        <span className="text-sm text-muted-foreground font-medium">/{progress ? progress.overall.total : 0}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-xl max-h-[80vh] flex flex-col">
                                            <DialogHeader>
                                                <DialogTitle className="flex items-center gap-2">
                                                    <Trophy className="h-5 w-5 text-blue-600" />
                                                    Solved Problems
                                                </DialogTitle>
                                                <DialogDescription>
                                                    You have solved {solvedProblems.length} problems so far. Keep it up!
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="flex-1 overflow-y-auto pr-2 mt-4 space-y-2">
                                                {solvedProblems.length > 0 ? (
                                                    problems
                                                        .filter(p => solvedProblems.includes(p.id))
                                                        .map(prob => (
                                                            <div
                                                                key={prob.id}
                                                                className="flex items-center justify-between p-3 rounded-lg border border-border bg-slate-50 hover:bg-white hover:shadow-sm transition-all cursor-pointer group"
                                                                onClick={() => {
                                                                    // Optional: Navigate to problem
                                                                    setSelectedProblem(prob);
                                                                    // We might want to close dialog here, need a ref or controlled dialog if that's the goal.
                                                                    // For now just selection is fine, user can click outside.
                                                                }}
                                                            >
                                                                <div className="flex items-center gap-3">
                                                                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                                                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                                                                    </div>
                                                                    <div>
                                                                        <div className="font-semibold text-sm group-hover:text-primary transition-colors">{prob.title}</div>
                                                                        <div className="text-xs text-muted-foreground flex items-center gap-2">
                                                                            <span>{prob.topic}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <Badge
                                                                    variant="outline"
                                                                    className={`capitalize ${prob.difficulty.toLowerCase() === 'easy' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                                                        prob.difficulty.toLowerCase() === 'medium' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                                                            'bg-rose-50 text-rose-700 border-rose-200'
                                                                        }`}
                                                                >
                                                                    {prob.difficulty}
                                                                </Badge>
                                                            </div>
                                                        ))
                                                ) : (
                                                    <div className="text-center py-10 text-muted-foreground">
                                                        <Code2 className="h-10 w-10 mx-auto mb-2 opacity-20" />
                                                        <p>No problems solved yet.</p>
                                                        <Button variant="link" onClick={() => setActiveCategory("problems")}>Start Solving</Button>
                                                    </div>
                                                )}
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                                <div className="bg-white rounded-xl shadow-sm border border-border p-3 px-5 flex items-center gap-4 min-w-[160px]">
                                    <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center">
                                        <Zap className="h-5 w-5 text-indigo-600" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Day Streak</div>
                                        <div className="text-xl font-bold text-foreground leading-none mt-0.5">{progress ? progress.streak : 0}</div>
                                    </div>
                                </div>
                                <div className="min-w-[160px]">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <div className="bg-white rounded-xl shadow-sm border border-border p-3 px-5 flex items-center gap-4 cursor-pointer hover:shadow-md transition-all">
                                                <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center">
                                                    <Award className="h-5 w-5 text-emerald-600" />
                                                </div>
                                                <div>
                                                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Badges</div>
                                                    <div className="text-xl font-bold text-foreground leading-none mt-0.5">{progress ? progress.badges : 0}</div>
                                                </div>
                                            </div>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-md">
                                            <DialogHeader>
                                                <DialogTitle className="flex items-center gap-2">
                                                    <Award className="h-5 w-5 text-emerald-600" />
                                                    Your Badges
                                                </DialogTitle>
                                                <DialogDescription>
                                                    You have earned {progress ? progress.badges : 0} out of {BADGES.length} badges.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="grid grid-cols-1 gap-3 mt-4">
                                                {BADGES.map((badge) => {
                                                    const isEarned = progress?.ownedBadgeIds?.includes(badge.id);
                                                    const Icon = badge.icon;
                                                    return (
                                                        <div key={badge.id} className={`flex items-center gap-4 p-3 rounded-xl border ${isEarned ? 'bg-white border-border shadow-sm' : 'bg-slate-50 border-transparent opacity-60'}`}>
                                                            <div className={`h-12 w-12 rounded-full flex items-center justify-center shrink-0 ${isEarned ? badge.color : 'bg-slate-200 text-slate-400'}`}>
                                                                {isEarned ? <Icon className="h-6 w-6" /> : <Lock className="h-5 w-5" />}
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="flex justify-between items-start">
                                                                    <h4 className={`font-bold ${isEarned ? 'text-foreground' : 'text-muted-foreground'}`}>{badge.name}</h4>
                                                                    {isEarned && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                                                                </div>
                                                                <p className="text-sm text-muted-foreground">{badge.description}</p>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </div>
                        </div>


                        {/* Top Section Grid */}
                        {/* Top Section Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 mt-6 items-start">
                            {/* Left Column: Progress & Languages Merged */}
                            {/* Left Column: Progress & Languages */}
                            <div className="flex flex-col gap-3 min-w-0">
                                {/* Overall Progress Card */}
                                <div className="bg-white rounded-2xl p-5 shadow-sm border border-border min-w-0">
                                    <h3 className="text-lg font-bold text-foreground mb-4">Progress Overview</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                                        <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100 flex flex-col items-center justify-center text-center space-y-2">
                                            <span className="text-emerald-600 font-bold text-xs uppercase tracking-wider">Easy</span>
                                            <span className="text-2xl font-bold text-emerald-700">
                                                {progress ? progress.difficulty.easy.solved : 0}/{progress ? progress.difficulty.easy.total : 0}
                                            </span>
                                        </div>
                                        <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 flex flex-col items-center justify-center text-center space-y-2">
                                            <span className="text-amber-600 font-bold text-xs uppercase tracking-wider">Medium</span>
                                            <span className="text-2xl font-bold text-amber-700">
                                                {progress ? progress.difficulty.medium.solved : 0}/{progress ? progress.difficulty.medium.total : 0}
                                            </span>
                                        </div>
                                        <div className="bg-rose-50 rounded-xl p-4 border border-rose-100 flex flex-col items-center justify-center text-center space-y-2">
                                            <span className="text-rose-600 font-bold text-xs uppercase tracking-wider">Hard</span>
                                            <span className="text-2xl font-bold text-rose-700">
                                                {progress ? progress.difficulty.hard.solved : 0}/{progress ? progress.difficulty.hard.total : 0}
                                            </span>
                                        </div>
                                        <div className="bg-purple-50 rounded-xl p-4 border border-purple-100 flex flex-col items-center justify-center text-center space-y-2">
                                            <span className="text-purple-600 font-bold text-xs uppercase tracking-wider">Kits</span>
                                            <span className="text-2xl font-bold text-purple-700">{codingKits.filter(k => k.progress === k.total).length}/{codingKits.length}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Language Stats */}
                                {progress?.languages && progress.languages.length > 0 && (
                                    <Card className="border-border shadow-sm rounded-2xl bg-white p-5">
                                        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                                            <Code2 className="h-4 w-4" /> Languages Used
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {progress.languages.map((lang: any) => (
                                                <Badge key={lang.language} variant="secondary" className="px-3 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200">
                                                    <span className="font-semibold capitalize">{lang.language}</span>
                                                    <span className="ml-2 text-xs font-normal text-muted-foreground bg-white px-1.5 rounded-full border border-border">
                                                        {lang.count}
                                                    </span>
                                                </Badge>
                                            ))}
                                        </div>
                                    </Card>
                                )}
                            </div>

                            {/* Right Column: Activity Only */}
                            <div className="flex flex-col gap-6">
                                {/* Streak Calendar */}
                                <div className="bg-[#1e1e1e] rounded-2xl p-5 shadow-sm border border-slate-800 flex flex-col">
                                    <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                                        <Activity className="h-4 w-4 text-emerald-500" />
                                        Activity
                                    </h3>
                                    <div className="flex-1 flex flex-col">
                                        <StreakCalendar history={progress?.submissionHistory || []} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tabbed Navigation System */}
                        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
                            <div className="flex items-center justify-between mb-6">
                                <TabsList className="bg-transparent p-0 h-auto gap-6 border-b border-border w-full justify-start rounded-none">
                                    <TabsTrigger value="problems" className="bg-transparent border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-0 py-3 font-bold text-muted-foreground hover:text-foreground transition-colors">
                                        <Code2 className="h-4 w-4 mr-2" /> Problem List
                                    </TabsTrigger>
                                    <TabsTrigger value="kits" className="bg-transparent border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-0 py-3 font-bold text-muted-foreground hover:text-foreground transition-colors">
                                        <Target className="h-4 w-4 mr-2" /> Coding Kits
                                    </TabsTrigger>
                                    <TabsTrigger value="scenarios" className="bg-transparent border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-0 py-3 font-bold text-muted-foreground hover:text-foreground transition-colors">
                                        <Box className="h-4 w-4 mr-2" /> Scenarios
                                    </TabsTrigger>
                                    <TabsTrigger value="badges" className="bg-transparent border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-0 py-3 font-bold text-muted-foreground hover:text-foreground transition-colors">
                                        <Trophy className="h-4 w-4 mr-2" /> Badges
                                    </TabsTrigger>
                                </TabsList>
                            </div>

                            {/* TAB 1: Problems List */}
                            <TabsContent value="problems" className="space-y-6 focus-visible:ring-0">
                                <Card className="border-border shadow-sm rounded-2xl overflow-hidden bg-white/50 backdrop-blur-sm">
                                    <CardHeader className="p-6 border-b border-border bg-white/50">
                                        <div className="flex flex-col gap-4">
                                            {/* Topic Filters */}
                                            <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-hide">
                                                <button
                                                    onClick={() => setSelectedTopic(null)}
                                                    className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold transition-all ${!selectedTopic
                                                        ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                                                        : 'bg-white border border-border text-muted-foreground hover:bg-slate-50'
                                                        }`}
                                                >
                                                    All Topics
                                                </button>
                                                {Array.from(new Set(problems.map(p => p.topic).filter(t => t))).sort().map(topic => (
                                                    <button
                                                        key={topic}
                                                        onClick={() => setSelectedTopic(topic === selectedTopic ? null : topic)}
                                                        className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold transition-all ${selectedTopic === topic
                                                            ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                                                            : 'bg-white border border-border text-muted-foreground hover:bg-slate-50'
                                                            }`}
                                                    >
                                                        {topic}
                                                    </button>
                                                ))}
                                            </div>

                                            <div className="flex flex-col md:flex-row md:items-center gap-4">
                                                <div className="relative flex-1">
                                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                                    <Input
                                                        placeholder="Search problems by name or topic..."
                                                        className="pl-12 h-11 border-border bg-white rounded-xl focus:ring-primary/20 text-sm font-normal"
                                                        value={searchQuery}
                                                        onChange={(e) => setSearchQuery(e.target.value)}
                                                    />
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                                        <SelectTrigger className="w-32 h-11 border-border bg-white rounded-xl text-xs font-bold">
                                                            <div className="flex items-center gap-2">
                                                                <Filter className="h-3.5 w-3.5" />
                                                                <span>
                                                                    {selectedStatus === "all" ? "Status" :
                                                                        selectedStatus === "solved" ? "Solved" : "Unsolved"}
                                                                </span>
                                                            </div>
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="all">All</SelectItem>
                                                            <SelectItem value="solved">Solved</SelectItem>
                                                            <SelectItem value="unsolved">Unsolved</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                                                        <SelectTrigger className="w-32 h-11 border-border bg-white rounded-xl text-xs font-bold">
                                                            <div className="flex items-center gap-2">
                                                                <Filter className="h-3.5 w-3.5" />
                                                                <span>
                                                                    {selectedDifficulty === "all" ? "Difficulty Levels" :
                                                                        selectedDifficulty === "easy" ? "Easy" :
                                                                            selectedDifficulty === "medium" ? "Medium" : "Hard"}
                                                                </span>
                                                            </div>
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="all">All</SelectItem>
                                                            <SelectItem value="easy">Easy</SelectItem>
                                                            <SelectItem value="medium">Medium</SelectItem>
                                                            <SelectItem value="hard">Hard</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <div className="divide-y divide-border">
                                            {filteredProblems.map(prob => (
                                                <div
                                                    key={prob.id}
                                                    className="p-5 flex items-center justify-between hover:bg-muted/30 transition-all cursor-pointer group"
                                                    onClick={() => setSelectedProblem(prob)}
                                                >
                                                    <div className="flex items-center gap-5">
                                                        <div className={`h-11 w-11 rounded-xl flex items-center justify-center border transition-colors ${solvedProblems.includes(prob.id)
                                                            ? "bg-emerald-50 border-emerald-500/30"
                                                            : "bg-white border-border group-hover:border-primary/50"
                                                            }`}>
                                                            {solvedProblems.includes(prob.id)
                                                                ? <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                                                                : <Code2 className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
                                                            }
                                                        </div>
                                                        <div>
                                                            <h4 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                                                                {prob.title}
                                                            </h4>
                                                            <div className="flex items-center gap-3 mt-1 flex-wrap">
                                                                <Badge className={`${getDifficultyColor(prob.difficulty)} border-0 px-2 py-0.5 text-[10px] font-bold uppercase`}>
                                                                    {prob.difficulty}
                                                                </Badge>
                                                                {prob.topic && prob.topic !== "General" && (
                                                                    <span className="text-[11px] font-normal text-muted-foreground flex items-center gap-1">
                                                                        <Layout className="h-3 w-3" /> {prob.topic}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <Button variant="ghost" size="sm" className="rounded-xl font-bold text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                                                            Solve Now <ChevronRight className="h-4 w-4 ml-1" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                    <CardFooter className="p-4 bg-muted/20 border-t border-border flex justify-center">
                                        <Button variant="ghost" size="sm" className="text-muted-foreground font-normal hover:text-primary">
                                            Show more problems
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </TabsContent>

                            {/* TAB 2: Kits Grid */}
                            <TabsContent value="kits" className="space-y-6 focus-visible:ring-0">
                                {!selectedKit && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                        {codingKits.map(kit => {
                                            // Calculate specific kit progress dynamically
                                            const kitSpecificProblems = problems.filter(p => {
                                                const t = p.title.toLowerCase();
                                                if (kit.title === "Arrays") return (t.includes("sum") || t.includes("median") || t.includes("array") || t.includes("sudoku")) && !t.includes("list");
                                                if (kit.title === "Strings") return t.includes("string") || t.includes("prefix") || t.includes("parentheses") || t.includes("anagram") || t.includes("word") || t.includes("palindrome");
                                                return false;
                                            });
                                            const total = kitSpecificProblems.length;
                                            const solvedCount = kitSpecificProblems.filter(p => solvedProblems.includes(p.id)).length;
                                            const percentage = total > 0 ? (solvedCount / total) * 100 : 0;

                                            return (
                                                <Card key={kit.id} className="border-border shadow-sm rounded-2xl overflow-hidden bg-white group hover:shadow-md transition-all">
                                                    <CardContent className="p-0">
                                                        <div className={`h-24 bg-gradient-to-br ${kit.color} p-6 flex items-center justify-center relative overflow-hidden`}>
                                                            <div className="absolute inset-0 bg-black/5" />
                                                            <div className="relative z-10 p-3 rounded-xl bg-white/20 backdrop-blur-md">
                                                                {kit.icon}
                                                            </div>
                                                        </div>
                                                        <div className="p-6 space-y-4">
                                                            <div>
                                                                <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">{kit.title}</h3>
                                                                <p className="text-muted-foreground text-sm font-normal">{kit.subtitle}</p>
                                                            </div>
                                                            <div className="space-y-2">
                                                                <div className="flex justify-between text-xs font-normal">
                                                                    <span className="text-muted-foreground">Progress</span>
                                                                    <span className="font-bold text-foreground">{solvedCount}/{total}</span>
                                                                </div>
                                                                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                                                    <div
                                                                        className={`h-full bg-gradient-to-r ${kit.color}`}
                                                                        style={{ width: `${percentage}%` }}
                                                                    />
                                                                </div>
                                                            </div>

                                                            {kit.badge && (
                                                                <div className="pt-2 border-t border-border/50">
                                                                    <div className="flex items-center gap-2">
                                                                        <div className={`h-7 w-7 rounded-full bg-muted flex items-center justify-center ${kit.badge.color}`}>
                                                                            {kit.badge.icon}
                                                                        </div>
                                                                        <div className="flex flex-col">
                                                                            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Earnable Badge</span>
                                                                            <span className="text-xs font-bold text-foreground">{kit.badge.name}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                            <Button
                                                                variant="outline"
                                                                className="w-full rounded-xl border-border hover:bg-muted font-bold"
                                                                onClick={() => setSelectedKit(kit)}
                                                            >
                                                                Continue Kit
                                                            </Button>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            )
                                        })
                                        }
                                    </div>
                                )}

                                {selectedKit && (
                                    <div className="space-y-6 animate-fade-in">
                                        <div className="flex items-center gap-4">
                                            <Button variant="ghost" onClick={() => setSelectedKit(null)} className="hover:bg-muted -ml-2">
                                                <ChevronRight className="h-5 w-5 rotate-180 mr-1" /> Back to Kits
                                            </Button>
                                            <div>
                                                <h3 className="text-xl font-bold">{selectedKit.title} Kit</h3>
                                                <p className="text-muted-foreground text-sm">
                                                    Solved: {problems.filter(p => {
                                                        const t = p.title.toLowerCase();
                                                        if (selectedKit.title === "Arrays") return (t.includes("sum") || t.includes("median") || t.includes("array") || t.includes("sudoku")) && !t.includes("list");
                                                        if (selectedKit.title === "Strings") return t.includes("string") || t.includes("prefix") || t.includes("parentheses") || t.includes("anagram") || t.includes("word") || t.includes("palindrome");
                                                        return false;
                                                    }).filter(p => solvedProblems.includes(p.id)).length}
                                                    /
                                                    {problems.filter(p => {
                                                        const t = p.title.toLowerCase();
                                                        if (selectedKit.title === "Arrays") return (t.includes("sum") || t.includes("median") || t.includes("array") || t.includes("sudoku")) && !t.includes("list");
                                                        if (selectedKit.title === "Strings") return t.includes("string") || t.includes("prefix") || t.includes("parentheses") || t.includes("anagram") || t.includes("word") || t.includes("palindrome");
                                                        return false;
                                                    }).length}
                                                </p>
                                            </div>
                                        </div>

                                        <Card className="border-border shadow-sm rounded-2xl overflow-hidden bg-white/50 backdrop-blur-sm">
                                            <CardContent className="p-0">
                                                <div className="divide-y divide-border">
                                                    {problems
                                                        .filter(p => {
                                                            const t = p.title.toLowerCase();
                                                            if (selectedKit.title === "Arrays") {
                                                                return (t.includes("sum") || t.includes("median") || t.includes("array") || t.includes("sudoku")) && !t.includes("list");
                                                            }
                                                            if (selectedKit.title === "Strings") {
                                                                return t.includes("string") || t.includes("prefix") || t.includes("parentheses") || t.includes("anagram") || t.includes("word") || t.includes("palindrome");
                                                            }
                                                            return false;
                                                        })
                                                        .map(prob => (
                                                            <div
                                                                key={prob.id}
                                                                className="p-5 flex items-center justify-between hover:bg-muted/30 transition-all cursor-pointer group"
                                                                onClick={() => {
                                                                    setSelectedProblem(prob);
                                                                    // Optionally switch to main view or keep kit context? 
                                                                    // User said "not direct back to problems (tab)", but clicking a problem must show potential to solve.
                                                                    // Setting selectedProblem usually triggers the split view overlay.
                                                                }}
                                                            >
                                                                <div className="flex items-center gap-4">
                                                                    {solvedProblems.includes(prob.id) ? (
                                                                        <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                                                                            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                                                                        </div>
                                                                    ) : (
                                                                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-white group-hover:shadow-sm transition-all">
                                                                            <Code2 className="h-5 w-5" />
                                                                        </div>
                                                                    )}
                                                                    <div>
                                                                        <h4 className={`font-bold text-base group-hover:text-primary transition-colors ${solvedProblems.includes(prob.id) ? "text-muted-foreground" : "text-foreground"}`}>
                                                                            {prob.title}
                                                                        </h4>
                                                                        <div className="flex items-center gap-2 mt-1">
                                                                            <Badge variant="outline" className={`${getDifficultyColor(prob.difficulty)} border-0 bg-opacity-10 text-[10px] px-2 py-0 h-5`}>
                                                                                {prob.difficulty}
                                                                            </Badge>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <Button variant="ghost" size="icon" className="text-muted-foreground group-hover:text-primary">
                                                                    <ChevronRight className="h-5 w-5" />
                                                                </Button>
                                                            </div>
                                                        ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                )}
                            </TabsContent>

                            {/* TAB 3: Scenarios (Placeholder) */}
                            <TabsContent value="scenarios" className="focus-visible:ring-0">
                                <Card className="border-dashed border-2 border-border/60 shadow-none bg-muted/20">
                                    <div className="p-12 text-center space-y-4">
                                        <div className="h-16 w-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                                            <Box className="h-8 w-8 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-foreground">Scenario Mode</h3>
                                            <p className="text-muted-foreground max-w-md mx-auto">
                                                Complex, real-world project scenarios that combine multiple coding concepts are coming soon.
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            </TabsContent>

                            {/* TAB 4: Badges */}
                            <TabsContent value="badges" className="focus-visible:ring-0">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {BADGES.map(badge => {
                                        const isEarned = progress?.ownedBadgeIds?.includes(badge.id);
                                        const Icon = badge.icon;
                                        return (
                                            <TooltipProvider key={badge.id}>
                                                <Tooltip delayDuration={300}>
                                                    <TooltipTrigger asChild>
                                                        <Card className={`flex flex-col items-center text-center p-6 cursor-help transition-all hover:scale-[1.02] ${isEarned ? 'border-emerald-200 bg-emerald-50/50' : 'border-border bg-card/50 opacity-80'}`}>
                                                            <div className={`h-16 w-16 rounded-full flex items-center justify-center mb-4 ${isEarned ? 'bg-white shadow-sm' : 'bg-muted'}`}>
                                                                <Icon className={`h-8 w-8 ${isEarned ? badge.color.split(' ')[0] : 'text-muted-foreground'}`} />
                                                            </div>
                                                            <h3 className={`font-bold text-lg mb-2 ${isEarned ? 'text-foreground' : 'text-muted-foreground'}`}>{badge.name}</h3>
                                                            {isEarned ? (
                                                                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-0 px-3 py-1">
                                                                    <CheckCircle2 className="h-3 w-3 mr-1" /> Earned
                                                                </Badge>
                                                            ) : (
                                                                <Badge variant="outline" className="bg-slate-100 text-slate-500 border-slate-200 px-3 py-1">
                                                                    <Lock className="h-3 w-3 mr-1" /> Locked
                                                                </Badge>
                                                            )}
                                                        </Card>
                                                    </TooltipTrigger>
                                                    <TooltipContent className="bg-slate-900 text-white border-0">
                                                        <p className="font-medium text-xs">{badge.description}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        );
                                    })}
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div >
                )
                }
            </div >

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e2e8f0;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #cbd5e1;
                }
            `}</style>
        </FeatureGuard >
    );
}
