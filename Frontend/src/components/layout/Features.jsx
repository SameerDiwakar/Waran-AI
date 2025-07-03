import React from 'react'
import './Features.css';

const Features = () => {
  return (
    <div>
       <section id="features" className="py-20 bg-gray-50">
        <div className="waranai-container">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-4xl font-extrabold text-brand-navy mb-2 leading-tight drop-shadow-lg">
              How <span className="text-brand-purple">WaranAI</span> Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our AI-powered platform simplifies warranty management and helps you get the most out of your purchases.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="waranai-card p-6 feature-card transition-transform duration-300 hover:scale-105">
              <div className="bg-brand-purple/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-brand-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-brand-navy">Upload Invoices</h3>
              <p className="text-gray-600">
                Simply upload photos or PDFs of your invoices and warranty documents. Our AI extracts all important information.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="waranai-card p-6 feature-card transition-transform duration-300 hover:scale-105">
              <div className="bg-brand-purple/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-brand-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-brand-navy">Get Reminders</h3>
              <p className="text-gray-600">
                Receive timely notifications before your warranties expire so you never miss claiming what's rightfully yours.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="waranai-card p-6 feature-card transition-transform duration-300 hover:scale-105">
              <div className="bg-brand-purple/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-brand-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-brand-navy">Get Help</h3>
              <p className="text-gray-600">
                Our AI troubleshooting guide helps diagnose issues and tells you if repairs are covered under warranty.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="waranai-card p-6 feature-card transition-transform duration-300 hover:scale-105">
              <div className="bg-brand-purple/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-brand-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M3 7l9 6 9-6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-brand-navy">Centralized Dashboard</h3>
              <p className="text-gray-600">
                View and manage all your warranties in one place for easy access and organization.
              </p>
            </div>
          </div>
        </div>
      </section>
      
    </div>
  )
}

export default Features
