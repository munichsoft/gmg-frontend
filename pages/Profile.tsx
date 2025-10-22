import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ExclamationTriangleIcon, PencilIcon, CameraIcon, ArrowUpTrayIcon, XMarkIcon } from '@heroicons/react/24/outline';

// Camera Modal Component
const CameraModal = ({ isOpen, onClose, onCapture }: { isOpen: boolean, onClose: () => void, onCapture: (dataUrl: string) => void }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    const enableCamera = async () => {
      if (isOpen && videoRef.current) {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: true });
          videoRef.current.srcObject = stream;
        } catch (err) {
          console.error("Error accessing camera:", err);
          alert("Could not access the camera. Please check permissions.");
          onClose();
        }
      }
    };

    enableCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isOpen, onClose]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/png');
        onCapture(dataUrl);
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="camera-modal-title">
      <div className="bg-white p-4 rounded-lg shadow-xl relative" onClick={e => e.stopPropagation()}>
        <h2 id="camera-modal-title" className="sr-only">Camera View</h2>
        <video ref={videoRef} autoPlay playsInline className="rounded-md w-full max-w-lg"></video>
        <canvas ref={canvasRef} className="hidden"></canvas>
        <button onClick={handleCapture} className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-brand-saffron text-white rounded-full p-4 hover:bg-orange-600 ring-4 ring-white" aria-label="Take Photo">
          <CameraIcon className="h-8 w-8" />
        </button>
        <button onClick={onClose} className="absolute top-2 right-2 bg-gray-800 bg-opacity-50 text-white rounded-full p-2 hover:bg-gray-700" aria-label="Close Camera">
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};


const Profile: React.FC = () => {
  const { user, isAuthenticated, updateUser } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName);
      setAvatarPreview(null);
    }
  }, [user]);

  const handleEdit = () => {
    setIsEditing(true);
    setFullName(user?.fullName || '');
    setAvatarPreview(user?.avatarUrl || null);
  };
  
  const handleCancel = () => {
    setIsEditing(false);
    setAvatarPreview(null);
  };

  const handleSave = () => {
    if (!user) return;
    const newDetails: { fullName?: string, avatarUrl?: string } = {};
    if (fullName !== user.fullName) {
        newDetails.fullName = fullName;
    }
    if (avatarPreview && avatarPreview !== user.avatarUrl) {
        newDetails.avatarUrl = avatarPreview;
    }
    if (Object.keys(newDetails).length > 0) {
        updateUser(newDetails);
    }
    setIsEditing(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };


  if (!isAuthenticated || !user) {
    return (
      <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-lg mx-auto">
        <ExclamationTriangleIcon className="h-16 w-16 text-brand-red mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
        <p className="text-gray-600 mb-6">You must be logged in to view your profile.</p>
        <button onClick={() => navigate('/login')} className="bg-brand-saffron hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-lg transition duration-300">
          Go to Login
        </button>
      </div>
    );
  }

  const currentAvatar = avatarPreview || user.avatarUrl;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {/* Avatar Section */}
            <div className="flex flex-col items-center">
                <div className="relative w-40 h-40 mb-4">
                   <img src={currentAvatar} alt="User Avatar" className="w-40 h-40 rounded-full object-cover shadow-md" />

                    {isEditing && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <span className="text-white text-center text-sm p-2">Change Avatar</span>
                        </div>
                    )}
                </div>
                {isEditing && (
                    <div className="flex flex-wrap justify-center gap-2">
                         <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden"/>
                         <button onClick={() => fileInputRef.current?.click()} className="flex items-center text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-3 rounded-lg transition">
                             <ArrowUpTrayIcon className="h-5 w-5 mr-1"/> Upload
                         </button>
                         <button onClick={() => setIsCameraOpen(true)} className="flex items-center text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-3 rounded-lg transition">
                             <CameraIcon className="h-5 w-5 mr-1"/> Camera
                         </button>
                    </div>
                )}
            </div>

            {/* Info Section */}
            <div className="md:col-span-2">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                      type="text"
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-saffron focus:border-brand-saffron"
                    />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button onClick={handleCancel} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg transition">Cancel</button>
                    <button onClick={handleSave} className="bg-brand-saffron hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-lg transition">Save Changes</button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-sm font-medium text-gray-500">Full Name</h2>
                    <p className="text-2xl font-semibold text-gray-900">{user.fullName}</p>
                  </div>
                   <div>
                    <h2 className="text-sm font-medium text-gray-500">Email</h2>
                    <p className="text-lg text-gray-700">aarav.patel@example.com</p>
                  </div>
                  <div className="flex justify-end">
                    <button onClick={handleEdit} className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition">
                      <PencilIcon className="h-5 w-5 mr-2" /> Edit Profile
                    </button>
                  </div>
                </div>
              )}
            </div>
        </div>
      </div>
      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={(dataUrl) => setAvatarPreview(dataUrl)}
      />
    </div>
  );
};

export default Profile;