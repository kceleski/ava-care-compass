
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-primary-dark text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <img 
              src="/lovable-uploads/07f785bc-439e-4bb9-a549-3f4a165764c6.png" 
              alt="HealthProAssist" 
              className="h-8 w-auto"
            />
            <p className="text-white/80 text-sm">
              AI-powered senior care placement platform dedicated to helping families 
              find the perfect care solutions with dignity and compassion.
            </p>
            <div className="flex items-center space-x-2 text-white/60">
              <Heart className="h-4 w-4" />
              <span className="text-sm">Serving Veterans & Families Since 2015</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-white/80 hover:text-white text-sm transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/find-care" className="text-white/80 hover:text-white text-sm transition-colors">
                  Find Care
                </Link>
              </li>
              <li>
                <Link to="/resources" className="text-white/80 hover:text-white text-sm transition-colors">
                  Resources
                </Link>
              </li>
              <li>
                <Link to="/advertise" className="text-white/80 hover:text-white text-sm transition-colors">
                  Advertise
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/contact" className="text-white/80 hover:text-white text-sm transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-white/80 hover:text-white text-sm transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-white text-sm transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-white text-sm transition-colors">
                  Help Center
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-white/60" />
                <a href="tel:1-800-432-584" className="text-white/80 hover:text-white text-sm">
                  (623) 300-2065
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-white/60" />
                <a href="mailto:hello@healthproassist.com" className="text-white/80 hover:text-white text-sm">
                  contact@healthproassist.com
                </a>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-white/60 mt-0.5" />
                <div className="text-white/80 text-sm">
                  HealthProAssist<br />
                  Arizona, United States 
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/60 text-sm">
            © 2025 HealthProAssist. All rights reserved.
          </p>
          <p className="text-white/60 text-sm mt-2 md:mt-0">
            Made with ❤️ for America's Seniors and Veterans
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
