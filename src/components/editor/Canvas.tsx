'use client';

import { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Rect, Text, Image as KonvaImage, Transformer } from 'react-konva';
import type Konva from 'konva';
import { CANVAS_WIDTH, CANVAS_HEIGHT, PREVIEW_WIDTH, PREVIEW_HEIGHT } from '@/lib/constants';
import type { CanvasState, CanvasLayer, TextLayer, ImageLayer } from '@/types';

interface CanvasProps {
  canvasState: CanvasState;
  selectedLayerId: string | null;
  onSelectLayer: (id: string | null) => void;
  onUpdateLayer: (id: string, updates: Partial<CanvasLayer>) => void;
  previewMode?: boolean;
}

// Separate component for image layers to properly use hooks
interface ImageLayerComponentProps {
  layer: ImageLayer;
  scale: number;
  previewMode: boolean;
  onSelectLayer: (id: string) => void;
  onUpdateLayer: (id: string, updates: Partial<CanvasLayer>) => void;
  onTransformEnd: (layer: CanvasLayer, node: Konva.Node) => void;
}

const ImageLayerComponent = ({
  layer,
  scale,
  previewMode,
  onSelectLayer,
  onUpdateLayer,
  onTransformEnd,
}: ImageLayerComponentProps) => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    
    // Check if it's a data URL (base64) - these don't need crossOrigin
    const isDataUrl = layer.src.startsWith('data:');
    
    const img = new window.Image();
    
    // Only set crossOrigin for external URLs, not data URLs
    if (!isDataUrl) {
      img.crossOrigin = 'anonymous';
    }
    
    img.onload = () => {
      setImage(img);
      setLoading(false);
      setError(false);
    };
    
    img.onerror = (e) => {
      console.error('Failed to load image:', {
        src: layer.src.substring(0, 100) + '...',
        isDataUrl,
        error: e,
      });
      
      // If it's not a data URL and crossOrigin failed, try without it
      if (!isDataUrl) {
        console.log('Retrying without crossOrigin...');
        const fallbackImg = new window.Image();
        fallbackImg.onload = () => {
          setImage(fallbackImg);
          setLoading(false);
          setError(false);
        };
        fallbackImg.onerror = () => {
          console.error('Fallback also failed. Image cannot be loaded.');
          setError(true);
          setLoading(false);
        };
        fallbackImg.src = layer.src;
      } else {
        setError(true);
        setLoading(false);
      }
    };
    
    img.src = layer.src;
    
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [layer.src]);

  // Show placeholder for failed images
  if (error) {
    return (
      <Rect
        key={layer.id}
        id={layer.id}
        x={layer.x * scale}
        y={layer.y * scale}
        width={layer.width * scale}
        height={layer.height * scale}
        fill="#1a1a1a"
        stroke="#ff4444"
        strokeWidth={2}
        dash={[10, 5]}
      />
    );
  }

  // Show loading state
  if (loading || !image) {
    return (
      <Rect
        key={layer.id}
        id={layer.id}
        x={layer.x * scale}
        y={layer.y * scale}
        width={layer.width * scale}
        height={layer.height * scale}
        fill="#2a2a2a"
        stroke="#666"
        strokeWidth={1}
        opacity={0.5}
      />
    );
  }

  return (
    <KonvaImage
      key={layer.id}
      id={layer.id}
      image={image}
      x={layer.x * scale}
      y={layer.y * scale}
      width={layer.width * scale}
      height={layer.height * scale}
      rotation={layer.rotation}
      opacity={layer.opacity}
      visible={layer.visible}
      draggable={!layer.locked && !previewMode}
      onClick={() => onSelectLayer(layer.id)}
      onTap={() => onSelectLayer(layer.id)}
      onDragEnd={(e) => {
        onUpdateLayer(layer.id, {
          x: e.target.x() / scale,
          y: e.target.y() / scale,
        });
      }}
      onTransformEnd={(e) => onTransformEnd(layer, e.target)}
    />
  );
};

