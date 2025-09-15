import { useState, useRef, useEffect } from 'react';
import { Send, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import AnimatedBob from './AnimatedBob';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface ChatContainerProps {
  initialIdea: string;
  onReset: () => void;
}

export default function ChatContainer({ initialIdea, onReset }: ChatContainerProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Initial message on mount
  useEffect(() => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content: initialIdea,
      role: 'user',
      timestamp: new Date()
    };
    
    setMessages([userMessage]);
    
    // Simulate API call to get Bob's response
    setTimeout(() => {
      getBobResponse([userMessage]);
    }, 500);
  }, [initialIdea]);

  const getBobResponse = async (messageHistory: Message[]) => {
    setIsLoading(true);
    setIsTyping(true);
    
    try {
      // Simulate streaming response from Bob
      const responses = [
        "Hey there, builder! 👷‍♂️ I love your business idea!",
        "That's exactly the kind of thinking that builds successful ventures.",
        "Here's your blueprint for getting started:",
        "• Research your target market and competitors",
        "• Create a simple MVP (Minimum Viable Product)",
        "• Test with real customers early and often",
        "• Build a basic website or landing page",
        "• Start small and scale based on feedback",
        "What part of this plan excites you most? I'm here to help you nail down the details! 🔨"
      ];
      
      let fullResponse = "";
      
      for (let i = 0; i < responses.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 300));
        fullResponse += (i > 0 ? "\n\n" : "") + responses[i];
        
        setMessages(prev => {
          const newMessages = [...prev];
          const lastBobMessage = newMessages.findIndex(msg => 
            msg.role === 'assistant' && msg.id === 'bob-response'
          );
          
          if (lastBobMessage >= 0) {
            newMessages[lastBobMessage] = {
              ...newMessages[lastBobMessage],
              content: fullResponse
            };
          } else {
            newMessages.push({
              id: 'bob-response',
              content: fullResponse,
              role: 'assistant',
              timestamp: new Date()
            });
          }
          
          return newMessages;
        });
      }
      
      setIsTyping(false);
      setIsLoading(false);
      
    } catch (error) {
      console.error('Error getting Bob response:', error);
      setIsTyping(false);
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: newMessage.trim(),
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    
    const updatedHistory = [...messages, userMessage];
    getBobResponse(updatedHistory);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 animate-fade-in-up relative">
      {/* Animated Bob continues running around during chat */}
      <AnimatedBob isActive={true} />
      
      {/* Chat Header */}
      <div className="flex items-center justify-between mb-6 p-4 bg-card rounded-2xl shadow-lg">
        <div className="flex items-center gap-3">
          <span className="text-3xl">👷‍♂️</span>
          <div>
            <h2 className="text-xl font-bold text-primary">Bob's Building Chat</h2>
            <p className="text-sm text-muted-foreground">Your personal business coach</p>
          </div>
        </div>
        
        <Button
          variant="outline"
          onClick={onReset}
          className="flex items-center gap-2"
        >
          <RotateCcw size={16} />
          New Idea
        </Button>
      </div>

      {/* Messages Container */}
      <div className="bg-card rounded-2xl shadow-lg p-6 mb-6 min-h-96 max-h-96 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
            />
          ))}
          
          {isTyping && <TypingIndicator />}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="flex gap-3">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Ask Bob anything about your business..."
          className="flex-1 h-12 rounded-2xl border-2 border-secondary focus:border-primary"
          disabled={isLoading}
        />
        <Button
          type="submit"
          disabled={!newMessage.trim() || isLoading}
          className="h-12 px-6 rounded-2xl bg-primary hover:bg-primary/90"
        >
          <Send size={18} />
        </Button>
      </form>
    </div>
  );
}