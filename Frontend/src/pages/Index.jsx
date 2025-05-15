import React from 'react';
import Navbar from '../components/layout/Navbar';
import Hero from '../components/layout/Hero';
import Features from '../components/layout/Features';
import Working from '../components/layout/Working';
import CTA from '../components/layout/CTA';
import Footer from '../components/layout/Footer';

const Index = () => {
  return (
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
  );
};

export default Index;
