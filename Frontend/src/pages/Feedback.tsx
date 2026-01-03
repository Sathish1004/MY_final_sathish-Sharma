import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import {
  Star,
  MessageSquare,
  BookOpen,
  Palette,
  MousePointer,
  Code2,
  Send,
  Loader2,
  CheckCircle
} from 'lucide-react';

const feedbackCategories = [
  { id: 'course', label: 'Course Quality', icon: BookOpen, description: 'Rate course content, structure, and clarity' },
  { id: 'ui', label: 'User Interface', icon: Palette, description: 'Rate visual design, layout, and aesthetics' },
  { id: 'ux', label: 'User Experience', icon: MousePointer, description: 'Rate ease of use, navigation, and flow' },
  { id: 'coding', label: 'Coding Platform', icon: Code2, description: 'Rate code editor, problems, test cases, performance' },
  { id: 'general', label: 'General Feedback', icon: MessageSquare, description: 'Overall platform satisfaction' },
];

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Feedback() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // State for ratings: { course: 0, ui: 0, ... }
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [hoveredRating, setHoveredRating] = useState<{ id: string, rating: number } | null>(null);
  const [description, setDescription] = useState('');

  const handleRatingChange = (categoryId: string, value: number) => {
    setRatings(prev => ({ ...prev, [categoryId]: value }));
  };

  const handleSubmit = async () => {
    // Check if user is logged in
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'You must be logged in to submit feedback',
        variant: 'destructive'
      });
      return;
    }

    // Check if all mandatory ratings are provided
    const requiredCategories = ['course', 'ui', 'ux', 'coding', 'general'];
    const missingCategories = requiredCategories.filter(cat => !ratings[cat]);

    if (missingCategories.length > 0) {
      toast({
        title: 'Incomplete Feedback',
        description: 'Please provide a rating for all categories/sections before submitting.',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Calculate average rating
      const ratingsList = Object.values(ratings);
      const avgRating = Math.round(ratingsList.reduce((a, b) => a + b, 0) / ratingsList.length);

      const feedbackData = {
        user_id: user.id,
        user_name: user.name || user.email?.split('@')[0] || 'Anonymous',
        rating: avgRating,
        category: 'Comprehensive',
        rating_course: ratings['course'],
        rating_ui: ratings['ui'],
        rating_ux: ratings['ux'],
        rating_coding: ratings['coding'],
        rating_general: ratings['general'],
        message: `General Rating: ${ratings['general']}/5`, // Keep for backward compatibility if needed
        comments: description.trim()
      };

      const response = await fetch(API_URL + '/api/feedback/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit feedback');
      }

      setSubmitted(true);
      toast({
        title: 'Thank you!',
        description: 'Your feedback has been submitted successfully',
      });
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to submit feedback. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setRatings({});
    setDescription('');
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto animate-fade-in p-4">
        <Card className="border-green-500/20 shadow-lg">
          <CardContent className="pt-12 pb-12 text-center">
            <div className="h-24 w-24 rounded-full bg-green-100 mx-auto mb-6 flex items-center justify-center animate-bounce">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold mb-3 text-foreground">Thank You!</h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Your feedback helps us improve the Student Workspace platform.
            </p>
            <Button onClick={resetForm} size="lg" className="rounded-full">Submit Another Feedback</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in pb-10">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-foreground">Feedback</h1>
        <p className="text-lg text-muted-foreground">
          Help us improve by sharing your experience across different categories
        </p>
      </div>

      {/* Feedback Categories */}
      <div className="space-y-4">
        {feedbackCategories.map((category, index) => (
          <Card
            key={category.id}
            className="overflow-hidden border-l-4 transition-all hover:shadow-md"
            style={{
              borderLeftColor: ratings[category.id] ? 'hsl(var(--primary))' : 'transparent',
              animationDelay: `${index * 0.1}s`
            }}
          >
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <category.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{category.label}</h3>
                    <p className="text-muted-foreground text-sm mt-1">{category.description}</p>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-2 min-w-[200px]">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleRatingChange(category.id, star)}
                        onMouseEnter={() => setHoveredRating({ id: category.id, rating: star })}
                        onMouseLeave={() => setHoveredRating(null)}
                        className="p-1 transition-transform hover:scale-110 focus:outline-none"
                      >
                        <Star
                          className={`h-8 w-8 transition-all duration-200 ${star <= (
                            (hoveredRating?.id === category.id ? hoveredRating.rating : 0) ||
                            (ratings[category.id] || 0)
                          )
                            ? 'fill-warning text-warning scale-110 drop-shadow-sm'
                            : 'text-muted-foreground/30 hover:text-muted-foreground'
                            }`}
                        />
                      </button>
                    ))}
                  </div>
                  <span className="text-sm font-medium text-primary h-5 transition-opacity duration-300">
                    {ratings[category.id] ? (
                      ratings[category.id] === 1 ? 'Poor' :
                        ratings[category.id] === 2 ? 'Fair' :
                          ratings[category.id] === 3 ? 'Good' :
                            ratings[category.id] === 4 ? 'Very Good' : 'Excellent'
                    ) : ''}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Final Description Box */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-3">
            <Label htmlFor="description" className="text-lg font-semibold flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Additional Comments
            </Label>
            <Textarea
              id="description"
              placeholder="Share any detailed feedback, suggestions, or issues you'd like us to know..."
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="resize-none text-base"
            />
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="pt-2">
        <Button
          size="lg"
          className="w-full text-lg h-14 shadow-lg hover:shadow-xl transition-all"
          onClick={handleSubmit}
          disabled={isSubmitting || Object.keys(ratings).length === 0}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Submitting Feedback...
            </>
          ) : (
            <>
              <Send className="mr-2 h-5 w-5" />
              Submit Feedback
            </>
          )}
        </Button>
        {Object.keys(ratings).length === 0 && (
          <p className="text-center text-sm text-muted-foreground mt-2">
            Please rate at least one category to submit
          </p>
        )}
      </div>
    </div>
  );
}
