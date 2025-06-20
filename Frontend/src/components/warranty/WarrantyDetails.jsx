import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import axios from 'axios';
import { useUser } from '@/UserContext';

const WarrantyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const [warranty, setWarranty] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchWarrantyDetails();
  }, [id]);

  const fetchWarrantyDetails = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/warranty/${id}`);
      setWarranty(response.data);
    } catch (error) {
      console.error('Error fetching warranty details:', error);
      toast.error('Error loading warranty details');
      navigate('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this warranty?')) {
      return;
    }

    try {
      setIsDeleting(true);
      await axios.delete(`/warranty/${id}`);
      toast.success('Warranty deleted successfully');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error deleting warranty:', error);
      toast.error('Error deleting warranty');
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (isLoading) {
    return <div>Loading warranty details...</div>;
  }

  if (!warranty) {
    return <div>Warranty not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-brand-navy">{warranty.productName}</h1>
        <div className="flex gap-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete Warranty'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <Card>
          <CardContent className="p-6">
            <div className="aspect-square rounded-lg overflow-hidden">
              <img 
                src={warranty.image || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085'} 
                alt={warranty.productName}
                className="w-full h-full object-cover"
              />
            </div>
          </CardContent>
        </Card>

        {/* Warranty Details */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Product Information</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Brand</p>
                  <p className="font-medium">{warranty.brand || 'Not specified'}</p>
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
                  <p className="text-sm text-gray-500">Warranty End Date</p>
                  <p className="font-medium">{formatDate(warranty.warrantyEnd)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className={`font-medium ${
                    warranty.status === 'expired' ? 'text-gray-500' :
                    warranty.status === 'expiring soon' ? 'text-yellow-500' :
                    'text-green-500'
                  }`}>
                    {warranty.status}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {warranty.invoice && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Invoice</h2>
                <div className="aspect-[3/4] rounded-lg overflow-hidden">
                  <img 
                    src={warranty.invoice} 
                    alt="Invoice"
                    className="w-full h-full object-cover"
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default WarrantyDetails; 