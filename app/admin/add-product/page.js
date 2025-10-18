'use client';

import { useState, useEffect } from 'react';
import { db } from '../../../lib/firebase/config';
import { collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { PlusCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

export default function AddProductPage() {
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: '', // This will hold the category ID
    description: '',
    price: '',
    amazonLink: '',
    flipkartLink: '',
    tags: '',
  });
  const [imageUrls, setImageUrls] = useState(['']);
  const [categories, setCategories] = useState([]); // State to hold categories
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Fetch categories from Firestore on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      const categoriesCollection = collection(db, 'categories');
      const categorySnapshot = await getDocs(categoriesCollection);
      const categoriesList = categorySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCategories(categoriesList);
      // Set default category if available
      if (categoriesList.length > 0) {
        setFormData(prev => ({...prev, category: categoriesList[0].id}));
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ... (image URL handlers remain the same)
  const handleImageUrlChange = (index, value) => {
    const newImageUrls = [...imageUrls];
    newImageUrls[index] = value;
    setImageUrls(newImageUrls);
  };

  const addImageUrlInput = () => {
    setImageUrls(prev => [...prev, '']);
  };

  const removeImageUrlInput = (index) => {
    const newImageUrls = [...imageUrls];
    newImageUrls.splice(index, 1);
    setImageUrls(newImageUrls);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category) {
      setError('Please select a category.');
      return;
    }
    // ... (rest of the submit logic remains the same)
    setIsLoading(true);
    setError(null);
    try {
      const priceAsNumber = parseFloat(formData.price);
      if (isNaN(priceAsNumber)) throw new Error('Price must be a valid number.');
      
      const validImageUrls = imageUrls.filter(url => url.trim() !== '').map(url => url.trim());
      const amazonLinks = formData.amazonLink.split(',').map(url => url.trim()).filter(url => url !== '');
      const flipkartLinks = formData.flipkartLink.split(',').map(url => url.trim()).filter(url => url !== '');

      const allUrls = [...validImageUrls, ...amazonLinks, ...flipkartLinks];
      for (const url of allUrls) {
        if (!url.startsWith('http')) {
          throw new Error(`Invalid URL found: "${url}". Please ensure all URLs are complete.`);
        }
      }

      await addDoc(collection(db, 'products'), {
        ...formData,
        price: priceAsNumber,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
        imageUrl: validImageUrls,
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <input name="name" value={formData.name} onChange={handleChange} placeholder="Product Name" required className="bg-gray-700 p-3 rounded"/>
          <input name="brand" value={formData.brand} onChange={handleChange} placeholder="Brand" required className="bg-gray-700 p-3 rounded"/>
          
          {/* CATEGORY DROPDOWN */}
          <select 
            name="category" 
            value={formData.category} 
            onChange={handleChange} 
            required 
            className="w-full bg-gray-700 p-3 rounded text-white"
          >
            <option value="" disabled>Select a Category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          
          <input name="price" value={formData.price} onChange={handleChange} placeholder="Price" type="number" required className="bg-gray-700 p-3 rounded"/>
          <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" required className="md:col-span-2 bg-gray-700 p-3 rounded h-24 resize-y"/>
        </div>

        {/* Dynamic Image URL Inputs */}
        <div className="mb-6">
          <label className="block text-gray-300 text-sm font-bold mb-2">Image URLs</label>
          {imageUrls.map((url, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input value={url} onChange={(e) => handleImageUrlChange(index, e.target.value)} placeholder={`Image URL ${index + 1}`} className="flex-grow bg-gray-700 p-3 rounded"/>
              {imageUrls.length > 1 && (<button type="button" onClick={() => removeImageUrlInput(index)} className="text-red-500 hover:text-red-700 p-1" aria-label={`Remove Image URL ${index + 1}`}><XCircleIcon className="h-6 w-6" /></button>)}
            </div>
          ))}
          <button type="button" onClick={addImageUrlInput} className="flex items-center gap-2 text-blue-400 hover:text-blue-500 mt-2"><PlusCircleIcon className="h-6 w-6" /> Add another image URL</button>
        </div>

        {/* Remaining form fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <textarea name="amazonLink" value={formData.amazonLink} onChange={handleChange} placeholder="Amazon Links (comma-separated)" required className="md:col-span-2 bg-gray-700 p-3 rounded h-24 resize-y"/>
          <textarea name="flipkartLink" value={formData.flipkartLink} onChange={handleChange} placeholder="Flipkart Links (comma-separated)" required className="md:col-span-2 bg-gray-700 p-3 rounded h-24 resize-y"/>
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