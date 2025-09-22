import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Users, AlertTriangle, Lightbulb } from 'lucide-react';

interface CPSHypothesisBuilderProps {
  onBack: () => void;
  onContinue: (data: CPSData) => void;
}

interface CPSData {
  customer: string;
  problem: string;
  solution: string;
}

const CPSHypothesisBuilder = ({ onBack, onContinue }: CPSHypothesisBuilderProps) => {
  const [formData, setFormData] = useState<CPSData>({
    customer: '',
    problem: '',
    solution: ''
  });

  const handleSubmit = () => {
    if (formData.customer.trim() && formData.problem.trim() && formData.solution.trim()) {
      onContinue(formData);
    }
  };

  const isFormValid = formData.customer.trim() && formData.problem.trim() && formData.solution.trim();

  return (
    <div className="min-h-screen blueprint-bg">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-construction-orange mb-4">
            CPS Hypothesis Builder
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Let's build your Customer-Problem-Solution hypothesis step by step
          </p>
        </div>

        {/* Form Sections */}
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Customer Section */}
          <div className="bg-construction-yellow/20 rounded-xl p-8 border-2 border-construction-yellow/30">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-construction-yellow rounded-lg">
                <Users className="w-6 h-6 text-construction-orange" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-construction-orange">Customer</h2>
                <p className="text-muted-foreground">Who is your targeted customer? Try to be specific.</p>
              </div>
            </div>
            <Textarea
              value={formData.customer}
              onChange={(e) => setFormData(prev => ({ ...prev, customer: e.target.value }))}
              placeholder="e.g., Small business owners with 5-50 employees who struggle with project management..."
              className="min-h-[100px] text-base"
            />
          </div>

          {/* Problem Section */}
          <div className="bg-construction-orange/10 rounded-xl p-8 border-2 border-construction-orange/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-construction-orange/20 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-construction-orange" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-construction-orange">Problem</h2>
                <p className="text-muted-foreground">What kind of problems are your target users facing?</p>
              </div>
            </div>
            <Textarea
              value={formData.problem}
              onChange={(e) => setFormData(prev => ({ ...prev, problem: e.target.value }))}
              placeholder="e.g., They waste 3+ hours daily on inefficient communication and task tracking..."
              className="min-h-[100px] text-base"
            />
          </div>

          {/* Solution Section */}
          <div className="bg-construction-green/20 rounded-xl p-8 border-2 border-construction-green/30">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-construction-green/20 rounded-lg">
                <Lightbulb className="w-6 h-6 text-construction-green" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-construction-green">Solution</h2>
                <p className="text-muted-foreground">How do you solve your customers' problem?</p>
              </div>
            </div>
            <Textarea
              value={formData.solution}
              onChange={(e) => setFormData(prev => ({ ...prev, solution: e.target.value }))}
              placeholder="e.g., A simple project management tool that integrates all communication and automates task tracking..."
              className="min-h-[100px] text-base"
            />
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="max-w-4xl mx-auto mt-12 flex flex-col sm:flex-row justify-between items-center gap-4">
          <Button
            variant="outline"
            onClick={onBack}
            className="flex items-center gap-2 text-base px-6 py-3"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to the Video
          </Button>
          
          <Button
            onClick={handleSubmit}
            disabled={!isFormValid}
            className="flex items-center gap-2 text-base px-8 py-3 bg-construction-yellow text-construction-orange hover:bg-construction-yellow/90"
          >
            Continue Building
            <ArrowLeft className="w-5 h-5 rotate-180" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CPSHypothesisBuilder;