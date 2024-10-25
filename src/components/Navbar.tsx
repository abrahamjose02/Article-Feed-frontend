import React from 'react';
import { useDispatch, useSelector } from 'react-redux'; // Added useSelector
import { useNavigate, useLocation } from 'react-router-dom';
import { clearUser } from '../store/userSlice';
import { toast } from 'sonner';
import axiosInstance from '../axios/axiosInstance';

const Navbar: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation(); 
  const user = useSelector((state: any) => state.user); 

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
    <nav className="bg-gray-900"> 
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        
        <a href="/dashboard" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img
            src="https://flowbite.com/docs/images/logo.svg"
            className="h-8"
            alt="Logo"
          />
          <span className="self-center text-2xl font-semibold text-white whitespace-nowrap"> 
            Stock Picker
          </span>
        </a>

        {/* Menu Links */}
        <div className="hidden w-full md:block md:w-auto">
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-800 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-gray-900 dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700 items-center">
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
            {user && ( // Conditionally render the logout button if user is logged in
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
      </div>
    </nav>
  );
};

export default Navbar;
