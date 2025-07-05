import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import axios from 'axios';
import { useUser } from '@/UserContext';

const ManualWarrantyEntry = ({ onSuccess, onClose }) => {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  
  // Form fields for manual entry
  const [formData, setFormData] = useState({
    productName: '',
    brand: '',
    purchaseDate: '',
    warrantyEnd: '',
    category: 'electronics',
    invoice: ''
  });

  // Preview image for manual entry
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [invoiceFile, setInvoiceFile] = useState(null);

  const handleProductImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Create a preview URL
      const previewUrl = URL.createObjectURL(selectedFile);
      setImagePreview(previewUrl);
      setImageFile(selectedFile);
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.productName || !formData.purchaseDate || !formData.warrantyEnd || !formData.category) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    // Validate purchaseDate is not after warrantyEnd
    if (new Date(formData.purchaseDate) > new Date(formData.warrantyEnd)) {
      toast.error("Purchase date cannot be after warranty end date");
      return;
    }
    
    try {
      setIsLoading(true);
      const submitData = new FormData();
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== '') {
          submitData.append(key, formData[key]);
        }
      });
      
      // Add image if selected
      if (imageFile) {
        submitData.append('image', imageFile);
      }
      
      // Add userId
      submitData.append('userId', user._id);
      
      const response = await axios.post('/addWarranty', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      let createdWarranty = response.data.warranty;
      // If invoice file exists, upload it in a second request
      if (invoiceFile && createdWarranty && createdWarranty._id) {
        const invoiceForm = new FormData();
        invoiceForm.append('invoice', invoiceFile);
        const invoiceRes = await axios.post(`/warranty/${createdWarranty._id}/upload-invoice`, invoiceForm, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (invoiceRes.data && invoiceRes.data.warranty) {
          createdWarranty = invoiceRes.data.warranty;
        }
      }
      toast.success("Warranty added successfully!");
      onSuccess(createdWarranty);
      onClose();
    } catch (error) {
      console.error('Submission error:', error);
      toast.error(error.response?.data?.message || "Error adding warranty");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit}>
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
                    setImageFile(null);
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
                  className="mt-2"
                  onChange={handleProductImageChange}
                  accept="image/png,image/jpeg,image/jpg"
                />
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
            <Label htmlFor="brand">Brand</Label>
            <Input 
              id="brand" 
              value={formData.brand}
              onChange={handleInputChange}
              placeholder="e.g. Apple, Samsung"
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
            <Label htmlFor="category">Category *</Label>
            <select
              id="category"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={formData.category}
              onChange={handleInputChange}
              required
            >
              <option value="electronics">Electronics</option>
              <option value="appliances">Appliances</option>
              <option value="furniture">Furniture</option>
              <option value="automotive">Automotive</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="invoice">Invoice File (PDF or Image, optional)</Label>
            <Input
              id="invoice"
              type="file"
              accept="application/pdf,image/png,image/jpeg,image/jpg"
              onChange={e => setInvoiceFile(e.target.files[0])}
            />
          </div>
        </div>
        
        <div className="mt-6 flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" className="bg-brand-purple hover:bg-opacity-90" disabled={isLoading}>
            {isLoading ? (
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
      </form>
    </div>
  );
};

export default ManualWarrantyEntry; 