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
  onNext: (lofaAssumptions: string[]) => void;
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
  const [leapOfFaithResults, setLeapOfFaithResults] = useState<string[]>([]);
  const [apiKey, setApiKey] = useState<string>('');
  const [showApiKeyInput, setShowApiKeyInput] = useState<boolean>(false);

  const generateAIResponse = async (circleType: string) => {
    if (!apiKey.trim()) {
      setShowApiKeyInput(true);
      return;
    }

    let prompt = '';
    let systemPrompt = '';

    if (circleType === 'assumption') {
      systemPrompt = `🧠 Agent & Task Design Prompt: Generate Leap of Faith Assumptions
🔹 Agent Definition
Role: Lean Startup Strategist

Goal: Identify the most critical Leap of Faith Assumptions (LOFAs) that underpin a founder's CPS logic, focusing on those that could cause the business to fail if proven false.

Backstory: You are an expert in hypothesis-driven entrepreneurship with a deep understanding of Eric Ries' Lean Startup methodology. You specialize in helping early-stage founders break down their business ideas into testable assumptions. Your superpower is translating abstract ideas into clear, falsifiable leaps of faith that can be validated through customer discovery.

🔸 Task Definition
Task Name: Extract Leap of Faith Assumptions from CPS

Task Description: The user will provide their CPS (Customer–Problem–Solution) statement. Your job is to analyze this input and extract 2–3 Leap of Faith Assumptions that, if proven wrong, would significantly jeopardize the viability of the idea. These assumptions should focus on beliefs the entrepreneur is making about customer behavior, willingness to pay, problem relevance, or the effectiveness of the solution.

Steps to Perform:
1. Carefully parse the CPS input to identify: Who the customer is, What problem they are believed to have, What solution is proposed to solve it
2. Determine the implicit assumptions the founder is making for the solution to work
3. Identify which of these are "leap of faith" assumptions — the riskiest beliefs that must be true
4. Output 2–3 assumptions phrased as falsifiable beliefs (i.e., they can be validated or invalidated through interviews or experiments)

Expected Output: A list of 2–3 Leap of Faith Assumptions written in this format:
[LOFA #1]: [assumption]
[LOFA #2]: [assumption]  
[LOFA #3]: [assumption]`;
      
      prompt = `Based on this CPS statement:
Customer: ${cpsData.customer}
Problem: ${cpsData.problem}
Solution: ${cpsData.solution}

Generate 2-3 Leap of Faith Assumptions using the exact format specified in the task definition above. Focus on assumptions that, if proven wrong, would significantly jeopardize the viability of the idea.`;
    } else if (circleType === 'hypothesis') {
      if (!leapOfFaithResults || leapOfFaithResults.length === 0) {
        return ['Please click on "Leap of Faith Assumptions" first to generate assumptions before creating hypotheses.'];
      }
      
      systemPrompt = `🤖 Agent Prompt: Generate Hypotheses from Leap of Faith Assumptions
🔹 Agent Role: Hypothesis Framer for Startup Validation

You are an expert in hypothesis-driven product validation. Your job is to take high-level assumptions (Leap of Faith Assumptions) and refine them into specific, falsifiable hypotheses that can guide customer discovery interviews and experiments. You do not interview users — you only create structured hypotheses.

🔸 Task Name: Create Testable Hypotheses from Leap of Faith Assumptions

📝 Task Description: You will receive 2–3 Leap of Faith Assumptions. These are risky, unproven beliefs that underpin a startup idea. Your job is to convert each into a clear, falsifiable hypothesis — something that can be validated or invalidated through real-world interaction.

🪜 Steps to Perform:
1. Read each Leap of Faith Assumption carefully
2. For each assumption, ask: "What would the world look like if this were true?" "How could we test this through real user behavior?"
3. Rewrite the assumption into a hypothesis using the format: We believe that [customer segment] will [specific behavior] because [reason or pain point]

✅ Expected Output Format:
Hypothesis 1 (from LOFA 1): We believe that [customer segment] will [behavior] because [reason].
Hypothesis 2 (from LOFA 2): We believe that [customer segment] will [behavior] because [reason].
Hypothesis 3 (optional): We believe that [customer segment] will [behavior] because [reason].`;
      
      prompt = `Based on these Leap of Faith Assumptions:
${leapOfFaithResults.join('\n')}

And this CPS context:
Customer: ${cpsData.customer}
Problem: ${cpsData.problem}
Solution: ${cpsData.solution}

Convert each Leap of Faith Assumption into testable hypotheses using the exact format specified above. Make each hypothesis falsifiable and testable through real-world interaction.`;
    } else {
      systemPrompt = `You are a business validation expert helping founders identify key assumptions that need validation.`;
      
      prompt = `Based on this CPS statement:
Customer: ${cpsData.customer}
Problem: ${cpsData.problem}
Solution: ${cpsData.solution}

Generate 3 key validation questions that need to be answered:`;
    }

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
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
        if (response.status === 429) {
          throw new Error('QUOTA_EXCEEDED');
        }
        throw new Error('Failed to generate AI response');
      }

      const data = await response.json();
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      // Parse the response into array format
      const lines = content.split('\n').filter(line => line.trim());
      return lines.length > 0 ? lines : [content];
    } catch (error) {
      console.error('Error generating AI response:', error);
      if (error instanceof Error && error.message === 'QUOTA_EXCEEDED') {
        return [`You've exceeded your daily Gemini API quota (50 requests). Please wait until tomorrow or upgrade your API plan for higher limits.`];
      }
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

    // Store leap of faith results for hypothesis generation
    if (circleType === 'assumption') {
      setLeapOfFaithResults(aiResponse);
    }
  };

  const circles = [
    {
      id: 'assumption',
      title: 'Leap of Faith Assumptions',
      icon: Brain,
      position: 'top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2',
      color: 'construction-orange'
    },
    {
      id: 'hypothesis',
      title: 'Respective Hypothesis',
      icon: Lightbulb,
      position: 'top-1/2 right-1/4 transform translate-x-1/2 -translate-y-1/2',
      color: 'construction-green'
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
              <h3 className="font-semibold">Gemini API Key Required</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Enter your Gemini API key to generate AI-powered insights:
            </p>
            <div className="flex gap-2">
              <Input
                type="password"
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
                className={`absolute ${circle.position} w-56 h-56 rounded-full border-4 ${
                  circle.id === 'assumption' ? 'border-construction-orange text-construction-orange' : 
                  'border-construction-green text-construction-green'
                } bg-background/90 backdrop-blur-sm hover:bg-opacity-10 transition-all duration-300 hover:scale-105 active:scale-95 flex flex-col items-center justify-center group shadow-xl animate-fade-in`}
                style={{ zIndex: 2 }}
              >
                <IconComponent className="w-16 h-16 mb-3" />
                <span className="text-base font-semibold text-center leading-tight px-2">
                  {circle.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* AI Analysis Section */}
        {selectedCircle && (
        <div className={`bg-gradient-to-br from-card/90 to-background/80 backdrop-blur-sm rounded-xl p-6 mb-8 border-2 ${
          selectedCircle === 'assumption' ? 'border-construction-orange/60' : 'border-construction-green/60'
        } shadow-construction animate-fade-in`}>
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                selectedCircle === 'assumption' ? 'bg-construction-orange' : 'bg-construction-green'
              }`}>
                {selectedCircle === 'assumption' ? (
                  <Brain className="w-6 h-6 text-white" />
                ) : (
                  <Lightbulb className="w-6 h-6 text-white" />
                )}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground">Analysis</h3>
                <p className="text-sm text-construction-orange font-medium">🚧 Business Insights under construction...</p>
              </div>
            </div>
            
            <div className="mb-6">
              {(leapOfFaithResults?.length ?? 0) === 0 && selectedCircle === 'hypothesis' && (
                <p className="text-yellow-600 mb-4 font-medium">
                  ⚠️ Please click on "Leap of Faith Assumptions" first to generate assumptions before creating hypotheses.
                </p>
              )}
            </div>

            {analysis.isAnalyzing ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                {selectedCircle === 'leap-of-faith' && 'Analyzing Leap of Faith Assumptions...'}
                {selectedCircle === 'hypothesis' && 'Generating testable hypotheses...'}
                {selectedCircle === 'assumption' && 'Generating testable hypotheses from your assumptions...'}
              </div>
            ) : analysis.assumptions && analysis.assumptions.length > 0 ? (
              <div>
                <div className="space-y-4">
                  {(analysis.assumptions || []).map((assumption, index) => (
                    <div key={index} className="bg-gradient-to-r from-construction-yellow/10 to-construction-orange/10 border-l-4 border-construction-yellow p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-construction-yellow rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <p className="text-foreground font-medium leading-relaxed">{assumption}</p>
                      </div>
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
            onClick={() => onNext(leapOfFaithResults)}
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