import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, MessageSquare, Copy, CheckCircle, Users, Download } from 'lucide-react';
import { toast } from 'sonner';

interface MomTestBuilderProps {
  lofaData: string[];
  businessIdea: string;
  cpsData: any;
  onBack: () => void;
  onComplete: () => void;
}

interface Hypothesis {
  statement: string;
  questions: string[];
}

const MomTestBuilder = ({ lofaData, businessIdea, cpsData, onBack, onComplete }: MomTestBuilderProps) => {
  const [hypotheses, setHypotheses] = useState<Hypothesis[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    generateMomTestQuestions();
  }, [lofaData]);

  const generateMomTestQuestions = async () => {
    setIsGenerating(true);
    
    try {
      // Convert LOFAs to hypotheses and generate Mom Test questions
      const generatedHypotheses: Hypothesis[] = [];
      
      lofaData.forEach((lofa, index) => {
        // Convert LOFA to hypothesis format
        const hypothesis = convertLOFAToHypothesis(lofa, cpsData);
        
        // Generate Mom Test questions for each hypothesis
        const questions = generateQuestionsForHypothesis(lofa, cpsData);
        
        generatedHypotheses.push({
          statement: hypothesis,
          questions: questions
        });
      });
      
      setHypotheses(generatedHypotheses);
    } catch (error) {
      console.error('Error generating Mom Test questions:', error);
      toast.error('Failed to generate interview questions. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const convertLOFAToHypothesis = (lofa: string, cpsData: any): string => {
    // Extract key elements from LOFA and convert to hypothesis format
    if (lofa.includes('willing to pay')) {
      return `We believe that ${cpsData.customer} will pay for our solution because they experience significant pain from ${cpsData.problem.toLowerCase()}.`;
    } else if (lofa.includes('demand') || lofa.includes('market')) {
      return `We believe that there is sufficient market demand for our solution among ${cpsData.customer} in our target area.`;
    } else if (lofa.includes('differentiate') || lofa.includes('unique')) {
      return `We believe that our unique approach to ${cpsData.solution.toLowerCase()} will be compelling enough for ${cpsData.customer} to choose us over alternatives.`;
    } else {
      return `We believe that ${cpsData.customer} will adopt our solution because ${lofa.toLowerCase()}.`;
    }
  };

  const generateQuestionsForHypothesis = (lofa: string, cpsData: any): string[] => {
    const questions: string[] = [];
    
    if (lofa.includes('willing to pay') || lofa.includes('price')) {
      questions.push(
        "Can you walk me through the last time you spent money to solve a similar problem?",
        "What's the most expensive solution you've tried for this type of issue?",
        "Tell me about a time when you decided NOT to buy something because of the price."
      );
    } else if (lofa.includes('demand') || lofa.includes('customer base') || lofa.includes('market')) {
      questions.push(
        "How often do you currently deal with this type of problem?",
        "What do you do right now when this problem comes up?",
        "Who else do you know that has this same challenge?"
      );
    } else if (lofa.includes('differentiate') || lofa.includes('unique') || lofa.includes('attractive')) {
      questions.push(
        "What solutions have you tried before for this problem?",
        "What made you stop using your previous solution?",
        "Can you describe what would make the perfect solution for you?"
      );
    } else {
      // Default questions based on problem/solution
      questions.push(
        `Tell me about the last time you experienced ${extractProblemKeyword(cpsData.problem)}.`,
        "What's your current process for handling this situation?",
        "Have you ever tried to find a solution for this? What happened?"
      );
    }
    
    return questions;
  };

  const extractProblemKeyword = (problem: string): string => {
    // Extract a key phrase from the problem description
    const words = problem.toLowerCase().split(' ');
    if (words.length > 3) {
      return words.slice(0, 4).join(' ');
    }
    return problem.toLowerCase();
  };

  const copyQuestions = async (hypothesisIndex: number) => {
    const hypothesis = hypotheses[hypothesisIndex];
    const text = `Hypothesis ${hypothesisIndex + 1}:\n${hypothesis.statement}\n\nMom-Test Questions:\n${hypothesis.questions.map(q => `- ${q}`).join('\n')}`;
    
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(hypothesisIndex);
      toast.success('Questions copied to clipboard!');
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (error) {
      toast.error('Failed to copy questions');
    }
  };

  const downloadAllQuestions = () => {
    const allText = hypotheses.map((hypothesis, index) => 
      `Hypothesis ${index + 1}:\n${hypothesis.statement}\n\nMom-Test Questions:\n${hypothesis.questions.map(q => `- ${q}`).join('\n')}\n\n`
    ).join('');
    
    const finalText = `Interview Guide for: ${businessIdea}\n\n${allText}`;
    
    const blob = new Blob([finalText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${businessIdea.slice(0, 20).replace(/[^a-zA-Z0-9]/g, '_')}_interview_guide.txt`;
    link.click();
    URL.revokeObjectURL(url);
    
    toast.success('Interview guide downloaded!');
  };

  return (
    <div className="min-h-screen blueprint-bg">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-construction-orange mb-4">
            Mom Test Interview Guide
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Non-leading questions to validate your assumptions through real customer conversations
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Business Context */}
          <Card className="border-2 border-construction-yellow/30">
            <CardHeader>
              <CardTitle className="text-construction-orange flex items-center gap-2">
                <Users className="w-6 h-6" />
                Interview Context
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-construction-green mb-2">Business Idea:</h3>
                <p className="text-muted-foreground">{businessIdea}</p>
              </div>
              <div>
                <h3 className="font-semibold text-construction-green mb-2">Target Customer:</h3>
                <p className="text-muted-foreground">{cpsData.customer}</p>
              </div>
            </CardContent>
          </Card>

          {/* Generated Questions */}
          {isGenerating ? (
            <Card className="border-2 border-construction-orange/30">
              <CardContent className="py-12 text-center">
                <MessageSquare className="w-16 h-16 mx-auto text-construction-orange animate-pulse mb-4" />
                <p className="text-construction-orange font-medium">
                  Generating Mom Test questions...
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {hypotheses.map((hypothesis, index) => (
                <Card key={index} className="border-2 border-construction-green/30">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-construction-green">
                        Hypothesis {index + 1}
                      </CardTitle>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyQuestions(index)}
                        className="flex items-center gap-2"
                      >
                        {copiedIndex === index ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                        {copiedIndex === index ? 'Copied!' : 'Copy'}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-2 text-construction-orange">Hypothesis Statement:</h4>
                      <p className="text-muted-foreground italic bg-muted/50 p-3 rounded-lg">
                        "{hypothesis.statement}"
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-3 text-construction-orange">Mom-Test Questions:</h4>
                      <div className="space-y-3">
                        {hypothesis.questions.map((question, qIndex) => (
                          <div key={qIndex} className="flex gap-3">
                            <span className="text-construction-yellow font-bold min-w-[24px]">
                              {qIndex + 1}.
                            </span>
                            <p className="text-foreground">{question}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Download Section */}
              {hypotheses.length > 0 && (
                <Card className="border-2 border-construction-yellow/30 bg-construction-yellow/10">
                  <CardContent className="py-6">
                    <div className="text-center">
                      <h3 className="font-semibold text-construction-orange mb-2">
                        Ready for Customer Interviews?
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Download your complete interview guide and start validating your assumptions
                      </p>
                      <Button
                        onClick={downloadAllQuestions}
                        className="bg-construction-green text-white hover:bg-construction-green/90"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Interview Guide
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="max-w-4xl mx-auto mt-12 flex flex-col sm:flex-row justify-between items-center gap-4">
          <Button
            variant="outline"
            onClick={onBack}
            className="flex items-center gap-2 text-base px-6 py-3"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to LOFA Builder
          </Button>
          
          <Button
            onClick={onComplete}
            className="flex items-center gap-2 text-base px-8 py-3 bg-construction-yellow text-construction-orange hover:bg-construction-yellow/90"
          >
            Complete Validation Journey
            <CheckCircle className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MomTestBuilder;