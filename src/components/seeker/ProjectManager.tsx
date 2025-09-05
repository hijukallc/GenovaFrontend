import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileUpload } from '../workspace/FileUpload';
import { MilestoneTracker } from '../workspace/MilestoneTracker';
import { MessagingInterface } from './MessagingInterface';
import { FolderOpen, Users, Calendar, MessageSquare } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
  budget: number;
  deadline: string;
  expert_name?: string;
  seeker_name?: string;
}

interface ProjectManagerProps {
  userId: string;
  userName: string;
  userRole: 'expert' | 'seeker';
}

export const ProjectManager: React.FC<ProjectManagerProps> = ({
  userId,
  userName,
  userRole
}) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProjects = async () => {
    const column = userRole === 'expert' ? 'expert_id' : 'seeker_id';
    
    const { data } = await supabase
      .from('projects')
      .select(`
        *,
        expert:profiles!projects_expert_id_fkey(name),
        seeker:profiles!projects_seeker_id_fkey(name)
      `)
      .eq(column, userId)
      .order('created_at', { ascending: false });

    if (data) {
      const projectsWithNames = data.map(project => ({
        ...project,
        expert_name: project.expert?.name || 'Unknown Expert',
        seeker_name: project.seeker?.name || 'Unknown Seeker'
      }));
      setProjects(projectsWithNames);
      if (projectsWithNames.length > 0 && !selectedProject) {
        setSelectedProject(projectsWithNames[0]);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    loadProjects();
  }, [userId, userRole]);

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Project List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            My Projects
          </CardTitle>
        </CardHeader>
        <CardContent>
          {projects.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No projects yet</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <Card
                  key={project.id}
                  className={`cursor-pointer transition-colors ${
                    selectedProject?.id === project.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setSelectedProject(project)}
                >
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold truncate">{project.title}</h3>
                        <Badge className={getStatusColor(project.status)}>
                          {project.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Users className="h-3 w-3" />
                        {userRole === 'expert' ? project.seeker_name : project.expert_name}
                      </div>
                      {project.deadline && (
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Calendar className="h-3 w-3" />
                          Due: {new Date(project.deadline).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Project Workspace */}
      {selectedProject && (
        <Card>
          <CardHeader>
            <CardTitle>{selectedProject.title}</CardTitle>
            <p className="text-sm text-gray-600">{selectedProject.description}</p>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="milestones">Milestones</TabsTrigger>
                <TabsTrigger value="files">Files</TabsTrigger>
                <TabsTrigger value="chat">Chat</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-medium mb-2">Project Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <Badge className={getStatusColor(selectedProject.status)}>
                          {selectedProject.status}
                        </Badge>
                      </div>
                      {selectedProject.budget && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Budget:</span>
                          <span>${selectedProject.budget}</span>
                        </div>
                      )}
                      {selectedProject.deadline && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Deadline:</span>
                          <span>{new Date(selectedProject.deadline).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Team</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Expert:</span>
                        <span>{selectedProject.expert_name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Seeker:</span>
                        <span>{selectedProject.seeker_name}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="milestones">
                <MilestoneTracker 
                  projectId={selectedProject.id} 
                  canEdit={userRole === 'expert'} 
                />
              </TabsContent>

              <TabsContent value="files">
                <FileUpload projectId={selectedProject.id} />
              </TabsContent>

              <TabsContent value="chat">
                <MessagingInterface
                  projectId={selectedProject.id}
                  currentUserId={userId}
                  currentUserName={userName}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};