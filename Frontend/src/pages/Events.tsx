import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ExternalLink,
  Trophy,
  Presentation,
  BookOpen,
  Loader2
} from 'lucide-react';
import { useState, useEffect } from 'react';
import FeatureGuard from "@/components/FeatureGuard";

// Interfaces for type safety
interface Event {
  id: number;
  title: string;
  type: string;
  date: string;
  time: string;
  location: string;
  participants: number;
  prize?: string;
  description: string;
  registration_link: string;
  image_url: string;
}

const getEventIcon = (type: string) => {
  switch (type) {
    case 'Hackathon': return Trophy;
    case 'Workshop': return BookOpen;
    case 'Paper Presentation': return Presentation;
    default: return Calendar;
  }
};

const getEventColor = (type: string) => {
  switch (type) {
    case 'Hackathon': return 'bg-warning/10 text-warning border-warning/20';
    case 'Workshop': return 'bg-info/10 text-info border-info/20';
    case 'Paper Presentation': return 'bg-success/10 text-success border-success/20';
    default: return 'bg-primary/10 text-primary border-primary/20';
  }
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';


export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(API_URL + '/api/events');
        if (response.ok) {
          const data = await response.json();
          setEvents(data);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const hackathons = events.filter(e => e.type === 'Hackathon');
  const workshops = events.filter(e => e.type === 'Workshop');
  const presentations = events.filter(e => e.type === 'Paper Presentation');

  const renderEventCard = (event: Event, index: number) => {
    const Icon = getEventIcon(event.type);

    return (
      <Card
        key={event.id}
        className="overflow-hidden card-hover opacity-0 animate-fade-in"
        style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}
      >
        <img
          src={event.image_url}
          alt={event.title}
          className="w-full h-48 object-cover"
        />
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="outline" className={getEventColor(event.type)}>
              <Icon className="h-3 w-3 mr-1" />
              {event.type}
            </Badge>
            {event.prize && (
              <Badge variant="secondary">
                <Trophy className="h-3 w-3 mr-1" />
                {event.prize}
              </Badge>
            )}
          </div>

          <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {event.description}
          </p>

          <div className="space-y-2 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {event.date}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {event.time}
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {event.location}
            </div>
          </div>

          <Button className="w-full" asChild>
            <a href={event.registration_link} target="_blank" rel="noopener noreferrer">
              Register Now
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <FeatureGuard feature="events">
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Events</h1>
          <p className="text-muted-foreground mt-1">
            Participate in hackathons, workshops, and paper presentations
          </p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Events ({events.length})</TabsTrigger>
            <TabsTrigger value="hackathons">Hackathons ({hackathons.length})</TabsTrigger>
            <TabsTrigger value="workshops">Workshops ({workshops.length})</TabsTrigger>
            <TabsTrigger value="presentations">Paper Presentations ({presentations.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {events.length > 0 ? (
                events.map((event, index) => renderEventCard(event, index))
              ) : (
                <div className="col-span-full text-center py-10 text-muted-foreground">
                  No events found. Check back later!
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="hackathons">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {hackathons.length > 0 ? (
                hackathons.map((event, index) => renderEventCard(event, index))
              ) : (
                <div className="col-span-full text-center py-10 text-muted-foreground">
                  No hackathons found. Check back later!
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="workshops">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {workshops.map((event, index) => renderEventCard(event, index))}
            </div>
          </TabsContent>

          <TabsContent value="presentations">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {presentations.map((event, index) => renderEventCard(event, index))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </FeatureGuard>
  );
}
