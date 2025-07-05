import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const EditWarrantyDialog = ({
  open,
  onOpenChange,
  editFormData,
  imagePreview,
  invoicePreview,
  onProductImageChange,
  onInvoiceFileChange,
  onInputChange,
  onRemoveImage,
  onRemoveInvoice,
  onSubmit,
  isLoading,
  setShowEditDialog
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-md max-h-[85vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Edit {editFormData.productName}</DialogTitle>
        <DialogDescription>
          Update your warranty information below.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={onSubmit} className="space-y-4 pt-4">
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
                  onClick={onRemoveImage}
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
              onChange={onProductImageChange}
              accept="image/png,image/jpeg,image/jpg"
            />
          </div>
        </div>

        {/* Invoice File Upload */}
        <div className="mb-4">
          <Label htmlFor="editInvoiceFile">Invoice/Receipt File</Label>
          <div className="mt-1 border-2 border-dashed rounded-md p-4 text-center">
            {invoicePreview ? (
              <div className="space-y-2">
                <div className="flex justify-center">
                  {typeof invoicePreview === 'string' && invoicePreview.startsWith('http') ? (
                    // Existing invoice URL from database
                    <div className="space-y-2">
                      <div className="bg-gray-100 p-4 rounded">
                        <svg className="w-8 h-8 text-gray-600 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-sm text-gray-600 mt-1">Invoice Available</p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(invoicePreview, '_blank')}
                      >
                        View Invoice
                      </Button>
                    </div>
                  ) : typeof invoicePreview === 'string' && invoicePreview.endsWith('.pdf') ? (
                    // New PDF file selected
                    <div className="space-y-2">
                      <div className="bg-red-100 p-4 rounded">
                        <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                        </svg>
                        <p className="text-sm text-red-600 mt-1">PDF Document</p>
                      </div>
                      <p className="text-xs text-gray-500">{invoicePreview}</p>
                    </div>
                  ) : (
                    // New image file selected
                    <div className="space-y-2">
                      <img 
                        src={invoicePreview} 
                        alt="Invoice preview" 
                        className="h-40 w-auto object-contain rounded mx-auto"
                      />
                      <p className="text-xs text-gray-500">New image selected</p>
                    </div>
                  )}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onRemoveInvoice}
                >
                  Remove Invoice
                </Button>
              </div>
            ) : (
              <>
                <div className="flex justify-center">
                  <div className="bg-gray-100 p-4 rounded-full">
                    <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2">Upload invoice or receipt (PDF/Image)</p>
              </>
            )}
            <Input
              id="editInvoiceFile"
              type="file"
              className="mt-2"
              onChange={onInvoiceFileChange}
              accept=".pdf,image/png,image/jpeg,image/jpg"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="productName">Product Name *</Label>
            <Input 
              id="productName" 
              value={editFormData.productName}
              onChange={onInputChange}
              placeholder="e.g. Samsung TV, iPhone 14"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="brand">Brand *</Label>
            <Input 
              id="brand" 
              value={editFormData.brand}
              onChange={onInputChange}
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
              onChange={onInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="warrantyEnd">Warranty End Date *</Label>
            <Input 
              id="warrantyEnd"
              type="date"
              value={editFormData.warrantyEnd}
              onChange={onInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={editFormData.category}
              onChange={onInputChange}
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
          <Button type="submit" className="bg-brand-purple hover:bg-opacity-90" disabled={isLoading}>
            Save Changes
          </Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>
);

export default EditWarrantyDialog; 