import React from 'react';
import { ProfileCompletionTracker } from './dashboard/ProfileCompletionTracker';
import { InquiryManager } from './dashboard/InquiryManager';
import { ReviewHistory } from './dashboard/ReviewHistory';
import { AvailabilityCalendar } from './dashboard/AvailabilityCalendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, BarChart3, User, Calendar } from 'lucide-react';

export const ExpertDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Expert Dashboard</h1>
          <p className="text-gray-600">Manage your profile, inquiries, and availability</p>
        </div>

        {/* Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Edit Profile
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              View Analytics
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Calendar View
            </Button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Completion */}
          <div className="lg:col-span-1">
            <ProfileCompletionTracker />
          </div>

          {/* Quick Stats */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">12</div>
                    <div className="text-sm text-gray-600">Active Inquiries</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">4.8</div>
                    <div className="text-sm text-gray-600">Avg Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">28</div>
                    <div className="text-sm text-gray-600">Total Reviews</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">85%</div>
                    <div className="text-sm text-gray-600">Response Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Inquiries */}
          <div className="lg:col-span-1">
            <InquiryManager />
          </div>

          {/* Reviews */}
          <div className="lg:col-span-1">
            <ReviewHistory />
          </div>

          {/* Availability */}
          <div className="lg:col-span-2">
            <AvailabilityCalendar />
          </div>
        </div>
      </div>
    </div>
  );
};