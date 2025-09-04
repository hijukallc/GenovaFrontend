import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProfileData {
  id: string;
  completion_percentage: number;
  full_name: string;
  title: string;
  location: string;
  biography: string;
  profile_photo_url: string;
}

export const ProfileCompletionTracker: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
    
    // Subscribe to real-time updates
    const subscription = supabase
      .channel('profile_updates')
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'profiles' },
        (payload) => {
          setProfile(prev => prev ? { ...prev, ...payload.new } : null);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .single();
      
      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCompletionItems = () => {
    if (!profile) return [];
    
    return [
      { label: 'Basic Info', completed: !!(profile.full_name && profile.title) },
      { label: 'Location', completed: !!profile.location },
      { label: 'Biography', completed: !!profile.biography },
      { label: 'Profile Photo', completed: !!profile.profile_photo_url },
    ];
  };

  if (loading) {
    return <div className="animate-pulse bg-gray-200 h-48 rounded-lg"></div>;
  }

  const completionItems = getCompletionItems();
  const completedCount = completionItems.filter(item => item.completed).length;
  const completionPercentage = (completedCount / completionItems.length) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Profile Completion
          <span className="text-sm font-normal text-gray-500">
            {completedCount}/{completionItems.length} completed
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Progress value={completionPercentage} className="w-full" />
          
          <div className="space-y-2">
            {completionItems.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className={`w-4 h-4 rounded-full ${
                  item.completed ? 'bg-green-500' : 'bg-gray-300'
                }`} />
                <span className={`text-sm ${
                  item.completed ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};