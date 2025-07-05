import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import axios from 'axios';
import { useUser } from '@/UserContext';

const ScanDocumentUpload = ({ onSuccess, onClose }) => {
  const { user } = useUser();
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const [productImage, setProductImage] = useState(null);
  const [productImagePreview, setProductImagePreview] = useState(null);
  const productImageInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setExtractedData(null);
      setShowConfirmation(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setExtractedData(null);
      setShowConfirmation(false);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleProcessDocument = async () => {
    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }

    setIsProcessing(true);
    
    try {
      const formData = new FormData();
      formData.append('document', file);

      const response = await axios.post('/processDocument', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data) {
        setExtractedData(response.data.extractedData);
        setShowConfirmation(true);
        toast.success("Document processed successfully! Please review the extracted details.");
      }
    } catch (error) {
      console.error('Processing error:', error);
      toast.error(error.response?.data?.message || "Error processing document");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleProductImageChange = (e) => {
    const imgFile = e.target.files[0];
    if (imgFile) {
      setProductImage(imgFile);
      setProductImagePreview(URL.createObjectURL(imgFile));
    }
  };

  const handleBrowseProductImage = () => {
    productImageInputRef.current?.click();
  };

  const handleConfirmWarranty = async () => {
    if (!extractedData) return;
    setIsProcessing(true);
    try {
      const warrantyData = new FormData();
      warrantyData.append('productName', extractedData.productName || 'Unknown Product');
      warrantyData.append('brand', extractedData.brand || '');
      warrantyData.append('purchaseDate', extractedData.purchaseDate || new Date().toISOString().split('T')[0]);
      warrantyData.append('warrantyEnd', extractedData.warrantyEnd || new Date().toISOString().split('T')[0]);
      warrantyData.append('category', extractedData.category || 'other');
      warrantyData.append('invoice', extractedData.invoice);
      warrantyData.append('userId', user._id);
      if (productImage) {
        warrantyData.append('image', productImage);
      }
      const response = await axios.post('/addWarranty', warrantyData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.data) {
        toast.success("Warranty added successfully!");
        onSuccess(response.data.warranty);
        onClose();
      }
    } catch (error) {
      console.error('Add warranty error:', error);
      toast.error(error.response?.data?.message || "Error adding warranty");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInputChange = (field, value) => {
    setExtractedData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (showConfirmation && extractedData) {
    return (
      <div className="space-y-4">
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex gap-2">
            <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-green-700">
              Document processed successfully! Please review and edit the extracted details below.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="productName">Product Name *</Label>
              <Input 
                id="productName" 
                value={extractedData.productName || ''}
                onChange={(e) => handleInputChange('productName', e.target.value)}
                placeholder="Product name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Input 
                id="brand" 
                value={extractedData.brand || ''}
                onChange={(e) => handleInputChange('brand', e.target.value)}
                placeholder="Brand name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="purchaseDate">Purchase Date *</Label>
              <Input 
                id="purchaseDate"
                type="date"
                value={extractedData.purchaseDate || ''}
                onChange={(e) => handleInputChange('purchaseDate', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="warrantyEnd">Warranty End Date *</Label>
              <Input 
                id="warrantyEnd"
                type="date"
                value={extractedData.warrantyEnd || ''}
                onChange={(e) => handleInputChange('warrantyEnd', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={extractedData.category || 'other'}
                onChange={(e) => handleInputChange('category', e.target.value)}
              >
                <option value="electronics">Electronics</option>
                <option value="appliances">Appliances</option>
                <option value="furniture">Furniture</option>
                <option value="automotive">Automotive</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {extractedData.invoice && (
            <div className="space-y-2">
              <Label>Invoice Document</Label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(extractedData.invoice, '_blank')}
                >
                  View Invoice
                </Button>
                <span className="text-sm text-gray-500">Document uploaded successfully</span>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="productImage">Product Image (optional)</Label>
            <div className="flex items-center gap-4">
              <input
                ref={productImageInputRef}
                id="productImage"
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                className="hidden"
                onChange={handleProductImageChange}
              />
              <Button 
                variant="outline"
                size="sm"
                onClick={handleBrowseProductImage}
                className="bg-orange-500 text-white rounded shadow hover:bg-orange-600 border-none"
              >
                {productImage ? 'Change Image' : 'Upload Image'}
              </Button>
              {productImagePreview && (
                <img src={productImagePreview} alt="Product Preview" className="w-16 h-16 object-cover rounded border" />
              )}
              {!productImage && <span className="text-xs text-gray-500">JPG, PNG (max 10MB)</span>}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setShowConfirmation(false)}>
            Back to Upload
          </Button>
          <Button 
            onClick={handleConfirmWarranty} 
            className="bg-brand-purple hover:bg-opacity-90"
            disabled={isProcessing || !extractedData.productName || !extractedData.purchaseDate || !extractedData.warrantyEnd}
          >
            {isProcessing ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adding...
              </>
            ) : "Add Warranty"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div 
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragOver 
            ? 'border-brand-purple bg-brand-purple/5' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
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
              Drag and drop your invoice or warranty document image here, or click to browse
            </p>
            <Input
              ref={fileInputRef}
              id="warranty-file"
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept="image/png,image/jpeg,image/jpg"
            />
            <Button 
              variant="outline"
              size="sm"
              className="cursor-pointer bg-orange-500 text-white rounded shadow hover:bg-orange-600 border-none"
              onClick={handleBrowseClick}
            >
              Choose File
            </Button>
            <p className="mt-2 text-xs text-gray-500">
              Supports JPG, PNG images only (max 10MB)
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
          onClick={handleProcessDocument} 
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