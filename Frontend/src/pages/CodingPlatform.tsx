
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import FeatureGuard from "@/components/FeatureGuard";
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
    Send
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
const problems = [
    {
        id: 1,
        title: "Two Sum",
        difficulty: "Easy",
        topic: "Arrays",
        acceptance: "48.2%",
        solved: false,
        description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.",
        examples: [
            { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]." },
            { input: "nums = [3,2,4], target = 6", output: "[1,2]" }
        ],
        constraints: ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9", "-10^9 <= target <= 10^9"]
    },
    {
        id: 2,
        title: "Add Two Numbers",
        difficulty: "Medium",
        topic: "Linked List",
        acceptance: "39.1%",
        solved: true,
        description: "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit.",
        examples: [
            { input: "l1 = [2,4,3], l2 = [5,6,4]", output: "[7,0,8]", explanation: "342 + 465 = 807." }
        ],
        constraints: ["The number of nodes in each linked list is in the range [1, 100].", "0 <= Node.val <= 9", "It is guaranteed that the list represents a number that does not have leading zeros."]
    },
    {
        id: 3,
        title: "Median of Two Sorted Arrays",
        difficulty: "Hard",
        topic: "Arrays",
        acceptance: "32.5%",
        solved: false,
        description: "Given two sorted arrays `nums1` and `nums2` of size `m` and `n` respectively, return the median of the two sorted arrays.",
        examples: [
            { input: "nums1 = [1,3], nums2 = [2]", output: "2.00000" },
            { input: "nums1 = [1,2], nums2 = [3,4]", output: "2.50000" }
        ],
        constraints: ["nums1.length == m", "nums2.length == n", "0 <= m <= 1000", "0 <= n <= 1000", "1 <= m + n <= 2000"]
    },
    {
        id: 4,
        title: "Longest Substring Without Repeating Characters",
        difficulty: "Medium",
        topic: "Hash Table",
        acceptance: "33.8%",
        solved: true,
        description: "Given a string `s`, find the length of the longest substring without repeating characters.",
        examples: [
            { input: "s = \"abcabcbb\"", output: "3", explanation: "The answer is \"abc\", with the length of 3." }
        ],
        constraints: ["0 <= s.length <= 5 * 10^4", "s consists of English letters, digits, symbols and spaces."]
    },
    {
        id: 5,
        title: "Reverse Integer",
        difficulty: "Medium",
        topic: "Math",
        acceptance: "27.1%",
        solved: false,
        description: "Given a signed 32-bit integer `x`, return `x` with its digits reversed. If reversing `x` causes the value to go outside the signed 32-bit integer range [-2^31, 2^31 - 1], then return 0.",
        examples: [
            { input: "x = 123", output: "321" },
            { input: "x = -123", output: "-321" }
        ],
        constraints: ["-2^31 <= x <= 2^31 - 1"]
    },
    {
        id: 6,
        title: "Palindrome Number",
        difficulty: "Easy",
        topic: "Math",
        acceptance: "53.5%",
        solved: false,
        description: "Given an integer `x`, return `true` if `x` is a palindrome, and `false` otherwise.",
        examples: [
            { input: "x = 121", output: "true" },
            { input: "x = -121", output: "false" }
        ],
        constraints: ["-2^31 <= x <= 2^31 - 1"]
    },
    {
        id: 7,
        title: "Longest Common Prefix",
        difficulty: "Easy",
        topic: "Strings",
        acceptance: "41.2%",
        solved: false,
        description: "Write a function to find the longest common prefix string amongst an array of strings. If there is no common prefix, return an empty string \"\".",
        examples: [
            { input: "strs = [\"flower\",\"flow\",\"flight\"]", output: "\"fl\"" }
        ],
        constraints: ["1 <= strs.length <= 200", "0 <= strs[i].length <= 200", "strs[i] consists of only lowercase English letters."]
    },
    {
        id: 8,
        title: "3Sum",
        difficulty: "Medium",
        topic: "Two Pointers",
        acceptance: "32.4%",
        solved: false,
        description: "Given an integer array nums, return all the triplets `[nums[i], nums[j], nums[k]]` such that `i != j`, `i != k`, and `j != k`, and `nums[i] + nums[j] + nums[k] == 0`.",
        examples: [
            { input: "nums = [-1,0,1,2,-1,-4]", output: "[[-1,-1,2],[-1,0,1]]" }
        ],
        constraints: ["3 <= nums.length <= 3000", "-10^5 <= nums[i] <= 10^5"]
    },
    {
        id: 9,
        title: "Valid Parentheses",
        difficulty: "Easy",
        topic: "Stack",
        acceptance: "40.5%",
        solved: true,
        description: "Given a string `s` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
        examples: [
            { input: "s = \"()\"", output: "true" }
        ],
        constraints: ["1 <= s.length <= 10^4", "s consists of parentheses only '()[]{}'."]
    },
    {
        id: 10,
        title: "Merge Two Sorted Lists",
        difficulty: "Easy",
        topic: "Linked List",
        acceptance: "62.1%",
        solved: false,
        description: "You are given the heads of two sorted linked lists `list1` and `list2`. Merge the two lists in a one sorted list.",
        examples: [
            { input: "list1 = [1,2,4], list2 = [1,3,4]", output: "[1,1,2,3,4,4]" }
        ],
        constraints: ["The number of nodes in both lists is in the range [0, 50].", "-100 <= Node.val <= 100", "Both list1 and list2 are sorted in non-decreasing order."]
    },
    {
        id: 11,
        title: "Search in Rotated Sorted Array",
        difficulty: "Medium",
        topic: "Binary Search",
        acceptance: "38.9%",
        solved: false,
        description: "Given the array `nums` after the possible rotation and an integer `target`, return the index of `target` if it is in `nums`, or -1 if it is not in `nums`.",
        examples: [
            { input: "nums = [4,5,6,7,0,1,2], target = 0", output: "4" }
        ],
        constraints: ["1 <= nums.length <= 5000", "-10^4 <= nums[i] <= 10^4", "All values of nums are unique.", "nums is an ascending array that is possibly rotated."]
    },
    {
        id: 12,
        title: "Valid Sudoku",
        difficulty: "Medium",
        topic: "Hash Table",
        acceptance: "58.1%",
        solved: false,
        description: "Determine if a 9 x 9 Sudoku board is valid. Only the filled cells need to be validated according to the Sudoku rules.",
        examples: [
            { input: "board = [[\"5\",\"3\",\".\",\".\",\"7\",\".\",\".\",\".\",\".\"]...]", output: "true" }
        ],
        constraints: ["board.length == 9", "board[i].length == 9", "board[i][j] is a digit 1-9 or '.'."]
    },
    {
        id: 13,
        title: "Group Anagrams",
        difficulty: "Medium",
        topic: "Strings",
        acceptance: "66.5%",
        solved: false,
        description: "Given an array of strings `strs`, group the anagrams together. You can return the answer in any order.",
        examples: [
            { input: "strs = [\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"]", output: "[[\"bat\"],[\"nat\",\"tan\"],[\"ate\",\"eat\",\"tea\"]]" }
        ],
        constraints: ["1 <= strs.length <= 10^4", "0 <= strs[i].length <= 100", "strs[i] consists of lowercase English letters."]
    },
    {
        id: 14,
        title: "Maximum Subarray",
        difficulty: "Medium",
        topic: "Dynamic Programming",
        acceptance: "50.1%",
        solved: false,
        description: "Given an integer array `nums`, find the subarray with the largest sum, and return its sum.",
        examples: [
            { input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6", explanation: "The subarray [4,-1,2,1] has the largest sum 6." }
        ],
        constraints: ["1 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"]
    },
    {
        id: 15,
        title: "Climbing Stairs",
        difficulty: "Easy",
        topic: "Dynamic Programming",
        acceptance: "52.4%",
        solved: false,
        description: "You are climbing a staircase. It takes `n` steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
        examples: [
            { input: "n = 3", output: "3", explanation: "1. 1 step + 1 step + 1 step, 2. 1 step + 2 steps, 3. 2 steps + 1 step" }
        ],
        constraints: ["1 <= n <= 45"]
    },
    {
        id: 16,
        title: "Word Search",
        difficulty: "Medium",
        topic: "Backtracking",
        acceptance: "40.1%",
        solved: false,
        description: "Given an `m x n` grid of characters `board` and a string `word`, return `true` if `word` exists in the grid.",
        examples: [
            { input: "board = [[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]], word = \"ABCCED\"", output: "true" }
        ],
        constraints: ["m == board.length", "n = board[i].length", "1 <= m, n <= 6", "1 <= word.length <= 15"]
    },
    {
        id: 17,
        title: "Binary Tree Level Order Traversal",
        difficulty: "Medium",
        topic: "Trees",
        acceptance: "64.2%",
        solved: false,
        description: "Given the `root` of a binary tree, return the level order traversal of its nodes' values. (i.e., from left to right, level by level).",
        examples: [
            { input: "root = [3,9,20,null,null,15,7]", output: "[[3],[9,20],[15,7]]" }
        ],
        constraints: ["The number of nodes in the tree is in the range [0, 2000].", "-1000 <= Node.val <= 1000"]
    },
    {
        id: 18,
        title: "Kth Largest Element in an Array",
        difficulty: "Medium",
        topic: "Heap",
        acceptance: "66.1%",
        solved: false,
        description: "Given an integer array `nums` and an integer `k`, return the `kth` largest element in the array.",
        examples: [
            { input: "nums = [3,2,1,5,6,4], k = 2", output: "5" }
        ],
        constraints: ["1 <= k <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"]
    },
    {
        id: 19,
        title: "Course Schedule",
        difficulty: "Medium",
        topic: "Graphs",
        acceptance: "46.2%",
        solved: false,
        description: "There are a total of `numCourses` courses you have to take, labeled from 0 to `numCourses - 1`. You are given an array `prerequisites` where `prerequisites[i] = [ai, bi]` indicates that you must take course `bi` first if you want to take course `ai`.",
        examples: [
            { input: "numCourses = 2, prerequisites = [[1,0]]", output: "true" }
        ],
        constraints: ["1 <= numCourses <= 2000", "0 <= prerequisites.length <= 5000", "prerequisites[i].length == 2"]
    },
    {
        id: 20,
        title: "Merge k Sorted Lists",
        difficulty: "Hard",
        topic: "Heap",
        acceptance: "48.5%",
        solved: false,
        description: "You are given an array of `k` linked-lists `lists`, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.",
        examples: [
            { input: "lists = [[1,4,5],[1,3,4],[2,6]]", output: "[1,1,2,3,4,4,5,6]" }
        ],
        constraints: ["k == lists.length", "0 <= k <= 10^4", "0 <= lists[i].length <= 500"]
    }
];

const codingKits = [
    {
        id: 1,
        title: "Blind 75",
        subtitle: "Must-do LeetCode",
        progress: 45,
        total: 75,
        color: "from-amber-500 to-orange-500",
        icon: <Target className="h-6 w-6 text-white" />,
        badge: { name: "75 Master", icon: <Trophy className="h-3 w-3" />, color: "text-amber-500" }
    },
    {
        id: 2,
        title: "NeetCode 150",
        subtitle: "Complete Roadmap",
        progress: 12,
        total: 150,
        color: "from-blue-500 to-cyan-500",
        icon: <Globe className="h-6 w-6 text-white" />,
        badge: { name: "Algo Wizard", icon: <Zap className="h-3 w-3" />, color: "text-blue-500" }
    },
    {
        id: 3,
        title: "Striver's SDE Sheet",
        subtitle: "Interview Ready",
        progress: 68,
        total: 180,
        color: "from-emerald-500 to-green-500",
        icon: <Briefcase className="h-6 w-6 text-white" />,
        badge: { name: "SDE Pro", icon: <Award className="h-3 w-3" />, color: "text-emerald-500" }
    },
    {
        id: 4,
        title: "Company Wise",
        subtitle: "FAANG Prep",
        progress: 20,
        total: 200,
        color: "from-purple-500 to-pink-500",
        icon: <Building2 className="h-6 w-6 text-white" />,
        badge: { name: "Big Tech", icon: <BrainCircuit className="h-3 w-3" />, color: "text-purple-500" }
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
    { id: 1, name: "Problem Solver", icon: <Trophy className="h-5 w-5" />, color: "text-amber-500", bg: "bg-amber-50" },
    { id: 2, name: "30 Day Streak", icon: <Zap className="h-5 w-5" />, color: "text-blue-500", bg: "bg-blue-50" },
    { id: 3, name: "Algo Master", icon: <BrainCircuit className="h-5 w-5" />, color: "text-purple-500", bg: "bg-purple-50" },
];

export default function CodingPlatform() {
    const [selectedProblem, setSelectedProblem] = useState<typeof problems[0] | null>(null);
    const [activeDetailTab, setActiveDetailTab] = useState("description");
    const [code, setCode] = useState("");
    const [language, setLanguage] = useState("python");
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [output, setOutput] = useState<string | null>(null);
    const [isRunning, setIsRunning] = useState(false);
    const [solvedProblems, setSolvedProblems] = useState<number[]>([2, 4]);
    const { toast } = useToast();
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("problems");

    // Filtering logic
    const filteredProblems = problems.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.topic.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const solvedCount = solvedProblems.length;
    const totalCount = problems.length;

    const { user } = useAuth();

    const handleRunCode = async () => {
        if (!code || !selectedProblem) return;
        setIsRunning(true);
        setOutput("Running...");

        // Use the first example input for testing run
        const input = selectedProblem.examples[0]?.input || "";

        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

        try {
            const response = await axios.post(`${API_URL}/api/coding/run`, {
                code,
                language,
                input
            });

            if (response.data.isError) {
                 setOutput(`Error:\n${response.data.output}`);
            } else {
                 setOutput(response.data.output);
            }
            toast({ title: "Execution Complete", description: "Code ran successfully." });
        } catch (error: any) {
            setOutput(`Execution Failed: ${error.response?.data?.error || error.message}`);
            toast({ title: "Error", description: "Failed to run code.", variant: "destructive" });
        } finally {
            setIsRunning(false);
        }
    };

    const handleSubmitCode = async () => {
        if (!code || !selectedProblem) return;
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

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsFullScreen(false);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        if (selectedProblem) {
            if (language === 'python') {
                setCode(`def ${selectedProblem.title.toLowerCase().replace(/\s/g, '_')}(nums, target):\n    """\n    ${selectedProblem.description}\n    """\n    # Your code here\n    pass`);
            } else {
                setCode(`// Write your solution for ${selectedProblem.title}\nclass Solution {\n    // ... \n}`);
            }
            setOutput(null);
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
            <div className="min-h-screen bg-background p-4 md:p-8 animate-fade-in font-sans">
                {selectedProblem ? (
                    /* Problem Detail View (Split Pane) */
                    <div className="flex flex-col h-[calc(100vh-6rem)] gap-4">
                        {/* Header */}
                        <div className="flex items-center justify-between bg-card p-4 rounded-xl border border-border shadow-sm">
                            <div className="flex items-center gap-4">
                                <Button variant="ghost" size="icon" onClick={() => setSelectedProblem(null)} className="hover:bg-muted">
                                    <ChevronRight className="h-5 w-5 rotate-180" />
                                </Button>
                                <div>
                                    <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
                                        {selectedProblem.title}
                                        <Badge className={`${getDifficultyColor(selectedProblem.difficulty)} border px-2 py-0.5 text-xs font-semibold uppercase`}>
                                            {selectedProblem.difficulty}
                                        </Badge>
                                        <Badge variant="outline" className="bg-foreground text-background border-0 text-xs px-2 flex gap-1 items-center">
                                            <Layout className="h-3 w-3" /> {selectedProblem.topic}
                                        </Badge>
                                    </h2>
                                    <div className="flex items-center gap-4 mt-1 text-muted-foreground text-sm font-normal">
                                        <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Time: 1s</span>
                                        <span className="flex items-center gap-1"><Database className="h-3.5 w-3.5" /> Mem: 256 MB</span>
                                        <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {selectedProblem.acceptance}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {solvedProblems.includes(selectedProblem.id) && (
                                    <Badge variant="secondary" className="bg-emerald-50 text-emerald-600 border-emerald-100 py-1 px-3 flex gap-1.5 items-center">
                                        <CheckCircle2 className="h-4 w-4" /> Solved
                                    </Badge>
                                )}
                                <Button variant="ghost" size="icon" className="text-muted-foreground"><Share2 className="h-4 w-4" /></Button>
                            </div>
                        </div>

                        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0">
                            {/* Left Pane: Problem Description */}
                            <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                                <Card className="border-border shadow-none h-full">
                                    <CardContent className="p-6 space-y-6">
                                        {/* Scenario Info Box */}
                                        <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 flex gap-4">
                                            <div className="h-12 w-12 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center">
                                                <BrainCircuit className="h-6 w-6 text-primary" />
                                            </div>
                                            <div className="space-y-1">
                                                <h4 className="text-foreground font-bold text-base">The Scenario</h4>
                                                <p className="text-muted-foreground text-sm font-normal leading-relaxed">
                                                    You're tackling a real-world task mapped to this coding challenge. Solving this contributes to your **{selectedProblem.topic} Master** badge.
                                                </p>
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
                                                    {selectedProblem.examples.map((example, index) => (
                                                        <div key={index} className="space-y-2">
                                                            <h4 className="text-sm font-bold text-foreground uppercase tracking-wider">Example {index + 1}</h4>
                                                            <div className="bg-muted/30 border border-border rounded-xl p-4 space-y-3 font-mono text-[13px]">
                                                                <div className="flex gap-2">
                                                                    <span className="text-primary font-bold shrink-0">Input:</span>
                                                                    <span className="text-foreground break-all">{example.input}</span>
                                                                </div>
                                                                <div className="flex gap-2">
                                                                    <span className="text-primary font-bold shrink-0">Output:</span>
                                                                    <span className="text-foreground break-all">{example.output}</span>
                                                                </div>
                                                                {example.explanation && (
                                                                    <div className="flex gap-2">
                                                                        <span className="text-primary font-bold shrink-0">Explanation:</span>
                                                                        <span className="text-muted-foreground italic font-sans">{example.explanation}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
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

                            {/* Right Pane: Code & Tests */}
                            <div className="flex flex-col gap-4 h-full min-h-0">
                                {/* Editor Card - takes available space */}
                                <Card className="flex flex-col flex-1 border-slate-200 shadow-none overflow-hidden min-h-[300px]">
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
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground"><RotateCcw className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground"><Maximize2 className="h-4 w-4" /></Button>
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
                                            theme="vs-dark"
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

                                {/* Terminal / Tests Card - fixed reasonable height or percentage */}
                                <Card className="h-[35%] min-h-[250px] border-slate-200 shadow-none overflow-hidden flex flex-col">
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
                            </div>
                        </div>
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
                                <div className="bg-white rounded-xl shadow-sm border border-border p-3 px-5 flex items-center gap-4 min-w-[180px]">
                                    <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                                        <Trophy className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Problems Solved</div>
                                        <div className="text-xl font-bold text-foreground leading-none mt-0.5">{solvedCount}<span className="text-sm text-muted-foreground font-medium">/{totalCount}</span></div>
                                    </div>
                                </div>
                                <div className="bg-white rounded-xl shadow-sm border border-border p-3 px-5 flex items-center gap-4 min-w-[160px]">
                                    <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center">
                                        <Zap className="h-5 w-5 text-indigo-600" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Day Streak</div>
                                        <div className="text-xl font-bold text-foreground leading-none mt-0.5">15</div>
                                    </div>
                                </div>
                                <div className="bg-white rounded-xl shadow-sm border border-border p-3 px-5 flex items-center gap-4 min-w-[160px]">
                                    <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center">
                                        <Award className="h-5 w-5 text-emerald-600" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Badges</div>
                                        <div className="text-xl font-bold text-foreground leading-none mt-0.5">{badgesList.length}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Overall Progress Card - Matches User Reference */}
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-border mt-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                <div>
                                    <h2 className="text-xl font-bold text-foreground">Overall Progress</h2>
                                    <p className="text-muted-foreground font-normal">Track your coding journey</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-primary">{Math.round((solvedCount / totalCount) * 100)}%</div>
                                    <div className="text-sm text-muted-foreground">{solvedCount}/{totalCount} problems</div>
                                </div>
                            </div>

                            {/* Main Progress Bar */}
                            <div className="h-4 bg-muted rounded-full overflow-hidden mb-8">
                                <div
                                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                                    style={{ width: `${(solvedCount / totalCount) * 100}%` }}
                                />
                            </div>

                            {/* 4 Thematic Stat Boxes */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-100 flex flex-col items-center justify-center text-center space-y-2">
                                    <span className="text-emerald-600 font-bold text-xs uppercase tracking-wider">Easy</span>
                                    <span className="text-2xl font-bold text-emerald-700">{problems.filter(p => p.difficulty === "Easy" && p.solved).length}/{problems.filter(p => p.difficulty === "Easy").length}</span>
                                </div>
                                <div className="bg-amber-50 rounded-xl p-5 border border-amber-100 flex flex-col items-center justify-center text-center space-y-2">
                                    <span className="text-amber-600 font-bold text-xs uppercase tracking-wider">Medium</span>
                                    <span className="text-2xl font-bold text-amber-700">{problems.filter(p => p.difficulty === "Medium" && p.solved).length}/{problems.filter(p => p.difficulty === "Medium").length}</span>
                                </div>
                                <div className="bg-rose-50 rounded-xl p-5 border border-rose-100 flex flex-col items-center justify-center text-center space-y-2">
                                    <span className="text-rose-600 font-bold text-xs uppercase tracking-wider">Hard</span>
                                    <span className="text-2xl font-bold text-rose-700">{problems.filter(p => p.difficulty === "Hard" && p.solved).length}/{problems.filter(p => p.difficulty === "Hard").length}</span>
                                </div>
                                <div className="bg-purple-50 rounded-xl p-5 border border-purple-100 flex flex-col items-center justify-center text-center space-y-2">
                                    <span className="text-purple-600 font-bold text-xs uppercase tracking-wider">Kits</span>
                                    <span className="text-2xl font-bold text-purple-700">{codingKits.filter(k => k.progress === k.total).length}/{codingKits.length}</span>
                                </div>
                            </div>
                        </div>

                        {/* Tabbed Navigation System */}
                        <Tabs defaultValue="problems" className="space-y-6">
                            <TabsList className="bg-transparent border-b border-border w-full justify-start h-auto p-0 gap-8 rounded-none">
                                <TabsTrigger value="problems" className="bg-transparent border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-0 py-3 font-bold text-muted-foreground hover:text-foreground transition-colors">
                                    <Code2 className="h-4 w-4 mr-2" /> Problems
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

                            {/* TAB 1: Problems List */}
                            <TabsContent value="problems" className="space-y-6 focus-visible:ring-0">
                                <Card className="border-border shadow-sm rounded-2xl overflow-hidden bg-white/50 backdrop-blur-sm">
                                    <CardHeader className="p-6 border-b border-border bg-white/50">
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
                                                <Select defaultValue="all">
                                                    <SelectTrigger className="w-32 h-11 border-border bg-white rounded-xl text-xs font-bold">
                                                        <div className="flex items-center gap-2">
                                                            <Filter className="h-3.5 w-3.5" />
                                                            <SelectValue />
                                                        </div>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="all">All Difficulty</SelectItem>
                                                        <SelectItem value="easy">Easy</SelectItem>
                                                        <SelectItem value="medium">Medium</SelectItem>
                                                        <SelectItem value="hard">Hard</SelectItem>
                                                    </SelectContent>
                                                </Select>
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
                                                                <span className="text-[11px] font-normal text-muted-foreground flex items-center gap-1">
                                                                    <Layout className="h-3 w-3" /> {prob.topic}
                                                                </span>
                                                                <span className="text-[11px] font-normal text-muted-foreground flex items-center gap-1">
                                                                    <Users className="h-3 w-3" /> 45% Acceptance
                                                                </span>
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
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {codingKits.map(kit => (
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
                                                            <span className="font-bold text-foreground">{kit.progress}/{kit.total}</span>
                                                        </div>
                                                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full bg-gradient-to-r ${kit.color}`}
                                                                style={{ width: `${(kit.progress / kit.total) * 100}%` }}
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
                                                    <Button variant="outline" className="w-full rounded-xl border-border hover:bg-muted font-bold">
                                                        Continue Kit
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
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
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {badgesList.map(badge => (
                                        <Card key={badge.id} className="border-border shadow-sm rounded-2xl hover:shadow-md transition-all">
                                            <CardContent className="p-6 flex items-center gap-4">
                                                <div className={`h-16 w-16 rounded-full ${badge.bg} flex items-center justify-center ${badge.color} shadow-inner`}>
                                                    {badge.icon}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-foreground">{badge.name}</h3>
                                                    <Badge variant="secondary" className="mt-1 bg-primary/10 text-primary hover:bg-primary/20">Earned</Badge>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                    <Card className="border-dashed border-2 border-border/60 shadow-none bg-muted/20 opacity-70">
                                        <CardContent className="p-6 flex items-center gap-4">
                                            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                                                <Lock className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-muted-foreground">Expert Kit</h3>
                                                <Badge variant="outline" className="mt-1">Locked</Badge>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                )}
            </div>

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
        </FeatureGuard>
    );
}
