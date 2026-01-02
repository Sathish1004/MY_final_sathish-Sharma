import { ArrowRight, BookOpen, Code2, Users } from 'lucide-react';

const features = [
    {
        title: "Learn with Structured Courses",
        description: "Student Workspace provides industry-aligned courses with videos, hands-on learning, and certifications. Students can learn at their own pace and build strong fundamentals.",
        image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2670&auto=format&fit=crop",
        link: "Explore courses",
        bgColor: "bg-blue-50", // Light Blue
        titleColor: "text-blue-600",
        icon: BookOpen
    },
    {
        title: "Practice Real Coding",
        description: "Learners can solve real-world coding problems, run test cases, and work on projects. This helps bridge the gap between theory and practical skills.",
        image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2670&auto=format&fit=crop",
        link: "Start coding",
        bgColor: "bg-red-50", // Light Red
        titleColor: "text-red-600",
        icon: Code2
    },
    {
        title: "Mentorship & Career Growth",
        description: "Students get access to mentors, career guidance, internships, and job opportunities — all from a single dashboard.",
        image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=2670&auto=format&fit=crop",
        link: "View mentorship",
        bgColor: "bg-green-50", // Light Green
        titleColor: "text-green-600",
        icon: Users
    }
];

export default function DetailedFeatures() {
    return (
        <section className="py-16 bg-white">
            <div className="max-w-[1700px] mx-auto px-6">

                {/* Section Heading */}
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
                        How Student Workspace Helps You
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">
                        From learning the basics to landing your dream job, we support every step of your journey.
                    </p>
                </div>

                {/* 3-Column Grid */}
                <div className="grid md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className={`rounded-[2.5rem] p-6 md:p-8 ${feature.bgColor} transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer group flex flex-col h-full`}
                        >
                            {/* Featured Image with Icon Badge */}
                            <div className="relative mb-8 overflow-hidden rounded-2xl h-56 w-full shadow-sm group-hover:shadow-md transition-all">
                                <img
                                    src={feature.image}
                                    alt={feature.title}
                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                />
                                {/* Icon Badge */}
                                <div className="absolute top-4 right-4 h-10 w-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                    <feature.icon className={`h-5 w-5 ${feature.titleColor}`} />
                                </div>
                            </div>

                            {/* Text Content */}
                            <div className="flex-1 flex flex-col">
                                <h3 className={`text-2xl font-bold ${feature.titleColor} mb-4 leading-tight`}>
                                    {feature.title}
                                </h3>
                                <p className="text-slate-700 leading-relaxed mb-8 font-medium text-[0.95rem] opacity-90">
                                    {feature.description}
                                </p>

                                {/* CTA Link */}
                                <div className={`mt-auto inline-flex items-center gap-2 font-bold ${feature.titleColor} text-base group/link`}>
                                    {feature.link}
                                    <ArrowRight className="h-5 w-5 transition-transform group-hover/link:translate-x-1" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
