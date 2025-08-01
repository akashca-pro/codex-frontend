import React, { useState, useEffect } from 'react';

interface LaptopLoaderProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const LaptopLoader: React.FC<LaptopLoaderProps> = ({ 
  className = '', 
  size = 'md' 
}) => {
  const [currentText, setCurrentText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  
  const loadingTexts = [
    'Initializing...',
    'Loading modules...',
    'Compiling code...',
    'Running tests...',
    'Almost ready...'
  ];

  const sizeClasses = {
    sm: 'w-24 h-16',
    md: 'w-32 h-20', 
    lg: 'w-40 h-24'
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % loadingTexts.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const text = loadingTexts[textIndex];
    let charIndex = 0;
    setCurrentText('');
    
    const typeInterval = setInterval(() => {
      setCurrentText(text.slice(0, charIndex + 1));
      charIndex++;
      
      if (charIndex >= text.length) {
        clearInterval(typeInterval);
      }
    }, 100);

    return () => clearInterval(typeInterval);
  }, [textIndex]);

  return (
    <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
      {/* Laptop SVG */}
      <div className={`${sizeClasses[size]} animate-pulse-glow relative`}>
        <svg
          viewBox="0 0 120 80"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Laptop Base */}
          <path
            d="M10 65 L110 65 L115 75 L5 75 Z"
            fill="hsl(var(--muted))"
            stroke="hsl(var(--border))"
            strokeWidth="1"
          />
          
          {/* Laptop Screen Bezel */}
          <rect
            x="20"
            y="10"
            width="80"
            height="55"
            rx="4"
            fill="hsl(var(--card))"
            stroke="hsl(var(--border))"
            strokeWidth="1"
          />
          
          {/* Screen */}
          <rect
            x="25"
            y="15"
            width="70"
            height="45"
            rx="2"
            fill="hsl(var(--background))"
            className="animate-pulse-glow"
          />
          
          {/* Code Lines */}
          <g className="animate-slide-up">
            {/* Line 1 */}
            <rect x="30" y="20" width="15" height="2" fill="hsl(var(--code-primary))" />
            <rect x="48" y="20" width="25" height="2" fill="hsl(var(--code-secondary))" />
            
            {/* Line 2 */}
            <rect x="30" y="25" width="8" height="2" fill="hsl(var(--code-accent))" />
            <rect x="41" y="25" width="30" height="2" fill="hsl(var(--muted-foreground))" />
            
            {/* Line 3 */}
            <rect x="30" y="30" width="20" height="2" fill="hsl(var(--code-primary))" />
            <rect x="53" y="30" width="15" height="2" fill="hsl(var(--code-secondary))" />
            
            {/* Line 4 */}
            <rect x="30" y="35" width="12" height="2" fill="hsl(var(--code-accent))" />
            <rect x="45" y="35" width="35" height="2" fill="hsl(var(--muted-foreground))" />
            
            {/* Line 5 */}
            <rect x="30" y="40" width="25" height="2" fill="hsl(var(--code-primary))" />
            <rect x="58" y="40" width="10" height="2" fill="hsl(var(--code-secondary))" />
          </g>
          
          {/* Blinking Cursor */}
          <rect 
            x="72" 
            y="45" 
            width="2" 
            height="8" 
            fill="hsl(var(--laptop-glow))"
            className="animate-blink"
          />
          
          {/* Keyboard */}
          <rect
            x="30"
            y="67"
            width="60"
            height="8"
            rx="1"
            fill="hsl(var(--muted))"
            stroke="hsl(var(--border))"
            strokeWidth="0.5"
          />
          
          {/* Trackpad */}
          <rect
            x="52"
            y="77"
            width="16"
            height="10"
            rx="2"
            fill="hsl(var(--muted))"
            stroke="hsl(var(--border))"
            strokeWidth="0.5"
          />
          
          {/* Power Indicator */}
          <circle
            cx="105"
            cy="12"
            r="1.5"
            fill="hsl(var(--laptop-glow))"
            className="animate-pulse"
          />
        </svg>
      </div>
      
      {/* Loading Text */}
      <div className="flex items-center space-x-1 h-6">
        <span className="text-sm font-mono text-foreground min-w-0">
          {currentText}
        </span>
        <span className="text-laptop-glow animate-blink font-mono">|</span>
      </div>
      
      {/* Progress Dots */}
      <div className="flex space-x-1">
        {[0, 1, 2].map((dot) => (
          <div
            key={dot}
            className="w-2 h-2 rounded-full bg-laptop-glow animate-pulse"
            style={{
              animationDelay: `${dot * 0.2}s`,
              animationDuration: '1.5s'
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default LaptopLoader;