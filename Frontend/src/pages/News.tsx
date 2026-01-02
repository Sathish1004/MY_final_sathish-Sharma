import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Calendar,
  ExternalLink,
  TrendingUp,
  GraduationCap,
  AlertCircle,
  User,
  X,
  Info
} from 'lucide-react';
import { techNews as staticTechNews, examUpdates, NewsItem, ExamUpdateItem } from '@/data/newsData';

import FeatureGuard from "@/components/FeatureGuard";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function News() {
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | ExamUpdateItem | null>(null);
  const [newsArticles, setNewsArticles] = useState<NewsItem[]>(staticTechNews);

  useEffect(() => {
    // ... (fetchNews logic)
    const fetchNews = async () => {
      try {
        const response = await fetch(API_URL + '/api/news/public');
        if (response.ok) {
          const data = await response.json();
          // Map DB keys to frontend keys
          const formattedNews: NewsItem[] = data.map((item: any) => ({
            id: item.id,
            title: item.title,
            category: item.category,
            image: item.image_url || 'https://images.unsplash.com/photo-1504384308090-c54be3852f33?w=800&h=450&fit=crop', // Default image
            source: 'Prolync Update', // Default source
            date: new Date(item.publish_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            excerpt: item.description.substring(0, 100) + '...',
            content: item.description,
            externalLink: item.external_link || '#'
          }));

          // Combine with static news, or replace. Here combining, putting new ones first.
          setNewsArticles([...formattedNews, ...staticTechNews]);
        }
      } catch (error) {
        console.error("Failed to fetch news", error);
      }
    };

    fetchNews();
  }, []);

  // Helper to open modal
  const openArticle = (article: NewsItem | ExamUpdateItem) => setSelectedArticle(article);

  // Helper to close modal
  const closeArticle = () => setSelectedArticle(null);

  // Helper to get link
  const getLink = (article: NewsItem | ExamUpdateItem) => {
    return 'externalLink' in article ? article.externalLink : article.link;
  };

  return (
    <FeatureGuard feature="news">
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">News & Updates</h1>
          <p className="text-muted-foreground mt-1">
            Stay informed with the latest tech news and exam updates
          </p>
        </div>

        <Tabs defaultValue="tech" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="tech" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Tech Updates
            </TabsTrigger>
            <TabsTrigger value="exams" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Exam Updates
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tech">
            <div className="grid gap-6 md:grid-cols-2">
              {newsArticles.filter(item => item.category !== 'Exam Update').map((news, index) => (
                <Card
                  key={news.id}
                  className="overflow-hidden card-hover opacity-0 animate-fade-in flex flex-col cursor-pointer group"
                  style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}
                  onClick={() => openArticle(news)}
                >
                  <div className="h-48 overflow-hidden">
                    <img
                      src={news.image}
                      alt={news.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-5 flex flex-col flex-1 transform transition-colors duration-300">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary">{news.category}</Badge>
                      <span className="text-sm text-muted-foreground">{news.date}</span>
                    </div>
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">{news.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">{news.excerpt}</p>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t w-full">
                      <span className="text-sm text-muted-foreground">Source: {news.source}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="pointer-events-none group-hover:bg-primary/10 group-hover:text-primary"
                      >
                        Read More
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="exams">
            <div className="space-y-4">
              {/* Important Alert */}
              <Card className="border-warning/50 bg-warning/5">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-warning" />
                    <p className="text-sm font-medium">
                      Don't miss important deadlines! Set reminders for exams you're interested in.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Fetched Exam Updates */}
              <div className="grid gap-4 mb-4">
                {newsArticles.filter(item => item.category === 'Exam Update').map((news, index) => (
                  <Card
                    key={news.id}
                    className="card-hover opacity-0 animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}
                  >
                    <CardContent className="p-5">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{news.title}</h3>
                            <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800 border-yellow-200">New</Badge>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Badge variant="outline">{news.category}</Badge>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              Date: {news.date}
                            </div>
                            <div className="flex items-center gap-1">
                              <Info className="h-4 w-4" />
                              <span className="line-clamp-1 max-w-md">{news.excerpt}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => openArticle(news)}>
                            Details
                            <Info className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Static Exam List - Keeping existing structure for static data */}
              <div className="grid gap-4">
                {examUpdates.map((exam, index) => (
                  <Card
                    key={exam.id}
                    className={`card-hover opacity-0 animate-fade-in ${exam.important ? 'border-primary/50' : ''}`}
                    style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}
                  >
                    <CardContent className="p-5">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{exam.title}</h3>
                            {exam.important && (
                              <Badge variant="destructive" className="text-xs">Important</Badge>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Badge variant="outline">{exam.type}</Badge>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              Deadline: {exam.deadline}
                            </div>
                            <div className="flex items-center gap-1">
                              <GraduationCap className="h-4 w-4" />
                              {exam.eligibility}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => openArticle(exam)}>
                            Details
                            <Info className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Details Modal */}
        <Dialog open={!!selectedArticle} onOpenChange={(open) => !open && closeArticle()}>
          <DialogContent className="[&>button]:hidden max-w-4xl max-h-[90vh] overflow-y-auto w-[90vw] p-0 gap-0 border-0 rounded-2xl block">
            {selectedArticle && (
              <div className="flex flex-col bg-background animate-fade-in">
                {/* Hero Image - Fixed Header */}
                <div className="relative w-full h-[250px] shrink-0">
                  <img
                    src={selectedArticle.image}
                    alt={selectedArticle.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-4 right-4 rounded-full bg-background/20 backdrop-blur-md hover:bg-background/40 text-foreground border border-white/20"
                    onClick={closeArticle}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Content - Scrollable */}
                <div className="p-6 md:p-8 space-y-6 -mt-20 relative px-6 md:px-10">
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge className="text-sm px-3 py-1 shadow-sm" variant="secondary">{selectedArticle.category}</Badge>
                      <span className="text-sm text-muted-foreground/80 font-medium flex items-center gap-1 bg-background/50 backdrop-blur px-2 py-0.5 rounded-md">
                        <Calendar className="h-3.5 w-3.5" />
                        {'date' in selectedArticle ? selectedArticle.date : selectedArticle.deadline}
                      </span>
                    </div>

                    <DialogTitle className="text-2xl md:text-3xl font-bold leading-tight text-foreground drop-shadow-sm">
                      {selectedArticle.title}
                    </DialogTitle>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span>Source: <span className="font-medium text-foreground">{selectedArticle.source}</span></span>
                    </div>
                  </div>

                  <div className="prose prose-slate dark:prose-invert max-w-none text-muted-foreground">
                    {selectedArticle.content.split('\n').map((line: string, index: number) => {
                      // Handle empty lines as spacers
                      if (!line.trim()) return <br key={index} />;

                      // Handle bullet points
                      if (line.trim().startsWith('-')) {
                        return (
                          <div key={index} className="flex gap-2 ml-4 mb-2">
                            <span className="text-primary">•</span>
                            <span dangerouslySetInnerHTML={{
                              __html: line.replace(/^- /, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                            }} />
                          </div>
                        );
                      }

                      // Handle standard paragraphs with bold text
                      return (
                        <p key={index} className="mb-2 leading-relaxed" dangerouslySetInnerHTML={{
                          __html: line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>')
                        }} />
                      );
                    })}
                  </div>

                  <div className="pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pb-4">
                    <span className="text-sm text-muted-foreground hidden sm:inline">
                      Visit the official page for more details
                    </span>
                    <Button
                      size="lg"
                      className="w-full sm:w-auto shadow-sm"
                      onClick={() => window.open(getLink(selectedArticle), '_blank')}
                    >
                      View Official Page
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </FeatureGuard>
  );
}
