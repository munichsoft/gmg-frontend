import type { ComponentType, SVGProps } from 'react';

export interface User {
  id: string; // Changed from number to string for Firebase UIDs
  fullName: string;
  avatarUrl: string;
}

export interface City {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  // Icon is now a frontend-only mapping, removed from the core type
}

export interface Advertisement {
  id: number;
  title: string;
  description: string;
  price: number | null;
  isFeatured: boolean;
  imageUrl: string;
  images: string[];
  createdAt: string;
  user: User;
  city: City;
  category: Category;
}
