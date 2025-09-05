import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExpertDashboard } from './ExpertDashboard';
import { SeekerDashboard } from './SeekerDashboard';
import { AdminDashboard } from './AdminDashboard';
import { ExpertBrowser } from './ExpertBrowser';
import { OnboardingFlow } from './OnboardingFlow';
import { HeroSection } from './HeroSection';
import { AIChatFacilitator } from './ai/AIChatFacilitator';
import { ForumBrowser } from './forum/ForumBrowser';
import { ThreadView } from './forum/ThreadView';
import { ModerationPanel } from './forum/ModerationPanel';
import { Users, Star, MessageSquare, TrendingUp, Shield, Settings, Brain, Forum } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAnalytics } from '@/hooks/useAnalytics';

interface User {
  id: string;
  role: 'admin' | 'expert' | 'seeker';
  name: string;
  email: string;
}

export const AppLayout: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showLanding, setShowLanding] = useState(true);
  const [showAIChat, setShowAIChat] = useState(false);
  const [currentView, setCurrentView] = useState<'dashboard' | 'forum'>('dashboard');
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const { trackSignup, trackPageView } = useAnalytics();
  useEffect(() => {
    // Check if user is returning or new
    const hasVisited = localStorage.getItem('genova_visited');
    if (!hasVisited) {
      setShowLanding(true);
      localStorage.setItem('genova_visited', 'true');
    } else {
      setShowLanding(false);
      // Simulate user authentication - in real app, get from Supabase auth
      const mockUser: User = {
        id: '1',
        role: 'seeker', // Change to 'expert' or 'admin' to test different dashboards
        name: 'Demo User',
        email: 'user@genova.com'
      };
      setCurrentUser(mockUser);
    }
  }, []);

  const handleGetStarted = () => {
    trackSignup('unknown');
    setShowLanding(false);
    setShowOnboarding(true);
  };

  const handleCompleteOnboarding = (userData: any) => {
    setShowOnboarding(false);
    setShowLanding(false);
    setCurrentUser(prev => prev ? { ...prev, ...userData } : null);
    trackPageView('dashboard');
  };

  // Show landing page for new users
  if (showLanding) {
    return <HeroSection onGetStarted={handleGetStarted} />;
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading GENOVA...</p>
        </div>
      </div>
    );
  }

  if (showOnboarding) {
    return (
      <OnboardingFlow 
        userRole={currentUser.role}
        onComplete={handleCompleteOnboarding}
      />
    );
  }

  const renderDashboard = () => {
    switch (currentUser.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'expert':
        return <ExpertDashboard />;
      case 'seeker':
        return <SeekerDashboard />;
      default:
        return <div>Invalid user role</div>;
    }
  };
  const renderContent = () => {
    if (currentView === 'forum') {
      if (selectedPost) {
        return (
          <div className="max-w-7xl mx-auto px-6 py-8">
            <ThreadView 
              post={selectedPost}
              onBack={() => setSelectedPost(null)}
            />
          </div>
        );
      }
      
      if (currentUser.role === 'admin') {
        return (
          <div className="max-w-7xl mx-auto px-6 py-8">
            <Tabs defaultValue="browse">
              <TabsList className="mb-6">
                <TabsTrigger value="browse">Browse Forum</TabsTrigger>
                <TabsTrigger value="moderate">Moderate Content</TabsTrigger>
              </TabsList>
              <TabsContent value="browse">
                <ForumBrowser
                  onSelectPost={setSelectedPost}
                  onCreatePost={() => console.log('Create post')}
                />
              </TabsContent>
              <TabsContent value="moderate">
                <ModerationPanel />
              </TabsContent>
            </Tabs>
          </div>
        );
      }
      
      return (
        <div className="max-w-7xl mx-auto px-6 py-8">
          <ForumBrowser
            onSelectPost={setSelectedPost}
            onCreatePost={() => console.log('Create post')}
          />
        </div>
      );
    }
    
    return renderDashboard();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-6">
              <h1 className="text-2xl font-bold text-blue-600">GENOVA</h1>
              <nav className="flex items-center gap-4">
                <Button
                  variant={currentView === 'dashboard' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => {
                    setCurrentView('dashboard');
                    setSelectedPost(null);
                  }}
                  className="flex items-center gap-2"
                >
                  <Users className="h-4 w-4" />
                  Dashboard
                </Button>
                <Button
                  variant={currentView === 'forum' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => {
                    setCurrentView('forum');
                    setSelectedPost(null);
                  }}
                  className="flex items-center gap-2"
                >
                  <MessageSquare className="h-4 w-4" />
                  Community Forum
                </Button>
              </nav>
              <Badge variant="outline" className="capitalize">
                {currentUser.role}
              </Badge>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Welcome, {currentUser.name}</span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowOnboarding(true)}
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {renderContent()}
      </main>

      {/* AI Chat Assistant - Fixed Position */}
      {showAIChat && (
        <div className="fixed bottom-4 right-4 w-96 z-50">
          <div className="bg-white rounded-lg shadow-lg border">
            <div className="flex justify-between items-center p-3 border-b">
              <h3 className="font-semibold flex items-center gap-2">
                <Brain className="h-4 w-4 text-blue-600" />
                AI Assistant
              </h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowAIChat(false)}
              >
                ×
              </Button>
            </div>
            <AIChatFacilitator 
              context="general"
              userId={currentUser.id}
            />
          </div>
        </div>
      )}

      {/* AI Chat Toggle Button */}
      <Button
        className="fixed bottom-4 right-4 rounded-full w-12 h-12 shadow-lg"
        onClick={() => setShowAIChat(!showAIChat)}
        style={{ display: showAIChat ? 'none' : 'flex' }}
      >
        <Brain className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default AppLayout;