import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, MapPin, Clock, Brain } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Expert {
  id: string;
  name: string;
  expertise: string[];
  location: string;
  rating: number;
  hourlyRate: number;
  avatar: string;
  matchScore: number;
  availability: string;
}

interface AIExpertSelectorProps {
  projectDescription: string;
  onExpertSelect: (expert: Expert) => void;
}

export function AIExpertSelector({ projectDescription, onExpertSelect }: AIExpertSelectorProps) {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const findMatchingExperts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-actions', {
        body: { 
          action: 'match_experts',
          project_description: projectDescription,
          search_query: searchQuery
        }
      });

      if (error) throw error;
      setExperts(data.experts || []);
    } catch (error) {
      console.error('Error finding experts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectDescription) {
      findMatchingExperts();
    }
  }, [projectDescription]);

  const handleSearch = () => {
    findMatchingExperts();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Brain className="h-6 w-6 text-blue-600" />
        <h3 className="text-xl font-semibold">AI Expert Matcher</h3>
      </div>

      <div className="flex space-x-2">
        <Input
          placeholder="Refine your search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <Button onClick={handleSearch} disabled={loading}>
          {loading ? 'Matching...' : 'Find Experts'}
        </Button>
      </div>

      <div className="grid gap-4">
        {experts.map((expert) => (
          <Card key={expert.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={expert.avatar} />
                    <AvatarFallback>{expert.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="text-lg font-semibold">{expert.name}</h4>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {expert.matchScore}% Match
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{expert.rating}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{expert.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{expert.availability}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {expert.expertise.map((skill) => (
                        <Badge key={skill} variant="outline">{skill}</Badge>
                      ))}
                    </div>
                    <p className="text-lg font-semibold text-blue-600">
                      ${expert.hourlyRate}/hour
                    </p>
                  </div>
                </div>
                <Button onClick={() => onExpertSelect(expert)}>
                  Select Expert
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {experts.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Describe your project to get AI-powered expert recommendations</p>
        </div>
      )}
    </div>
  );
}