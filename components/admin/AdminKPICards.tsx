import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, MessageSquare, Star, DollarSign } from 'lucide-react';

interface KPIData {
  totalRevenue: number;
  activeExperts: number;
  totalInquiries: number;
  totalReviews: number;
  growthRate: number;
}

interface AdminKPICardsProps {
  data: KPIData;
  loading?: boolean;
}

export const AdminKPICards: React.FC<AdminKPICardsProps> = ({ data, loading }) => {
  const kpis = [
    {
      title: 'Total Revenue',
      value: `$${data.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      change: `+${data.growthRate}%`,
      changeType: 'positive' as const
    },
    {
      title: 'Active Experts',
      value: data.activeExperts.toLocaleString(),
      icon: Users,
      change: '+12%',
      changeType: 'positive' as const
    },
    {
      title: 'Total Inquiries',
      value: data.totalInquiries.toLocaleString(),
      icon: MessageSquare,
      change: '+8%',
      changeType: 'positive' as const
    },
    {
      title: 'Reviews',
      value: data.totalReviews.toLocaleString(),
      icon: Star,
      change: '+15%',
      changeType: 'positive' as const
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-4 w-4 bg-gray-200 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-12"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {kpi.title}
            </CardTitle>
            <kpi.icon className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{kpi.value}</div>
            <div className="flex items-center text-sm">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-600">{kpi.change}</span>
              <span className="text-gray-500 ml-1">vs last month</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};