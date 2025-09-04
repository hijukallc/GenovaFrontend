import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface Inquiry {
  id: string;
  project_title: string;
  project_description: string;
  budget_range: string;
  timeline: string;
  status: string;
  created_at: string;
  seeker_id: string;
}

export const InquiryManager: React.FC = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<string | null>(null);
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInquiries();
    
    // Subscribe to real-time updates
    const subscription = supabase
      .channel('inquiries_updates')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'inquiries' },
        () => fetchInquiries()
      )
      .subscribe();

    return () => subscription.unsubscribe();
  }, []);

  const fetchInquiries = async () => {
    try {
      const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setInquiries(data || []);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateInquiryStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('inquiries')
        .update({ status })
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error updating inquiry:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'declined': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Inquiries ({inquiries.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {inquiries.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No inquiries yet</p>
          ) : (
            inquiries.map((inquiry) => (
              <div key={inquiry.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{inquiry.project_title}</h3>
                  <Badge className={getStatusColor(inquiry.status)}>
                    {inquiry.status}
                  </Badge>
                </div>
                
                <p className="text-gray-600 text-sm mb-2">{inquiry.project_description}</p>
                
                <div className="flex gap-4 text-xs text-gray-500 mb-3">
                  <span>Budget: {inquiry.budget_range}</span>
                  <span>Timeline: {inquiry.timeline}</span>
                </div>
                
                {inquiry.status === 'pending' && (
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => updateInquiryStatus(inquiry.id, 'accepted')}
                    >
                      Accept
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => updateInquiryStatus(inquiry.id, 'declined')}
                    >
                      Decline
                    </Button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};