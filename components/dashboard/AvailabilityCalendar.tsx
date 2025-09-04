import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface AvailabilitySlot {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  engagement_type: string;
  is_available: boolean;
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const ENGAGEMENT_TYPES = ['Consultation', 'Mentoring', 'Project Work', 'Strategy Session'];

export const AvailabilityCalendar: React.FC = () => {
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSlot, setEditingSlot] = useState<string | null>(null);

  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    try {
      const { data, error } = await supabase
        .from('availability')
        .select('*')
        .order('day_of_week')
        .order('start_time');
      
      if (error) throw error;
      setAvailability(data || []);
    } catch (error) {
      console.error('Error fetching availability:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateAvailability = async (id: string, updates: Partial<AvailabilitySlot>) => {
    try {
      const { error } = await supabase
        .from('availability')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
      fetchAvailability();
    } catch (error) {
      console.error('Error updating availability:', error);
    }
  };

  const addTimeSlot = async (dayOfWeek: number) => {
    try {
      const { error } = await supabase
        .from('availability')
        .insert({
          day_of_week: dayOfWeek,
          start_time: '09:00',
          end_time: '17:00',
          engagement_type: 'Consultation',
          is_available: true
        });
      
      if (error) throw error;
      fetchAvailability();
    } catch (error) {
      console.error('Error adding time slot:', error);
    }
  };

  const deleteTimeSlot = async (id: string) => {
    try {
      const { error } = await supabase
        .from('availability')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      fetchAvailability();
    } catch (error) {
      console.error('Error deleting time slot:', error);
    }
  };

  if (loading) {
    return <div className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Availability Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {DAYS.map((day, dayIndex) => {
            const daySlots = availability.filter(slot => slot.day_of_week === dayIndex);
            
            return (
              <div key={dayIndex} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium">{day}</h3>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => addTimeSlot(dayIndex)}
                  >
                    Add Slot
                  </Button>
                </div>
                
                {daySlots.length === 0 ? (
                  <p className="text-gray-500 text-sm">No availability set</p>
                ) : (
                  <div className="space-y-2">
                    {daySlots.map((slot) => (
                      <div key={slot.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <div className="flex items-center space-x-4">
                          <span className="text-sm">
                            {slot.start_time} - {slot.end_time}
                          </span>
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {slot.engagement_type}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={slot.is_available}
                            onCheckedChange={(checked) => 
                              updateAvailability(slot.id, { is_available: checked })
                            }
                          />
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => deleteTimeSlot(slot.id)}
                          >
                            ×
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};