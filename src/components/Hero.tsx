import { useState, useRef, useEffect } from 'react';
import { Hammer, Construction } from 'lucide-react';
import bobMascot from '@/assets/bob-mascot.png';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface HeroProps {
  onSubmitIdea: (idea: string) => void;
  isLoading: boolean;
}

export default function Hero({ onSubmitIdea, isLoading }: HeroProps) {
  const [idea, setIdea] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (idea.trim() && !isLoading) {
      onSubmitIdea(idea.trim());
    }
  };

  useEffect(() => {
    if (idea.length > 0 && !isTyping) {
      setIsTyping(true);
      const timer = setTimeout(() => setIsTyping(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [idea]);

  return (
    <div className="relative min-h-screen flex items-center justify-center blueprint-bg overflow-hidden">
      {/* Animated construction elements */}
      <div className="absolute top-20 right-10 text-6xl bounce-construction">
        🏗️
      </div>
      <div className="absolute bottom-32 left-10 text-4xl crane-lower">
        🏗️
      </div>
      
      <div className="container mx-auto px-6 text-center relative z-10">
        {/* Brand Lockup */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center justify-center gap-4 mb-6">
            <img 
              src={bobMascot} 
              alt="Bob the Business Builder mascot" 
              className="w-20 h-20 rounded-full border-4 border-primary shadow-lg"
            />
            <div className={`text-4xl transition-all duration-300 ${isTyping ? 'hammer-swing' : ''}`}>
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
                <Input
                  ref={inputRef}
                  id="business-idea"
                  type="text"
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  placeholder="I want to start a..."
                  className="w-full h-16 text-lg px-6 rounded-2xl border-4 border-secondary bg-card shadow-lg focus:border-primary transition-all duration-300 focus:shadow-xl"
                  disabled={isLoading}
                />
                
                {/* Construction elements that appear when typing */}
                {isTyping && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
                    <Hammer className="text-primary animate-bounce" size={20} />
                    <span className="text-sm text-muted-foreground animate-pulse">
                      Building...
                    </span>
                  </div>
                )}
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

        {/* Decorative elements */}
        <div className="flex justify-center gap-8 text-4xl opacity-60">
          <span className="animate-bounce" style={{animationDelay: '0s'}}>🧱</span>
          <span className="animate-bounce" style={{animationDelay: '0.2s'}}>⚒️</span>
          <span className="animate-bounce" style={{animationDelay: '0.4s'}}>📐</span>
          <span className="animate-bounce" style={{animationDelay: '0.6s'}}>🏗️</span>
          <span className="animate-bounce" style={{animationDelay: '0.8s'}}>🧱</span>
        </div>
      </div>
    </div>
  );
}