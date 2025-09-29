import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, MessageSquare, Copy, CheckCircle, Users, Download } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface MomTestBuilderProps {
  lofaData: string[];
  businessIdea: string;
  cpsData: any;
  onBack: () => void;
  onComplete: () => void;
}

interface MomTestQuestion {
  q: string;
  assumption_tag: string;
  why_it_works: string;
  signal_to_listen_for: string;
  priority: number;
}

interface Hypothesis {
  assumption_category: string;
  hypothesis: string;
  audience: string;
  questions: MomTestQuestion[];
  _warning?: string;
  _errors?: string[];
}

const MomTestBuilder = ({ lofaData, businessIdea, cpsData, onBack, onComplete }: MomTestBuilderProps) => {
  const [hypotheses, setHypotheses] = useState<Hypothesis[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [hasOfflineBackup, setHasOfflineBackup] = useState(false);

  useEffect(() => {
    generateMomTestQuestions();
  }, [lofaData]);

  const generateMomTestQuestions = async () => {
    setIsGenerating(true);
    
    try {
      const generatedHypotheses: Hypothesis[] = [];
      
      // Generate questions for each LOFA
      for (const lofa of lofaData) {
        const { assumption_category, hypothesis } = parseLOFA(lofa);
        
        const { data, error } = await supabase.functions.invoke('generate-mom-test', {
          body: {
            idea: businessIdea,
            passion: (cpsData as any).passion || '',
            qualified: (cpsData as any).qualified || '',
            audience: cpsData.customer,
            assumption_category,
            hypothesis,
            context: `${cpsData.problem} - ${cpsData.solution}`
          }
        });

        if (error) {
          console.error('Error calling generate-mom-test:', error);
          throw new Error(error.message);
        }

        if (data) {
          generatedHypotheses.push(data);
          // Check if any response used offline backup
          if (data._warning) {
            setHasOfflineBackup(true);
          }
        }
      }
      
      setHypotheses(generatedHypotheses);
    } catch (error) {
      console.error('Error generating Mom Test questions:', error);
      toast.error('Failed to generate interview questions. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const parseLOFA = (lofa: string): { assumption_category: string; hypothesis: string } => {
    // Extract category and hypothesis from LOFA string
    let category = 'Demand';
    
    if (lofa.includes('pay') || lofa.includes('price') || lofa.includes('monetiz')) {
      category = 'Monetization';
    } else if (lofa.includes('value') || lofa.includes('benefit')) {
      category = 'Value';
    } else if (lofa.includes('acquire') || lofa.includes('channel') || lofa.includes('reach')) {
      category = 'Acquisition/Channel';
    } else if (lofa.includes('retain') || lofa.includes('keep') || lofa.includes('return')) {
      category = 'Retention';
    } else if (lofa.includes('grow') || lofa.includes('referral') || lofa.includes('spread')) {
      category = 'Growth/Referral';
    } else if (lofa.includes('feasib') || lofa.includes('workflow') || lofa.includes('implement')) {
      category = 'Feasibility/Workflow';
    }

    // Clean up the hypothesis text
    const hypothesis = lofa.replace(/^\[LOFA #\d+\]:\s*/, '').trim();

    return { assumption_category: category, hypothesis };
  };


  const copyQuestions = async (hypothesisIndex: number) => {
    const hypothesis = hypotheses[hypothesisIndex];
    const text = `${hypothesis.assumption_category} - ${hypothesis.hypothesis}\n\nMom-Test Questions:\n${hypothesis.questions.map((q, i) => `${i + 1}. ${q.q}`).join('\n')}`;
    
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
      `${hypothesis.assumption_category} - ${hypothesis.hypothesis}\n\nMom-Test Questions:\n${hypothesis.questions.map((q, i) => `${i + 1}. ${q.q}\n   Why it works: ${q.why_it_works}\n   Listen for: ${q.signal_to_listen_for}\n   Priority: ${q.priority}`).join('\n\n')}\n\n`
    ).join('\n\n---\n\n');
    
    const finalText = `Interview Guide for: ${businessIdea}\nTarget Audience: ${cpsData.customer}\n\n${allText}`;
    
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
          {/* Offline Backup Warning */}
          {hasOfflineBackup && (
            <Card className="border-2 border-yellow-500/50 bg-yellow-50/50 dark:bg-yellow-950/20">
              <CardContent className="py-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">⚠️</span>
                  <div>
                    <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-1">
                      Using Offline Backup
                    </h3>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      LLM providers are currently unavailable. Questions generated using deterministic backup logic.
                      They still follow Mom Test principles but may be less tailored to your specific context.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

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
                  Generating AI-powered Mom Test questions...
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6 pb-32">
              {hypotheses.map((hypothesis, index) => (
                <Card key={index} className="border-2 border-construction-green/30">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-construction-green mb-2">
                          {hypothesis.assumption_category}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Target: {hypothesis.audience}
                        </p>
                      </div>
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
                      <h4 className="font-semibold mb-2 text-construction-orange">Hypothesis:</h4>
                      <p className="text-muted-foreground italic bg-muted/50 p-3 rounded-lg">
                        "{hypothesis.hypothesis}"
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-4 text-construction-orange">Mom-Test Questions:</h4>
                      <div className="space-y-4">
                        {hypothesis.questions.map((question, qIndex) => (
                          <div key={qIndex} className="border-l-4 border-construction-yellow pl-4 py-2">
                            <div className="flex gap-3 mb-2">
                              <span className="text-construction-yellow font-bold min-w-[24px]">
                                {qIndex + 1}.
                              </span>
                              <p className="text-foreground font-medium">{question.q}</p>
                            </div>
                            <div className="ml-8 space-y-1 text-sm text-muted-foreground">
                              <p className="flex items-start gap-2">
                                <span className="font-semibold text-construction-green">✓</span>
                                <span><strong>Why it works:</strong> {question.why_it_works}</span>
                              </p>
                              <p className="flex items-start gap-2">
                                <span className="font-semibold text-construction-orange">👂</span>
                                <span><strong>Listen for:</strong> {question.signal_to_listen_for}</span>
                              </p>
                              <p className="flex items-center gap-2">
                                <span className="font-semibold">⭐</span>
                                <span><strong>Priority:</strong> {question.priority}/3</span>
                              </p>
                            </div>
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

        {/* Sticky Footer CTA */}
        {hypotheses.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-construction-orange/95 backdrop-blur-sm border-t-4 border-construction-yellow shadow-2xl z-50">
            <div className="container mx-auto px-4 py-6">
              <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <h3 className="text-white font-bold text-lg mb-1">
                    Ready to validate your assumptions?
                  </h3>
                  <p className="text-white/90 text-sm">
                    Connect with real {cpsData.customer} to test these questions
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={onBack}
                    className="bg-white text-construction-orange hover:bg-white/90"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    onClick={onComplete}
                    className="bg-construction-yellow text-construction-orange hover:bg-construction-yellow/90 font-bold px-8"
                  >
                    <Users className="w-5 h-5 mr-2" />
                    Let's get you connected to people
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MomTestBuilder;