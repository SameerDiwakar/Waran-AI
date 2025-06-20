import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import WarrantyCard from './WarrantyCard';
import axios from 'axios';
import { useUser } from '@/UserContext';

const WarrantyList = () => {
  const { user } = useUser();
  const [warranties, setWarranties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchWarranties();
  }, []);

  const fetchWarranties = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/warranties?userId=${user._id}`);
      setWarranties(response.data);
    } catch (error) {
      console.error('Error fetching warranties:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateWarranty = (updatedWarranty) => {
    setWarranties(prev => 
      prev.map(w => w._id === updatedWarranty._id ? updatedWarranty : w)
    );
  };

  const handleDeleteWarranty = (warrantyId) => {
    setWarranties(prev => prev.filter(w => w._id !== warrantyId));
  };

  const filteredWarranties = warranties.filter(warranty => {
    const matchesSearch = warranty.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (warranty.brand && warranty.brand.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || warranty.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || warranty.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  if (isLoading) {
    return <div>Loading warranties...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Search by product name or brand..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="electronics">Electronics</SelectItem>
            <SelectItem value="appliances">Appliances</SelectItem>
            <SelectItem value="automotive">Automotive</SelectItem>
            <SelectItem value="furniture">Furniture</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="expiring soon">Expiring Soon</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Warranty Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWarranties.map(warranty => (
          <WarrantyCard 
            key={warranty._id} 
            warranty={warranty}
            onUpdate={handleUpdateWarranty}
            onDelete={handleDeleteWarranty}
          />
        ))}
      </div>

      {filteredWarranties.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No warranties found</p>
        </div>
      )}
    </div>
  );
};

export default WarrantyList; 