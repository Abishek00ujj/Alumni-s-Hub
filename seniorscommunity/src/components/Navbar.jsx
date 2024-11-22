import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export const Navbar = () => {
  const [downbar, setDownbar] = useState(false);

  const handleDownbar = () => {
    setDownbar((prev) => !prev);
  };

  return (
    <>
      <div className="w-screen h-[8vh] bg-blue-950 flex justify-between items-center px-4 md:px-7">
        <div className="flex space-x-3 items-center">
          <div className="text-white font-sans font-bold text-xl md:text-2xl flex hover:text-orange-400">
            ALUMNIS HUB |
          </div>
          <div className="hidden md:block text-white font-semibold">Help Center</div>
        </div>

        <div className="flex items-center space-x-3 text-white">
          {downbar ? (
            <ChevronDown
              size={30}
              className="cursor-pointer md:hidden"
              onClick={handleDownbar}
            />
          ) : (
            <ChevronUp
              size={30}
              className="cursor-pointer md:hidden"
              onClick={handleDownbar}
            />
          )}
          <Link to="/signin">
            <button className="bg-orange-400 rounded-xl px-4 py-2 text-sm md:text-base font-bold hover:bg-orange-500">
              SIGN IN
            </button>
          </Link>
        </div>
      </div>
      {downbar && (
        <div className="w-full md:hidden bg-slate-600 absolute top-[8vh] left-0 z-10">
          <div className="h-12 border-b border-white flex items-center justify-center text-white bg-zinc-800 hover:bg-gray-700">
            Sign Up
          </div>
          <div className="h-12 border-b border-white flex items-center justify-center text-white bg-zinc-800 hover:bg-gray-700">
            Blogs
          </div>
          <div className="h-12 border-b border-white flex items-center justify-center text-white bg-zinc-800 hover:bg-gray-700">
            Contact Us
          </div>
          <div className="h-12 flex items-center justify-center text-white bg-zinc-800 hover:bg-gray-700">
            About Us
          </div>
        </div>
      )}

      <div className="hidden md:flex w-auto bg-slate-600 p-2 justify-end space-x-5 absolute top-[8vh] right-0 z-10">
        <div className="text-white font-semibold hover:text-orange-400 cursor-pointer">
          Sign Up
        </div>
        <div className="text-white font-semibold hover:text-orange-400 cursor-pointer">
          Blogs
        </div>
        <div className="text-white font-semibold hover:text-orange-400 cursor-pointer">
          Contact Us
        </div>
        <div className="text-white font-semibold hover:text-orange-400 cursor-pointer">
          About Us
        </div>
      </div>
    </>
  );
};

export default Navbar;
