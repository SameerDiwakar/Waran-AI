import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ManualWarrantyEntry from './ManualWarrantyEntry';
import ScanDocumentUpload from './ScanDocumentUpload';

const WarrantyUploader = ({ isOpen, onClose, onSuccess }) => {
  const [uploadType, setUploadType] = useState('scan');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md md:max-w-xl max-h-[85vh] overflow-y-auto">
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
          
          <TabsContent value="scan" className="mt-4">
            <ScanDocumentUpload onSuccess={onSuccess} onClose={onClose} />
          </TabsContent>
          
          <TabsContent value="manual" className="mt-4">
            <ManualWarrantyEntry onSuccess={onSuccess} onClose={onClose} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default WarrantyUploader;
