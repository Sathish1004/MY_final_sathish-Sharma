import { FolderKanban } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function ProjectsOverview({ projectStats }: { projectStats: any }) {
    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <FolderKanban className="h-5 w-5 text-purple-600" />
                    Project Submissions Overview
                </h3>
            </div>
            <Card>
                <CardContent className="p-0">
                    <div className="p-4 border-b border-slate-100 flex gap-4 bg-purple-50/30">
                        <div className="flex-1">
                            <p className="text-xs text-slate-500 uppercase tracking-wider">Pending</p>
                            <p className="text-xl font-bold text-orange-600">{projectStats.pending}</p>
                        </div>
                        <div className="flex-1">
                            <p className="text-xs text-slate-500 uppercase tracking-wider">Approved</p>
                            <p className="text-xl font-bold text-green-600">{projectStats.approved}</p>
                        </div>
                        <div className="flex-1">
                            <p className="text-xs text-slate-500 uppercase tracking-wider">Rejected</p>
                            <p className="text-xl font-bold text-red-600">{projectStats.rejected}</p>
                        </div>
                    </div>
                    <div className="p-0">
                        <table className="w-full text-sm text-left">
                            <tbody>
                                {projectStats.recent && projectStats.recent.length > 0 ? (
                                    projectStats.recent.map((p: any, i: number) => (
                                        <tr key={i} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                                            <td className="px-4 py-3 font-medium text-slate-800">{p.title}</td>
                                            <td className="px-4 py-3 text-slate-500">{p.student}</td>
                                            <td className="px-4 py-3 text-right">
                                                <span className={`inline-block w-2 h-2 rounded-full mr-2 ${p.status === 'Approved' ? 'bg-green-500' :
                                                    p.status === 'Pending' ? 'bg-orange-500' : 'bg-red-500'
                                                    }`}></span>
                                                {p.status}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan={3} className="px-4 py-6 text-center text-slate-500">No recent submissions.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
