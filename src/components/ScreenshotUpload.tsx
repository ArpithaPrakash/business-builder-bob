import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Upload, Cloud, CheckCircle } from "lucide-react";

interface ScreenshotUploadProps {
  onBack: () => void;
  onContinue: () => void;
}

const ScreenshotUpload = ({ onBack, onContinue }: ScreenshotUploadProps) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileUpload = useCallback((file: File) => {
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      setUploadedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  const handleUploadClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg,image/png';
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        handleFileUpload(target.files[0]);
      }
    };
    input.click();
  };

  return (
    <div className="min-h-screen blueprint-bg p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-construction-blue to-construction-green rounded-full mb-6 shadow-lg">
            <Upload className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-construction-blue mb-4">
            Upload a Screenshot of the Most Relevant Post
          </h1>
          <div className="bg-construction-green/10 border border-construction-green/20 rounded-xl p-4 max-w-2xl mx-auto">
            <p className="text-construction-green font-medium">
              💡 <strong>Step 2:</strong> Take a screenshot of a LinkedIn post that's most relevant to your idea, and upload it here.
            </p>
          </div>
        </div>

        {/* Upload Zone */}
        <Card className="mb-8 shadow-lg animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <CardContent className="p-8">
            <div
              className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer ${
                isDragging
                  ? 'border-construction-green bg-construction-green/10 shadow-lg'
                  : 'border-muted-foreground/30 bg-muted/20 hover:border-construction-blue hover:bg-construction-blue/5'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleUploadClick}
            >
              <div className="flex flex-col items-center space-y-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
                  isDragging ? 'bg-construction-green text-white' : 'bg-construction-blue/10 text-construction-blue'
                }`}>
                  <Cloud className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-lg font-medium text-foreground mb-2">
                    Drag & drop your screenshot here or click to upload
                  </p>
                  <p className="text-muted-foreground">
                    Supports JPG and PNG files
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preview Box */}
        <Card className="mb-8 shadow-lg animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <CardHeader>
            <CardTitle className="text-xl text-construction-blue flex items-center gap-2">
              {uploadedFile ? (
                <>
                  <CheckCircle className="w-5 h-5 text-construction-green" />
                  Screenshot Preview
                </>
              ) : (
                'Preview'
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {previewUrl ? (
              <div className="space-y-4">
                <div className="rounded-lg overflow-hidden border shadow-md bg-white">
                  <img 
                    src={previewUrl} 
                    alt="Screenshot preview" 
                    className="w-full h-auto max-h-96 object-contain"
                  />
                </div>
                <div className="bg-construction-green/10 border border-construction-green/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-construction-green">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">{uploadedFile?.name}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    File size: {uploadedFile ? Math.round(uploadedFile.size / 1024) : 0} KB
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Upload className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg">No screenshot uploaded yet</p>
                <p className="text-sm mt-2">Upload a screenshot to see it here</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upload Button */}
        {uploadedFile && (
          <div className="text-center mb-8 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Button
              onClick={onContinue}
              className="bg-construction-green hover:bg-construction-green/90 text-white px-12 py-6 text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Upload className="w-5 h-5 mr-2" />
              Upload & Continue
            </Button>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <Button
            variant="outline"
            onClick={onBack}
            className="flex items-center gap-2 border-construction-blue text-construction-blue hover:bg-construction-blue/10 px-6 py-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Customer Discovery
          </Button>
          
          {!uploadedFile && (
            <div className="text-sm text-muted-foreground">
              Upload a screenshot to continue
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScreenshotUpload;