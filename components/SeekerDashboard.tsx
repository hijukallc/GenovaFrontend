import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProjectManager } from './seeker/ProjectManager';
import { AIExpertSelector } from './ai/AIExpertSelector';
import { PromptBuilder } from './ai/PromptBuilder';
import { AIChatFacilitator } from './ai/AIChatFacilitator';
import { FolderOpen, Search, MessageSquare, Star, Brain } from 'lucide-react';

export const SeekerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('projects');
  const [projectDescription, setProjectDescription] = useState('');
  const [selectedExpert, setSelectedExpert] = useState(null);
  
  const mockUser = {
    id: '1',
    name: 'Demo Seeker',
    role: 'seeker' as const
  };

  const handleExpertSelect = (expert: any) => {
    setSelectedExpert(expert);
    console.log('Selected expert:', expert);
  };

  const handlePromptGenerated = (prompt: string) => {
    setProjectDescription(prompt);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Seeker Dashboard</h1>
        <p className="text-gray-600">Manage your projects and find expert professionals</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="projects" className="flex items-center gap-2">
            <FolderOpen className="h-4 w-4" />
            Projects
          </TabsTrigger>
          <TabsTrigger value="experts" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Find Experts
          </TabsTrigger>
          <TabsTrigger value="ai-tools" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            AI Tools
          </TabsTrigger>
          <TabsTrigger value="messages" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Messages
          </TabsTrigger>
          <TabsTrigger value="reviews" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Reviews
          </TabsTrigger>
        </TabsList>

        <TabsContent value="projects">
          <ProjectManager 
            userId={mockUser.id}
            userName={mockUser.name}
            userRole={mockUser.role}
          />
        </TabsContent>

        <TabsContent value="experts">
          <div className="space-y-6">
            <PromptBuilder 
              onPromptGenerated={handlePromptGenerated}
              initialPrompt={projectDescription}
            />
            {projectDescription && (
              <AIExpertSelector 
                projectDescription={projectDescription}
                onExpertSelect={handleExpertSelect}
              />
            )}
          </div>
        </TabsContent>

        <TabsContent value="ai-tools">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <PromptBuilder 
                onPromptGenerated={handlePromptGenerated}
                initialPrompt={projectDescription}
              />
            </div>
            <div>
              <AIChatFacilitator 
                context="workspace"
                userId={mockUser.id}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="messages">
          <Card>
            <CardHeader>
              <CardTitle>Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">No messages yet. Start a project to communicate with experts.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews">
          <Card>
            <CardHeader>
              <CardTitle>My Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">No reviews yet. Complete a project to leave a review.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
