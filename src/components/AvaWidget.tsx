
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MessageCircle, Mic, MicOff, Minimize2, Maximize2, X } from 'lucide-react';

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
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([]);
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
      setMessages(prev => [...prev, { text: transcript, isUser: true }]);
      
      // Simple mock response - in a real app, this would call an AI service
      const response = `I heard you say: "${transcript}". How can I help you with that?`;
      setAgentReply(response);
      setMessages(prev => [...prev, { text: response, isUser: false }]);
      
      if (transcript.toLowerCase().includes('veteran')) {
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
    return (
      <Card className="fixed inset-4 z-50 flex flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center">
              <img 
                src={getAssistantAvatar()} 
                alt={getAssistantLabel()} 
                className="w-6 h-6 rounded-full object-cover"
              />
            </div>
            <div>
              <h4 className="text-sm font-semibold">{getAssistantLabel()}</h4>
              <p className="text-xs text-gray-500">Online</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setChatOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              <p>Start a conversation by clicking the microphone button or typing below.</p>
            </div>
          )}
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs p-3 rounded-lg ${
                message.isUser 
                  ? 'bg-sky-500 text-white' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {message.text}
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t flex space-x-2">
          <Button 
            size="sm" 
            className="bg-sky-500 hover:bg-sky-600 text-white"
            onClick={handleStartAssessment}
          >
            Start Assessment
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={isListening ? stopVoiceRecognition : startVoiceRecognition}
            className={isListening ? "border-red-500" : ""}
          >
            {isListening ? <MicOff className="h-3 w-3" /> : <Mic className="h-3 w-3" />}
          </Button>
        </div>
      </Card>
    );
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
            <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center">
              <img 
                src={getAssistantAvatar()} 
                alt={getAssistantLabel()} 
                className="w-6 h-6 rounded-full object-cover"
              />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-800">{getAssistantLabel()}</h4>
              <p className="text-xs text-gray-500">Online</p>
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
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-700">
              Hi! I'm {getAssistantLabel()}. I can help you find the right support or guide you to the best care.
            </p>
            {agentReply && (
              <div className="mt-2 text-xs text-sky-700">{agentReply}</div>
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
              className={isListening ? "border-red-500" : ""}
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
