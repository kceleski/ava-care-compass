
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  MapPin, 
  Star, 
  TrendingUp, 
  Phone, 
  Mail, 
  Building, 
  Target,
  BarChart3,
  CheckCircle,
  ArrowRight,
  Calendar,
  MessageCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdvertisePage = () => {
  const [formData, setFormData] = useState({
    facilityName: '',
    contactName: '',
    email: '',
    phone: '',
    facilityType: '',
    location: '',
    message: ''
  });
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Request Submitted!",
      description: "We'll contact you within 24 hours to discuss your advertising needs.",
    });
    setFormData({
      facilityName: '',
      contactName: '',
      email: '',
      phone: '',
      facilityType: '',
      location: '',
      message: ''
    });
  };

  const pricingPlans = [
    {
      name: "Starter",
      price: "$299",
      period: "/month",
      description: "Perfect for small facilities getting started",
      features: [
        "Basic listing in search results",
        "Up to 5 photos",
        "Contact information display",
        "Monthly performance report",
        "Email support"
      ],
      popular: false
    },
    {
      name: "Professional",
      price: "$599",
      period: "/month",
      description: "Most popular choice for growing facilities",
      features: [
        "Premium listing placement",
        "Unlimited photos & virtual tour",
        "Featured facility badge",
        "Priority search ranking",
        "Detailed analytics dashboard",
        "Phone & email support",
        "Social media integration"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "$999",
      period: "/month",
      description: "For large facilities and chains",
      features: [
        "Top placement guarantee",
        "Custom facility page design",
        "Dedicated account manager",
        "Advanced lead tracking",
        "Custom reporting",
        "24/7 priority support",
        "Multi-location management",
        "White-label options"
      ],
      popular: false
    }
  ];

  const benefits = [
    {
      icon: <Users className="h-8 w-8 text-primary-bright" />,
      title: "Reach More Families",
      description: "Connect with thousands of families actively searching for senior care in your area."
    },
    {
      icon: <Target className="h-8 w-8 text-primary-bright" />,
      title: "Targeted Marketing",
      description: "Your facility appears to families searching specifically for your type of care and location."
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-primary-bright" />,
      title: "Track Performance",
      description: "Detailed analytics show how many families view your listing and request information."
    },
    {
      icon: <Star className="h-8 w-8 text-primary-bright" />,
      title: "Build Reputation",
      description: "Showcase reviews, photos, and achievements to build trust with potential residents."
    }
  ];

  const stats = [
    { number: "50,000+", label: "Monthly Visitors" },
    { number: "2,500+", label: "Partner Facilities" },
    { number: "95%", label: "Customer Satisfaction" },
    { number: "4.8★", label: "Average Rating" }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      title: "Marketing Director",
      facility: "Sunset Manor Assisted Living",
      quote: "Since partnering with HealthProAssist, our inquiries have increased by 300%. The platform really works!",
      rating: 5
    },
    {
      name: "Michael Chen",
      title: "Administrator",
      facility: "Golden Years Memory Care",
      quote: "The analytics and lead tracking have been invaluable. We can see exactly which families are interested.",
      rating: 5
    },
    {
      name: "Lisa Rodriguez",
      title: "Owner",
      facility: "Caring Hands Home Care",
      quote: "Professional support team and great results. Our occupancy rate has never been higher.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-surface-light to-white">
      {/* Hero Section */}
      <section className="hero-gradient text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Grow Your Senior Care Business
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Connect with families actively searching for senior care. Join thousands of providers who trust HealthProAssist to grow their business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-primary-dark hover:bg-surface-light">
              <Phone className="mr-2 h-5 w-5" />
              Get Started Today
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-yellow hover:text-primary-dark">
              <Calendar className="mr-2 h-5 w-5" />
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className="text-3xl md:text-4xl font-bold text-primary-dark">{stat.number}</div>
                <div className="text-text-secondary">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-surface-light">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Why Partner With HealthProAssist?
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              We help senior care providers reach the right families at the right time, with tools and support to maximize your success.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center h-full">
                <CardHeader>
                  <div className="mx-auto mb-4 p-3 bg-primary-bright/10 rounded-full w-fit">
                    {benefit.icon}
                  </div>
                  <CardTitle className="text-xl">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-text-secondary">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Choose Your Plan
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              Flexible pricing options to fit your facility's needs and budget. All plans include our core features.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? 'border-primary-bright shadow-lg scale-105' : ''}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary-bright text-white">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription className="text-sm">{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-primary-dark">{plan.price}</span>
                    <span className="text-text-secondary">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-success mr-3 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${plan.popular ? 'bg-primary-bright hover:bg-primary-dark' : ''}`}
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-surface-light">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              What Our Partners Say
            </h2>
            <p className="text-xl text-text-secondary">
              Hear from real facility owners and administrators who've grown their business with us.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="h-full">
                <CardHeader>
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <CardDescription className="text-base italic">
                    "{testimonial.quote}"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <div className="font-semibold text-text-primary">{testimonial.name}</div>
                    <div className="text-sm text-text-secondary">{testimonial.title}</div>
                    <div className="text-sm text-primary-bright">{testimonial.facility}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-text-secondary">
                Contact us today for a free consultation and custom quote for your facility.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageCircle className="mr-3 h-6 w-6 text-primary-bright" />
                    Get In Touch
                  </CardTitle>
                  <CardDescription>
                    Fill out the form and we'll contact you within 24 hours to discuss your needs.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="facilityName">Facility Name *</Label>
                        <Input
                          id="facilityName"
                          name="facilityName"
                          value={formData.facilityName}
                          onChange={handleInputChange}
                          placeholder="Your facility name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contactName">Contact Name *</Label>
                        <Input
                          id="contactName"
                          name="contactName"
                          value={formData.contactName}
                          onChange={handleInputChange}
                          placeholder="Your full name"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="(555) 123-4567"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="facilityType">Facility Type *</Label>
                        <select
                          id="facilityType"
                          name="facilityType"
                          value={formData.facilityType}
                          onChange={handleInputChange}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          required
                        >
                          <option value="">Select facility type</option>
                          <option value="assisted-living">Assisted Living</option>
                          <option value="memory-care">Memory Care</option>
                          <option value="independent-living">Independent Living</option>
                          <option value="skilled-nursing">Skilled Nursing</option>
                          <option value="home-care">Home Care</option>
                          <option value="adult-day-care">Adult Day Care</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          placeholder="City, State"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Tell us about your goals</Label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="What are you hoping to achieve with advertising? How many residents are you looking to reach?"
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        rows={4}
                      />
                    </div>

                    <Button type="submit" className="w-full bg-primary-bright hover:bg-primary-dark">
                      <Mail className="mr-2 h-5 w-5" />
                      Send My Request
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <div className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Phone className="mr-3 h-6 w-6 text-primary-bright" />
                      Call Us Directly
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="font-semibold text-lg">(855) HEALTH-PRO</div>
                      <div className="text-text-secondary">Monday - Friday, 8 AM - 6 PM EST</div>
                    </div>
                    <div>
                      <div className="font-semibold">Email:</div>
                      <div className="text-primary-bright">partnerships@healthproassist.com</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Building className="mr-3 h-6 w-6 text-primary-bright" />
                      Enterprise Solutions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-text-secondary mb-4">
                      Managing multiple locations? We offer custom solutions for facility chains and healthcare networks.
                    </p>
                    <Button variant="outline" className="w-full">
                      Learn About Enterprise
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Success Guarantee</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-text-secondary">
                      We're so confident in our platform that we offer a 30-day money-back guarantee. If you don't see results, we'll refund your first month.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdvertisePage;
