import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Flag, Eye, Trash2, CheckCircle, AlertTriangle, MessageCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface FlaggedContent {
  id: string;
  type: 'post' | 'reply';
  title?: string;
  content: string;
  author: string;
  flagged_by: string;
  reason: string;
  created_at: string;
  flagged_at: string;
  status: 'pending' | 'approved' | 'removed';
}

export function ModerationPanel() {
  const [flaggedContent, setFlaggedContent] = useState<FlaggedContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    loadFlaggedContent();
  }, []);

  const loadFlaggedContent = async () => {
    try {
      // Mock flagged content data
      const mockData: FlaggedContent[] = [
        {
          id: '1',
          type: 'post',
          title: 'Inappropriate marketing post',
          content: 'This is clearly spam content promoting unrelated services...',
          author: 'SpamUser123',
          flagged_by: 'CommunityMember',
          reason: 'Spam/Self-promotion',
          created_at: '2024-01-15T10:00:00Z',
          flagged_at: '2024-01-15T11:00:00Z',
          status: 'pending'
        },
        {
          id: '2',
          type: 'reply',
          content: 'This reply contains offensive language and personal attacks...',
          author: 'AngryUser',
          flagged_by: 'ModeratorAlert',
          reason: 'Harassment/Abuse',
          created_at: '2024-01-15T09:00:00Z',
          flagged_at: '2024-01-15T10:30:00Z',
          status: 'pending'
        }
      ];
      
      setFlaggedContent(mockData);
    } catch (error) {
      console.error('Error loading flagged content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleModeration = async (contentId: string, action: 'approve' | 'remove') => {
    try {
      const { data } = await supabase.functions.invoke('forum-actions', {
        body: {
          action: 'moderate_content',
          content_id: contentId,
          moderation_action: action
        }
      });

      // Update local state
      setFlaggedContent(prev => 
        prev.map(item => 
          item.id === contentId 
            ? { ...item, status: action === 'approve' ? 'approved' : 'removed' }
            : item
        )
      );
    } catch (error) {
      console.error('Error moderating content:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'removed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getReasonIcon = (reason: string) => {
    if (reason.includes('Spam')) return <MessageCircle className="w-4 h-4" />;
    if (reason.includes('Harassment')) return <AlertTriangle className="w-4 h-4" />;
    return <Flag className="w-4 h-4" />;
  };

  const filteredContent = flaggedContent.filter(item => {
    if (activeTab === 'all') return true;
    return item.status === activeTab;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Content Moderation</h1>
          <p className="text-muted-foreground">Review and moderate flagged forum content</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Flag className="w-3 h-3" />
            {flaggedContent.filter(item => item.status === 'pending').length} Pending
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="removed">Removed</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {loading ? (
            <div>Loading flagged content...</div>
          ) : filteredContent.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No flagged content found</p>
              </CardContent>
            </Card>
          ) : (
            filteredContent.map(item => (
              <Card key={item.id} className="border-l-4 border-l-yellow-400">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="capitalize">
                          {item.type}
                        </Badge>
                        <Badge className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                      </div>
                      {item.title && (
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {getReasonIcon(item.reason)}
                      <span className="text-sm text-muted-foreground">{item.reason}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm line-clamp-3">{item.content}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="text-xs">
                            {item.author.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{item.author}</p>
                          <p className="text-xs text-muted-foreground">
                            Posted {new Date(item.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-xs text-muted-foreground">
                        Flagged by {item.flagged_by} on {new Date(item.flagged_at).toLocaleDateString()}
                      </div>
                    </div>

                    {item.status === 'pending' && (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleModeration(item.id, 'approve')}
                          className="flex items-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Approve
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleModeration(item.id, 'remove')}
                          className="flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Remove
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}