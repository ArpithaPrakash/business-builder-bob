import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import { generateBusinessName } from '@/utils/businessNameGenerator';

interface VideoIntroPageProps {
  businessIdea: string;
  onBack: () => void;
  onStartBuilding: () => void;
}

const VideoIntroPage = ({ businessIdea, onBack, onStartBuilding }: VideoIntroPageProps) => {
  return (
    <div className="min-h-screen blueprint-bg p-6">
      <div className="max-w-4xl mx-auto">
        {/* Title Section */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black text-primary mb-4">
            Awesome! Let's build CPS Hypothesis
          </h1>
        </div>

        {/* Subtitle Section */}
        <div className="text-center mb-12">
          <p className="text-xl text-muted-foreground">
            Please watch the following one-minute video to learn about the CPS hypothesis.
          </p>
        </div>

        {/* Video Section */}
        <div className="mb-12">
          <div className="bg-construction-yellow rounded-lg p-8 shadow-construction max-w-2xl mx-auto">
            <div className="aspect-video bg-construction-yellow/50 rounded-lg border-4 border-construction-orange flex items-center justify-center mb-4">
              <div className="text-center">
                <div className="bg-white/20 rounded-full p-6 mb-4 inline-flex">
                  <Play className="w-12 h-12 text-construction-orange fill-current" />
                </div>
                <p className="text-construction-dark font-semibold text-lg">
                  (Place the video here)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            onClick={onBack}
            variant="outline"
            size="lg"
            className="bg-blue-100 border-blue-300 text-blue-700 hover:bg-blue-200 px-8 py-4 text-lg font-medium rounded-xl"
          >
            Back to the Image
          </Button>
          
          <Button
            onClick={onStartBuilding}
            size="lg"
            className="bg-construction-yellow text-construction-dark hover:bg-construction-yellow/90 border-2 border-construction-orange px-8 py-4 text-lg font-bold rounded-xl shadow-construction"
          >
            Start Building
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VideoIntroPage;