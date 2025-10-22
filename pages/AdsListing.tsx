import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import AdCard from '../components/ads/AdCard';
import { useAds } from '../contexts/AdContext';
import Spinner from '../components/common/Spinner';

const AdsListing: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { advertisements, cities, categories, loading, error, fetchAdvertisements } = useAds();

  // Local state for filters, synced with URL params
  const [cityFilter, setCityFilter] = useState(searchParams.get('city') || 'all');
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('category') || 'all');
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

  const memoizedFetch = useCallback(fetchAdvertisements, []);

  useEffect(() => {
    const filters = {
      city: searchParams.get('city') ?? undefined,
      category: searchParams.get('category') ?? undefined,
      search: searchParams.get('search') ?? undefined,
    };
    memoizedFetch(filters);
  }, [searchParams, memoizedFetch]);

  const handleFilterChange = (setter: React.Dispatch<React.SetStateAction<string>>, param: string) => (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const value = e.target.value;
    setter(value);
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== 'all') {
      newParams.set(param, value);
    } else {
      newParams.delete(param);
    }
    setSearchParams(newParams);
  };
  
  const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (searchTerm.trim()) {
        newParams.set('search', searchTerm.trim());
    } else {
        newParams.delete('search');
    }
    setSearchParams(newParams);
  }

  return (
    <div>
      <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
        <form onSubmit={handleSearchSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="w-full md:col-span-2">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search Ads</label>
              <input
                type="text"
                id="search"
                placeholder="e.g. 'sofa' or 'apartment'"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-brand-saffron focus:border-brand-saffron"
                value={searchTerm}
                onChange={handleSearchTermChange}
              />
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <select
                id="city"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-brand-saffron focus:border-brand-saffron"
                value={cityFilter}
                onChange={handleFilterChange(setCityFilter, 'city')}
              >
                <option value="all">All Cities</option>
                {cities.map(city => <option key={city.id} value={city.name}>{city.name}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                id="category"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-brand-saffron focus:border-brand-saffron"
                value={categoryFilter}
                onChange={handleFilterChange(setCategoryFilter, 'category')}
              >
                <option value="all">All Categories</option>
                {categories.map(cat => <option key={cat.id} value={cat.slug}>{cat.name}</option>)}
              </select>
            </div>
          </div>
        </form>
      </div>
      
      {loading ? (
        <Spinner />
      ) : error ? (
         <div className="text-center py-16">
            <p className="text-red-500 text-lg">{error}</p>
        </div>
      ) : advertisements.length > 0 ? (
        <>
          <h1 className="text-3xl font-bold mb-6">Showing {advertisements.length} Ads</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {advertisements.map(ad => (
              <AdCard key={ad.id} ad={ad} />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-16">
            <h1 className="text-3xl font-bold mb-6">No Ads Found</h1>
            <p className="text-gray-500 text-lg">Try adjusting your filters to find what you're looking for.</p>
        </div>
      )}
    </div>
  );
};

export default AdsListing;
