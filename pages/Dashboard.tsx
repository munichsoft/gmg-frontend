import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAds } from '../contexts/AdContext';
import { ExclamationTriangleIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import type { Advertisement } from '../types';
import Spinner from '../components/common/Spinner';

const Dashboard: React.FC = () => {
    const { user, isAuthenticated } = useAuth();
    const { getAdsByUser, deleteAd } = useAds();
    const navigate = useNavigate();
    const [myAds, setMyAds] = useState<Advertisement[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchMyAds = useCallback(async () => {
        if (user) {
            setLoading(true);
            try {
                const ads = await getAdsByUser();
                setMyAds(ads);
            } catch (error) {
                console.error("Failed to fetch user's ads:", error);
            } finally {
                setLoading(false);
            }
        }
    }, [user, getAdsByUser]);

    useEffect(() => {
        if (isAuthenticated) {
          fetchMyAds();
        }
    }, [isAuthenticated, fetchMyAds]);

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this ad? This action cannot be undone.')) {
            try {
                await deleteAd(id);
                // The ad is removed from global state by the context,
                // so we just need to update the local state.
                setMyAds(prevAds => prevAds.filter(ad => ad.id !== id));
            } catch (error) {
                console.error("Failed to delete ad:", error);
                alert("There was an error deleting the ad. Please try again.");
            }
        }
    };

    if (!isAuthenticated || !user) {
        return (
            <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-lg mx-auto">
                <ExclamationTriangleIcon className="h-16 w-16 text-brand-red mx-auto mb-4"/>
                <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
                <p className="text-gray-600 mb-6">You must be logged in to view your dashboard.</p>
                <button onClick={() => navigate('/login')} className="bg-brand-saffron hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-lg transition duration-300">
                    Go to Login
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex items-center mb-8">
                <img src={user.avatarUrl} alt={user.fullName} className="h-20 w-20 rounded-full mr-6"/>
                <div>
                    <h1 className="text-3xl font-bold">Welcome back, {user.fullName}!</h1>
                    <p className="text-gray-500">Here are your active advertisements.</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-4">My Ads ({myAds.length})</h2>
                {loading ? (
                    <Spinner />
                ) : (
                    <div className="space-y-4">
                        {myAds.length > 0 ? myAds.map(ad => (
                            <div key={ad.id} className="flex flex-col sm:flex-row items-center justify-between p-4 border rounded-md hover:bg-gray-50">
                                <div className="flex items-center w-full sm:w-auto">
                                    <img src={ad.imageUrl} alt={ad.title} className="h-16 w-24 object-cover rounded-md mr-4"/>
                                    <div className="flex-grow">
                                        <Link to={`/ads/${ad.id}`} className="font-semibold text-lg hover:text-brand-saffron transition-colors">{ad.title}</Link>
                                        <p className="text-sm text-gray-500">{ad.city.name} - {ad.category.name}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                                    <button className="text-blue-500 hover:text-blue-700 transition-colors p-2 rounded-full hover:bg-blue-100" aria-label="Edit ad">
                                        <PencilIcon className="h-5 w-5"/>
                                    </button>
                                    <button onClick={() => handleDelete(ad.id)} className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-full hover:bg-red-100" aria-label="Delete ad">
                                        <TrashIcon className="h-5 w-5"/>
                                    </button>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center text-gray-500 py-8">
                                <p>You haven't posted any ads yet.</p>
                                <Link to="/create" className="mt-4 inline-block bg-brand-saffron hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-lg transition duration-300">
                                    Post Your First Ad
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
