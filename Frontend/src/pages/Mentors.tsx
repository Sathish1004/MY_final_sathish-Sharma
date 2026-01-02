import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import {
  Search,
  Star,
  Clock,
  Calendar,
  MessageSquare,
  Video,
  Briefcase,
  GraduationCap,
  Filter,
  User,
  CheckCircle2,
  Info
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

import FeatureGuard from "@/components/FeatureGuard";

export default function Mentors() {
  const [mentors, setMentors] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMentor, setSelectedMentor] = useState<any | null>(null);
  const [slotStats, setSlotStats] = useState<any[]>([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [bookingNotes, setBookingNotes] = useState('');
  const [sessions, setSessions] = useState<any[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();
  const { addNotification } = useNotifications();

  useEffect(() => {
    fetchMentors();
    if (user) fetchUserSessions();
  }, [user]);

  const fetchMentors = async () => {
    try {
      const response = await fetch(`${API_URL}/api/mentorship/mentors`);
      const data = await response.json();
      if (response.ok) setMentors(data);
    } catch (error) {
      console.error('Fetch Mentors error:', error);
    }
  };

  const fetchUserSessions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/mentorship/sessions`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) setSessions(data);
    } catch (error) {
      console.error('Fetch Sessions error:', error);
    }
  };

  const fetchSlotStats = async (mentorId: number) => {
    try {
      const response = await fetch(`${API_URL}/api/mentorship/booked-slots/${mentorId}`);
      const data = await response.json();
      if (response.ok) setSlotStats(data);
    } catch (error) {
      console.error('Fetch Slot Stats error:', error);
    }
  };

  const handleMentorSelect = (mentor: any) => {
    setSelectedMentor(mentor);
    setSelectedSlot('');
    setBookingNotes('');
    fetchSlotStats(mentor.id);
  };

  const filteredMentors = mentors.filter(mentor =>
    mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (mentor.skills && mentor.skills.some((s: string) => s.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const isSlotInFuture = (slot: string) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const parts = slot.split(' ');
    if (parts.length < 3) return true;
    const [dayStr, timeStr, ampm] = parts;
    const now = new Date();
    const currentDay = now.getDay();
    const slotDay = days.indexOf(dayStr);

    if (slotDay < currentDay) return false;
    if (slotDay > currentDay) return true;

    // Same day check
    let [hours, minutes] = timeStr.split(':').map(Number);
    if (ampm === 'PM' && hours < 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0;

    const slotTime = new Date(now);
    slotTime.setHours(hours, minutes, 0, 0);
    return slotTime > now;
  };

  const handleBookSession = async () => {
    if (!selectedSlot) {
      toast({ title: 'Slot Required', description: 'Please select an available time slot', variant: 'destructive' });
      return;
    }

    if (!isSlotInFuture(selectedSlot)) {
      toast({ title: 'Invalid Slot', description: 'You can only book sessions for upcoming time slots.', variant: 'destructive' });
      return;
    }

    const bookingData = {
      mentor_id: selectedMentor?.id,
      time_slot: selectedSlot,
      topic: bookingNotes
    };

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/mentorship/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bookingData),
      });

      const data = await response.json();

      if (response.ok) {
        addNotification({
          title: 'Session Joined',
          description: `You have successfully joined the session with ${selectedMentor?.name} at ${selectedSlot}.`,
          type: 'success',
        });

        setSelectedMentor(null);
        setSelectedSlot('');
        setBookingNotes('');
        fetchUserSessions();
      } else {
        toast({
          title: 'Booking Failed',
          description: data.message || 'Could not join session.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: 'Error',
        description: 'Failed to connect to the server.',
        variant: 'destructive'
      });
    }
  };


  return (
    <FeatureGuard feature="mentorship">
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Mentorship</h1>
            <p className="text-muted-foreground mt-1">
              Connect with industry experts for personalized guidance
            </p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search mentors or skills..."
              className="pl-10 w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Mentors Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredMentors.map((mentor, index) => (
            <Card
              key={mentor.id}
              className="card-hover opacity-0 animate-fade-in flex flex-col h-full bg-card border-border/50 shadow-sm"
              style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}
            >
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16 border-2 border-primary/10">
                    <AvatarImage src={mentor.avatar} alt={mentor.name} />
                    <AvatarFallback className="bg-primary/5 text-primary font-bold">
                      {mentor.name.split(' ').map((n: any) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg text-foreground truncate">{mentor.name}</h3>
                    <p className="text-sm text-primary/80 font-medium truncate">{mentor.role}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                      <Briefcase className="h-3 w-3" />
                      <span className="truncate">{mentor.company}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-primary/5 border border-primary/10">
                    <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                    <span className="text-[11px] font-bold text-primary uppercase tracking-tight">Certified Mentor</span>
                  </div>
                  {mentor.is_fully_booked && (
                    <Badge variant="destructive" className="px-2 py-1 text-[11px] font-bold uppercase tracking-tight">
                      Fully Booked
                    </Badge>
                  )}
                </div>

                <p className="text-sm text-muted-foreground mt-4 line-clamp-3 flex-1">
                  {mentor.bio}
                </p>

                <div className="flex flex-wrap gap-2 mt-4">
                  {mentor.skills?.map((spec: string) => (
                    <Badge key={spec} variant="secondary" className="bg-primary/5 text-primary border-primary/10 hover:bg-primary/10 transition-colors pointer-events-none text-[10px] px-2 py-0.5">
                      {spec}
                    </Badge>
                  ))}
                </div>

                <div className="flex flex-col gap-2 mt-auto pt-6">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full border-primary/20 hover:bg-primary/5 hover:text-primary transition-all font-medium py-5"
                        onClick={() => handleMentorSelect(mentor)}
                        disabled={mentor.is_fully_booked}
                      >
                        <User className="h-4 w-4 mr-2" />
                        {mentor.is_fully_booked ? 'Unavailable' : 'View Profile'}
                      </Button>
                    </SheetTrigger>
                    <SheetContent className="sm:max-w-lg p-0 border-l border-border/50">
                      <ScrollArea className="h-full">
                        <div className="p-8 pb-32">
                          <SheetHeader className="text-left space-y-4">
                            <div className="flex items-center gap-6">
                              <Avatar className="h-24 w-24 border-4 border-primary/10 shadow-xl">
                                <AvatarImage src={mentor.avatar} alt={mentor.name} />
                                <AvatarFallback className="bg-primary/5 text-primary text-2xl font-bold">
                                  {mentor.name.split(' ').map((n: any) => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div className="space-y-1">
                                <SheetTitle className="text-3xl font-bold tracking-tight">{mentor.name}</SheetTitle>
                                <p className="text-primary font-semibold text-lg">{mentor.role}</p>
                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                  <Briefcase className="h-4 w-4" />
                                  <span>{mentor.company}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className="bg-primary/10 text-primary border-none hover:bg-primary/20 px-3 py-1">
                                <Star className="h-3.5 w-3.5 mr-1.5 fill-primary" />
                                Top Rated Mentor
                              </Badge>
                              <Badge variant="outline" className="border-primary/20 text-primary/70">
                                <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                                Verified
                              </Badge>
                            </div>
                          </SheetHeader>

                          <div className="mt-10 space-y-10">
                            <section className="space-y-3">
                              <div className="flex items-center gap-2 text-foreground font-bold text-lg">
                                <Info className="h-5 w-5 text-primary" />
                                <h3>About Mentor</h3>
                              </div>
                              <p className="text-muted-foreground leading-relaxed text-base">
                                {mentor.detailed_bio}
                              </p>
                            </section>

                            <Separator className="bg-border/50" />

                            <section className="space-y-4">
                              <h3 className="text-foreground font-bold text-lg">Expertise & Skills</h3>
                              <div className="flex flex-wrap gap-2.5">
                                {mentor.skills?.map((skill: string) => (
                                  <Badge
                                    key={skill}
                                    className="bg-secondary/50 text-secondary-foreground hover:bg-secondary border-none px-4 py-1.5 text-sm font-medium transition-colors"
                                  >
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </section>

                            <Separator className="bg-border/50" />

                            <section className="space-y-4">
                              <h3 className="text-foreground font-bold text-lg">Mentorship Focus</h3>
                              <ul className="space-y-3">
                                {[
                                  'Industry best practices and real-world workflows',
                                  'Personalized career guidance and roadmap planning',
                                  'Technical interview preparation and mock sessions',
                                  'Project architecture and code review'
                                ].map((item, i) => (
                                  <li key={i} className="flex items-start gap-3 text-muted-foreground group">
                                    <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                                    <span className="text-sm leading-snug">{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </section>

                            <Separator className="bg-border/50" />

                            <section className="space-y-6">
                              <div className="bg-primary/[0.03] border border-primary/10 rounded-2xl p-6 space-y-6">
                                <h3 className="text-primary font-bold text-xl flex items-center gap-2">
                                  <Video className="h-5 w-5" />
                                  Join Group Session
                                </h3>

                                <div className="space-y-5">
                                  <div className="space-y-2.5">
                                    <Label className="text-xs font-bold uppercase tracking-widest text-primary/70">Pick a Time Slot</Label>
                                    <Select value={selectedSlot} onValueChange={setSelectedSlot}>
                                      <SelectTrigger className="h-12 border-primary/20 bg-background focus:ring-primary/20">
                                        <SelectValue placeholder="Choose an available time" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {selectedMentor?.availability.map((slot: string) => {
                                          const stats = slotStats.find(s => s.time_slot === slot);
                                          const isFull = stats?.is_full;
                                          const count = stats?.count || 0;
                                          const max = stats?.max || 5;
                                          const isPassed = !isSlotInFuture(slot);

                                          return (
                                            <SelectItem
                                              key={slot}
                                              value={slot}
                                              disabled={isFull || isPassed}
                                              className="h-12 cursor-pointer focus:bg-primary/5"
                                            >
                                              <div className="flex items-center justify-between w-full gap-4">
                                                <span className="font-medium">{slot}</span>
                                                <div className="flex items-center gap-2">
                                                  {isFull ? (
                                                    <Badge variant="outline" className="text-[10px] text-destructive border-destructive/20 bg-destructive/5 font-extrabold uppercase py-0">Full ({count}/{max})</Badge>
                                                  ) : isPassed ? (
                                                    <Badge variant="outline" className="text-[10px] text-muted-foreground border-muted-foreground/20 bg-muted/5 font-extrabold uppercase py-0">Passed</Badge>
                                                  ) : (
                                                    <Badge variant="secondary" className="text-[10px] bg-emerald-500/10 text-emerald-600 border-none font-medium">{count}/{max} Joined</Badge>
                                                  )}
                                                </div>
                                              </div>
                                            </SelectItem>
                                          );
                                        })}
                                      </SelectContent>
                                    </Select>
                                    <p className="text-[10px] text-primary/60 mt-1.5 flex items-center gap-1.5 font-medium italic px-1">
                                      <Info className="h-3 w-3" />
                                      Group sessions are limited to 5 participants.
                                    </p>
                                  </div>

                                  <div className="space-y-2.5">
                                    <Label className="text-xs font-bold uppercase tracking-widest text-primary/70">Topic to discuss</Label>
                                    <Textarea
                                      placeholder="Briefly describe what you'd like to talk about..."
                                      value={bookingNotes}
                                      onChange={(e) => setBookingNotes(e.target.value)}
                                      className="min-h-[100px] border-primary/20 focus-visible:ring-primary/20 bg-background resize-none"
                                    />
                                  </div>

                                  <Button
                                    className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90 shadow-xl hover:shadow-primary/20 transition-all hover:-translate-y-0.5"
                                    onClick={handleBookSession}
                                    disabled={!selectedSlot || sessions.some(s => s.mentor_id === mentor.id && s.time_slot === selectedSlot && s.status === 'booked')}
                                  >
                                    {sessions.some(s => s.mentor_id === mentor.id && s.time_slot === selectedSlot && s.status === 'booked') ? (
                                      <>
                                        <CheckCircle2 className="h-5 w-5 mr-2" />
                                        Joined
                                      </>
                                    ) : (
                                      <>
                                        <Video className="h-5 w-5 mr-2" />
                                        Join Session
                                      </>
                                    )}
                                  </Button>
                                </div>
                              </div>
                            </section>
                          </div>
                        </div>
                      </ScrollArea>
                    </SheetContent>
                  </Sheet>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        className="w-full shadow-sm font-semibold h-11 transition-all"
                        variant={sessions.some(s => s.mentor_id === mentor.id && s.status === 'booked') ? 'secondary' : 'default'}
                        onClick={() => handleMentorSelect(mentor)}
                        disabled={sessions.some(s => s.mentor_id === mentor.id && s.status === 'booked') || mentor.is_fully_booked}
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        {sessions.some(s => s.mentor_id === mentor.id && s.status === 'booked') ? 'Already Booked' : mentor.is_fully_booked ? 'Full' : 'Quick Book'}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md border-border/50 shadow-2xl">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">Quick Booking</DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                          Reserve a spot with <span className="text-primary font-semibold">{selectedMentor?.name}</span>
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-5 mt-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Your Name</Label>
                            <Input
                              value={user?.name || ''}
                              readOnly
                              className="bg-muted/50 border-border/50 focus-visible:ring-0 font-medium"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email Address</Label>
                            <Input
                              type="email"
                              value={user?.email || ''}
                              readOnly
                              className="bg-muted/50 border-border/50 focus-visible:ring-0 font-medium"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="slot" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Select Available Slot <span className="text-destructive">*</span></Label>
                          <Select value={selectedSlot} onValueChange={setSelectedSlot}>
                            <SelectTrigger className="h-11 border-border/50">
                              <SelectValue placeholder="Chose a time that works for you" />
                            </SelectTrigger>
                            <SelectContent>
                              {selectedMentor?.availability.map((slot: string) => {
                                const stats = slotStats.find(s => s.time_slot === slot);
                                const isFull = stats?.is_full;
                                const count = stats?.count || 0;
                                const max = stats?.max || 5;
                                const isPassed = !isSlotInFuture(slot);
                                return (
                                  <SelectItem
                                    key={slot}
                                    value={slot}
                                    disabled={isFull || isPassed}
                                    className="h-10 cursor-pointer"
                                  >
                                    <div className="flex items-center justify-between w-full gap-2">
                                      <span>{slot}</span>
                                      <div className="flex items-center gap-2">
                                        {isFull ? (
                                          <Badge variant="outline" className="text-[10px] text-destructive border-destructive/20 bg-destructive/5 font-extrabold uppercase py-0">Full ({count}/{max})</Badge>
                                        ) : isPassed ? (
                                          <Badge variant="outline" className="text-[10px] text-muted-foreground border-muted-foreground/20 bg-muted/5 font-extrabold uppercase py-0">Passed</Badge>
                                        ) : (
                                          <Badge variant="secondary" className="text-[10px] bg-emerald-500/10 text-emerald-600 border-none font-medium text-[10px] h-5">{count}/{max} Joined</Badge>
                                        )}
                                      </div>
                                    </div>
                                  </SelectItem>
                                );
                              })}
                              {selectedMentor?.availability.every((slot: string) => {
                                const stats = slotStats.find(s => s.time_slot === slot);
                                return (stats?.is_full) || !isSlotInFuture(slot);
                              }) && (
                                  <div className="p-4 text-center">
                                    <p className="text-sm font-bold text-destructive uppercase tracking-widest">No available slots</p>
                                    <p className="text-xs text-muted-foreground mt-1">Please try another mentor</p>
                                  </div>
                                )}
                            </SelectContent>
                          </Select>
                          <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1 font-medium">
                            <Info className="h-3 w-3 text-primary/70" />
                            You can book sessions for upcoming time slots only.
                          </p>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="notes" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Topic or Questions (Optional)</Label>
                          <Textarea
                            id="notes"
                            placeholder="What would you like to achieve in this session?"
                            value={bookingNotes}
                            onChange={(e) => setBookingNotes(e.target.value)}
                            className="min-h-[100px] border-border/50 resize-none focus-visible:ring-primary/20"
                          />
                        </div>
                        <Button
                          className="w-full h-12 text-lg font-bold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all"
                          onClick={handleBookSession}
                          disabled={!selectedSlot}
                        >
                          <Video className="h-5 w-5 mr-2" />
                          Confirm Booking
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </FeatureGuard>
  );
}
