
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
      case 'Essential': return 'bg-accent-patriotic text-white';
      case 'Popular': return 'bg-primary-bright text-white';
      case 'Expert': return 'bg-primary-dark text-white';
      case 'Free': return 'bg-success text-white';
      case 'New': return 'bg-warning text-white';
      case 'Local': return 'bg-secondary-soft text-text-primary';
      default: return 'bg-surface-soft text-text-secondary';
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
    <Card className="hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg group-hover:text-primary-bright transition-colors">
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
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            View
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResourceCard;
