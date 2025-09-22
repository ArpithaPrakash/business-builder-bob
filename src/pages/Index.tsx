import { useState } from 'react';
import Hero from '@/components/Hero';
import VideoIntroPage from '@/components/VideoIntroPage';

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

  const handleBackToImage = () => {
    setCurrentIdea(null);
    setIsLoading(false);
  };

  const handleStartBuilding = () => {
    // Will implement chat functionality later
    console.log("Start building clicked");
  };

  return (
    <div className="min-h-screen">
      {!currentIdea ? (
        <Hero onSubmitIdea={handleIdeaSubmit} isLoading={isLoading} />
      ) : (
        <VideoIntroPage 
          businessIdea={currentIdea}
          onBack={handleBackToImage}
          onStartBuilding={handleStartBuilding}
        />
      )}
    </div>
  );
};

export default Index;
