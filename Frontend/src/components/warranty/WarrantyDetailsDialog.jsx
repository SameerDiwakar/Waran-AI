import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const WarrantyDetailsDialog = ({ open, onOpenChange, warranty, daysLeft, statusText, formatDate, onEdit }) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-md max-h-[85vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{warranty.productName} Details</DialogTitle>
      </DialogHeader>
      <DialogDescription>
        Detailed information about your warranty, including brand, category, purchase and expiry dates, and status.
      </DialogDescription>
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
          <div className="col-span-2">
            <p className="text-sm text-gray-500 mb-1">Invoice File</p>
            {warranty.invoice ? (
              <Button
                variant="secondary"
                onClick={() => window.open(warranty.invoice, '_blank')}
                className="w-full"
              >
                Preview Invoice
              </Button>
            ) : (
              <span className="font-medium text-gray-400">No invoice uploaded</span>
            )}
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