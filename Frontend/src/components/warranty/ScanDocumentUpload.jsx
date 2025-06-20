import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import axios from 'axios';
import { useUser } from '@/UserContext';

const ScanDocumentUpload = ({ onSuccess, onClose }) => {
  const { user } = useUser();
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }

    setIsProcessing(true);
    
    try {
      const formData = new FormData();
      formData.append('photo', file);
      formData.append('userId', user._id);

      const response = await axios.post('/addWarranty', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data) {
        toast.success("Warranty details extracted successfully!");
        onSuccess(response.data.warranty);
        onClose();
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || "Error uploading warranty");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed rounded-lg p-6 text-center">
        {file ? (
          <div className="space-y-2">
            <div className="flex items-center justify-center">
              <div className="bg-green-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <p className="text-sm font-medium">{file.name}</p>
            <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={() => setFile(null)}
            >
              Remove
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-center">
              <div className="bg-brand-purple/10 p-4 rounded-full">
                <svg className="w-8 h-8 text-brand-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
            </div>
            <p className="my-4 text-sm text-gray-500">
              Drag and drop your invoice or warranty document here, or click to browse
            </p>
            <Input
              id="warranty-file"
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept=".pdf,image/png,image/jpeg,image/jpg"
            />
            <label htmlFor="warranty-file">
              <Button variant="outline" size="sm" className="cursor-pointer">
                Browse Files
              </Button>
            </label>
            <p className="mt-2 text-xs text-gray-500">
              Supports PDF, JPG, PNG (max 10MB)
            </p>
          </>
        )}
      </div>
      
      <div className="bg-yellow-50 border border-yellow-100 rounded-md p-3">
        <div className="flex gap-2">
          <svg className="w-5 h-5 text-yellow-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-yellow-700">
            Our AI will automatically extract product name, purchase date, and warranty end date from your document. You can edit the details after processing.
          </p>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button 
          onClick={handleUpload} 
          className="bg-brand-purple hover:bg-opacity-90"
          disabled={!file || isProcessing}
        >
          {isProcessing ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : "Process Document"}
        </Button>
      </div>
    </div>
  );
};

export default ScanDocumentUpload; 