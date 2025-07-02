import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
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
  Loader2,
  Star,
  CheckCircle,
  ArrowRight,
  Play,
  Calendar,
  Mail,
  Globe
} from 'lucide-react';
import ResourceCard from './ResourceCard';
import ToolCard from './ToolCard';
import ResourceModal from './ResourceModal';
import CostCalculator from './tools/CostCalculator';
import FacilityFinder from './tools/FacilityFinder';
import TimelinePlanner from './tools/TimelinePlanner';
import EmergencyContacts from './tools/EmergencyContacts';

const ResourcesPage = () => {
  const [avaQuery, setAvaQuery] = useState('');
  const [avaResponse, setAvaResponse] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [selectedResource, setSelectedResource] = useState<{
    title: string;
    description: string;
    type: string;
    tag: string;
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  const handleResourceView = (resource: { title: string; description: string; type: string; tag: string }) => {
    setSelectedResource(resource);
    setIsModalOpen(true);
  };

  const handleAvaQuery = async () => {
    if (!avaQuery.trim()) return;
    
    setIsGenerating(true);
    // Simulate AI response generation
    setTimeout(() => {
      setAvaResponse(`Based on your question: "${avaQuery}", here's what I found:\n\nThis is a comprehensive response that AVA would generate based on your specific inquiry. In a full implementation, this would connect to our AI backend to provide personalized, accurate information about senior care, facility options, costs, and guidance tailored to your specific situation.\n\nWould you like me to elaborate on any specific aspect of this information?`);
      setIsGenerating(false);
    }, 2000);
  };

  const handleSubscribe = () => {
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const resourceCategories = [
    {
      title: "Care Planning Guides",
      icon: <BookOpen className="h-6 w-6" />,
      description: "Comprehensive guides for planning senior care",
      resources: [
        { title: "How to Choose the Right Care Level", description: "Step-by-step guide to determine appropriate care", type: "PDF Guide", tag: "Essential" },
        { title: "Understanding Memory Care Options", description: "Complete overview of memory care facilities", type: "Video Series", tag: "Popular" },
        { title: "Financial Planning for Senior Care", description: "Budget and payment strategies", type: "Webinar", tag: "Free" },
        { title: "Family Care Conference Guide", description: "How to organize family discussions", type: "Checklist", tag: "New" }
      ]
    },
    {
      title: "Health & Wellness",
      icon: <Heart className="h-6 w-6" />,
      description: "Resources for maintaining health and wellbeing",
      resources: [
        { title: "Nutrition Guidelines for Seniors", description: "Age-appropriate dietary recommendations", type: "Article", tag: "Expert" },
        { title: "Exercise Programs for Different Mobility Levels", description: "Adapted fitness routines", type: "Video", tag: "Popular" },
        { title: "Medication Management Tips", description: "Safe medication practices", type: "Guide", tag: "Essential" },
        { title: "Mental Health and Aging", description: "Emotional wellbeing resources", type: "Resource Kit", tag: "Free" }
      ]
    },
    {
      title: "Legal & Financial",
      icon: <Shield className="h-6 w-6" />,
      description: "Important legal and financial considerations",
      resources: [
        { title: "Power of Attorney Explained", description: "Legal authority and responsibilities", type: "Legal Guide", tag: "Essential" },
        { title: "Medicare vs. Medicaid Coverage", description: "Insurance coverage comparison", type: "Comparison", tag: "Popular" },
        { title: "Estate Planning Basics", description: "Wills, trusts, and inheritance", type: "Webinar", tag: "Expert" },
        { title: "Insurance Claims Process", description: "Filing and managing claims", type: "Step-by-Step", tag: "Free" }
      ]
    },
    {
      title: "Family Support",
      icon: <Users className="h-6 w-6" />,
      description: "Support and guidance for families",
      resources: [
        { title: "Having 'The Conversation'", description: "Discussing care needs with family", type: "Guide", tag: "Essential" },
        { title: "Support Groups Near You", description: "Local community resources", type: "Directory", tag: "Local" },
        { title: "Caregiver Self-Care", description: "Managing caregiver stress", type: "Resource Kit", tag: "Popular" },
        { title: "Long-Distance Caregiving", description: "Managing care from afar", type: "Handbook", tag: "Expert" }
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

  const quickStats = [
    { number: "10,000+", label: "Families Helped", icon: <Users className="h-5 w-5" /> },
    { number: "500+", label: "Care Facilities", icon: <MapPin className="h-5 w-5" /> },
    { number: "24/7", label: "Support Available", icon: <Clock className="h-5 w-5" /> },
    { number: "4.9★", label: "Average Rating", icon: <Star className="h-5 w-5" /> }
  ];

  const testimonials = [
    {
      text: "AVA helped us find the perfect memory care facility for my mother. The guidance was invaluable.",
      author: "Sarah Johnson",
      role: "Daughter & Caregiver"
    },
    {
      text: "The resources here saved us months of research. Everything we needed was in one place.",
      author: "Michael Chen",
      role: "Son & Care Coordinator"
    },
    {
      text: "As a veteran, I appreciated the specialized support for VA benefits and military families.",
      author: "Robert Martinez",
      role: "Veteran & Spouse"
    }
  ];

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
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              {quickStats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold">{stat.number}</div>
                  <div className="text-sm text-blue-100">{stat.label}</div>
                </div>
              ))}
            </div>

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
                className="border-red-500 bg-red-500 text-white hover:bg-red-600 hover:border-red-600"
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

          <div className="space-y-12">
            {resourceCategories.map((category, index) => (
              <div key={index} className="animate-fade-in">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-3 bg-primary-bright/10 rounded-lg text-primary-bright">
                    {category.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-text-primary">{category.title}</h3>
                    <p className="text-text-secondary">{category.description}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {category.resources.map((resource, resourceIndex) => (
                    <ResourceCard
                      key={resourceIndex}
                      title={resource.title}
                      description={resource.description}
                      type={resource.type}
                      tag={resource.tag}
                      onView={() => handleResourceView(resource)}
                    />
                  ))}
                </div>
              </div>
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
              <ToolCard
                key={index}
                title={tool.title}
                description={tool.description}
                icon={tool.icon}
                action={tool.action}
                onClick={() => setSelectedTool(tool.title)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text-primary mb-4">
              What Families Say
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Real stories from families who found the perfect care solutions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="glass-card animate-fade-in">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                    ))}
                  </div>
                  <p className="text-text-primary mb-4 italic">"{testimonial.text}"</p>
                  <div>
                    <p className="font-semibold text-text-primary">{testimonial.author}</p>
                    <p className="text-sm text-text-secondary">{testimonial.role}</p>
                  </div>
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
            
            {subscribed ? (
              <div className="flex items-center justify-center space-x-2 text-green-300">
                <CheckCircle className="h-5 w-5" />
                <span>Thank you for subscribing!</span>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-white text-text-primary"
                />
                <Button 
                  className="bg-white text-primary-bright hover:bg-gray-100"
                  onClick={handleSubscribe}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Subscribe
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      <ResourceModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        resource={selectedResource}
      />

      {/* Tool Modals */}
      {selectedTool && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold">{selectedTool}</h2>
              <Button variant="outline" onClick={() => setSelectedTool(null)}>Close</Button>
            </div>
            <div className="p-6">
              {selectedTool === 'Care Cost Calculator' && <CostCalculator />}
              {selectedTool === 'Facility Finder' && <FacilityFinder />}
              {selectedTool === 'Care Timeline Planner' && <TimelinePlanner />}
              {selectedTool === 'Emergency Contacts' && <EmergencyContacts />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourcesPage;
