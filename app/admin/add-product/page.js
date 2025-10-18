'use client';

import { useState } from 'react';
import { db } from '../../../lib/firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function AddProductPage() {
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: '',
    description: '',
    imageUrl: '',
    price: '',
    amazonLink: '',
    flipkartLink: '',
    tags: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const priceAsNumber = parseFloat(formData.price);
      if (isNaN(priceAsNumber)) {
        throw new Error('Price must be a valid number.');
      }
      
      const imageUrls = formData.imageUrl.split(',').map(url => url.trim());
      const amazonLinks = formData.amazonLink.split(',').map(url => url.trim());
      const flipkartLinks = formData.flipkartLink.split(',').map(url => url.trim());

      // **NEW: URL Validation Logic**
      const allUrls = [...imageUrls, ...amazonLinks, ...flipkartLinks];
      for (const url of allUrls) {
        // Simple check to ensure it starts with http
        if (!url.startsWith('http')) {
          throw new Error(`Invalid URL found: "${url}". Please ensure all URLs are complete.`);
        }
      }

      await addDoc(collection(db, 'products'), {
        name: formData.name,
        brand: formData.brand,
        category: formData.category,
        description: formData.description,
        price: priceAsNumber,
        tags: formData.tags.split(',').map(tag => tag.trim()),
        imageUrl: imageUrls,
        amazonLink: amazonLinks,
        flipkartLink: flipkartLinks,
        createdAt: serverTimestamp(),
      });
      
      router.push('/admin');

    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Add New Product</h1>
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input name="name" value={formData.name} onChange={handleChange} placeholder="Product Name" required className="bg-gray-700 p-3 rounded"/>
          <input name="brand" value={formData.brand} onChange={handleChange} placeholder="Brand" required className="bg-gray-700 p-3 rounded"/>
          <input name="category" value={formData.category} onChange={handleChange} placeholder="Category" required className="bg-gray-700 p-3 rounded"/>
          <input name="price" value={formData.price} onChange={handleChange} placeholder="Price" type="number" required className="bg-gray-700 p-3 rounded"/>
          <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" required className="md:col-span-2 bg-gray-700 p-3 rounded h-24"/>
          
          <textarea name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="Image URLs (comma-separated)" required className="md:col-span-2 bg-gray-700 p-3 rounded h-24"/>
          <textarea name="amazonLink" value={formData.amazonLink} onChange={handleChange} placeholder="Amazon Links (comma-separated)" required className="md:col-span-2 bg-gray-700 p-3 rounded h-24"/>
          <textarea name="flipkartLink" value={formData.flipkartLink} onChange={handleChange} placeholder="Flipkart Links (comma-separated)" required className="md:col-span-2 bg-gray-700 p-3 rounded h-24"/>
          
          <input name="tags" value={formData.tags} onChange={handleChange} placeholder="Tags (comma-separated)" className="md:col-span-2 bg-gray-700 p-3 rounded"/>
        </div>

        {error && <p className="text-red-500 mt-4">{error}</p>}

        <button type="submit" disabled={isLoading} className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded disabled:bg-gray-500">
          {isLoading ? 'Adding...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
}