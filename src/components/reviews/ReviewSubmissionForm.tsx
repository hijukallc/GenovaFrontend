import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star, Send } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface ReviewSubmissionFormProps {
  expertId: string;
  projectId?: string;
  onSubmitted?: () => void;
}

export const ReviewSubmissionForm: React.FC<ReviewSubmissionFormProps> = ({
  expertId,
  projectId,
  onSubmitted
}) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a star rating before submitting.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to submit a review.",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from('reviews')
        .insert({
          expert_id: expertId,
          reviewer_id: user.id,
          inquiry_id: projectId,
          rating,
          feedback: feedback.trim() || null
        });

      if (error) throw error;

      toast({
        title: "Review Submitted",
        description: "Thank you for your feedback!"
      });

      // Reset form
      setRating(0);
      setFeedback('');
      onSubmitted?.();
      
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: "Submission Failed",
        description: "Unable to submit review. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-500" />
          Submit Review
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Star Rating */}
          <div>
            <label className="block text-sm font-medium mb-2">Rating *</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`text-2xl transition-colors ${
                    star <= (hoveredRating || rating)
                      ? 'text-yellow-500'
                      : 'text-gray-300'
                  }`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                >
                  ★
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {rating > 0 && (
                rating === 1 ? 'Poor' :
                rating === 2 ? 'Fair' :
                rating === 3 ? 'Good' :
                rating === 4 ? 'Very Good' :
                'Excellent'
              )}
            </p>
          </div>

          {/* Written Feedback */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Feedback (Optional)
            </label>
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Share your experience working with this expert..."
              rows={4}
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1">
              {feedback.length}/500 characters
            </p>
          </div>

          <Button 
            type="submit" 
            disabled={isSubmitting || rating === 0}
            className="w-full"
          >
            {isSubmitting ? (
              "Submitting..."
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Submit Review
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};