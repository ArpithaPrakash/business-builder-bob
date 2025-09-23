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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            The 3 P's Framework
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Before we dive deeper, let's understand the foundation of your business idea.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
          {/* Passion Card */}
          <Card className="h-full">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-red-600 dark:text-red-400">P</span>
              </div>
              <CardTitle className="text-xl">Passion</CardTitle>
              <CardDescription>
                Why solving this problem matters deeply to you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Label htmlFor="passion" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Your Answer
              </Label>
              <Textarea
                id="passion"
                placeholder="Share what drives your passion for solving this problem..."
                value={answers.passion}
                onChange={(e) => handleInputChange('passion', e.target.value)}
                className="mt-2 min-h-[120px]"
              />
            </CardContent>
          </Card>

          {/* Potential Card */}
          <Card className="h-full">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">P</span>
              </div>
              <CardTitle className="text-xl">Potential</CardTitle>
              <CardDescription>
                What's your potential to be the best in the world?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Label htmlFor="potential" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Your Answer
              </Label>
              <Textarea
                id="potential"
                placeholder="What past evidence shows you can be the best at this? What unique advantages do you have..."
                value={answers.potential}
                onChange={(e) => handleInputChange('potential', e.target.value)}
                className="mt-2 min-h-[120px]"
              />
            </CardContent>
          </Card>

          {/* People Card */}
          <Card className="h-full">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">P</span>
              </div>
              <CardTitle className="text-xl">People</CardTitle>
              <CardDescription>
                Who will benefit when your idea comes to life?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Label htmlFor="people" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Your Answer
              </Label>
              <Textarea
                id="people"
                placeholder="Describe who your target audience is and how their lives will improve..."
                value={answers.people}
                onChange={(e) => handleInputChange('people', e.target.value)}
                className="mt-2 min-h-[120px]"
              />
            </CardContent>
          </Card>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8">
          <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          
          <Button 
            onClick={handleContinue}
            disabled={!isComplete}
            className="flex items-center gap-2"
          >
            Continue to Video
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ThreePQuestions;