import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart } from 'lucide-react';

interface SplashScreenProps {
  onDismiss: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onDismiss }) => {
  const [timeLeft, setTimeLeft] = useState(3);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // 2.7 seconds total duration before initiating smooth transition into dashboard
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        onDismiss();
      }, 700); // 700ms smooth dissolve animation duration
    }, 2500);

    const countdown = setInterval(() => {
      setTimeLeft((prev) => (prev > 1 ? prev - 1 : 0));
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(countdown);
    };
  }, [onDismiss]);

  const handleManualDismiss = () => {
    setIsExiting(true);
    setTimeout(() => {
      onDismiss();
    }, 600);
  };

  // Generate 40 floating dust particles & sparkles for ethereal atmosphere
  const particles = Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    size: Math.random() * 5 + 1.5,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    duration: Math.random() * 4 + 2.5,
    delay: Math.random() * 1.5,
    isRose: i % 4 === 0,
    isWhite: i % 3 === 0,
  }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      exit={{ opacity: 0, scale: 1.05, filter: 'blur(12px)' }}
      transition={{ duration: 0.7, ease: 'easeInOut' }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/35 backdrop-blur-lg p-4 sm:p-8 overflow-hidden select-none"
    >
      {/* Floating Glowing Dust Particles & Sparkles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, y: 10, scale: 0 }}
          animate={{
            opacity: [0, 0.85, 0],
            y: [-15, -120],
            x: [(Math.random() - 0.5) * 30, (Math.random() - 0.5) * 60],
            scale: [0, p.size > 4 ? 1.4 : 1, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeInOut',
          }}
          style={{
            position: 'absolute',
            left: p.left,
            top: p.top,
            width: `${p.size}px`,
            height: `${p.size}px`,
          }}
          className={`rounded-full pointer-events-none ${
            p.isRose
              ? 'bg-gradient-to-tr from-[#F472B6] to-white shadow-[0_0_12px_#F472B6]'
              : p.isWhite
              ? 'bg-white shadow-[0_0_10px_#FFFFFF]'
              : 'bg-gradient-to-tr from-[#D4AF37] to-[#FFF9E6] shadow-[0_0_15px_#D4AF37]'
          }`}
        />
      ))}

      {/* Subtle Ambient Ethereal Glow Orbs (no solid background) */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/3 left-1/3 w-[450px] h-[450px] bg-gradient-to-r from-[#D4AF37]/20 via-[#F472B6]/15 to-transparent rounded-full blur-[100px] pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1.1, 0.95, 1.1],
          opacity: [0.25, 0.45, 0.25],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute bottom-1/3 right-1/3 w-[400px] h-[400px] bg-gradient-to-l from-[#D4AF37]/25 via-rose-300/15 to-transparent rounded-full blur-[90px] pointer-events-none"
      />

      {/* Main Luxury Glass Container (Transparent Glassmorphism - No Solid Colors) */}
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 35, filter: 'blur(15px)' }}
        animate={{
          scale: isExiting ? 1.05 : 1,
          opacity: isExiting ? 0 : 1,
          y: isExiting ? -20 : 0,
          filter: isExiting ? 'blur(10px)' : 'blur(0px)',
        }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="relative max-w-xl w-full bg-white/15 dark:bg-black/20 backdrop-blur-2xl rounded-[36px] p-8 sm:p-14 text-center shadow-[0_0_90px_rgba(212,175,55,0.35)] border border-white/50 dark:border-white/20 my-auto overflow-hidden group"
      >
        {/* Top Shimmer Progress Bar (Smooth 2.7s automatic timer indicator) */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-white/10 overflow-hidden">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 2.7, ease: 'linear' }}
            className="h-full bg-gradient-to-r from-transparent via-[#D4AF37] to-[#F472B6] shadow-[0_0_15px_#D4AF37]"
          />
        </div>

        {/* Elegant Minimal Corner Accents */}
        <div className="absolute top-6 left-6 w-5 h-5 border-t border-l border-[#D4AF37]/80 opacity-70" />
        <div className="absolute top-6 right-6 w-5 h-5 border-t border-r border-[#D4AF37]/80 opacity-70" />
        <div className="absolute bottom-6 left-6 w-5 h-5 border-b border-l border-[#D4AF37]/80 opacity-70" />
        <div className="absolute bottom-6 right-6 w-5 h-5 border-b border-r border-[#D4AF37]/80 opacity-70" />

        {/* Animated Logo Reveal: Fade In + Zoom In + Soft Glow */}
        <div className="relative mb-8 flex justify-center items-center">
          {/* Pulsing Outer Aura Rings */}
          <motion.div
            animate={{
              scale: [1, 1.35, 1],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute w-36 h-36 rounded-full bg-gradient-to-tr from-[#D4AF37]/30 via-rose-300/20 to-[#D4AF37]/30 blur-xl pointer-events-none"
          />
          <motion.div
            animate={{
              rotate: [0, 360],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            className="absolute w-32 h-32 rounded-full border border-dashed border-[#D4AF37]/40 pointer-events-none"
          />

          {/* Central Logo Emblem */}
          <motion.div
            initial={{ scale: 0.4, opacity: 0, filter: 'blur(12px)' }}
            animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.1, type: 'spring', stiffness: 140, damping: 14, delay: 0.15 }}
            className="relative w-28 h-28 rounded-full bg-gradient-to-tr from-[#D4AF37] via-[#FFF9E6] to-[#D4AF37] p-[2px] shadow-[0_0_45px_rgba(212,175,55,0.6)] flex items-center justify-center"
          >
            <div className="w-full h-full rounded-full bg-[#1A1814]/90 backdrop-blur-md flex flex-col items-center justify-center shadow-inner relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
              <span className="text-3xl sm:text-4xl font-serif font-black bg-gradient-to-r from-[#D4AF37] via-[#FFFDF7] to-[#D4AF37] bg-clip-text text-transparent tracking-tighter">
                T&amp;C
              </span>
              <span className="text-[8px] uppercase tracking-[0.3em] text-[#D4AF37]/90 font-semibold mt-0.5">
                2026
              </span>
            </div>
          </motion.div>
        </div>

        {/* Floating Minimal Luxury Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="inline-flex items-center gap-2.5 px-5 py-1.5 rounded-full bg-white/20 dark:bg-black/30 backdrop-blur-md border border-white/50 text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] text-[#2D2D2D] dark:text-white mb-6 shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />
          <span>The Royal Wedding Celebration</span>
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />
        </motion.div>

        {/* Display Text: "T&C Guest List" (Hero Title) */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.88, filter: 'blur(8px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ delay: 0.45, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl sm:text-6xl font-serif font-extrabold text-[#2D2D2D] dark:text-white leading-tight mb-4 tracking-tight drop-shadow-md"
        >
          <span className="bg-gradient-to-r from-[#D4AF37] via-[#FFF3D1] via-[#C5A059] to-[#D4AF37] bg-clip-text text-transparent drop-shadow-[0_2px_15px_rgba(212,175,55,0.4)]">
            T&amp;C Guest List
          </span>
        </motion.h1>

        {/* Romantic Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-xs sm:text-sm text-[#2D2D2D]/80 dark:text-white/80 max-w-sm mx-auto leading-relaxed mb-8 font-light tracking-wide"
        >
          Tafadzwa <span className="inline-block animate-bounce mx-1 text-rose-500">❤️</span> Chengeto
          <span className="block mt-1 text-[11px] uppercase tracking-[0.2em] opacity-75 font-medium">
            Confirmed Attendees Directory
          </span>
        </motion.p>

        {/* Enter Button + Countdown Subtext */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.5 }}
          className="flex flex-col items-center gap-3 pt-2"
        >
          <button
            onClick={handleManualDismiss}
            className="group relative px-10 py-4 bg-gradient-to-r from-[#2D2D2D] via-[#1A1814] to-[#2D2D2D] hover:from-black hover:to-black text-white rounded-full text-xs sm:text-sm uppercase tracking-[0.25em] font-bold shadow-xl transition-all cursor-pointer inline-flex items-center justify-center gap-3 border border-[#D4AF37]/60 hover:scale-105 active:scale-95 overflow-hidden"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
            <Sparkles className="w-4 h-4 text-[#D4AF37] group-hover:rotate-180 transition-transform duration-500" />
            <span>Enter Directory</span>
          </button>
          
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#2D2D2D]/60 dark:text-white/60 font-medium">
            Entering automatically in <span className="font-bold text-[#D4AF37]">{timeLeft}</span>s
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};


