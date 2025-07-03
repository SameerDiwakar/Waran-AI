import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useUser } from '@/UserContext';
import './Hero.css';
import MagnifierImage from './MagnifierImage';

const Hero = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) {
     
      navigate('/dashboard');
    } else {
      
      navigate('/login');
    }
  };

  return (
    <div>
      
      <section className="bg-gradient-to-br from-brand-navy to-brand-purple py-20 font-['Josefin Sans']">
        <div className="waranai-container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="md:w-1/2 text-white">
              <h1 className="text-4xl md:text-5xl font-semibold mb-6 tracking-tight drop-shadow-lg shiny-text" style={{fontFamily: 'Comic Relief, sans-serif'}}>Never Lose Track of Your Warranties Again</h1>
              <p className="text-lg mb-8 text-gray-100">
                WaranAI uses powerful AI to manage your product warranties, remind you before they expire, and help you troubleshoot issues.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="shiny-border">
                  <Button 
                    size="lg" 
                    variant="default"
                    className="font-bold rounded-full shadow-md border-x-gray-100 border hero-btn hero-btn-getstarted"
                    onClick={handleGetStarted}
                    style={{fontFamily: 'Comic Relief, sans-serif'}}
                  >
                    Get Started
                  </Button>
                </div>
                <Link to="/about" className="w-full sm:w-auto">
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="font-bold shadow-md rounded-full border-brand-purple text-brand-purple bg-white hover:bg-brand-purple hover:text-white hover:border-white transition-colors duration-200 hero-btn hero-btn-learnmore"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center items-center">
              <div className="grid grid-cols-4 grid-rows-3 gap-3 w-full max-w-xs mx-auto">
                <MagnifierImage src="https://images.unsplash.com/photo-1707438095940-1eee18e85400?w=600&auto=format&fit=crop&q=60" alt="Bot" className="object-cover w-full h-20 md:h-28 rounded-2xl shadow-xl col-span-2 row-span-2 hover:scale-105 hover:shadow-2xl transition-transform duration-300" magnifierSize={110} />
                <MagnifierImage src="https://images.unsplash.com/photo-1606221793073-1e3b79689777?w=600&auto=format&fit=crop&q=60" alt="File" className="object-cover w-full h-16 md:h-20 rounded-2xl shadow-xl col-span-2 hover:scale-105 hover:shadow-2xl transition-transform duration-300" magnifierSize={110} />
                <MagnifierImage src="https://media.istockphoto.com/id/1324020590/photo/hair-dryer-with-nozzles-and-round-brush-on-color-background-flat-lay.webp?a=1&b=1&s=612x612&w=0&k=20&c=PXNGJ6ng4zFu17wkJj7WvBYW1TwXaVwQuXaebk-LvM8=" alt="Email" className="object-cover w-full h-16 md:h-20 rounded-2xl shadow-xl col-span-1 row-span-1 hover:scale-105 hover:shadow-2xl transition-transform duration-300" magnifierSize={110} />
                <MagnifierImage src="https://images.unsplash.com/photo-1643875180584-42a67dfa8801?q=80&w=1077&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3Dhttps://images.unsplash.com/photo-1580234797602-22c37b2a6230?w=600&auto=format&fit=crop&q=60" alt="Customer" className="object-cover w-full h-16 md:h-20 rounded-2xl shadow-xl col-span-1 row-span-2 hover:scale-105 hover:shadow-2xl transition-transform duration-300" magnifierSize={110} />
                <MagnifierImage src="https://media.istockphoto.com/id/2204549896/photo/bread-toaster-icon-3d-render-concept-of-electric-toaster-kitchen-appliance-icon-vector.webp?a=1&b=1&s=612x612&w=0&k=20&c=PjWac-MAmepPSoSzOupXEaRgemI1HdcF2Z2zRd1XTLU=" alt="Upload" className="object-cover w-full h-16 md:h-20 rounded-2xl shadow-xl col-span-2 row-span-1 hover:scale-105 hover:shadow-2xl transition-transform duration-300" magnifierSize={110} />
                <MagnifierImage src="https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c21hcnQlMjB3YXRjaHxlbnwwfDB8MHx8fDA%3D" alt="Watch" className="object-cover w-full h-16 md:h-20 rounded-2xl shadow-xl col-span-1 row-span-1 hover:scale-105 hover:shadow-2xl transition-transform duration-300" magnifierSize={110} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Hero
