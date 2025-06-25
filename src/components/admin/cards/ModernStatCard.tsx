
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';

interface ModernStatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    direction: 'up' | 'down' | 'neutral';
  };
  description?: string;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
}

export const ModernStatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  description,
  color = 'blue' 
}: ModernStatCardProps) => {
  const colorStyles = {
    blue: {
      gradient: 'from-blue-500 to-blue-600',
      bg: 'from-blue-50 to-blue-100',
      text: 'text-blue-700'
    },
    green: {
      gradient: 'from-green-500 to-green-600',
      bg: 'from-green-50 to-green-100',
      text: 'text-green-700'
    },
    purple: {
      gradient: 'from-purple-500 to-purple-600',
      bg: 'from-purple-50 to-purple-100',
      text: 'text-purple-700'
    },
    orange: {
      gradient: 'from-orange-500 to-orange-600',
      bg: 'from-orange-50 to-orange-100',
      text: 'text-orange-700'
    },
    red: {
      gradient: 'from-red-500 to-red-600',
      bg: 'from-red-50 to-red-100',
      text: 'text-red-700'
    }
  };

  const style = colorStyles[color];

  return (
    <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
      <div className={`absolute inset-0 bg-gradient-to-br ${style.bg} opacity-50`}></div>
      <CardContent className="relative p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-r ${style.gradient} text-white shadow-lg`}>
            <Icon className="h-6 w-6" />
          </div>
          {trend && (
            <Badge 
              variant="secondary" 
              className={`${
                trend.direction === 'up' ? 'bg-green-100 text-green-700' : 
                trend.direction === 'down' ? 'bg-red-100 text-red-700' : 
                'bg-gray-100 text-gray-700'
              }`}
            >
              {trend.value}
            </Badge>
          )}
        </div>
        
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {description && (
            <p className="text-xs text-gray-500">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
