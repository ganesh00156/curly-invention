'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function ProductImageGallery({ images }) {
  // Set the first image as the default active image
  const [activeImage, setActiveImage] = useState(images[0]);

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image Display */}
      <div className="relative w-full aspect-square max-w-lg mx-auto border rounded-lg overflow-hidden">
        <Image
          src={activeImage}
          alt="Product Image"
          fill
          style={{ objectFit: 'contain' }}
          className="p-4"
          priority
        />
      </div>
      
      {/* Thumbnail Selector */}
      <div className="flex justify-center gap-3">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => setActiveImage(img)}
            className={`relative w-20 h-20 border-2 rounded-md overflow-hidden ${activeImage === img ? 'border-blue-600' : 'border-gray-200'}`}
          >
            <Image
              src={img}
              alt={`Thumbnail ${index + 1}`}
              fill
              style={{ objectFit: 'contain' }}
              className="p-1"
            />
          </button>
        ))}
      </div>
    </div>
  );
}