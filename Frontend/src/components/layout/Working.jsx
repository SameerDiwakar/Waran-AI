import React from 'react'

const Working = () => {
  return (
    <div>
         <section className="py-20">
              <div className="waranai-container">
                <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">AI-Powered Warranty Management</h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    See how WaranAI makes managing your product warranties effortless.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <img 
                      src="https://images.unsplash.com/photo-1498050108023-c5249f4df085" 
                      alt="WaranAI dashboard" 
                      className="rounded-lg shadow-lg w-full"
                    />
                  </div>
                  <div className="space-y-8">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 bg-brand-purple/10 w-10 h-10 rounded-full flex items-center justify-center">
                        <span className="text-brand-purple font-bold">1</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-2 text-brand-navy">Upload Your Documents</h3>
                        <p className="text-gray-600">
                          Take a photo or upload a PDF of your purchase receipt or warranty card. Our AI can read and extract important information automatically.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 bg-brand-purple/10 w-10 h-10 rounded-full flex items-center justify-center">
                        <span className="text-brand-purple font-bold">2</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-2 text-brand-navy">Smart Organization</h3>
                        <p className="text-gray-600">
                          Your warranties are automatically categorized by product type, purchase date, and expiration date for easy access.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 bg-brand-purple/10 w-10 h-10 rounded-full flex items-center justify-center">
                        <span className="text-brand-purple font-bold">3</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-2 text-brand-navy">Proactive Notifications</h3>
                        <p className="text-gray-600">
                          Get notified before warranties expire so you can plan ahead and take action while coverage is still valid.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 bg-brand-purple/10 w-10 h-10 rounded-full flex items-center justify-center">
                        <span className="text-brand-purple font-bold">4</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-2 text-brand-navy">AI Troubleshooting</h3>
                        <p className="text-gray-600">
                          When something breaks, ask our AI for help diagnosing the issue and understanding your repair options under warranty.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
    </div>
  )
}

export default Working
