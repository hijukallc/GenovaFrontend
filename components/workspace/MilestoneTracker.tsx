import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, Plus, Calendar } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Milestone {
  id: string;
  title: string;
  description: string;
  due_date: string;
  status: 'pending' | 'in_progress' | 'completed';
  completed_at: string | null;
}

interface MilestoneTrackerProps {
  projectId: string;
  canEdit?: boolean;
}

export const MilestoneTracker: React.FC<MilestoneTrackerProps> = ({ projectId, canEdit = false }) => {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMilestone, setNewMilestone] = useState({
    title: '',
    description: '',
    due_date: ''
  });

  const loadMilestones = async () => {
    const { data } = await supabase
      .from('project_milestones')
      .select('*')
      .eq('project_id', projectId)
      .order('due_date', { ascending: true });
    
    if (data) setMilestones(data);
  };

  const addMilestone = async () => {
    if (!newMilestone.title.trim()) return;

    const { error } = await supabase
      .from('project_milestones')
      .insert({
        project_id: projectId,
        ...newMilestone
      });

    if (!error) {
      setNewMilestone({ title: '', description: '', due_date: '' });
      setShowAddForm(false);
      loadMilestones();
    }
  };

  const updateMilestoneStatus = async (milestoneId: string, status: string) => {
    const updates: any = { status };
    if (status === 'completed') {
      updates.completed_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from('project_milestones')
      .update(updates)
      .eq('id', milestoneId);

    if (!error) loadMilestones();
  };

  useEffect(() => {
    loadMilestones();
  }, [projectId]);

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'secondary',
      in_progress: 'default',
      completed: 'default'
    } as const;

    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800'
    };

    return (
      <Badge className={colors[status as keyof typeof colors]}>
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Project Milestones
          </CardTitle>
          {canEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddForm(!showAddForm)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Milestone
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {showAddForm && (
          <div className="p-4 border rounded-lg space-y-3">
            <Input
              placeholder="Milestone title"
              value={newMilestone.title}
              onChange={(e) => setNewMilestone(prev => ({ ...prev, title: e.target.value }))}
            />
            <Textarea
              placeholder="Description (optional)"
              value={newMilestone.description}
              onChange={(e) => setNewMilestone(prev => ({ ...prev, description: e.target.value }))}
            />
            <Input
              type="date"
              value={newMilestone.due_date}
              onChange={(e) => setNewMilestone(prev => ({ ...prev, due_date: e.target.value }))}
            />
            <div className="flex gap-2">
              <Button onClick={addMilestone} size="sm">Add</Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)} size="sm">Cancel</Button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {milestones.map((milestone) => (
            <div key={milestone.id} className="flex items-start gap-3 p-3 border rounded-lg">
              <button
                onClick={() => updateMilestoneStatus(
                  milestone.id,
                  milestone.status === 'completed' ? 'pending' : 'completed'
                )}
                disabled={!canEdit}
              >
                {milestone.status === 'completed' ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <Circle className="h-5 w-5 text-gray-400" />
                )}
              </button>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium">{milestone.title}</h4>
                  {getStatusBadge(milestone.status)}
                </div>
                {milestone.description && (
                  <p className="text-sm text-gray-600 mb-2">{milestone.description}</p>
                )}
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar className="h-3 w-3" />
                  Due: {new Date(milestone.due_date).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>

        {milestones.length === 0 && (
          <p className="text-center text-gray-500 py-8">No milestones yet. Add one to get started!</p>
        )}
      </CardContent>
    </Card>
  );
};