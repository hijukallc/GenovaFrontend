import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Star, TrendingUp, TrendingDown, Minus, Brain } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface ReviewSummary {
  overall_rating: number;
  total_reviews: number;
  sentiment_analysis: {
    positive: number;
    neutral: number;
    negative: number;
  };
  key_strengths: string[];
  areas_for_improvement: string[];
  common_themes: string[];
  summary_text: string;
}

interface AIReviewSummarizerProps {
  expertId: string;
  reviews?: any[];
}

export function AIReviewSummarizer({ expertId, reviews = [] }: AIReviewSummarizerProps) {
  const [summary, setSummary] = useState<ReviewSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const generateSummary = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-actions', {
        body: {
          action: 'summarize_reviews',
          expert_id: expertId,
          reviews: reviews
        }
      });

      if (error) throw error;
      setSummary(data.summary);
    } catch (error) {
      console.error('Error generating review summary:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (expertId && reviews.length > 0) {
      generateSummary();
    }
  }, [expertId, reviews]);

  if (!summary && !loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Brain className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600 mb-4">No reviews available for AI analysis</p>
          <Button onClick={generateSummary} disabled={reviews.length === 0}>
            Generate Summary
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2">
            <Brain className="h-6 w-6 animate-pulse text-blue-600" />
            <span>AI is analyzing reviews...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-blue-600" />
            <span>AI Review Summary</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? 'Show Less' : 'Show More'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Rating */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${
                    star <= summary!.overall_rating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-lg font-semibold">{summary!.overall_rating.toFixed(1)}</span>
          </div>
          <span className="text-sm text-gray-600">
            Based on {summary!.total_reviews} reviews
          </span>
        </div>

        {/* Sentiment Analysis */}
        <div>
          <h4 className="font-medium mb-3">Sentiment Analysis</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm">Positive</span>
              </div>
              <span className="text-sm font-medium">
                {summary!.sentiment_analysis.positive}%
              </span>
            </div>
            <Progress value={summary!.sentiment_analysis.positive} className="h-2" />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Minus className="h-4 w-4 text-yellow-600" />
                <span className="text-sm">Neutral</span>
              </div>
              <span className="text-sm font-medium">
                {summary!.sentiment_analysis.neutral}%
              </span>
            </div>
            <Progress value={summary!.sentiment_analysis.neutral} className="h-2" />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingDown className="h-4 w-4 text-red-600" />
                <span className="text-sm">Negative</span>
              </div>
              <span className="text-sm font-medium">
                {summary!.sentiment_analysis.negative}%
              </span>
            </div>
            <Progress value={summary!.sentiment_analysis.negative} className="h-2" />
          </div>
        </div>

        {/* AI Summary Text */}
        <div>
          <h4 className="font-medium mb-2">AI Summary</h4>
          <p className="text-sm text-gray-700 leading-relaxed">
            {summary!.summary_text}
          </p>
        </div>

        {expanded && (
          <>
            {/* Key Strengths */}
            <div>
              <h4 className="font-medium mb-3">Key Strengths</h4>
              <div className="flex flex-wrap gap-2">
                {summary!.key_strengths.map((strength, index) => (
                  <Badge key={index} variant="secondary" className="bg-green-100 text-green-800">
                    {strength}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Areas for Improvement */}
            {summary!.areas_for_improvement.length > 0 && (
              <div>
                <h4 className="font-medium mb-3">Areas for Improvement</h4>
                <div className="flex flex-wrap gap-2">
                  {summary!.areas_for_improvement.map((area, index) => (
                    <Badge key={index} variant="secondary" className="bg-yellow-100 text-yellow-800">
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Common Themes */}
            <div>
              <h4 className="font-medium mb-3">Common Themes</h4>
              <div className="flex flex-wrap gap-2">
                {summary!.common_themes.map((theme, index) => (
                  <Badge key={index} variant="outline">
                    {theme}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}

        <Button onClick={generateSummary} variant="outline" size="sm" disabled={loading}>
          <Brain className="h-4 w-4 mr-2" />
          Refresh Analysis
        </Button>
      </CardContent>
    </Card>
  );
}