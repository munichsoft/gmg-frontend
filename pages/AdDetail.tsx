import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeftIcon, MapPinIcon, TagIcon, CalendarIcon, ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/outline';
import { useAds } from '../contexts/AdContext';
import MessageModal from '../components/ads/MessageModal';
import type { Advertisement } from '../types';
import Spinner from '../components/common/Spinner';

const AdDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getAdById } = useAds();
  const [ad, setAd] = useState<Advertisement | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [mainImage, setMainImage] = useState<string | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchAdDetails = async () => {
      if (id) {
        try {
          setLoading(true);
          const fetchedAd = await getAdById(Number(id));
          if (fetchedAd) {
            setAd(fetchedAd);
            setMainImage(fetchedAd.imageUrl);
          } else {
            setAd(null);
          }
        } catch (error) {
          console.error("Failed to fetch ad details:", error);
          setAd(null);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchAdDetails();
  }, [id, getAdById]);

  if (loading) {
    return <Spinner />;
  }

  if (!ad) {
    return (
      <div className="text-center py-20">
        <h1 className="text-3xl font-bold">Advertisement not found</h1>
        <Link to="/ads" className="text-brand-saffron hover:underline mt-4 inline-block">Back to all ads</Link>
      </div>
    );
  }

  const formattedPrice = ad.price !== null
    ? new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(ad.price)
    : 'Free or Negotiable';

  return (
    <div>
        <Link to="/ads" className="flex items-center text-gray-600 hover:text-brand-saffron mb-6 font-medium">
            <ArrowLeftIcon className="h-5 w-5 mr-2"/>
            Back to Ads
        </Link>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          {/* Image Gallery */}
          <div className="md:col-span-2">
            <img src={mainImage} alt={ad.title} className="w-full h-96 object-cover" />
            <div className="flex space-x-2 p-2 bg-gray-100 overflow-x-auto">
              {ad.images.map((img, index) => (
                <button key={index} onClick={() => setMainImage(img)} className="focus:outline-none focus:ring-2 focus:ring-brand-saffron rounded-md">
                    <img
                      src={img}
                      alt={`${ad.title} view ${index + 1}`}
                      className={`w-24 h-24 object-cover rounded-md cursor-pointer border-2 ${mainImage === img ? 'border-brand-saffron' : 'border-transparent'}`}
                    />
                </button>
              ))}
            </div>
          </div>

          {/* Ad Info */}
          <div className="p-6 flex flex-col">
            <h1 className="text-3xl font-bold text-gray-900">{ad.title}</h1>
            <p className="text-3xl font-extrabold text-brand-green mt-4 mb-4">{formattedPrice}</p>
            
            <div className="space-y-3 text-gray-600 mb-6">
                <div className="flex items-center">
                    <TagIcon className="h-5 w-5 mr-2 text-gray-400" />
                    <span>{ad.category.name}</span>
                </div>
                <div className="flex items-center">
                    <MapPinIcon className="h-5 w-5 mr-2 text-gray-400" />
                    <span>{ad.city.name}</span>
                </div>
                <div className="flex items-center">
                    <CalendarIcon className="h-5 w-5 mr-2 text-gray-400" />
                    <span>Posted on {new Date(ad.createdAt).toLocaleDateString('en-GB')}</span>
                </div>
            </div>

            <div className="mt-auto pt-6 border-t">
                 <div className="flex items-center mb-4">
                    <img src={ad.user.avatarUrl} alt={ad.user.fullName} className="h-12 w-12 rounded-full mr-4"/>
                    <div>
                        <p className="font-semibold">{ad.user.fullName}</p>
                        <p className="text-sm text-gray-500">Member since 2023</p>
                    </div>
                 </div>
                 <button onClick={() => setIsModalOpen(true)} className="w-full bg-brand-saffron hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center">
                    <ChatBubbleBottomCenterTextIcon className="h-6 w-6 mr-2"/>
                    Contact Seller
                 </button>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="p-6 border-t">
          <h2 className="text-2xl font-bold mb-4">Description</h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{ad.description}</p>
        </div>
      </div>
      <MessageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        sellerName={ad.user.fullName}
      />
    </div>
  );
};

export default AdDetail;