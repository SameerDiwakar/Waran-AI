
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const WarrantyUploader = ({ isOpen, onClose, onSuccess }) => {
  const [uploadType, setUploadType] = useState('scan');
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Form fields for manual entry
  const [formData, setFormData] = useState({
    productName: '',
    brand: '',
    purchaseDate: '',
    warrantyEnd: '',
    category: 'electronics',
    image: null
  });

  // Preview image for manual entry
  const [imagePreview, setImagePreview] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleProductImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Set the file in form data
      setFormData(prev => ({
        ...prev,
        image: selectedFile
      }));
      
      // Create a preview URL
      const previewUrl = URL.createObjectURL(selectedFile);
      setImagePreview(previewUrl);
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleUpload = () => {
    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }

    setIsProcessing(true);
    
    // Simulate AI processing
    setTimeout(() => {
      setIsProcessing(false);
      
      // Mock extracted data
      const newWarranty = {
        id: Date.now().toString(),
        productName: 'Samsung Galaxy S23',
        brand: 'Samsung',
        purchaseDate: '2024-04-01',
        warrantyEnd: '2026-04-01',
        status: 'active',
        category: 'electronics',
        image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c'
      };
      
      toast.success("Warranty details extracted successfully!");
      onSuccess(newWarranty);
    }, 2000);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.productName || !formData.brand || !formData.purchaseDate || !formData.warrantyEnd) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    // Create new warranty object
    const newWarranty = {
      id: Date.now().toString(),
      ...formData,
      status: 'active',
      // Use preview image if available, otherwise use a placeholder
      image: imagePreview || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085'
    };
    
    toast.success("Warranty added successfully!");
    onSuccess(newWarranty);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md md:max-w-xl">
        <DialogHeader>
          <DialogTitle>Add New Warranty</DialogTitle>
          <DialogDescription>
            Upload an invoice or warranty document to automatically extract details, or enter them manually.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="scan" value={uploadType} onValueChange={setUploadType} className="mt-4">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="scan">Scan Document</TabsTrigger>
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          </TabsList>
          
          <TabsContent value="scan" className="space-y-4 mt-4">
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
                    <Button variant="outline" size="sm" className="cursor-pointer" asChild>
                      <span>Browse Files</span>
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
          </TabsContent>
          
          <TabsContent value="manual" className="space-y-4 mt-4">
            <form onSubmit={handleManualSubmit}>
              {/* Product Image Upload Preview */}
              <div className="mb-4">
                <Label htmlFor="productImage">Product Image</Label>
                <div className="mt-1 border-2 border-dashed rounded-md p-4 text-center">
                  {imagePreview ? (
                    <div className="space-y-2">
                      <div className="flex justify-center">
                        <img 
                          src={imagePreview} 
                          alt="Product preview" 
                          className="h-40 w-auto object-contain rounded"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setImagePreview(null);
                          setFormData(prev => ({ ...prev, image: null }));
                        }}
                      >
                        Remove Image
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-center">
                        <div className="bg-gray-100 p-4 rounded-full">
                          <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">Upload a product image</p>
                      <Input
                        id="productImage"
                        type="file"
                        className="hidden"
                        onChange={handleProductImageChange}
                        accept="image/png,image/jpeg,image/jpg"
                      />
                      <label htmlFor="productImage" className="mt-2 inline-block">
                        <Button type="button" variant="outline" size="sm" className="cursor-pointer">
                          Choose Image
                        </Button>
                      </label>
                    </>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="productName">Product Name *</Label>
                  <Input 
                    id="productName" 
                    value={formData.productName}
                    onChange={handleInputChange}
                    placeholder="e.g. Samsung TV, iPhone 14"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand *</Label>
                  <Input 
                    id="brand" 
                    value={formData.brand}
                    onChange={handleInputChange}
                    placeholder="e.g. Apple, Samsung"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="purchaseDate">Purchase Date *</Label>
                  <Input 
                    id="purchaseDate"
                    type="date"
                    value={formData.purchaseDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="warrantyEnd">Warranty End Date *</Label>
                  <Input 
                    id="warrantyEnd"
                    type="date"
                    value={formData.warrantyEnd}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={formData.category}
                    onChange={handleInputChange}
                  >
                    <option value="electronics">Electronics</option>
                    <option value="appliances">Appliances</option>
                    <option value="furniture">Furniture</option>
                    <option value="automotive">Automotive</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="receiptNumber">Receipt/Invoice Number</Label>
                  <Input 
                    id="receiptNumber" 
                    placeholder="Optional"
                    value={formData.receiptNumber || ''}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <Button type="submit" className="bg-brand-purple hover:bg-opacity-90">
                  Add Warranty
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="mt-4">
          {uploadType === 'scan' && (
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
          )}
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WarrantyUploader;