export const Canvas = ({
  canvasState,
  selectedLayerId,
  onSelectLayer,
  onUpdateLayer,
  previewMode = false,
}: CanvasProps) => {
  const stageRef = useRef<Konva.Stage>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const [stageSize, setStageSize] = useState({ 
    width: previewMode ? PREVIEW_WIDTH : PREVIEW_WIDTH, 
    height: previewMode ? PREVIEW_HEIGHT : PREVIEW_HEIGHT 
  });

  // Calculate scale factor for preview
  const scale = stageSize.width / CANVAS_WIDTH;

  // Update transformer when selection changes
  useEffect(() => {
    const transformer = transformerRef.current;
    const stage = stageRef.current;

    if (!transformer || !stage) return;

    if (selectedLayerId) {
      const selectedNode = stage.findOne(`#${selectedLayerId}`);
      if (selectedNode) {
        transformer.nodes([selectedNode]);
        transformer.getLayer()?.batchDraw();
      }
    } else {
      transformer.nodes([]);
      transformer.getLayer()?.batchDraw();
    }
  }, [selectedLayerId]);

  // Handle stage click to deselect
  const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
    if (e.target === stageRef.current) {
      onSelectLayer(null);
    }
  };

  // Handle transform end
  const handleTransformEnd = (layer: CanvasLayer, node: Konva.Node) => {
    onUpdateLayer(layer.id, {
      x: node.x() / scale,
      y: node.y() / scale,
      width: (node.width() * node.scaleX()) / scale,
      height: (node.height() * node.scaleY()) / scale,
      rotation: node.rotation(),
    });

    // Reset scale after applying
    node.scaleX(1);
    node.scaleY(1);
  };

  // Render text layer
  const renderTextLayer = (layer: TextLayer) => (
    <Text
      key={layer.id}
      id={layer.id}
      x={layer.x * scale}
      y={layer.y * scale}
      width={layer.width * scale}
      height={layer.height * scale}
      text={layer.text}
      fontSize={layer.fontSize * scale}
      fontFamily={layer.fontFamily}
      fontStyle={layer.fontStyle}
      fill={layer.fill}
      stroke={layer.stroke}
      strokeWidth={(layer.strokeWidth || 0) * scale}
      align={layer.align}
      verticalAlign={layer.verticalAlign}
      rotation={layer.rotation}
      opacity={layer.opacity}
      visible={layer.visible}
      draggable={!layer.locked && !previewMode}
      onClick={() => onSelectLayer(layer.id)}
      onTap={() => onSelectLayer(layer.id)}
      onDragEnd={(e) => {
        onUpdateLayer(layer.id, {
          x: e.target.x() / scale,
          y: e.target.y() / scale,
        });
      }}
      onTransformEnd={(e) => handleTransformEnd(layer, e.target)}
    />
  );

  // Sort layers by z-index
  const sortedLayers = [...canvasState.layers].sort((a, b) => a.zIndex - b.zIndex);

  return (
    <div className="relative bg-black/40 rounded-xl overflow-hidden border border-white/10 shadow-2xl">
      <Stage
        ref={stageRef}
        width={stageSize.width}
        height={stageSize.height}
        onClick={handleStageClick}
        onTap={handleStageClick}
        style={{ cursor: previewMode ? 'default' : 'crosshair' }}
      >
        <Layer>
          {/* Background */}
          <Rect
            x={0}
            y={0}
            width={stageSize.width}
            height={stageSize.height}
            fill="#0a0a0a"
          />

          {/* Render layers */}
          {sortedLayers.map((layer) => {
            if (layer.type === 'text') return renderTextLayer(layer as TextLayer);
            if (layer.type === 'image') {
              return (
                <ImageLayerComponent
                  key={layer.id}
                  layer={layer as ImageLayer}
                  scale={scale}
                  previewMode={previewMode}
                  onSelectLayer={onSelectLayer}
                  onUpdateLayer={onUpdateLayer}
                  onTransformEnd={handleTransformEnd}
                />
              );
            }
            return null;
          })}

          {/* Transformer for selection */}
          {!previewMode && (
            <Transformer
              ref={transformerRef}
              boundBoxFunc={(oldBox, newBox) => {
                // Limit minimum size
                if (newBox.width < 10 || newBox.height < 10) {
                  return oldBox;
                }
                return newBox;
              }}
              rotateEnabled={true}
              enabledAnchors={[
                'top-left',
                'top-right',
                'bottom-left',
                'bottom-right',
                'middle-left',
                'middle-right',
                'top-center',
                'bottom-center',
              ]}
            />
          )}
        </Layer>
      </Stage>

      {/* Canvas dimensions indicator */}
      <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/50 rounded text-xs text-white/70">
        {CANVAS_WIDTH} × {CANVAS_HEIGHT}
      </div>
    </div>
  );
};
