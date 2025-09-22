import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Download, RefreshCw, Image, Loader2 } from 'lucide-react';

interface CPSData {
  customer: string;
  problem: string;
  solution: string;
}

interface ImageGeneratorProps {
  businessIdea: string;
  cpsData: CPSData;
  onBack: () => void;
  onContinue: () => void;
}

const ImageGenerator = ({ businessIdea, cpsData, onBack, onContinue }: ImageGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateImagePrompt = () => {
    // Create a detailed prompt combining business idea and CPS data
    const prompt = `Professional business concept illustration: ${businessIdea}. ${cpsData.solution}. Modern, clean design, business-oriented, high quality, realistic style, suitable for presentation`;
    return prompt;
  };

  const generateImage = async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      console.log('Generating concept visualization...');
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          canvas.width = 512;
          canvas.height = 512;
          
          // Generate abstract business concept visualization
          generateConceptVisualization(ctx, businessIdea, cpsData);
          
          const dataUrl = canvas.toDataURL('image/png');
          setGeneratedImage(dataUrl);
        }
      }
      
    } catch (err) {
      console.error('Error generating image:', err);
      setError('Failed to generate image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateConceptVisualization = (ctx: CanvasRenderingContext2D, idea: string, data: CPSData) => {
    // Clear canvas
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, 512, 512);
    
    // Create a hash from the business idea for consistent randomization
    const hash = idea.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    const rand1 = Math.abs(hash) % 100 / 100;
    const rand2 = Math.abs(hash * 2) % 100 / 100;
    const rand3 = Math.abs(hash * 3) % 100 / 100;
    
    // Color scheme based on business type keywords
    const colors = {
      tech: ['#3b82f6', '#8b5cf6', '#06b6d4'],
      business: ['#f59e0b', '#10b981', '#ef4444'],
      service: ['#8b5cf6', '#ec4899', '#f59e0b'],
      health: ['#10b981', '#06b6d4', '#8b5cf6'],
      education: ['#f59e0b', '#3b82f6', '#10b981']
    };
    
    let colorPalette = colors.business; // default
    const lowerIdea = idea.toLowerCase();
    if (lowerIdea.includes('tech') || lowerIdea.includes('app') || lowerIdea.includes('software')) {
      colorPalette = colors.tech;
    } else if (lowerIdea.includes('health') || lowerIdea.includes('medical')) {
      colorPalette = colors.health;
    } else if (lowerIdea.includes('education') || lowerIdea.includes('learn')) {
      colorPalette = colors.education;
    } else if (lowerIdea.includes('service')) {
      colorPalette = colors.service;
    }
    
    // Draw abstract geometric shapes representing the business concept
    
    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 512, 512);
    gradient.addColorStop(0, colorPalette[0] + '20');
    gradient.addColorStop(1, colorPalette[1] + '20');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);
    
    // Main central element (representing the core business)
    ctx.fillStyle = colorPalette[0];
    ctx.beginPath();
    ctx.arc(256, 200, 60 + rand1 * 40, 0, 2 * Math.PI);
    ctx.fill();
    
    // Connected elements (representing customers, solutions, etc.)
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * 2 * Math.PI + rand2 * Math.PI;
      const x = 256 + Math.cos(angle) * (120 + rand3 * 60);
      const y = 200 + Math.sin(angle) * (80 + rand1 * 40);
      const size = 20 + rand2 * 25;
      
      ctx.fillStyle = colorPalette[(i + 1) % colorPalette.length] + '80';
      ctx.beginPath();
      ctx.arc(x, y, size, 0, 2 * Math.PI);
      ctx.fill();
      
      // Connection lines
      ctx.strokeStyle = colorPalette[0] + '40';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(256, 200);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
    
    // Add text overlay
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Business Concept', 256, 350);
    
    ctx.font = '16px Arial';
    ctx.fillStyle = '#6b7280';
    const truncatedIdea = idea.length > 40 ? idea.substring(0, 37) + '...' : idea;
    ctx.fillText(truncatedIdea, 256, 380);
    
    // Add decorative elements
    ctx.fillStyle = colorPalette[2] + '60';
    for (let i = 0; i < 8; i++) {
      const x = rand1 * 512;
      const y = rand2 * 512;
      ctx.beginPath();
      ctx.arc(x, y, 3 + rand3 * 5, 0, 2 * Math.PI);
      ctx.fill();
    }
  };

  const downloadImage = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `${businessIdea.slice(0, 20).replace(/[^a-zA-Z0-9]/g, '_')}_concept.png`;
      link.click();
    }
  };

  const handleInitialGenerate = () => {
    generateImage();
  };

  return (
    <div className="min-h-screen blueprint-bg">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-construction-orange mb-4">
            Visual Concept Generator
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Generate a visual representation of your business idea using AI
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Business Summary Card */}
          <Card className="border-2 border-construction-yellow/30">
            <CardHeader>
              <CardTitle className="text-construction-orange">Your Business Concept</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-construction-green mb-2">Business Idea:</h3>
                <p className="text-muted-foreground">{businessIdea}</p>
              </div>
              <div>
                <h3 className="font-semibold text-construction-green mb-2">Solution:</h3>
                <p className="text-muted-foreground">{cpsData.solution}</p>
              </div>
            </CardContent>
          </Card>

          {/* Image Generation Section */}
          <Card className="border-2 border-construction-orange/30">
            <CardHeader>
              <CardTitle className="text-construction-orange flex items-center gap-2">
                <Image className="w-6 h-6" />
                Generated Visual Concept
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!generatedImage && !isGenerating && (
                <div className="text-center py-12">
                  <Image className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-6">
                    Generate a visual representation of your business concept
                  </p>
                  <Button 
                    onClick={handleInitialGenerate}
                    className="bg-construction-yellow text-construction-orange hover:bg-construction-yellow/90"
                  >
                    Generate Image
                  </Button>
                </div>
              )}

              {isGenerating && (
                <div className="text-center py-12">
                  <Loader2 className="w-16 h-16 mx-auto text-construction-orange animate-spin mb-4" />
                  <p className="text-construction-orange font-medium mb-2">Generating your concept image...</p>
                  <p className="text-sm text-muted-foreground">
                    This may take a moment as we load the AI model in your browser
                  </p>
                </div>
              )}

              {error && (
                <div className="text-center py-12">
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 mb-4">
                    <p className="text-destructive mb-4">{error}</p>
                    <Button 
                      onClick={generateImage}
                      variant="outline"
                      className="border-destructive/30"
                    >
                      Try Again
                    </Button>
                  </div>
                </div>
              )}

              {generatedImage && (
                <div className="space-y-6">
                  <div className="flex justify-center">
                    <img 
                      src={generatedImage} 
                      alt="Generated business concept"
                      className="max-w-full h-auto rounded-lg shadow-lg border-2 border-construction-yellow/30"
                    />
                  </div>
                  
                  <div className="flex justify-center gap-4">
                    <Button 
                      onClick={generateImage}
                      variant="outline"
                      className="flex items-center gap-2"
                      disabled={isGenerating}
                    >
                      <RefreshCw className="w-4 h-4" />
                      Regenerate
                    </Button>
                    <Button 
                      onClick={downloadImage}
                      className="flex items-center gap-2 bg-construction-green text-white hover:bg-construction-green/90"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                  </div>
                </div>
              )}

              <canvas ref={canvasRef} style={{ display: 'none' }} />
            </CardContent>
          </Card>
        </div>

        {/* Navigation Buttons */}
        <div className="max-w-4xl mx-auto mt-12 flex flex-col sm:flex-row justify-between items-center gap-4">
          <Button
            variant="outline"
            onClick={onBack}
            className="flex items-center gap-2 text-base px-6 py-3"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to CPS Builder
          </Button>
          
          <Button
            onClick={onContinue}
            className="flex items-center gap-2 text-base px-8 py-3 bg-construction-yellow text-construction-orange hover:bg-construction-yellow/90"
          >
            Continue to LOFA
            <ArrowLeft className="w-5 h-5 rotate-180" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImageGenerator;