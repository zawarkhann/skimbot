import React, { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md border-b border-[#E2E8F0]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-2 cursor-pointer">
            <img src="/Vector.png" alt="Project Logo" className="h-auto w-auto" />
            
          </div>

          {/* Navigation Section */}
          <div className="flex-1 flex items-center justify-between">
            {/* Left-Side Links */}
            <div className="hidden md:flex space-x-8 ml-20"> {/* Add `ml-8` to create space */}
              <a href="/" className="text-gray-600 hover:text-purple-600 cursor-pointer">
                Home
              </a>
              <a href="/" className="text-gray-600 hover:text-purple-600 cursor-pointer">
                Product
              </a>
              <a href="/" className="text-gray-600 hover:text-purple-600 cursor-pointer">
                Services
              </a>
            </div>

            {/* Right-Side Buttons */}
            <div className="hidden md:flex space-x-4">
              <div className="bg-[#4F46E5] text-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-purple-700 cursor-pointer">
                <span className="text-[16px] leading-[22px] font-bold font-['Plus_Jakarta_Sans'] tracking-[-0.007em]">
                  Download Now
                </span>
                <img src="/Download.png" alt="Download" className="h-auto w-auto" />
              </div>

              <div className="bg-[#EEF2FF] text-[#4F46E5] font-['Plus_Jakarta_Sans'] rounded-full px-4 py-2 flex items-center gap-2 hover:bg-gray-400 cursor-pointer">
                <span className="text-[16px] leading-[22px] font-bold tracking-[-0.007em]">Sign Up Now</span>
                <img src="/SignIn.png" alt="Sign In" className="h-auto w-auto" />
              </div>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-gray-600 focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Links */}
        {isOpen && (
          <div className="md:hidden flex flex-col space-y-4 mt-4">
            <a href="/" className="text-gray-600 hover:text-purple-600">
              Home
            </a>
            <a href="/product" className="text-gray-600 hover:text-purple-600">
              Product
            </a>
            <a href="/services" className="text-gray-600 hover:text-purple-600">
              Services
            </a>
            <a
              href="/download"
              className="bg-purple-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-purple-700"
            >
              <span>Download Now</span>
              <img src="/Download.png" alt="Download" className="h-4 w-4" />
            </a>
            <a
              href="/signin"
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md flex items-center gap-2 hover:bg-gray-400"
            >
              <span>Sign Up Now</span>
              <img src="/SignIn.png" alt="Sign In" className="h-4 w-4" />
            </a>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
