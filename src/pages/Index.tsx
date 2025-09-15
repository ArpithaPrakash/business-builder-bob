import { useState } from 'react';
import Hero from '@/components/Hero';
import ChatContainer from '@/components/ChatContainer';

const Index = () => {
  const [currentIdea, setCurrentIdea] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleIdeaSubmit = async (idea: string) => {
    setIsLoading(true);
    setCurrentIdea(idea);
    
    // Small delay to show loading state
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleReset = () => {
    setCurrentIdea(null);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen">
      {!currentIdea ? (
        <Hero onSubmitIdea={handleIdeaSubmit} isLoading={isLoading} />
      ) : (
        <div className="py-8">
          {/* Show condensed hero when chat is active */}
          <div className="text-center mb-8 px-6">
            <h1 className="text-3xl font-black text-primary mb-2">
              Bob the Business Builder
            </h1>
            <p className="text-muted-foreground">
              Building your business — brick by brick
            </p>
          </div>
          
          <ChatContainer 
            initialIdea={currentIdea} 
            onReset={handleReset} 
          />
        </div>
      )}
    </div>
  );
};

export default Index;
