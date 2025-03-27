
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Brush } from 'lucide-react';
import ToolButton from './ToolButton';

interface BrushControlsProps {
  currentSize: number;
  onSizeChange: (size: number) => void;
}

const BRUSH_SIZES = [2, 5, 10, 15, 20];

const BrushControls: React.FC<BrushControlsProps> = ({ currentSize, onSizeChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleBrushMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleSizeSelect = (size: number) => {
    onSizeChange(size);
  };

  return (
    <div className="relative">
      <ToolButton
        icon={Brush}
        label="Tamanho do Pincel"
        onClick={handleToggleBrushMenu}
      />
      
      {isOpen && (
        <div 
          className="absolute top-16 left-0 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl p-4 z-50 shadow-xl border-4 border-blue-300 bounce-in"
          onMouseLeave={() => setIsOpen(false)}
        >
          <h3 className="text-center font-bold text-blue-600 mb-2">Tamanho do Pincel</h3>
          <div className="flex flex-col space-y-3 items-center">
            {BRUSH_SIZES.map((size) => (
              <button
                key={size}
                className={cn(
                  "relative flex items-center justify-center w-full h-12 rounded-xl transition-all duration-200 hover:bg-blue-200/50",
                  size === currentSize ? "bg-blue-200/80 ring-2 ring-primary ring-inset" : "bg-white/50"
                )}
                onClick={() => handleSizeSelect(size)}
                aria-label={`Tamanho do pincel ${size}px`}
              >
                <div
                  className="rounded-full bg-black"
                  style={{
                    width: `${Math.min(size, 20)}px`,
                    height: `${Math.min(size, 20)}px`,
                  }}
                />
                <span className="ml-2 text-blue-800 font-medium">{size}px</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BrushControls;
