import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Copy, CheckCircle, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface OutreachMessageProps {
  linkedInName: string;
  onBack: () => void;
  onContinue: () => void;
}

const OutreachMessage = ({ linkedInName, onBack, onContinue }: OutreachMessageProps) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const { toast } = useToast();

  const mainTemplate = `Hi ${linkedInName}, I saw your post about [topic]. I'm currently working on [my idea], and I'd love to hear about your experience. Would you be open to a quick chat?`;

  const alternateTemplates = [
    {
      label: "Casual",
      message: `Hey ${linkedInName}! Your post about [topic] really resonated with me. I'm building [my idea] and would love to pick your brain if you have a few minutes?`
    },
    {
      label: "Direct",
      message: `Hi ${linkedInName}, I'm researching [topic] for [my idea]. Your expertise would be incredibly valuable. Could we schedule a brief 15-minute call?`
    },
    {
      label: "Research-heavy",
      message: `Hello ${linkedInName}, I'm conducting customer research for [my idea] and noticed your insightful post about [topic]. Would you be willing to share your perspective in a short interview?`
    }
  ];

  const copyToClipboard = async (text: string, index?: number) => {
    try {
      await navigator.clipboard.writeText(text);
      if (typeof index === 'number') {
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
      } else {
        setCopiedIndex(-1); // Main template
        setTimeout(() => setCopiedIndex(null), 2000);
      }
      
      toast({
        title: "Copied!",
        description: "Message copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  const renderTemplate = (text: string) => {
    return text.split(/(\[[^\]]+\])/).map((part, index) => {
      if (part.match(/\[[^\]]+\]/)) {
        return (
          <span key={index} className="bg-teal-100 text-teal-800 px-1 py-0.5 rounded font-medium">
            {part}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="min-h-screen blueprint-bg p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-construction-blue to-construction-green rounded-full mb-6 shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-construction-blue mb-4">
            Here's Your Outreach Message
          </h1>
        </div>

        {/* Main Message Box */}
        <Card className="mb-6 shadow-xl animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row gap-6 items-start">
              <div className="flex-1">
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-2xl p-6 text-lg leading-relaxed font-medium text-slate-700 select-all cursor-text">
                  {renderTemplate(mainTemplate)}
                </div>
              </div>
              <Button
                onClick={() => copyToClipboard(mainTemplate)}
                className="bg-construction-blue hover:bg-construction-blue/90 text-white px-8 py-4 text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-3 min-w-fit"
                aria-label="Copy main message to clipboard"
              >
                {copiedIndex === -1 ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
                    Copy to Clipboard
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Instruction Note */}
        <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="bg-construction-green/10 border border-construction-green/20 rounded-xl p-4 text-center">
            <p className="text-construction-green font-medium text-lg">
              💬 <strong>Step 3:</strong> Copy this message and send it to the person on LinkedIn.
            </p>
          </div>
        </div>

        {/* Alternate Templates */}
        <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <h3 className="text-xl font-semibold text-construction-blue mb-6 text-center">
            Alternative Message Templates
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {alternateTemplates.map((template, index) => (
              <Card key={index} className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] cursor-pointer group">
                <CardHeader className="pb-3">
                  <CardTitle className="text-construction-blue text-sm font-semibold uppercase tracking-wide flex items-center justify-between">
                    {template.label}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(template.message, index)}
                      className="h-8 w-8 p-0 opacity-60 group-hover:opacity-100 transition-opacity"
                      aria-label={`Copy ${template.label} message to clipboard`}
                    >
                      {copiedIndex === index ? (
                        <CheckCircle className="w-4 h-4 text-construction-green" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-sm text-slate-600 leading-relaxed select-all">
                    {renderTemplate(template.message)}
                  </div>
                  {copiedIndex === index && (
                    <div className="mt-3 text-xs text-construction-green font-medium flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Copied to clipboard!
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Personalization Tip */}
        <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
            <p className="text-amber-700 font-medium">
              💡 <strong>Tip:</strong> Update [topic] and [my idea] with specific details before you send.
            </p>
          </div>
        </div>

        {/* Continue Button */}
        <div className="text-center mb-8 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <Button
            onClick={onContinue}
            className="bg-construction-green hover:bg-construction-green/90 text-white px-12 py-6 text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            I've Sent the Message →
          </Button>
        </div>

        {/* Navigation */}
        <div className="flex justify-center animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <Button
            variant="outline"
            onClick={onBack}
            className="flex items-center gap-2 border-construction-blue text-construction-blue hover:bg-construction-blue/10 px-6 py-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Screenshot Upload
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OutreachMessage;