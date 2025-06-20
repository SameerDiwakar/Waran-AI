import React from 'react';

const WarrantyImageStatus = ({ image, productName, statusColor, statusText }) => (
  <div className="relative h-48">
    <img 
      src={image || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085'} 
      alt={productName}
      className="w-full h-full object-cover"
    />
    <div className={`absolute top-3 right-3 ${statusColor} text-white text-xs px-2 py-1 rounded-full`}>
      {statusText}
    </div>
  </div>
);

export default WarrantyImageStatus; 