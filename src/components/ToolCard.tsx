
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
    <Card className="vibrant-card group cursor-pointer animate-fade-in">
      <CardContent className="p-6 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary-bright/20 to-accent-patriotic/20 rounded-lg flex items-center justify-center text-primary-bright group-hover:from-primary-bright group-hover:to-accent-patriotic group-hover:text-white transition-all duration-300 shadow-lg">
          {icon}
        </div>
        <h3 className="font-semibold text-text-primary mb-2 group-hover:text-glow transition-all">{title}</h3>
        <p className="text-sm text-text-secondary mb-4">{description}</p>
        <Button 
          className="w-full bg-primary-bright hover:bg-primary-dark text-white glow-button"
          onClick={onClick}
        >
          {action}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ToolCard;
