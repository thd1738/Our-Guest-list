import React, { useState, useEffect } from 'react';
import { Users, Heart, Sparkles, Search, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Guest, GuestSide, ViewState } from '../types';
import { getSidePhoto } from '../utils';

interface HomeDashboardProps {
  guests: Guest[];
  onSelectSide: (side: GuestSide) => void;
  onOpenAddModal: (defaultSide?: GuestSide) => void;
  onResetData: () => void;
  onSelectGuestFromSearch?: (guest: Guest) => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  guests,
  onSelectSide,
  onOpenAddModal,
  onResetData,
  onSelectGuestFromSearch,
}) => {
  const groomGuestsCount = guests.filter(g => g.side === 'groom').length;
  const brideGuestsCount = guests.filter(g => g.side === 'bride').length;
  const totalGuests = guests.length;

  const [photos, setPhotos] = useState(() => ({
    groom: getSidePhoto('groom'),
    bride: getSidePhoto('bride')
  }));

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    const handleUpdate = () => {
      setPhotos({
        groom: getSidePhoto('groom'),
        bride: getSidePhoto('bride')
      });
    };
    window.addEventListener('photo_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('photo_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const matchingGuests = searchQuery.trim() === '' ? [] : guests.filter(g => 
    g.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  ).slice(0, 5);

  const handleSelectGuest = (guest: Guest) => {
    setSearchQuery('');
    setIsSearchFocused(false);
    if (onSelectGuestFromSearch) {
      onSelectGuestFromSearch(guest);
    } else {
      onSelectSide(guest.side);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      id="home-dashboard" 
      className="max-w-5xl mx-auto px-6 py-8 sm:py-12"
    >
      {/* Welcome Banner with Frosted Glassmorphism */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="glass-card rounded-3xl p-8 sm:p-12 mb-10 text-center relative overflow-hidden bg-gradient-to-br from-white/90 via-[#F9F6F0]/80 to-[#F4F1EA]/90 backdrop-blur-2xl border border-white shadow-xl"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#F472B6]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 bg-white/90 text-[#2D2D2D] border gold-border px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 gold-text animate-pulse" />
          <span>Wedding Guest Directory 2026</span>
        </div>

        <h2 className="text-3xl sm:text-5xl md:text-6xl serif font-extrabold text-[#2D2D2D] mb-4 tracking-tight">
          Tafadzwa <span className="text-rose-500 animate-pulse inline-block">❤️</span> Chengeto
        </h2>
        <p className="text-sm sm:text-base text-[#2D2D2D]/75 max-w-2xl mx-auto font-normal leading-relaxed mb-8">
          Select a family side below to manage confirmed guests. Experience luxury wedding organization with real-time updates and cinematic previews.
        </p>

        {/* Elegant Search Bar with Animated Underline Glow */}
        <div className="max-w-md mx-auto relative mb-6 text-left">
          <motion.div
            animate={{ scale: isSearchFocused ? 1.02 : 1 }}
            transition={{ duration: 0.2 }}
            className="relative"
          >
            <div className={`relative flex items-center bg-white/95 rounded-2xl shadow-md border transition-all duration-300 ${isSearchFocused ? 'border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.25)]' : 'border-gray-200'}`}>
              <Search className={`w-5 h-5 ml-4 shrink-0 transition-colors ${isSearchFocused ? 'text-[#D4AF37]' : 'text-gray-400'}`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                placeholder="Search any guest name across both families..."
                className="w-full bg-transparent pl-3 pr-10 py-3.5 text-xs sm:text-sm text-[#2D2D2D] placeholder-gray-400 focus:outline-none font-medium tracking-wide"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 p-1.5 text-gray-400 hover:text-[#2D2D2D] transition-colors cursor-pointer rounded-full hover:bg-gray-100"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            {/* Animated Underline Glow */}
            <div className="glow-underline mt-1 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: '0%', opacity: 0 }}
                animate={{ 
                  width: isSearchFocused || searchQuery ? '100%' : '0%',
                  opacity: isSearchFocused || searchQuery ? 1 : 0
                }}
                transition={{ duration: 0.3 }}
                className="h-0.5 bg-gradient-to-r from-[#D4AF37] via-[#F472B6] to-[#D4AF37] shadow-[0_0_10px_#D4AF37]"
              />
            </div>
          </motion.div>

          {/* Quick Search Results Dropdown */}
          <AnimatePresence>
            {isSearchFocused && searchQuery.trim() !== '' && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="absolute left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-[#D4AF37]/50 overflow-hidden z-50 max-h-72 overflow-y-auto divide-y divide-gray-100"
              >
                {matchingGuests.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    <p className="text-xs uppercase tracking-widest font-medium">No guests found matching "{searchQuery}"</p>
                  </div>
                ) : (
                  <>
                    <div className="cream-bg px-4 py-2 text-[10px] font-bold uppercase tracking-widest gold-text flex justify-between items-center">
                      <span>Found {matchingGuests.length} matching {matchingGuests.length === 1 ? 'guest' : 'guests'}</span>
                      <span>Tap to highlight</span>
                    </div>
                    {matchingGuests.map((guest, idx) => (
                      <motion.button
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.04 }}
                        key={guest.id}
                        onClick={() => handleSelectGuest(guest)}
                        className="w-full text-left px-4 py-3.5 hover:bg-[#F9F6F0] flex items-center justify-between transition-colors group cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <img 
                            src={getSidePhoto(guest.side)} 
                            alt={guest.side} 
                            className="w-8 h-8 rounded-full object-cover border border-[#D4AF37]/50 shrink-0 shadow-sm" 
                          />
                          <div>
                            <p className="text-sm font-semibold text-[#2D2D2D] group-hover:gold-text transition-colors flex items-center gap-1.5">
                              <span>{guest.name}</span>
                              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#D4AF37]/15 gold-text font-bold uppercase">Match</span>
                            </p>
                            <p className="text-[10px] uppercase tracking-wider opacity-60 text-[#2D2D2D]">
                              {guest.side === 'groom' ? "Groom's Side (Tafadzwa)" : "Bride's Side (Chengeto)"}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs gold-text group-hover:translate-x-1 transition-transform font-bold flex items-center gap-1">
                          <span>View</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </motion.button>
                    ))}
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Total Stats Counter */}
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="inline-flex items-center gap-3 bg-white/90 px-6 py-3 rounded-full border gold-border shadow-sm text-xs uppercase tracking-widest font-semibold text-[#2D2D2D]"
        >
          <Users className="w-4 h-4 gold-text animate-bounce" style={{ animationDuration: '3s' }} />
          <span>Total Confirmed Attendees:</span>
          <span className="text-base font-bold serif italic gold-text px-2 bg-[#F9F6F0] rounded-full py-0.5 border border-[#D4AF37]/30">
            {totalGuests} Guests
          </span>
        </motion.div>
      </motion.div>

      {/* Two Large Main Dashboard Buttons (Glassmorphism & Glow Rings) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Groom Family Card */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ 
            y: -8, 
            scale: 1.02,
            boxShadow: "0 25px 50px -12px rgba(212, 175, 55, 0.35)",
            transition: { duration: 0.25 } 
          }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="group relative bg-gradient-to-b from-white via-white/95 to-[#F9F6F0]/90 backdrop-blur-xl rounded-3xl p-8 border-2 border-[#D4AF37]/60 shadow-lg transition-all duration-300 flex flex-col justify-between text-left overflow-hidden cursor-pointer"
          onClick={() => onSelectSide('groom')}
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#D4AF37]/15 rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-500" />
          
          <div>
            <div className="flex justify-between items-start mb-8 relative">
              <span className="serif italic text-5xl sm:text-6xl gold-text opacity-30 select-none font-bold">01</span>
              
              {/* Circular Glowing Frame for Groom Profile */}
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-20 h-20 rounded-full overflow-hidden p-1 bg-gradient-to-tr from-[#D4AF37] via-[#2D2D2D] to-[#D4AF37] glow-ring-gold shrink-0 relative"
                title="Tafadzwa - Groom"
              >
                <img 
                  src={photos.groom} 
                  alt="Tafadzwa - Groom" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-full border border-white" 
                />
              </motion.div>
            </div>

            <div className="flex items-center justify-between mb-2">
              <h3 className="text-2xl sm:text-3xl serif font-extrabold text-[#2D2D2D] group-hover:gold-text transition-colors">
                Groom's Side
              </h3>
              <span className="bg-[#2D2D2D] text-white border border-[#D4AF37] text-xs uppercase tracking-widest font-bold px-3.5 py-1 rounded-full shadow-sm">
                {groomGuestsCount} {groomGuestsCount === 1 ? 'Guest' : 'Guests'}
              </span>
            </div>
            <p className="text-xs uppercase tracking-[0.2em] font-bold gold-text mb-4">
              👨 Tafadzwa Family & Friends
            </p>
            <p className="text-sm text-[#2D2D2D]/75 mb-8 font-normal leading-relaxed">
              Explore and manage attendees invited by Tafadzwa and his family. Parents, brothers, relatives, and lifelong friends.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-[#D4AF37]/30">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => {
                e.stopPropagation();
                onSelectSide('groom');
              }}
              className="flex-1 py-3.5 px-6 bg-[#2D2D2D] hover:bg-black text-white text-xs uppercase tracking-widest font-bold rounded-full shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer border border-[#D4AF37]/30"
            >
              <span>Explore Groom List</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                onOpenAddModal('groom');
              }}
              className="py-3.5 px-6 bg-[#F9F6F0] hover:bg-[#D4AF37] hover:text-white text-[#2D2D2D] border gold-border text-xs uppercase tracking-widest font-bold rounded-full transition-all flex items-center justify-center gap-1 cursor-pointer shrink-0 shadow-2xs"
              title="Add guest to Groom side"
            >
              <span>➕ Add New</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Bride Family Card */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ 
            y: -8, 
            scale: 1.02,
            boxShadow: "0 25px 50px -12px rgba(244, 114, 182, 0.35)",
            transition: { duration: 0.25 } 
          }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="group relative bg-gradient-to-b from-white via-white/95 to-[#FFF5F8]/90 backdrop-blur-xl rounded-3xl p-8 border-2 border-[#F472B6]/60 shadow-lg transition-all duration-300 flex flex-col justify-between text-left overflow-hidden cursor-pointer"
          onClick={() => onSelectSide('bride')}
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#F472B6]/15 rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-500" />
          
          <div>
            <div className="flex justify-between items-start mb-8 relative">
              <span className="serif italic text-5xl sm:text-6xl text-[#F472B6] opacity-30 select-none font-bold">02</span>
              
              {/* Circular Glowing Ring for Bride Profile */}
              <motion.div 
                whileHover={{ scale: 1.1, rotate: -5 }}
                className="w-20 h-20 rounded-full overflow-hidden p-1 bg-gradient-to-tr from-[#F472B6] via-[#FDFCFB] to-[#D4AF37] glow-ring-rose shrink-0 relative"
                title="Chengeto - Bride"
              >
                <img 
                  src={photos.bride} 
                  alt="Chengeto - Bride" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-full border border-white" 
                />
              </motion.div>
            </div>

            <div className="flex items-center justify-between mb-2">
              <h3 className="text-2xl sm:text-3xl serif font-extrabold text-[#2D2D2D] group-hover:text-[#F472B6] transition-colors">
                Bride's Side
              </h3>
              <span className="bg-[#F472B6] text-white border border-rose-300 text-xs uppercase tracking-widest font-bold px-3.5 py-1 rounded-full shadow-sm">
                {brideGuestsCount} {brideGuestsCount === 1 ? 'Guest' : 'Guests'}
              </span>
            </div>
            <p className="text-xs uppercase tracking-[0.2em] font-bold text-[#F472B6] mb-4">
              👰 Chengeto Family & Friends
            </p>
            <p className="text-sm text-[#2D2D2D]/75 mb-8 font-normal leading-relaxed">
              Explore and manage attendees invited by Chengeto and her family. Bridesmaids, sisters, relatives, and lifelong friends.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-[#F472B6]/30">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => {
                e.stopPropagation();
                onSelectSide('bride');
              }}
              className="flex-1 py-3.5 px-6 bg-[#2D2D2D] hover:bg-[#F472B6] text-white text-xs uppercase tracking-widest font-bold rounded-full shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer border border-[#F472B6]/30"
            >
              <span>Explore Bride List</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                onOpenAddModal('bride');
              }}
              className="py-3.5 px-6 bg-[#FFF5F8] hover:bg-[#F472B6] hover:text-white text-[#2D2D2D] border border-rose-300 text-xs uppercase tracking-widest font-bold rounded-full transition-all flex items-center justify-center gap-1 cursor-pointer shrink-0 shadow-2xs"
              title="Add guest to Bride side"
            >
              <span>➕ Add New</span>
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Global Add Button & Data Management Footer */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="glass-card rounded-2xl p-8 border gold-border shadow-md flex flex-col sm:flex-row items-center justify-between gap-6 bg-white/80 backdrop-blur-md"
      >
        <div className="text-left max-w-md">
          <h4 className="text-xl serif font-bold text-[#2D2D2D] mb-1 flex items-center gap-2">
            <span>✨ Quick Guest Registration</span>
          </h4>
          <p className="text-xs uppercase tracking-wider opacity-70 text-[#2D2D2D]">
            Need to invite someone right now? Open the floating glass form to add a guest instantly.
          </p>
        </div>
        
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <motion.button
            whileHover={{ scale: 1.04, boxShadow: "0 10px 25px -5px rgba(212,175,55,0.4)" }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onOpenAddModal()}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#2D2D2D] to-black text-white text-xs uppercase tracking-widest font-bold rounded-full shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 border border-[#D4AF37]/50"
          >
            <span>➕ Add New Guest</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Helper Note for Local Storage */}
      <div className="mt-8 text-center flex flex-col sm:flex-row items-center justify-center gap-2 text-[10px] sm:text-xs uppercase tracking-widest opacity-60 text-[#2D2D2D]">
        <span>💾 Automatically synced & saved to browser storage</span>
        {guests.length > 0 && (
          <>
            <span className="hidden sm:inline">•</span>
            <button
              onClick={onResetData}
              className="gold-text hover:underline font-bold cursor-pointer"
            >
              Reset to default sample list
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
};


