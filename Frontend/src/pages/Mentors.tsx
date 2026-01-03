import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  Filter
} from 'lucide-react';

const mentors = [
  {
    id: 1,
    name: 'Dr. Priya Sharma',
    title: 'Senior Software Engineer',
    company: 'Google',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    specializations: ['Frontend', 'React', 'System Design'],
    experience: 12,
    rating: 4.9,
    sessions: 150,
    bio: 'Passionate about helping students break into tech. Specialized in frontend development and system design interviews.',
    availability: ['Mon 10:00 AM', 'Wed 2:00 PM', 'Fri 4:00 PM']
  },
  {
    id: 2,
    name: 'Rajesh Kumar',
    title: 'Tech Lead',
    company: 'Microsoft',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    specializations: ['Backend', 'Cloud', 'Microservices'],
    experience: 10,
    rating: 4.8,
    sessions: 120,
    bio: 'Helping aspiring developers master backend technologies and cloud architecture.',
    availability: ['Tue 11:00 AM', 'Thu 3:00 PM', 'Sat 10:00 AM']
  },
  {
    id: 3,
    name: 'Sneha Patel',
    title: 'Data Scientist',
    company: 'Amazon',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    specializations: ['ML', 'Data Science', 'Python'],
    experience: 8,
    rating: 4.9,
    sessions: 95,
    bio: 'Love teaching machine learning and data science concepts to beginners.',
    availability: ['Mon 3:00 PM', 'Wed 5:00 PM', 'Sat 2:00 PM']
  },
  {
    id: 4,
    name: 'Amit Singh',
    title: 'Engineering Manager',
    company: 'Meta',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    specializations: ['Career Guidance', 'Leadership', 'Interview Prep'],
    experience: 15,
    rating: 5.0,
    sessions: 200,
    bio: 'Focused on career guidance and helping students prepare for FAANG interviews.',
    availability: ['Tue 6:00 PM', 'Thu 6:00 PM', 'Sun 11:00 AM']
  },
  {
    id: 5,
    name: 'Meera Reddy',
    title: 'Mobile Developer',
    company: 'Flipkart',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
    specializations: ['React Native', 'iOS', 'Android'],
    experience: 7,
    rating: 4.7,
    sessions: 80,
    bio: 'Expert in mobile app development. Happy to help with React Native and native development.',
    availability: ['Wed 10:00 AM', 'Fri 2:00 PM', 'Sat 4:00 PM']
  },
  {
    id: 6,
    name: 'Vikram Joshi',
    title: 'DevOps Architect',
    company: 'Netflix',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    specializations: ['DevOps', 'AWS', 'Kubernetes'],
    experience: 11,
    rating: 4.8,
    sessions: 110,
    bio: 'Helping students understand cloud infrastructure and DevOps practices.',
    availability: ['Mon 5:00 PM', 'Thu 11:00 AM', 'Sat 9:00 AM']
  },
];

import FeatureGuard from "@/components/FeatureGuard";

