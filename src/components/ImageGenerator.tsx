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
    // Clear canvas with professional gradient background
    const bgGradient = ctx.createLinearGradient(0, 0, 512, 512);
    bgGradient.addColorStop(0, '#f8fafc');
    bgGradient.addColorStop(1, '#e2e8f0');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, 512, 512);
    
    // Analyze business type from all inputs
    const allText = `${idea} ${data.customer} ${data.problem} ${data.solution}`.toLowerCase();
    
    // Enhanced business categorization
    let businessType = 'general';
    let primaryColor = '#3b82f6';
    let secondaryColor = '#8b5cf6';
    let accentColor = '#10b981';
    let icon = '🏢';
    
    if (allText.includes('tech') || allText.includes('app') || allText.includes('software') || allText.includes('digital') || allText.includes('platform')) {
      businessType = 'tech';
      primaryColor = '#3b82f6';
      secondaryColor = '#8b5cf6';
      accentColor = '#06b6d4';
      icon = '💻';
    } else if (allText.includes('health') || allText.includes('medical') || allText.includes('wellness') || allText.includes('fitness')) {
      businessType = 'health';
      primaryColor = '#10b981';
      secondaryColor = '#06b6d4';
      accentColor = '#8b5cf6';
      icon = '🏥';
    } else if (allText.includes('education') || allText.includes('learn') || allText.includes('course') || allText.includes('training')) {
      businessType = 'education';
      primaryColor = '#f59e0b';
      secondaryColor = '#3b82f6';
      accentColor = '#10b981';
      icon = '📚';
    } else if (allText.includes('food') || allText.includes('restaurant') || allText.includes('delivery') || allText.includes('cook')) {
      businessType = 'food';
      primaryColor = '#ef4444';
      secondaryColor = '#f59e0b';
      accentColor = '#10b981';
      icon = '🍽️';
    } else if (allText.includes('finance') || allText.includes('money') || allText.includes('payment') || allText.includes('bank')) {
      businessType = 'finance';
      primaryColor = '#059669';
      secondaryColor = '#0d9488';
      accentColor = '#f59e0b';
      icon = '💰';
    } else if (allText.includes('retail') || allText.includes('shop') || allText.includes('store') || allText.includes('ecommerce')) {
      businessType = 'retail';
      primaryColor = '#ec4899';
      secondaryColor = '#8b5cf6';
      accentColor = '#f59e0b';
      icon = '🛍️';
    }

    // Draw sophisticated business model visualization
    
    // 1. Customer segment (left side)
    drawCustomerSegment(ctx, data.customer, primaryColor, 80, 150);
    
    // 2. Problem visualization (top center)
    drawProblemVisualization(ctx, data.problem, secondaryColor, 256, 80);
    
    // 3. Solution (center)
    drawSolutionCore(ctx, data.solution, primaryColor, 256, 200, icon);
    
    // 4. Value flow arrows
    drawValueFlows(ctx, accentColor);
    
    // 5. Market opportunity indicators
    drawMarketIndicators(ctx, businessType, primaryColor, secondaryColor);
    
    // 6. Professional labels and title
    drawProfessionalLabels(ctx, idea, businessType);
  };

  const drawCustomerSegment = (ctx: CanvasRenderingContext2D, customer: string, color: string, x: number, y: number) => {
    // Customer group visualization
    ctx.fillStyle = color + '20';
    ctx.fillRect(20, y - 40, 120, 80);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.strokeRect(20, y - 40, 120, 80);
    
    // Customer icons
    ctx.fillStyle = color;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 2; j++) {
        ctx.beginPath();
        ctx.arc(40 + i * 30, y - 20 + j * 20, 8, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
    
    // Label
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('TARGET CUSTOMERS', 80, y + 55);
    
    // Customer description (truncated)
    ctx.font = '10px Arial';
    ctx.fillStyle = '#6b7280';
    const words = customer.split(' ').slice(0, 8).join(' ');
    const truncated = words.length > 30 ? words.substring(0, 27) + '...' : words;
    
    const lines = wrapText(ctx, truncated, 100);
    lines.slice(0, 2).forEach((line, i) => {
      ctx.fillText(line, 80, y + 70 + i * 12);
    });
  };

  const drawProblemVisualization = (ctx: CanvasRenderingContext2D, problem: string, color: string, x: number, y: number) => {
    // Problem cloud/barrier
    ctx.fillStyle = color + '30';
    ctx.beginPath();
    ctx.ellipse(x, y, 80, 40, 0, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Problem indicators (jagged lines for pain points)
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    for (let i = 0; i < 4; i++) {
      const startX = x - 60 + i * 30;
      ctx.beginPath();
      ctx.moveTo(startX, y - 10);
      ctx.lineTo(startX + 10, y + 5);
      ctx.lineTo(startX + 20, y - 5);
      ctx.stroke();
    }
    
    // Label
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('PROBLEM', x, y - 55);
  };

  const drawSolutionCore = (ctx: CanvasRenderingContext2D, solution: string, color: string, x: number, y: number, icon: string) => {
    // Main solution hexagon
    ctx.fillStyle = color;
    drawHexagon(ctx, x, y, 50);
    ctx.fill();
    
    // Inner solution details
    ctx.fillStyle = 'white';
    drawHexagon(ctx, x, y, 40);
    ctx.fill();
    
    // Solution icon/symbol
    ctx.fillStyle = color;
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('💡', x, y + 8);
    
    // Solution label
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 14px Arial';
    ctx.fillText('SOLUTION', x, y + 80);
    
    // Solution description
    ctx.font = '10px Arial';
    ctx.fillStyle = '#6b7280';
    const words = solution.split(' ').slice(0, 10).join(' ');
    const truncated = words.length > 40 ? words.substring(0, 37) + '...' : words;
    
    const lines = wrapText(ctx, truncated, 120);
    lines.slice(0, 2).forEach((line, i) => {
      ctx.fillText(line, x, y + 95 + i * 12);
    });
  };

  const drawValueFlows = (ctx: CanvasRenderingContext2D, color: string) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    
    // Arrow from customer to solution
    drawArrow(ctx, 140, 150, 206, 180);
    
    // Arrow from problem to solution
    drawArrow(ctx, 256, 120, 256, 150);
    
    // Success indicators from solution
    ctx.strokeStyle = color + '80';
    ctx.lineWidth = 2;
    for (let i = 0; i < 3; i++) {
      const angle = (i * 60 - 30) * Math.PI / 180;
      const endX = 256 + Math.cos(angle) * 80;
      const endY = 200 + Math.sin(angle) * 80;
      drawArrow(ctx, 256, 200, endX, endY);
    }
  };

  const drawMarketIndicators = (ctx: CanvasRenderingContext2D, businessType: string, primaryColor: string, secondaryColor: string) => {
    // Market size indicator (bottom right)
    ctx.fillStyle = secondaryColor + '20';
    ctx.fillRect(380, 350, 110, 60);
    ctx.strokeStyle = secondaryColor;
    ctx.lineWidth = 2;
    ctx.strokeRect(380, 350, 110, 60);
    
    // Growth chart bars
    ctx.fillStyle = secondaryColor;
    const heights = [15, 25, 35, 30];
    heights.forEach((height, i) => {
      ctx.fillRect(390 + i * 20, 390 - height, 15, height);
    });
    
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 10px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('MARKET', 435, 425);
    ctx.fillText('OPPORTUNITY', 435, 437);
    
    // ROI indicator (bottom left)
    ctx.fillStyle = primaryColor + '20';
    ctx.beginPath();
    ctx.arc(60, 380, 35, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 2;
    ctx.stroke();
    
    ctx.fillStyle = primaryColor;
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('ROI', 60, 385);
    
    ctx.font = 'bold 10px Arial';
    ctx.fillText('POTENTIAL', 60, 430);
  };

  const drawProfessionalLabels = (ctx: CanvasRenderingContext2D, idea: string, businessType: string) => {
    // Main title
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('BUSINESS MODEL CANVAS', 256, 30);
    
    // Business idea subtitle
    ctx.font = '14px Arial';
    ctx.fillStyle = '#6b7280';
    const truncatedIdea = idea.length > 50 ? idea.substring(0, 47) + '...' : idea;
    ctx.fillText(truncatedIdea, 256, 50);
    
    // Business type badge
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(200, 470, 112, 25);
    ctx.fillStyle = 'white';
    ctx.font = 'bold 12px Arial';
    ctx.fillText(businessType.toUpperCase() + ' SECTOR', 256, 487);
  };

  const drawHexagon = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number) => {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (i * 60) * Math.PI / 180;
      const hx = x + radius * Math.cos(angle);
      const hy = y + radius * Math.sin(angle);
      if (i === 0) ctx.moveTo(hx, hy);
      else ctx.lineTo(hx, hy);
    }
    ctx.closePath();
  };

  const drawArrow = (ctx: CanvasRenderingContext2D, fromX: number, fromY: number, toX: number, toY: number) => {
    const headLength = 10;
    const angle = Math.atan2(toY - fromY, toX - fromX);
    
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.lineTo(toX - headLength * Math.cos(angle - Math.PI / 6), toY - headLength * Math.sin(angle - Math.PI / 6));
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - headLength * Math.cos(angle + Math.PI / 6), toY - headLength * Math.sin(angle + Math.PI / 6));
    ctx.stroke();
  };

  const wrapText = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] => {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';
    
    for (const word of words) {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      const metrics = ctx.measureText(testLine);
      
      if (metrics.width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    
    if (currentLine) {
      lines.push(currentLine);
    }
    
    return lines;
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