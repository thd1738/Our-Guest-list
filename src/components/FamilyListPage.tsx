import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Trash2, Edit3, UserPlus, Heart, Sparkles, Camera, X, Check, Upload, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Guest, GuestSide } from '../types';
import { getSidePhoto, notifyPhotoUpdate, DEFAULT_GROOM_PHOTO, DEFAULT_BRIDE_PHOTO } from '../utils';

interface FamilyListPageProps {
  side: GuestSide;
  guests: Guest[];
  onNavigateHome: () => void;
  onSwitchSide: (side: GuestSide) => void;
  onOpenAddModal: (side: GuestSide, defaultCatalog?: string) => void;
  onOpenEditModal: (guest: Guest) => void;
  onDeleteGuest: (id: string, name: string) => void;
  highlightedGuestId?: string | null;
}

export const FamilyListPage: React.FC<FamilyListPageProps> = ({
  side,
  guests,
  onNavigateHome,
  onSwitchSide,
  onOpenAddModal,
  onOpenEditModal,
  onDeleteGuest,
  highlightedGuestId,
}) => {
  const isGroom = side === 'groom';
  const sideGuests = guests.filter(g => g.side === side);
  const highlightedRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setInputPhotoUrl(base64String);
        localStorage.setItem(`wedding_${side}_photo`, base64String);
        setPhotoUrl(base64String);
        setIsPhotoModalOpen(false);
        notifyPhotoUpdate();
      };
      reader.readAsDataURL(file);
    }
  };

  const [photoUrl, setPhotoUrl] = useState<string>(() => getSidePhoto(side));
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [inputPhotoUrl, setInputPhotoUrl] = useState('');

  // Deletion Confirmation & Particle Dissolve State
  const [guestToDelete, setGuestToDelete] = useState<{ id: string; name: string } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Collapsible Catalogs State
  const [openCatalogs, setOpenCatalogs] = useState<Record<string, boolean>>({});
  const isCatalogOpen = (catName: string) => openCatalogs[catName] !== false;
  const toggleCatalog = (catName: string) => {
    setOpenCatalogs(prev => ({ ...prev, [catName]: !isCatalogOpen(catName) }));
  };

  // Predefined and dynamic catalog computation
  const defaultGroomCatalogs = ['Mutoko Guests', 'Harare Guests', 'Family Friends'];
  const defaultBrideCatalogs = ['Mutoko Guests', 'Village Guests', 'Harare Guests', 'Family Friends'];
  const baseCatalogs = isGroom ? defaultGroomCatalogs : defaultBrideCatalogs;
  const customCatalogs: string[] = Array.from(new Set(
    sideGuests
      .map(g => g.catalog)
      .filter((cat): cat is string => Boolean(cat && !baseCatalogs.includes(cat) && cat !== 'General Guests'))
  ));
  const uncategorizedGuests = sideGuests.filter(g => !g.catalog || g.catalog === 'General Guests');
  const allCatalogs: string[] = [
    ...baseCatalogs,
    ...customCatalogs,
    ...(uncategorizedGuests.length > 0 && !baseCatalogs.includes('General Guests') ? ['General Guests'] : [])
  ];

  const handleConfirmDelete = () => {
    if (!guestToDelete) return;
    const { id, name } = guestToDelete;
    setDeletingId(id);
    setGuestToDelete(null);

    // Play 450ms particle dissolve shrink animation before removing from state
    setTimeout(() => {
      onDeleteGuest(id, name);
      setDeletingId(null);
    }, 450);
  };

  useEffect(() => {
    setPhotoUrl(getSidePhoto(side));
  }, [side]);

  const handleSavePhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputPhotoUrl.trim()) {
      localStorage.setItem(`wedding_${side}_photo`, inputPhotoUrl.trim());
      setPhotoUrl(inputPhotoUrl.trim());
      setIsPhotoModalOpen(false);
      setInputPhotoUrl('');
      notifyPhotoUpdate();
    }
  };

  const handleResetPhoto = () => {
    localStorage.removeItem(`wedding_${side}_photo`);
    const defaultUrl = side === 'groom' ? DEFAULT_GROOM_PHOTO : DEFAULT_BRIDE_PHOTO;
    setPhotoUrl(defaultUrl);
    setIsPhotoModalOpen(false);
    notifyPhotoUpdate();
  };

  // Scroll to highlighted guest if navigated from instant search
  useEffect(() => {
    if (highlightedGuestId && highlightedRef.current) {
      highlightedRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [highlightedGuestId, side]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35 }}
      id="family-list-page" 
      className="max-w-5xl mx-auto px-6 py-8"
    >
      {/* Top Navigation & Family Switcher */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8">
        <button
          onClick={onNavigateHome}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-[#F9F6F0] border gold-border text-[#2D2D2D] text-xs uppercase tracking-widest font-bold rounded-full shadow-2xs transition-all cursor-pointer w-fit"
        >
          <ArrowLeft className="w-4 h-4 text-[#2D2D2D]" />
          <span>Back to Dashboard</span>
        </button>

        {/* Quick Side Switcher Tabs */}
        <div className="flex bg-[#F4F1EA] p-1.5 rounded-full border border-[#D4AF37]/30">
          <button
            onClick={() => onSwitchSide('groom')}
            className={`flex-1 sm:flex-initial px-5 py-2 rounded-full text-xs uppercase tracking-widest font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              isGroom 
                ? 'bg-[#2D2D2D] text-white shadow-xs' 
                : 'text-[#2D2D2D] hover:bg-white/50'
            }`}
          >
            <img src={getSidePhoto('groom')} alt="Groom" className="w-5 h-5 rounded-full object-cover border border-current shrink-0" />
            <span>Groom ({guests.filter(g => g.side === 'groom').length})</span>
          </button>
          <button
            onClick={() => onSwitchSide('bride')}
            className={`flex-1 sm:flex-initial px-5 py-2 rounded-full text-xs uppercase tracking-widest font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              !isGroom 
                ? 'bg-[#2D2D2D] text-white shadow-xs' 
                : 'text-[#2D2D2D] hover:bg-white/50'
            }`}
          >
            <img src={getSidePhoto('bride')} alt="Bride" className="w-5 h-5 rounded-full object-cover border border-current shrink-0" />
            <span>Bride ({guests.filter(g => g.side === 'bride').length})</span>
          </button>
        </div>
      </div>

      {/* Editorial Profile Picture Hero Section (Animated Header Entrance: fade + slide down) */}
      <motion.div 
        initial={{ opacity: 0, y: -25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`rounded-3xl p-8 sm:p-10 border shadow-lg mb-8 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left relative overflow-hidden backdrop-blur-xl ${
          isGroom 
            ? 'bg-gradient-to-br from-white via-white/95 to-[#F9F6F0] border-[#D4AF37]/60' 
            : 'bg-gradient-to-br from-white via-[#FFF9FB] to-[#FFF0F5] border-[#F472B6]/60'
        }`}
      >
        {/* Subtle decorative background glow */}
        <div className={`absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none ${
          isGroom ? 'bg-[#D4AF37]/15' : 'bg-[#F472B6]/15'
        }`} />

        <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 z-10 w-full md:w-auto">
          {/* Profile Picture with Circular Glowing Frame & Camera Button */}
          <div className="flex flex-col items-center gap-3 shrink-0">
            <div className="relative group">
              <motion.div 
                whileHover={{ scale: 1.05, rotate: isGroom ? 3 : -3 }}
                className={`w-32 h-32 sm:w-36 sm:h-36 rounded-full p-1.5 bg-gradient-to-tr ${
                  isGroom 
                    ? 'from-[#D4AF37] via-[#2D2D2D] to-[#D4AF37] glow-ring-gold' 
                    : 'from-[#F472B6] via-[#FDFCFB] to-[#D4AF37] glow-ring-rose'
                }`}
              >
                <div className="w-full h-full rounded-full overflow-hidden bg-[#F9F6F0] relative flex items-center justify-center border-2 border-white">
                  <img 
                    src={photoUrl} 
                    alt={isGroom ? "Tafadzwa - Groom" : "Chengeto - Bride"} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <span className="text-4xl absolute select-none -z-10 opacity-30">
                    {isGroom ? '👨' : '👰'}
                  </span>
                </div>
              </motion.div>

              {/* Change Photo Button */}
              <button
                onClick={() => {
                  setInputPhotoUrl(photoUrl);
                  setIsPhotoModalOpen(true);
                }}
                className={`absolute bottom-1 right-1 text-white p-2.5 rounded-full shadow-lg border transition-transform hover:scale-110 cursor-pointer flex items-center justify-center ${
                  isGroom ? 'bg-[#2D2D2D] hover:bg-black border-[#D4AF37]' : 'bg-[#F472B6] hover:bg-rose-600 border-white'
                }`}
                title="Change Profile Photo"
              >
                <Camera className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Direct Gallery Upload Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className={`px-3.5 py-1.5 hover:bg-white text-[10px] uppercase tracking-widest font-bold rounded-full border flex items-center gap-1.5 shadow-xs hover:shadow-sm transition-all cursor-pointer group ${
                isGroom ? 'bg-[#F9F6F0] border-[#D4AF37] text-[#2D2D2D]' : 'bg-[#FFF0F5] border-[#F472B6]/60 text-[#2D2D2D]'
              }`}
              title="Upload photo directly from your device gallery"
            >
              <Upload className={`w-3.5 h-3.5 group-hover:scale-110 transition-transform ${isGroom ? 'gold-text' : 'text-[#F472B6]'}`} />
              <span>Upload Gallery</span>
            </button>
          </div>

          {/* Title & Description */}
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold mb-3 shadow-2xs bg-white border border-[#D4AF37]/40">
              <Sparkles className={`w-3 h-3 ${isGroom ? 'gold-text' : 'text-[#F472B6]'}`} />
              <span>{isGroom ? 'Luxury Groom Side Profile' : 'Romantic Bride Side Profile'}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl serif font-extrabold text-[#2D2D2D] mb-2 tracking-tight">
              {isGroom ? "Tafadzwa's Guest List" : "Chengeto's Guest List"}
            </h2>
            <p className={`text-xs sm:text-sm uppercase tracking-widest font-bold mb-3 ${isGroom ? 'gold-text' : 'text-[#F472B6]'}`}>
              {isGroom ? '👨 Groom Family & Friends' : '👰 Bride Family & Friends'}
            </p>
            <p className="text-xs sm:text-sm text-[#2D2D2D]/70 max-w-md font-normal leading-relaxed">
              {isGroom 
                ? 'Manage attendees for Tafadzwa. Adding parents, siblings, relatives, and lifelong friends with instant real-time synchronization.'
                : 'Manage attendees for Chengeto. Adding parents, bridesmaids, sisters, and closest confidants with soft romantic styling.'}
            </p>
          </div>
        </div>

        {/* Action Button & Stats Badge */}
        <div className="flex flex-col items-center md:items-end gap-3 z-10 w-full md:w-auto border-t md:border-t-0 pt-6 md:pt-0 border-[#D4AF37]/20">
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: isGroom ? "0 10px 25px -5px rgba(212,175,55,0.4)" : "0 10px 25px -5px rgba(244,114,182,0.4)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onOpenAddModal(side)}
            className={`w-full sm:w-auto px-8 py-4 text-white text-xs uppercase tracking-widest font-bold rounded-full shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer border ${
              isGroom 
                ? 'bg-[#2D2D2D] hover:bg-black border-[#D4AF37]/50' 
                : 'bg-gradient-to-r from-[#F472B6] to-rose-600 hover:from-rose-600 hover:to-rose-700 border-white/50'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Guest to {isGroom ? 'Groom' : 'Bride'} Side</span>
          </motion.button>
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-[#D4AF37]/30 text-xs font-semibold text-[#2D2D2D] shadow-xs">
            <span>Total Confirmed:</span>
            <span className={`font-bold font-serif italic text-sm ${isGroom ? 'gold-text' : 'text-[#F472B6]'}`}>
              {sideGuests.length} {sideGuests.length === 1 ? 'Guest' : 'Guests'}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Guest List Catalogs (Grouped Sections) */}
      <div className="bg-transparent rounded-2xl mb-8">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#D4AF37]/30 px-2">
          <div className="flex items-center gap-2">
            <Heart className={`w-4 h-4 ${isGroom ? 'gold-text' : 'text-[#F472B6] animate-pulse'}`} />
            <h3 className="text-sm uppercase tracking-widest font-bold text-[#2D2D2D]">
              {isGroom ? "Groom's" : "Bride's"} Guest Catalogs ({sideGuests.length} Total Attendees)
            </h3>
          </div>
          <span className="text-[10px] uppercase tracking-wider text-[#2D2D2D]/50 font-medium">
            ✨ Click catalog header to collapse / expand
          </span>
        </div>

        {sideGuests.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-12 text-center border border-[#D4AF37]/30 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-[#F4F1EA] text-3xl flex items-center justify-center mx-auto mb-4 border border-[#D4AF37]/40 shadow-xs">
              {isGroom ? '👨' : '👰'}
            </div>
            <h3 className="text-2xl serif font-bold text-[#2D2D2D] mb-2">
              No guests added to {isGroom ? "Tafadzwa's" : "Chengeto's"} list yet
            </h3>
            <p className="text-xs uppercase tracking-widest opacity-60 max-w-md mx-auto mb-6">
              Click the button below to add your first guest to this family side
            </p>
            <button
              onClick={() => onOpenAddModal(side)}
              className="px-8 py-3.5 bg-[#2D2D2D] hover:bg-black text-white text-xs uppercase tracking-widest font-bold rounded-full shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <span>➕ Add First Guest</span>
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {allCatalogs.map((catalogName) => {
              const catalogGuests = sideGuests.filter(
                g => (g.catalog || 'General Guests') === catalogName
              );

              return (
                <div 
                  key={catalogName}
                  className={`rounded-3xl border overflow-hidden shadow-sm transition-all ${
                    isGroom 
                      ? 'bg-white/95 border-[#D4AF37]/40 hover:border-[#D4AF37]' 
                      : 'bg-white/95 border-[#F472B6]/40 hover:border-[#F472B6]'
                  }`}
                >
                  {/* Catalog Header Bar */}
                  <div 
                    onClick={() => toggleCatalog(catalogName)}
                    className={`px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none transition-colors ${
                      isGroom 
                        ? 'bg-gradient-to-r from-[#FFFDF7] via-white to-[#F9F6F0] hover:bg-[#F4F1EA]' 
                        : 'bg-gradient-to-r from-[#FFF9FB] via-white to-[#FFF0F5] hover:bg-[#FFE4E1]/40'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl shadow-2xs border shrink-0 ${
                        isGroom ? 'bg-white border-[#D4AF37]/50 text-[#D4AF37]' : 'bg-white border-[#F472B6]/50 text-[#F472B6]'
                      }`}>
                        📍
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-lg sm:text-xl font-serif font-extrabold text-[#2D2D2D] tracking-tight">
                            {catalogName}
                          </h3>
                          <span className={`text-xs font-sans font-bold px-2.5 py-0.5 rounded-full border shadow-2xs ${
                            isGroom 
                              ? 'bg-[#F9F6F0] text-[#D4AF37] border-[#D4AF37]/40' 
                              : 'bg-[#FFF0F5] text-[#F472B6] border-[#F472B6]/40'
                          }`}>
                            {catalogGuests.length} {catalogGuests.length === 1 ? 'person' : 'people'}
                          </span>
                        </div>
                        <p className="text-xs text-[#2D2D2D]/60 mt-0.5 font-medium">
                          {catalogGuests.length === 0 ? 'No guests listed in this group yet' : `Click header to ${isCatalogOpen(catalogName) ? 'collapse' : 'expand'} list`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-0 border-gray-100">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenAddModal(side, catalogName);
                        }}
                        className={`px-3.5 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold border transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer ${
                          isGroom
                            ? 'bg-[#2D2D2D] hover:bg-black text-white border-[#D4AF37]/50'
                            : 'bg-[#F472B6] hover:bg-rose-600 text-white border-white'
                        }`}
                        title={`Add guest directly to ${catalogName}`}
                      >
                        <span>➕ Add Here</span>
                      </button>

                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-transform duration-300 text-xs font-bold ${
                        isCatalogOpen(catalogName) ? 'rotate-180' : 'rotate-0'
                      } ${
                        isGroom ? 'bg-[#F9F6F0] border-[#D4AF37]/30 text-[#2D2D2D]' : 'bg-[#FFF0F5] border-[#F472B6]/30 text-[#2D2D2D]'
                      }`}>
                        ▼
                      </div>
                    </div>
                  </div>

                  {/* Collapsible Guest Cards List with Smooth Slide-Down */}
                  <AnimatePresence initial={false}>
                    {isCatalogOpen(catalogName) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: 'easeInOut' }}
                        className="overflow-hidden border-t border-gray-100"
                      >
                        <div className="p-4 sm:p-6 space-y-3 bg-[#FDFCFB]/50">
                          {catalogGuests.length === 0 ? (
                            <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-2xl bg-white/60">
                              <p className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-2.5">No attendees listed under {catalogName}</p>
                              <button
                                onClick={() => onOpenAddModal(side, catalogName)}
                                className={`text-xs font-bold uppercase tracking-wider underline transition-colors cursor-pointer ${
                                  isGroom ? 'gold-text hover:text-black' : 'text-[#F472B6] hover:text-black'
                                }`}
                              >
                                + Add first person to {catalogName}
                              </button>
                            </div>
                          ) : (
                            <AnimatePresence mode="popLayout">
                              {catalogGuests.map((guest, index) => {
                                const isHighlighted = guest.id === highlightedGuestId;
                                const isDeleting = guest.id === deletingId;

                                return (
                                  <motion.div
                                    layout
                                    initial={{ opacity: 0, x: -20, scale: 0.95 }}
                                    animate={isDeleting ? {
                                      opacity: 0,
                                      scale: 0.1,
                                      rotate: 15,
                                      filter: 'blur(8px)',
                                    } : {
                                      opacity: 1,
                                      x: 0,
                                      scale: 1,
                                      rotate: 0,
                                      filter: 'blur(0px)',
                                    }}
                                    exit={{ opacity: 0, scale: 0.8, filter: 'blur(10px)', transition: { duration: 0.3 } }}
                                    transition={{ delay: index * 0.03, duration: 0.3, type: 'spring', stiffness: 300, damping: 25 }}
                                    key={guest.id}
                                    ref={isHighlighted ? highlightedRef : null}
                                    onClick={() => onOpenEditModal(guest)}
                                    className={`group relative px-5 py-4 rounded-2xl transition-all flex items-center justify-between gap-4 cursor-pointer shadow-2xs hover:shadow-md border ${
                                      isHighlighted
                                        ? 'bg-[#FFFDF7] ring-2 ring-[#D4AF37] animate-pulse border-[#D4AF37]'
                                        : isGroom
                                        ? 'bg-white hover:bg-[#FFFDF7] border-[#D4AF37]/30 hover:border-[#D4AF37]'
                                        : 'bg-white hover:bg-[#FFF9FB] border-[#F472B6]/30 hover:border-[#F472B6]'
                                    } hover:-translate-y-0.5`}
                                    title="Tap card to edit guest name"
                                  >
                                    {/* Dissolve Sparkle Particles when deleting */}
                                    {isDeleting && (
                                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        {Array.from({ length: 12 }).map((_, i) => (
                                          <motion.span
                                            key={i}
                                            initial={{ scale: 0, x: 0, y: 0 }}
                                            animate={{
                                              scale: [1, 0],
                                              x: (Math.random() - 0.5) * 200,
                                              y: (Math.random() - 0.5) * 200,
                                              opacity: [1, 0]
                                            }}
                                            transition={{ duration: 0.4, ease: 'easeOut' }}
                                            className="absolute w-2 h-2 rounded-full bg-[#D4AF37] shadow-[0_0_8px_#D4AF37]"
                                          />
                                        ))}
                                      </div>
                                    )}

                                    {/* Guest Name and Index inside catalog */}
                                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                                      <span className={`w-8 h-8 rounded-full font-bold flex items-center justify-center text-xs shrink-0 transition-all serif italic border ${
                                        isGroom 
                                          ? 'bg-[#F9F6F0] group-hover:bg-[#2D2D2D] group-hover:text-white text-[#2D2D2D] border-[#D4AF37]/40' 
                                          : 'bg-[#FFF0F5] group-hover:bg-[#F472B6] group-hover:text-white text-[#2D2D2D] border-[#F472B6]/40'
                                      }`}>
                                        {index + 1}
                                      </span>
                                      <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2.5">
                                          <h4 className={`text-sm sm:text-base font-bold text-[#2D2D2D] truncate transition-colors ${
                                            isGroom ? 'group-hover:gold-text' : 'group-hover:text-[#F472B6]'
                                          }`}>
                                            {guest.name}
                                          </h4>
                                          <span className="opacity-0 group-hover:opacity-100 text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-white border gold-border text-[#2D2D2D] flex items-center gap-1 transition-opacity shrink-0 shadow-2xs">
                                            <Edit3 className="w-2.5 h-2.5 gold-text" />
                                            <span>Edit</span>
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Editorial Action Buttons */}
                                    <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                                      <button
                                        onClick={() => onOpenEditModal(guest)}
                                        className="px-3 py-1.5 text-gray-500 hover:text-[#2D2D2D] transition-colors text-[10px] uppercase tracking-widest font-bold flex items-center gap-1 rounded-full hover:bg-gray-100 border border-transparent hover:border-gray-200"
                                        title="Edit guest"
                                      >
                                        <Edit3 className="w-3.5 h-3.5" />
                                        <span className="hidden md:inline">Edit</span>
                                      </button>

                                      <button
                                        onClick={() => setGuestToDelete({ id: guest.id, name: guest.name })}
                                        className="px-3 py-1.5 text-red-500 hover:text-white hover:bg-red-500 text-[10px] uppercase tracking-widest font-bold rounded-full border border-red-200 hover:border-red-500 transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
                                        title="Delete guest"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                        <span>Delete</span>
                                      </button>
                                    </div>
                                  </motion.div>
                                );
                              })}
                            </AnimatePresence>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Floating/Helper Add Button for long lists */}
      {sideGuests.length > 4 && (
        <div className="glass-card rounded-2xl p-6 border gold-border shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/90 backdrop-blur-md">
          <p className="text-xs uppercase tracking-widest font-bold text-[#2D2D2D]">
            Need to add more {isGroom ? "Groom's" : "Bride's"} guests?
          </p>
          <button
            onClick={() => onOpenAddModal(side)}
            className={`w-full sm:w-auto px-6 py-3 text-white text-xs uppercase tracking-widest font-bold rounded-full shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
              isGroom ? 'bg-[#2D2D2D] hover:bg-black' : 'bg-[#F472B6] hover:bg-rose-600'
            }`}
          >
            <span>➕ Add New Guest</span>
          </button>
        </div>
      )}

      {/* Deletion Confirmation Modal (Soft fade-in + particle dissolve trigger) */}
      <AnimatePresence>
        {guestToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 15 }}
              className="bg-[#FDFCFB] rounded-3xl max-w-md w-full p-8 shadow-2xl border-2 border-[#D4AF37] text-center relative overflow-hidden"
            >
              <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4 border border-red-200 shadow-sm animate-bounce" style={{ animationDuration: '2s' }}>
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h3 className="text-2xl serif font-bold text-[#2D2D2D] mb-2">
                Remove Guest?
              </h3>
              <p className="text-sm text-[#2D2D2D]/75 mb-6 font-normal leading-relaxed">
                Are you sure you want to remove <span className="font-bold text-[#2D2D2D] bg-[#F9F6F0] px-2 py-0.5 rounded border border-[#D4AF37]/30">"{guestToDelete.name}"</span> from the {isGroom ? 'Groom' : 'Bride'} guest directory? This action will dissolve their card from the list.
              </p>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setGuestToDelete(null)}
                  className="flex-1 py-3.5 px-6 bg-[#F4F1EA] hover:bg-[#E5EAE4] text-[#2D2D2D] text-xs uppercase tracking-widest font-bold rounded-full transition-colors cursor-pointer border gold-border"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="flex-1 py-3.5 px-6 bg-red-600 hover:bg-red-700 text-white text-xs uppercase tracking-widest font-bold rounded-full shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Yes, Remove</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Change Photo Modal */}
      {isPhotoModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-xl border gold-border transform transition-all text-left">
            <div className="flex items-center justify-between pb-5 border-b gold-border mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full cream-bg text-[#2D2D2D] flex items-center justify-center border gold-border">
                  <Camera className="w-4 h-4 gold-text" />
                </div>
                <div>
                  <h3 className="text-lg serif font-bold text-[#2D2D2D]">Update Profile Picture</h3>
                  <p className="text-[10px] uppercase tracking-widest opacity-60 text-[#2D2D2D]">{isGroom ? "Tafadzwa's Photo" : "Chengeto's Photo"}</p>
                </div>
              </div>
              <button
                onClick={() => setIsPhotoModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-[#2D2D2D] rounded-full transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePhoto} className="space-y-6">
              {/* Gallery Upload Card */}
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-[#2D2D2D] mb-2">
                  Upload from Device Gallery
                </label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full p-6 border-2 border-dashed border-[#D4AF37]/60 hover:border-[#D4AF37] rounded-xl bg-[#F9F6F0]/50 hover:bg-[#F9F6F0] transition-all flex flex-col items-center justify-center text-center cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-full bg-white border gold-border flex items-center justify-center mb-2 group-hover:scale-110 transition-transform shadow-2xs">
                    <Upload className="w-4 h-4 gold-text" />
                  </div>
                  <span className="text-xs font-bold text-[#2D2D2D] uppercase tracking-wider">
                    Click to browse device gallery
                  </span>
                  <span className="text-[10px] opacity-60 text-[#2D2D2D] mt-0.5">
                    Supports JPEG, PNG, WEBP from your phone or computer
                  </span>
                </div>
              </div>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink mx-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Or paste image link</span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-[#2D2D2D] mb-2">
                  Image URL (Paste any online photo link)
                </label>
                <input
                  type="url"
                  value={inputPhotoUrl}
                  onChange={(e) => setInputPhotoUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-3 text-xs bg-[#FDFCFB] border gold-border rounded-xl focus:bg-white focus:border-[#D4AF37] focus:outline-none text-[#2D2D2D] placeholder-gray-400 transition-all font-mono"
                />
              </div>

              {/* Sample Presets */}
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-[#2D2D2D] mb-3 opacity-70">
                  Or select a curated portrait:
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setInputPhotoUrl(isGroom ? DEFAULT_GROOM_PHOTO : DEFAULT_BRIDE_PHOTO)}
                    className="p-2.5 rounded-xl border gold-border bg-[#F9F6F0] hover:bg-white text-[10px] uppercase tracking-wider font-bold text-[#2D2D2D] flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>✨ Default</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setInputPhotoUrl(DEFAULT_BRIDE_PHOTO)}
                    className="p-2.5 rounded-xl border gold-border bg-[#F9F6F0] hover:bg-white text-[10px] uppercase tracking-wider font-bold text-[#2D2D2D] flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>🎨 AI Portrait</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleResetPhoto}
                    className="p-2.5 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 text-[10px] uppercase tracking-wider font-bold text-gray-600 flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>🔄 Reset</span>
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t gold-border">
                <button
                  type="submit"
                  className="flex-1 py-3 px-6 bg-[#2D2D2D] hover:bg-black text-white text-xs uppercase tracking-widest font-bold rounded-full shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Photo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsPhotoModalOpen(false)}
                  className="py-3 px-6 bg-[#F4F1EA] hover:bg-[#E5EAE4] text-[#2D2D2D] text-xs uppercase tracking-widest font-bold rounded-full transition-colors cursor-pointer border gold-border"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Hidden File Input for Device Gallery Upload */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />
    </motion.div>
  );
};

