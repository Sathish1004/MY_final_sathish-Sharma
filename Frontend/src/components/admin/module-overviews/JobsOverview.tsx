import { Briefcase } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function JobsOverview({ jobStats }: { jobStats: any }) {
    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-cyan-600" />
                    Jobs & Placements Overview
                </h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-cyan-50 border-cyan-100 p-4 flex flex-col items-center justify-center text-center">
                    <p className="text-sm text-cyan-700 font-medium">Active Listings</p>
                    <p className="text-2xl font-bold text-cyan-900 mt-1">{jobStats.jobs_posted}</p>
                </Card>
                <Card className="bg-white border-slate-100 p-4 flex flex-col items-center justify-center text-center">
                    <p className="text-sm text-slate-500 font-medium">Applications</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">1,240</p>
                </Card>
                <Card className="bg-white border-slate-100 p-4 flex flex-col items-center justify-center text-center">
                    <p className="text-sm text-slate-500 font-medium">Interviews</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">45</p>
                </Card>
                <Card className="bg-white border-slate-100 p-4 flex flex-col items-center justify-center text-center">
                    <p className="text-sm text-slate-500 font-medium">Placed</p>
                    <p className="text-2xl font-bold text-green-600 mt-1">12</p>
                </Card>
            </div>
        </div>
    );
}
