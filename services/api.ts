import type { Advertisement, City, Category, User } from '../types';
import { NewAdData } from '../contexts/AdContext';

// Use relative path so Vite dev proxy forwards to backend in development
const BASE_URL = '/api';

// --- Helper Functions ---

// Gets the auth token from localStorage to authenticate requests
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  // The backend expects a Firebase ID token.
  // We now send the real Firebase token from authentication.
  
  // Debug logging
  if (token) {
    console.log('Sending token to backend:', token.substring(0, 50) + '...');
    console.log('Full token for testing:', token);
  } else {
    console.log('No auth token found in localStorage');
  }
  
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// Helper function to ensure user exists in backend (creates if not exists)
const ensureUserExists = async (): Promise<void> => {
  // User sync now happens automatically in AuthContext on auth state changes
  // This function is kept for backwards compatibility but doesn't need to do anything
  console.log('User sync handled by AuthContext - no action needed');
};

// A generic function to handle fetch responses and errors
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// --- Data Transformation ---
// The backend uses snake_case, but our frontend uses camelCase.
// These functions convert between the two formats.

const toCamelCase = (s: string) => s.replace(/([-_][a-z])/ig, ($1) => $1.toUpperCase().replace('-', '').replace('_', ''));

const transformKeysToCamelCase = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(v => transformKeysToCamelCase(v));
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce((result, key) => {
      result[toCamelCase(key)] = transformKeysToCamelCase(obj[key]);
      return result;
    }, {} as any);
  }
  return obj;
};

// --- API Service Object ---

export const api = {
  // --- General Endpoints ---
  getCities: async (): Promise<City[]> => {
    const response = await fetch(`${BASE_URL}/cities`);
    const data = await handleResponse(response);
    return transformKeysToCamelCase(data);
  },

  getCategories: async (): Promise<Category[]> => {
    const response = await fetch(`${BASE_URL}/categories`);
    const data = await handleResponse(response);
    return transformKeysToCamelCase(data);
  },

  // --- Advertisements Endpoints ---
  getAdvertisements: async (filters: { city?: string; category?: string; search?: string, featured?: boolean }): Promise<Advertisement[]> => {
    const params = new URLSearchParams();
    if (filters.city && filters.city !== 'all') params.append('city', filters.city);
    if (filters.category && filters.category !== 'all') params.append('category', filters.category);
    if (filters.search) params.append('search', filters.search);
    if (filters.featured) params.append('featured', 'true');
    
    const response = await fetch(`${BASE_URL}/ads?${params.toString()}`);
    const data = await handleResponse(response);
    return transformKeysToCamelCase(data);
  },

  getAdvertisementById: async (id: number): Promise<Advertisement | undefined> => {
    const response = await fetch(`${BASE_URL}/ads/${id}`);
    if (response.status === 404) return undefined;
    const data = await handleResponse(response);
    return transformKeysToCamelCase(data);
  },

  createAdvertisement: async (adData: NewAdData): Promise<Advertisement> => {
    console.log('Creating advertisement with data:', adData);
    
    // Use the existing getAuthHeaders function which gets token from localStorage
    const authHeaders = getAuthHeaders();
    console.log('Auth headers:', authHeaders);
    
    // Check if we have a token
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No authentication token found. Please log in again.');
    }
    
    console.log('Using token:', token.substring(0, 50) + '...');
    console.log('Request URL:', `${BASE_URL}/ads`);
    console.log('Request body:', JSON.stringify(adData));
    
    const response = await fetch(`${BASE_URL}/ads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
      body: JSON.stringify(adData),
    });
    
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      let errorText;
      try {
        errorText = await response.text();
        console.error('Error response body:', errorText);
      } catch (e) {
        errorText = 'Could not read error response';
        console.error('Could not read error response');
      }
      throw new Error(`Failed to create ad: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Success response data:', data);
    return transformKeysToCamelCase(data);
  },

  deleteAdvertisement: async (id: number): Promise<void> => {
    const response = await fetch(`${BASE_URL}/ads/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok && response.status !== 204) {
      await handleResponse(response);
    }
  },

  // --- User-Specific Endpoints ---
  syncFirebaseUser: async (token: string): Promise<User> => {
    const response = await fetch(`${BASE_URL}/auth/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });
    const data = await handleResponse(response);
    return transformKeysToCamelCase(data);
  },

  getAdvertisementsByUser: async (): Promise<Advertisement[]> => {
    // Ensure user exists in backend before fetching their ads
    await ensureUserExists();
    
    const response = await fetch(`${BASE_URL}/users/me/ads`, {
      headers: getAuthHeaders(),
    });
    const data = await handleResponse(response);
    return transformKeysToCamelCase(data);
  },
};
