import { Code } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function CodingOverview({ stats, topCoders }: { stats: any, topCoders: any[] }) {
    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Code className="h-5 w-5 text-indigo-600" />
                    Coding Platform Analytics
                </h3>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <Card className="lg:col-span-1 bg-indigo-50 border-indigo-100">
                    <CardContent className="p-6 space-y-4">
                        <div>
                            <p className="text-sm text-indigo-600 font-medium">Items Attempted</p>
                            <p className="text-3xl font-bold text-indigo-900">4,281</p>
                        </div>
                        <div>
                            <p className="text-sm text-indigo-600 font-medium">Problems Solved</p>
                            <p className="text-3xl font-bold text-indigo-900">{stats.problems_solved}</p>
                        </div>
                        <div>
                            <p className="text-sm text-indigo-600 font-medium">Active Coders</p>
                            <p className="text-3xl font-bold text-indigo-900">142</p>
                            <p className="text-xs text-indigo-400 mt-1">Daily Avg.</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="lg:col-span-3">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base">Top Coders Leaderboard</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                                    <tr>
                                        <th className="px-4 py-3 rounded-l-md">Rank</th>
                                        <th className="px-4 py-3">User Name</th>
                                        <th className="px-4 py-3">Email</th>
                                        <th className="px-4 py-3">Problems Solved</th>
                                        <th className="px-4 py-3">Completion %</th>
                                        <th className="px-4 py-3 rounded-r-md">Last Active</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {topCoders && topCoders.length > 0 ? (
                                        topCoders.map((coder, i: number) => (
                                            <tr key={i} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                                                <td className="px-4 py-3 font-semibold text-slate-700">#{coder.rank}</td>
                                                <td className="px-4 py-3 font-medium text-slate-900">{coder.name}</td>
                                                <td className="px-4 py-3 text-slate-500">{coder.email}</td>
                                                <td className="px-4 py-3 font-mono text-indigo-600 font-bold">{coder.solved}</td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                            <div className="h-full bg-indigo-500" style={{ width: coder.percent }}></div>
                                                        </div>
                                                        <span className="text-xs font-medium">{coder.percent}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-slate-500">{coder.active}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="px-4 py-6 text-center text-slate-500">
                                                No top coders data available.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
