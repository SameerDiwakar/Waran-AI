import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const WarrantyDetailsDialog = ({ open, onOpenChange, warranty, daysLeft, statusText, formatDate, onEdit }) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
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
          <div>
            <p className="text-sm text-gray-500">Invoice Number</p>
            <p className="font-medium">{warranty.invoice || 'Not provided'}</p>
          </div>
        </div>
        <div className="pt-4 flex justify-end space-x-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
          <Button onClick={onEdit}>Edit</Button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
);

export default WarrantyDetailsDialog; 