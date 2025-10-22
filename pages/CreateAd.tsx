import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAds, NewAdData } from '../contexts/AdContext';
import { PhotoIcon, CheckCircleIcon, ExclamationTriangleIcon, XCircleIcon } from '@heroicons/react/24/outline';

const CreateAd: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { addAd, cities, categories } = useAds();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    categoryId: '',
    cityId: '',
    price: '',
    description: '',
  });
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  
  // Set default dropdown values once categories and cities are loaded
  useEffect(() => {
    if (categories.length > 0 && cities.length > 0) {
      setFormData(prev => ({
        ...prev,
        categoryId: String(categories[0].id),
        cityId: String(cities[0].id)
      }));
    }
  }, [categories, cities]);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      imagePreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const currentImageCount = images.length;
      const filesToAdd = files.slice(0, 5 - currentImageCount); // Limit to 5 images total

      setImages(prev => [...prev, ...filesToAdd]);
      const newPreviews = filesToAdd.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    URL.revokeObjectURL(imagePreviews[index]); // Clean up memory
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    
    setSubmitting(true);
    
    // TODO: Implement real image uploads.
    // In a real app, you would:
    // 1. Get a signature from your backend.
    // 2. Upload images to a service like Cloudinary.
    // 3. Get back the secure URLs.
    // For now, we'll use placeholder URLs.
    const imageUrls = imagePreviews.length > 0 ? imagePreviews : [`https://picsum.photos/seed/${Math.random()}/800/600`];
    
    const newAdData: NewAdData = {
      title: formData.title,
      description: formData.description,
      price: formData.price ? Number(formData.price) : null,
      cityId: Number(formData.cityId),
      categoryId: Number(formData.categoryId),
      imageUrls: imageUrls
    };
    
    try {
      await addAd(newAdData);
      setIsSubmitted(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } catch (error) {
      console.error("Failed to create ad:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      alert(`Failed to create ad: ${errorMessage}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
        <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-lg mx-auto">
            <ExclamationTriangleIcon className="h-16 w-16 text-brand-red mx-auto mb-4"/>
            <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-6">You must be logged in to post an advertisement.</p>
            <button onClick={() => navigate('/login')} className="bg-brand-saffron hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-lg transition duration-300">
                Go to Login
            </button>
        </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-lg mx-auto">
        <CheckCircleIcon className="h-16 w-16 text-brand-green mx-auto mb-4"/>
        <h2 className="text-2xl font-bold mb-2">Success!</h2>
        <p className="text-gray-600">Your ad "{formData.title}" has been submitted.</p>
        <p className="text-sm text-gray-500 mt-4">You will be redirected to your dashboard shortly...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 border-b pb-4">Create a New Advertisement</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Ad Title</label>
          <input type="text" id="title" value={formData.title} onChange={handleInputChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-saffron focus:border-brand-saffron"/>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">Category</label>
              <select id="categoryId" value={formData.categoryId} onChange={handleInputChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-saffron focus:border-brand-saffron">
                <option value="" disabled>Select a category</option>
                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="cityId" className="block text-sm font-medium text-gray-700">City</label>
              <select id="cityId" value={formData.cityId} onChange={handleInputChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-saffron focus:border-brand-saffron">
                <option value="" disabled>Select a city</option>
                {cities.map(city => <option key={city.id} value={city.id}>{city.name}</option>)}
              </select>
            </div>
        </div>

        <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price (€)</label>
            <input type="number" id="price" value={formData.price} onChange={handleInputChange} placeholder="Leave blank for 'Free' or 'Negotiable'" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-saffron focus:border-brand-saffron"/>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea id="description" rows={6} value={formData.description} onChange={handleInputChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-saffron focus:border-brand-saffron"></textarea>
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700">Upload Images (Max 5)</label>
            {imagePreviews.length > 0 && (
              <div className="mt-2 grid grid-cols-3 sm:grid-cols-5 gap-2">
                {imagePreviews.map((src, index) => (
                  <div key={index} className="relative">
                    <img src={src} alt={`Preview ${index}`} className="h-24 w-full object-cover rounded-md" />
                    <button type="button" onClick={() => removeImage(index)} className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-0.5 m-1 shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                      <span className="sr-only">Remove image</span>
                      <XCircleIcon className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {images.length < 5 && (
              <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                      <PhotoIcon className="mx-auto h-12 w-12 text-gray-400"/>
                      <div className="flex text-sm text-gray-600">
                          <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-brand-saffron hover:text-orange-600 focus-within:outline-none">
                              <span>Upload files</span>
                              <input id="file-upload" name="file-upload" type="file" multiple accept="image/*" onChange={handleImageChange} className="sr-only"/>
                          </label>
                          <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
              </div>
            )}
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={submitting} className="bg-brand-saffron hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg transition duration-300 disabled:bg-orange-300">
            {submitting ? 'Submitting...' : 'Post Ad'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateAd;
