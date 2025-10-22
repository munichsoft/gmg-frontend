import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { CATEGORY_ICONS } from '../constants';
import AdCard from '../components/ads/AdCard';
import { api } from '../services/api';
import type { Advertisement } from '../types';
import Spinner from '../components/common/Spinner';
import { useAds } from '../contexts/AdContext';

const FeaturedAds = () => {
  const [featured, setFeatured] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedAds = async () => {
      try {
        setLoading(true);
        // Use the API service directly to fetch only featured ads
        const featuredAds = await api.getAdvertisements({ featured: true });
        setFeatured(featuredAds.slice(0, 4));
      } catch (error) {
        console.error("Failed to fetch featured ads:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedAds();
  }, []);

  if (loading) {
    return <Spinner />;
  }
  
  if (featured.length === 0) {
    return <p className="text-center text-gray-500">No featured ads available at the moment.</p>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {featured.map(ad => (
        <AdCard key={ad.id} ad={ad} />
      ))}
    </div>
  );
};

const CategoryGrid = () => {
    const { categories } = useAds();

    if (!categories.length) {
        return <div className="text-center">Loading categories...</div>;
    }
    
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map(category => {
                const Icon = CATEGORY_ICONS[category.slug] || MagnifyingGlassIcon; // Fallback icon
                return (
                    <Link key={category.id} to={`/ads?category=${category.slug}`} className="block p-4 bg-white rounded-lg shadow-sm hover:shadow-lg hover:scale-105 transition-transform duration-200 text-center">
                        <Icon className="h-10 w-10 mx-auto text-brand-saffron" />
                        <p className="mt-2 text-sm font-semibold">{category.name}</p>
                    </Link>
                );
            })}
        </div>
    );
};


const Home: React.FC = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = React.useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if(searchTerm.trim()) {
            navigate(`/ads?search=${encodeURIComponent(searchTerm.trim())}`);
        } else {
            navigate('/ads');
        }
    };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative bg-cover bg-center rounded-lg shadow-xl overflow-hidden" style={{ backgroundImage: "url('https://picsum.photos/seed/hero/1200/400')" }}>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative container mx-auto px-6 py-20 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Connecting the Gujarati Community in Germany</h1>
          <p className="text-lg md:text-xl mb-8">Find what you need, right here, right now.</p>
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for anything..."
                className="w-full py-4 pl-5 pr-16 rounded-full text-gray-900 focus:outline-none focus:ring-4 focus:ring-brand-saffron focus:ring-opacity-50"
              />
              <button type="submit" className="absolute inset-y-0 right-0 flex items-center justify-center bg-brand-saffron text-white rounded-full w-12 h-12 my-auto mx-2 hover:bg-orange-600 transition">
                <MagnifyingGlassIcon className="h-6 w-6" />
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Categories Section */}
      <section>
        <h2 className="text-3xl font-bold mb-6 text-center">Browse Categories</h2>
        <CategoryGrid />
      </section>

      {/* Featured Ads Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">Featured Ads</h2>
            <Link to="/ads" className="text-brand-saffron hover:underline font-semibold">View All</Link>
        </div>
        <FeaturedAds />
      </section>
    </div>
  );
};

export default Home;
