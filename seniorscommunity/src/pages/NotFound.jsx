import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Home as HomeIcon, AlertCircle } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-[#121212] via-[#1a1a1a] to-[#121212] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-24 h-24 text-orange-400 mx-auto mb-6" />
          <h1 className="text-6xl font-bold text-white mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-300 mb-4">Page Not Found</h2>
          <p className="text-gray-400 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <button
            onClick={() => navigate('/home')}
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 mx-auto transition-all duration-300"
          >
            <HomeIcon className="w-5 h-5" />
            Back to Home
          </button>
        </div>
      </div>
    </>
  );
};

export default NotFound;
