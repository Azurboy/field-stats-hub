
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';

interface UploadFormProps {
  onUpload: (file: File) => void;
}

const UploadForm = ({ onUpload }: UploadFormProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };
  
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };
  
  const handleFile = (file: File) => {
    // Check if file is an image
    if (!file.type.match('image.*')) {
      toast.error('Please upload an image file');
      return;
    }
    
    setFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const handleSubmit = () => {
    if (file) {
      onUpload(file);
      toast.success('Scoresheet uploaded successfully');
      
      // Reset form
      setFile(null);
      setPreview(null);
    }
  };
  
  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold text-baseball-navy mb-4">Upload Scoresheet</h3>
      
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center mb-4 ${
          isDragging ? 'border-baseball-green bg-baseball-green/5' : 'border-gray-300'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {preview ? (
          <div className="mb-4">
            <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-lg" />
          </div>
        ) : (
          <>
            <Upload size={40} className="text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">Drag and drop your scoresheet photo here</p>
            <p className="text-sm text-gray-400">or</p>
          </>
        )}
        
        <div className="mt-4">
          <label className="cursor-pointer">
            <span className="bg-baseball-navy text-white px-4 py-2 rounded-md hover:bg-baseball-navy/90 transition-colors">
              {preview ? 'Choose Another File' : 'Select File'}
            </span>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileInput}
            />
          </label>
        </div>
      </div>
      
      {file && (
        <div className="mt-4">
          <p className="text-sm text-gray-500 mb-2">
            File: {file.name} ({Math.round(file.size / 1024)} KB)
          </p>
          <Button 
            className="w-full bg-baseball-green hover:bg-baseball-green/90"
            onClick={handleSubmit}
          >
            Process Scoresheet
          </Button>
        </div>
      )}
    </Card>
  );
};

export default UploadForm;
