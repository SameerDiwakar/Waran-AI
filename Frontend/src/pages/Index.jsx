import React from 'react';
import Navbar from '../components/layout/Navbar';
import Hero from '../components/layout/Hero';
import Features from '../components/layout/Features';
import Working from '../components/layout/Working';
import CTA from '../components/layout/CTA';
import Footer from '../components/layout/Footer';
import { UserContextProvider } from '../UserContext';

const Index = () => {
  return (
    <UserContextProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        {/* Hero Section */}
        <Hero/>

        {/* Features Section */}
        <Features/>  
        
        {/* How It Works Section */}
        <Working/>
        
        {/* CTA Section */}
        <CTA/>

        {/* Footer */}
        <Footer/>
      </div>
    </UserContextProvider>
  );
};

export default Index;
