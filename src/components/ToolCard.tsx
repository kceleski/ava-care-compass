
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ToolCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  action: string;
  onClick?: () => void;
}

const ToolCard = ({ title, description, icon, action, onClick }: ToolCardProps) => {
  return (
    <Card className="group hover:shadow-lg transition-all hover:scale-105 cursor-pointer animate-fade-in">
      <CardContent className="p-6 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-primary-bright/10 rounded-lg flex items-center justify-center text-primary-bright group-hover:bg-primary-bright group-hover:text-white transition-all">
          {icon}
        </div>
        <h3 className="font-semibold text-text-primary mb-2">{title}</h3>
        <p className="text-sm text-text-secondary mb-4">{description}</p>
        <Button 
          className="w-full bg-sky-500 hover:bg-sky-600 text-white"
          onClick={onClick}
        >
          {action}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ToolCard;
