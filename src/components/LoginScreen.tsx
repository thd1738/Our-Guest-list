import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Unlock, Sparkles, Heart, Key, AlertCircle, Eye, EyeOff } from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Generate subtle glowing ambient particles
  const particles = Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    duration: Math.random() * 5 + 3,
    delay: Math.random() * 2,
    isRose: i % 3 === 0,
    isGold: i % 2 === 0,
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSuccess) return;

    if (password.trim() === '290826') {
      setError(false);
      setIsSuccess(true);
      // Smooth fade + zoom transition into main splash screen
      setTimeout(() => {
        onLoginSuccess();
      }, 700);
    } else {
      setError(true);
      setErrorMessage('Incorrect password, try again');
      setIsShaking(true);
      setTimeout(() => {
        setIsShaking(false);
      }, 500);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isSuccess ? 0 : 1 }}
      exit={{ opacity: 0, scale: 1.15, filter: 'blur(12px)' }}
      transition={{ duration: 0.7, ease: 'easeInOut' }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-gradient-to-br from-[#121212] via-[#1A1816] to-[#1E1719] p-4 sm:p-6 overflow-hidden select-none font-sans"
    >
      {/* Floating Glowing Wedding Particles */}
      {particles.map((p) => (
        <motion.span
          key={p.id}
          initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
          animate={{
            opacity: [0.2, 0.7, 0.2],
            scale: [0.8, 1.3, 0.8],
            y: [0, -35, 0],
            x: [0, (p.id % 2 === 0 ? 15 : -15), 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeInOut',
          }}
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            left: p.left,
            top: p.top,
          }}
          className={`absolute rounded-full pointer-events-none ${
            p.isRose
              ? 'bg-[#F472B6] shadow-[0_0_12px_#F472B6]'
              : p.isGold
              ? 'bg-[#D4AF37] shadow-[0_0_14px_#D4AF37]'
              : 'bg-white shadow-[0_0_10px_white]'
          }`}
        />
      ))}

      {/* Radial Soft Gold Background Glow */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#D4AF37]/15 via-[#F472B6]/10 to-transparent blur-[100px] pointer-events-none animate-pulse duration-1000" />

      {/* Main Luxury Login Card */}
      <motion.div
        initial={{ y: 25, opacity: 0, scale: 0.95 }}
        animate={
          isSuccess
            ? { scale: 1.1, opacity: 0, y: -10, filter: 'blur(8px)' }
            : { y: 0, opacity: 1, scale: 1 }
        }
        transition={{ duration: 0.6, type: 'spring', stiffness: 200, damping: 25 }}
        className="relative w-full max-w-md rounded-3xl bg-[#FFFDF9]/95 backdrop-blur-2xl p-8 sm:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.5)] border-2 border-[#D4AF37]/60 text-center overflow-hidden"
      >
        {/* Subtle top gold sheen */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-80" />

        {/* Header Icons & Embellishment */}
        <div className="flex items-center justify-center gap-3 mb-5">
          <motion.div
            animate={{ rotate: [0, -8, 8, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#F9F6F0] to-[#FFFDF9] border border-[#D4AF37]/50 flex items-center justify-center shadow-md gold-text"
          >
            {isSuccess ? <Unlock className="w-6 h-6 text-emerald-600 animate-bounce" /> : <Lock className="w-6 h-6 gold-text" />}
          </motion.div>
        </div>

        {/* Title */}
        <div className="space-y-1.5 mb-8">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-[#D4AF37] animate-pulse" />
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#D4AF37]">
              Protected Wedding Portal
            </span>
            <Sparkles className="w-4 h-4 text-[#D4AF37] animate-pulse" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-extrabold text-[#2D2D2D] tracking-tight">
            T&C Guest List Login
          </h1>
          <p className="text-xs text-[#2D2D2D]/70 font-medium tracking-wide">
            Royal Wedding Celebration &bull; Tafadzwa <Heart className="inline w-3 h-3 text-rose-500 fill-rose-500 mx-0.5" /> Chengeto
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2 text-left">
            <label className="block text-xs uppercase tracking-widest font-bold text-[#2D2D2D]/80 text-center">
              Enter Guest List Password
            </label>

            {/* Shake Wrapper for Input */}
            <motion.div
              animate={isShaking ? { x: [-12, 12, -10, 10, -5, 5, 0] } : { x: 0 }}
              transition={{ duration: 0.4 }}
              className="relative"
            >
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#D4AF37]">
                <Key className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(false);
                }}
                placeholder="• • • • • •"
                maxLength={20}
                autoFocus
                className={`w-full pl-11 pr-11 py-4 text-center text-lg font-mono font-bold tracking-[0.3em] rounded-2xl bg-[#F9F6F0] border-2 transition-all focus:outline-none shadow-inner text-[#2D2D2D] placeholder-gray-400 ${
                  error
                    ? 'border-rose-500 bg-rose-50/50 text-rose-700 ring-2 ring-rose-200'
                    : 'border-[#D4AF37]/60 focus:border-[#D4AF37] focus:bg-white focus:ring-4 focus:ring-[#D4AF37]/20'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-[#2D2D2D] transition-colors cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </motion.div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="flex items-center justify-center gap-1.5 text-xs text-rose-600 font-bold pt-1"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 animate-bounce" />
                  <span>{errorMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Submit Button with Glow & Press Effects */}
          <motion.button
            type="submit"
            disabled={isSuccess}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            className={`w-full py-4 px-6 rounded-2xl font-bold uppercase tracking-[0.15em] text-xs transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer ${
              isSuccess
                ? 'bg-emerald-600 text-white shadow-[0_0_30px_rgba(16,185,129,0.5)]'
                : 'bg-gradient-to-r from-[#2D2D2D] via-black to-[#2D2D2D] hover:from-[#D4AF37] hover:to-[#B38F27] text-white shadow-[0_10px_25px_rgba(0,0,0,0.3)] hover:shadow-[0_0_25px_rgba(212,175,55,0.6)]'
            }`}
          >
            {isSuccess ? (
              <>
                <span>Access Granted...</span>
                <Sparkles className="w-4 h-4 animate-spin" />
              </>
            ) : (
              <>
                <span>Unlock Guest List ✨</span>
              </>
            )}
          </motion.button>
        </form>

        {/* Footer Note */}
        <div className="mt-8 pt-5 border-t border-[#D4AF37]/20 flex items-center justify-center gap-2 text-[11px] text-[#2D2D2D]/60 font-serif italic">
          <span>Official Wedding Directory &bull; 2026</span>
        </div>
      </motion.div>
    </motion.div>
  );
};
