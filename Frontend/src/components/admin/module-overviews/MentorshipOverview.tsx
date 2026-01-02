import { GraduationCap } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function MentorshipOverview({ mentorshipStats }: { mentorshipStats: any[] }) {
    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-pink-600" />
                    Mentorship Sessions Overview
                </h3>
            </div>
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-base">Recent Mentorship Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                                <tr>
                                    <th className="px-4 py-3 rounded-l-md">Student Name</th>
                                    <th className="px-4 py-3">Student Email</th>
                                    <th className="px-4 py-3">Mentor Name</th>
                                    <th className="px-4 py-3">Date & Time</th>
                                    <th className="px-4 py-3 rounded-r-md">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mentorshipStats && mentorshipStats.length > 0 ? (
                                    mentorshipStats.map((session, i: number) => (
                                        <tr key={i} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                                            <td className="px-4 py-3 font-medium text-slate-900">{session.name}</td>
                                            <td className="px-4 py-3 text-slate-500">{session.email}</td>
                                            <td className="px-4 py-3 text-slate-700">{session.mentor}</td>
                                            <td className="px-4 py-3 text-slate-500 font-mono text-xs">{session.time}</td>
                                            <td className="px-4 py-3">
                                                <Badge variant="outline" className={
                                                    session.status === 'Upcoming' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                        session.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-200' :
                                                            'bg-red-50 text-red-700 border-red-200'
                                                }>
                                                    {session.status}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan={5} className="px-4 py-6 text-center text-slate-500">No recent sessions found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
