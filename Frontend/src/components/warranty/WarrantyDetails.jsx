import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";
import WarrantyDetailsSkeleton from '../ui/warranty-details-skeleton';

const WarrantyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [warranty, setWarranty] = useState(null);

  useEffect(() => {
    // Simulate API call to fetch warranty details
    const fetchWarrantyDetails = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        // Mock data - in a real app, this would come from an API
        setWarranty({
          id: id,
          productName: 'MacBook Pro 16"',
          brand: 'Apple',
          purchaseDate: '2023-10-15',
          warrantyEnd: '2025-10-15',
          status: 'active',
          category: 'electronics',
          image: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7',
          serialNumber: 'MBP2023-123456',
          modelNumber: 'A2482',
          purchasePrice: '$2,499.00',
          store: 'Apple Store',
          receiptNumber: 'INV-2023-1234',
          notes: 'Extended warranty purchased for 3 years'
        });
      } catch (error) {
        console.error('Error fetching warranty details:', error);
        toast.error('Failed to load warranty details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWarrantyDetails();
  }, [id]);

  if (isLoading) {
    return <WarrantyDetailsSkeleton />;
  }

  if (!warranty) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Warranty not found</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => navigate('/dashboard')}
        >
          Back to Dashboard
        </Button>
      </div>
    );
  }

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

  // Format dates for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-brand-navy">{warranty.productName}</h1>
          <p className="text-gray-500">{warranty.brand}</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </Button>
          <Button 
            variant="default"
            onClick={() => navigate(`/warranty/${id}/edit`)}
          >
            Edit Warranty
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Warranty Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Warranty Information</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-500">Serial Number</span>
                <span className="font-medium">{warranty.serialNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Model Number</span>
                <span className="font-medium">{warranty.modelNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Purchase Date</span>
                <span className="font-medium">{formatDate(warranty.purchaseDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Warranty End Date</span>
                <span className="font-medium">{formatDate(warranty.warrantyEnd)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Purchase Price</span>
                <span className="font-medium">{warranty.purchasePrice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Store</span>
                <span className="font-medium">{warranty.store}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Receipt Number</span>
                <span className="font-medium">{warranty.receiptNumber}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Warranty History</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-full bg-brand-purple/10 flex items-center justify-center">
                    <svg className="w-6 h-6 text-brand-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Warranty Registered</p>
                    <p className="text-sm text-gray-500">{formatDate(warranty.purchaseDate)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-full bg-brand-purple/10 flex items-center justify-center">
                    <svg className="w-6 h-6 text-brand-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Extended Warranty Added</p>
                    <p className="text-sm text-gray-500">{formatDate(warranty.purchaseDate)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Status and Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Warranty Status</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className={`inline-flex items-center px-3 py-1 rounded-full ${statusColor} text-white`}>
                {statusText}
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Days Remaining</p>
                <p className="text-2xl font-bold">{daysLeft > 0 ? daysLeft : 'Expired'}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Quick Actions</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full" variant="outline">
                Download Warranty Document
              </Button>
              <Button className="w-full" variant="outline">
                Contact Support
              </Button>
              <Button className="w-full" variant="outline">
                Report an Issue
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WarrantyDetails; 