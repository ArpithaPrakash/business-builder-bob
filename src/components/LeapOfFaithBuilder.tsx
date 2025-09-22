import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Brain, Target, Lightbulb, Key } from 'lucide-react';

interface LeapOfFaithBuilderProps {
  cpsData: {
    customer: string;
    problem: string;
    solution: string;
  };
  onBack: () => void;
  onNext: () => void;
}

interface AssumptionAnalysis {
  assumptions: string[];
  isAnalyzing: boolean;
}

const LeapOfFaithBuilder = ({ cpsData, onBack, onNext }: LeapOfFaithBuilderProps) => {
  const [selectedCircle, setSelectedCircle] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AssumptionAnalysis>({
    assumptions: [],
    isAnalyzing: false
  });
  const [apiKey, setApiKey] = useState<string>('');
  const [showApiKeyInput, setShowApiKeyInput] = useState<boolean>(false);

  const generateAIResponse = async (circleType: string) => {
    if (!apiKey.trim()) {
      setShowApiKeyInput(true);
      return;
    }

    let prompt = '';
    let systemPrompt = '';

    if (circleType === 'leap-of-faith') {
      systemPrompt = `You are a Lean Startup Strategist expert in hypothesis-driven entrepreneurship with a deep understanding of Eric Ries' Lean Startup methodology. You specialize in helping early-stage founders break down their business ideas into testable assumptions.

Goal: Identify the most critical Leap of Faith Assumptions (LOFAs) that underpin a founder's CPS (Customer-Problem-Solution) logic, focusing on those that could cause the business to fail if proven false.`;
      
      prompt = `Based on this CPS statement:
Customer: ${cpsData.customer}
Problem: ${cpsData.problem}
Solution: ${cpsData.solution}

Generate exactly 3 Leap of Faith Assumptions using this format:
[LOFA #1]: [assumption]
[LOFA #2]: [assumption]
[LOFA #3]: [assumption]

Focus on assumptions that, if proven wrong, would significantly jeopardize the viability of the idea.`;
    } else if (circleType === 'hypothesis') {
      systemPrompt = `You are a Hypothesis Framer for Startup Validation expert in hypothesis-driven product validation. Your task is to convert high-level assumptions into specific, testable hypotheses that can guide customer discovery interviews and experiments.`;
      
      prompt = `Based on this CPS statement:
Customer: ${cpsData.customer}
Problem: ${cpsData.problem}
Solution: ${cpsData.solution}

Generate exactly 3 testable hypotheses using this format:
Hypothesis 1: We believe that [customer segment] will [specific behavior] because [reason or pain point].
Hypothesis 2: We believe that [customer segment] will [specific behavior] because [reason or pain point].
Hypothesis 3: We believe that [customer segment] will [specific behavior] because [reason or pain point].

Make each hypothesis falsifiable and testable through real-world interaction.`;
    } else {
      systemPrompt = `You are a business validation expert helping founders identify key assumptions that need validation.`;
      
      prompt = `Based on this CPS statement:
Customer: ${cpsData.customer}
Problem: ${cpsData.problem}
Solution: ${cpsData.solution}

Generate 3 key validation questions that need to be answered:`;
    }

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${systemPrompt}\n\n${prompt}`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 800,
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate AI response');
      }

      const data = await response.json();
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      // Parse the response into array format
      const lines = content.split('\n').filter(line => line.trim());
      return lines.length > 0 ? lines : [content];
    } catch (error) {
      console.error('Error generating AI response:', error);
      return [`Error generating response. Please check your API key and try again.`];
    }
  };

  const handleCircleClick = async (circleType: string) => {
    setSelectedCircle(circleType);
    setAnalysis({ assumptions: [], isAnalyzing: true });

    const aiResponse = await generateAIResponse(circleType);
    setAnalysis({
      assumptions: aiResponse,
      isAnalyzing: false
    });
  };

  const circles = [
    {
      id: 'leap-of-faith',
      title: 'Leap of Faith',
      icon: Target,
      position: 'top-8 left-8',
      color: 'construction-yellow'
    },
    {
      id: 'hypothesis',
      title: 'Respective Hypothesis',
      icon: Lightbulb,
      position: 'top-8 right-8',
      color: 'construction-green'
    },
    {
      id: 'assumption',
      title: 'Assumption',
      icon: Brain,
      position: 'bottom-20 left-1/2 transform -translate-x-1/2',
      color: 'construction-orange'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 relative overflow-hidden">
      {/* Blueprint grid background */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--blueprint-blue)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--blueprint-blue)) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-foreground">
            Hypothesis Validation Framework
          </h1>
          <div className="max-w-4xl mx-auto space-y-4 text-muted-foreground">
            <p className="text-lg">
              Welcome to your Hypothesis Validation Framework! 🎉
            </p>
            <p>
              This is where we start turning your ideas into testable assumptions. You'll dive into your leap of faith assumptions—those core beliefs that, if wrong, could jeopardize your entire business idea. Click on any of the circles to explore each step and get insights generated by our AI Lean Startup Strategist. Don't worry, we've got your back!
            </p>
            <p className="font-semibold">
              Start by clicking through to identify those leap-of-faith assumptions. These assumptions are critical to moving your idea forward with confidence!
            </p>
          </div>
        </div>

        {/* API Key Input */}
        {showApiKeyInput && (
          <div className="max-w-md mx-auto mb-8 p-4 bg-card border rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Key className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">OpenAI API Key Required</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Enter your Gemini API key to generate AI-powered insights:
            </p>
            <div className="flex gap-2">
              <Input
                type="password"
                placeholder="sk-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={() => setShowApiKeyInput(false)}
                disabled={!apiKey.trim()}
              >
                Save
              </Button>
            </div>
          </div>
        )}

        {/* Interactive Circles */}
        <div className="relative h-[500px] mb-12">
          
          {circles.map((circle) => {
            const IconComponent = circle.icon;
            return (
              <button
                key={circle.id}
                onClick={() => handleCircleClick(circle.id)}
                className={`absolute ${circle.position} w-48 h-48 rounded-full border-4 border-${circle.color} bg-background/90 backdrop-blur-sm hover:bg-${circle.color}/10 transition-all duration-300 hover:scale-105 flex flex-col items-center justify-center group shadow-xl animate-fade-in`}
                style={{ zIndex: 2 }}
              >
                <IconComponent className={`w-16 h-16 text-${circle.color} mb-3`} />
                <span className={`text-base font-semibold text-${circle.color} text-center leading-tight px-2`}>
                  {circle.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* AI Analysis Section */}
        {selectedCircle && (
          <div className="bg-card/80 backdrop-blur-sm rounded-lg p-6 mb-8 border shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-bold">
                {selectedCircle === 'leap-of-faith' && '🚀 Lean Startup Strategist - Leap of Faith Assumptions'}
                {selectedCircle === 'hypothesis' && '🤖 Hypothesis Framer - Testable Hypotheses'}
                {selectedCircle === 'assumption' && '🚀 Your Lean Startup Strategist is here!'}
              </h3>
            </div>
            
            <div className="mb-6">
              {selectedCircle === 'leap-of-faith' && (
                <div>
                  <p className="text-muted-foreground mb-4">
                    <strong>Goal:</strong> Identify the most critical Leap of Faith Assumptions (LOFAs) that underpin your CPS logic, focusing on those that could cause the business to fail if proven false.
                  </p>
                  <p className="text-muted-foreground mb-4">
                    As an expert in hypothesis-driven entrepreneurship with deep understanding of Eric Ries' Lean Startup methodology, I specialize in helping early-stage founders break down their business ideas into testable assumptions.
                  </p>
                </div>
              )}
              
              {selectedCircle === 'hypothesis' && (
                <div>
                  <p className="text-muted-foreground mb-4">
                    <strong>Task:</strong> Convert high-level assumptions (Leap of Faith Assumptions) into specific, testable hypotheses that can guide customer discovery interviews and experiments.
                  </p>
                  <p className="text-muted-foreground mb-4">
                    I'm converting each assumption into a clear, falsifiable hypothesis using the format: "We believe that [customer segment] will [specific behavior] because [reason or pain point]."
                  </p>
                </div>
              )}
              
              {selectedCircle === 'assumption' && (
                <div>
                  <p className="text-muted-foreground mb-4">
                    Let's dig deep into your CPS (Customer–Problem–Solution) to extract key insights for your business validation.
                  </p>
                  <p className="text-muted-foreground mb-4">
                    We'll examine your customer, the problem, and the proposed solution to pinpoint critical elements that need validation.
                  </p>
                </div>
              )}
            </div>

            {analysis.isAnalyzing ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                {selectedCircle === 'leap-of-faith' && 'Analyzing Leap of Faith Assumptions...'}
                {selectedCircle === 'hypothesis' && 'Generating testable hypotheses...'}
                {selectedCircle === 'assumption' && 'Analyzing your assumptions...'}
              </div>
            ) : analysis.assumptions && analysis.assumptions.length > 0 ? (
              <div>
                <h4 className="text-lg font-semibold mb-4">
                  {selectedCircle === 'leap-of-faith' && '🧠 Leap of Faith Assumptions Identified:'}
                  {selectedCircle === 'hypothesis' && '📋 Testable Hypotheses Generated:'}
                  {selectedCircle === 'assumption' && '🧠 Analysis Results:'}
                </h4>
                <div className="space-y-3">
                  {analysis.assumptions.map((assumption, index) => (
                    <div key={index} className="bg-muted/50 p-3 rounded-lg">
                      <p className="text-foreground">{assumption}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to CPS Builder
          </Button>
          
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Feel like tweaking your answers? No problem! Click "Back to CPS Builder" to revisit your Customer, Problem, and Solution statement.
            </p>
          </div>

          <Button 
            onClick={onNext}
            className="bg-primary hover:bg-primary/90"
          >
            Next Step
          </Button>
        </div>
        
        <div className="text-center mt-4">
          <p className="text-sm text-muted-foreground">
            Ready to move to the next phase? Click "Next Step" to get actionable insights based on your answers in the CPS Hypothesis Builder and continue strengthening your framework.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LeapOfFaithBuilder;