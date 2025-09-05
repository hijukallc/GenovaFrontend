import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const mockExperts = [
  {
    id: 1,
    name: 'Dr. Sarah Chen',
    title: 'Former VP of Technology',
    location: 'San Francisco, CA',
    expertise: ['Technology Strategy', 'Digital Transformation'],
    sectors: ['Healthcare', 'Fintech'],
    available: true,
    rating: 4.9,
    image: 'https://d64gsuwffb70l.cloudfront.net/68b92e76ce9844a030a6f1e1_1756969762058_d8c3a457.webp',
    bio: 'Led digital transformation initiatives at Fortune 500 companies...'
  },
  {
    id: 2,
    name: 'Michael Rodriguez',
    title: 'Former CFO',
    location: 'New York, NY',
    expertise: ['Financial Planning', 'Risk Management'],
    sectors: ['Banking', 'Real Estate'],
    available: true,
    rating: 4.8,
    image: 'https://d64gsuwffb70l.cloudfront.net/68b92e76ce9844a030a6f1e1_1756969763774_4a5591b3.webp',
    bio: 'Managed financial operations for multinational corporations...'
  }
];

interface ExpertBrowserProps {
  onExpertSelect: (expert: any) => void;
}

const ExpertBrowser: React.FC<ExpertBrowserProps> = ({ onExpertSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expertiseFilter, setExpertiseFilter] = useState('');
  const [regionFilter, setRegionFilter] = useState('');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Find Expert Consultants</h1>
        <p className="text-lg text-gray-600">Connect with experienced professionals for your projects</p>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder="Search experts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select value={expertiseFilter} onValueChange={setExpertiseFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Expertise Area" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="technology">Technology</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
            </SelectContent>
          </Select>
          <Select value={regionFilter} onValueChange={setRegionFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="west-coast">West Coast</SelectItem>
              <SelectItem value="east-coast">East Coast</SelectItem>
              <SelectItem value="remote">Remote</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">Apply Filters</Button>
        </div>
      </div>

      {/* Expert Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockExperts.map((expert) => (
          <Card key={expert.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <img
                  src={expert.image}
                  alt={expert.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">{expert.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{expert.title}</p>
                  <p className="text-sm text-gray-500 mb-3">{expert.location}</p>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {expert.expertise.slice(0, 2).map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-yellow-500">★</span>
                      <span className="text-sm text-gray-600 ml-1">{expert.rating}</span>
                    </div>
                    <Badge variant={expert.available ? "default" : "secondary"}>
                      {expert.available ? 'Available' : 'Busy'}
                    </Badge>
                  </div>
                  
                  <Button 
                    className="w-full mt-4" 
                    size="sm"
                    onClick={() => onExpertSelect(expert)}
                  >
                    View Profile
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ExpertBrowser;