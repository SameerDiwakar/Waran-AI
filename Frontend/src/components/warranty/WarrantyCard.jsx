
import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const WarrantyCard = ({ warranty }) => {
  // Calculate days left in warranty
  const today = new Date();
  const warrantyEndDate = new Date(warranty.warrantyEnd);
  const daysLeft = Math.ceil((warrantyEndDate - today) / (1000 * 60 * 60 * 24));
  
  // Determine status color and text
  let statusColor = 'bg-green-500';
  let statusText = 'Active';
  
  if (daysLeft < 0) {
    statusColor = 'bg-gray-500';
    statusText = 'Expired';
  } else if (daysLeft < 30) {
    statusColor = 'bg-yellow-500';
    statusText = 'Expiring Soon';
  }

  // State for dialogs
  const [showDetails, setShowDetails] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editFormData, setEditFormData] = useState({
    productName: warranty.productName,
    brand: warranty.brand,
    purchaseDate: warranty.purchaseDate,
    warrantyEnd: warranty.warrantyEnd,
    category: warranty.category,
    image: warranty.image
  });

  // State for image preview
  const [imagePreview, setImagePreview] = useState(warranty.image);

  // Format dates for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleViewDetails = () => {
    setShowDetails(true);
  };

  const handleEditWarranty = () => {
    // Set the current warranty data to edit form before showing dialog
    setEditFormData({
      productName: warranty.productName,
      brand: warranty.brand,
      purchaseDate: warranty.purchaseDate,
      warrantyEnd: warranty.warrantyEnd,
      category: warranty.category || 'electronics',
      image: warranty.image
    });
    setImagePreview(warranty.image);
    setShowEditDialog(true);
  };

  const handleGetTroubleshooting = () => {
    // Navigate to troubleshooting tab with this product pre-selected
    const productIssue = `${warranty.productName} issue`;
    // Using window.location to facilitate tab switching with product context
    window.location.href = `/dashboard?tab=troubleshoot&product=${encodeURIComponent(warranty.productName)}`;
  };

  const handleDelete = () => {
    // In a real app, this would make an API call to delete
    toast.success(`${warranty.productName} warranty has been deleted`);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleProductImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Create a preview URL
      const previewUrl = URL.createObjectURL(selectedFile);
      setImagePreview(previewUrl);
      
      // Set the file or URL in form data
      setEditFormData(prev => ({
        ...prev,
        image: previewUrl // In a real app, you'd handle file upload to server
      }));
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!editFormData.productName || !editFormData.brand || !editFormData.purchaseDate || !editFormData.warrantyEnd) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    // In a real app, this would make an API call to update the warranty
    toast.success(`${editFormData.productName} warranty has been updated`);
    setShowEditDialog(false);
  };

  return (
    <>
      <Card className="overflow-hidden transition-all hover:shadow-md">
        <div className="relative h-48">
          <img 
            src={warranty.image || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085'} 
            alt={warranty.productName}
            className="w-full h-full object-cover"
          />
          <div className={`absolute top-3 right-3 ${statusColor} text-white text-xs px-2 py-1 rounded-full`}>
            {statusText}
          </div>
        </div>
        
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-lg text-brand-navy truncate">{warranty.productName}</h3>
              <p className="text-gray-600 text-sm">{warranty.brand}</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleViewDetails}>View Details</DropdownMenuItem>
                <DropdownMenuItem onClick={handleEditWarranty}>Edit Warranty</DropdownMenuItem>
                <DropdownMenuItem onClick={handleGetTroubleshooting}>Get Troubleshooting</DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} className="text-red-500">Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Purchase Date:</span>
              <span className="font-medium">{formatDate(warranty.purchaseDate)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Warranty Until:</span>
              <span className="font-medium">{formatDate(warranty.warrantyEnd)}</span>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="bg-gray-50 p-4 flex justify-between">
          {daysLeft > 0 ? (
            <span className="text-sm">
              <span className="font-medium">{daysLeft}</span> days left
            </span>
          ) : (
            <span className="text-sm">Expired</span>
          )}
          <Button variant="outline" size="sm" onClick={handleViewDetails}>View Details</Button>
        </CardFooter>
      </Card>

      {/* Warranty Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{warranty.productName} Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="w-full h-56 rounded-lg overflow-hidden mb-4">
              <img 
                src={warranty.image || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085'} 
                alt={warranty.productName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Brand</p>
                <p className="font-medium">{warranty.brand}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Category</p>
                <p className="font-medium capitalize">{warranty.category}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Purchase Date</p>
                <p className="font-medium">{formatDate(warranty.purchaseDate)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Warranty Expiry</p>
                <p className="font-medium">{formatDate(warranty.warrantyEnd)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className={`font-medium ${daysLeft < 0 ? 'text-gray-500' : daysLeft < 30 ? 'text-yellow-500' : 'text-green-500'}`}>
                  {statusText}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Days Left</p>
                <p className="font-medium">{daysLeft > 0 ? `${daysLeft} days` : 'Expired'}</p>
              </div>
            </div>
            <div className="pt-4 flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowDetails(false)}>Close</Button>
              <Button onClick={handleEditWarranty}>Edit</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Warranty Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit {warranty.productName}</DialogTitle>
            <DialogDescription>
              Update your warranty information below.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4 pt-4">
            {/* Product Image Upload */}
            <div className="mb-4">
              <Label htmlFor="editProductImage">Product Image</Label>
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
                        setEditFormData(prev => ({ ...prev, image: null }));
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
                  </>
                )}
                <Input
                  id="editProductImage"
                  type="file"
                  className="mt-2"
                  onChange={handleProductImageChange}
                  accept="image/png,image/jpeg,image/jpg"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="productName">Product Name *</Label>
                <Input 
                  id="productName" 
                  value={editFormData.productName}
                  onChange={handleInputChange}
                  placeholder="e.g. Samsung TV, iPhone 14"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="brand">Brand *</Label>
                <Input 
                  id="brand" 
                  value={editFormData.brand}
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
                  value={editFormData.purchaseDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="warrantyEnd">Warranty End Date *</Label>
                <Input 
                  id="warrantyEnd"
                  type="date"
                  value={editFormData.warrantyEnd}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={editFormData.category}
                  onChange={handleInputChange}
                >
                  <option value="electronics">Electronics</option>
                  <option value="appliances">Appliances</option>
                  <option value="furniture">Furniture</option>
                  <option value="automotive">Automotive</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            
            <div className="pt-4 flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setShowEditDialog(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-brand-purple hover:bg-opacity-90">
                Save Changes
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WarrantyCard;
