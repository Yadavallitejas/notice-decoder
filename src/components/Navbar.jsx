import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const { user, signInWithGoogle, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-[#1e3a5f] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-xl font-bold flex items-center gap-2">
              <span className="text-2xl">📄</span>
              NoticeDecoder
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-blue-200 transition-colors">Home</Link>
            <Link to="/about" className="hover:text-blue-200 transition-colors">About</Link>
            {user && (
              <Link to="/history" className="hover:text-blue-200 transition-colors">History</Link>
            )}

            <div className="ml-4 border-l border-blue-400/30 pl-6 flex items-center gap-4">
              {user ? (
                <>
                  <div className="flex items-center gap-2">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full border border-white/20" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center text-sm font-bold">
                        {user.displayName ? user.displayName.charAt(0) : 'U'}
                      </div>
                    )}
                    <span className="text-sm font-medium">{user.displayName || 'User'}</span>
                  </div>
                  <button 
                    onClick={signOut}
                    className="text-sm font-medium bg-white/10 hover:bg-white/20 px-4 py-2 rounded-md transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <button 
                  onClick={signInWithGoogle}
                  className="text-sm font-medium bg-white text-[#1e3a5f] hover:bg-gray-100 px-4 py-2 rounded-md transition-colors shadow-sm"
                >
                  Sign In with Google
                </button>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-white/10 focus:outline-none"
            >
              {isMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#162d4a]">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              to="/" 
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-white/10"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-white/10"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            {user && (
              <Link 
                to="/history" 
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-white/10"
                onClick={() => setIsMenuOpen(false)}
              >
                History
              </Link>
            )}
          </div>
          
          <div className="pt-4 pb-3 border-t border-white/10">
            {user ? (
              <div className="flex flex-col space-y-4 px-5">
                <div className="flex items-center gap-3">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="w-10 h-10 rounded-full border border-white/20" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center text-lg font-bold">
                      {user.displayName ? user.displayName.charAt(0) : 'U'}
                    </div>
                  )}
                  <div>
                    <div className="text-base font-medium">{user.displayName || 'User'}</div>
                    <div className="text-sm text-blue-200">{user.email}</div>
                  </div>
                </div>
                <button 
                  onClick={() => { signOut(); setIsMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-300 hover:bg-white/10"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="px-5">
                <button 
                  onClick={() => { signInWithGoogle(); setIsMenuOpen(false); }}
                  className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-[#1e3a5f] bg-white hover:bg-gray-100"
                >
                  Sign In with Google
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
