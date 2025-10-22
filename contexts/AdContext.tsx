import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import type { Advertisement, User, City, Category } from '../types';
import { api } from '../services/api';

// This is a simplified version of the Ad data for creation for the backend.
export type NewAdData = {
  title: string;
  description: string;
  price: number | null;
  categoryId: number;
  cityId: number;
  imageUrls: string[];
};

interface AdContextType {
  advertisements: Advertisement[];
  cities: City[];
  categories: Category[];
  loading: boolean;
  error: string | null;
  fetchAdvertisements: (filters?: { city?: string; category?: string; search?: string; }) => Promise<void>;
  getAdById: (id: number) => Promise<Advertisement | undefined>;
  getAdsByUser: () => Promise<Advertisement[]>;
  addAd: (ad: NewAdData) => Promise<Advertisement>;
  deleteAd: (id: number) => Promise<void>;
}

const AdContext = createContext<AdContextType | undefined>(undefined);

export const AdProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch initial static data like cities and categories
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [citiesData, categoriesData] = await Promise.all([
          api.getCities(),
          api.getCategories(),
        ]);
        setCities(citiesData);
        setCategories(categoriesData);
      } catch (err) {
        setError('Failed to load site data. Please try refreshing the page.');
        console.error(err);
      }
    };
    fetchInitialData();
  }, []);

  const fetchAdvertisements = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const ads = await api.getAdvertisements(filters);
      setAdvertisements(ads);
    } catch (err) {
      setError('Failed to fetch advertisements.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const getAdById = async (id: number) => {
    return api.getAdvertisementById(id);
  };

  const getAdsByUser = async () => {
    return api.getAdvertisementsByUser();
  };

  const addAd = async (adData: NewAdData) => {
    const newAd = await api.createAdvertisement(adData);
    // Refresh the main ad list to include the new ad
    fetchAdvertisements();
    return newAd;
  };

  const deleteAd = async (id: number) => {
    await api.deleteAdvertisement(id);
    // Remove the ad from the local state to update the UI instantly.
    setAdvertisements(prevAds => prevAds.filter(ad => ad.id !== id));
  };

  return (
    <AdContext.Provider value={{ advertisements, cities, categories, loading, error, fetchAdvertisements, getAdById, getAdsByUser, addAd, deleteAd }}>
      {children}
    </AdContext.Provider>
  );
};

export const useAds = () => {
  const context = useContext(AdContext);
  if (context === undefined) {
    throw new Error('useAds must be used within an AdProvider');
  }
  return context;
};
