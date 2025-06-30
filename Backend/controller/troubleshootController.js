require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const troubleshootIssue = async (req, res) => {
  try {
    const { issue, productName, warrantyInfo } = req.body;
    
    if (!issue || !issue.trim()) {
      return res.status(400).json({ message: 'Issue description is required' });
    }

    // Check if Gemini API key is available
    if (!process.env.GEMINI_API_KEY) {
      console.log('GEMINI_API_KEY not found, using fallback response');
      
      // Fallback response without AI
      const fallbackResponse = {
        diagnosis: "General Product Issue Analysis",
        warrantyStatus: warrantyInfo ? "Based on your warranty information" : "Please check your warranty terms",
        steps: [
          "Check if the product is properly connected and powered on",
          "Verify all cables and connections are secure",
          "Try restarting the device",
          "Check for any visible damage or loose parts",
          "Contact manufacturer support if the issue persists"
        ],
        repairOptions: [
          {
            type: "Warranty Service",
            description: "Contact manufacturer support for warranty-covered repairs"
          },
          {
            type: "Professional Repair",
            description: "Local repair service"
          }
        ],
        // nearbyServiceCenters: [
        //   {
        //     name: "Local Service Center",
        //     distance: "Check your area",
        //     rating: 4.0
        //   }
        // ],
        additionalNotes: "This is a fallback response. For more specific advice, please ensure the GEMINI_API_KEY is configured."
      };

      return res.json({
        success: true,
        result: fallbackResponse
      });
    }

    // Initialize Gemini AI only if API key is available
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Create a comprehensive prompt for the AI
    const prompt = `
You are a professional warranty and technical support specialist based in India. A customer is experiencing an issue with their product and needs troubleshooting assistance.

Customer Issue: ${issue}
${productName ? `Product: ${productName}` : ''}
${warrantyInfo ? `Warranty Information: ${warrantyInfo}` : ''}

Please provide a comprehensive troubleshooting analysis in the following JSON format:

{
  "diagnosis": "Brief diagnosis of the likely problem",
  "warrantyStatus": "Assessment of warranty coverage for this issue",
  "steps": [
    "Step 1: First troubleshooting step",
    "Step 2: Second troubleshooting step",
    "Step 3: Third troubleshooting step",
    "Step 4: Fourth troubleshooting step",
    "Step 5: Fifth troubleshooting step"
  ],
  "repairOptions": [
    {
      "type": "Warranty Service",
      "description": "Description of warranty service option"
    },
    {
      "type": "Professional Repair",
      "description": "Description of professional repair option"
    },
    {
      "type": "DIY Repair",
      "description": "Description of DIY repair option if applicable"
    }
  ],
  "additionalNotes": "Any additional important information or warnings"
}

Please ensure the response is valid JSON and provides practical, actionable advice. Focus on common issues and realistic solutions. If the issue is complex or potentially dangerous, recommend professional assistance.
`;

    console.log('Sending prompt to Gemini AI:', prompt);

    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    console.log('Raw AI response:', response);

    // Try to parse the JSON response
    let parsedResponse;
    try {
      // Extract JSON from the response (in case AI adds extra text)
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedResponse = JSON.parse(jsonMatch[0]);
      } else {
        parsedResponse = JSON.parse(response);
      }
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      console.log('Raw response that failed to parse:', response);
      
      // Fallback response if JSON parsing fails
      parsedResponse = {
        diagnosis: "Unable to parse AI response",
        warrantyStatus: "Please contact customer support for warranty information",
        steps: [
          "Contact the manufacturer's customer support",
          "Provide detailed description of the issue",
          "Have your warranty information ready",
          "Take photos of the problem if applicable"
        ],
        repairOptions: [
          {
            type: "Contact Support",
            description: "Reach out to manufacturer support for assistance"
          }
        ],
        // nearbyServiceCenters: [],
        additionalNotes: "The AI response could not be parsed. Please try again or contact support directly."
      };
    }

    res.json({
      success: true,
      result: parsedResponse
    });

  } catch (error) {
    console.error('Troubleshoot error:', error);
    
    // Handle specific AI API errors
    if (error.message.includes('API_KEY')) {
      return res.status(500).json({ 
        success: false,
        message: 'AI service authentication error. Please contact support.' 
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Error processing troubleshooting request',
      error: error.message 
    });
  }
};

module.exports = { 
  troubleshootIssue
}; 