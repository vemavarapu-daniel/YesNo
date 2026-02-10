
import React, { useState, useRef, useEffect } from 'react';
import { ProposalData, AppState } from '../types';

interface ViewerProps {
  data: ProposalData;
  onYes: () => void;
}

const Viewer: React.FC<ViewerProps> = ({ data, onYes }) => {
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const [hasMoved, setHasMoved] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const moveNoButton = () => {
    // Generate random position within visible area
    const x = Math.random() * (window.innerWidth - 150) - (window.innerWidth / 2) + 75;
    const y = Math.random() * (window.innerHeight - 100) - (window.innerHeight / 2) + 50;
    
    setNoPos({ x, y });
    setHasMoved(true);
  };

  return (
    <div className="max-w-2xl w-full mx-auto text-center px-4" ref={containerRef}>
      <div className="bg-white/70 backdrop-blur-lg p-8 md:p-12 rounded-[2rem] shadow-2xl border border-white/50 relative">
        <div className="mb-6 inline-block p-4 bg-pink-100 rounded-full animate-bounce">
          <span className="text-4xl">💌</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-romantic text-rose-600 mb-8 leading-tight">
          I have something to ask you...
        </h1>

        <div className="mb-10 text-gray-700 space-y-4">
          <p className="text-xl md:text-2xl font-light italic leading-relaxed">
            "{data.message}"
          </p>
          {data.sender && (
            <p className="text-right font-semibold text-rose-500 text-lg">
              — {data.sender} 💘
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12 relative h-20 sm:h-auto">
          <button
            onClick={onYes}
            className="px-12 py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full font-bold text-xl shadow-xl hover:shadow-rose-300 transform transition-all hover:scale-110 active:scale-95 z-10 w-full sm:w-auto"
          >
            YES! ❤️
          </button>

          <button
            onMouseEnter={moveNoButton}
            onClick={moveNoButton}
            style={hasMoved ? { transform: `translate(${noPos.x}px, ${noPos.y}px)`, position: 'fixed', top: '50%', left: '50%', marginTop: '-25px', marginLeft: '-50px' } : {}}
            className={`px-8 py-3 bg-gray-200 text-gray-600 rounded-full font-semibold transition-all duration-300 ease-out z-20 w-full sm:w-auto ${hasMoved ? 'shadow-xl' : ''}`}
          >
            No 😈
          </button>
        </div>
      </div>
      
      <p className="mt-8 text-rose-400 text-sm animate-pulse">
        {hasMoved ? "Try to catch me! ✨" : "Click YES to see a surprise... 🌹"}
      </p>
    </div>
  );
};

export default Viewer;
