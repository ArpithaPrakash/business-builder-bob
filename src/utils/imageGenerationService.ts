// Image Generation Service - Free, high-quality AI image generation
interface GenerationOptions {
  prompt: string;
  width?: number;
  height?: number;
  style?: 'realistic' | 'artistic' | 'professional' | 'minimalist' | 'corporate';
  seed?: number;
  model?: string;
}

interface GenerationResult {
  success: boolean;
  imageUrl?: string;
  error?: string;
  provider?: string;
}

class ImageGenerationService {
  private static readonly DEFAULT_WIDTH = 1024;
  private static readonly DEFAULT_HEIGHT = 1024;
  private static readonly MAX_RETRIES = 3;

  /**
   * Generate image using Pollinations.AI (primary) with fallbacks
   */
  static async generateImage(options: GenerationOptions): Promise<GenerationResult> {
    const { prompt, width = this.DEFAULT_WIDTH, height = this.DEFAULT_HEIGHT, style = 'professional', seed } = options;
    
    // Enhance prompt based on style
    const enhancedPrompt = this.enhancePromptForStyle(prompt, style);
    
    // Try Pollinations.AI first (free, no API key)
    try {
      const pollinationsResult = await this.generateWithPollinations(enhancedPrompt, width, height, seed);
      if (pollinationsResult.success) {
        return pollinationsResult;
      }
    } catch (error) {
      console.warn('Pollinations.AI failed, trying fallback:', error);
    }

    // Try alternative free APIs
    try {
      const fallbackResult = await this.generateWithFallback(enhancedPrompt, width, height);
      if (fallbackResult.success) {
        return fallbackResult;
      }
    } catch (error) {
      console.warn('Fallback API failed:', error);
    }

    return {
      success: false,
      error: 'All image generation services are currently unavailable. Please try again later.'
    };
  }

  /**
   * Generate image using Pollinations.AI
   */
  private static async generateWithPollinations(prompt: string, width: number, height: number, seed?: number): Promise<GenerationResult> {
    try {
      // Construct Pollinations.AI URL with parameters
      const encodedPrompt = encodeURIComponent(prompt);
      const params = new URLSearchParams({
        width: width.toString(),
        height: height.toString(),
        model: 'flux', // Use Flux model for better quality
        nologo: 'true',
        enhance: 'true'
      });
      
      if (seed !== undefined) {
        params.append('seed', seed.toString());
      }

      const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?${params.toString()}`;
      
      // Test if the image loads successfully
      const response = await fetch(imageUrl, { method: 'HEAD' });
      
      if (response.ok) {
        return {
          success: true,
          imageUrl,
          provider: 'Pollinations.AI'
        };
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.error('Pollinations.AI error:', error);
      return {
        success: false,
        error: `Pollinations.AI failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Fallback using alternative free APIs
   */
  private static async generateWithFallback(prompt: string, width: number, height: number): Promise<GenerationResult> {
    try {
      // Try Picsum with text overlay as a basic fallback (for demonstration)
      // In production, you might want to integrate with other free APIs
      const encodedPrompt = encodeURIComponent(prompt.slice(0, 50));
      const imageUrl = `https://picsum.photos/${width}/${height}?random&text=${encodedPrompt}`;
      
      return {
        success: true,
        imageUrl,
        provider: 'Fallback Service'
      };
    } catch (error) {
      return {
        success: false,
        error: `Fallback service failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Enhance prompt based on selected style
   */
  private static enhancePromptForStyle(prompt: string, style: string): string {
    const styleEnhancements = {
      realistic: 'photorealistic, high quality, detailed, professional photography',
      artistic: 'artistic, creative, beautiful composition, vibrant colors, masterpiece',
      professional: 'professional, clean, modern, business-oriented, high quality, corporate style',
      minimalist: 'minimalist, clean, simple, elegant, modern design, white background',
      corporate: 'corporate, professional, business, clean design, modern, sophisticated'
    };

    const enhancement = styleEnhancements[style as keyof typeof styleEnhancements] || styleEnhancements.professional;
    return `${prompt}, ${enhancement}, ultra high resolution, 4K quality`;
  }

  /**
   * Generate a random seed for image variation
   */
  static generateRandomSeed(): number {
    return Math.floor(Math.random() * 1000000);
  }

  /**
   * Create a business-focused prompt from CPS data
   */
  static createBusinessPrompt(businessIdea: string, cpsData: { customer: string; problem: string; solution: string }, style: string = 'professional'): string {
    // Create a comprehensive prompt that incorporates all business data
    const businessType = this.inferBusinessType(businessIdea, cpsData);
    
    let basePrompt = '';
    
    switch (businessType) {
      case 'tech':
        basePrompt = `Modern technology startup concept for ${businessIdea}. Digital innovation, software interface, tech workspace, modern office environment`;
        break;
      case 'health':
        basePrompt = `Healthcare innovation concept for ${businessIdea}. Medical technology, wellness, clean healthcare environment, professional medical setting`;
        break;
      case 'finance':
        basePrompt = `Financial technology concept for ${businessIdea}. Professional financial workspace, charts, graphs, modern banking environment`;
        break;
      case 'education':
        basePrompt = `Educational technology concept for ${businessIdea}. Learning environment, modern classroom, digital education tools`;
        break;
      case 'retail':
        basePrompt = `Retail business concept for ${businessIdea}. Modern store, e-commerce, shopping experience, customer interaction`;
        break;
      default:
        basePrompt = `Professional business concept for ${businessIdea}. Modern office environment, business meeting, professional workspace`;
    }

    // Add solution context
    basePrompt += `. Solution: ${cpsData.solution.slice(0, 100)}`;

    return basePrompt;
  }

  /**
   * Infer business type from text content
   */
  private static inferBusinessType(idea: string, cpsData: { customer: string; problem: string; solution: string }): string {
    const allText = `${idea} ${cpsData.customer} ${cpsData.problem} ${cpsData.solution}`.toLowerCase();
    
    if (allText.includes('tech') || allText.includes('app') || allText.includes('software') || allText.includes('digital') || allText.includes('platform')) {
      return 'tech';
    } else if (allText.includes('health') || allText.includes('medical') || allText.includes('wellness') || allText.includes('fitness')) {
      return 'health';
    } else if (allText.includes('finance') || allText.includes('money') || allText.includes('payment') || allText.includes('bank')) {
      return 'finance';
    } else if (allText.includes('education') || allText.includes('learn') || allText.includes('course') || allText.includes('training')) {
      return 'education';
    } else if (allText.includes('retail') || allText.includes('shop') || allText.includes('store') || allText.includes('ecommerce')) {
      return 'retail';
    }
    
    return 'general';
  }

  /**
   * Download image from URL
   */
  static async downloadImage(imageUrl: string, filename: string): Promise<void> {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      throw error;
    }
  }
}

export default ImageGenerationService;