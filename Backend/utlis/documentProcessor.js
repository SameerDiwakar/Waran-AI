require('dotenv').config();
const cloudinary = require("./cloudinary");
const { GoogleGenerativeAI } = require('@google/generative-ai');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const tesseract = require('tesseract.js');

const processDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

   

    // Check if it's a PDF and provide helpful error
    if (req.file.mimetype === 'application/pdf') {
      return res.status(400).json({ 
        message: 'PDF processing is currently not supported. Please convert your PDF to an image (JPG, PNG) and try again.',
        error: 'PDF_NOT_SUPPORTED'
      });
    }

    // Check if it's a supported image type
    const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!supportedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ 
        message: 'Unsupported file type. Please upload a JPG, PNG, or JPEG image.',
        error: 'UNSUPPORTED_FILE_TYPE'
      });
    }

    // Step 1: Upload to Cloudinary
    const cloudinaryResult = await cloudinary.uploader.upload(req.file.path, {
      resource_type: 'image',
      folder: 'warranty_documents',
    });

    // Step 2: Download image from Cloudinary
    let imageBuffer;
    let tempImagePath;
    
    try {
      const imageResponse = await axios.get(cloudinaryResult.secure_url, {
        responseType: 'arraybuffer'
      });
      imageBuffer = Buffer.from(imageResponse.data);
      
      // Save to temp file
      const tempDir = path.join(__dirname, '../temp');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }
      tempImagePath = path.join(tempDir, `temp_${Date.now()}.jpg`);
      fs.writeFileSync(tempImagePath, imageBuffer);
      
    } catch (downloadError) {
      return res.status(500).json({ 
        message: 'Error downloading image from Cloudinary',
        error: downloadError.message 
      });
    }

    // Step 3: Run Tesseract OCR
    let ocrText = '';
    try {
      const { data: { text } } = await tesseract.recognize(tempImagePath, 'eng', {
        // logger: m => console.log(m)
      });
      ocrText = text;
    } catch (ocrError) {
      // Clean up temp file
      if (fs.existsSync(tempImagePath)) {
        fs.unlinkSync(tempImagePath);
      }
      return res.status(500).json({ 
        message: 'Error extracting text from document. Please ensure the document is clear and readable.',
        error: ocrError.message 
      });
    }

    // Clean up temp file
    if (fs.existsSync(tempImagePath)) {
      fs.unlinkSync(tempImagePath);
    }

    // Step 4: Extract warranty details using AI or fallback
    
    let extractedData = null;
    
    // Check if Gemini API key is available
    if (!process.env.GEMINI_API_KEY) {
      extractedData = extractWarrantyDetailsManually(ocrText);
    } else {
      // Initialize Gemini AI
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

      const prompt = `
      Extract warranty information from the following text. Return ONLY a JSON object with the following structure:
      {
        "productName": "extracted product name",
        "brand": "extracted brand name", 
        "purchaseDate": "YYYY-MM-DD format",
        "warrantyEnd": "YYYY-MM-DD format",
        "category": "electronics/appliances/furniture/automotive/other"
      }

      If any field cannot be extracted, use null for that field.
      Only return the JSON object, no other text.

      Text to analyze:
      ${ocrText}
      `;

      try {
        // Try different model names - using models available in latest version
        const modelNames = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-1.0-pro"];
        let model = null;
        let result = null;
        
        for (const modelName of modelNames) {
          try {
            model = genAI.getGenerativeModel({ model: modelName });
            result = await model.generateContent(prompt);
            break;
          } catch (modelError) {
            continue;
          }
        }
        
        if (!result) {
          throw new Error('All Gemini models failed');
        }
        
        const response = result.response.text();

        // Parse the JSON response
        try {
          // Clean the response to extract just the JSON
          const jsonMatch = response.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            extractedData = JSON.parse(jsonMatch[0]);
          } else {
            throw new Error('No JSON found in response');
          }
        } catch (parseError) {
          console.error('Error parsing Gemini response:', parseError);
          throw new Error('Failed to parse AI response');
        }
        
      } catch (geminiError) {
        console.error('Gemini AI failed, using manual extraction:', geminiError);
        extractedData = extractWarrantyDetailsManually(ocrText);
      }
    }

    // Validate extracted data
    const validatedData = {
      productName: extractedData.productName || null,
      brand: extractedData.brand || null,
      purchaseDate: extractedData.purchaseDate || null,
      warrantyEnd: extractedData.warrantyEnd || null,
      category: extractedData.category || 'other',
      invoice: cloudinaryResult.secure_url, // Store the invoice URL
      image: null // No product image for now
    };

    res.json({
      message: 'Document processed successfully',
      extractedData: validatedData,
      rawText: ocrText.substring(0, 500) + '...' // Return first 500 chars for debugging
    });

  } catch (error) {
    console.error('Error processing document:', error);
    res.status(500).json({ 
      message: 'Error processing document',
      error: error.message 
    });
  }
};

// Manual extraction function as fallback
const extractWarrantyDetailsManually = (text) => {
  const result = {
    productName: null,
    brand: null,
    purchaseDate: null,
    warrantyEnd: null,
    category: 'other'
  };

  // Extract product name and brand
  const productMatch = text.match(/Product Name:\s*([^\n]+)/i);
  if (productMatch) {
    result.productName = productMatch[1].trim();
  }

  const brandMatch = text.match(/Brand:\s*([^\n]+)/i);
  if (brandMatch) {
    result.brand = brandMatch[1].trim();
  }

  // Extract dates
  const purchaseMatch = text.match(/Purchase Date:\s*([^\n]+)/i);
  if (purchaseMatch) {
    const dateStr = purchaseMatch[1].trim();
    // Try to parse common date formats
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      result.purchaseDate = date.toISOString().split('T')[0];
    }
  }

  const warrantyMatch = text.match(/Warranty End Date:\s*([^\n]+)/i);
  if (warrantyMatch) {
    const dateStr = warrantyMatch[1].trim();
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      result.warrantyEnd = date.toISOString().split('T')[0];
    }
  }

  // Determine category based on product name
  const productName = result.productName?.toLowerCase() || '';
  if (productName.includes('tv') || productName.includes('phone') || productName.includes('laptop') || productName.includes('computer')) {
    result.category = 'electronics';
  } else if (productName.includes('refrigerator') || productName.includes('washer') || productName.includes('dryer') || productName.includes('dishwasher')) {
    result.category = 'appliances';
  } else if (productName.includes('car') || productName.includes('tire') || productName.includes('battery')) {
    result.category = 'automotive';
  } else if (productName.includes('chair') || productName.includes('table') || productName.includes('sofa') || productName.includes('bed')) {
    result.category = 'furniture';
  }

  return result;
};

module.exports = {
  processDocument
}; 