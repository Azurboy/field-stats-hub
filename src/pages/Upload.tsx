
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UploadForm from '@/components/UploadForm';
import { toast } from 'sonner';

const Upload = () => {
  const [uploadedFiles, setUploadedFiles] = useState<Array<{id: string; name: string; date: string; status: string}>>([
    {
      id: '1',
      name: 'Eagles vs. Tigers - May 15.jpg',
      date: 'May 15, 2025',
      status: 'processed'
    },
    {
      id: '2',
      name: 'Bears vs. Hawks - May 18.jpg',
      date: 'May 18, 2025',
      status: 'processing'
    }
  ]);
  
  const handleUpload = (file: File) => {
    const newFile = {
      id: Date.now().toString(),
      name: file.name,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'processing'
    };
    
    setUploadedFiles([newFile, ...uploadedFiles]);
    
    // Simulate processing
    setTimeout(() => {
      setUploadedFiles(prev => 
        prev.map(f => 
          f.id === newFile.id ? { ...f, status: 'processed' } : f
        )
      );
      toast.success(`${file.name} has been processed successfully!`);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="baseball-container">
        <h1 className="text-2xl font-bold text-baseball-navy mb-6">Scoresheet Upload</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Tabs defaultValue="photo">
              <TabsList className="w-full">
                <TabsTrigger value="photo" className="w-1/2">Upload Photo</TabsTrigger>
                <TabsTrigger value="manual" className="w-1/2">Manual Entry</TabsTrigger>
              </TabsList>
              
              <TabsContent value="photo">
                <UploadForm onUpload={handleUpload} />
                
                <div className="mt-6">
                  <Card className="p-4">
                    <h3 className="font-semibold text-lg mb-2">How It Works</h3>
                    <p className="text-gray-600 mb-4">
                      Upload a photo of your paper scoresheet, and our system will use OCR (Optical Character Recognition) to extract the data and add it to your digital records.
                    </p>
                    
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <div className="bg-baseball-navy text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">1</div>
                        <div>Take a clear photo of your completed scoresheet</div>
                      </div>
                      <div className="flex items-start">
                        <div className="bg-baseball-navy text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">2</div>
                        <div>Upload the photo using the form above</div>
                      </div>
                      <div className="flex items-start">
                        <div className="bg-baseball-navy text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">3</div>
                        <div>Review and confirm the extracted data</div>
                      </div>
                      <div className="flex items-start">
                        <div className="bg-baseball-navy text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">4</div>
                        <div>Access your digital scorekeeping records</div>
                      </div>
                    </div>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="manual">
                <Card className="p-4">
                  <h3 className="font-semibold text-lg mb-4">Manual Game Entry</h3>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Home Team
                        </label>
                        <Input placeholder="Home Team Name" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Away Team
                        </label>
                        <Input placeholder="Away Team Name" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Game Date
                        </label>
                        <Input type="date" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Location
                        </label>
                        <Input placeholder="Game Location" />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Final Score
                      </label>
                      <div className="flex items-center space-x-4">
                        <Input className="w-20" placeholder="0" />
                        <span className="text-lg">-</span>
                        <Input className="w-20" placeholder="0" />
                      </div>
                    </div>
                    
                    <Button className="w-full bg-baseball-green hover:bg-baseball-green/90">
                      Continue to Detailed Entry
                    </Button>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="lg:col-span-1">
            <Card className="p-4">
              <h3 className="font-semibold text-lg mb-4">Recent Uploads</h3>
              
              <div className="space-y-3">
                {uploadedFiles.map((file) => (
                  <div 
                    key={file.id}
                    className="p-3 bg-gray-50 rounded-lg border flex justify-between items-center"
                  >
                    <div>
                      <div className="font-medium">{file.name}</div>
                      <div className="text-xs text-gray-500">{file.date}</div>
                    </div>
                    <div className={`px-2 py-1 text-xs rounded-full ${
                      file.status === 'processed' 
                        ? 'bg-baseball-green/20 text-baseball-green' 
                        : 'bg-baseball-orange/20 text-baseball-orange'
                    }`}>
                      {file.status === 'processed' ? 'Processed' : 'Processing...'}
                    </div>
                  </div>
                ))}
                
                {uploadedFiles.length === 0 && (
                  <div className="text-center py-6 text-gray-500">
                    No uploaded scoresheets yet
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;
