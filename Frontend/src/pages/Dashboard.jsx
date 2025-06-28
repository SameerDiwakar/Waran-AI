import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WarrantyUploader from '../components/warranty/WarrantyUploader';
import WarrantyCard from '../components/warranty/WarrantyCard';
import TroubleshootGuide from '../components/troubleshoot/TroubleshootGuide';
import DashboardSkeleton from '../components/ui/dashboard-skeleton';
import { UserContext } from '@/UserContext';
import axios from 'axios';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import DashboardStatsCard from '../components/dashboard/DashboardStatsCard';

const Dashboard = () => {
  const [showUploader, setShowUploader] = useState(false);
  const [warranties, setWarranties] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      await axios.post('/logout');
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  useEffect(() => {
    const fetchWarranties = async () => {
      try {
        setIsLoading(true);
        if (!user || !user._id) return;
        const response = await axios.get(`/warranties?userId=${user._id}`);
        setWarranties(response.data);
      } catch (error) {
        console.error('Error fetching warranties:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchWarranties();
  }, [user]);

  const filteredWarranties = warranties.filter(warranty => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'active') return warranty.status === 'active';
    if (activeFilter === 'expiring') return warranty.status === 'expiring soon';
    if (activeFilter === 'expired') return warranty.status === 'expired';
    return true;
  });

  const handleUpdateWarranty = (updatedWarranty) => {
    setWarranties(prev => 
      prev.map(w => (w._id || w.id) === (updatedWarranty._id || updatedWarranty.id) ? updatedWarranty : w)
    );
  };

  const handleDeleteWarranty = (warrantyId) => {
    setWarranties(prev => prev.filter(w => (w._id || w.id) !== warrantyId));
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={user} setShowUploader={setShowUploader} handleLogout={handleLogout} />
      <div className="waranai-container py-8">
        <Tabs defaultValue="warranties" className="space-y-6">
          <TabsList className="bg-white border">
            <TabsTrigger value="warranties">My Warranties</TabsTrigger>
            <TabsTrigger value="troubleshoot">Troubleshoot</TabsTrigger>
          </TabsList>
          <TabsContent value="warranties" className="space-y-6">
            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <DashboardStatsCard
                title="Active Warranties"
                value={warranties.filter(w => w.status === 'active').length}
                icon={
                  <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
                iconBgClass="bg-green-100"
              />
              <DashboardStatsCard
                title="Expiring Soon"
                value={warranties.filter(w => w.status === 'expiring soon').length}
                icon={
                  <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
                iconBgClass="bg-yellow-100"
              />
              <DashboardStatsCard
                title="Expired"
                value={warranties.filter(w => w.status === 'expired').length}
                icon={
                  <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                }
                iconBgClass="bg-gray-100"
              />
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
                <WarrantyCard 
                  key={warranty._id || warranty.id} 
                  warranty={warranty}
                  onUpdate={handleUpdateWarranty}
                  onDelete={handleDeleteWarranty}
                />
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