export default function Mentors() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMentor, setSelectedMentor] = useState<typeof mentors[0] | null>(null);
  const [viewProfileMentor, setViewProfileMentor] = useState<typeof mentors[0] | null>(null);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [bookingName, setBookingName] = useState('');
  const [bookingEmail, setBookingEmail] = useState('');
  const [bookingNotes, setBookingNotes] = useState('');
  const [userBookings, setUserBookings] = useState<any[]>([]); // Track user bookings
  const { toast } = useToast();
  const { user } = useAuth();
  const { addNotification } = useNotifications();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Auto-fill form and fetch bookings
  useEffect(() => {
    if (user) {
      setBookingName(user.name || '');
      setBookingEmail(user.email || '');

      // Fetch user bookings
      fetch(`${API_URL}/api/mentorship/my-bookings?email=${user.email}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setUserBookings(data);
        })
        .catch(err => console.error("Failed to fetch bookings", err));
    }
  }, [user]);

  const filteredMentors = mentors.filter(mentor =>
    mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mentor.specializations.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleBookSession = () => {
    const bookingData = {
      student_name: bookingName,
      student_email: bookingEmail,
      mentor_id: selectedMentor?.id,
      mentor_name: selectedMentor?.name,
      slot_time: selectedSlot,
      topic: bookingNotes
    };

    try {
      fetch(`${API_URL}/api/mentorship/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      })
        .then(async (response) => {
          if (response.ok) {
            addNotification({
              title: 'Mentor Session Confirmed',
              description: `You have successfully registered for a session with ${selectedMentor?.name} at ${selectedSlot}.`,
              type: 'success',
            });

            // Refresh bookings
            if (user?.email) {
              fetch(`${API_URL}/api/mentorship/my-bookings?email=${user.email}`)
                .then(res => res.json())
                .then(data => {
                  if (Array.isArray(data)) setUserBookings(data);
                });
            }

            setSelectedMentor(null);
            setSelectedSlot('');
            setBookingNotes('');
          } else {
            const errorData = await response.json();
            toast({
              title: 'Booking Failed',
              description: errorData.message || 'Could not book session.',
              variant: 'destructive'
            });
          }
        })
        .catch((error) => {
          console.error('Booking error:', error);
          toast({
            title: 'Error',
            description: 'Failed to connect to the server.',
            variant: 'destructive'
          });
        });
    } catch (error) {
      console.error("Request failed", error);
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
              className="card-hover opacity-0 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={mentor.avatar} alt={mentor.name} />
                    <AvatarFallback>{mentor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg">{mentor.name}</h3>
                    <p className="text-sm text-blue-600 font-medium">{mentor.title}</p>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-0.5">
                      <Briefcase className="h-3 w-3" />
                      {mentor.company}
                    </div>
                  </div>
                </div>

                <div className="mt-3">
                  <Badge variant="secondary" className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-none">
                    <Star className="h-3 w-3 mr-1 fill-blue-600 text-blue-600" /> CERTIFIED MENTOR
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground mt-4 line-clamp-2 min-h-[40px]">
                  {mentor.bio}
                </p>

                <div className="flex flex-wrap gap-2 mt-4 mb-6">
                  {mentor.specializations.map(spec => (
                    <Badge key={spec} variant="outline" className="text-xs bg-slate-50 text-slate-600 border-slate-200">
                      {spec}
                    </Badge>
                  ))}
                </div>

                <div className="space-y-3">
                  <Button variant="outline" className="w-full" onClick={() => setViewProfileMentor(mentor)}>
                    <Briefcase className="h-4 w-4 mr-2" /> View Profile
                  </Button>

                  {(() => {
                    const isBooked = userBookings.some(b => b.mentor_name === mentor.name);
                    return (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            className={`w-full ${isBooked ? 'bg-slate-500 hover:bg-slate-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                            disabled={isBooked}
                            onClick={() => !isBooked && setSelectedMentor(mentor)}
                          >
                            <Calendar className="h-4 w-4 mr-2" />
                            {isBooked ? 'Already Booked' : 'Quick Book'}
                          </Button>
                        </DialogTrigger>
                        {!isBooked && (
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle>Book a Session with {selectedMentor?.name}</DialogTitle>
                              <DialogDescription>
                                Fill in your details to schedule a mentorship session
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 mt-4">
                              {/* Form Fields (Name, Email, Slot, Notes, Confirm) */}
                              <div className="space-y-2">
                                <Label htmlFor="name">Your Name</Label>
                                <Input
                                  id="name"
                                  placeholder="John Doe"
                                  value={bookingName}
                                  onChange={(e) => setBookingName(e.target.value)}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                  id="email"
                                  type="email"
                                  placeholder="john@example.com"
                                  value={bookingEmail}
                                  onChange={(e) => setBookingEmail(e.target.value)}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="slot">Available Slots</Label>
                                <Select value={selectedSlot} onValueChange={setSelectedSlot}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a time slot" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {selectedMentor?.availability.map(slot => (
                                      <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="notes">Topics to Discuss (Optional)</Label>
                                <Textarea
                                  id="notes"
                                  placeholder="What would you like to discuss?"
                                  value={bookingNotes}
                                  onChange={(e) => setBookingNotes(e.target.value)}
                                />
                              </div>
                              <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleBookSession}>
                                <Video className="h-4 w-4 mr-2" />
                                Confirm Booking
                              </Button>
                            </div>
                          </DialogContent>
                        )}
                      </Dialog>
                    );
                  })()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Profile Slide-over */}
        <Sheet open={!!viewProfileMentor} onOpenChange={(open) => !open && setViewProfileMentor(null)}>
          <SheetContent className="overflow-y-auto sm:max-w-md w-full">
            {viewProfileMentor && (
              <div className="space-y-6">
                {/* Header Profile */}
                <div className="flex items-start gap-4 pb-4 border-b">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={viewProfileMentor.avatar} alt={viewProfileMentor.name} />
                    <AvatarFallback>{viewProfileMentor.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-bold">{viewProfileMentor.name}</h2>
                    <p className="text-blue-600 font-medium">{viewProfileMentor.title}</p>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Briefcase className="h-3 w-3" /> {viewProfileMentor.company}
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="secondary" className="text-[10px] bg-blue-50 text-blue-600 hover:bg-blue-100 border-none">
                        <Star className="h-3 w-3 mr-1 fill-blue-600" /> Top Rated Mentor
                      </Badge>
                      <Badge variant="outline" className="text-[10px] border-blue-200 text-blue-600">
                        Verified
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* About */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <span className="p-1 bg-blue-100 rounded-full text-blue-600"><Briefcase className="h-3 w-3" /></span>
                    About Mentor
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {viewProfileMentor.bio} With over {viewProfileMentor.experience} years of experience in the industry,
                    I am deeply passionate about sharing knowledge and helping the next generation of developers master their craft.
                  </p>
                </div>

                {/* Expertise */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold">Expertise & Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {viewProfileMentor.specializations.map(tag => (
                      <Badge key={tag} className="bg-slate-100 text-slate-700 hover:bg-slate-200 border-none font-normal">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Mentorship Focus */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold">Mentorship Focus</h3>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-4">
                    <li>Industry best practices and real-world workflows</li>
                    <li>Personalized career guidance and roadmap planning</li>
                    <li>Technical interview preparation and mock sessions</li>
                    <li>Project architecture and code review</li>
                  </ul>
                </div>

                {/* Join Session Box */}
                <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 space-y-4">
                  <h3 className="font-semibold text-blue-700 flex items-center gap-2">
                    <Video className="h-4 w-4" /> Join Group Session
                  </h3>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Pick a Time Slot</Label>
                    <Select>
                      <SelectTrigger className="bg-white border-blue-200">
                        <SelectValue placeholder="Choose an available time" />
                      </SelectTrigger>
                      <SelectContent>
                        {viewProfileMentor.availability.map(slot => (
                          <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-[10px] text-blue-400">Group sessions are limited to 5 participants.</p>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Topic to Discuss</Label>
                    <Textarea
                      className="bg-white border-blue-200 min-h-[80px] text-sm resize-none"
                      placeholder="Briefly describe what you'd like to talk about..."
                    />
                  </div>

                  <Button className="w-full bg-blue-400 hover:bg-blue-500 text-white shadow-blue-200/50 shadow-lg">
                    <Video className="h-4 w-4 mr-2" /> Join Session
                  </Button>
                </div>

              </div>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </FeatureGuard>
  );
}
