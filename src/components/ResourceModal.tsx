
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, ExternalLink, Play, FileText } from 'lucide-react';

interface ResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  resource: {
    title: string;
    description: string;
    type: string;
    tag: string;
  } | null;
}

const ResourceModal = ({ isOpen, onClose, resource }: ResourceModalProps) => {
  if (!resource) return null;

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf guide':
      case 'guide':
        return <FileText className="h-5 w-5" />;
      case 'video':
      case 'video series':
        return <Play className="h-5 w-5" />;
      case 'webinar':
        return <ExternalLink className="h-5 w-5" />;
      default:
        return <Download className="h-5 w-5" />;
    }
  };

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

  const getResourceContent = (title: string) => {
    // Sample content based on the resource title
    const contentMap: Record<string, string> = {
      "How to Choose the Right Care Level": `
This comprehensive guide will help you determine the appropriate level of care for your loved one.

**Assessment Areas:**
• Daily living activities (bathing, dressing, eating)
• Mobility and fall risk
• Cognitive function and memory
• Medical needs and medication management
• Social engagement and emotional wellbeing

**Care Level Options:**
1. **Independent Living** - For active seniors who need minimal assistance
2. **Assisted Living** - For those who need help with daily activities
3. **Memory Care** - Specialized care for dementia and Alzheimer's
4. **Skilled Nursing** - 24/7 medical care and supervision

**Next Steps:**
Contact our care specialists for a personalized assessment and recommendations.
      `,
      "Understanding Memory Care Options": `
Memory care provides specialized support for individuals with Alzheimer's disease, dementia, and other cognitive impairments.

**What Makes Memory Care Different:**
• Secure, structured environments designed for safety
• Specialized staff training in dementia care
• Therapeutic activities and programs
• 24/7 supervision and support

**Types of Memory Care:**
• Dedicated memory care communities
• Memory care wings in assisted living
• Alzheimer's-specific programs
• In-home memory care services

**Choosing the Right Program:**
Consider location, staff ratios, activities, and family involvement opportunities.
      `,
      "Financial Planning for Senior Care": `
Understanding the costs and payment options for senior care is crucial for planning.

**Average Monthly Costs (2024):**
• Independent Living: $2,500 - $4,500
• Assisted Living: $4,000 - $7,000
• Memory Care: $5,500 - $8,500
• Skilled Nursing: $8,000 - $12,000

**Payment Options:**
• Private pay and savings
• Long-term care insurance
• Veterans benefits
• Medicaid (for qualifying individuals)
• Life insurance conversions

**Financial Planning Tips:**
Start planning early, consider insurance options, and explore all available benefits.
      `
    };

    return contentMap[title] || `
This is a detailed resource about "${title}".

In a full implementation, this would contain comprehensive information, guides, videos, or interactive content specific to this resource.

The content would be dynamically loaded from your content management system or database, providing users with valuable, actionable information about senior care topics.

For more information, please contact our care specialists who can provide personalized guidance.
    `;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <DialogTitle className="text-2xl mb-2">{resource.title}</DialogTitle>
              <DialogDescription className="text-base">
                {resource.description}
              </DialogDescription>
            </div>
            <Badge className={getTagColor(resource.tag)} variant="secondary">
              {resource.tag}
            </Badge>
          </div>
          
          <div className="flex items-center space-x-2 text-text-secondary mb-6">
            {getTypeIcon(resource.type)}
            <span>{resource.type}</span>
          </div>
        </DialogHeader>

        <div className="prose prose-lg max-w-none">
          <div className="whitespace-pre-line text-text-primary leading-relaxed">
            {getResourceContent(resource.title)}
          </div>
        </div>

        <div className="flex items-center justify-between pt-6 border-t">
          <div className="flex items-center space-x-4">
            <Button className="bg-primary-bright hover:bg-primary-dark">
              <Download className="mr-2 h-4 w-4" />
              Download Resource
            </Button>
            <Button variant="outline">
              <ExternalLink className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResourceModal;
