import { useState } from 'react';
import Hero from '@/components/Hero';
import VideoIntroPage from '@/components/VideoIntroPage';
import CPSHypothesisBuilder from '@/components/CPSHypothesisBuilder';
import ImageGenerator from '@/components/ImageGenerator';
import LeapOfFaithBuilder from '@/components/LeapOfFaithBuilder';
import MomTestBuilder from '@/components/MomTestBuilder';

const Index = () => {
  const [currentIdea, setCurrentIdea] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<'hero' | 'video' | 'cps' | 'image-gen' | 'lofa' | 'mom-test'>('hero');
  const [cpsData, setCpsData] = useState<any>(null);
  const [lofaData, setLofaData] = useState<string[]>([]);

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

  const handleLOFANext = (lofaAssumptions: string[]) => {
    setLofaData(lofaAssumptions);
    setCurrentStep('mom-test');
  };

  const handleBackToLOFA = () => {
    setCurrentStep('lofa');
  };

  const handleMomTestComplete = () => {
    // Will implement final completion later
    console.log("Validation journey complete!", { cpsData, lofaData });
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
      
      {currentStep === 'mom-test' && currentIdea && cpsData && lofaData.length > 0 && (
        <MomTestBuilder
          lofaData={lofaData}
          businessIdea={currentIdea}
          cpsData={cpsData}
          onBack={handleBackToLOFA}
          onComplete={handleMomTestComplete}
        />
      )}
    </div>
  );
};

export default Index;
