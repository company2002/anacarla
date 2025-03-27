
import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface CanvasProps {
  brushColor: string;
  brushSize: number;
  toolType: 'brush' | 'eraser';
}

const Canvas: React.FC<CanvasProps> = ({ brushColor, brushSize, toolType }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize Fabric.js canvas
    const canvas = new fabric.Canvas(canvasRef.current, {
      isDrawingMode: true,
      width: window.innerWidth - 40,
      height: window.innerHeight - 160,
      backgroundColor: '#ffffff',
    });

    fabricCanvasRef.current = canvas;

    // Create drawing brush
    const drawingBrush = new fabric.PencilBrush(canvas);
    drawingBrush.color = brushColor;
    drawingBrush.width = brushSize;
    canvas.freeDrawingBrush = drawingBrush;

    // Handle window resize
    const handleResize = () => {
      const ratio = canvas.getZoom();
      canvas.setDimensions({
        width: window.innerWidth - 40,
        height: window.innerHeight - 160,
      });
      canvas.setZoom(ratio);
    };

    window.addEventListener('resize', handleResize);

    // Path created event
    canvas.on('path:created', () => {
      setIsDrawing(false);
    });

    // Mouse events
    canvas.on('mouse:down', () => {
      setIsDrawing(true);
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.dispose();
    };
  }, []);

  // Update brush color
  useEffect(() => {
    if (!fabricCanvasRef.current) return;
    const canvas = fabricCanvasRef.current;
    
    if (toolType === 'brush') {
      canvas.freeDrawingBrush.color = brushColor;
    } else if (toolType === 'eraser') {
      canvas.freeDrawingBrush.color = '#ffffff'; // White for eraser
    }
  }, [brushColor, toolType]);

  // Update brush size
  useEffect(() => {
    if (!fabricCanvasRef.current) return;
    fabricCanvasRef.current.freeDrawingBrush.width = brushSize;
  }, [brushSize]);

  const clearCanvas = () => {
    if (!fabricCanvasRef.current) return;
    fabricCanvasRef.current.clear();
    fabricCanvasRef.current.backgroundColor = '#ffffff';
    fabricCanvasRef.current.renderAll();
    toast('Quadro limpo', {
      description: 'Seu desenho foi apagado. Hora de criar algo novo!',
      icon: '🧹',
    });
  };

  const saveCanvas = () => {
    if (!fabricCanvasRef.current) return;
    
    const dataURL = fabricCanvasRef.current.toDataURL({
      format: 'png',
      quality: 1,
    });
    
    const link = document.createElement('a');
    link.download = `meu-desenho-${new Date().toISOString().slice(0, 10)}.png`;
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast('Desenho salvo!', {
      description: 'Seu desenho foi salvo como uma imagem.',
      icon: '🎨',
    });
  };

  return (
    <div className="relative">
      <div 
        className={cn(
          "rounded-3xl shadow-lg overflow-hidden transition-all duration-300 border-8",
          isDrawing ? "border-primary shadow-2xl" : "border-[#FFD700] shadow-xl"
        )}
        style={{
          backgroundImage: "repeating-linear-gradient(45deg, #FFD700 0, #FFD700 10px, #FFC400 10px, #FFC400 20px)",
          padding: "5px",
        }}
      >
        <div className="rounded-2xl overflow-hidden bg-white">
          <canvas ref={canvasRef} />
        </div>
      </div>
      
      <div className="absolute bottom-6 right-6 flex space-x-4">
        <button 
          className="px-6 py-3 bg-gradient-to-r from-red-400 to-pink-500 text-white rounded-xl shadow-md text-base font-bold hover:shadow-lg transition-all hover:-translate-y-1 active:translate-y-0 wiggle"
          onClick={clearCanvas}
        >
          Limpar 🧹
        </button>
        <button 
          className="px-6 py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-xl shadow-md text-base font-bold hover:shadow-lg transition-all hover:-translate-y-1 active:translate-y-0"
          onClick={saveCanvas}
        >
          Salvar 💾
        </button>
      </div>
    </div>
  );
};

export default Canvas;
