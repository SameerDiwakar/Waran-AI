import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WarrantyUploader from '../components/warranty/WarrantyUploader';
import WarrantyCard from '../components/warranty/WarrantyCard';
import TroubleshootGuide from '../components/troubleshoot/TroubleshootGuide';
import DashboardSkeleton from '../components/ui/dashboard-skeleton';

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

const Dashboard = () => {
  const [showUploader, setShowUploader] = useState(false);
  const [warranties, setWarranties] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  
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
    if (activeFilter === 'all') return true;
    if (activeFilter === 'active') return warranty.status === 'active';
    if (activeFilter === 'expiring') return warranty.status === 'expiring';
    if (activeFilter === 'expired') return warranty.status === 'expired';
    return true;
  });

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="waranai-container py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-brand-purple text-white p-1 rounded">
              <span className="font-bold text-xl">W</span>
            </div>
            <span className="text-xl font-bold text-brand-navy">WaranAI</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              className="border-brand-purple text-brand-purple hover:bg-brand-purple hover:text-white"
              onClick={() => setShowUploader(true)}
            >
              Upload Warranty
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <div className="h-10 w-10 rounded-full bg-brand-purple/10 flex items-center justify-center">
                    <span className="text-brand-purple font-semibold">JD</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">John Doe</p>
                    <p className="text-sm text-muted-foreground">john.doe@example.com</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="waranai-container py-8">
        <Tabs defaultValue="warranties" className="space-y-6">
          <TabsList className="bg-white border">
            <TabsTrigger value="warranties">My Warranties</TabsTrigger>
            <TabsTrigger value="troubleshoot">Troubleshoot</TabsTrigger>
          </TabsList>

          <TabsContent value="warranties" className="space-y-6">
            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Active Warranties</p>
                      <h3 className="text-3xl font-bold text-brand-navy mt-2">2</h3>
                    </div>
                    <div className="bg-green-100 p-3 rounded-full">
                      <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Expiring Soon</p>
                      <h3 className="text-3xl font-bold text-brand-navy mt-2">1</h3>
                    </div>
                    <div className="bg-yellow-100 p-3 rounded-full">
                      <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Products</p>
                      <h3 className="text-3xl font-bold text-brand-navy mt-2">3</h3>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-full">
                      <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Warranty Filter */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex flex-wrap gap-2">
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
              
              <Card className="flex flex-col items-center justify-center p-6 border-dashed border-2">
                <Button 
                  variant="ghost" 
                  className="w-full h-full flex flex-col p-8 gap-4"
                  onClick={() => setShowUploader(true)}
                >
                  <div className="bg-brand-purple/10 p-4 rounded-full">
                    <svg className="w-8 h-8 text-brand-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <span className="text-lg font-medium">Add New Warranty</span>
                  <p className="text-sm text-gray-500">
                    Upload a warranty document or add details manually
                  </p>
                </Button>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="troubleshoot">
            <TroubleshootGuide />
          </TabsContent>
        </Tabs>
      </div>

      {showUploader && (
        <WarrantyUploader 
          isOpen={showUploader} 
          onClose={() => setShowUploader(false)} 
          onSuccess={(newWarranty) => {
            setWarranties(prev => [...prev, newWarranty]);
            setShowUploader(false);
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
