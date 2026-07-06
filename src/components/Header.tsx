import React, { useState, useRef, useEffect } from 'react';
import { Search, Heart, X, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Guest, ViewState } from '../types';
import { getSidePhoto } from '../utils';

interface HeaderProps {
  guests: Guest[];
  onSelectGuestFromSearch: (guest: Guest) => void;
  currentView: ViewState;
  onNavigateHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  guests,
  onSelectGuestFromSearch,
  currentView,
  onNavigateHome,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const matchingGuests = searchQuery.trim() === '' 
    ? [] 
    : guests.filter(g => 
        g.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const handleSelect = (guest: Guest) => {
    setSearchQuery('');
    setIsSearchFocused(false);
    onSelectGuestFromSearch(guest);
  };

  return (
    <header className="bg-[#FDFCFB] border-b gold-border sticky top-0 z-30 pb-6 pt-6">
      <div className="max-w-5xl mx-auto px-6">
        {/* Wedding Branding Title */}
        <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end gap-6 mb-6">
          <button 
            onClick={onNavigateHome}
            className="group flex flex-col items-center sm:items-start text-center sm:text-left focus:outline-hidden cursor-pointer"
          >
            <h1 className="serif text-3xl sm:text-4xl font-bold tracking-tight uppercase gold-text group-hover:opacity-80 transition-opacity">
              Tafadzwa & Chengeto
            </h1>
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] opacity-60 mt-1.5 text-[#2D2D2D]">
              Wedding Guest Management
            </p>
          </button>

          {/* Global Instant Search Bar */}
          <div ref={searchRef} className="relative w-full sm:w-80">
            <div className="relative flex items-center">
              <span className="absolute left-3 opacity-40 pointer-events-none select-none" aria-hidden="true">
                <Search className="w-4 h-4 text-[#2D2D2D]" />
              </span>
              <input
                id="guest-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchFocused(true);
                }}
                onFocus={() => setIsSearchFocused(true)}
                placeholder="SEARCH GUEST NAME..."
                className="w-full bg-transparent border-b border-gray-300 pl-10 pr-8 py-2 text-xs sm:text-sm text-[#2D2D2D] placeholder-gray-400 focus:outline-none focus:border-[#D4AF37] transition-colors tracking-[0.15em] uppercase font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 p-1 text-gray-400 hover:text-[#2D2D2D] transition-colors cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Instant Search Results Dropdown */}
            <AnimatePresence>
              {isSearchFocused && searchQuery.trim() !== '' && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-0 right-0 mt-3 bg-white rounded-xl shadow-xl border gold-border overflow-hidden z-50 max-h-80 overflow-y-auto divide-y divide-gray-100"
                >
                  {matchingGuests.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                      <p className="text-xs uppercase tracking-widest font-medium">No guests found matching "{searchQuery}"</p>
                      <p className="text-[10px] text-gray-400 mt-1">Try spelling part of the first or last name</p>
                    </div>
                  ) : (
                    <>
                      <div className="cream-bg px-4 py-2 text-[10px] font-bold uppercase tracking-widest gold-text flex justify-between items-center">
                        <span>Found {matchingGuests.length} matching {matchingGuests.length === 1 ? 'guest' : 'guests'}</span>
                        <span>Tap to view</span>
                      </div>
                      {matchingGuests.map((guest, idx) => (
                        <motion.button
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.03 }}
                          key={guest.id}
                          onClick={() => handleSelect(guest)}
                          className="w-full text-left px-4 py-3.5 hover:bg-[#F9F6F0] flex items-center justify-between transition-colors group cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <img 
                              src={getSidePhoto(guest.side)} 
                              alt={guest.side} 
                              className="w-8 h-8 rounded-full object-cover border border-[#D4AF37]/50 shrink-0 shadow-2xs" 
                            />
                            <div>
                              <p className="text-sm font-semibold text-[#2D2D2D] group-hover:gold-text transition-colors">
                                {guest.name}
                              </p>
                              <p className="text-[10px] uppercase tracking-wider opacity-60 text-[#2D2D2D]">
                                {guest.side === 'groom' ? "Groom's Side (Tafadzwa)" : "Bride's Side (Chengeto)"}
                              </p>
                            </div>
                          </div>
                          <span className="text-[10px] uppercase tracking-widest px-2 py-1 rounded-full bg-gray-100 group-hover:bg-[#D4AF37] group-hover:text-white text-gray-600 transition-colors font-bold">
                            View →
                          </span>
                        </motion.button>
                      ))}
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};
