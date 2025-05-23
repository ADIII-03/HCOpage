import React from 'react';

const FounderMessage = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="w-full md:w-1/3">
          <div className="relative rounded-full overflow-hidden aspect-square">
            <img 
              src="/images/WhatsApp Image 2025-05-15 at 00.43.28_409cd770.jpg"
              alt="Saba Sheikh"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null; // Prevent infinite loop
                console.error('Failed to load founder image');
                // You can set a fallback image here if needed
                // e.target.src = '/path/to/fallback-image.jpg';
              }}
            />
          </div>
        </div>
        <div className="w-full md:w-2/3">
          <p className="text-lg mb-6 italic">"At Humanity Club Organization, we believe in the power of small acts of kindness to create big impacts. Our journey is about bringing people together, fostering compassion, and creating lasting positive change in our communities. Together, we can build a more inclusive and caring world."</p>
          <div>
            <h3 className="text-xl font-semibold">Saba Sheikh</h3>
            <p className="text-gray-600">-Founder HCO</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FounderMessage; 