'use client';

import { useState, useCallback } from 'react';
import { CANVAS_WIDTH, CANVAS_HEIGHT, DEFAULT_TEXT_COLORS } from '@/lib/constants';
import { generateLayerId } from '@/lib/utils/id-generator';
import { logger } from '@/lib/utils/logger';
import type { CanvasState, CanvasLayer, TextLayer, ImageLayer, ShapeLayer, ShapeType } from '@/types';

const createDefaultCanvasState = (): CanvasState => ({
  width: CANVAS_WIDTH,
  height: CANVAS_HEIGHT,
  layers: [],
});

export const useCanvasState = (initialState?: CanvasState) => {
  const [canvasState, setCanvasState] = useState<CanvasState>(
    initialState || createDefaultCanvasState()
  );
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  const [history, setHistory] = useState<CanvasState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Get selected layer
  const selectedLayer = canvasState.layers.find((l) => l.id === selectedLayerId) || null;

  // Add to history
  const pushToHistory = useCallback((state: CanvasState) => {
    setHistory((prev) => {
      const newHistory = prev.slice(0, historyIndex + 1);
      return [...newHistory, state];
    });
    setHistoryIndex((prev) => prev + 1);
  }, [historyIndex]);

  // Add layer
  const addLayer = useCallback(
    (type: 'text' | 'image' | ShapeType, data?: Partial<CanvasLayer>) => {
      const id = generateLayerId();
      const baseLayer = {
        id,
        x: CANVAS_WIDTH / 4,
        y: CANVAS_HEIGHT / 4,
        width: 400,
        height: 100,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
        opacity: 1,
        zIndex: canvasState.layers.length,
        visible: true,
        locked: false,
        name: `${type.charAt(0).toUpperCase() + type.slice(1)} ${canvasState.layers.length + 1}`,
        ...data,
      };

      let newLayer: CanvasLayer;

      if (type === 'text') {
        newLayer = {
          ...baseLayer,
          type: 'text',
          text: 'Your Text Here',
          fontSize: 72,
          fontFamily: 'Montserrat',
          fontStyle: 'bold',
          fill: DEFAULT_TEXT_COLORS.FILL,
          stroke: DEFAULT_TEXT_COLORS.STROKE,
          strokeWidth: 4,
          align: 'center',
          verticalAlign: 'middle',
        } as TextLayer;
      } else if (type === 'image') {
        newLayer = {
          ...baseLayer,
          type: 'image',
          src: data && 'src' in data ? (data as ImageLayer).src : '',
          width: 400,
          height: 400,
        } as ImageLayer;
      } else {
        // type is a ShapeType, create a shape layer
        newLayer = {
          ...baseLayer,
          type: 'shape',
          shapeType: type as ShapeType,
          fill: '#8B5CF6',
          stroke: DEFAULT_TEXT_COLORS.STROKE,
          strokeWidth: 2,
          cornerRadius: type === 'rectangle' ? 8 : 0,
        } as ShapeLayer;
      }

      const newState = {
        ...canvasState,
        layers: [...canvasState.layers, newLayer],
      };

      setCanvasState(newState);
      pushToHistory(newState);
      setSelectedLayerId(id);

      return id;
    },
    [canvasState, pushToHistory]
  );

  // Update layer
  const updateLayer = useCallback(
    (id: string, updates: Partial<CanvasLayer>) => {
      setCanvasState((prev) => ({
        ...prev,
        layers: prev.layers.map((layer) =>
          layer.id === id ? ({ ...layer, ...updates } as CanvasLayer) : layer
        ),
      }));
    },
    []
  );

  // Delete layer
  const deleteLayer = useCallback(
    (id: string) => {
      const newState = {
        ...canvasState,
        layers: canvasState.layers.filter((layer) => layer.id !== id),
      };

      setCanvasState(newState);
      pushToHistory(newState);

      if (selectedLayerId === id) {
        setSelectedLayerId(null);
      }
    },
    [canvasState, selectedLayerId, pushToHistory]
  );

  // Move layer (change z-index)
  const moveLayer = useCallback(
    (id: string, direction: 'up' | 'down') => {
      const layerIndex = canvasState.layers.findIndex((l) => l.id === id);
      if (layerIndex === -1) return;

      const layer = canvasState.layers[layerIndex];
      const newZIndex =
        direction === 'up'
          ? Math.min(layer.zIndex + 1, canvasState.layers.length - 1)
          : Math.max(layer.zIndex - 1, 0);

      if (newZIndex === layer.zIndex) return;

      const newLayers = canvasState.layers.map((l) => {
        if (l.id === id) {
          return { ...l, zIndex: newZIndex };
        }
        if (direction === 'up' && l.zIndex === newZIndex) {
          return { ...l, zIndex: l.zIndex - 1 };
        }
        if (direction === 'down' && l.zIndex === newZIndex) {
          return { ...l, zIndex: l.zIndex + 1 };
        }
        return l;
      });

      const newState = { ...canvasState, layers: newLayers };
      setCanvasState(newState);
      pushToHistory(newState);
    },
    [canvasState, pushToHistory]
  );

  // Toggle visibility
  const toggleVisibility = useCallback(
    (id: string) => {
      const layer = canvasState.layers.find((l) => l.id === id);
      if (layer) {
        updateLayer(id, { visible: !layer.visible });
      }
    },
    [canvasState.layers, updateLayer]
  );

  // Toggle lock
  const toggleLock = useCallback(
    (id: string) => {
      const layer = canvasState.layers.find((l) => l.id === id);
      if (layer) {
        updateLayer(id, { locked: !layer.locked });
      }
    },
    [canvasState.layers, updateLayer]
  );

  // Undo
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex((prev) => prev - 1);
      setCanvasState(history[historyIndex - 1]);
    }
  }, [history, historyIndex]);

  // Redo
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex((prev) => prev + 1);
      setCanvasState(history[historyIndex + 1]);
    }
  }, [history, historyIndex]);

  // Reset canvas
  const resetCanvas = useCallback(() => {
    const newState = createDefaultCanvasState();
    setCanvasState(newState);
    setSelectedLayerId(null);
    setHistory([]);
    setHistoryIndex(-1);
  }, []);

  // Load state
  const loadState = useCallback((state: CanvasState) => {
    // Ensure no duplicate layer IDs
    const seenIds = new Set<string>();
    const uniqueLayers = state.layers.filter((layer) => {
      if (seenIds.has(layer.id)) {
        logger.warn('Duplicate layer ID found and removed:', { layerId: layer.id });
        return false;
      }
      seenIds.add(layer.id);
      return true;
    });

    const sanitizedState = {
      ...state,
      layers: uniqueLayers,
    };

    setCanvasState(sanitizedState);
    setSelectedLayerId(null);
    setHistory([sanitizedState]);
    setHistoryIndex(0);
  }, []);

  return {
    canvasState,
    selectedLayerId,
    selectedLayer,
    setSelectedLayerId,
    addLayer,
    updateLayer,
    deleteLayer,
    moveLayer,
    toggleVisibility,
    toggleLock,
    undo,
    redo,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
    resetCanvas,
    loadState,
  };
};
