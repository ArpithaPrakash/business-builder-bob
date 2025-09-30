import { useState } from 'react';
import Hero from '@/components/Hero';
import ThreePQuestions, { ThreePAnswers } from '@/components/ThreePQuestions';
import VideoIntroPage from '@/components/VideoIntroPage';
import CPSHypothesisBuilder from '@/components/CPSHypothesisBuilder';
import LoginPage from '@/components/LoginPage';
import ImageGenerator from '@/components/ImageGenerator';
import LeapOfFaithBuilder from '@/components/LeapOfFaithBuilder';
import MomTestBuilder from '@/components/MomTestBuilder';
import CustomerDiscovery from '@/components/CustomerDiscovery';
import ScreenshotUpload from '@/components/ScreenshotUpload';
import OutreachMessage from '@/components/OutreachMessage';

const Index = () => {
  const [currentIdea, setCurrentIdea] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<'hero' | '3p' | 'video' | 'cps' | 'login' | 'image-gen' | 'lofa' | 'mom-test' | 'customer-discovery' | 'screenshot-upload' | 'outreach-message'>('hero');
  const [threePAnswers, setThreePAnswers] = useState<ThreePAnswers | null>(null);
  const [cpsData, setCpsData] = useState<any>(null);
  const [lofaData, setLofaData] = useState<string[]>([]);
  const [linkedInName, setLinkedInName] = useState<string>('Friend');

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
    setCurrentStep('login');
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
    setCurrentStep('lofa');
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
    setCurrentStep('video');
  };

  const handleBackToImageGen = () => {
    setCurrentStep('image-gen');
  };

  const handleLOFANext = (lofaAssumptions: string[]) => {
    console.log('handleLOFANext called with:', lofaAssumptions);
    console.log('Current state before update:', { currentIdea, cpsData, lofaData });
    setLofaData(lofaAssumptions);
    setCurrentStep('mom-test');
    console.log('Setting step to mom-test');
  };

  const handleBackToLOFA = () => {
    setCurrentStep('lofa');
  };

  const handleMomTestComplete = () => {
    setCurrentStep('customer-discovery');
  };

  const handleBackToMomTest = () => {
    setCurrentStep('mom-test');
  };

  const handleCustomerDiscoveryComplete = () => {
    setCurrentStep('screenshot-upload');
  };

  const handleBackToCustomerDiscovery = () => {
    setCurrentStep('customer-discovery');
  };

  const handleScreenshotUploadComplete = (name: string) => {
    setLinkedInName(name);
    setCurrentStep('outreach-message');
  };

  const handleBackToScreenshotUpload = () => {
    setCurrentStep('screenshot-upload');
  };

  const handleOutreachMessageComplete = () => {
    // Final completion - could redirect to a thank you page or reset
    console.log("Outreach message complete!", { currentIdea, cpsData, lofaData });
    // For now, just log completion
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
      
      {currentStep === 'login' && (
        <LoginPage
          onBack={handleBackTo3P}
          onContinue={handleLoginContinue}
        />
      )}
      
      {currentStep === 'image-gen' && currentIdea && (
        <ImageGenerator
          businessIdea={currentIdea}
          cpsData={null}
          onBack={handleBackToLogin}
          onContinue={handleImageGenContinue}
        />
      )}
      
      {currentStep === 'video' && currentIdea && (
        <VideoIntroPage 
          businessIdea={currentIdea}
          onBack={handleBackToImageGen}
          onStartBuilding={handleStartBuilding}
        />
      )}
      
      {currentStep === 'cps' && (
        <CPSHypothesisBuilder
          onBack={handleBackToVideo}
          onContinue={handleCPSContinue}
        />
      )}
      
      {currentStep === 'lofa' && cpsData && (
        <LeapOfFaithBuilder
          cpsData={cpsData}
          onBack={handleBackToCPS}
          onNext={handleLOFANext}
        />
      )}
      
      {(() => {
        console.log('Mom Test render check:', { 
          currentStep, 
          currentIdea: !!currentIdea, 
          cpsData: !!cpsData, 
          lofaData: lofaData,
          lofaDataLength: lofaData?.length || 0
        });
        return currentStep === 'mom-test' && currentIdea && cpsData && lofaData && lofaData.length > 0;
      })() && (
        <MomTestBuilder
          lofaData={lofaData}
          businessIdea={currentIdea}
          cpsData={cpsData}
          onBack={handleBackToLOFA}
          onComplete={handleMomTestComplete}
        />
      )}
      
      {currentStep === 'customer-discovery' && currentIdea && (
        <CustomerDiscovery
          businessIdea={currentIdea}
          onBack={handleBackToMomTest}
          onContinue={handleCustomerDiscoveryComplete}
        />
      )}
      
      {currentStep === 'screenshot-upload' && (
        <ScreenshotUpload
          onBack={handleBackToCustomerDiscovery}
          onContinue={handleScreenshotUploadComplete}
        />
      )}
      
      {currentStep === 'outreach-message' && (
        <OutreachMessage
          linkedInName={linkedInName}
          onBack={handleBackToScreenshotUpload}
          onContinue={handleOutreachMessageComplete}
        />
      )}
    </div>
  );
};

export default Index;
