
import React from 'react';
import { Link } from 'react-router-dom';
import type { Advertisement } from '../../types';
import { MapPinIcon, TagIcon, StarIcon } from '@heroicons/react/24/outline';

interface AdCardProps {
  ad: Advertisement;
}

const PLACEHOLDER_IMAGE_URL = 'https://picsum.photos/seed/placeholder/800/600?grayscale&blur=2';

const AdCard: React.FC<AdCardProps> = ({ ad }) => {
  const formattedPrice = ad.price !== null 
    ? new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(ad.price) 
    : 'Free';

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = PLACEHOLDER_IMAGE_URL;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-all duration-300 group">
      <Link to={`/ads/${ad.id}`} className="block">
        <div className="relative">
          <img 
            src={ad.imageUrl || PLACEHOLDER_IMAGE_URL} 
            alt={ad.title} 
            className="w-full h-48 object-cover bg-gray-200" 
            onError={handleImageError} 
          />
          {ad.isFeatured && (
            <div className="absolute top-2 right-2 bg-brand-gold text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
              <StarIcon className="h-4 w-4 mr-1"/>
              Featured
            </div>
          )}
        </div>
        <div className="p-4">
          <p className="text-sm text-gray-500 flex items-center mb-1">
            <TagIcon className="h-4 w-4 mr-1 text-gray-400" />
            {ad.category.name}
          </p>
          <h3 className="text-lg font-semibold text-gray-800 group-hover:text-brand-saffron transition-colors truncate">
            {ad.title}
          </h3>
          <p className="text-xl font-bold text-brand-green mt-2">{formattedPrice}</p>
          <div className="flex items-center text-sm text-gray-600 mt-4">
            <MapPinIcon className="h-4 w-4 mr-1 text-gray-400" />
            <span>{ad.city.name}</span>
            <span className="mx-2">·</span>
            <span>{new Date(ad.createdAt).toLocaleDateString('en-GB')}</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default AdCard;