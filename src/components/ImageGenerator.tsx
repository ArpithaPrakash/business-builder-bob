import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Download, RefreshCw, Image, Loader2, Sparkles } from 'lucide-react';
import ImageGenerationService from '@/utils/imageGenerationService';
import { useToast } from '@/components/ui/use-toast';

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
  const [currentStyle, setCurrentStyle] = useState<'realistic' | 'artistic' | 'professional' | 'minimalist' | 'corporate'>('professional');
  const [currentProvider, setCurrentProvider] = useState<string>('');
  const [generationSeed, setGenerationSeed] = useState<number>(ImageGenerationService.generateRandomSeed());
  const { toast } = useToast();

  // Auto-generate image on component mount
  useEffect(() => {
    generateImage(false);
  }, []);

  const generateImage = async (regenerate: boolean = false) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      console.log('Generating high-quality AI image...');
      
      // Create business-focused prompt
      const prompt = ImageGenerationService.createBusinessPrompt(businessIdea, cpsData, currentStyle);
      
      // Use new seed for regeneration
      const seed = regenerate ? ImageGenerationService.generateRandomSeed() : generationSeed;
      if (regenerate) setGenerationSeed(seed);
      
      console.log('Generation prompt:', prompt);
      console.log('Style:', currentStyle, 'Seed:', seed);
      
      const result = await ImageGenerationService.generateImage({
        prompt,
        width: 1024,
        height: 1024,
        style: currentStyle,
        seed
      });
      
      if (result.success && result.imageUrl) {
        setGeneratedImage(result.imageUrl);
        setCurrentProvider(result.provider || 'Unknown');
        
        toast({
          title: "Image Generated Successfully",
          description: `Created using ${result.provider}`,
          duration: 3000,
        });
      } else {
        throw new Error(result.error || 'Image generation failed');
      }
      
    } catch (err) {
      console.error('Error generating image:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate image. Please try again.';
      setError(errorMessage);
      
      toast({
        title: "Generation Failed",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = async () => {
    if (generatedImage) {
      try {
        const filename = `${businessIdea.slice(0, 20).replace(/[^a-zA-Z0-9]/g, '_')}_concept_${currentStyle}.png`;
        await ImageGenerationService.downloadImage(generatedImage, filename);
        
        toast({
          title: "Download Started",
          description: "Your image is being downloaded",
          duration: 3000,
        });
      } catch (error) {
        toast({
          title: "Download Failed",
          description: "Could not download the image. Please try right-clicking and saving manually.",
          variant: "destructive",
          duration: 5000,
        });
      }
    }
  };

  // Remove the style selection from UI but keep the logic for backend
  // Style is set to 'professional' by default

  const handleInitialGenerate = () => {
    generateImage(false);
  };

  const handleRegenerate = () => {
    generateImage(true);
  };

  return (
    <div className="min-h-screen blueprint-bg">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-construction-orange mb-4">
            Visual Concept
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Generate professional images of your business concept
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
                <Sparkles className="w-6 h-6" />
                Visual Concept
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isGenerating && (
                <div className="text-center py-12">
                  <Loader2 className="w-16 h-16 mx-auto text-construction-orange animate-spin mb-4" />
                  <p className="text-construction-orange font-medium mb-2">Generating your concept image...</p>
                  <p className="text-xs text-muted-foreground">
                    This may take 10-30 seconds
                  </p>
                </div>
              )}

              {error && (
                <div className="text-center py-12">
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 mb-4">
                    <p className="text-destructive mb-4">{error}</p>
                    <Button 
                      onClick={handleInitialGenerate}
                      variant="outline"
                      className="border-destructive/30"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Try Again
                    </Button>
                  </div>
                </div>
              )}

              {generatedImage && (
                <div className="space-y-6">
                  <div className="flex justify-center">
                    <div className="relative group">
                      <img 
                        src={generatedImage} 
                        alt="Business concept visualization"
                        className="max-w-full h-auto rounded-lg shadow-lg border-2 border-construction-yellow/30 transition-transform hover:scale-105"
                        style={{ maxHeight: '512px' }}
                        onError={(e) => {
                          console.error('Image failed to load:', generatedImage);
                          setError('Generated image failed to load. Please try regenerating.');
                        }}
                        onLoad={() => {
                          console.log('Image loaded successfully:', generatedImage);
                        }}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg" />
                    </div>
                  </div>
                  
                  
                  <div className="flex justify-center gap-4">
                    <Button 
                      onClick={handleRegenerate}
                      variant="outline"
                      className="flex items-center gap-2"
                      disabled={isGenerating}
                    >
                      <RefreshCw className="w-4 h-4" />
                      {isGenerating ? 'Generating...' : 'New Variation'}
                    </Button>
                    <Button 
                      onClick={downloadImage}
                      className="flex items-center gap-2 bg-construction-green text-white hover:bg-construction-green/90"
                    >
                      <Download className="w-4 h-4" />
                      Download Image
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-8">
            <Button 
              onClick={onBack}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to CPS Builder
            </Button>
            
            {generatedImage && (
              <Button 
                onClick={onContinue}
                className="bg-construction-orange text-white hover:bg-construction-orange/90 flex items-center gap-2"
              >
                Continue to Next Step
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageGenerator;