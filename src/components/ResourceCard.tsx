
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Download, Play, FileText } from 'lucide-react';

interface ResourceCardProps {
  title: string;
  description: string;
  type: string;
  tag: string;
  icon?: React.ReactNode;
  onView?: () => void;
}

const ResourceCard = ({ title, description, type, tag, icon, onView }: ResourceCardProps) => {
  const getTagColor = (tag: string) => {
    switch (tag) {
      case 'Essential': return 'bg-gradient-to-r from-accent-patriotic to-red-500 text-white shadow-lg';
      case 'Popular': return 'bg-gradient-to-r from-primary-bright to-blue-500 text-white shadow-lg';
      case 'Expert': return 'bg-gradient-to-r from-primary-dark to-indigo-600 text-white shadow-lg';
      case 'Free': return 'bg-gradient-to-r from-success to-green-500 text-white shadow-lg';
      case 'New': return 'bg-gradient-to-r from-warning to-orange-500 text-white shadow-lg';
      case 'Local': return 'bg-gradient-to-r from-secondary-soft to-cyan-400 text-text-primary shadow-lg';
      default: return 'bg-gradient-to-r from-surface-soft to-gray-300 text-text-secondary shadow-lg';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf guide':
      case 'guide':
        return <FileText className="h-4 w-4" />;
      case 'video':
      case 'video series':
        return <Play className="h-4 w-4" />;
      case 'webinar':
        return <ExternalLink className="h-4 w-4" />;
      default:
        return <Download className="h-4 w-4" />;
    }
  };

  return (
    <Card className="vibrant-card group cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg group-hover:text-primary-bright group-hover:text-glow transition-all">
              {title}
            </CardTitle>
            <CardDescription className="mt-1">{description}</CardDescription>
          </div>
          <Badge className={getTagColor(tag)} variant="secondary">
            {tag}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-text-secondary">
            {getTypeIcon(type)}
            <span className="text-sm">{type}</span>
          </div>
          <Button 
            size="sm" 
            variant="outline"
            onClick={onView}
            className="opacity-0 group-hover:opacity-100 transition-all border-glow hover:bg-primary-bright hover:text-white glow-button"
          >
            View
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResourceCard;
