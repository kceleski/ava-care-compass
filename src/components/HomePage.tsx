
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Heart, 
  Shield, 
  Users, 
  Star, 
  CheckCircle, 
  ArrowRight, 
  Phone, 
  Mail, 
  MapPin,
  Award,
  Clock,
  Search
} from 'lucide-react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [pricingAnnual, setPricingAnnual] = useState(true);
  const [email, setEmail] = useState('');

  const features = [
    {
      icon: Heart,
      title: "AI-Powered Matching",
      description: "AVA uses advanced AI to match seniors with the perfect care facilities based on their unique needs and preferences."
    },
    {
      icon: Shield,
      title: "Veteran-Focused Care",
      description: "Specialized support for veterans with access to VA benefits and military-friendly care facilities."
    },
    {
      icon: Users,
      title: "Professional Network",
      description: "Connect with certified care placement professionals who understand your local market and needs."
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Tell AVA Your Needs",
      description: "Share your care requirements, preferences, and budget with our AI assistant AVA."
    },
    {
      number: "02", 
      title: "Get Matched",
      description: "AVA analyzes thousands of facilities to find the best matches for your specific situation."
    },
    {
      number: "03",
      title: "Connect & Tour", 
      description: "Schedule virtual or in-person tours with your top matches and make an informed decision."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Daughter & Caregiver",
      content: "AVA helped us find the perfect memory care facility for my father. The process was seamless and the staff was incredibly supportive.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Professional Agent",
      content: "As a care placement professional, HealthProAssist has revolutionized how I serve my clients. The Pro tier features save me hours every week.",
      rating: 5
    },
    {
      name: "Robert Martinez",
      role: "Army Veteran",
      content: "Finally, a service that understands veteran needs. They helped me find a facility that accepts VA benefits and feels like home.",
      rating: 5
    }
  ];

  const pricingPlans = [
    {
      name: "Basic",
      description: "Perfect for individuals getting started",
      monthlyPrice: 29,
      annualPrice: 290,
      features: [
        "Basic facility search",
        "Limited AVA interactions",
        "Email support",
        "Recent 6 facility cards",
        "Basic profile management"
      ]
    },
    {
      name: "Pro",
      description: "Advanced tools for professionals",
      monthlyPrice: 99,
      annualPrice: 990,
      features: [
        "Advanced facility search & filters",
        "Unlimited AVA interactions",
        "Phone-based client creation",
        "Google Maps integration",
        "Facility contact management",
        "Calendar & appointment scheduling",
        "Analytics & reporting",
        "Priority support"
      ],
      popular: true
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient pt-24 pb-16 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <Badge className="mb-6 bg-white/20 text-white border-white/30">
              Powered by AI • Trusted by Families
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Find the Perfect Senior Care with
              <span className="block text-secondary-soft">AI-Powered Matching</span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 text-white/90 leading-relaxed">
              Meet AVA, your personal AI assistant who understands veteran and civilian care needs. 
              Get matched with vetted facilities in minutes, not weeks.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button size="lg" asChild className="bg-accent-patriotic hover:bg-accent-patriotic/90 text-white px-8 py-4 text-lg">
                <Link to="/find-care">
                  <Search className="mr-2 h-5 w-5" />
                  Start Your Search
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary-dark px-8 py-4 text-lg">
                Meet AVA
              </Button>
            </div>

            {/* Hero Stats */}
            <div className="grid md:grid-cols-3 gap-8 mt-16">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">10,000+</div>
                <div className="text-white/80">Verified Facilities</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">98%</div>
                <div className="text-white/80">Match Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">24/7</div>
                <div className="text-white/80">AVA Availability</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Why Choose HealthProAssist?
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Our AI-powered platform combines cutting-edge technology with human expertise 
              to deliver personalized senior care solutions.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 animate-fade-in">
            {features.map((feature, index) => (
              <Card key={index} className="glass-card hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-primary-bright/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-8 w-8 text-primary-bright" />
                  </div>
                  <h3 className="text-xl font-semibold text-text-primary mb-3">{feature.title}</h3>
                  <p className="text-text-secondary">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* AVA's Process Section */}
      <section className="py-16 bg-surface-soft">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              How AVA Works
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Our simple 3-step process powered by advanced AI gets you connected 
              with the right care in no time.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start mb-12 last:mb-0 animate-fade-in">
                <div className="flex-shrink-0 w-16 h-16 bg-primary-bright rounded-full flex items-center justify-center text-white font-bold text-xl mr-6">
                  {step.number}
                </div>
                <div className="flex-grow">
                  <h3 className="text-2xl font-semibold text-text-primary mb-3">{step.title}</h3>
                  <p className="text-lg text-text-secondary">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <ArrowRight className="h-6 w-6 text-primary-bright mt-4 ml-6 hidden md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-text-secondary">
              Real stories from families and professionals who found success with HealthProAssist.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="glass-card">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-warning fill-current" />
                    ))}
                  </div>
                  <p className="text-text-primary mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <div className="font-semibold text-text-primary">{testimonial.name}</div>
                    <div className="text-sm text-text-secondary">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-surface-soft">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Choose Your Plan
            </h2>
            <p className="text-xl text-text-secondary mb-8">
              Flexible pricing for individuals and professionals
            </p>

            {/* Pricing Toggle */}
            <div className="flex items-center justify-center mb-8">
              <span className={`mr-3 ${!pricingAnnual ? 'text-text-primary font-semibold' : 'text-text-secondary'}`}>
                Monthly
              </span>
              <button
                onClick={() => setPricingAnnual(!pricingAnnual)}
                className={`w-14 h-7 rounded-full relative transition-colors ${
                  pricingAnnual ? 'bg-primary-bright' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-transform ${
                    pricingAnnual ? 'transform translate-x-8' : 'transform translate-x-1'
                  }`}
                />
              </button>
              <span className={`ml-3 ${pricingAnnual ? 'text-text-primary font-semibold' : 'text-text-secondary'}`}>
                Annual
              </span>
              {pricingAnnual && (
                <Badge className="ml-2 bg-success text-white">Save 20%</Badge>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`glass-card relative ${plan.popular ? 'ring-2 ring-primary-bright' : ''}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary-bright text-white">
                    Most Popular
                  </Badge>
                )}
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-text-primary mb-2">{plan.name}</h3>
                    <p className="text-text-secondary mb-4">{plan.description}</p>
                    <div className="text-4xl font-bold text-text-primary">
                      ${pricingAnnual ? plan.annualPrice : plan.monthlyPrice}
                      <span className="text-lg text-text-secondary font-normal">
                        /{pricingAnnual ? 'year' : 'month'}
                      </span>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-success mr-3 flex-shrink-0" />
                        <span className="text-text-primary">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    className={`w-full ${plan.popular ? 'bg-primary-bright hover:bg-primary-dark' : ''}`}
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-primary-dark text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Stay Updated with Senior Care Insights
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Get weekly tips, industry updates, and exclusive resources delivered to your inbox.
          </p>

          <div className="max-w-md mx-auto flex gap-4">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white text-text-primary"
            />
            <Button className="bg-accent-patriotic hover:bg-accent-patriotic/90 text-white">
              Subscribe
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                Get in Touch
              </h2>
              <p className="text-xl text-text-secondary">
                Have questions? Our team is here to help you find the perfect care solution.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="glass-card text-center">
                <CardContent className="p-6">
                  <Phone className="h-12 w-12 text-primary-bright mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-text-primary mb-2">Call Us</h3>
                  <p className="text-text-secondary">
                    <a href="tel:1-800-HEALTH" className="hover:text-primary-bright">
                      1-800-HEALTH (432-584)
                    </a>
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-card text-center">
                <CardContent className="p-6">
                  <Mail className="h-12 w-12 text-primary-bright mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-text-primary mb-2">Email Us</h3>
                  <p className="text-text-secondary">
                    <a href="mailto:hello@healthproassist.com" className="hover:text-primary-bright">
                      hello@healthproassist.com
                    </a>
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-card text-center">
                <CardContent className="p-6">
                  <MapPin className="h-12 w-12 text-primary-bright mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-text-primary mb-2">Visit Us</h3>
                  <p className="text-text-secondary">
                    123 Healthcare Blvd<br />
                    Austin, TX 78701
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
