
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Palette, PaintBucket } from 'lucide-react';
import ToolButton from './ToolButton';
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

interface ColorPaletteProps {
  currentColor: string;
  onColorChange: (color: string) => void;
}

// Cores mais vibrantes e divertidas para crianças
const COLORS = [
  '#FF0000', // Vermelho
  '#FF4D00', // Laranja
  '#FFD700', // Amarelo dourado
  '#7FFF00', // Verde-limão
  '#00FF00', // Verde
  '#00FFFF', // Ciano
  '#0000FF', // Azul
  '#8A2BE2', // Azul-violeta
  '#FF00FF', // Magenta
  '#FF1493', // Rosa profundo
  '#800080', // Roxo
  '#A52A2A', // Marrom
  '#000000', // Preto
  '#FFFFFF', // Branco
];

const ColorPalette: React.FC<ColorPaletteProps> = ({ currentColor, onColorChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customColor, setCustomColor] = useState(currentColor);
  const [mixerOpen, setMixerOpen] = useState(false);
  const [color1, setColor1] = useState('#FF0000');
  const [color2, setColor2] = useState('#0000FF');
  const [mixedColor, setMixedColor] = useState('#800080');

  useEffect(() => {
    setCustomColor(currentColor);
  }, [currentColor]);

  const handleTogglePalette = () => {
    setIsOpen(!isOpen);
    setMixerOpen(false);
  };

  const handleColorSelect = (color: string) => {
    onColorChange(color);
    setCustomColor(color);
  };

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setCustomColor(newColor);
    onColorChange(newColor);
  };

  const toggleMixer = () => {
    setMixerOpen(!mixerOpen);
  };

  const selectColorForMixing = (color: string, position: 1 | 2) => {
    if (position === 1) {
      setColor1(color);
    } else {
      setColor2(color);
    }
    
    // Mix the colors when either one changes
    mixColors(position === 1 ? color : color1, position === 2 ? color : color2);
  };

  const mixColors = (colorA: string, colorB: string) => {
    // Parse hex colors to RGB
    const r1 = parseInt(colorA.substring(1, 3), 16);
    const g1 = parseInt(colorA.substring(3, 5), 16);
    const b1 = parseInt(colorA.substring(5, 7), 16);
    
    const r2 = parseInt(colorB.substring(1, 3), 16);
    const g2 = parseInt(colorB.substring(3, 5), 16);
    const b2 = parseInt(colorB.substring(5, 7), 16);
    
    // Simple averaging for mixing (could be made more sophisticated)
    const rMix = Math.round((r1 + r2) / 2);
    const gMix = Math.round((g1 + g2) / 2);
    const bMix = Math.round((b1 + b2) / 2);
    
    // Convert back to hex
    const mixedHex = `#${rMix.toString(16).padStart(2, '0')}${gMix.toString(16).padStart(2, '0')}${bMix.toString(16).padStart(2, '0')}`;
    setMixedColor(mixedHex);
  };

  const useMixedColor = () => {
    handleColorSelect(mixedColor);
  };

  return (
    <div className="relative">
      <ToolButton
        icon={Palette}
        label="Paleta de Cores"
        className="relative overflow-hidden"
        onClick={handleTogglePalette}
      >
        <span
          className="absolute inset-0 m-auto w-6 h-6 rounded-full border-2 border-white shadow-inner"
          style={{ backgroundColor: currentColor }}
        />
      </ToolButton>

      {isOpen && (
        <div 
          className="absolute top-16 right-0 md:left-0 bg-white/95 backdrop-blur-md rounded-2xl p-4 w-64 z-50 border-4 border-yellow-300 shadow-xl bounce-in max-h-[80vh] overflow-y-auto"
          onMouseLeave={() => {
            if (!mixerOpen) setIsOpen(false);
          }}
        >
          <h3 className="text-center font-bold text-purple-600 mb-2">Cores Mágicas</h3>
          <div className="grid grid-cols-7 gap-2 mb-3">
            {COLORS.map((color) => (
              <button
                key={color}
                className={cn(
                  "w-8 h-8 rounded-full transition-all duration-200 hover:scale-125 transform",
                  color === currentColor ? "ring-4 ring-blue-400 ring-offset-2" : "",
                  color === "#FFFFFF" ? "border-2 border-gray-300" : ""
                )}
                style={{ backgroundColor: color }}
                onClick={() => handleColorSelect(color)}
                aria-label={`Selecionar cor ${color}`}
              />
            ))}
          </div>
          
          <div className="flex flex-col items-center space-y-2 bg-blue-50 p-3 rounded-xl mb-3">
            <label htmlFor="custom-color" className="text-sm font-medium text-purple-700">Criar Cor Especial:</label>
            <div className="flex items-center space-x-2 w-full">
              <input
                id="custom-color"
                type="color"
                value={customColor}
                onChange={handleCustomColorChange}
                className="w-10 h-10 p-0 border-none bg-transparent cursor-pointer rounded-full"
              />
              <div 
                className="w-10 h-10 rounded-full border-2 border-white shadow-md" 
                style={{ backgroundColor: customColor }}
              ></div>
              <span className="text-xs font-mono bg-white px-2 py-1 rounded-md flex-grow text-center">{customColor}</span>
            </div>
          </div>

          <div className="mt-2">
            <Popover>
              <PopoverTrigger asChild>
                <button 
                  className="flex items-center justify-center w-full py-2 px-3 bg-gradient-to-r from-pink-400 to-purple-500 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 active:translate-y-0"
                >
                  <PaintBucket className="w-5 h-5 mr-2" />
                  Misturar Cores
                </button>
              </PopoverTrigger>
              <PopoverContent className="p-4 bg-gradient-to-br from-yellow-100 to-purple-100 rounded-xl border-2 border-purple-200 w-72">
                <h4 className="text-center font-bold text-pink-600 mb-3">Misturador Mágico</h4>
                
                <div className="flex justify-between items-center mb-3">
                  <div className="text-center">
                    <div 
                      className="w-12 h-12 rounded-full mx-auto border-4 border-yellow-300 shadow-inner cursor-pointer"
                      style={{ backgroundColor: color1 }}
                    ></div>
                    <span className="text-xs font-medium mt-1 block">Cor 1</span>
                  </div>
                  
                  <div className="text-2xl font-bold text-purple-500">+</div>
                  
                  <div className="text-center">
                    <div 
                      className="w-12 h-12 rounded-full mx-auto border-4 border-yellow-300 shadow-inner cursor-pointer"
                      style={{ backgroundColor: color2 }}
                    ></div>
                    <span className="text-xs font-medium mt-1 block">Cor 2</span>
                  </div>
                  
                  <div className="text-2xl font-bold text-purple-500">=</div>
                  
                  <div className="text-center">
                    <div 
                      className="w-12 h-12 rounded-full mx-auto border-4 border-pink-300 shadow-inner cursor-pointer animate-pulse"
                      style={{ backgroundColor: mixedColor }}
                      onClick={useMixedColor}
                    ></div>
                    <span className="text-xs font-medium mt-1 block">Mistura</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-5 gap-1 mt-3">
                  {COLORS.slice(0, 10).map((color) => (
                    <button
                      key={`mix1-${color}`}
                      className={cn(
                        "w-8 h-8 rounded-full transition-transform hover:scale-110",
                        color === color1 ? "ring-2 ring-yellow-400" : ""
                      )}
                      style={{ backgroundColor: color }}
                      onClick={() => selectColorForMixing(color, 1)}
                      aria-label={`Selecionar cor 1: ${color}`}
                    />
                  ))}
                </div>
                
                <div className="grid grid-cols-5 gap-1 mt-2">
                  {COLORS.slice(0, 10).map((color) => (
                    <button
                      key={`mix2-${color}`}
                      className={cn(
                        "w-8 h-8 rounded-full transition-transform hover:scale-110",
                        color === color2 ? "ring-2 ring-yellow-400" : ""
                      )}
                      style={{ backgroundColor: color }}
                      onClick={() => selectColorForMixing(color, 2)}
                      aria-label={`Selecionar cor 2: ${color}`}
                    />
                  ))}
                </div>
                
                <button 
                  onClick={useMixedColor}
                  className="w-full mt-3 py-2 bg-gradient-to-r from-purple-400 to-pink-500 text-white rounded-lg font-bold shadow-md hover:shadow-lg transition-all"
                >
                  Usar Cor Misturada
                </button>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPalette;
