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
            <div className="aspect-video bg-white rounded-lg border-4 border-construction-orange overflow-hidden">
              <iframe
                src="https://www.loom.com/embed/5103f98cf3474de6b37b20753ba5fdb7?sid=8c1e4f8a-2d7a-4f89-9c8a-1e2d3f4a5b6c"
                frameBorder="0"
                allowFullScreen
                className="w-full h-full"
                title="CPS Hypothesis Video"
                allow="autoplay; encrypted-media"
              ></iframe>
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