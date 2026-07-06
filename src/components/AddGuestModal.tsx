import React, { useState, useEffect, useRef } from 'react';
import { X, Check, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GuestSide } from '../types';
import { getSidePhoto } from '../utils';

interface AddGuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddGuest: (name: string, side: GuestSide, catalog?: string) => void;
  initialSide?: GuestSide;
  initialCatalog?: string;
}

export const AddGuestModal: React.FC<AddGuestModalProps> = ({
  isOpen,
  onClose,
  onAddGuest,
  initialSide = 'groom',
  initialCatalog,
}) => {
  const [name, setName] = useState('');
  const [side, setSide] = useState<GuestSide>(initialSide);
  const [catalog, setCatalog] = useState<string>(initialCatalog || (initialSide === 'groom' ? 'Mutoko Guests' : 'Village Guests'));
  const [isCustomCatalog, setIsCustomCatalog] = useState<boolean>(false);
  const [customCatalogName, setCustomCatalogName] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setSide(initialSide);
      setName('');
      if (initialCatalog) {
        setCatalog(initialCatalog);
        setIsCustomCatalog(false);
      } else {
        setCatalog(initialSide === 'groom' ? 'Mutoko Guests' : 'Village Guests');
        setIsCustomCatalog(false);
      }
      setCustomCatalogName('');
      // Auto-focus input after modal transition
      const timer = setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen, initialSide, initialCatalog]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() === '') return;
    const finalCatalog = isCustomCatalog && customCatalogName.trim() ? customCatalogName.trim() : catalog;
    onAddGuest(name.trim(), side, finalCatalog);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <motion.div 
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            id="add-guest-modal"
            className="bg-white rounded-2xl max-w-lg w-full p-8 shadow-xl border gold-border"
          >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-6 border-b gold-border mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full cream-bg text-[#2D2D2D] flex items-center justify-center text-xl border gold-border">
              ➕
            </div>
            <div>
              <h2 className="text-2xl serif font-bold text-[#2D2D2D]">Add New Guest</h2>
              <p className="text-[10px] uppercase tracking-widest opacity-60 text-[#2D2D2D]">Quick & simple entry</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-[#2D2D2D] hover:bg-[#F9F6F0] rounded-full transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Guest Name Input */}
          <div>
            <label htmlFor="guest-name-input" className="block text-xs uppercase tracking-widest font-bold text-[#2D2D2D] mb-2">
              Guest Name <span className="text-rose-500">*</span>
            </label>
            <input
              ref={inputRef}
              id="guest-name-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="E.G. UNCLE SIMBARASHE DUBE"
              className="w-full px-5 py-3.5 text-sm bg-[#FDFCFB] border gold-border rounded-xl focus:bg-white focus:border-[#D4AF37] focus:outline-none text-[#2D2D2D] placeholder-gray-400 transition-all font-medium uppercase tracking-wider"
              required
            />
          </div>

          {/* Side Selector (Groom or Bride) */}
          <div>
            <label className="block text-xs uppercase tracking-widest font-bold text-[#2D2D2D] mb-2">
              Which family side is this guest from?
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => {
                  setSide('groom');
                  if (!initialCatalog) setCatalog('Mutoko Guests');
                }}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all cursor-pointer ${
                  side === 'groom'
                    ? 'sage-bg border-[#2D2D2D] shadow-xs scale-[1.02]'
                    : 'bg-[#F9F6F0] border-transparent hover:border-gray-300 opacity-70'
                }`}
              >
                <img src={getSidePhoto('groom')} alt="Groom" className="w-10 h-10 rounded-full object-cover border gold-border mb-1.5 shadow-2xs" />
                <span className="text-xs uppercase tracking-widest font-bold text-[#2D2D2D]">
                  Groom Side
                </span>
                <span className="text-[10px] uppercase tracking-wider opacity-60 text-[#2D2D2D] mt-0.5">Tafadzwa's Family</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSide('bride');
                  if (!initialCatalog) setCatalog('Village Guests');
                }}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all cursor-pointer ${
                  side === 'bride'
                    ? 'cream-bg-alt border-[#2D2D2D] shadow-xs scale-[1.02]'
                    : 'bg-[#F9F6F0] border-transparent hover:border-gray-300 opacity-70'
                }`}
              >
                <img src={getSidePhoto('bride')} alt="Bride" className="w-10 h-10 rounded-full object-cover border gold-border mb-1.5 shadow-2xs" />
                <span className="text-xs uppercase tracking-widest font-bold text-[#2D2D2D]">
                  Bride Side
                </span>
                <span className="text-[10px] uppercase tracking-wider opacity-60 text-[#2D2D2D] mt-0.5">Chengeto's Family</span>
              </button>
            </div>
          </div>

          {/* Catalog Group Selector */}
          <div>
            <label className="block text-xs uppercase tracking-widest font-bold text-[#2D2D2D] mb-2">
              Assign to Guest Catalog / Section <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-2.5 mb-3">
              {(side === 'groom' 
                ? ['Mutoko Guests', 'Harare Guests', 'Family Friends', 'General Guests'] 
                : ['Mutoko Guests', 'Village Guests', 'Harare Guests', 'Family Friends']
              ).map((catName) => (
                <button
                  key={catName}
                  type="button"
                  onClick={() => {
                    setCatalog(catName);
                    setIsCustomCatalog(false);
                  }}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border cursor-pointer flex items-center justify-center gap-1.5 ${
                    !isCustomCatalog && catalog === catName
                      ? 'bg-[#2D2D2D] text-white border-[#D4AF37] shadow-sm scale-[1.02]'
                      : 'bg-[#F9F6F0] hover:bg-white text-[#2D2D2D] border-transparent hover:border-[#D4AF37]/50'
                  }`}
                >
                  <span>📍</span>
                  <span className="truncate">{catName}</span>
                </button>
              ))}
              <button
                type="button"
                onClick={() => setIsCustomCatalog(true)}
                className={`col-span-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all border cursor-pointer flex items-center justify-center gap-1.5 ${
                  isCustomCatalog
                    ? 'bg-[#2D2D2D] text-white border-[#D4AF37] shadow-sm scale-[1.02]'
                    : 'bg-[#F9F6F0] hover:bg-white text-[#2D2D2D] border-transparent hover:border-[#D4AF37]/50'
                }`}
              >
                <span>✏️ Custom Catalog Name</span>
              </button>
            </div>

            {isCustomCatalog && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="pt-1"
              >
                <input
                  type="text"
                  value={customCatalogName}
                  onChange={(e) => setCustomCatalogName(e.target.value)}
                  placeholder="ENTER CUSTOM CATALOG (E.G. BULAWAYO GUESTS)"
                  className="w-full px-4 py-3 text-xs bg-[#FDFCFB] border-2 border-[#D4AF37] rounded-xl focus:bg-white focus:outline-none text-[#2D2D2D] placeholder-gray-400 font-bold uppercase tracking-wider shadow-inner"
                  autoFocus
                />
              </motion.div>
            )}
          </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t gold-border">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={!name.trim()}
                className="flex-1 py-3.5 px-6 bg-[#2D2D2D] hover:bg-black disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-xs uppercase tracking-widest font-bold rounded-full shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Save Guest</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={onClose}
                className="py-3.5 px-6 bg-[#F4F1EA] hover:bg-[#E5EAE4] text-[#2D2D2D] text-xs uppercase tracking-widest font-bold rounded-full transition-colors cursor-pointer border gold-border"
              >
                Cancel
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
      )}
    </AnimatePresence>
  );
};
