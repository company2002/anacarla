
import React, { useState, useEffect } from 'react';
import Canvas from '@/components/Canvas';
import ColorPalette from '@/components/ColorPalette';
import BrushControls from '@/components/BrushControls';
import Calculator from '@/components/Calculator';
import ToolButton from '@/components/ToolButton';
import { Brush, Calculator as CalculatorIcon, Eraser } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const [brushColor, setBrushColor] = useState('#FF4D00'); // Cor laranja como padrão
  const [brushSize, setBrushSize] = useState(5);
  const [toolType, setToolType] = useState<'brush' | 'eraser'>('brush');
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const isMobile = useIsMobile();

  const toggleCalculator = () => {
    setCalculatorOpen(!calculatorOpen);
  };

  // Add keyboard shortcut for calculator (press 'c' to toggle)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'c') {
        toggleCalculator();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [calculatorOpen]);

  return (
    <div className="h-screen w-screen overflow-hidden p-3 md:p-5 flex flex-col">
      {/* Header com título e dica */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500">
          Quadro de Desenho Mágico
        </h1>
        <div className="hidden md:flex text-sm text-gray-600 items-center">
          <span className="opacity-80">Pressione </span>
          <span className="inline-flex items-center justify-center bg-white border-2 border-blue-300 rounded-md px-2 py-1 text-xs font-medium mx-1 shadow-sm">
            C
          </span>
          <span className="opacity-80"> para abrir a calculadora</span>
        </div>
      </div>
      
      {/* Barra de ferramentas */}
      <div className="bg-gradient-to-r from-blue-400 to-purple-400 rounded-full p-2 flex items-center space-x-3 shadow-xl max-w-fit mx-auto mb-4 animate-fade-in border-2 border-white">
        <ToolButton
          icon={Brush}
          label="Pincel"
          active={toolType === 'brush'}
          onClick={() => setToolType('brush')}
          className="bg-white"
        />
        <ToolButton
          icon={Eraser}
          label="Borracha"
          active={toolType === 'eraser'}
          onClick={() => setToolType('eraser')}
          className="bg-white"
        />
        <div className="h-8 border-r-2 border-white/50 mx-1"></div>
        <BrushControls
          currentSize={brushSize}
          onSizeChange={setBrushSize}
        />
        <ColorPalette 
          currentColor={brushColor}
          onColorChange={setBrushColor}
        />
        <div className={cn("h-8 border-r-2 border-white/50 mx-1", isMobile && "hidden")}></div>
        <ToolButton
          icon={CalculatorIcon}
          label="Calculadora"
          active={calculatorOpen}
          onClick={toggleCalculator}
          className={isMobile ? "hidden" : "bg-white"}
        />
      </div>
      
      {/* Canvas - Takes most of the screen space */}
      <div className="flex-1 min-h-0 animate-fade-in">
        <Canvas
          brushColor={brushColor}
          brushSize={brushSize}
          toolType={toolType}
        />
      </div>
      
      {/* Calculator toggle button (fixed position) */}
      <button
        className={cn(
          "fixed left-5 bottom-5 flex items-center justify-center w-16 h-16 rounded-full shadow-lg z-30 transition-all duration-300 transform hover:scale-110",
          calculatorOpen 
            ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white" 
            : "bg-gradient-to-r from-yellow-400 to-orange-500 text-white"
        )}
        onClick={toggleCalculator}
        aria-label="Abrir calculadora"
      >
        <CalculatorIcon size={24} />
      </button>
      
      {/* Calculator */}
      {calculatorOpen && (
        <Calculator onClose={() => setCalculatorOpen(false)} />
      )}
    </div>
  );
};

export default Index;
