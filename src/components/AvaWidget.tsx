import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MessageCircle, Mic, MicOff, Minimize2, Maximize2 } from 'lucide-react';
import { interactWithAgent } from 'api_elevenlabs_io__jit_plugin';
import AvaChat from '@/components/ava/AvaChat';

interface AvaWidgetProps {
  isFullScreen?: boolean;
  onFullScreenToggle?: () => void;
  context?: string;
}

const AvaWidget = ({ isFullScreen = false, onFullScreenToggle, context = "general" }: AvaWidgetProps) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [agentReply, setAgentReply] = useState('');
  const [assistantName, setAssistantName] = useState<'greeter' | 'ava' | 'ranger'>('greeter');
  const [chatOpen, setChatOpen] = useState(false);
  const navigate = useNavigate();
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200 && !showFullScreen) {
        setShowFullScreen(true);
        setChatOpen(true);
        onFullScreenToggle?.();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showFullScreen, onFullScreenToggle]);

  const handleStartAssessment = () => {
    navigate('/find-care');
  };

  const startVoiceRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = async (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      const response = await interactWithAgent({ text: transcript });
      setAgentReply(response.response);
      if (response.response.toLowerCase().includes('veteran')) {
        setAssistantName('ranger');
      } else {
        setAssistantName('ava');
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error', event);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
    setIsListening(true);
  };

  const stopVoiceRecognition = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  const getAssistantLabel = () => {
    switch (assistantName) {
      case 'ranger': return 'Ranger, Veteran Support Bot';
      case 'ava': return 'AVA Assistant';
      default: return 'Welcome Assistant';
    }
  };

  const getAssistantAvatar = () => {
    switch (assistantName) {
      case 'ranger': return '/images/ranger.png';
      case 'ava': return '/images/ava.png';
      default: return '/images/greeter.png';
    }
  };

  if (chatOpen) {
    return <AvaChat isOpen={chatOpen} onClose={() => setChatOpen(false)} assistant={assistantName} />;
  }

  if (isMinimized) {
    return (
      <Button
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-sky-500 hover:bg-sky-600 shadow-lg"
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
                src={getAssistantAvatar()} 
                alt={getAssistantLabel()} 
                className="w-6 h-6 rounded-full object-cover"
              />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-text-primary">{getAssistantLabel()}</h4>
              <p className="text-xs text-text-secondary">Online</p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="sm" onClick={() => setChatOpen(true)}>
              <Maximize2 className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setIsMinimized(true)}>
              <Minimize2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
        <div className="space-y-3">
          <div className="p-3 bg-surface-soft rounded-lg">
            <p className="text-xs text-text-primary">
              Hi! I'm {getAssistantLabel()}. I can help you find the right support or guide you to the best care.
            </p>
            {agentReply && (
              <div className="mt-2 text-xs text-blue-700">{agentReply}</div>
            )}
          </div>
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              className="flex-1 text-xs bg-sky-500 hover:bg-sky-600 text-white"
              onClick={handleStartAssessment}
            >
              Start Assessment
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={isListening ? stopVoiceRecognition : startVoiceRecognition}
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
