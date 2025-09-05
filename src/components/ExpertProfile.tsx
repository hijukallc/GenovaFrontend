import React, { useState } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ReviewDisplay } from '@/components/reviews/ReviewDisplay';
import { AIReviewSummarizer } from '@/components/ai/AIReviewSummarizer';

interface ExpertProfileProps {
  expert: any;
  onBack: () => void;
  onInquirySent: () => void;
}

const ExpertProfile: React.FC<ExpertProfileProps> = ({ expert, onBack, onInquirySent }) => {
  const { trackEvent } = useAnalytics();
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [inquiryData, setInquiryData] = useState({
    projectTitle: '',
    description: '',
    timeline: '',
    budget: ''
  });

  const handleSubmitInquiry = () => {
    trackEvent('project_inquiry_sent', { 
      expertName: expert.name, 
      projectTitle: inquiryData.projectTitle,
      timeline: inquiryData.timeline 
    });
    // Here you would send the inquiry to the backend
    console.log('Sending inquiry:', inquiryData);
    onInquirySent();
    setShowInquiryForm(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Button variant="outline" onClick={onBack} className="mb-6">
        ← Back to Browse
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Profile */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-start space-x-6">
                <img
                  src={expert.image}
                  alt={expert.name}
                  className="w-24 h-24 rounded-full object-cover"
                />
                <div className="flex-1">
                  <CardTitle className="text-2xl">{expert.name}</CardTitle>
                  <p className="text-lg text-gray-600 mb-2">{expert.title}</p>
                  <p className="text-gray-500 mb-4">{expert.location}</p>
                  
                  <div className="flex items-center mb-4">
                    <span className="text-yellow-500 text-lg">★</span>
                    <span className="ml-1 font-medium">{expert.rating}</span>
                    <span className="ml-2 text-gray-500">(47 reviews)</span>
                  </div>
                  
                  <Badge variant={expert.available ? "default" : "secondary"}>
                    {expert.available ? 'Available for Projects' : 'Currently Busy'}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3">Biography</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {expert.bio} With over 25 years of experience in technology leadership, 
                    I have successfully guided organizations through complex digital transformations 
                    and strategic technology initiatives. My expertise spans cloud architecture, 
                    cybersecurity, and innovation management.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3">Areas of Expertise</h3>
                  <div className="flex flex-wrap gap-2">
                    {expert.expertise.map((skill: string, index: number) => (
                      <Badge key={index} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                    <Badge variant="outline">Cloud Architecture</Badge>
                    <Badge variant="outline">Team Leadership</Badge>
                    <Badge variant="outline">Strategic Planning</Badge>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3">Industry Sectors</h3>
                  <div className="flex flex-wrap gap-2">
                    {expert.sectors.map((sector: string, index: number) => (
                      <Badge key={index} variant="secondary">
                        {sector}
                      </Badge>
                    ))}
                    <Badge variant="secondary">Technology</Badge>
                    <Badge variant="secondary">Manufacturing</Badge>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3">Career Highlights</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Led $50M digital transformation at Fortune 500 company</li>
                    <li>• Managed teams of 100+ engineers and product managers</li>
                    <li>• Implemented cloud-first architecture reducing costs by 40%</li>
                    <li>• Published thought leadership articles in Harvard Business Review</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Availability</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Status:</span>
                  <Badge variant={expert.available ? "default" : "secondary"}>
                    {expert.available ? 'Available' : 'Busy'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Response Time:</span>
                  <span className="text-sm text-gray-600">Within 24 hours</span>
                </div>
                <div className="flex justify-between">
                  <span>Engagement Type:</span>
                  <span className="text-sm text-gray-600">Project-based</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button 
            className="w-full mb-4" 
            onClick={() => setShowInquiryForm(true)}
            disabled={!expert.available}
          >
            Send Project Inquiry
          </Button>
        </div>
      </div>

      {/* AI Review Summary */}
      <div className="mt-8">
        <AIReviewSummarizer expertId={expert.id} />
      </div>

      {/* Reviews Section */}
      <div className="mt-8">
        <ReviewDisplay expertId={expert.id} />
      </div>

      {/* Inquiry Modal */}
      {showInquiryForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle>Send Project Inquiry to {expert.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="projectTitle">Project Title</Label>
                <Input
                  id="projectTitle"
                  value={inquiryData.projectTitle}
                  onChange={(e) => setInquiryData({...inquiryData, projectTitle: e.target.value})}
                  placeholder="Brief project title"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Project Description</Label>
                <Textarea
                  id="description"
                  value={inquiryData.description}
                  onChange={(e) => setInquiryData({...inquiryData, description: e.target.value})}
                  placeholder="Describe your project and what kind of expertise you need..."
                  rows={4}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="timeline">Timeline</Label>
                  <Input
                    id="timeline"
                    value={inquiryData.timeline}
                    onChange={(e) => setInquiryData({...inquiryData, timeline: e.target.value})}
                    placeholder="e.g., 3 months"
                  />
                </div>
                <div>
                  <Label htmlFor="budget">Budget Range</Label>
                  <Input
                    id="budget"
                    value={inquiryData.budget}
                    onChange={(e) => setInquiryData({...inquiryData, budget: e.target.value})}
                    placeholder="e.g., $10k-20k"
                  />
                </div>
              </div>
              
              <div className="flex space-x-4 pt-4">
                <Button onClick={handleSubmitInquiry} className="flex-1">
                  Send Inquiry
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowInquiryForm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ExpertProfile;