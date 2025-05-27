
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  BookOpen, 
  Heart, 
  Shield, 
  Users, 
  FileText, 
  Calculator,
  Phone,
  MapPin,
  Clock,
  Download,
  ExternalLink,
  MessageCircle,
  Send,
  Loader2
} from 'lucide-react';

const ResourcesPage = () => {
  const [avaQuery, setAvaQuery] = useState('');
  const [avaResponse, setAvaResponse] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAvaQuery = async () => {
    if (!avaQuery.trim()) return;
    
    setIsGenerating(true);
    // Simulate AI response generation
    setTimeout(() => {
      setAvaResponse(`Based on your question: "${avaQuery}", here's what I found:\n\nThis is a comprehensive response that AVA would generate based on your specific inquiry. In a full implementation, this would connect to our AI backend to provide personalized, accurate information about senior care, facility options, costs, and guidance tailored to your specific situation.\n\nWould you like me to elaborate on any specific aspect of this information?`);
      setIsGenerating(false);
    }, 2000);
  };

  const resourceCategories = [
    {
      title: "Care Planning Guides",
      icon: <BookOpen className="h-6 w-6" />,
      description: "Comprehensive guides for planning senior care",
      resources: [
        { name: "How to Choose the Right Care Level", type: "PDF Guide", tag: "Essential" },
        { name: "Understanding Memory Care Options", type: "Video Series", tag: "Popular" },
        { name: "Financial Planning for Senior Care", type: "Webinar", tag: "Free" },
        { name: "Family Care Conference Guide", type: "Checklist", tag: "New" }
      ]
    },
    {
      title: "Health & Wellness",
      icon: <Heart className="h-6 w-6" />,
      description: "Resources for maintaining health and wellbeing",
      resources: [
        { name: "Nutrition Guidelines for Seniors", type: "Article", tag: "Expert" },
        { name: "Exercise Programs for Different Mobility Levels", type: "Video", tag: "Popular" },
        { name: "Medication Management Tips", type: "Guide", tag: "Essential" },
        { name: "Mental Health and Aging", type: "Resource Kit", tag: "Free" }
      ]
    },
    {
      title: "Legal & Financial",
      icon: <Shield className="h-6 w-6" />,
      description: "Important legal and financial considerations",
      resources: [
        { name: "Power of Attorney Explained", type: "Legal Guide", tag: "Essential" },
        { name: "Medicare vs. Medicaid Coverage", type: "Comparison", tag: "Popular" },
        { name: "Estate Planning Basics", type: "Webinar", tag: "Expert" },
        { name: "Insurance Claims Process", type: "Step-by-Step", tag: "Free" }
      ]
    },
    {
      title: "Family Support",
      icon: <Users className="h-6 w-6" />,
      description: "Support and guidance for families",
      resources: [
        { name: "Having 'The Conversation'", type: "Guide", tag: "Essential" },
        { name: "Support Groups Near You", type: "Directory", tag: "Local" },
        { name: "Caregiver Self-Care", type: "Resource Kit", tag: "Popular" },
        { name: "Long-Distance Caregiving", type: "Handbook", tag: "Expert" }
      ]
    }
  ];

  const tools = [
    {
      title: "Care Cost Calculator",
      description: "Estimate monthly costs for different care options",
      icon: <Calculator className="h-8 w-8" />,
      action: "Calculate Costs"
    },
    {
      title: "Facility Finder",
      description: "Find care facilities in your area",
      icon: <MapPin className="h-8 w-8" />,
      action: "Find Facilities"
    },
    {
      title: "Care Timeline Planner",
      description: "Create a personalized care timeline",
      icon: <Clock className="h-8 w-8" />,
      action: "Plan Timeline"
    },
    {
      title: "Emergency Contacts",
      description: "24/7 support and emergency resources",
      icon: <Phone className="h-8 w-8" />,
      action: "View Contacts"
    }
  ];

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

  return (
    <div className="min-h-screen bg-background pt-24">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-bright to-primary-dark text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Senior Care Resources
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Expert guidance, tools, and support for your senior care journey
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-primary-bright hover:bg-gray-100"
              >
                <Download className="mr-2 h-5 w-5" />
                Download Care Guide
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-primary-bright"
              >
                <Phone className="mr-2 h-5 w-5" />
                Speak with Expert
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* AVA Interactive Section */}
      <section className="py-16 bg-surface-soft">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="glass-card">
              <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-bright flex items-center justify-center">
                  <img 
                    src="/lovable-uploads/3313fb44-68a6-4a0a-bd78-1fb211a5fe2f.png" 
                    alt="AVA" 
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </div>
                <CardTitle className="text-2xl text-primary-dark">Ask AVA Anything</CardTitle>
                <CardDescription className="text-lg">
                  Get personalized answers about senior care, costs, facilities, and more
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-text-primary">
                    What would you like to know about senior care?
                  </label>
                  <Textarea
                    placeholder="Ask me anything about senior care options, costs, choosing facilities, care planning, or any other questions you have..."
                    value={avaQuery}
                    onChange={(e) => setAvaQuery(e.target.value)}
                    className="min-h-[100px] resize-none"
                  />
                  <Button 
                    onClick={handleAvaQuery}
                    disabled={!avaQuery.trim() || isGenerating}
                    className="w-full bg-primary-bright hover:bg-primary-dark"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        AVA is thinking...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Ask AVA
                      </>
                    )}
                  </Button>
                </div>

                {avaResponse && (
                  <div className="p-6 bg-primary-bright/5 rounded-lg border border-primary-bright/20 animate-fade-in">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-full bg-primary-bright flex items-center justify-center flex-shrink-0">
                        <MessageCircle className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-primary-dark mb-2">AVA's Response:</h4>
                        <p className="text-text-primary whitespace-pre-line leading-relaxed">
                          {avaResponse}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                  <Button variant="outline" size="sm" onClick={() => setAvaQuery("What's the difference between assisted living and memory care?")}>
                    Care Types
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setAvaQuery("How much does senior care typically cost?")}>
                    Cost Information
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setAvaQuery("How do I choose the right facility for my parent?")}>
                    Choosing Facilities
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Resource Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text-primary mb-4">
              Resource Library
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Access our comprehensive collection of guides, tools, and expert resources
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {resourceCategories.map((category, index) => (
              <Card key={index} className="glass-card hover:shadow-lg transition-shadow animate-fade-in">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary-bright/10 rounded-lg text-primary-bright">
                      {category.icon}
                    </div>
                    <div>
                      <CardTitle className="text-xl">{category.title}</CardTitle>
                      <CardDescription>{category.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {category.resources.map((resource, resourceIndex) => (
                      <div key={resourceIndex} className="flex items-center justify-between p-3 bg-surface-soft rounded-lg hover:bg-primary-bright/5 transition-colors cursor-pointer">
                        <div className="flex-1">
                          <h4 className="font-medium text-text-primary">{resource.name}</h4>
                          <p className="text-sm text-text-secondary">{resource.type}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getTagColor(resource.tag)}>
                            {resource.tag}
                          </Badge>
                          <ExternalLink className="h-4 w-4 text-text-secondary" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-16 bg-surface-soft">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text-primary mb-4">
              Care Planning Tools
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Interactive tools to help you plan and make informed decisions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tools.map((tool, index) => (
              <Card key={index} className="glass-card hover:shadow-lg transition-all hover:scale-105 cursor-pointer animate-fade-in">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-primary-bright/10 rounded-lg flex items-center justify-center text-primary-bright">
                    {tool.icon}
                  </div>
                  <h3 className="font-semibold text-text-primary mb-2">{tool.title}</h3>
                  <p className="text-sm text-text-secondary mb-4">{tool.description}</p>
                  <Button className="w-full bg-primary-bright hover:bg-primary-dark">
                    {tool.action}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-primary-bright to-primary-dark text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Stay Informed</h2>
            <p className="text-blue-100 mb-8">
              Get the latest senior care insights, tips, and resources delivered to your inbox
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-text-primary"
              />
              <Button className="bg-white text-primary-bright hover:bg-gray-100">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ResourcesPage;
