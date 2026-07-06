/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { Guest, GuestSide, ViewState } from './types';
import { INITIAL_GUESTS } from './data';
import { Header } from './components/Header';
import { HomeDashboard } from './components/HomeDashboard';
import { FamilyListPage } from './components/FamilyListPage';
import { AddGuestModal } from './components/AddGuestModal';
import { EditGuestModal } from './components/EditGuestModal';
import { SplashScreen } from './components/SplashScreen';
import { Heart, Sparkles } from 'lucide-react';

const STORAGE_KEY = 'tafadzwa_chengeto_wedding_guests_v1';

export default function App() {
  // 1. Local Storage State Initialization
  const [guests, setGuests] = useState<Guest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (err) {
      console.error('Failed to load guests from localStorage:', err);
    }
    return INITIAL_GUESTS;
  });

  // 2. Navigation & Modal States
  const [showSplash, setShowSplash] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('hasSeenSplash_v2') !== 'true';
    } catch {
      return true;
    }
  });
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [highlightedGuestId, setHighlightedGuestId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addModalDefaultSide, setAddModalDefaultSide] = useState<GuestSide>('groom');
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Save to localStorage whenever guests change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(guests));
    } catch (err) {
      console.error('Failed to save guests to localStorage:', err);
    }
  }, [guests]);

  // Show temporary notification toast
  const showToast = (message: string) => {
    setNotification(message);
    const timer = setTimeout(() => {
      setNotification(null);
    }, 3500);
    return () => clearTimeout(timer);
  };

  // Add Guest Handler
  const handleAddGuest = (name: string, side: GuestSide) => {
    const newGuest: Guest = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 6),
      name,
      side,
      createdAt: Date.now(),
    };
    setGuests(prev => [newGuest, ...prev]);
    showToast(`Added "${name}" to ${side === 'groom' ? "Tafadzwa's (Groom)" : "Chengeto's (Bride)"} list!`);
  };

  // One-Click Delete Handler
  const handleDeleteGuest = (id: string, name: string) => {
    setGuests(prev => prev.filter(g => g.id !== id));
    showToast(`Deleted "${name}" from guest list`);
  };

  // Update Guest Handler
  const handleUpdateGuest = (id: string, newName: string, newSide: GuestSide) => {
    setGuests(prev => prev.map(g => {
      if (g.id === id) {
        return { ...g, name: newName, side: newSide };
      }
      return g;
    }));
    showToast(`Updated "${newName}" successfully`);
  };

  // Instant Search Result Selection Handler
  const handleSelectGuestFromSearch = (guest: Guest) => {
    setCurrentView(guest.side);
    setHighlightedGuestId(guest.id);
    showToast(`Found "${guest.name}" on ${guest.side === 'groom' ? "Groom's Side" : "Bride's Side"}`);
    
    // Clear highlight pulse after 5 seconds
    setTimeout(() => {
      setHighlightedGuestId(null);
    }, 5000);
  };

  // Reset Data to Initial Sample List
  const handleResetData = () => {
    if (window.confirm('Reset guest list back to the default sample guests for Tafadzwa and Chengeto?')) {
      setGuests(INITIAL_GUESTS);
      showToast('Reset guest list to default samples!');
    }
  };

  // Open Add Modal Helper
  const handleOpenAddModal = (defaultSide?: GuestSide) => {
    if (defaultSide) {
      setAddModalDefaultSide(defaultSide);
    } else if (currentView === 'groom' || currentView === 'bride') {
      setAddModalDefaultSide(currentView);
    } else {
      setAddModalDefaultSide('groom');
    }
    setIsAddModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#2D2D2D] flex flex-col selection:bg-[#F4F1EA] selection:text-[#C5A059] font-sans">
      {/* Top Header with Title and Global Instant Search */}
      <Header
        guests={guests}
        onSelectGuestFromSearch={handleSelectGuestFromSearch}
        currentView={currentView}
        onNavigateHome={() => {
          setCurrentView('home');
          setHighlightedGuestId(null);
        }}
      />

      {/* Main Single-View Layout Container */}
      <main className="flex-1 pb-16">
        {currentView === 'home' && (
          <HomeDashboard
            guests={guests}
            onSelectSide={(side) => setCurrentView(side)}
            onOpenAddModal={handleOpenAddModal}
            onResetData={handleResetData}
            onSelectGuestFromSearch={handleSelectGuestFromSearch}
          />
        )}

        {(currentView === 'groom' || currentView === 'bride') && (
          <FamilyListPage
            side={currentView}
            guests={guests}
            onNavigateHome={() => {
              setCurrentView('home');
              setHighlightedGuestId(null);
            }}
            onSwitchSide={(side) => {
              setCurrentView(side);
              setHighlightedGuestId(null);
            }}
            onOpenAddModal={handleOpenAddModal}
            onOpenEditModal={(guest) => setEditingGuest(guest)}
            onDeleteGuest={handleDeleteGuest}
            highlightedGuestId={highlightedGuestId}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-8 py-8 px-6 border-t gold-border bg-[#FDFCFB] text-center">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] sm:text-xs uppercase tracking-[0.2em] opacity-80">
          <p className="opacity-70">&copy; 2026 Tafadzwa & Chengeto Wedding Committee</p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <button
              onClick={() => setShowSplash(true)}
              className="gold-text hover:underline font-bold flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>✨ Replay Welcome Splash</span>
            </button>
            <p className="opacity-70">Total Guests: {guests.length}</p>
          </div>
        </div>
      </footer>

      {/* Opening Splash Screen Modal */}
      <AnimatePresence>
        {showSplash && (
          <SplashScreen
            onDismiss={() => {
              try {
                sessionStorage.setItem('hasSeenSplash_v2', 'true');
              } catch (e) {}
              setShowSplash(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* Add Guest Modal */}
      <AddGuestModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddGuest={handleAddGuest}
        initialSide={addModalDefaultSide}
      />

      {/* Edit Guest Modal */}
      <EditGuestModal
        guest={editingGuest}
        isOpen={editingGuest !== null}
        onClose={() => setEditingGuest(null)}
        onUpdateGuest={handleUpdateGuest}
      />

      {/* Notification Toast */}
      {notification && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-bottom-5 fade-in duration-200">
          <div className="bg-[#2D2D2D] text-white px-6 py-3.5 rounded-full shadow-xl border gold-border flex items-center gap-3 text-xs uppercase tracking-widest font-bold">
            <Sparkles className="w-4 h-4 gold-text shrink-0" />
            <span>{notification}</span>
          </div>
        </div>
      )}
    </div>
  );
}

