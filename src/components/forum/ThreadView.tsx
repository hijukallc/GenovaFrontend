import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowLeft, MessageCircle, Eye, Clock, Flag, Sparkles } from 'lucide-react';
import { ReplyComposer } from './ReplyComposer';
import { ThreadSummarizer } from './ThreadSummarizer';

interface Reply {
  id: string;
  content: string;
  author: string;
  created_at: string;
  parent_reply_id?: string;
}

interface ForumPost {
  id: string;
  title: string;
  content: string;
  category: string;
  author: string;
  replies_count: number;
  views: number;
  last_activity: string;
  created_at: string;
}

interface ThreadViewProps {
  post: ForumPost;
  onBack: () => void;
}

export function ThreadView({ post, onBack }: ThreadViewProps) {
  const [replies, setReplies] = useState<Reply[]>([]);
  const [showReplyComposer, setShowReplyComposer] = useState(false);
  const [showSummarizer, setShowSummarizer] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReplies();
  }, [post.id]);

  const loadReplies = async () => {
    try {
      // Mock replies data
      const mockReplies: Reply[] = [
        {
          id: '1',
          content: 'Great question! I\'ve been using React hooks extensively and found that custom hooks are game-changers for code reusability.',
          author: 'Alex Rodriguez',
          created_at: '2024-01-15T11:00:00Z'
        },
        {
          id: '2',
          content: 'I agree with Alex. Also, don\'t forget about proper error boundaries and testing strategies.',
          author: 'Emma Wilson',
          created_at: '2024-01-15T12:00:00Z'
        }
      ];
      
      setReplies(mockReplies);
    } catch (error) {
      console.error('Error loading replies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReplySubmit = async (content: string) => {
    try {
      // Create new reply
      const newReply: Reply = {
        id: Date.now().toString(),
        content,
        author: 'Current User',
        created_at: new Date().toISOString()
      };
      
      setReplies(prev => [...prev, newReply]);
      setShowReplyComposer(false);
    } catch (error) {
      console.error('Error submitting reply:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Forum
        </Button>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSummarizer(!showSummarizer)}
            className="flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            AI Summary
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Flag className="w-4 h-4" />
            Report
          </Button>
        </div>
      </div>

      {/* AI Summarizer */}
      {showSummarizer && (
        <ThreadSummarizer 
          postId={post.id} 
          content={post.content}
          replies={replies}
          onClose={() => setShowSummarizer(false)}
        />
      )}

      {/* Original Post */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <CardTitle className="text-2xl">{post.title}</CardTitle>
              <Badge variant="outline" className="capitalize w-fit">
                {post.category}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-base leading-relaxed">{post.content}</p>
          
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-3">
              <Avatar className="w-8 h-8">
                <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm">{post.author}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(post.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" />
                {post.replies_count}
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {post.views}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Replies */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            Replies ({replies.length})
          </h3>
          <Button onClick={() => setShowReplyComposer(true)}>
            Reply
          </Button>
        </div>

        {loading ? (
          <div>Loading replies...</div>
        ) : replies.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No replies yet. Be the first to respond!</p>
            </CardContent>
          </Card>
        ) : (
          replies.map(reply => (
            <Card key={reply.id}>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <p className="text-base leading-relaxed">{reply.content}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="text-xs">
                          {reply.author.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{reply.author}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(reply.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <Button variant="ghost" size="sm">
                      Reply
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Reply Composer */}
      {showReplyComposer && (
        <ReplyComposer
          onSubmit={handleReplySubmit}
          onCancel={() => setShowReplyComposer(false)}
        />
      )}
    </div>
  );
}