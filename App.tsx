
import React, { useState, useEffect, useCallback } from 'react';
import Creator from './components/Creator';
import Viewer from './components/Viewer';
import FloatingHearts from './components/FloatingHearts';
import { decodeData } from './utils';
import { AppState, ProposalData } from './types';

// Declare global confetti from script
declare const confetti: any;

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.CREATOR);
  const [proposalData, setProposalData] = useState<ProposalData | null>(null);

  const checkHash = useCallback(() => {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#p=')) {
      const encoded = hash.split('#p=')[1];
      const decoded = decodeData(encoded);
      if (decoded) {
        setProposalData(decoded);
        setAppState(AppState.VIEWER);
        return;
      }
    }
    // If no valid hash and we are not in success state, go back to creator
    if (appState !== AppState.SUCCESS) {
      setAppState(AppState.CREATOR);
      setProposalData(null);
    }
  }, [appState]);

  useEffect(() => {
    // Check hash on initial mount
    checkHash();

    // Listen for hash changes to handle navigation without page reload
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, [checkHash]);

  const handleYes = () => {
    setAppState(AppState.SUCCESS);
    
    // Trigger Multi-colored Confetti
    const duration = 15 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-100 to-pink-50 flex items-center justify-center relative overflow-hidden font-inter">
      <FloatingHearts />

      <main className="z-10 w-full flex justify-center py-12 px-4">
        {appState === AppState.CREATOR && <Creator />}
        
        {appState === AppState.VIEWER && proposalData && (
          <Viewer data={proposalData} onYes={handleYes} />
        )}

        {appState === AppState.SUCCESS && (
          <div className="text-center animate-bounceIn max-w-lg mx-auto bg-white/95 p-10 md:p-16 rounded-[3rem] shadow-2xl border-4 border-rose-400">
            <div className="text-7xl mb-8">💖</div>
            <h1 className="text-5xl font-romantic text-rose-600 mb-6">She said YES!</h1>
            <p className="text-2xl text-gray-700 leading-relaxed font-light mb-8">
              Congratulations! You just made someone very happy. 🌹
            </p>
            <div className="flex flex-col items-center gap-4">
              <span className="inline-block px-8 py-3 bg-rose-500 text-white rounded-full font-bold shadow-lg animate-pulse">
                Forever Starts Now ✨
              </span>
              <button 
                onClick={() => window.location.hash = ''}
                className="text-rose-400 text-sm hover:text-rose-600 transition-colors"
              >
                Create another?
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="fixed bottom-4 left-0 right-0 text-center text-xs text-rose-300 font-medium">
        Spread the love with Valentine's Proposal Maker
      </footer>
    </div>
  );
};

export default App;
