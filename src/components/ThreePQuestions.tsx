import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface ThreePQuestionsProps {
  onBack: () => void;
  onContinue: (answers: ThreePAnswers) => void;
}

export interface ThreePAnswers {
  passion: string;
  potential: string;
  people: string;
}

const ThreePQuestions = ({ onBack, onContinue }: ThreePQuestionsProps) => {
  const [answers, setAnswers] = useState<ThreePAnswers>({
    passion: '',
    potential: '',
    people: ''
  });

  const handleInputChange = (field: keyof ThreePAnswers, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleContinue = () => {
    if (answers.passion.trim() && answers.potential.trim() && answers.people.trim()) {
      onContinue(answers);
    }
  };

  const isComplete = answers.passion.trim() && answers.potential.trim() && answers.people.trim();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-secondary/20 blueprint-bg p-4">
      <div className="w-full max-w-3xl mx-auto py-8">
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-gradient-construction rounded-full flex items-center justify-center mx-auto mb-6 shadow-construction">
            <span className="text-4xl">🏗️</span>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Bob's 3 P's Framework
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Before we start building, let's lay the foundation! These three pillars will help Bob understand what makes your idea construction-ready.
          </p>
        </div>

        <div className="space-y-8">
          {/* Passion Card */}
          <Card className="construction-sign border-2 border-primary/20">
            <CardHeader>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-construction-yellow to-construction-orange rounded-full flex items-center justify-center shadow-playful">
                  <span className="text-2xl">🔥</span>
                </div>
                <div>
                  <CardTitle className="text-2xl text-primary-foreground flex items-center gap-2">
                    <span className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold">1</span>
                    Passion
                  </CardTitle>
                  <CardDescription className="text-primary-foreground/80 text-base">
                    🔥 Why solving this problem fires you up every morning
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="bg-card rounded-lg p-6 m-4 mt-0">
              <Label htmlFor="passion" className="text-sm font-medium text-foreground mb-2 block">
                What drives your passion for this problem?
              </Label>
              <Textarea
                id="passion"
                placeholder="Tell Bob what keeps you up at night thinking about this problem and why you HAVE to solve it..."
                value={answers.passion}
                onChange={(e) => handleInputChange('passion', e.target.value)}
                className="min-h-[120px] border-2 focus:border-primary"
              />
            </CardContent>
          </Card>

          {/* Potential Card */}
          <Card className="border-2 border-construction-green/30 bg-gradient-to-r from-construction-green/10 to-construction-green/5">
            <CardHeader>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-construction-green to-construction-green/80 rounded-full flex items-center justify-center shadow-playful">
                  <span className="text-2xl">💪</span>
                </div>
                <div>
                  <CardTitle className="text-2xl text-foreground flex items-center gap-2">
                    <span className="bg-construction-green text-white w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold">2</span>
                    Potential
                  </CardTitle>
                  <CardDescription className="text-muted-foreground text-base">
                    💪 Your superpowers that make you the best builder for this job
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="bg-card rounded-lg p-6 m-4 mt-0">
              <Label htmlFor="potential" className="text-sm font-medium text-foreground mb-2 block">
                What makes you uniquely qualified to build this?
              </Label>
              <Textarea
                id="potential"
                placeholder="What's your construction expertise? What past projects prove you can build this better than anyone else..."
                value={answers.potential}
                onChange={(e) => handleInputChange('potential', e.target.value)}
                className="min-h-[120px] border-2 focus:border-construction-green"
              />
            </CardContent>
          </Card>

          {/* People Card */}
          <Card className="border-2 border-secondary/30 bg-gradient-to-r from-secondary/10 to-secondary/5">
            <CardHeader>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-secondary to-secondary/80 rounded-full flex items-center justify-center shadow-blueprint">
                  <span className="text-2xl">👥</span>
                </div>
                <div>
                  <CardTitle className="text-2xl text-foreground flex items-center gap-2">
                    <span className="bg-secondary text-secondary-foreground w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold">3</span>
                    People
                  </CardTitle>
                  <CardDescription className="text-muted-foreground text-base">
                    👥 The community who will live and work in what you build
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="bg-card rounded-lg p-6 m-4 mt-0">
              <Label htmlFor="people" className="text-sm font-medium text-foreground mb-2 block">
                Who are you building this for?
              </Label>
              <Textarea
                id="people"
                placeholder="Who will move into this 'building' you're constructing? How will their daily lives be transformed..."
                value={answers.people}
                onChange={(e) => handleInputChange('people', e.target.value)}
                className="min-h-[120px] border-2 focus:border-secondary"
              />
            </CardContent>
          </Card>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-12 pt-8 border-t-2 border-primary/20">
          <Button variant="outline" onClick={onBack} className="flex items-center gap-2 border-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Idea
          </Button>
          
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">
              🚧 Foundation Complete: {Object.values(answers).filter(Boolean).length}/3
            </p>
            <Button 
              onClick={handleContinue}
              disabled={!isComplete}
              className="flex items-center gap-2 bg-gradient-construction hover:opacity-90 text-primary-foreground font-bold px-8"
              size="lg"
            >
              Start Building! 
              <span className="text-xl">🏗️</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreePQuestions;