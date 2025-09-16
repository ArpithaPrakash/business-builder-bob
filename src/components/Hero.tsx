import { useState, useRef, useEffect } from 'react';
import { Hammer, Construction } from 'lucide-react';
import bobMascot from '@/assets/bob-mascot.png';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface HeroProps {
  onSubmitIdea: (idea: string) => void;
  isLoading: boolean;
}

const businessIdeas = [
  "a subscription box for eco-friendly home products",
  "an AI-powered personal fitness coach app",
  "a platform connecting local farmers with restaurants",
  "a virtual reality interior design service",
  "a meal planning app for busy families",
  "a peer-to-peer tool lending marketplace",
  "an online platform for remote team building activities",
  "a sustainable fashion rental service",
  "a mental health support app for students",
  "a smart home automation consulting business",
  "a personalized skincare product line",
  "a drone delivery service for rural areas",
  "an online marketplace for handmade crafts",
  "a virtual tutoring platform for coding",
  "a zero-waste grocery delivery service"
];

export default function Hero({ onSubmitIdea, isLoading }: HeroProps) {
  const [idea, setIdea] = useState('');
  const [currentIdeaIndex, setCurrentIdeaIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isTypingAnimation, setIsTypingAnimation] = useState(true);
  const [hasStartedTyping, setHasStartedTyping] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const baseText = "I want to build ";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (idea.trim() && !isLoading) {
      onSubmitIdea(idea.trim());
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setIdea(value);
    
    if (!hasStartedTyping && value.length > 0) {
      setHasStartedTyping(true);
    }
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  // Typewriter effect for business ideas
  useEffect(() => {
    if (hasStartedTyping) return;

    const currentIdea = businessIdeas[currentIdeaIndex];
    let timeoutId: NodeJS.Timeout;

    if (isTypingAnimation) {
      // Typing animation
      if (currentText.length < currentIdea.length) {
        timeoutId = setTimeout(() => {
          setCurrentText(currentIdea.slice(0, currentText.length + 1));
        }, 50);
      } else {
        // Wait before starting to delete
        timeoutId = setTimeout(() => {
          setIsTypingAnimation(false);
        }, 2000);
      }
    } else {
      // Deleting animation
      if (currentText.length > 0) {
        timeoutId = setTimeout(() => {
          setCurrentText(currentText.slice(0, -1));
        }, 30);
      } else {
        // Move to next idea and start typing
        setCurrentIdeaIndex((prev) => (prev + 1) % businessIdeas.length);
        setIsTypingAnimation(true);
      }
    }

    return () => clearTimeout(timeoutId);
  }, [currentText, isTypingAnimation, currentIdeaIndex, hasStartedTyping]);

  return (
    <div className="relative min-h-screen flex items-center justify-center blueprint-bg overflow-hidden">
      
      <div className="container mx-auto px-6 text-center relative z-10">
        {/* Brand Lockup */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center justify-center gap-4 mb-6">
            <img 
              src={bobMascot} 
              alt="Bob the Business Builder mascot" 
              className="w-20 h-20 rounded-full border-4 border-primary shadow-lg"
            />
            <div className="text-4xl transition-all duration-300">
              🔨
            </div>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black text-primary mb-4 tracking-tight">
            Bob the Business
          </h1>
          <h1 className="text-6xl md:text-8xl font-black text-accent mb-6 tracking-tight">
            Builder
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground font-semibold">
            Let's build your business — brick by brick.
          </p>
        </div>

        {/* Main Input Form */}
        <div className="max-w-2xl mx-auto mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Blueprint-style input container */}
            <div className="relative">
              <label 
                htmlFor="business-idea" 
                className="block text-lg font-bold text-primary mb-3 text-left"
              >
                📋 What's your business idea?
              </label>
              
              <div className="relative">
                <Textarea
                  ref={textareaRef}
                  id="business-idea"
                  value={idea}
                  onChange={handleInputChange}
                  placeholder={hasStartedTyping ? "" : baseText + currentText + (isTypingAnimation ? "|" : "")}
                  className="w-full min-h-16 max-h-32 text-lg px-6 py-4 rounded-2xl border-4 border-secondary bg-card shadow-lg focus:border-primary transition-all duration-300 focus:shadow-xl resize-none overflow-hidden"
                  disabled={isLoading}
                  rows={1}
                />
              </div>
            </div>

            {/* Construction Sign CTA */}
            <Button
              type="submit"
              disabled={!idea.trim() || isLoading}
              className="construction-sign w-full h-16 text-xl font-bold text-primary-foreground hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100"
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <Construction className="animate-spin" size={24} />
                  Building Your Plan...
                </div>
              ) : (
                "🚧 Start Building Now"
              )}
            </Button>
          </form>

          {/* Privacy note */}
          <p className="text-sm text-muted-foreground mt-4">
            💡 Ideas aren't saved by default
          </p>
        </div>
      </div>
    </div>
  );
}