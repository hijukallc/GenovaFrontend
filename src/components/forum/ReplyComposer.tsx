import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Send, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface ReplyComposerProps {
  onSubmit: (content: string) => void;
  onCancel: () => void;
  parentReplyId?: string;
}

export function ReplyComposer({ onSubmit, onCancel, parentReplyId }: ReplyComposerProps) {
  const [content, setContent] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [showAiHelp, setShowAiHelp] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAiAssist = async () => {
    if (!content.trim()) return;
    
    setShowAiHelp(true);
    try {
      const { data } = await supabase.functions.invoke('ai-actions', {
        body: {
          action: 'improve_reply',
          content: content,
          context: 'forum_reply'
        }
      });

      if (data?.suggestions) {
        setAiSuggestions(data.suggestions);
      }
    } catch (error) {
      console.error('Error getting AI suggestions:', error);
    }
  };

  const handleSubmit = async () => {
    if (!content.trim()) return;
    
    setLoading(true);
    try {
      await onSubmit(content);
      setContent('');
      setAiSuggestions([]);
      setShowAiHelp(false);
    } catch (error) {
      console.error('Error submitting reply:', error);
    } finally {
      setLoading(false);
    }
  };

  const applySuggestion = (suggestion: string) => {
    setContent(suggestion);
    setShowAiHelp(false);
    setAiSuggestions([]);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Write a Reply</CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Share your thoughts, insights, or questions..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          className="resize-none"
        />

        {/* AI Suggestions */}
        {showAiHelp && aiSuggestions.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">AI Suggestions</span>
            </div>
            <div className="space-y-2">
              {aiSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="p-3 bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-colors"
                  onClick={() => applySuggestion(suggestion)}
                >
                  <p className="text-sm">{suggestion}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleAiAssist}
              disabled={!content.trim()}
              className="flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              AI Assist
            </Button>
            {content.length > 0 && (
              <Badge variant="outline" className="text-xs">
                {content.length} characters
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!content.trim() || loading}
              className="flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              {loading ? 'Posting...' : 'Post Reply'}
            </Button>
          </div>
        </div>

        {/* Guidelines */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Be respectful and constructive in your responses</p>
          <p>• Share specific examples and actionable insights</p>
          <p>• Use AI Assist to improve clarity and helpfulness</p>
        </div>
      </CardContent>
    </Card>
  );
}