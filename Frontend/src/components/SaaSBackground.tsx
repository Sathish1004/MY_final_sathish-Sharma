import { Code2, Users, BookOpen, Trophy, Laptop } from 'lucide-react';

export default function SaaSBackground() {
    return (
        <div className="absolute inset-0 -z-10 overflow-hidden bg-[#0b0a1f] pointer-events-none">
            {/* 1. Subtle Base Pattern (Grid) - Softened for premium feel */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />

            {/* 2. Premium Lavender/Purple Glow Theme */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Main Ambient Glow - Soft Lavender/Violet */}
                <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[800px] bg-gradient-to-br from-violet-600/20 via-purple-500/10 to-transparent blur-[120px] rounded-full mix-blend-screen" />

                {/* Secondary Right Glow - Deeper Purple overlay */}
                <div className="absolute top-[-20%] right-[-5%] w-[60%] h-[700px] bg-gradient-to-bl from-purple-600/20 via-indigo-500/10 to-transparent blur-[120px] rounded-full mix-blend-screen" />

                {/* Center Highlighter - Delicate Lavender */}
                <div className="absolute top-[5%] left-[30%] right-[30%] h-[500px] bg-gradient-to-b from-fuchsia-400/10 via-violet-400/5 to-transparent blur-[100px] rounded-full mix-blend-screen" />
            </div>

            {/* 3. Top Rim Light - Purple Tint */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent opacity-40" />
        </div>
    );
}


