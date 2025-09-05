import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, AlertCircle, TrendingDown, Users, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Alert {
  id: string;
  alertType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  isRead: boolean;
  createdAt: string;
}

export const AlertSystem: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      alertType: 'inactivity',
      severity: 'medium',
      title: 'Expert Inactivity Alert',
      description: '15 experts have been inactive for over 30 days',
      isRead: false,
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      alertType: 'low_engagement',
      severity: 'high',
      title: 'Low Engagement Rate',
      description: 'Platform engagement dropped by 25% this week',
      isRead: false,
      createdAt: '2024-01-15T09:15:00Z'
    },
    {
      id: '3',
      alertType: 'anomaly',
      severity: 'critical',
      title: 'Revenue Anomaly Detected',
      description: 'Unusual spike in refund requests detected',
      isRead: true,
      createdAt: '2024-01-14T16:45:00Z'
    }
  ]);

  const markAsRead = async (alertId: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId ? { ...alert, isRead: true } : alert
      )
    );
  };

  const getSeverityColor = (severity: string) => {
    const colors = {
      low: 'bg-blue-100 text-blue-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800'
    };
    return colors[severity as keyof typeof colors] || colors.medium;
  };

  const getAlertIcon = (type: string) => {
    const icons = {
      inactivity: Users,
      low_engagement: TrendingDown,
      anomaly: AlertCircle
    };
    const IconComponent = icons[type as keyof typeof icons] || AlertCircle;
    return <IconComponent className="h-4 w-4" />;
  };

  const unreadCount = alerts.filter(alert => !alert.isRead).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            System Alerts
          </div>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="ml-2">
              {unreadCount} new
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {alerts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
            <p>No active alerts</p>
          </div>
        ) : (
          alerts.map(alert => (
            <div 
              key={alert.id} 
              className={`border rounded-lg p-4 ${!alert.isRead ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getAlertIcon(alert.alertType)}
                  <span className="font-medium">{alert.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getSeverityColor(alert.severity)}>
                    {alert.severity}
                  </Badge>
                  {!alert.isRead && (
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => markAsRead(alert.id)}
                    >
                      Mark Read
                    </Button>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-2">{alert.description}</p>
              <p className="text-xs text-gray-500">
                {new Date(alert.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};