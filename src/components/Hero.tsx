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
      
      <div className="container mx-auto px-6 text-center relative z-10">
        {/* Brand Lockup - Made smaller */}
        <div className="mb-12 animate-fade-in-up">
          <div className="flex items-center justify-center gap-4 mb-4">
            <img 
              src={bobMascot} 
              alt="Bob the Business Builder mascot" 
              className="w-16 h-16 rounded-full border-4 border-primary shadow-lg"
            />
            <div className={`text-3xl transition-all duration-300 ${isTyping ? 'hammer-swing' : ''}`}>
              🔨
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black text-primary mb-2 tracking-tight">
            Bob the Business
          </h1>
          <h1 className="text-4xl md:text-5xl font-black text-accent mb-4 tracking-tight">
            Builder
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground font-semibold">
            Let's build your business — brick by brick.
          </p>
        </div>

        {/* MAIN PROMPT - Made the focal point */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="prompt-container mb-8">
            <h2 className="text-3xl md:text-5xl font-black text-card mb-6 text-center leading-tight">
              What's your business idea?
            </h2>
            <p className="text-lg text-card/90 text-center mb-6">
              Tell Bob about your vision and get a personalized roadmap to success!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Input field */}
            <div className="relative">
              <div className="relative">
                <Input
                  ref={inputRef}
                  id="business-idea"
                  type="text"
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  placeholder="I want to start a coffee shop that..."
                  className="w-full h-20 text-xl px-8 rounded-3xl border-4 border-secondary bg-card shadow-xl focus:border-primary transition-all duration-300 focus:shadow-2xl placeholder:text-muted-foreground/60"
                  disabled={isLoading}
                />
                
                {/* Construction elements that appear when typing */}
                {isTyping && (
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 flex gap-2">
                    <Hammer className="text-primary animate-bounce" size={24} />
                    <span className="text-lg text-muted-foreground animate-pulse font-semibold">
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
              className="construction-sign w-full h-20 text-2xl font-black text-primary-foreground hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100"
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <Construction className="animate-spin" size={28} />
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