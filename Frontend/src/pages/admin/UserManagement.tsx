import { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { MoreHorizontal, Search, Trash2, Edit, ChevronLeft, ChevronRight, Shield, Lock, LogOut } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import UserProfileDrawer from "@/components/admin/UserProfileDrawer";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface User {
    id: number;
    name: string;
    email: string;
    role: 'Student' | 'Instructor' | 'Admin';
    status: 'Active' | 'Inactive' | 'Expired';
    gender: 'Male' | 'Female' | 'Other';
    created_at: string;
    last_login?: string;
    progress: number;
}

export default function UserManagement() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    // Filters & Search
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [genderFilter, setGenderFilter] = useState("all");
    const [sortOrder, setSortOrder] = useState("recent");

    // Pagination
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);
    const LIMIT = 20;

    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
    const { toast } = useToast();

    // Drawer State
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // Debounce Search
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1); // Reset to page 1 on search change
        }, 500);
        return () => clearTimeout(handler);
    }, [search]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const queryParams = new URLSearchParams();
            if (debouncedSearch) queryParams.append('search', debouncedSearch);
            if (statusFilter !== 'all') queryParams.append('status', statusFilter);
            if (statusFilter !== 'all') queryParams.append('status', statusFilter);
            if (genderFilter !== 'all') queryParams.append('gender', genderFilter);
            queryParams.append('sort', sortOrder);
            queryParams.append('page', page.toString());
            queryParams.append('limit', LIMIT.toString());

            const response = await fetch(`http://localhost:5000/api/admin/users?${queryParams}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!response.ok) throw new Error('Failed to fetch users');

            const data = await response.json();
            // Backend returns { users: [], pagination: { totalUsers, ... } } if we updated it correctly
            // Handling both formats just in case
            if (data.users) {
                setUsers(data.users);
                setTotalPages(data.pagination.totalPages);
                setTotalUsers(data.pagination.totalUsers);
            } else {
                setUsers(data); // Fallback for old API structure
                setTotalUsers(data.length);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            toast({
                title: "Error",
                description: "Failed to load users",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [debouncedSearch, statusFilter, genderFilter, sortOrder, page]);

    const handleSelectAll = (checked: boolean | string) => {
        if (checked === true) {
            setSelectedUsers(users.map(u => u.id));
        } else {
            setSelectedUsers([]);
        }
    };

    const handleSelectUser = (id: number, checked: boolean | string) => {
        if (checked === true) {
            setSelectedUsers(prev => [...prev, id]);
        } else {
            setSelectedUsers(prev => prev.filter(uid => uid !== id));
        }
    };

    const handleBulkDelete = async () => {
        if (!confirm(`Are you sure you want to delete ${selectedUsers.length} users?`)) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/admin/users/delete-bulk', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ userIds: selectedUsers })
            });

            if (!response.ok) throw new Error('Failed to delete users');

            toast({ title: "Success", description: "Users deleted successfully" });
            setSelectedUsers([]);
            fetchUsers();
        } catch (error) {
            console.error("Delete error:", error);
            toast({ title: "Error", description: "Failed to delete users", variant: "destructive" });
        }
    };

    const openProfile = (user: User) => {
        setSelectedUser(user);
        setIsDrawerOpen(true);
    };

    // Security Actions
    const handleResetPassword = async (userId: number) => {
        const newPassword = prompt("Enter new password for user (min 6 chars):");
        if (!newPassword || newPassword.length < 6) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:5000/api/admin/users/${userId}/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ newPassword })
            });
            if (!res.ok) throw new Error("Failed to reset");
            toast({ title: "Success", description: "Password reset successfully" });
        } catch (error) {
            toast({ title: "Error", description: "Failed to reset password", variant: "destructive" });
        }
    };

    const handleForceLogout = async (userId: number) => {
        if (!confirm("Force logout this user?")) return;
        try {
            const token = localStorage.getItem('token');
            await fetch(`http://localhost:5000/api/admin/users/${userId}/logout`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` }
            });
            toast({ title: "Success", description: "User forced to logout" });
        } catch (error) {
            toast({ title: "Error", description: "Action failed", variant: "destructive" });
        }
    };

    const handleExportCSV = () => {
        if (!users || users.length === 0) {
            toast({ title: "Nothing to export", description: "No users in current view." });
            return;
        }

        const headers = ["ID", "Name", "Email", "Role", "Status", "Progress", "Joined Date"];
        const rows = users.map(u => [
            u.id,
            u.name,
            u.email,
            u.role,
            u.status,
            `${Math.round(u.progress)}%`,
            new Date(u.created_at).toLocaleDateString()
        ]);

        let csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "users_export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast({ title: "Export Started", description: "Users list downloaded." });
    };

    return (
        <div className="space-y-4 p-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">User Management</h2>
                    <p className="text-slate-500 text-sm mt-1">Manage, track, and secure user accounts.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="gap-2" onClick={handleExportCSV}>
                        <Shield className="h-4 w-4" /> Export CSV
                    </Button>

                </div>
            </div>

            {/* Filters & Actions Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-lg border shadow-sm">
                <div className="flex flex-col sm:flex-row items-center gap-4 flex-1 w-full">
                    <div className="relative max-w-sm w-full">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by name, email, ID..."
                            className="pl-8"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <Tabs value={statusFilter} onValueChange={(value) => { setStatusFilter(value); setPage(1); }} className="w-auto">
                            <TabsList className="bg-slate-100/50">
                                <TabsTrigger value="all">All Users</TabsTrigger>
                                <TabsTrigger value="Active" className="data-[state=active]:text-green-600">Active</TabsTrigger>
                                <TabsTrigger value="Inactive">Inactive</TabsTrigger>
                                <TabsTrigger value="Expired" className="data-[state=active]:text-red-600">Expires Candidate</TabsTrigger>
                            </TabsList>
                        </Tabs>

                        <div className="h-6 w-px bg-slate-200 hidden sm:block mx-1" />

                        {/* Gender Filter */}
                        <Select value={genderFilter} onValueChange={(value) => { setGenderFilter(value); setPage(1); }}>
                            <SelectTrigger className="w-[120px] bg-white">
                                <SelectValue placeholder="Gender" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Genders</SelectItem>
                                <SelectItem value="Male">Male</SelectItem>
                                <SelectItem value="Female">Female</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="h-6 w-px bg-slate-200 hidden sm:block mx-1" />

                    {/* Sort Order */}
                    <Select value={sortOrder} onValueChange={(value) => { setSortOrder(value); setPage(1); }}>
                        <SelectTrigger className="w-[140px] bg-white">
                            <SelectValue placeholder="Sort By" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="recent">Recent Wise</SelectItem>
                            <SelectItem value="alpha">Alphabet Wise</SelectItem>
                        </SelectContent>
                    </Select>
                </div>


                {selectedUsers.length > 0 && (
                    <div className="flex items-center gap-2 animate-in fade-in zoom-in-95">
                        <span className="text-sm font-medium text-slate-700 bg-slate-100 px-3 py-1 rounded-full">{selectedUsers.length} selected</span>
                        <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                        </Button>
                    </div>
                )}
            </div>

            {/* Users Table */}
            <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead className="w-[80px] font-bold text-slate-700">S.No</TableHead>
                            <TableHead>User Profile</TableHead>
                            <TableHead>Gender</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="w-[150px]">Progress</TableHead>
                            <TableHead>Joined Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-40">
                                    <div className="flex flex-col items-center justify-center gap-2 text-slate-500">
                                        <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                        <p>Loading users...</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-40 text-slate-500">
                                    No users found matching your filters.
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.map((user, index) => (
                                <TableRow
                                    key={user.id}
                                    className="hover:bg-slate-50 transition-colors cursor-pointer"
                                    onClick={(e) => {
                                        // Prevent triggering when clicking checkbox or action button
                                        if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('[role="checkbox"]')) return;
                                        openProfile(user);
                                    }}
                                >
                                    <TableCell className="font-medium text-slate-500">
                                        {((page - 1) * LIMIT + index + 1).toString().padStart(2, '0')}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9 border border-slate-200">
                                                <AvatarFallback className="bg-blue-100 text-blue-700 font-bold">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span className="font-medium text-slate-900">{user.name}</span>
                                                <span className="text-xs text-muted-foreground">{user.email}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="text-xs font-medium border-slate-200">
                                            {user.gender || 'N/A'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={
                                            user.role === 'Admin' ? 'bg-purple-100 text-purple-700 border-purple-200' :
                                                user.role === 'Instructor' ? 'bg-indigo-100 text-indigo-700 border-indigo-200' :
                                                    'bg-slate-100 text-slate-700 border-slate-200'
                                        }>
                                            {user.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1.5">
                                            <div className={`h-2 w-2 rounded-full ${user.status === 'Active' ? 'bg-green-500' : user.status === 'Expired' ? 'bg-red-500' : 'bg-slate-400'}`} />
                                            <span className={`text-sm ${user.status === 'Expired' ? 'text-red-600 font-bold' : 'text-slate-600'}`}>{user.status === 'Expired' ? 'Expired' : user.status}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1.5 w-[120px]">
                                            <div className="flex justify-between text-[10px] font-medium text-slate-500">
                                                <span>{Math.round(user.progress)}%</span>
                                                <span>{user.progress >= 100 ? 'Completed' : 'Overall'}</span>
                                            </div>
                                            <Progress
                                                value={user.progress}
                                                className={`h-1.5 bg-slate-100 ${user.progress >= 80 ? '[&>div]:bg-green-500' : user.progress >= 40 ? '[&>div]:bg-blue-500' : '[&>div]:bg-amber-500'}`}
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm text-slate-500">
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-slate-900">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48">
                                                <DropdownMenuLabel>Account Actions</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => openProfile(user)}>
                                                    <Edit className="h-4 w-4 mr-2" /> Edit Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleResetPassword(user.id)}>
                                                    <Lock className="h-4 w-4 mr-2" /> Reset Password
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleForceLogout(user.id)}>
                                                    <LogOut className="h-4 w-4 mr-2" /> Force Logout
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50">
                                                    <Trash2 className="h-4 w-4 mr-2" /> Delete Account
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
                <p className="text-sm text-slate-500 text-center sm:text-left">
                    Showing <span className="font-medium">{Math.min((page - 1) * LIMIT + 1, totalUsers)}</span> to <span className="font-medium">{Math.min(page * LIMIT, totalUsers)}</span> of <span className="font-medium">{totalUsers}</span> users
                </p>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1 || loading}
                    >
                        <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                    </Button>
                    <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            // Logic to show ranges (1, 2, 3 ... last) can be added here, 
                            // for now showing first 5 pages simple
                            const pNum = i + 1;
                            return (
                                <Button
                                    key={pNum}
                                    variant={page === pNum ? "default" : "ghost"}
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => setPage(pNum)}
                                >
                                    {pNum}
                                </Button>
                            )
                        })}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages || loading}
                    >
                        Next <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                </div>
            </div>

            <UserProfileDrawer
                user={selectedUser}
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                onUserUpdated={fetchUsers}
            />
        </div >
    );
}
