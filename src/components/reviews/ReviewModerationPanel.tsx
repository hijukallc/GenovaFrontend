import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Star, Check, X, AlertTriangle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface FlaggedReview {
  id: string;
  rating: number;
  feedback: string;
  created_at: string;
  flagged_reason: string;
  expert_id: string;
  reviewer_id: string;
  expert_profile?: {
    first_name: string;
    last_name: string;
  };
  reviewer_profile?: {
    first_name: string;
    last_name: string;
  };
}

export const ReviewModerationPanel: React.FC = () => {
  const [flaggedReviews, setFlaggedReviews] = useState<FlaggedReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [moderationNote, setModerationNote] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchFlaggedReviews();
  }, []);

  const fetchFlaggedReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          expert_profile:profiles!expert_id (
            first_name,
            last_name
          ),
          reviewer_profile:profiles!reviewer_id (
            first_name,
            last_name
          )
        `)
        .eq('is_flagged', true)
        .is('moderated_at', null)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFlaggedReviews(data || []);
    } catch (error) {
      console.error('Error fetching flagged reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleModerateReview = async (reviewId: string, action: 'approve' | 'remove') => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to moderate reviews.",
          variant: "destructive"
        });
        return;
      }

      const updates = {
        is_flagged: action === 'remove',
        moderated_by: user.id,
        moderated_at: new Date().toISOString(),
        flagged_reason: action === 'approve' ? null : moderationNote || 'Removed by moderator'
      };

      const { error } = await supabase
        .from('reviews')
        .update(updates)
        .eq('id', reviewId);

      if (error) throw error;

      toast({
        title: "Review Moderated",
        description: `Review has been ${action === 'approve' ? 'approved' : 'removed'}.`
      });

      setModerationNote('');
      fetchFlaggedReviews();
    } catch (error) {
      console.error('Error moderating review:', error);
      toast({
        title: "Moderation Failed",
        description: "Unable to moderate review.",
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
    return <div className="animate-pulse">Loading flagged reviews...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-500" />
          Review Moderation
          <Badge variant="secondary">{flaggedReviews.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {flaggedReviews.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No flagged reviews to moderate
            </p>
          ) : (
            flaggedReviews.map((review) => (
              <div key={review.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex">{renderStars(review.rating)}</div>
                      <span className="text-sm text-gray-500">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm">
                      <strong>Expert:</strong> {review.expert_profile?.first_name} {review.expert_profile?.last_name}
                    </p>
                    <p className="text-sm">
                      <strong>Reviewer:</strong> {review.reviewer_profile?.first_name} {review.reviewer_profile?.last_name}
                    </p>
                  </div>
                  <Badge variant="destructive">Flagged</Badge>
                </div>

                {review.feedback && (
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm">{review.feedback}</p>
                  </div>
                )}

                <div className="bg-orange-50 p-3 rounded">
                  <p className="text-sm">
                    <strong>Flagged Reason:</strong> {review.flagged_reason}
                  </p>
                </div>

                <div className="space-y-3">
                  <Textarea
                    placeholder="Add moderation note (optional)..."
                    value={moderationNote}
                    onChange={(e) => setModerationNote(e.target.value)}
                    rows={2}
                  />
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleModerateReview(review.id, 'approve')}
                      className="text-green-600 border-green-600 hover:bg-green-50"
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleModerateReview(review.id, 'remove')}
                      className="text-red-600 border-red-600 hover:bg-red-50"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};