import React, { useRef, useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";

interface HanjaWritingPracticeProps {
  character: string;
  svgPath?: string;
  onComplete?: () => void;
  onClose?: () => void;
}

const HanjaWritingPractice: React.FC<HanjaWritingPracticeProps> = ({
  character,
  svgPath,
  onComplete,
  onClose
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
  const [strokes, setStrokes] = useState<Array<Array<{ x: number, y: number }>>>([]);
  const [currentStroke, setCurrentStroke] = useState<Array<{ x: number, y: number }>>([]);
  const [showGuide, setShowGuide] = useState(true);
  const [guideOpacity, setGuideOpacity] = useState(0.3);
  const [isPracticeMode, setIsPracticeMode] = useState(false);

  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Set canvas size to be responsive
      const updateCanvasSize = () => {
        const container = canvas.parentElement;
        if (container) {
          const width = Math.min(400, container.clientWidth);
          const height = width; // Square canvas
          
          // Set the canvas size in the DOM
          canvas.width = width;
          canvas.height = height;
          
          // Set the drawing surface size
          canvas.style.width = `${width}px`;
          canvas.style.height = `${height}px`;
          
          // Clear and redraw when resizing
          ctx.clearRect(0, 0, width, height);
          drawGuide(ctx);
          redrawStrokes(ctx);
        }
      };
      
      updateCanvasSize();
      window.addEventListener('resize', updateCanvasSize);
      
      // Set line style
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = '#000';
      
      setContext(ctx);
      
      return () => {
        window.removeEventListener('resize', updateCanvasSize);
      };
    }
  }, [canvasRef]);

  // Draw guide character
  useEffect(() => {
    if (context && showGuide) {
      drawGuide(context);
    }
  }, [context, showGuide, guideOpacity]);

  // Draw the guide character
  const drawGuide = (ctx: CanvasRenderingContext2D) => {
    if (!showGuide || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.save();
    
    // Clear canvas and redraw strokes
    ctx.clearRect(0, 0, width, height);
    redrawStrokes(ctx);
    
    ctx.globalAlpha = guideOpacity;
    
    // Draw the character as text if svgPath is not provided
    if (!svgPath) {
      ctx.font = `${width * 0.8}px serif`;
      ctx.fillStyle = '#aaa';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(character, width / 2, height / 2);
    } 
    // Draw SVG path if provided
    else {
      try {
        // Use a path2D object if available for better performance
        const path = new Path2D(svgPath);
        
        // Get the approximate bounding box by testing the path
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = 100;
        tempCanvas.height = 100;
        const tempCtx = tempCanvas.getContext('2d');
        
        if (tempCtx) {
          tempCtx.translate(0, 0);
          tempCtx.scale(1, 1);
          tempCtx.stroke(path);
          
          // Estimate bounds from origin (assuming path is centered around origin)
          const viewBox = { x: 0, y: 0, width: 100, height: 100 };
          
          // Calculate scale to fit canvas
          const padding = 0.1; // 10% padding
          const availableWidth = width * (1 - 2 * padding);
          const availableHeight = height * (1 - 2 * padding);
          
          const scaleX = availableWidth / viewBox.width;
          const scaleY = availableHeight / viewBox.height;
          const scale = Math.min(scaleX, scaleY);
          
          // Center the path
          const translateX = width / 2 - (viewBox.width * scale) / 2;
          const translateY = height / 2 - (viewBox.height * scale) / 2;
          
          // Draw with transformation
          ctx.translate(translateX, translateY);
          ctx.scale(scale, scale);
          
          ctx.strokeStyle = '#aaa';
          ctx.stroke(path);
        }
      } catch (error) {
        console.error("Error drawing SVG path:", error);
        
        // Fallback to character
        ctx.font = `${width * 0.8}px serif`;
        ctx.fillStyle = '#aaa';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(character, width / 2, height / 2);
      }
    }
    
    ctx.restore();
    
    // Reset stroke style for user drawing
    if (ctx) {
      ctx.globalAlpha = 1;
      ctx.strokeStyle = '#000';
    }
  };

  // Redraw all stored strokes
  const redrawStrokes = (ctx: CanvasRenderingContext2D) => {
    ctx.save();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 4;
    
    strokes.forEach(stroke => {
      if (stroke.length > 0) {
        ctx.beginPath();
        ctx.moveTo(stroke[0].x, stroke[0].y);
        
        for (let i = 1; i < stroke.length; i++) {
          ctx.lineTo(stroke[i].x, stroke[i].y);
        }
        
        ctx.stroke();
      }
    });
    
    ctx.restore();
  };

  // Handle mouse/touch events
  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isPracticeMode) return;
    
    setIsDrawing(true);
    
    const { x, y } = getPointerPosition(e);
    setLastPosition({ x, y });
    
    // Start a new stroke
    setCurrentStroke([{ x, y }]);
    
    if (context) {
      context.beginPath();
      context.moveTo(x, y);
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !context || !isPracticeMode) return;
    
    const { x, y } = getPointerPosition(e);
    
    context.beginPath();
    context.moveTo(lastPosition.x, lastPosition.y);
    context.lineTo(x, y);
    context.stroke();
    
    setLastPosition({ x, y });
    setCurrentStroke(prev => [...prev, { x, y }]);
  };

  const endDrawing = () => {
    if (!isDrawing || !isPracticeMode) return;
    
    setIsDrawing(false);
    
    if (currentStroke.length > 0) {
      setStrokes(prev => [...prev, currentStroke]);
      setCurrentStroke([]);
    }
  };

  const getPointerPosition = (e: React.MouseEvent | React.TouchEvent) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    if ('touches' in e) {
      // Touch event
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    } else {
      // Mouse event
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  };

  const clearCanvas = () => {
    if (!context || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    context.clearRect(0, 0, canvas.width, canvas.height);
    setStrokes([]);
    setCurrentStroke([]);
    
    if (showGuide) {
      drawGuide(context);
    }
  };

  const toggleGuide = () => {
    setShowGuide(prev => !prev);
    
    if (!showGuide && context && canvasRef.current) {
      // If we're turning on the guide, draw it
      drawGuide(context);
    } else if (showGuide && context && canvasRef.current) {
      // If we're turning off the guide, clear and redraw only strokes
      const canvas = canvasRef.current;
      context.clearRect(0, 0, canvas.width, canvas.height);
      redrawStrokes(context);
    }
  };

  const startPractice = () => {
    setIsPracticeMode(true);
    clearCanvas();
  };

  const finishPractice = () => {
    setIsPracticeMode(false);
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <div 
      className="flex flex-col items-center p-4 bg-white rounded-lg shadow-lg transition-all duration-300 ease-in-out opacity-100 scale-100"
    >
      <div className="relative w-full max-w-md mb-4">
        <h2 className="text-xl font-semibold text-center mb-2">
          {isPracticeMode ? "필기 연습 중..." : "필기 연습"}
        </h2>
        
        <div className="relative w-full aspect-square bg-stone-50 border border-gray-300 rounded-lg overflow-hidden">
          <canvas
            ref={canvasRef}
            width={400}
            height={400}
            className="touch-none cursor-crosshair"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={endDrawing}
            onMouseLeave={endDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={endDrawing}
          />
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 justify-center mb-4">
        {isPracticeMode ? (
          <>
            <Button 
              variant="outline" 
              onClick={clearCanvas}
              className="text-sm"
            >
              지우기
            </Button>
            <Button 
              variant="outline" 
              onClick={toggleGuide}
              className="text-sm"
            >
              {showGuide ? "가이드 끄기" : "가이드 켜기"}
            </Button>
            <Button 
              onClick={finishPractice}
              className="text-sm bg-blue-600 hover:bg-blue-700"
            >
              연습 완료
            </Button>
          </>
        ) : (
          <>
            <Button 
              onClick={startPractice}
              className="text-sm bg-blue-600 hover:bg-blue-700"
            >
              필기 연습 시작하기
            </Button>
            {onClose && (
              <Button 
                variant="outline" 
                onClick={onClose}
                className="text-sm"
              >
                닫기
              </Button>
            )}
          </>
        )}
      </div>
      
      <div className="text-sm text-gray-600 text-center">
        {isPracticeMode ? "마우스나 터치로 한자를 따라 그려보세요." : "버튼을 클릭하여 필기 연습을 시작하세요."}
      </div>
    </div>
  );
};

export default HanjaWritingPractice; 