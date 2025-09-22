import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Brain, Target, Lightbulb } from 'lucide-react';

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

  const handleCircleClick = async (circleType: string) => {
    setSelectedCircle(circleType);
    setAnalysis({ assumptions: [], isAnalyzing: true });

    // Simulate AI analysis
    setTimeout(() => {
      const mockOutput = generateMockOutput(cpsData, circleType);
      setAnalysis({
        assumptions: mockOutput,
        isAnalyzing: false
      });
    }, 2000);
  };

  const generateMockOutput = (data: any, type: string) => {
    if (type === 'leap-of-faith') {
      // Generate specific Leap of Faith Assumptions based on actual CPS data
      const customerSegment = data.customer;
      const problemArea = data.problem;
      const proposedSolution = data.solution;
      
      return [
        `[LOFA #1]: ${customerSegment} are actively experiencing ${problemArea.toLowerCase()} as a significant pain point that affects their daily operations.`,
        `[LOFA #2]: ${customerSegment} are willing to pay for ${proposedSolution.toLowerCase()} and will prioritize it over existing alternatives.`,
        `[LOFA #3]: ${proposedSolution} will deliver measurable value that ${customerSegment.toLowerCase()} can't achieve through current methods or competitors.`
      ];
    } else if (type === 'hypothesis') {
      // Generate specific testable hypotheses
      const customerSegment = data.customer;
      const problemArea = data.problem;
      const proposedSolution = data.solution;
      
      return [
        `Hypothesis 1: We believe that ${customerSegment.toLowerCase()} will actively seek out ${proposedSolution.toLowerCase()} because ${problemArea.toLowerCase()} is costing them time and resources daily.`,
        `Hypothesis 2: We believe that ${customerSegment.toLowerCase()} will choose our ${proposedSolution.toLowerCase()} over existing solutions because it addresses their specific pain points more directly.`,
        `Hypothesis 3: We believe that ${customerSegment.toLowerCase()} will see improved outcomes within 30 days of using ${proposedSolution.toLowerCase()} because it eliminates the friction they currently experience with ${problemArea.toLowerCase()}.`
      ];
    } else {
      // Assumption analysis - focus on validation aspects
      return [
        `Key Validation Point: How do we verify that ${data.customer} actually experience ${data.problem.toLowerCase()} as frequently as we assume?`,
        `Market Research Need: What evidence do we have that ${data.customer.toLowerCase()} are dissatisfied with current solutions?`,
        `Behavioral Assumption: Will ${data.customer.toLowerCase()} actually change their current workflow to adopt ${data.solution.toLowerCase()}?`
      ];
    }
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
            ) : analysis.assumptions.length > 0 ? (
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