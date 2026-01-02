import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Clock, User, BookOpen, Code2, Briefcase, Users, Zap, CheckCircle2 } from 'lucide-react';

const blogCategories = [
  "All",
  "Student Learning",
  "Coding & Practice",
  "Careers & Jobs",
  "Mentorship",
  "Prolync Updates"
];

const blogPosts = [
  {
    id: 1,
    title: "Why every student needs a single workspace",
    description: "Discover how consolidating your learning tools can boost productivity and focus.",
    category: "Student Learning",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800",
    readTime: "5 min read",
    author: "Prolync Team",
    date: "Dec 15, 2024"
  },
  {
    id: 2,
    title: "How coding platforms improve problem-solving",
    description: "Why daily coding practice is essential for developing strong analytical skills.",
    category: "Coding & Practice",
    image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&q=80&w=800",
    readTime: "4 min read",
    author: "Sarah Jenks",
    date: "Dec 12, 2024"
  },
  {
    id: 3,
    title: "From courses to careers: student journey at Prolync",
    description: "A comprehensive guide on transitioning from learning skills to landing your first job.",
    category: "Careers & Jobs",
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=800",
    readTime: "6 min read",
    author: "Prolync Team",
    date: "Dec 10, 2024"
  },
  {
    id: 4,
    title: "Free vs Premium learning platforms – what matters?",
    description: "An honest comparison of features that actually accelerate your learning curve.",
    category: "Student Learning",
    image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=800",
    readTime: "5 min read",
    author: "Mike Chen",
    date: "Dec 08, 2024"
  },
  {
    id: 5,
    title: "How mentorship accelerates student growth",
    description: "Real stories of students who achieved their goals faster with expert guidance.",
    category: "Mentorship",
    image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=800",
    readTime: "5 min read",
    author: "Prolync Team",
    date: "Dec 05, 2024"
  },
  {
    id: 6,
    title: "Introducing: The New Prolync AI Mentor",
    description: "Get instant feedback on your code and personalized learning roadmap suggestions.",
    category: "Prolync Updates",
    image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=800",
    readTime: "3 min read",
    author: "Product Team",
    date: "Dec 01, 2024"
  }
];

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState("All");
  const navigate = useNavigate();

  const filteredPosts = activeCategory === "All"
    ? blogPosts
    : blogPosts.filter(post => post.category === activeCategory);

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Navigation Placeholder (Assuming layout handles it, or simple back button) */}
      {/* In a real app this would be part of Layout, but adding a simple nav for context if needed */}


      {/* 1. Hero Section */}
      <section className="relative overflow-hidden py-16 md:py-24 max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 z-10">
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors px-4 py-1.5 text-sm">
              Learn • Build • Grow
            </Badge>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground leading-tight">
              Insights for the <br />
              <span className="text-primary">Modern Student</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
              Expert advice, industry insights, and platform updates to help you master your learning journey with Prolync.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button size="lg" className="h-12 text-base px-8 shadow-lg shadow-primary/25">
                Explore Blogs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="h-12 text-base px-8">
                View Updates
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-purple-500/20 rounded-full blur-3xl opacity-50" />
            <img
              src="/blog-hero.png"
              alt="Education Technology"
              className="relative z-10 w-full h-auto drop-shadow-2xl animate-fade-in"
              onError={(e) => e.currentTarget.src = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800"}
            />
          </div>
        </div>
      </section>

      {/* 2. Featured Blog */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-500 fill-yellow-500" /> Featured Post
        </h2>
        <div className="relative rounded-3xl overflow-hidden group cursor-pointer shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10 group-hover:from-black/90 transition-all duration-300" />
          <img
            src="/blog-featured.png"
            alt="Featured Post"
            className="w-full h-[500px] object-cover group-hover:scale-105 transition-transform duration-700"
            onError={(e) => e.currentTarget.src = "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1200"}
          />
          <div className="absolute bottom-0 left-0 p-8 md:p-12 z-20 max-w-3xl">
            <Badge className="bg-primary hover:bg-primary text-white mb-4 border-none text-base px-4 py-1">
              EdTech & Future
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight group-hover:text-primary-foreground/90 transition-colors">
              How Prolync helps students move from learning to career success
            </h2>
            <div className="flex items-center gap-6 text-gray-300 text-sm md:text-base font-medium">
              <span className="flex items-center gap-2"><Clock className="h-4 w-4" /> 8 min read</span>
              <span className="flex items-center gap-2"><User className="h-4 w-4" /> Written by Prolync Team</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Categories & Grid */}
      <section className="max-w-7xl mx-auto px-4 pb-24">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h2 className="text-3xl font-bold">Latest Articles</h2>
            <p className="text-muted-foreground mt-1">Explore knowledge across different domains</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {blogCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${activeCategory === cat
                  ? 'bg-primary text-primary-foreground border-primary shadow-md'
                  : 'bg-background hover:bg-accent text-muted-foreground border-border'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <Link to={`/blog/${post.id}`} key={post.id} className="group">
              <Card className="h-full border-border/50 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-card">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary" className="backdrop-blur-md bg-background/80 font-medium">
                      {post.category}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="mb-3 flex items-center gap-3 text-xs text-muted-foreground font-medium">
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                    {post.description}
                  </p>
                  <div className="flex items-center gap-2 text-sm font-medium pt-2 border-t mt-auto">
                    <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs">
                      {post.author.charAt(0)}
                    </div>
                    {post.author}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. Why Prolync Section */}
      <section className="bg-muted/30 py-20 border-y">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Prolync Student Workspace?</h2>
            <p className="text-lg text-muted-foreground">
              We believe every student deserves a unified platform to learn, practice, and launch their career.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: BookOpen, title: "Unified Learning", desc: "One login for all your courses, coding challenges, and projects." },
              { icon: Code2, title: "Real-World Practice", desc: "Integrated coding environments and project showcases to build your portfolio." },
              { icon: Briefcase, title: "Career Launchpad", desc: "Direct connection to internships, jobs, and mentorship opportunities." }
            ].map((item, i) => (
              <div key={i} className="text-center p-6 rounded-2xl bg-background border shadow-sm hover:shadow-md transition-shadow">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-6">
                  <item.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Newsletter CTA */}
      <section className="py-24 max-w-4xl mx-auto px-4 text-center">
        <div className="bg-primary text-primary-foreground rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
          <div className="relative z-10 space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">Join the Prolync Community</h2>
            <p className="text-primary-foreground/80 max-w-xl mx-auto text-lg">
              Get the latest learning tips, career advice, and platform updates delivered straight to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                placeholder="Enter your email address"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60 h-12 focus-visible:ring-white/50"
              />
              <Button variant="secondary" size="lg" className="h-12 font-semibold">
                Subscribe
              </Button>
            </div>
            <p className="text-xs text-primary-foreground/60">
              No spam, ever. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>

      {/* 8. Footer CTA */}
      <footer className="border-t py-12 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold mb-2">Start learning smarter today.</h3>
            <p className="text-muted-foreground">Join thousands of students building their future with Prolync.</p>
          </div>
          <Button size="lg" className="h-12 px-8 rounded-full text-lg shadow-lg shadow-primary/20" onClick={() => navigate('/', { state: { openAuth: true } })}>
            Get Started Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </footer>
    </div>
  );
}
