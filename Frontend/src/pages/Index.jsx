import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Hero from '../components/layout/Hero';
import Features from '../components/layout/Features';
import Slider from '../components/layout/Slider';
import Testimonials from '../components/layout/Testimonials';
import Footer from '../components/layout/Footer';
import About from './About';

const Index = () => {
  const location = useLocation();
  useEffect(() => {
    if (location.state && location.state.scrollToFeatures) {
      const featuresSection = document.getElementById('features');
      if (featuresSection) {
        featuresSection.scrollIntoView({ behavior: 'smooth' });
      }
      // Remove the state so it doesn't scroll again on refresh
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      {/* Hero Section */}
      <Hero/>
      {/* Features Section */}
      <Features/>  
      {/* How It Works Section */}
      <Slider/>
      {/* Testimonials Section */}
      <Testimonials/>
      {/* Footer */}
      <Footer/>
    </div>
  );
};

export default Index;
