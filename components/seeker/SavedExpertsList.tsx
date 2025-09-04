import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, Star } from 'lucide-react';

interface SavedExpert {
  id: string;
  expert_id: string;
  profiles: {
    full_name: string;
    title: string;
    location: string;
    average_rating: number;
    total_reviews: number;
    profile_photo_url: string;
  };
}

export const SavedExpertsList: React.FC = () => {
  const [savedExperts, setSavedExperts] = useState<SavedExpert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedExperts();
  }, []);

  const fetchSavedExperts = async () => {
    try {
      const { data, error } = await supabase
        .from('saved_experts')
        .select(`
          id,
          expert_id,
          profiles!saved_experts_expert_id_fkey (
            full_name,
            title,
            location,
            average_rating,
            total_reviews,
            profile_photo_url
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setSavedExperts(data || []);
    } catch (error) {
      console.error('Error fetching saved experts:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeSavedExpert = async (id: string) => {
    try {
      const { error } = await supabase
        .from('saved_experts')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setSavedExperts(prev => prev.filter(expert => expert.id !== id));
    } catch (error) {
      console.error('Error removing saved expert:', error);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading) {
    return <div className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-red-500" />
          Saved Experts ({savedExperts.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {savedExperts.length === 0 ? (
            <div className="text-center py-8">
              <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No saved experts yet</p>
              <p className="text-sm text-gray-400">Browse experts to save your favorites</p>
            </div>
          ) : (
            savedExperts.map((saved) => (
              <div key={saved.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                    {saved.profiles.profile_photo_url ? (
                      <img 
                        src={saved.profiles.profile_photo_url} 
                        alt={saved.profiles.full_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {saved.profiles.full_name}
                    </h3>
                    <p className="text-sm text-gray-600 truncate">{saved.profiles.title}</p>
                    <p className="text-xs text-gray-500">{saved.profiles.location}</p>
                    
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center">
                        {renderStars(Math.round(saved.profiles.average_rating))}
                      </div>
                      <span className="text-xs text-gray-500">
                        ({saved.profiles.total_reviews} reviews)
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Button size="sm" className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      Contact
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => removeSavedExpert(saved.id)}
                      className="text-red-600 hover:text-red-700"
                    >
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