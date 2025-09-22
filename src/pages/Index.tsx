import { useState } from 'react';
import Hero from '@/components/Hero';
import VideoIntroPage from '@/components/VideoIntroPage';
import CPSHypothesisBuilder from '@/components/CPSHypothesisBuilder';
import ImageGenerator from '@/components/ImageGenerator';
import LeapOfFaithBuilder from '@/components/LeapOfFaithBuilder';

const Index = () => {
  const [currentIdea, setCurrentIdea] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<'hero' | 'video' | 'cps' | 'image-gen' | 'lofa'>('hero');
  const [cpsData, setCpsData] = useState<any>(null);

  const handleIdeaSubmit = async (idea: string) => {
    setIsLoading(true);
    setCurrentIdea(idea);
    
    // Small delay to show loading state
    setTimeout(() => {
      setIsLoading(false);
      setCurrentStep('video');
    }, 1000);
  };

  const handleBackToImage = () => {
    setCurrentIdea(null);
    setIsLoading(false);
    setCurrentStep('hero');
  };

  const handleStartBuilding = () => {
    console.log('Start Building clicked - navigating to CPS');
    setCurrentStep('cps');
  };

  const handleBackToVideo = () => {
    setCurrentStep('video');
  };

  const handleCPSContinue = (data: any) => {
    setCpsData(data);
    setCurrentStep('image-gen');
  };

  const handleBackToCPS = () => {
    setCurrentStep('cps');
  };

  const handleImageGenContinue = () => {
    setCurrentStep('lofa');
  };

  const handleBackToImageGen = () => {
    setCurrentStep('image-gen');
  };

  const handleLOFANext = () => {
    // Will implement next phase later
    console.log("Moving to next phase with data:", cpsData);
  };

  return (
    <div className="min-h-screen">
      {currentStep === 'hero' && (
        <Hero onSubmitIdea={handleIdeaSubmit} isLoading={isLoading} />
      )}
      
      {currentStep === 'video' && currentIdea && (
        <VideoIntroPage 
          businessIdea={currentIdea}
          onBack={handleBackToImage}
          onStartBuilding={handleStartBuilding}
        />
      )}
      
      {currentStep === 'cps' && (
        <CPSHypothesisBuilder
          onBack={handleBackToVideo}
          onContinue={handleCPSContinue}
        />
      )}
      
      {currentStep === 'image-gen' && currentIdea && cpsData && (
        <ImageGenerator
          businessIdea={currentIdea}
          cpsData={cpsData}
          onBack={handleBackToCPS}
          onContinue={handleImageGenContinue}
        />
      )}
      
      {currentStep === 'lofa' && cpsData && (
        <LeapOfFaithBuilder
          cpsData={cpsData}
          onBack={handleBackToImageGen}
          onNext={handleLOFANext}
        />
      )}
    </div>
  );
};

export default Index;
