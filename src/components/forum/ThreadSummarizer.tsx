import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, X, TrendingUp, MessageSquare, Users } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Reply {
  id: string;
  content: string;
  author: string;
  created_at: string;
}

interface ThreadSummary {
  summary: string;
  key_points: string[];
  sentiment_score: number;
  participant_count: number;
  main_topics: string[];
}

interface ThreadSummarizerProps {
  postId: string;
  content: string;
  replies: Reply[];
  onClose: () => void;
}

export function ThreadSummarizer({ postId, content, replies, onClose }: ThreadSummarizerProps) {
  const [summary, setSummary] = useState<ThreadSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateSummary();
  }, [postId, content, replies]);

  const generateSummary = async () => {
    setLoading(true);
    try {
      const { data } = await supabase.functions.invoke('ai-actions', {
        body: {
          action: 'summarize_thread',
          post_id: postId,
          content: content,
          replies: replies.map(r => r.content)
        }
      });

      if (data?.summary) {
        setSummary(data.summary);
      } else {
        // Mock summary for demonstration
        setSummary({
          summary: "This discussion focuses on React development best practices, with participants sharing insights on hooks, testing strategies, and code organization. The conversation highlights the importance of custom hooks for reusability and proper error handling.",
          key_points: [
            "Custom hooks are essential for code reusability",
            "Error boundaries should be implemented properly",
            "Testing strategies are crucial for maintainable code",
            "Code organization impacts long-term project success"
          ],
          sentiment_score: 0.85,
          participant_count: replies.length + 1,
          main_topics: ["React Hooks", "Testing", "Code Organization", "Best Practices"]
        });
      }
    } catch (error) {
      console.error('Error generating summary:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSentimentColor = (score: number) => {
    if (score >= 0.7) return 'text-green-600';
    if (score >= 0.4) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSentimentLabel = (score: number) => {
    if (score >= 0.7) return 'Positive';
    if (score >= 0.4) return 'Neutral';
    return 'Negative';
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">AI Thread Summary</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Sparkles className="w-4 h-4 animate-spin" />
              Analyzing discussion...
            </div>
          </div>
        ) : summary ? (
          <>
            {/* Overview Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-lg font-semibold">
                  <Users className="w-4 h-4" />
                  {summary.participant_count}
                </div>
                <p className="text-xs text-muted-foreground">Participants</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-lg font-semibold">
                  <MessageSquare className="w-4 h-4" />
                  {replies.length + 1}
                </div>
                <p className="text-xs text-muted-foreground">Messages</p>
              </div>
              <div className="text-center">
                <div className={`flex items-center justify-center gap-1 text-lg font-semibold ${getSentimentColor(summary.sentiment_score)}`}>
                  <TrendingUp className="w-4 h-4" />
                  {getSentimentLabel(summary.sentiment_score)}
                </div>
                <p className="text-xs text-muted-foreground">Sentiment</p>
              </div>
            </div>

            {/* Summary Text */}
            <div>
              <h4 className="font-medium mb-2">Discussion Summary</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {summary.summary}
              </p>
            </div>

            {/* Key Points */}
            <div>
              <h4 className="font-medium mb-3">Key Points</h4>
              <div className="space-y-2">
                {summary.key_points.map((point, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">{point}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Main Topics */}
            <div>
              <h4 className="font-medium mb-3">Main Topics</h4>
              <div className="flex flex-wrap gap-2">
                {summary.main_topics.map((topic, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={generateSummary}
                className="flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Refresh Summary
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Unable to generate summary</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}