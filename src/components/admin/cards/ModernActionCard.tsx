
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, LucideIcon } from 'lucide-react';

interface ModernActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  urgent?: boolean;
}

export const ModernActionCard = ({ 
  title, 
  description, 
  icon: Icon, 
  onClick,
  color = 'blue',
  urgent = false 
}: ModernActionCardProps) => {
  const colorStyles = {
    blue: {
      gradient: 'from-blue-500 to-blue-600',
      bg: 'from-blue-50 to-blue-100',
      hover: 'hover:from-blue-100 hover:to-blue-200'
    },
    green: {
      gradient: 'from-green-500 to-green-600',
      bg: 'from-green-50 to-green-100',
      hover: 'hover:from-green-100 hover:to-green-200'
    },
    purple: {
      gradient: 'from-purple-500 to-purple-600',
      bg: 'from-purple-50 to-purple-100',
      hover: 'hover:from-purple-100 hover:to-purple-200'
    },
    orange: {
      gradient: 'from-orange-500 to-orange-600',
      bg: 'from-orange-50 to-orange-100',
      hover: 'hover:from-orange-100 hover:to-orange-200'
    },
    red: {
      gradient: 'from-red-500 to-red-600',
      bg: 'from-red-50 to-red-100',
      hover: 'hover:from-red-100 hover:to-red-200'
    }
  };

  const style = colorStyles[color];

  return (
    <Card className={`group cursor-pointer transition-all duration-300 hover:shadow-lg border-0 bg-gradient-to-r ${style.bg} ${style.hover} ${urgent ? 'ring-2 ring-red-200' : ''}`}>
      <CardContent className="p-6" onClick={onClick}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`p-3 bg-gradient-to-br ${style.gradient} rounded-xl text-white shadow-md`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
                {title}
              </h3>
              <p className="text-sm text-gray-600 mt-1">{description}</p>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
        </div>
      </CardContent>
    </Card>
  );
};
