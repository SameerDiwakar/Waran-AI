import React from 'react'
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const CTA = () => {
  return (
    <div>
         <section className="bg-brand-navy py-16">
              <div className="waranai-container">
                <div className="text-center">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Never Worry About Warranties Again?</h2>
                  <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                    Join thousands of users who save time and money by letting WaranAI manage their product warranties.
                  </p>
                  <Link to="/register">
                    <Button size="lg" className="bg-brand-teal hover:bg-opacity-90 text-white font-bold text-lg px-8">
                      Start Your Free Trial
                    </Button>
                  </Link>
                </div>
              </div>
            </section>
            
    </div>
  )
}

export default CTA
