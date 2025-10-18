'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase/config'; // CORRECTED PATH
import { doc, getDoc, updateDoc, collection, getDocs } from 'firebase/firestore';
import { useRouter, useParams } from 'next/navigation';
import { PlusCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

export default function EditProductPage() {
  const [formData, setFormData] = useState({
    name: '', brand: '', category: '', description: '',
    price: '', amazonLink: '', flipkartLink: '', tags: '',
  });
  const [imageUrls, setImageUrls] = useState(['']);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const productDocRef = doc(db, 'products', id);
        const productSnap = await getDoc(productDocRef);

        if (!productSnap.exists()) {
          setError('Product not found.');
          return;
        }
        const productData = productSnap.data();

        const categoriesCollection = collection(db, 'categories');
        const categorySnapshot = await getDocs(categoriesCollection);
        const categoriesList = categorySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCategories(categoriesList);

        setFormData({
          name: productData.name || '',
          brand: productData.brand || '',
          category: productData.category || '',
          description: productData.description || '',
          price: productData.price || '',
          amazonLink: Array.isArray(productData.amazonLink) ? productData.amazonLink.join(', ') : '',
          flipkartLink: Array.isArray(productData.flipkartLink) ? productData.flipkartLink.join(', ') : '',
          tags: Array.isArray(productData.tags) ? productData.tags.join(', ') : '',
        });
        setImageUrls(productData.imageUrl && productData.imageUrl.length > 0 ? productData.imageUrl : ['']);
      } catch (err) {
        setError('Failed to fetch product data.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUrlChange = (index, value) => {
    const newUrls = [...imageUrls];
    newUrls[index] = value;
    setImageUrls(newUrls);
  };
  const addImageUrlInput = () => setImageUrls(prev => [...prev, '']);
  const removeImageUrlInput = (index) => {
    if (imageUrls.length > 1) setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const priceAsNumber = parseFloat(formData.price);
      const validImageUrls = imageUrls.filter(url => url && url.trim() !== '').map(url => url.trim());
      
      const productDocRef = doc(db, 'products', id);
      await updateDoc(productDocRef, {
        name: formData.name,
        brand: formData.brand,
        category: formData.category,
        description: formData.description,
        price: priceAsNumber,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        imageUrl: validImageUrls,
        amazonLink: formData.amazonLink.split(',').map(url => url.trim()).filter(Boolean),
        flipkartLink: formData.flipkartLink.split(',').map(url => url.trim()).filter(Boolean),
      });
      
      router.push('/admin');
    } catch (err) {
      setError(err.message);
      console.error(err);
      setIsLoading(false);
    }
  };

  if (isLoading) return <p className="text-center">Loading product...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  // ... (rest of the component's JSX remains the same)
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Edit Product</h1>
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
         {/* Form fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <input name="name" value={formData.name} onChange={handleChange} placeholder="Product Name" required className="bg-gray-700 p-3 rounded"/>
          <input name="brand" value={formData.brand} onChange={handleChange} placeholder="Brand" required className="bg-gray-700 p-3 rounded"/>
          <select name="category" value={formData.category} onChange={handleChange} required className="w-full bg-gray-700 p-3 rounded text-white">
            <option value="" disabled>Select a Category</option>
            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
          </select>
          <input name="price" value={formData.price} onChange={handleChange} placeholder="Price" type="number" required className="bg-gray-700 p-3 rounded"/>
          <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" required className="md:col-span-2 bg-gray-700 p-3 rounded h-24 resize-y"/>
        </div>
        <div className="mb-6">
          <label className="block text-gray-300 text-sm font-bold mb-2">Image URLs</label>
          {imageUrls.map((url, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input value={url} onChange={(e) => handleImageUrlChange(index, e.target.value)} placeholder={`Image URL ${index + 1}`} className="flex-grow bg-gray-700 p-3 rounded"/>
              {imageUrls.length > 1 && <button type="button" onClick={() => removeImageUrlInput(index)} className="text-red-500 hover:text-red-700"><XCircleIcon className="h-6 w-6" /></button>}
            </div>
          ))}
          <button type="button" onClick={addImageUrlInput} className="flex items-center gap-2 text-blue-400 hover:text-blue-500 mt-2"><PlusCircleIcon className="h-6 w-6" /> Add Image URL</button>
        </div>
        <div className="space-y-6">
          <textarea name="amazonLink" value={formData.amazonLink} onChange={handleChange} placeholder="Amazon Links (comma-separated)" className="w-full bg-gray-700 p-3 rounded h-24 resize-y"/>
          <textarea name="flipkartLink" value={formData.flipkartLink} onChange={handleChange} placeholder="Flipkart Links (comma-separated)" className="w-full bg-gray-700 p-3 rounded h-24 resize-y"/>
          <input name="tags" value={formData.tags} onChange={handleChange} placeholder="Tags (comma-separated)" className="w-full bg-gray-700 p-3 rounded"/>
        </div>
        <button type="submit" disabled={isLoading} className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded disabled:bg-gray-500">
          {isLoading ? 'Updating...' : 'Update Product'}
        </button>
      </form>
    </div>
  );
}