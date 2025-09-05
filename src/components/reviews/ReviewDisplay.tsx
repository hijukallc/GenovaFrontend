import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Flag, MoreHorizontal } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface Review {
  id: string;
  rating: number;
  feedback: string;
  created_at: string;
  is_flagged: boolean;
  reviewer_id: string;
  profiles?: {
    first_name: string;
    last_name: string;
    profile_photo_url?: string;
  };
}

interface ReviewDisplayProps {
  expertId: string;
  showModerationTools?: boolean;
}

export const ReviewDisplay: React.FC<ReviewDisplayProps> = ({
  expertId,
  showModerationTools = false
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchReviews();
    fetchStats();
  }, [expertId]);

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          profiles!reviewer_id (
            first_name,
            last_name,
            profile_photo_url
          )
        `)
        .eq('expert_id', expertId)
        .eq('is_flagged', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('average_rating, total_reviews')
        .eq('user_id', expertId)
        .single();

      if (error) throw error;
      if (data) {
        setAverageRating(data.average_rating || 0);
        setTotalReviews(data.total_reviews || 0);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleFlagReview = async (reviewId: string) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ 
          is_flagged: true,
          flagged_reason: 'Flagged by user'
        })
        .eq('id', reviewId);

      if (error) throw error;

      toast({
        title: "Review Flagged",
        description: "The review has been flagged for moderation."
      });

      fetchReviews();
    } catch (error) {
      console.error('Error flagging review:', error);
      toast({
        title: "Error",
        description: "Unable to flag review.",
        variant: "destructive"
      });
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading) {
    return <div className="animate-pulse">Loading reviews...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Reviews & Ratings</span>
          <div className="text-right">
            <div className="flex items-center gap-1">
              {renderStars(Math.round(averageRating))}
              <span className="ml-2 font-bold">
                {averageRating.toFixed(1)}
              </span>
            </div>
            <p className="text-xs text-gray-500">{totalReviews} reviews</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No reviews yet</p>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="border-b pb-4 last:border-b-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      {review.profiles?.profile_photo_url ? (
                        <img
                          src={review.profiles.profile_photo_url}
                          alt="Reviewer"
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-xs font-medium">
                          {review.profiles?.first_name?.[0] || 'U'}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        {review.profiles?.first_name} {review.profiles?.last_name}
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {renderStars(review.rating)}
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {showModerationTools && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleFlagReview(review.id)}
                    >
                      <Flag className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                
                {review.feedback && (
                  <p className="text-gray-700 text-sm mt-2 ml-11">
                    {review.feedback}
                  </p>
                )}
                
                {review.is_flagged && (
                  <Badge variant="destructive" className="mt-2 ml-11">
                    Flagged
                  </Badge>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};