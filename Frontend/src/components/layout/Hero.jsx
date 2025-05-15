import React from 'react'
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <div>
      <section className="bg-gradient-to-br from-brand-navy to-brand-purple py-20">
        <div className="waranai-container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/2 text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Never Lose Track of Your Warranties Again</h1>
              <p className="text-lg mb-8 text-gray-100">
                WaranAI uses powerful AI to manage your product warranties, remind you before they expire, and help you troubleshoot issues.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register">
                  <Button size="lg" className="bg-white text-brand-purple hover:bg-gray-100 font-bold">
                    Get Started Free
                  </Button>
                </Link>
                <Link to="/about">
                  <Button size="lg" variant="outline" className="border-white text-brand-purple hover:bg-white/10">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" 
                alt="Person managing warranties on laptop" 
                className="rounded-lg shadow-xl w-full object-cover h-80 md:h-96"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Hero
