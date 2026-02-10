
import React, { useEffect, useState } from 'react';

const FloatingHearts: React.FC = () => {
  const [elements, setElements] = useState<{ id: number; left: string; size: string; duration: string; delay: string; content: string }[]>([]);

  useEffect(() => {
    const items = ['💖', '❤️', '🌸', '✨', '💕', '🌷'];
    const newElements = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * (30 - 15) + 15}px`,
      duration: `${Math.random() * (15 - 8) + 8}s`,
      delay: `${Math.random() * 10}s`,
      content: items[Math.floor(Math.random() * items.length)]
    }));
    setElements(newElements);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      {elements.map((el) => (
        <div
          key={el.id}
          className="floating-element"
          style={{
            left: el.left,
            fontSize: el.size,
            animationDuration: el.duration,
            animationDelay: el.delay,
          }}
        >
          {el.content}
        </div>
      ))}
    </div>
  );
};

export default FloatingHearts;
