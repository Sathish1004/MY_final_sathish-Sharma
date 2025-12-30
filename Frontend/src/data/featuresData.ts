import { BookOpen, Users, Layout, CheckCircle2, Code, Briefcase, Trophy } from 'lucide-react';

export const features = [
    {
        id: 'courses',
        shortTitle: "Courses",
        icon: BookOpen,
        title: "100+ Industry-Ready Courses",
        highlight: "Learn once. Apply everywhere.",
        description: [
            "Professionally structured courses designed by industry experts",
            "Video-based learning with real-world examples",
            "Certifications aligned with job requirements",
            "Beginner to advanced learning paths"
        ],
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2670&auto=format&fit=crop",
        color: "text-blue-600",
        bg: "bg-blue-50",
        overlay: "Master New Skills",
        route: "/courses",
        // Detail Page Specific Data
        heroTitle: "Master In-Demand Skills with Industry-Standard Courses",
        heroDescription: "Our curriculum is designed to bridge the gap between academic learning and industry requirements. Access high-quality content curated by experts.",
        aboutTitle: "About Courses",
        aboutDescription: "Prolync offers a comprehensive library of courses covering the latest technologies. From full-stack development to data science, our content is updated regularly to keep pace with the tech world.",
        mainContentTitle: "The Future of Learning is Here",
        mainContentBody: "Traditional education often lags behind the rapidly evolving tech landscape. Prolync's course module changes that by providing direct access to what matters most. Whether you are a beginner looking to write your first line of code or an experienced developer aiming to upskill, our structured paths guide you every step of the way.",
        benefits: [
            "Hands-on projects in every module",
            "industry-recognized certifications",
            "24/7 access to learning materials",
            "Community support and peer learning"
        ]
    },
    {
        id: 'coding',
        shortTitle: "Coding",
        icon: Code,
        title: "Interactive Coding Platform",
        highlight: "Practice coding without leaving your browser.",
        description: [
            "Built-in code editor supports 10+ languages",
            "Real-time output and error debugging",
            "Daily coding challenges and contests",
            "Project-based learning approach"
        ],
        image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=2669&auto=format&fit=crop",
        color: "text-purple-600",
        bg: "bg-purple-50",
        overlay: "Build & Deploy",
        route: "/coding",
        heroTitle: "Code, Compile, and Execute in the Cloud",
        heroDescription: "Experience a powerful, browser-based IDE that lets you practice coding in over 10 languages instantly. No setup required.",
        aboutTitle: "About Coding Platform",
        aboutDescription: "The Prolync Coding Platform is your digital playground. It's built to help you practice data structures, algorithms, and real-world development scenarios without the hassle of local environment setup.",
        mainContentTitle: "Practice Makes Perfect",
        mainContentBody: "Consistent practice is the key to cracking technical interviews. Our platform provides a vast repository of problems ranging from easy to hard, curated from top tech company interviews. With real-time compilation and test cases, you get instant feedback on your code's performance and correctness.",
        benefits: [
            "Support for C++, Java, Python, JavaScript, and more",
            "Integrated debugger and console",
            "Performance analysis (Time & Space complexity)",
            "Step-by-step problem solutions"
        ]
    },
    {
        id: 'mentorship',
        shortTitle: "Mentorship",
        icon: Users,
        title: "50+ Expert Mentors",
        highlight: "Learn directly from people who work in the industry.",
        description: [
            "One-on-one mentorship sessions",
            "Guidance from working professionals",
            "Career planning, resume review, and mock interviews",
            "Personalized learning support"
        ],
        image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2684&auto=format&fit=crop",
        color: "text-emerald-600",
        bg: "bg-emerald-50",
        overlay: "Get Expert Guidance",
        route: "/mentors",
        heroTitle: "Connect with Industry Leaders and Mentors",
        heroDescription: "Don't navigate your career journey alone. Get personalized guidance from professionals who have been in your shoes and succeeded.",
        aboutTitle: "About Mentorship",
        aboutDescription: "Our mentorship program connects students with veterans from top product companies. It's more than just advice; it's about building a roadmap for your career.",
        mainContentTitle: "Unlock Your Potential",
        mainContentBody: "A good mentor can accelerate your career growth by years. Our platform facilitates easy booking of 1-on-1 sessions where you can discuss everything from technical doubts to salary negotiation. Get your resume reviewed, practice mock interviews, and receive constructive feedback to polish your professional profile.",
        benefits: [
            "1-on-1 video sessions",
            "Flexible scheduling",
            "Domain-specific mentors (Frontend, Backend, AI/ML)",
            "Long-term career tracking"
        ]
    },
    {
        id: 'jobs',
        shortTitle: "Jobs",
        icon: Briefcase,
        title: "Jobs & Internships",
        highlight: "Connecting talent with top opportunities.",
        description: [
            "Exclusive internship listings for students",
            "Full-time job opportunities for freshers",
            "Direct application to partner companies",
            "Resume building and portfolio showcasing"
        ],
        image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=2672&auto=format&fit=crop",
        color: "text-orange-600",
        bg: "bg-orange-50",
        overlay: "Land Your Dream Job",
        route: "/jobs",
        heroTitle: "Your Gateway to Premium Career Opportunities",
        heroDescription: "Access a curated list of internships and full-time roles. We connect talented students directly with hiring managers.",
        aboutTitle: "About Jobs & Internships",
        aboutDescription: "The Jobs module is the culmination of your learning journey. We partner with startups and MNCs to bring you exclusive opportunities that value your skills over just your degree.",
        mainContentTitle: "Launch Your Career",
        mainContentBody: "Stop applying into the void. Prolync's job portal highlights your profile to recruiters based on your course completion and coding scores. We help you present your best self with auto-generated portfolios and resume builders that highlight your actual project work and skills.",
        benefits: [
            "Verified company listings",
            "Smart skill-matching algorithm",
            "Application status tracking",
            "Salary insights and trends"
        ]
    },
    {
        id: 'placement',
        shortTitle: "Placement",
        icon: Trophy,
        title: "Placement Support",
        highlight: "Your bridge from campus to corporate.",
        description: [
            "Dedicated placement cell assistance",
            "Mock aptitude tests and technical interviews",
            "Soft skills and communication training",
            "Guaranteed interview opportunities for top performers"
        ],
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2670&auto=format&fit=crop",
        color: "text-amber-600",
        bg: "bg-amber-50",
        overlay: "Achieve Success",
        route: "/placements",
        heroTitle: "Comprehensive Placement Assistance Program",
        heroDescription: "We don't just teach you; we ensure you get placed. Our placement support covers every aspect of the recruitment process.",
        aboutTitle: "About Placement Support",
        aboutDescription: "Designed for final-year students and fresh graduates, this module provides intensive preparation for campus and off-campus drives.",
        mainContentTitle: "Be Interview Ready",
        mainContentBody: "Technical skills get you the interview; soft skills get you the job. Our placement support includes aptitude training, group discussion practice, and behavioral interview coaching. We simulate high-pressure interview environments so you are calm and confident on the big day.",
        benefits: [
            "Company-specific preparation kits",
            "Weekly mock drives",
            "Aptitude and logic building workshops",
            "Post-placement support"
        ]
    },
    {
        id: 'workspace',
        shortTitle: "Workspace",
        icon: Layout,
        title: "One Unified Student Workspace",
        highlight: "Everything you need — in one workspace.",
        description: [
            "Single login for courses, coding practice, mentorship, and jobs",
            "Track learning progress and achievements in one dashboard",
            "Seamless transition from learning → practice → placement",
            "Built for students, freshers, and career switchers"
        ],
        image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2670&auto=format&fit=crop",
        color: "text-indigo-600",
        bg: "bg-indigo-50",
        overlay: "All-in-One Platform",
        route: "/dashboard",
        heroTitle: "The Ultimate Productivity Ecosystem for Students",
        heroDescription: "Switching between ten different apps is efficient for no one. Prolync brings your entire academic and professional life into one dashboard.",
        aboutTitle: "About Workspace",
        aboutDescription: "The Workspace is the heart of Prolync. It aggregates data from all other modules to give you a 360-degree view of your progress.",
        mainContentTitle: "Streamline Your Growth",
        mainContentBody: "Imagine a dashboard that knows what you learned yesterday, suggests a coding problem to practice today, and recommends a job to apply for tomorrow. That's the Prolync Workspace. It uses intelligent analytics to guide your daily activities towards your long-term career goals.",
        benefits: [
            "Centralized progress tracking",
            "Integrated calendar and reminders",
            "Personalized daily goals",
            "Document wallet for certificates"
        ]
    }
];
