import { Code2, Users, BookOpen, Trophy, Laptop } from 'lucide-react';

export default function SaaSBackground() {
    return (
        <div className="absolute inset-0 -z-10 overflow-hidden bg-white pointer-events-none">
            {/* 1. Subtle Base Pattern (Grid) */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_2px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

            {/* 2. Attractive Multi-Color Mesh Gradient */}
            <div className="absolute top-0 right-0 left-0 h-[800px] overflow-hidden opacity-40">
                {/* Left: Light Blue/Sky Linear - Removed as per user request to clear left corner */}
                {/* <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[600px] bg-gradient-to-br from-cyan-300 via-sky-200 to-transparent blur-[80px] rounded-full mix-blend-multiply" /> */}

                {/* Right: Cyan/Sky Linear */}
                <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[600px] bg-gradient-to-bl from-cyan-300 via-sky-200 to-transparent blur-[80px] rounded-full mix-blend-multiply" />

                {/* Center: Pale Blue Linear */}
                <div className="absolute top-[-30%] left-[20%] right-[20%] h-[500px] bg-gradient-to-b from-blue-200 via-cyan-100 to-transparent blur-[80px] rounded-full mix-blend-multiply" />
            </div>

            {/* 3. Top Rim Light (Subtle White/Shine) */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent opacity-50" />
        </div>
    );
}


