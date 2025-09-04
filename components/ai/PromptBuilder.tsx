import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Lightbulb, Wand2, Copy, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface PromptSuggestion {
  category: string;
  suggestions: string[];
}

interface PromptBuilderProps {
  onPromptGenerated: (prompt: string) => void;
  initialPrompt?: string;
}

export function PromptBuilder({ onPromptGenerated, initialPrompt = '' }: PromptBuilderProps) {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [projectType, setProjectType] = useState('');
  const [budget, setBudget] = useState('');
  const [timeline, setTimeline] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<PromptSuggestion[]>([]);
  const [copied, setCopied] = useState(false);

  const projectTypes = [
    'Web Development',
    'Mobile App',
    'Data Analysis',
    'Marketing Campaign',
    'Content Creation',
    'Business Strategy',
    'Design Project',
    'Research Study'
  ];

  const budgetRanges = [
    'Under $500',
    '$500 - $2,000',
    '$2,000 - $5,000',
    '$5,000 - $10,000',
    'Over $10,000'
  ];

  const timelineOptions = [
    'Less than 1 week',
    '1-2 weeks',
    '2-4 weeks',
    '1-2 months',
    '2-3 months',
    'More than 3 months'
  ];

  const generatePromptSuggestions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-actions', {
        body: {
          action: 'generate_prompt_suggestions',
          project_type: projectType,
          budget,
          timeline,
          current_prompt: prompt
        }
      });

      if (error) throw error;
      setSuggestions(data.suggestions || []);
    } catch (error) {
      console.error('Error generating suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const enhancePrompt = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-actions', {
        body: {
          action: 'enhance_prompt',
          prompt,
          project_type: projectType,
          budget,
          timeline
        }
      });

      if (error) throw error;
      setPrompt(data.enhanced_prompt || prompt);
      onPromptGenerated(data.enhanced_prompt || prompt);
    } catch (error) {
      console.error('Error enhancing prompt:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const applySuggestion = (suggestion: string) => {
    const newPrompt = prompt + (prompt ? '\n\n' : '') + suggestion;
    setPrompt(newPrompt);
    onPromptGenerated(newPrompt);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            <span>AI Prompt Builder</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Project Type</label>
              <Select value={projectType} onValueChange={setProjectType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {projectTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Budget Range</label>
              <Select value={budget} onValueChange={setBudget}>
                <SelectTrigger>
                  <SelectValue placeholder="Select budget" />
                </SelectTrigger>
                <SelectContent>
                  {budgetRanges.map((range) => (
                    <SelectItem key={range} value={range}>{range}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Timeline</label>
              <Select value={timeline} onValueChange={setTimeline}>
                <SelectTrigger>
                  <SelectValue placeholder="Select timeline" />
                </SelectTrigger>
                <SelectContent>
                  {timelineOptions.map((option) => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Project Description</label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your project requirements, goals, and expectations..."
              className="min-h-32"
            />
          </div>

          <div className="flex space-x-2">
            <Button onClick={generatePromptSuggestions} disabled={loading} variant="outline">
              <Lightbulb className="h-4 w-4 mr-2" />
              Get Suggestions
            </Button>
            <Button onClick={enhancePrompt} disabled={loading || !prompt}>
              <Wand2 className="h-4 w-4 mr-2" />
              {loading ? 'Enhancing...' : 'Enhance Prompt'}
            </Button>
            <Button onClick={copyToClipboard} disabled={!prompt} variant="outline">
              {copied ? <CheckCircle className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {suggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">AI Suggestions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {suggestions.map((category, index) => (
                <div key={index}>
                  <h4 className="font-medium mb-2">{category.category}</h4>
                  <div className="flex flex-wrap gap-2">
                    {category.suggestions.map((suggestion, suggestionIndex) => (
                      <Badge
                        key={suggestionIndex}
                        variant="outline"
                        className="cursor-pointer hover:bg-blue-50"
                        onClick={() => applySuggestion(suggestion)}
                      >
                        {suggestion}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}