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
import axios from 'axios';
import { useUser } from '@/UserContext';
import WarrantyImageStatus from './WarrantyImageStatus';
import WarrantyDetailsDialog from './WarrantyDetailsDialog';
import EditWarrantyDialog from './EditWarrantyDialog';

const WarrantyCard = ({ warranty, onUpdate, onDelete }) => {
  const { user } = useUser();
  
  // Debug logging
  // console.log('WarrantyCard received warranty:', warranty);
  // console.log('Warranty ID:', warranty._id || warranty.id);
  
  // Calculate days left in warranty
  const today = new Date();
  const warrantyEndDate = new Date(warranty.warrantyEnd);
  const daysLeft = Math.ceil((warrantyEndDate - today) / (1000 * 60 * 60 * 24));
  
  // Determine status color and text based on backend status
  let statusColor = 'bg-green-500';
  let statusText = warranty.status;
  
  if (warranty.status === 'expired') {
    statusColor = 'bg-gray-500';
  } else if (warranty.status === 'expiring soon') {
    statusColor = 'bg-yellow-500';
  }

  // State for dialogs
  const [showDetails, setShowDetails] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editFormData, setEditFormData] = useState({
    productName: warranty.productName,
    brand: warranty.brand || '',
    purchaseDate: warranty.purchaseDate,
    warrantyEnd: warranty.warrantyEnd,
    category: warranty.category,
    invoice: warranty.invoice || ''
  });

  // State for image preview
  const [imagePreview, setImagePreview] = useState(warranty.image);
  const [newImageFile, setNewImageFile] = useState(null);

  // Format dates for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleViewDetails = () => {
    setShowDetails(true);
  };

  const handleEditWarranty = () => {
    setEditFormData({
      productName: warranty.productName,
      brand: warranty.brand || '',
      purchaseDate: warranty.purchaseDate,
      warrantyEnd: warranty.warrantyEnd,
      category: warranty.category,
      invoice: warranty.invoice || ''
    });
    setImagePreview(warranty.image);
    setNewImageFile(null);
    setShowEditDialog(true);
  };

  const handleGetTroubleshooting = () => {
    window.location.href = `/dashboard?tab=troubleshoot&product=${encodeURIComponent(warranty.productName)}`;
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      const warrantyId = warranty._id || warranty.id;
      console.log('Deleting warranty with ID:', warrantyId);
      await axios.delete(`/warranty/${warrantyId}`);
      toast.success(`${warranty.productName} warranty has been deleted`);
      onDelete(warrantyId);
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.response?.data?.message || "Error deleting warranty");
    } finally {
      setIsLoading(false);
    }
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
      setNewImageFile(selectedFile);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!editFormData.productName || !editFormData.purchaseDate || !editFormData.warrantyEnd || !editFormData.category) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    try {
      setIsLoading(true);
      const formData = new FormData();
      
      // Append all form fields
      Object.keys(editFormData).forEach(key => {
        if (editFormData[key] !== null) {
          formData.append(key, editFormData[key]);
        }
      });
      
      // Add new image if selected
      if (newImageFile) {
        formData.append('image', newImageFile);
      }
      
      // Add userId
      formData.append('userId', user._id);
      
      const response = await axios.put(`/warranty/${warranty._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data) {
        toast.success(`${editFormData.productName} warranty has been updated`);
        onUpdate(response.data.warranty);
        setShowEditDialog(false);
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error.response?.data?.message || "Error updating warranty");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card className="overflow-hidden transition-all hover:shadow-md">
        <WarrantyImageStatus 
          image={warranty.image}
          productName={warranty.productName}
          statusColor={statusColor}
          statusText={statusText}
        />
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
      <WarrantyDetailsDialog
        open={showDetails}
        onOpenChange={setShowDetails}
        warranty={warranty}
        daysLeft={daysLeft}
        statusText={statusText}
        formatDate={formatDate}
        onEdit={handleEditWarranty}
      />
      <EditWarrantyDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        editFormData={editFormData}
        imagePreview={imagePreview}
        onProductImageChange={handleProductImageChange}
        onInputChange={handleInputChange}
        onRemoveImage={() => {
          setImagePreview(null);
          setEditFormData(prev => ({ ...prev, image: null }));
        }}
        onSubmit={handleEditSubmit}
        isLoading={isLoading}
        setShowEditDialog={setShowEditDialog}
      />
    </>
  );
};

export default WarrantyCard;
