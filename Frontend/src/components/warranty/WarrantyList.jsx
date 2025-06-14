import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import WarrantyCard from './WarrantyCard';
import WarrantyListSkeleton from '../ui/warranty-list-skeleton';

const WarrantyList = () => {
  const [warranties, setWarranties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    // Simulate API call to fetch warranties
    const fetchWarranties = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        setWarranties(SAMPLE_WARRANTIES);
      } catch (error) {
        console.error('Error fetching warranties:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWarranties();
  }, []);

  const filteredWarranties = warranties.filter(warranty => {
    const matchesSearch = warranty.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         warranty.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'all' ? true :
                         activeFilter === 'active' ? warranty.status === 'active' :
                         activeFilter === 'expiring' ? warranty.status === 'expiring' :
                         warranty.status === 'expired';
    return matchesSearch && matchesFilter;
  });

  if (isLoading) {
    return <WarrantyListSkeleton />;
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Search warranties..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <div className="flex gap-2">
          <Button 
            variant={activeFilter === 'all' ? "default" : "outline"} 
            size="sm"
            onClick={() => setActiveFilter('all')}
          >
            All
          </Button>
          <Button 
            variant={activeFilter === 'active' ? "default" : "outline"} 
            size="sm"
            onClick={() => setActiveFilter('active')}
          >
            Active
          </Button>
          <Button 
            variant={activeFilter === 'expiring' ? "default" : "outline"} 
            size="sm"
            onClick={() => setActiveFilter('expiring')}
          >
            Expiring Soon
          </Button>
          <Button 
            variant={activeFilter === 'expired' ? "default" : "outline"} 
            size="sm"
            onClick={() => setActiveFilter('expired')}
          >
            Expired
          </Button>
        </div>
      </div>

      {/* Warranty List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWarranties.map(warranty => (
          <WarrantyCard key={warranty.id} warranty={warranty} />
        ))}
      </div>

      {filteredWarranties.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No warranties found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

// Sample data for demonstration
const SAMPLE_WARRANTIES = [
  {
    id: '1',
    productName: 'MacBook Pro 16"',
    brand: 'Apple',
    purchaseDate: '2023-10-15',
    warrantyEnd: '2025-10-15',
    status: 'active',
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7'
  },
  {
    id: '2',
    productName: 'Sony WH-1000XM4',
    brand: 'Sony',
    purchaseDate: '2023-08-20',
    warrantyEnd: '2024-08-20',
    status: 'active',
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1578319439584-104c94d37305'
  },
  {
    id: '3',
    productName: 'Samsung 4K TV',
    brand: 'Samsung',
    purchaseDate: '2022-06-10',
    warrantyEnd: '2023-12-10',
    status: 'expiring',
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575'
  }
];

export default WarrantyList; 