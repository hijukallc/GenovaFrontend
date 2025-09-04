import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, CheckCircle, XCircle, Eye } from 'lucide-react';
import { ReviewModerationPanel } from '../reviews/ReviewModerationPanel';

export const ModerationPanel: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Content Moderation Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-red-600">3</div>
              <div className="text-sm text-gray-600">Flagged Reviews</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">2</div>
              <div className="text-sm text-gray-600">Disputed Content</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">15</div>
              <div className="text-sm text-gray-600">Resolved Today</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <ReviewModerationPanel />
    </div>
  );
};