import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MessageCircle, Eye, Clock, Plus } from 'lucide-react';
import { supabase } from '@/lib/supabase';

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

interface ForumBrowserProps {
  onSelectPost: (post: ForumPost) => void;
  onCreatePost: () => void;
}

export function ForumBrowser({ onSelectPost, onCreatePost }: ForumBrowserProps) {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadForumData();
  }, []);

  const loadForumData = async () => {
    try {
      // Load categories
      const { data: categoryData } = await supabase
        .from('forum_categories')
        .select('name');
      
      if (categoryData) {
        setCategories(['all', ...categoryData.map(c => c.name)]);
      }

      // Load posts with mock data for now
      const mockPosts: ForumPost[] = [
        {
          id: '1',
          title: 'Best practices for React development',
          content: 'What are the current best practices for React development in 2024?',
          category: 'Development',
          author: 'Sarah Chen',
          replies_count: 12,
          views: 245,
          last_activity: '2 hours ago',
          created_at: '2024-01-15T10:00:00Z'
        },
        {
          id: '2',
          title: 'Marketing strategies for startups',
          content: 'Looking for effective marketing strategies for early-stage startups.',
          category: 'Marketing',
          author: 'Mike Johnson',
          replies_count: 8,
          views: 156,
          last_activity: '4 hours ago',
          created_at: '2024-01-15T08:00:00Z'
        }
      ];
      
      setPosts(mockPosts);
    } catch (error) {
      console.error('Error loading forum data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Community Forum</h1>
          <p className="text-muted-foreground">Connect, share knowledge, and get help from experts</p>
        </div>
        <Button onClick={onCreatePost} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Post
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search discussions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map(category => (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className="cursor-pointer capitalize"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {loading ? (
          <div>Loading discussions...</div>
        ) : filteredPosts.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No discussions found</p>
            </CardContent>
          </Card>
        ) : (
          filteredPosts.map(post => (
            <Card key={post.id} className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => onSelectPost(post)}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <CardTitle className="text-lg hover:text-primary transition-colors">
                      {post.title}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {post.content}
                    </p>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {post.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>by {post.author}</span>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      {post.replies_count}
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {post.views}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {post.last_activity}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}