
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useLocation } from "react-router-dom";

const TroubleshootGuide = () => {
  const [issue, setIssue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [troubleshootResult, setTroubleshootResult] = useState(null);
  const location = useLocation();

  // Extract product name from URL if available
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const productParam = searchParams.get('product');
    
    if (productParam) {
      // Prepopulate the issue field with the product name
      setIssue(`${productParam} issue with `);
    }
  }, [location]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!issue.trim()) {
      toast.error("Please describe the issue you're experiencing");
      return;
    }
    
    setIsLoading(true);
    
    // Simulate AI processing
    setTimeout(() => {
      setIsLoading(false);
      
      // Mock AI response based on common issues
      let response;
      
      if (issue.toLowerCase().includes('laptop') && (
        issue.toLowerCase().includes('screen') || issue.toLowerCase().includes('display')
      )) {
        response = {
          diagnosis: "Laptop Screen Display Issue",
          warrantyStatus: "Likely covered under warranty if less than 1 year old",
          steps: [
            "Check if the issue occurs when connected to external monitor",
            "Update graphics drivers from manufacturer website",
            "Adjust screen brightness and check display settings",
            "Try restarting in safe mode to isolate software issues",
            "If problem persists, it may be hardware-related (LCD panel or cable)"
          ],
          repairOptions: [
            {
              type: "Warranty Service",
              description: "Contact manufacturer support to authorize a repair at authorized service center",
              estimatedCost: "$0 (if under warranty)"
            },
            {
              type: "Screen Replacement",
              description: "Professional repair at service center",
              estimatedCost: "$150-$300 (if out of warranty)"
            },
            {
              type: "Third Party Repair",
              description: "Local computer repair shop",
              estimatedCost: "$100-$250"
            }
          ],
          nearbyServiceCenters: [
            {
              name: "Authorized Service Center",
              distance: "5.2 miles",
              rating: 4.2
            },
            {
              name: "Computer Repair Express",
              distance: "2.7 miles",
              rating: 4.5
            },
            {
              name: "Tech Solutions",
              distance: "3.6 miles",
              rating: 4.8
            }
          ]
        };
      } else if (
        issue.toLowerCase().includes('washing machine') || 
        issue.toLowerCase().includes('washer')
      ) {
        response = {
          diagnosis: "Washing Machine Issue",
          warrantyStatus: "Covered if less than 1 year old. Extended warranty may apply for motor issues.",
          steps: [
            "Check if the machine is properly plugged in and power is available",
            "Ensure water supply valves are fully open",
            "Verify the door/lid is completely closed and locked",
            "Check for error codes on the display panel",
            "Inspect the drain filter for blockages",
            "If water is leaking, check hose connections and door seal"
          ],
          repairOptions: [
            {
              type: "Manufacturer Service",
              description: "Schedule a technician visit through official support",
              estimatedCost: "$0-$85 (diagnostic fee may apply if not under warranty)"
            },
            {
              type: "Professional Repair",
              description: "Local appliance repair service",
              estimatedCost: "$120-$275 depending on parts needed"
            }
          ],
          nearbyServiceCenters: [
            {
              name: "Appliance Repair Pros",
              distance: "3.8 miles",
              rating: 4.7
            },
            {
              name: "Home Appliance Service",
              distance: "4.5 miles",
              rating: 4.3
            }
          ]
        };
      } else {
        response = {
          diagnosis: "General Product Issue",
          warrantyStatus: "Depends on product age and warranty terms",
          steps: [
            "Check if the product is still under warranty (typically 1 year from purchase)",
            "Locate your purchase receipt or warranty card",
            "Contact manufacturer customer support with your issue description",
            "Take photos of the problem if it's visibly apparent",
            "Be prepared to provide the serial number and proof of purchase"
          ],
          repairOptions: [
            {
              type: "Warranty Service",
              description: "Contact official support channels",
              estimatedCost: "$0 (if under warranty)"
            },
            {
              type: "Professional Repair",
              description: "Third-party repair service",
              estimatedCost: "Varies by product type"
            }
          ],
          nearbyServiceCenters: [
            {
              name: "General Repair Center",
              distance: "2.4 miles",
              rating: 4.0
            }
          ]
        };
      }
      
      setTroubleshootResult(response);
      toast.success("Analysis complete!");
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Troubleshooting Guide</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="issue" className="block text-sm font-medium text-gray-700 mb-1">
                Describe the issue you're experiencing
              </label>
              <div className="flex gap-2">
                <Input
                  id="issue"
                  value={issue}
                  onChange={(e) => setIssue(e.target.value)}
                  placeholder="e.g., My laptop screen is flickering intermittently"
                  className="flex-1"
                  autoFocus
                />
                <Button 
                  type="submit" 
                  className="bg-brand-purple hover:bg-opacity-90 whitespace-nowrap"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Analyzing...
                    </>
                  ) : "Get Help"}
                </Button>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Be as specific as possible about the product and symptoms you're experiencing
              </p>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Troubleshoot Results */}
      {troubleshootResult && (
        <div className="space-y-6">
          <Card>
            <CardHeader className="bg-brand-navy text-white">
              <CardTitle>Diagnosis: {troubleshootResult.diagnosis}</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-brand-navy mb-2">Warranty Status</h3>
                  <p className="text-gray-700">{troubleshootResult.warrantyStatus}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-brand-navy mb-2">Troubleshooting Steps</h3>
                  <ol className="list-decimal pl-5 space-y-2">
                    {troubleshootResult.steps.map((step, index) => (
                      <li key={index} className="text-gray-700">{step}</li>
                    ))}
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Repair Options</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {troubleshootResult.repairOptions.map((option, index) => (
                  <div key={index} className="border rounded-md p-4">
                    <div className="flex justify-between">
                      <h4 className="font-medium text-brand-navy">{option.type}</h4>
                      <span className="text-brand-purple font-medium">{option.estimatedCost}</span>
                    </div>
                    <p className="text-gray-600 mt-1">{option.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Nearby Service Centers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {troubleshootResult.nearbyServiceCenters.map((center, index) => (
                  <div key={index} className="flex items-center justify-between border-b pb-3 last:border-0">
                    <div>
                      <h4 className="font-medium">{center.name}</h4>
                      <p className="text-sm text-gray-500">{center.distance} away</p>
                    </div>
                    <div className="flex items-center">
                      <div className="flex items-center mr-2">
                        <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                        <span className="text-sm font-medium">{center.rating}</span>
                      </div>
                      <Button variant="outline" size="sm">Get Directions</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {!isLoading && !troubleshootResult && (
        <div className="text-center py-10">
          <div className="bg-gray-100 inline-flex p-6 rounded-full mb-4">
            <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900">Need help with a product issue?</h3>
          <p className="mt-1 text-gray-500 max-w-md mx-auto">
            Describe your problem above and our AI will help diagnose the issue and suggest
            solutions based on your warranty coverage.
          </p>
        </div>
      )}
    </div>
  );
};

export default TroubleshootGuide;
