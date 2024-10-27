import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'; 
import { useNavigate, useLocation } from 'react-router-dom';
import { clearUser } from '../store/userSlice';
import { toast } from 'sonner';
import axiosInstance from '../axios/axiosInstance';

const Navbar: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation(); 
  const user = useSelector((state: any) => state.user); 
  const [isMenuOpen, setIsMenuOpen] = useState(false); // state to manage mobile menu toggle

  const handleLogout = async () => {
    try {
      const response = await axiosInstance.post('/auth/logout');
      if (response.status === 200) {
        dispatch(clearUser());
        toast.success('Logout successful!');
        navigate('/login', { replace: true });
      } else {
        toast.error('Failed to log out. Please try again.');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Logout failed. Please try again.';
      toast.error(errorMessage);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-gray-900 relative z-10">
      <div className="max-w-screen-xl flex items-center justify-between mx-auto p-4">
        
        {/* Logo */}
        <a href="/dashboard" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img
            src="https://flowbite.com/docs/images/logo.svg"
            className="h-8"
            alt="Logo"
          />
          <span className="self-center text-2xl font-semibold text-white whitespace-nowrap"> 
            Article Feed
          </span>
        </a>

        {/* Hamburger Menu for Mobile */}
        <button 
          className="md:hidden p-2 text-gray-300 rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
            ></path>
          </svg>
        </button>

        {/* Desktop Menu Links */}
        <div className="hidden md:block w-full md:w-auto">
          <ul className="font-medium flex flex-row md:space-x-8 rtl:space-x-reverse items-center">
            <li>
              <p
                onClick={() => navigate('/dashboard')}
                className={`block py-2 px-3 rounded md:p-0 cursor-pointer ${
                  isActive('/dashboard') ? 'text-blue-400' : 'text-gray-300'
                } hover:bg-gray-800 md:hover:bg-transparent md:border-0 md:hover:text-blue-400`}
              >
                Dashboard
              </p>
            </li>
            <li>
              <p
                onClick={() => navigate('/create-article')}
                className={`block py-2 px-3 rounded md:p-0 cursor-pointer ${
                  isActive('/create-article') ? 'text-blue-400' : 'text-gray-300'
                } hover:bg-gray-800 md:hover:bg-transparent md:border-0 md:hover:text-blue-400`}
              >
                Create Article
              </p>
            </li>
            <li>
              <p
                onClick={() => navigate('/my-articles')}
                className={`block py-2 px-3 rounded md:p-0 cursor-pointer ${
                  isActive('/my-articles') ? 'text-blue-400' : 'text-gray-300'
                } hover:bg-gray-800 md:hover:bg-transparent md:border-0 md:hover:text-blue-400`}
              >
                My Articles
              </p>
            </li>
            <li>
              <p
                onClick={() => navigate('/settings')}
                className={`block py-2 px-3 rounded md:p-0 cursor-pointer ${
                  isActive('/settings') ? 'text-blue-400' : 'text-gray-300'
                } hover:bg-gray-800 md:hover:bg-transparent md:border-0 md:hover:text-blue-400`}
              >
                Settings
              </p>
            </li>
            {user && ( 
              <li>
                <button
                  onClick={handleLogout}
                  className="block py-2 p-3 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>

        {/* Dropdown Menu for Mobile */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-gray-800 mt-2 p-4 rounded-lg shadow-lg md:hidden z-20">
            <ul className="font-medium flex flex-col space-y-2 items-start">
              <li>
                <p
                  onClick={() => { navigate('/dashboard'); setIsMenuOpen(false); }}
                  className={`block py-2 px-3 rounded cursor-pointer ${
                    isActive('/dashboard') ? 'text-blue-400' : 'text-gray-300'
                  } hover:bg-gray-700`}
                >
                  Dashboard
                </p>
              </li>
              <li>
                <p
                  onClick={() => { navigate('/create-article'); setIsMenuOpen(false); }}
                  className={`block py-2 px-3 rounded cursor-pointer ${
                    isActive('/create-article') ? 'text-blue-400' : 'text-gray-300'
                  } hover:bg-gray-700`}
                >
                  Create Article
                </p>
              </li>
              <li>
                <p
                  onClick={() => { navigate('/my-articles'); setIsMenuOpen(false); }}
                  className={`block py-2 px-3 rounded cursor-pointer ${
                    isActive('/my-articles') ? 'text-blue-400' : 'text-gray-300'
                  } hover:bg-gray-700`}
                >
                  My Articles
                </p>
              </li>
              <li>
                <p
                  onClick={() => { navigate('/settings'); setIsMenuOpen(false); }}
                  className={`block py-2 px-3 rounded cursor-pointer ${
                    isActive('/settings') ? 'text-blue-400' : 'text-gray-300'
                  } hover:bg-gray-700`}
                >
                  Settings
                </p>
              </li>
              {user && (
                <li>
                  <button
                    onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                    className="block py-2 px-3 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 w-full text-left"
                  >
                    Logout
                  </button>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
