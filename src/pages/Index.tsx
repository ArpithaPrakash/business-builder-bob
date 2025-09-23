import { useState } from 'react';
import Hero from '@/components/Hero';
import ThreePQuestions, { ThreePAnswers } from '@/components/ThreePQuestions';
import VideoIntroPage from '@/components/VideoIntroPage';
import CPSHypothesisBuilder from '@/components/CPSHypothesisBuilder';
import LoginPage from '@/components/LoginPage';
import ImageGenerator from '@/components/ImageGenerator';
import LeapOfFaithBuilder from '@/components/LeapOfFaithBuilder';
import MomTestBuilder from '@/components/MomTestBuilder';

const Index = () => {
  const [currentIdea, setCurrentIdea] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<'hero' | '3p' | 'video' | 'cps' | 'login' | 'image-gen' | 'lofa' | 'mom-test'>('hero');
  const [threePAnswers, setThreePAnswers] = useState<ThreePAnswers | null>(null);
  const [cpsData, setCpsData] = useState<any>(null);
  const [lofaData, setLofaData] = useState<string[]>([]);

  const handleIdeaSubmit = async (idea: string) => {
    setIsLoading(true);
    setCurrentIdea(idea);
    
    // Small delay to show loading state
    setTimeout(() => {
      setIsLoading(false);
      setCurrentStep('3p');
    }, 1000);
  };

  const handleBackToHero = () => {
    setCurrentIdea(null);
    setIsLoading(false);
    setCurrentStep('hero');
  };

  const handleThreePContinue = (answers: ThreePAnswers) => {
    setThreePAnswers(answers);
    setCurrentStep('video');
  };

  const handleBackTo3P = () => {
    setCurrentStep('3p');
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
    setCurrentStep('login');
  };

  const handleBackToCPS = () => {
    setCurrentStep('cps');
  };

  const handleLoginContinue = () => {
    setCurrentStep('image-gen');
  };

  const handleBackToLogin = () => {
    setCurrentStep('login');
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
      
      {currentStep === '3p' && (
        <ThreePQuestions 
          onBack={handleBackToHero}
          onContinue={handleThreePContinue}
        />
      )}
      
      {currentStep === 'video' && currentIdea && (
        <VideoIntroPage 
          businessIdea={currentIdea}
          onBack={handleBackTo3P}
          onStartBuilding={handleStartBuilding}
        />
      )}
      
      {currentStep === 'cps' && (
        <CPSHypothesisBuilder
          onBack={handleBackToVideo}
          onContinue={handleCPSContinue}
        />
      )}
      
      {currentStep === 'login' && (
        <LoginPage
          onBack={handleBackToCPS}
          onContinue={handleLoginContinue}
        />
      )}
      
      {currentStep === 'image-gen' && currentIdea && cpsData && (
        <ImageGenerator
          businessIdea={currentIdea}
          cpsData={cpsData}
          onBack={handleBackToLogin}
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
