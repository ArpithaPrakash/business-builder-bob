import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Image, ArrowLeft } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ScreenshotUploadProps {
  businessIdea: string;
  onNext: (screenshot: File) => void;
  onBack: () => void;
}

export function ScreenshotUpload({ businessIdea, onNext, onBack }: ScreenshotUploadProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPG or PNG image.",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 10MB.",
        variant: "destructive"
      });
      return;
    }

    setUploadedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    
    toast({
      title: "Screenshot uploaded!",
      description: "Great! Your screenshot has been uploaded successfully.",
    });
  }, []);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  }, [handleFileSelect]);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleContinue = () => {
    if (uploadedFile) {
      onNext(uploadedFile);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="construction-sign inline-block px-6 py-3 rounded-xl">
              <h1 className="text-3xl font-bold text-construction-blue">
                Upload a Screenshot of the Most Relevant Post
              </h1>
            </div>
            
            <div className="bg-construction-yellow/20 border border-construction-yellow/30 rounded-lg p-4">
              <p className="text-construction-blue font-medium">
                <span className="font-bold">Step 2:</span> Take a screenshot of a LinkedIn post that's most relevant to your idea, and upload it here.
              </p>
            </div>
          </div>

          {/* Business Idea Context */}
          <Card className="border-construction-blue/20 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-construction-green text-center">Your Business Idea</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground italic text-center">"{businessIdea}"</p>
            </CardContent>
          </Card>

          {/* Upload Zone */}
          <Card className="border-construction-blue/30 shadow-xl">
            <CardContent className="p-8">
              <div
                className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 ${
                  dragActive
                    ? 'border-construction-blue bg-construction-blue/5 shadow-lg'
                    : 'border-construction-blue/40 bg-muted/30 hover:bg-muted/50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={handleUploadClick}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
                
                <div className="space-y-4">
                  <div className="mx-auto w-16 h-16 bg-construction-blue/10 rounded-full flex items-center justify-center">
                    <Upload className="w-8 h-8 text-construction-blue" />
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-construction-blue mb-2">
                      Drag & drop your screenshot here
                    </h3>
                    <p className="text-muted-foreground">
                      or click to upload (JPG/PNG)
                    </p>
                  </div>
                  
                  <Button 
                    variant="outline"
                    className="border-construction-blue text-construction-blue hover:bg-construction-blue hover:text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUploadClick();
                    }}
                  >
                    Choose File
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preview Box */}
          <Card className="border-construction-green/30 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-construction-green flex items-center gap-2">
                <Image className="w-5 h-5" />
                Screenshot Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              {previewUrl ? (
                <div className="space-y-4">
                  <div className="relative rounded-lg overflow-hidden border-2 border-construction-green/20">
                    <img
                      src={previewUrl}
                      alt="Uploaded screenshot preview"
                      className="w-full h-auto max-h-64 object-contain bg-muted/50"
                    />
                  </div>
                  <p className="text-sm text-construction-green font-medium text-center">
                    ✓ Screenshot uploaded: {uploadedFile?.name}
                  </p>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Image className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No screenshot uploaded.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              variant="outline"
              onClick={onBack}
              className="flex-1 border-construction-yellow text-construction-yellow hover:bg-construction-yellow hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Discovery
            </Button>
            
            <Button
              onClick={handleContinue}
              disabled={!uploadedFile}
              className="flex-1 bg-construction-blue hover:bg-construction-blue/90 text-white shadow-elegant disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue Journey
              <Upload className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}