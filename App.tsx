import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import { AuthProvider } from './contexts/AuthContext';
import { AdProvider } from './contexts/AdContext';
import Spinner from './components/common/Spinner';

const Home = lazy(() => import('./pages/Home'));
const AdsListing = lazy(() => import('./pages/AdsListing'));
const AdDetail = lazy(() => import('./pages/AdDetail'));
const CreateAd = lazy(() => import('./pages/CreateAd'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Login = lazy(() => import('./pages/Login'));
const SignUp = lazy(() => import('./pages/SignUp'));
const Community = lazy(() => import('./pages/Community'));
const Profile = lazy(() => import('./pages/Profile'));

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AdProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Suspense fallback={<Spinner />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/ads" element={<AdsListing />} />
                <Route path="/ads/:id" element={<AdDetail />} />
                <Route path="/create" element={<CreateAd />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/community" element={<Community />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </AdProvider>
    </AuthProvider>
  );
};

export default App;