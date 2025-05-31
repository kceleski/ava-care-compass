
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Phone, Mail } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/07f785bc-439e-4bb9-a549-3f4a165764c6.png" 
              alt="HealthProAssist" 
              className="h-8 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors hover:text-primary-red ${
                isActive('/') ? 'text-primary-red' : 'text-text-primary'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/find-care" 
              className={`text-sm font-medium transition-colors hover:text-primary-red ${
                isActive('/find-care') ? 'text-primary-red' : 'text-text-primary'
              }`}
            >
              Find Care
            </Link>
            <Link 
              to="/resources" 
              className={`text-sm font-medium transition-colors hover:text-primary-red ${
                isActive('/resources') ? 'text-primary-red' : 'text-text-primary'
              }`}
            >
              Resources
            </Link>
            <Link 
              to="/contact" 
              className={`text-sm font-medium transition-colors hover:text-primary-red ${
                isActive('/contact') ? 'text-primary-red' : 'text-text-primary'
              }`}
            >
              Contact Us
            </Link>
            <Link 
              to="/advertise" 
              className={`text-sm font-medium transition-colors hover:text-primary-red ${
                isActive('/advertise') ? 'text-primary-red' : 'text-text-primary'
              }`}
            >
              Advertise
            </Link>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild className="bg-primary-red hover:bg-primary-dark">
              <Link to="/register">Sign Up</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border-subtle">
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="text-sm font-medium text-text-primary hover:text-primary-bright"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/find-care" 
                className="text-sm font-medium text-text-primary hover:text-primary-bright"
                onClick={() => setIsMenuOpen(false)}
              >
                Find Care
              </Link>
              <Link 
                to="/resources" 
                className="text-sm font-medium text-text-primary hover:text-primary-bright"
                onClick={() => setIsMenuOpen(false)}
              >
                Resources
              </Link>
              <Link 
                to="/contact" 
                className="text-sm font-medium text-text-primary hover:text-primary-bright"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact Us
              </Link>
              <Link 
                to="/advertise" 
                className="text-sm font-medium text-text-primary hover:text-primary-bright"
                onClick={() => setIsMenuOpen(false)}
              >
                Advertise
              </Link>
              <div className="flex flex-col space-y-2 pt-4">
                <Button variant="ghost" asChild>
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>Login</Link>
                </Button>
                <Button asChild className="bg-primary-bright hover:bg-primary-dark">
                  <Link to="/register" onClick={() => setIsMenuOpen(false)}>Sign Up</Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
