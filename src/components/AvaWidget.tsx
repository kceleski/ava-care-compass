import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MessageCircle, Mic, MicOff, Minimize2, Maximize2 } from 'lucide-react';

interface AvaWidgetProps {
  isFullScreen?: boolean;
  onFullScreenToggle?: () => void;
  context?: string; // What page/context Ava is helping with
}

const AvaWidget = ({ isFullScreen = false, onFullScreenToggle, context = "general" }: AvaWidgetProps) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showFullScreen, setShowFullScreen] = useState(false);
  const navigate = useNavigate();

  // Auto-deploy full screen on scroll (as specified in requirements)
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200 && !showFullScreen) {
        setShowFullScreen(true);
        onFullScreenToggle?.();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showFullScreen, onFullScreenToggle]);

  const handleStartAssessment = () => {
    navigate('/find-care');
  };

  if (isFullScreen) {
    return (
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden animate-zoom-in">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-primary-bright flex items-center justify-center">
                  <img 
                    src="/lovable-uploads/3313fb44-68a6-4a0a-bd78-1fb211a5fe2f.png" 
                    alt="AVA" 
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-text-primary">AVA Assistant</h3>
                  <p className="text-sm text-text-secondary">AI-Powered Senior Care Guide</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onFullScreenToggle}
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-surface-soft rounded-lg">
                <p className="text-sm text-text-primary">
                  Hello! I'm AVA, your AI assistant for senior care placement. I can help you navigate this page, 
                  answer questions about care options, and guide you through our services.
                  {context !== "general" && ` I see you're on the ${context} page - how can I assist you here?`}
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant={isListening ? "destructive" : "default"}
                  size="sm"
                  onClick={() => setIsListening(!isListening)}
                  className="flex items-center space-x-2"
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  <span>{isListening ? "Stop Listening" : "Voice Interaction"}</span>
                </Button>
                <span className="text-xs text-text-secondary">
                  {isListening ? "Listening..." : "Click to start voice conversation"}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (isMinimized) {
    return (
      <Button
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-primary-bright hover:bg-primary-dark shadow-lg"
        onClick={() => setIsMinimized(false)}
      >
        <MessageCircle className="h-6 w-6 text-white" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 z-40 w-80 shadow-lg animate-fade-in">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-primary-bright flex items-center justify-center">
              <img 
                src="/lovable-uploads/3313fb44-68a6-4a0a-bd78-1fb211a5fe2f.png" 
                alt="AVA" 
                className="w-6 h-6 rounded-full object-cover"
              />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-text-primary">AVA Assistant</h4>
              <p className="text-xs text-text-secondary">Online</p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onFullScreenToggle?.()}
            >
              <Maximize2 className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(true)}
            >
              <Minimize2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="p-3 bg-surface-soft rounded-lg">
            <p className="text-xs text-text-primary">
              Hi! I'm AVA. I can help you find the perfect senior care solution. 
              Would you like to start with a quick assessment?
            </p>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              className="flex-1 text-xs bg-primary-bright hover:bg-primary-dark"
              onClick={handleStartAssessment}
            >
              Start Assessment
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsListening(!isListening)}
              className={isListening ? "border-accent-patriotic" : ""}
            >
              {isListening ? <MicOff className="h-3 w-3" /> : <Mic className="h-3 w-3" />}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AvaWidget;
